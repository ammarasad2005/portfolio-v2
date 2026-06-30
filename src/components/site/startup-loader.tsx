"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Environment, ContactShadows } from "@react-three/drei";
import { useEffect, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "./avatar";
import { personalInfo } from "@/data/personal";

/**
 * StartupLoader — the user's own 3D avatar waves to the viewer while a brief
 * intro text appears beside it. The viewer scrolls (slowly) to transition
 * into the main portfolio.
 *
 * Layout:
 *   - Left side: 3D avatar waving
 *   - Right side: intro text (name, role, one-liner)
 *   - Bottom: "Scroll to enter" hint + vertical progress bar
 *
 * Scroll (SLOW — requires more scroll to progress):
 *   - Wheel: deltaY / 4000 per event (~4000 units = full progress)
 *   - Touch: deltaY / 1200 per move (~1200px drag = full progress)
 *   - Keyboard: ArrowDown/PageDown/Space = +4%, ArrowUp/PageUp = -4%
 *
 * Transition phases:
 *   - 0.0-0.5: avatar waves, intro text visible, hint shows
 *   - 0.5-0.7: intro text fades out, avatar starts to sink
 *   - 0.7-1.0: avatar sinks down, scene fades to black
 *   - 1.0: loader unmounts, main portfolio revealed
 *
 * Shows on EVERY visit.
 */

const SCROLL_THRESHOLD = 0.995;
const LERP_SPEED = 0.12; // higher = faster catch-up = smoother continuous feel
const WHEEL_DIVISOR = 1800; // continuous accumulation (no stepping)
const TOUCH_DIVISOR = 600;
const KEYBOARD_STEP = 0.08;

interface StartupLoaderProps {
  onComplete: () => void;
}

export function StartupLoader({ onComplete }: StartupLoaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
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
    fetch("/models/avatar-anim.glb")
      .then((response) => {
        if (!response.body) return;
        const reader = response.body.getReader();
        const contentLength = parseInt(response.headers.get("content-length") || "0");
        let received = 0;
        reader.read().then(function process({ done, value }): any {
          if (done) return;
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

  // Virtual scroll — SLOW (high divisors)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      targetProgress.current = Math.min(1, Math.max(0, targetProgress.current + e.deltaY / WHEEL_DIVISOR));
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      targetProgress.current = Math.min(1, Math.max(0, targetProgress.current + deltaY / TOUCH_DIVISOR));
    };

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        targetProgress.current = Math.min(1, targetProgress.current + KEYBOARD_STEP);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        targetProgress.current = Math.max(0, targetProgress.current - KEYBOARD_STEP);
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

  // Canvas opacity: fades out when scroll > 0.7
  const canvasOpacity = Math.max(0, 1 - Math.max(0, (scrollProgress - 0.7) / 0.3));

  // Intro text opacity: visible 0-0.5, fades 0.5-0.7
  const textOpacity = Math.max(0, 1 - Math.max(0, (scrollProgress - 0.5) / 0.2));

  // Hint visible: model loaded + scroll < 0.3
  const hintVisible = modelLoaded && scrollProgress < 0.3 && !exiting;

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
          aria-label="Welcome — scroll to enter portfolio"
          role="dialog"
          aria-modal="true"
        >
          {/* Radial glow behind avatar */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]"
            style={{
              opacity: modelLoaded ? 0.4 : 0,
              background:
                "radial-gradient(circle at 30% 50%, oklch(0.45 0.12 65 / 0.35) 0%, transparent 50%)",
              filter: "blur(60px)",
            }}
          />

          {/* Split layout: avatar left, intro text right */}
          <div className="absolute inset-0 flex items-center">
            {/* Left: 3D Canvas */}
            <div
              className="absolute inset-0 lg:left-0 lg:right-1/2"
              aria-hidden="true"
              style={{ opacity: canvasOpacity, transition: "opacity 0.1s linear" }}
            >
              <Canvas
                camera={{ position: [0, 0.5, 4.5], fov: 35, near: 0.1, far: 100 }}
                onCreated={({ camera }) => {
                  // Avatar is Y[-1, 1.85], center at Y=0.42 — look at chest/face area
                  camera.lookAt(0, 0.5, 0);
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
                <AvatarScene
                  scrollProgress={scrollProgress}
                  isMobile={isMobile}
                  onModelLoaded={() => setModelLoaded(true)}
                />
              </Canvas>
            </div>

            {/* Right: Intro text (desktop only — mobile shows text below) */}
            <div
              className="relative z-10 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 flex items-center justify-center lg:justify-start lg:pl-8"
              style={{ opacity: textOpacity, transition: "opacity 0.3s ease" }}
            >
              <div className="px-6 sm:px-8 lg:px-12 max-w-lg">
                <AnimatePresence>
                  {modelLoaded && (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    >
                      {/* Greeting */}
                      <p className="label-mono text-accent mb-4">
                        Hello there —
                      </p>

                      {/* Name */}
                      <h1 className="display-serif text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.95] mb-4">
                        {personalInfo.shortName}
                      </h1>

                      {/* Role */}
                      <p className="text-xl sm:text-2xl text-foreground font-medium mb-6">
                        {personalInfo.role}
                      </p>

                      {/* Brief intro */}
                      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                        {personalInfo.valueProp}
                      </p>

                      {/* Stats row */}
                      <div className="flex flex-wrap gap-6 mb-8">
                        {personalInfo.stats.slice(0, 3).map((stat) => (
                          <div key={stat.label}>
                            <div className="text-lg font-medium text-foreground tabular-nums">
                              {stat.value}
                            </div>
                            <div className="label-mono text-muted-foreground mt-0.5">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Top brand strip */}
          <div className="absolute top-0 inset-x-0 p-6 sm:p-8 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-3">
              <span
                className="display-serif text-2xl text-accent leading-none transition-opacity duration-1000"
                style={{ opacity: modelLoaded ? 1 : 0 }}
                aria-hidden="true"
              >
                {personalInfo.initials}
              </span>
            </div>
            <span
              className="label-mono text-muted-foreground transition-opacity duration-1000"
              style={{ opacity: modelLoaded ? 1 : 0 }}
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
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6"
              >
                <span className="label-mono text-muted-foreground">Loading avatar</span>
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
                className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
              >
                <span className="label-mono text-muted-foreground">Scroll to enter</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="h-8 w-px bg-gradient-to-b from-accent to-transparent"
                />
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

// ============ Avatar Scene ============

interface AvatarSceneProps {
  scrollProgress: number;
  isMobile: boolean;
  onModelLoaded: () => void;
}

function AvatarScene({ scrollProgress, isMobile, onModelLoaded }: AvatarSceneProps) {
  const { scene } = useThree();

  // Lighting refs
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);
  const lightIntensity = useRef(0);

  useFrame((_, delta) => {
    // "Lights on" reveal
    const target = 1;
    lightIntensity.current += (target - lightIntensity.current) * delta * 1.2;

    if (keyLightRef.current) keyLightRef.current.intensity = lightIntensity.current * 1.5;
    if (fillLightRef.current) fillLightRef.current.intensity = lightIntensity.current * 0.8;
    if (rimLightRef.current) rimLightRef.current.intensity = lightIntensity.current * 2;

    // Environment intensity
    if (scene) {
      (scene as any).environmentIntensity = lightIntensity.current * 0.5;
    }
  });

  return (
    <>
      <color attach="background" args={["#06060A"]} />
      <fog attach="fog" args={["#06060A", 4, 12]} />

      <ambientLight intensity={0.4} />

      {/* Key light — warm, from front-left */}
      <directionalLight
        ref={keyLightRef}
        position={[3, 4, 5]}
        intensity={0}
        color="#FFE4B5"
      />

      {/* Fill light — amber accent */}
      <pointLight
        ref={fillLightRef}
        position={[-3, 1, 2]}
        intensity={0}
        color="#E0A87C"
        distance={10}
      />

      {/* Rim light — from behind for separation */}
      <spotLight
        ref={rimLightRef}
        position={[-2, 3, -4]}
        angle={0.6}
        penumbra={1}
        intensity={0}
        color="#E0A87C"
      />

      <Suspense fallback={null}>
        <Avatar scrollProgress={scrollProgress} onLoaded={onModelLoaded} />
        <Environment preset="studio" background={false} />
      </Suspense>

      {/* Contact shadow under avatar */}
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.5}
        scale={4}
        blur={2}
        far={3}
        color="#000000"
      />

      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
    </>
  );
}
