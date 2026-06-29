"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  TorusKnot,
  Environment,
  MeshTransmissionMaterial,
  Sparkles,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { useRef, useMemo, Suspense } from "react";

/**
 * Scene3D — the section-aware hero 3D scene.
 *
 * Concept: an abstract "engineer's monolith" — a slowly rotating crystalline
 * icosahedron with a transmission-style material, surrounded by orbiting
 * wireframe shapes and a particle field. The hue shifts based on the active
 * section, and the rotation subtly accelerates with scroll progress.
 *
 * Performance:
 * - AdaptiveDpr + AdaptiveEvents scale resolution under load.
 * - Postprocessing is skipped on mobile (see Scene3DCanvas).
 * - The whole canvas is dynamically imported with ssr:false (parent).
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

const tmpColor = new THREE.Color();
const tmpTarget = new THREE.Color();

interface SceneProps {
  activeSection: string;
  scrollProgress: number;
  enablePostprocessing: boolean;
}

/** Main crystalline monolith — icosahedron with transmission material */
function Monolith({ activeSection, scrollProgress }: { activeSection: string; scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const innerMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const targetHue = useRef(SECTION_HUES[activeSection] ?? 65);

  useFrame((_, delta) => {
    const goal = SECTION_HUES[activeSection] ?? 65;
    // Smoothly interpolate hue toward the active section's hue
    let diff = goal - targetHue.current;
    // Shortest path around the wheel
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    targetHue.current = (targetHue.current + diff * delta * 2 + 360) % 360;

    tmpTarget.setHSL(targetHue.current / 360, 0.7, 0.6);

    if (meshRef.current) {
      // Subtle continuous rotation + scroll-driven acceleration
      meshRef.current.rotation.y += delta * 0.15 + scrollProgress * 0.002;
      meshRef.current.rotation.x += delta * 0.05;
      // Scroll-driven vertical tilt
      meshRef.current.rotation.z = scrollProgress * 0.3;
    }

    if (materialRef.current) {
      materialRef.current.color.lerp(tmpTarget, delta * 2);
    }
    if (innerMaterialRef.current) {
      innerMaterialRef.current.color.lerp(tmpTarget, delta * 2);
    }
  });

  return (
    <group>
      <Icosahedron ref={meshRef as any} args={[1.4, 0]}>
        <MeshTransmissionMaterial
          ref={materialRef}
          color={tmpColor.copy(tmpTarget).setHSL(SECTION_HUES[activeSection] / 360, 0.7, 0.6)}
          thickness={1.2}
          roughness={0.08}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.06}
          backside
          backsideThickness={0.4}
          samples={6}
          resolution={256}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.1}
        />
      </Icosahedron>

      {/* Inner glow core */}
      <Icosahedron ref={innerRef as any} args={[0.65, 0]}>
        <meshBasicMaterial
          ref={innerMaterialRef}
          color={tmpColor.copy(tmpTarget).setHSL(SECTION_HUES[activeSection] / 360, 0.7, 0.6)}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </Icosahedron>
    </group>
  );
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
      groupRef.current.rotation.y += delta * 0.08;
    }
    if (knot1Ref.current) {
      knot1Ref.current.rotation.x += delta * 0.3;
      knot1Ref.current.rotation.z += delta * 0.2;
    }
    if (mat1Ref.current) {
      mat1Ref.current.color.lerp(tmpTarget, delta * 1.5);
    }
    if (knot2Ref.current) {
      knot2Ref.current.rotation.y -= delta * 0.4;
    }
    if (mat2Ref.current) {
      mat2Ref.current.color.lerp(tmpTarget, delta * 1.5);
    }
  });

  return (
    <group ref={groupRef}>
      <TorusKnot ref={knot1Ref as any} args={[2.6, 0.04, 200, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          ref={mat1Ref}
          color="#E0A87C"
          emissive="#E0A87C"
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.6}
        />
      </TorusKnot>
      <TorusKnot
        ref={knot2Ref as any}
        args={[3.4, 0.025, 200, 16]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 3, 0, 0]}
      >
        <meshStandardMaterial
          ref={mat2Ref}
          color="#E0A87C"
          emissive="#E0A87C"
          emissiveIntensity={0.25}
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
      count={120}
      scale={[12, 8, 6]}
      size={2}
      speed={0.3}
      opacity={0.5}
      color="#E0A87C"
    />
  );
}

/** Mouse parallax — camera nudges based on pointer position.
 *  Mutating camera.position imperatively is the canonical R3F pattern. */
function MouseParallax() {
  const { camera, pointer } = useThree();
  useFrame((_, delta) => {
    const targetX = pointer.y * 0.3;
    const targetY = -pointer.x * 0.5;
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
      <fog attach="fog" args={["#06060A", 5, 14]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#FFE4B5" />
      <pointLight position={[-6, -4, -4]} intensity={2} color="#E0A87C" />
      <pointLight position={[6, -2, 6]} intensity={1.5} color="#7DD3FC" />

      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <Monolith activeSection={activeSection} scrollProgress={scrollProgress} />
        </Float>
        <OrbitingShapes activeSection={activeSection} />
        <ParticleField />

        {/* Environment for transmission material reflections */}
        <Environment preset="city" />
      </Suspense>

      <MouseParallax />

      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />

      {enablePostprocessing && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.2}
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
      camera={{ position: [0, 0, 6], fov: 45 }}
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
