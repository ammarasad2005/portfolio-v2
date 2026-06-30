"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Environment } from "@react-three/drei";
// Postprocessing disabled for now
import { useEffect, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterGLB } from "./character-glb";

/**
 * StartupLoader — a scroll-driven cinematic gate using the actual 3D character
 * model from red1-for-hek, with the exact tracking behavior and lighting setup.
 *
 * Shows on EVERY visit (no sessionStorage gate).
 *
 * Architecture:
 *   - Canvas with reference camera (FOV 14.5°, position [0, 13.1, 24.7], zoom 1.1)
 *   - Reference lighting: purple directional + point + HDR environment
 *   - "Lights on" reveal: intensities fade from 0 to full over 1.5s
 *   - GLB character loads with progress bar, then intro animation plays
 *   - Head bone (spine.006) tracks mouse cursor (max π/6, lerp 0.2/0.1)
 *   - Scroll (wheel/touch/keyboard) drives progress 0→1:
 *     - 0.0-0.1: idle, head tracks mouse, "Scroll to enter" hint
 *     - 0.1-0.3: character rotates right (y 0→0.7), camera pulls back (z 24.7→28)
 *     - 0.3-0.7: character turns to desk (y 0.7→0.92, x 0→0.12), neck tilts,
 *                monitor reveals, screenlight on
 *     - 0.7-1.0: character slides up, scene fades to black
 *     - 1.0: loader unmounts, main portfolio revealed
 */

const SCROLL_THRESHOLD = 0.995;
const LERP_SPEED = 0.08;

interface StartupLoaderProps {
  onComplete: () => void;
}

