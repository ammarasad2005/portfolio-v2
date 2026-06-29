"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  TorusKnot,
  Environment,
  Sparkles,
  AdaptiveDpr,
  AdaptiveEvents,
  ContactShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { useRef, useMemo, Suspense } from "react";
import { Character } from "./character";

/**
 * Scene3D — the section-aware hero 3D scene.
 *
 * Concept: an original stylized developer character (built from primitives)
 * sitting at a floating desk, with head + eye tracking that follows the
 * cursor. Surrounded by orbiting wireframe shapes and a particle field.
 * The hue of the iris, screen, and ambient accents shifts per active section.
 *
 * Inspired by red1-for-hek's portfolio concept (developer figure with head
 * tracking) but built from scratch with original geometry — no proprietary
 * GLB reused.
 *
 * Performance:
 * - Character is procedural geometry (no GLB download, no DRACO decoder)
 * - AdaptiveDpr + AdaptiveEvents scale resolution under load
 * - Postprocessing is skipped on mobile (see Scene3DCanvas)
 * - The whole canvas is dynamically imported with ssr:false (parent)
 *
 * Implementation note: all refs are mutated only inside useFrame callbacks,
 * never read during render — keeps React 19's strict ref semantics happy.
 */

const SECTION_HUES: Record<string, number> = {
  hero: 65, // amber
  about: 45, // copper
  work: 35, // orange
  capabilities: 200, // teal
  timeline: 145, // green
  notes: 305, // magenta
  contact: 65, // amber (bookend)
};

const tmpTarget = new THREE.Color();

interface SceneProps {
  activeSection: string;
  scrollProgress: number;
  enablePostprocessing: boolean;
}

/** Orbiting wireframe shapes — depth and motion without heavy geometry */
function OrbitingShapes({ activeSection }: { activeSection: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const knot1Ref = useRef<THREE.Mesh>(null);
  const knot2Ref = useRef<THREE.Mesh>(null);
  const mat1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const mat2Ref = useRef<THREE.MeshStandardMaterial>(null);
  const targetHue = useRef(SECTION_HUES[activeSection] ?? 65);

  useFrame((_, delta) => {
    const goal = SECTION_HUES[activeSection] ?? 65;
    let diff = goal - targetHue.current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    targetHue.current = (targetHue.current + diff * delta * 1.5 + 360) % 360;
    tmpTarget.setHSL(targetHue.current / 360, 0.6, 0.55);

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
    if (knot1Ref.current) {
      knot1Ref.current.rotation.x += delta * 0.2;
      knot1Ref.current.rotation.z += delta * 0.15;
    }
    if (mat1Ref.current) {
      mat1Ref.current.color.lerp(tmpTarget, delta * 1.5);
    }
    if (knot2Ref.current) {
      knot2Ref.current.rotation.y -= delta * 0.3;
    }
    if (mat2Ref.current) {
      mat2Ref.current.color.lerp(tmpTarget, delta * 1.5);
    }
  });

  return (
    <group ref={groupRef}>
      <TorusKnot ref={knot1Ref as any} args={[3.2, 0.025, 200, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          ref={mat1Ref}
          color="#E0A87C"
          emissive="#E0A87C"
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </TorusKnot>
      <TorusKnot
        ref={knot2Ref as any}
        args={[4.0, 0.018, 200, 16]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 3, 0, 0]}
      >
        <meshStandardMaterial
          ref={mat2Ref}
          color="#E0A87C"
          emissive="#E0A87C"
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.6}
        />
      </TorusKnot>
    </group>
  );
}

/** Soft floating particle field */
function ParticleField() {
  return (
    <Sparkles
      count={100}
      scale={[14, 8, 6]}
      size={2}
      speed={0.25}
      opacity={0.45}
      color="#E0A87C"
    />
  );
}

/** Mouse parallax — camera nudges based on pointer position.
 *  Mutating camera.position imperatively is the canonical R3F pattern. */
function MouseParallax() {
  const { camera, pointer } = useThree();
  useFrame((_, delta) => {
    // Smaller, subtler parallax — character should stay roughly centered
    const targetX = pointer.y * 0.08;
    const targetY = -pointer.x * 0.12;
    camera.position.x += (targetY - camera.position.x) * delta * 2;
    camera.position.y += (targetX - camera.position.y) * delta * 2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ activeSection, scrollProgress, enablePostprocessing }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#06060A"]} />
      <fog attach="fog" args={["#06060A", 6, 16]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} color="#FFE4B5" />
      <pointLight position={[-6, -4, -4]} intensity={1.8} color="#E0A87C" />
      <pointLight position={[6, -2, 6]} intensity={1.2} color="#7DD3FC" />
      {/* Rim light from behind for character separation */}
      <spotLight
        position={[0, 4, -6]}
        angle={0.6}
        penumbra={1}
        intensity={2.5}
        color="#E0A87C"
      />

      <Suspense fallback={null}>
        {/* Character is the focal point */}
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Character activeSection={activeSection} scrollProgress={scrollProgress} />
        </Float>

        {/* Ambient orbiting wireframes + particles */}
        <OrbitingShapes activeSection={activeSection} />
        <ParticleField />

        {/* Soft contact shadow under character */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* Environment for transmission material reflections */}
        <Environment preset="city" />
      </Suspense>

      <MouseParallax />

      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />

      {enablePostprocessing && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={0.65} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}

interface Scene3DCanvasProps {
  activeSection: string;
  scrollProgress: number;
  isMobile: boolean;
}

export default function Scene3DCanvas({ activeSection, scrollProgress, isMobile }: Scene3DCanvasProps) {
  const dpr = useMemo(() => (isMobile ? [1, 1.5] : [1, 2]), [isMobile]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={dpr}
      gl={{
        antialias: !isMobile,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      style={{ background: "transparent" }}
    >
      <Scene
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        enablePostprocessing={!isMobile}
      />
    </Canvas>
  );
}
