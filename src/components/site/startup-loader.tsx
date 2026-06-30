"use client";

import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Character } from "./character";

/**
 * StartupLoader — a pre-render gate containing a 3D developer character whose
 * head and eyes track the mouse cursor in real-time. Auto-advances after a
 * short load sequence, and also supports click-to-enter.
 *
 * Inspiration: red1-for-hek.vercel.app's developer figure concept.
 *
 * UX:
 *   - 0–1.2s: character + scene fade in, loading bar progresses
 *   - 1.2–2.4s: "Click to enter" prompt appears (or auto-advance at 3.5s)
 *   - On click (or auto): loader fades out, calls onComplete
 *   - sessionStorage ensures it only shows on first visit per session
 *
 * Performance: same mobile/reduced-motion fallbacks as the main scene.
 */

const AUTO_ADVANCE_MS = 4500;
const LOADING_DURATION_MS = 1500;

interface StartupLoaderProps {
  onComplete: () => void;
}

export function StartupLoader({ onComplete }: StartupLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // Detect mobile
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Loading progress
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / LOADING_DURATION_MS) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setReady(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-advance after ready + short delay
  useEffect(() => {
    if (!ready || exiting) return;
    const t = setTimeout(() => handleEnter(), AUTO_ADVANCE_MS - LOADING_DURATION_MS);
    return () => clearTimeout(t);
  }, [ready, exiting]);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    // Wait for fade-out animation, then notify parent
    setTimeout(() => onComplete(), 900);
  };

  // Allow immediate click-to-enter once ready
  // (also allow keyboard Enter/Space)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && ready && !exiting) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, exiting]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          aria-label="Loading portfolio"
          role="dialog"
          aria-modal="true"
        >
          {/* 3D Canvas — full screen, character centered */}
          <div className="absolute inset-0" aria-hidden="true">
            {!reducedMotion && (
              <Canvas
                camera={{ position: [0, 0, 4.5], fov: 45 }}
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
                <StartupScene isMobile={isMobile} />
              </Canvas>
            )}
          </div>

          {/* Gradient mask for legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/60 via-transparent to-background/80"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-background/40 to-transparent"
          />

          {/* Top brand strip */}
          <div className="absolute top-0 inset-x-0 p-6 sm:p-8 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-3">
              <span className="display-serif text-2xl text-accent leading-none" aria-hidden="true">
                aa
              </span>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-sm font-medium text-foreground">Ammar Asad</span>
                <span className="label-mono text-muted-foreground mt-0.5">Full-Stack Engineer</span>
              </div>
            </div>
            <span className="label-mono text-muted-foreground">
              Loading portfolio
            </span>
          </div>

          {/* Bottom UI — progress bar + click-to-enter */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 z-10">
            <div className="max-w-3xl mx-auto">
              {/* Hint text — appears once ready */}
              <AnimatePresence>
                {ready && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-8"
                  >
                    <button
                      onClick={handleEnter}
                      className="group inline-flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 rounded-lg p-2"
                      aria-label="Enter portfolio"
                    >
                      <span className="display-serif text-3xl sm:text-4xl text-foreground leading-tight">
                        Move your cursor —{" "}
                        <span className="text-accent">he's watching.</span>
                      </span>
                      <span className="label-mono text-muted-foreground mt-2 inline-flex items-center gap-2 group-hover:text-accent transition-colors">
                        <span>Click anywhere to enter</span>
                        <span className="inline-block w-6 h-px bg-current" />
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress bar (only while loading) */}
              <AnimatePresence>
                {!ready && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1 h-px bg-border/60 overflow-hidden relative">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="label-mono text-muted-foreground tabular-nums w-12 text-right">
                      {Math.round(progress)}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Click overlay — anywhere on the loader triggers enter when ready */}
          {ready && (
            <button
              onClick={handleEnter}
              className="absolute inset-0 z-[5] cursor-pointer bg-transparent"
              aria-label="Enter portfolio"
              tabIndex={-1}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ Startup scene ============

function StartupScene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <color attach="background" args={["#06060A"]} />
      <fog attach="fog" args={["#06060A", 5, 14]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#FFE4B5" />
      <pointLight position={[-6, -4, -4]} intensity={1.8} color="#E0A87C" />
      <pointLight position={[6, -2, 6]} intensity={1.2} color="#7DD3FC" />
      {/* Rim light from behind */}
      <spotLight
        position={[0, 4, -6]}
        angle={0.6}
        penumbra={1}
        intensity={2.5}
        color="#E0A87C"
      />

      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.3}>
        <Character />
      </Float>

      <ContactShadows
        position={[0, -1.7, 0]}
        opacity={0.4}
        scale={6}
        blur={2.5}
        far={4}
        color="#000000"
      />

      <Environment preset="city" />

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

// ============ Reduced motion hook (local copy to avoid import cycle) ============
function usePrefersReducedMotion() {
  const QUERY = "(prefers-reduced-motion: reduce)";
  const subscribe = (cb: () => void) => {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  const getSnapshot = () => window.matchMedia(QUERY).matches;
  const getServerSnapshot = () => false;
  // useSyncExternalStore via useState + useEffect
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