export function StartupLoader({ onComplete }: StartupLoaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightsOn, setLightsOn] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const targetProgress = useRef(0);
  const completedRef = useRef(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track GLB loading progress via fetch
  useEffect(() => {
    fetch("/models/character.glb")
      .then((response) => {
        if (!response.body) return;
        const reader = response.body.getReader();
        const contentLength = parseInt(response.headers.get("content-length") || "0");
        let received = 0;
        const chunks: Uint8Array[] = [];
        reader.read().then(function process({ done, value }): any {
          if (done) return;
          chunks.push(value);
          received += value.length;
          if (contentLength > 0) {
            setLoadProgress(received / contentLength);
          }
          reader.read().then(process);
        });
      })
      .catch(() => {});
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Virtual scroll: wheel / touch / keyboard
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      targetProgress.current = Math.min(1, Math.max(0, targetProgress.current + e.deltaY / 1500));
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      targetProgress.current = Math.min(1, Math.max(0, targetProgress.current + deltaY / 500));
    };

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        targetProgress.current = Math.min(1, targetProgress.current + 0.08);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        targetProgress.current = Math.max(0, targetProgress.current - 0.08);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Animation loop: lerp actual progress toward target
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setScrollProgress((prev) => {
        const next = prev + (targetProgress.current - prev) * LERP_SPEED;
        if (next >= SCROLL_THRESHOLD && !completedRef.current) {
          completedRef.current = true;
          setTimeout(() => {
            setExiting(true);
            setTimeout(() => onComplete(), 800);
          }, 300);
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  // "Lights on" reveal after model loads
  useEffect(() => {
    if (modelLoaded) {
      const t = setTimeout(() => setLightsOn(true), 200);
      return () => clearTimeout(t);
    }
  }, [modelLoaded]);

  // Canvas opacity: fades out when scroll > 0.7
  const canvasOpacity = Math.max(0, 1 - Math.max(0, (scrollProgress - 0.7) / 0.3));

  // Hint visible: model loaded + lights on + scroll < 0.1
  const hintVisible = modelLoaded && lightsOn && scrollProgress < 0.1 && !exiting;

  // Loading visible: model not yet loaded
  const loadingVisible = !modelLoaded;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100]"
          style={{ background: "#06060A" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          aria-label="Loading portfolio — scroll to enter"
          role="dialog"
          aria-modal="true"
        >
          {/* Radial glow behind character (reference's .character-rim) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]"
            style={{
              opacity: lightsOn ? 0.5 : 0,
              background:
                "radial-gradient(circle at 50% 45%, oklch(0.45 0.18 320 / 0.4) 0%, transparent 50%)",
              filter: "blur(60px)",
            }}
          />

          {/* 3D Canvas — reference camera setup */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ opacity: canvasOpacity, transition: "opacity 0.1s linear" }}
          >
            <Canvas
              camera={{
                position: [0, 8, 12],
                fov: 35,
                near: 0.1,
                far: 1000,
              }}
              onCreated={({ camera }) => {
                camera.lookAt(0, 8, 2);
              }}
              dpr={isMobile ? [1, 1.5] : [1, 2]}
              gl={{
                antialias: !isMobile,
                alpha: true,
                powerPreference: "high-performance",
                stencil: false,
                depth: true,
              }}
              style={{ background: "transparent" }}
            >
              <StartupScene
                scrollProgress={scrollProgress}
                lightsOn={lightsOn}
                isMobile={isMobile}
                onModelLoaded={() => setModelLoaded(true)}
              />
            </Canvas>
          </div>

          {/* Top brand strip */}
          <div className="absolute top-0 inset-x-0 p-6 sm:p-8 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-3">
              <span
                className="display-serif text-2xl text-accent leading-none transition-opacity duration-1000"
                style={{ opacity: lightsOn ? 1 : 0 }}
                aria-hidden="true"
              >
                aa
              </span>
              <div
                className="hidden sm:flex flex-col leading-none transition-opacity duration-1000"
                style={{ opacity: lightsOn ? 1 : 0 }}
              >
                <span className="text-sm font-medium text-foreground">Ammar Asad</span>
                <span className="label-mono text-muted-foreground mt-0.5">Full-Stack Engineer</span>
              </div>
            </div>
            <span
              className="label-mono text-muted-foreground transition-opacity duration-1000"
              style={{ opacity: lightsOn ? 1 : 0 }}
            >
              Scroll to enter
            </span>
          </div>

          {/* Scroll progress bar — right edge, vertical */}
          <div
            aria-hidden="true"
            className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 z-10 h-48 w-px bg-border/40 overflow-hidden"
          >
            <div
              className="absolute bottom-0 inset-x-0 bg-accent transition-[height] duration-100"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Loading state — GLB download progress */}
          <AnimatePresence>
            {loadingVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
              >
                <span className="label-mono text-muted-foreground">Loading character</span>
                <div className="w-64 h-px bg-border/40 overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-200"
                    style={{ width: `${Math.round(loadProgress * 100)}%` }}
                  />
                </div>
                <span className="label-mono text-muted-foreground tabular-nums">
                  {Math.round(loadProgress * 100)}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* "Scroll to enter" hint — bottom center */}
          <AnimatePresence>
            {hintVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
              >
                <span className="display-serif text-2xl sm:text-3xl text-foreground text-center leading-tight">
                  Move your cursor —{" "}
                  <span className="text-accent">he's watching.</span>
                </span>
                <div className="flex flex-col items-center gap-2 mt-2">
                  <span className="label-mono text-muted-foreground">Scroll to enter</span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="h-8 w-px bg-gradient-to-b from-accent to-transparent"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fade-to-black overlay during exit */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-[5] transition-opacity duration-100"
            style={{
              opacity: Math.max(0, (scrollProgress - 0.7) / 0.3),
              background: "#06060A",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ Startup scene — reference lighting setup ============

interface StartupSceneProps {
  scrollProgress: number;
  lightsOn: boolean;
  isMobile: boolean;
  onModelLoaded: () => void;
}

function StartupScene({ scrollProgress, lightsOn, isMobile, onModelLoaded }: StartupSceneProps) {
  const { camera, scene } = useThree();

  // Light refs (reference lighting.ts setup)
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const envIntensity = useRef(0);
  const dirIntensity = useRef(0);

  useFrame((_, delta) => {
    // === "Lights on" reveal ===
    const targetEnv = lightsOn ? 0.64 : 0;
    const targetDir = lightsOn ? 1 : 0;
    envIntensity.current += (targetEnv - envIntensity.current) * delta * 1.2;
    dirIntensity.current += (targetDir - dirIntensity.current) * delta * 1.2;

    if (dirLightRef.current) {
      dirLightRef.current.intensity = dirIntensity.current;
    }
    // Set environment intensity on the scene (safe in three 0.185)
    if (scene) {
      (scene as any).environmentIntensity = envIntensity.current;
    }

    // === Camera setup — match the Canvas camera position ===
    // Canvas camera starts at (0, 8, 12). Scroll drives pull-back.
    const phase1 = Math.max(0, Math.min(1, scrollProgress / 0.3));
    const phase2 = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.4));
    const targetZ = 12 + phase1 * 3 + phase2 * 5;
    const targetY = 8 + phase2 * 2;
    camera.position.x += (0 - camera.position.x) * delta * 3;
    camera.position.y += (targetY - camera.position.y) * delta * 3;
    camera.position.z += (targetZ - camera.position.z) * delta * 3;
    camera.lookAt(0, 8, 2);
  });

  return (
    <>
      <color attach="background" args={["#06060A"]} />
      <fog attach="fog" args={["#06060A", 15, 50]} />

      <ambientLight intensity={0.3} />

      {/* Reference: DirectionalLight (#c7a9ff purple, position [-0.47, -0.32, -1]) */}
      <directionalLight
        ref={dirLightRef}
        position={[-0.47, -0.32, -1]}
        intensity={0}
        color="#c7a9ff"
      />

      {/* Reference: PointLight (#c2a4ff purple, position [3, 12, 4]) */}
      <pointLight
        ref={pointLightRef}
        position={[3, 12, 4]}
        intensity={0}
        color="#c2a4ff"
        distance={100}
        decay={3}
      />

      {/* Additional warm fill light (our accent) */}
      <pointLight position={[-6, -4, -4]} intensity={1.5} color="#E0A87C" />

      <Suspense fallback={null}>
        <CharacterGLB scrollProgress={scrollProgress} onLoaded={onModelLoaded} />
        {/* Reference environment: char_enviorment.hdr for reflections */}
        <Environment files="/models/char_enviorment.hdr" background={false} />
      </Suspense>

      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      {/* Postprocessing disabled — causes rendering issues with GLB model */}
    </>
  );
}
