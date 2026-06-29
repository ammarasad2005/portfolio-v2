"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Character — an original stylized developer figure built from Three.js primitives.
 *
 * Design philosophy:
 *   - Premium low-poly aesthetic (think Bomb Chase / Agentic studio quality)
 *   - Recognizable as a person, not abstract shapes
 *   - Head + eye tracking toward cursor (the headline feature)
 *   - Section-aware: head pose + ambient hue shift per active section
 *   - Subtle idle animations: breathing, blink, micro-movements
 *
 * Composition (rebuilt for proper proportions):
 *   - Head: ~1/7 of body height (standard human ratio)
 *   - Eyes: ~1/5 of head width
 *   - Rounded organic forms (lathe geometry for torso, spheres for joints)
 *   - Developer at a floating desk with a glowing laptop screen
 *
 * All refs are mutated only inside useFrame — never read during render.
 */

const SECTION_POSES: Record<
  string,
  { headY: number; headX: number; headZ: number; typing: boolean }
> = {
  hero: { headY: 0, headX: 0, headZ: 0, typing: true },
  about: { headY: -0.12, headX: 0.08, headZ: 0, typing: false },
  work: { headY: 0.18, headX: -0.02, headZ: 0, typing: true },
  capabilities: { headY: -0.05, headX: -0.1, headZ: 0, typing: false },
  timeline: { headY: -0.22, headX: 0.05, headZ: 0, typing: false },
  notes: { headY: 0.08, headX: 0.18, headZ: 0, typing: true },
  contact: { headY: 0, headX: -0.05, headZ: 0, typing: false },
};

const SECTION_HUES: Record<string, number> = {
  hero: 65,
  about: 45,
  work: 35,
  capabilities: 200,
  timeline: 145,
  notes: 305,
  contact: 65,
};

const MAX_HEAD_ROTATION_Y = Math.PI / 7; // ~25°
const MAX_HEAD_ROTATION_X = Math.PI / 10; // ~18°
const PUPIL_OFFSET = 0.022; // how far pupils can move within iris

const tmpTarget = new THREE.Color();
const tmpHeadTarget = { y: 0, x: 0, z: 0 };

interface CharacterProps {
  activeSection: string;
  scrollProgress: number;
}

