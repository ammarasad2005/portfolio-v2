"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Character } from "./character";

/**
 * StartupLoader — a scroll-driven cinematic gate.
 *
 * The user scrolls (wheel / touch / keyboard) to drive a virtual progress
 * value (0-1) that:
 *   - 0.0-0.3: character idle, head tracks mouse, "Scroll to enter" hint
 *   - 0.3-0.7: character rotates right (0→0.7 rad), camera pulls back
 *   - 0.7-1.0: character slides up + out, canvas fades to black
 *   - 1.0: loader unmounts, main portfolio revealed
 *
 * No click-to-enter, no auto-advance. The user must scroll to enter.
 *
 * Inspiration: red1-for-hek.vercel.app's scroll-driven character choreography.
 * Implementation: original procedural character (no proprietary GLB reused).
 *
 * Camera: narrow FOV (22°) for cinematic flatness, high angle looking down.
 * Lights: "lights on" reveal — directional + point + environment fade from 0
 * to full over 1.5s after mount.
 */

const SCROLL_THRESHOLD = 0.995; // progress needed to complete
const LERP_SPEED = 0.08; // how fast actual progress catches up to target

interface StartupLoaderProps {
  onComplete: () => void;
}

export function StartupLoader({ onComplete }: StartupLoaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightsOn, setLightsOn] = useState(false);
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

  // Lock body scroll while loader is visible
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Virtual scroll: wheel / touch / keyboard → accumulate targetProgress
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Normalize: ~1500 units of wheel = full progress
      targetProgress.current = Math.min(1, Math.max(0, targetProgress.current + e.deltaY / 1500));
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      // Normalize: ~500px of touch drag = full progress
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
        // Check completion
        if (next >= SCROLL_THRESHOLD && !completedRef.current) {
          completedRef.current = true;
          // Trigger exit
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

  // "Lights on" reveal after mount
  useEffect(() => {
    const t = setTimeout(() => setLightsOn(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Canvas opacity: fades out when scroll > 0.7
  const canvasOpacity = Math.max(0, 1 - Math.max(0, (scrollProgress - 0.7) / 0.3));

  // Hint visible: lights on + scroll < 0.15
  const hintVisible = lightsOn && scrollProgress < 0.15 && !exiting;

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
          {/* Radial glow behind character (like reference's .character-rim) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-opacity duration-[1500ms]"
            style={{
              opacity: lightsOn ? 0.5 : 0,
              background:
                "radial-gradient(circle at 50% 45%, oklch(0.45 0.12 65 / 0.4) 0%, transparent 50%)",
              filter: "blur(60px)",
            }}
          />

          {/* 3D Canvas */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ opacity: canvasOpacity, transition: "opacity 0.1s linear" }}
          >
            <Canvas
              camera={{ position: [0, 2, 6.5], fov: 22, near: 0.1, far: 100 }}
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

          {/* Fade-to-black overlay during exit (scroll > 0.7) */}
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

// ============ Startup scene ============

interface StartupSceneProps {
  scrollProgress: number;
  lightsOn: boolean;
  isMobile: boolean;
}

function StartupScene({ scrollProgress, lightsOn, isMobile }: StartupSceneProps) {
  const { camera } = useThree();

  // Light refs for "lights on" reveal
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const pointLight2Ref = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  // Light intensity animation state
  const lightIntensity = useRef(0);

  useFrame((_, delta) => {
    // === "Lights on" reveal — lerp intensity 0 → 1 over ~1.5s ===
    const targetIntensity = lightsOn ? 1 : 0;
    lightIntensity.current += (targetIntensity - lightIntensity.current) * delta * 1.2;

    if (dirLightRef.current) {
      dirLightRef.current.intensity = lightIntensity.current * 1.1;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightIntensity.current * 1.8;
    }
    if (pointLight2Ref.current) {
      pointLight2Ref.current.intensity = lightIntensity.current * 1.2;
    }
    if (spotLightRef.current) {
      spotLightRef.current.intensity = lightIntensity.current * 2.5;
    }

    // === Scroll-driven camera pull-back (like reference tl1: z 10→22) ===
    // 0.0-0.7: camera pulls back and rises slightly
    const camProgress = Math.max(0, Math.min(1, scrollProgress / 0.7));
    const targetZ = 6.5 + camProgress * 4.5; // 6.5 → 11
    const targetY = 2 + camProgress * 1.5; // 2 → 3.5
    camera.position.x += (0 - camera.position.x) * delta * 3;
    camera.position.y += (targetY - camera.position.y) * delta * 3;
    camera.position.z += (targetZ - camera.position.z) * delta * 3;
    camera.lookAt(0, -0.3, 0);
  });

  return (
    <>
      <color attach="background" args={["#06060A"]} />
      <fog attach="fog" args={["#06060A", 5, 16]} />

      <ambientLight intensity={0.3} />
      <directionalLight
        ref={dirLightRef}
        position={[5, 8, 5]}
        intensity={0}
        color="#FFE4B5"
      />
      <pointLight
        ref={pointLightRef}
        position={[-6, -4, -4]}
        intensity={0}
        color="#E0A87C"
      />
      <pointLight
        ref={pointLight2Ref}
        position={[6, -2, 6]}
        intensity={0}
        color="#7DD3FC"
      />
      {/* Rim light from behind for character separation */}
      <spotLight
        ref={spotLightRef}
        position={[0, 4, -6]}
        angle={0.6}
        penumbra={1}
        intensity={0}
        color="#E0A87C"
      />

      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.3}>
        <Character scrollProgress={scrollProgress} />
      </Float>

      <ContactShadows
        position={[0, -1.7, 0]}
        opacity={0.4}
        scale={6}
        blur={2.5}
        far={4}
        color="#000000"
      />

      <Environment preset="city" environmentIntensity={lightIntensity.current * 0.6} />

      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />

      {!isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}