export function Character({ activeSection, scrollProgress }: CharacterProps) {
  // Group refs
  const characterGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftEyeGroupRef = useRef<THREE.Group>(null);
  const rightEyeGroupRef = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);
  const screenMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const laptopScreenRef = useRef<THREE.Mesh>(null);

  // Animation state refs (only mutated in useFrame)
  const targetHue = useRef(SECTION_HUES[activeSection] ?? 65);
  const blinkPhase = useRef(0);
  const nextBlinkAt = useRef(2 + Math.random() * 3);
  const blinkTimer = useRef(0);
  const breathingPhase = useRef(0);
  const typingPhase = useRef(0);
  const currentMouse = useRef({ x: 0, y: 0 });
  const screenFlicker = useRef(1);

  // ============ MATERIALS ============

  // Body / clothing — deep charcoal with subtle warmth
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(35 / 360, 0.06, 0.1),
        roughness: 0.7,
        metalness: 0.2,
        flatShading: false,
      }),
    []
  );

  // Skin / face — warm tone
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(30 / 360, 0.25, 0.35),
        roughness: 0.55,
        metalness: 0.1,
        flatShading: false,
      }),
    []
  );

  // Hair — dark warm brown
  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(25 / 360, 0.2, 0.08),
        roughness: 0.8,
        metalness: 0.1,
        flatShading: false,
      }),
    []
  );

  // Eye white
  const eyeWhiteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.96, 0.95, 0.93),
        roughness: 0.25,
        metalness: 0.0,
      }),
    []
  );

  // Iris — amber (will shift with section)
  const irisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(65 / 360, 0.85, 0.5),
        emissive: new THREE.Color().setHSL(65 / 360, 0.9, 0.3),
        emissiveIntensity: 0.6,
        roughness: 0.35,
      }),
    []
  );

  // Pupil — deep dark
  const pupilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.03, 0.025, 0.03),
        roughness: 0.15,
        metalness: 0.4,
      }),
    []
  );

  // Laptop / screen frame — dark aluminum
  const laptopMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(220 / 360, 0.05, 0.18),
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  // Screen content — emissive
  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(65 / 360, 0.4, 0.08),
        emissive: new THREE.Color().setHSL(65 / 360, 0.85, 0.45),
        emissiveIntensity: 1.4,
        roughness: 0.3,
        metalness: 0.1,
      }),
    []
  );

  // Desk surface
  const deskMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(30 / 360, 0.12, 0.1),
        roughness: 0.85,
        metalness: 0.15,
      }),
    []
  );

  // Track mouse via R3F's pointer (already normalized -1 to 1)
  const { pointer } = useThree();

  useFrame((_, delta) => {
    // === Smoothly track mouse position ===
    currentMouse.current.x += (pointer.x - currentMouse.current.x) * delta * 3.5;
    currentMouse.current.y += (pointer.y - currentMouse.current.y) * delta * 3.5;

    // === Section-aware hue interpolation ===
    const goalHue = SECTION_HUES[activeSection] ?? 65;
    let hueDiff = goalHue - targetHue.current;
    if (hueDiff > 180) hueDiff -= 360;
    if (hueDiff < -180) hueDiff += 360;
    targetHue.current = (targetHue.current + hueDiff * delta * 1.5 + 360) % 360;
    tmpTarget.setHSL(targetHue.current / 360, 0.85, 0.5);

    irisMaterial.color.lerp(tmpTarget, delta * 2);
    irisMaterial.emissive.lerp(tmpTarget, delta * 2);
    screenMaterial.emissive.lerp(tmpTarget, delta * 2);

    // === Section-aware head pose + mouse influence ===
    const pose = SECTION_POSES[activeSection] ?? SECTION_POSES.hero;
    const mouseInfluence = window.scrollY < 800 ? 1 : 0.4;
    tmpHeadTarget.y = pose.headY + currentMouse.current.x * MAX_HEAD_ROTATION_Y * mouseInfluence;
    tmpHeadTarget.x = pose.headX + -currentMouse.current.y * MAX_HEAD_ROTATION_X * mouseInfluence;
    tmpHeadTarget.z = pose.headZ;

    if (headGroupRef.current) {
      headGroupRef.current.rotation.y += (tmpHeadTarget.y - headGroupRef.current.rotation.y) * delta * 4;
      headGroupRef.current.rotation.x += (tmpHeadTarget.x - headGroupRef.current.rotation.x) * delta * 4;
      headGroupRef.current.rotation.z += (tmpHeadTarget.z - headGroupRef.current.rotation.z) * delta * 4;
    }

    // === Eye tracking — pupils move toward cursor ===
    const pupilOffsetX = currentMouse.current.x * PUPIL_OFFSET;
    const pupilOffsetY = currentMouse.current.y * PUPIL_OFFSET;
    if (leftPupilRef.current) {
      leftPupilRef.current.position.x += (pupilOffsetX - leftPupilRef.current.position.x) * delta * 6;
      leftPupilRef.current.position.y += (pupilOffsetY - leftPupilRef.current.position.y) * delta * 6;
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x += (pupilOffsetX - rightPupilRef.current.position.x) * delta * 6;
      rightPupilRef.current.position.y += (pupilOffsetY - rightPupilRef.current.position.y) * delta * 6;
    }

    // === Blink animation ===
    blinkTimer.current += delta;
    if (blinkPhase.current === 0 && blinkTimer.current > nextBlinkAt.current) {
      blinkPhase.current = 1;
      blinkTimer.current = 0;
    }
    let eyeScaleY = 1;
    if (blinkPhase.current === 1) {
      const t = blinkTimer.current / 0.07;
      eyeScaleY = Math.max(0.1, 1 - t);
      if (t >= 1) {
        blinkPhase.current = 2;
        blinkTimer.current = 0;
      }
    } else if (blinkPhase.current === 2) {
      const t = blinkTimer.current / 0.1;
      eyeScaleY = Math.max(0.1, 0.1 + t * 0.9);
      if (t >= 1) {
        blinkPhase.current = 0;
        blinkTimer.current = 0;
        nextBlinkAt.current = 3 + Math.random() * 4;
      }
    }
    if (leftEyeGroupRef.current) {
      leftEyeGroupRef.current.scale.y = eyeScaleY;
    }
    if (rightEyeGroupRef.current) {
      rightEyeGroupRef.current.scale.y = eyeScaleY;
    }

    // === Breathing animation ===
    breathingPhase.current += delta * 0.7;
    const breathScale = 1 + Math.sin(breathingPhase.current) * 0.015;
    if (torsoRef.current) {
      torsoRef.current.scale.y = breathScale;
    }

    // === Typing animation ===
    if (pose.typing) {
      typingPhase.current += delta * 5;
      const typingOffsetL = Math.sin(typingPhase.current) * 0.012;
      const typingOffsetR = Math.sin(typingPhase.current + 1.4) * 0.012;
      if (leftHandRef.current) {
        leftHandRef.current.position.z = -0.78 + typingOffsetL;
        leftHandRef.current.position.y = -1.42 + Math.abs(typingOffsetL) * 0.3;
      }
      if (rightHandRef.current) {
        rightHandRef.current.position.z = -0.78 + typingOffsetR;
        rightHandRef.current.position.y = -1.42 + Math.abs(typingOffsetR) * 0.3;
      }
      // Screen flicker while typing
      screenFlicker.current = 1.4 + Math.sin(typingPhase.current * 0.6) * 0.15;
    } else {
      // Ease hands back to rest
      if (leftHandRef.current) {
        leftHandRef.current.position.z += (-0.78 - leftHandRef.current.position.z) * delta * 4;
        leftHandRef.current.position.y += (-1.42 - leftHandRef.current.position.y) * delta * 4;
      }
      if (rightHandRef.current) {
        rightHandRef.current.position.z += (-0.78 - rightHandRef.current.position.z) * delta * 4;
        rightHandRef.current.position.y += (-1.42 - rightHandRef.current.position.y) * delta * 4;
      }
      screenFlicker.current += (1.4 - screenFlicker.current) * delta * 2;
    }
    if (screenMaterialRef.current) {
      screenMaterialRef.current.emissiveIntensity = screenFlicker.current;
    }

    // === Subtle character group float ===
    if (characterGroupRef.current) {
      characterGroupRef.current.position.y =
        -0.2 + Math.sin(breathingPhase.current * 0.5) * 0.025;
      characterGroupRef.current.rotation.y =
        scrollProgress * 0.25 + currentMouse.current.x * 0.04;
    }
  });

  // ============ Torso using LatheGeometry for organic shape ============
  const torsoGeometry = useMemo(() => {
    const points = [
      new THREE.Vector2(0.0, 0.0),     // waist bottom (hidden)
      new THREE.Vector2(0.28, 0.0),
      new THREE.Vector2(0.3, 0.1),
      new THREE.Vector2(0.32, 0.25),   // chest
      new THREE.Vector2(0.34, 0.4),
      new THREE.Vector2(0.32, 0.55),
      new THREE.Vector2(0.28, 0.65),   // shoulder top
      new THREE.Vector2(0.18, 0.7),
    ];
    return new THREE.LatheGeometry(points, 24);
  }, []);

  // Head shape — slightly elongated sphere
  const headGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.22, 24, 18);
    // Slightly elongate vertically
    geo.scale(1, 1.15, 1);
    return geo;
  }, []);

  return (
    <group ref={characterGroupRef} position={[0, -0.2, 0]}>
      {/* === Desk surface === */}
      <mesh position={[0, -1.55, -0.4]} receiveShadow material={deskMaterial}>
        <boxGeometry args={[2.6, 0.06, 1.2]} />
      </mesh>
      {/* Desk front edge accent */}
      <mesh position={[0, -1.52, 0.2]}>
        <boxGeometry args={[2.6, 0.008, 0.008]} />
        <meshBasicMaterial
          color={new THREE.Color().setHSL(65 / 360, 0.8, 0.5)}
          toneMapped={false}
        />
      </mesh>

      {/* === Laptop (closed base + open screen) === */}
      {/* Laptop base (on desk) */}
      <mesh position={[0, -1.49, -0.4]} castShadow material={laptopMaterial}>
        <boxGeometry args={[0.7, 0.025, 0.5]} />
      </mesh>
      {/* Laptop screen (tilted back) */}
      <group position={[0, -1.48, -0.65]} rotation={[-0.25, 0, 0]}>
        {/* Screen back/frame */}
        <mesh position={[0, 0.25, -0.015]} castShadow material={laptopMaterial}>
          <boxGeometry args={[0.7, 0.5, 0.03]} />
        </mesh>
        {/* Screen content (emissive) */}
        <mesh ref={laptopScreenRef} position={[0, 0.25, 0.001]}>
          <planeGeometry args={[0.64, 0.44]} />
          <primitive object={screenMaterial} ref={screenMaterialRef} attach="material" />
        </mesh>
      </group>

      {/* === Torso (lathe geometry, tapered) === */}
      <mesh
        ref={torsoRef}
        position={[0, -1.5, 0]}
        geometry={torsoGeometry}
        castShadow
        receiveShadow
        material={bodyMaterial}
      />

      {/* Shoulder caps (spheres for organic joints) */}
      <mesh position={[-0.36, -0.85, 0]} castShadow material={bodyMaterial}>
        <sphereGeometry args={[0.14, 16, 12]} />
      </mesh>
      <mesh position={[0.36, -0.85, 0]} castShadow material={bodyMaterial}>
        <sphereGeometry args={[0.14, 16, 12]} />
      </mesh>

      {/* === Neck === */}
      <mesh position={[0, -0.7, 0.02]} castShadow material={skinMaterial}>
        <cylinderGeometry args={[0.09, 0.11, 0.16, 12]} />
      </mesh>

      {/* === Head group (rotates with mouse) === */}
      <group ref={headGroupRef} position={[0, -0.55, 0.02]}>
        {/* Head — slightly elongated sphere */}
        <mesh geometry={headGeometry} castShadow material={skinMaterial} />

        {/* Hair — cap on top and back */}
        <mesh position={[0, 0.08, -0.02]} castShadow material={hairMaterial}>
          <sphereGeometry args={[0.235, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        {/* Hair sideburns */}
        <mesh position={[-0.18, -0.02, 0.04]} material={hairMaterial}>
          <boxGeometry args={[0.04, 0.12, 0.1]} />
        </mesh>
        <mesh position={[0.18, -0.02, 0.04]} material={hairMaterial}>
          <boxGeometry args={[0.04, 0.12, 0.1]} />
        </mesh>

        {/* Nose — small geometric protrusion */}
        <mesh position={[0, -0.04, 0.22]} castShadow material={skinMaterial}>
          <coneGeometry args={[0.035, 0.09, 6]} />
        </mesh>

        {/* === Eye sockets (slight indent, darker) === */}
        <mesh position={[-0.085, 0.03, 0.18]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={0x1a1208} roughness={0.7} />
        </mesh>
        <mesh position={[0.085, 0.03, 0.18]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={0x1a1208} roughness={0.7} />
        </mesh>

        {/* === Eyes — white spheres with iris + pupil === */}
        {/* Left eye */}
        <group ref={leftEyeGroupRef} position={[-0.085, 0.03, 0.2]}>
          <mesh material={eyeWhiteMaterial}>
            <sphereGeometry args={[0.045, 16, 12]} />
          </mesh>
          {/* Iris (amber disc facing forward) */}
          <mesh position={[0, 0, 0.035]} material={irisMaterial}>
            <circleGeometry args={[0.03, 20]} />
          </mesh>
          {/* Pupil — moves toward cursor */}
          <mesh ref={leftPupilRef} position={[0, 0, 0.04]} material={pupilMaterial}>
            <circleGeometry args={[0.014, 12]} />
          </mesh>
          {/* Eye highlight */}
          <mesh position={[0.012, 0.015, 0.045]}>
            <circleGeometry args={[0.006, 8]} />
            <meshBasicMaterial color={0xffffff} toneMapped={false} />
          </mesh>
        </group>

        {/* Right eye */}
        <group ref={rightEyeGroupRef} position={[0.085, 0.03, 0.2]}>
          <mesh material={eyeWhiteMaterial}>
            <sphereGeometry args={[0.045, 16, 12]} />
          </mesh>
          <mesh position={[0, 0, 0.035]} material={irisMaterial}>
            <circleGeometry args={[0.03, 20]} />
          </mesh>
          <mesh ref={rightPupilRef} position={[0, 0, 0.04]} material={pupilMaterial}>
            <circleGeometry args={[0.014, 12]} />
          </mesh>
          <mesh position={[0.012, 0.015, 0.045]}>
            <circleGeometry args={[0.006, 8]} />
            <meshBasicMaterial color={0xffffff} toneMapped={false} />
          </mesh>
        </group>

        {/* Eyebrows — subtle, above eyes */}
        <mesh position={[-0.085, 0.1, 0.2]} rotation={[0, 0, -0.05]} material={hairMaterial}>
          <boxGeometry args={[0.08, 0.014, 0.025]} />
        </mesh>
        <mesh position={[0.085, 0.1, 0.2]} rotation={[0, 0, 0.05]} material={hairMaterial}>
          <boxGeometry args={[0.08, 0.014, 0.025]} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.22, -0.02, 0]} castShadow material={skinMaterial}>
          <sphereGeometry args={[0.04, 12, 8]} />
        </mesh>
        <mesh position={[0.22, -0.02, 0]} castShadow material={skinMaterial}>
          <sphereGeometry args={[0.04, 12, 8]} />
        </mesh>

        {/* Mouth — subtle line */}
        <mesh position={[0, -0.13, 0.21]}>
          <boxGeometry args={[0.06, 0.008, 0.01]} />
          <meshStandardMaterial color={0x2a1a0a} roughness={0.8} />
        </mesh>
      </group>

      {/* === Arms — upper arm + forearm + hand === */}
      {/* Left arm */}
      <group position={[-0.36, -0.85, 0]}>
        {/* Upper arm */}
        <mesh position={[-0.05, -0.2, 0.05]} rotation={[0.3, 0, 0.15]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.1, -0.45, 0.18]} rotation={[0.9, 0, 0.1]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.28, 8, 12]} />
        </mesh>
        {/* Hand */}
        <mesh ref={leftHandRef} position={[-0.12, -0.65, -0.78]} castShadow material={skinMaterial}>
          <boxGeometry args={[0.1, 0.05, 0.13]} />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.36, -0.85, 0]}>
        {/* Upper arm */}
        <mesh position={[0.05, -0.2, 0.05]} rotation={[0.3, 0, -0.15]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.1, -0.45, 0.18]} rotation={[0.9, 0, -0.1]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.28, 8, 12]} />
        </mesh>
        {/* Hand */}
        <mesh ref={rightHandRef} position={[0.12, -0.65, -0.78]} castShadow material={skinMaterial}>
          <boxGeometry args={[0.1, 0.05, 0.13]} />
        </mesh>
      </group>
    </group>
  );
}
