"use client";

import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Character — an original stylized developer figure built from Three.js primitives.
 *
 * Designed for the StartupLoader — a standalone full-screen 3D experience
 * that gates entry into the main portfolio. The character is the focal point:
 * head and pupils track the mouse cursor in real-time, breathing + blinking
 * idle animations run continuously, and a subtle typing animation plays on
 * the laptop screen.
 *
 * Inspiration: red1-for-hek.vercel.app's developer figure concept.
 * Implementation: original Three.js primitives (no proprietary GLB reused).
 *
 * All refs are mutated only inside useFrame — never read during render.
 */

const MAX_HEAD_ROTATION_Y = Math.PI / 5; // ~36° — generous, this is the headline feature
const MAX_HEAD_ROTATION_X = Math.PI / 7; // ~25°
const PUPIL_OFFSET = 0.03; // generous pupil travel
const IRIS_RADIUS = 0.034;

export function Character() {
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

  // Animation state refs (only mutated in useFrame)
  const blinkPhase = useRef(0);
  const nextBlinkAt = useRef(2 + Math.random() * 3);
  const blinkTimer = useRef(0);
  const breathingPhase = useRef(0);
  const typingPhase = useRef(0);
  const currentMouse = useRef({ x: 0, y: 0 });
  const screenFlicker = useRef(1.4);

  // ============ MATERIALS ============
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(35 / 360, 0.06, 0.1),
        roughness: 0.7,
        metalness: 0.2,
      }),
    []
  );

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(30 / 360, 0.25, 0.35),
        roughness: 0.55,
        metalness: 0.1,
      }),
    []
  );

  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(25 / 360, 0.2, 0.08),
        roughness: 0.8,
        metalness: 0.1,
      }),
    []
  );

  const eyeWhiteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.96, 0.95, 0.93),
        roughness: 0.25,
        metalness: 0.0,
      }),
    []
  );

  const irisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(65 / 360, 0.85, 0.5),
        emissive: new THREE.Color().setHSL(65 / 360, 0.9, 0.3),
        emissiveIntensity: 0.7,
        roughness: 0.35,
      }),
    []
  );

  const pupilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.03, 0.025, 0.03),
        roughness: 0.15,
        metalness: 0.4,
      }),
    []
  );

  const laptopMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(220 / 360, 0.05, 0.18),
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

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

  const deskMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(30 / 360, 0.12, 0.1),
        roughness: 0.85,
        metalness: 0.15,
      }),
    []
  );

  const { pointer } = useThree();

  // ============ Torso using LatheGeometry for organic shape ============
  const torsoGeometry = useMemo(() => {
    const points = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.28, 0.0),
      new THREE.Vector2(0.3, 0.1),
      new THREE.Vector2(0.32, 0.25),
      new THREE.Vector2(0.34, 0.4),
      new THREE.Vector2(0.32, 0.55),
      new THREE.Vector2(0.28, 0.65),
      new THREE.Vector2(0.18, 0.7),
    ];
    return new THREE.LatheGeometry(points, 24);
  }, []);

  const headGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.22, 24, 18);
    geo.scale(1, 1.15, 1);
    return geo;
  }, []);

  useFrame((_, delta) => {
    // === Mouse tracking — smooth interpolation toward pointer ===
    // Higher lerp factor for snappier, more responsive tracking
    currentMouse.current.x += (pointer.x - currentMouse.current.x) * delta * 5;
    currentMouse.current.y += (pointer.y - currentMouse.current.y) * delta * 5;

    // === Head rotation — tracks mouse with generous range ===
    if (headGroupRef.current) {
      const targetY = currentMouse.current.x * MAX_HEAD_ROTATION_Y;
      const targetX = -currentMouse.current.y * MAX_HEAD_ROTATION_X;
      headGroupRef.current.rotation.y += (targetY - headGroupRef.current.rotation.y) * delta * 5;
      headGroupRef.current.rotation.x += (targetX - headGroupRef.current.rotation.x) * delta * 5;
    }

    // === Pupil tracking — moves within iris toward cursor ===
    const pupilOffsetX = currentMouse.current.x * PUPIL_OFFSET;
    const pupilOffsetY = currentMouse.current.y * PUPIL_OFFSET;
    if (leftPupilRef.current) {
      leftPupilRef.current.position.x += (pupilOffsetX - leftPupilRef.current.position.x) * delta * 8;
      leftPupilRef.current.position.y += (pupilOffsetY - leftPupilRef.current.position.y) * delta * 8;
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x += (pupilOffsetX - rightPupilRef.current.position.x) * delta * 8;
      rightPupilRef.current.position.y += (pupilOffsetY - rightPupilRef.current.position.y) * delta * 8;
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
    screenFlicker.current = 1.4 + Math.sin(typingPhase.current * 0.6) * 0.15;
    if (screenMaterialRef.current) {
      screenMaterialRef.current.emissiveIntensity = screenFlicker.current;
    }

    // === Subtle character group float ===
    if (characterGroupRef.current) {
      characterGroupRef.current.position.y =
        -0.2 + Math.sin(breathingPhase.current * 0.5) * 0.025;
    }
  });

  return (
    <group ref={characterGroupRef} position={[0, -0.2, 0]}>
      {/* === Desk surface === */}
      <mesh position={[0, -1.55, -0.4]} receiveShadow material={deskMaterial}>
        <boxGeometry args={[2.6, 0.06, 1.2]} />
      </mesh>
      <mesh position={[0, -1.52, 0.2]}>
        <boxGeometry args={[2.6, 0.008, 0.008]} />
        <meshBasicMaterial
          color={new THREE.Color().setHSL(65 / 360, 0.8, 0.5)}
          toneMapped={false}
        />
      </mesh>

      {/* === Laptop === */}
      <mesh position={[0, -1.49, -0.4]} castShadow material={laptopMaterial}>
        <boxGeometry args={[0.7, 0.025, 0.5]} />
      </mesh>
      <group position={[0, -1.48, -0.65]} rotation={[-0.25, 0, 0]}>
        <mesh position={[0, 0.25, -0.015]} castShadow material={laptopMaterial}>
          <boxGeometry args={[0.7, 0.5, 0.03]} />
        </mesh>
        <mesh position={[0, 0.25, 0.001]}>
          <planeGeometry args={[0.64, 0.44]} />
          <primitive object={screenMaterial} ref={screenMaterialRef} attach="material" />
        </mesh>
      </group>

      {/* === Torso === */}
      <mesh
        ref={torsoRef}
        position={[0, -1.5, 0]}
        geometry={torsoGeometry}
        castShadow
        receiveShadow
        material={bodyMaterial}
      />

      {/* Shoulder caps */}
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
        <mesh geometry={headGeometry} castShadow material={skinMaterial} />

        {/* Hair */}
        <mesh position={[0, 0.08, -0.02]} castShadow material={hairMaterial}>
          <sphereGeometry args={[0.235, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        <mesh position={[-0.18, -0.02, 0.04]} material={hairMaterial}>
          <boxGeometry args={[0.04, 0.12, 0.1]} />
        </mesh>
        <mesh position={[0.18, -0.02, 0.04]} material={hairMaterial}>
          <boxGeometry args={[0.04, 0.12, 0.1]} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.04, 0.22]} castShadow material={skinMaterial}>
          <coneGeometry args={[0.035, 0.09, 6]} />
        </mesh>

        {/* Eye sockets */}
        <mesh position={[-0.085, 0.03, 0.18]}>
          <sphereGeometry args={[0.06, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={0x1a1208} roughness={0.7} />
        </mesh>
        <mesh position={[0.085, 0.03, 0.18]}>
          <sphereGeometry args={[0.06, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={0x1a1208} roughness={0.7} />
        </mesh>

        {/* === Left eye === */}
        <group ref={leftEyeGroupRef} position={[-0.085, 0.03, 0.2]}>
          <mesh material={eyeWhiteMaterial}>
            <sphereGeometry args={[0.045, 16, 12]} />
          </mesh>
          <mesh position={[0, 0, 0.035]} material={irisMaterial}>
            <circleGeometry args={[IRIS_RADIUS, 20]} />
          </mesh>
          <mesh ref={leftPupilRef} position={[0, 0, 0.04]} material={pupilMaterial}>
            <circleGeometry args={[0.016, 12]} />
          </mesh>
          <mesh position={[0.012, 0.015, 0.045]}>
            <circleGeometry args={[0.006, 8]} />
            <meshBasicMaterial color={0xffffff} toneMapped={false} />
          </mesh>
        </group>

        {/* === Right eye === */}
        <group ref={rightEyeGroupRef} position={[0.085, 0.03, 0.2]}>
          <mesh material={eyeWhiteMaterial}>
            <sphereGeometry args={[0.045, 16, 12]} />
          </mesh>
          <mesh position={[0, 0, 0.035]} material={irisMaterial}>
            <circleGeometry args={[IRIS_RADIUS, 20]} />
          </mesh>
          <mesh ref={rightPupilRef} position={[0, 0, 0.04]} material={pupilMaterial}>
            <circleGeometry args={[0.016, 12]} />
          </mesh>
          <mesh position={[0.012, 0.015, 0.045]}>
            <circleGeometry args={[0.006, 8]} />
            <meshBasicMaterial color={0xffffff} toneMapped={false} />
          </mesh>
        </group>

        {/* Eyebrows */}
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

        {/* Mouth */}
        <mesh position={[0, -0.13, 0.21]}>
          <boxGeometry args={[0.06, 0.008, 0.01]} />
          <meshStandardMaterial color={0x2a1a0a} roughness={0.8} />
        </mesh>
      </group>

      {/* === Arms === */}
      <group position={[-0.36, -0.85, 0]}>
        <mesh position={[-0.05, -0.2, 0.05]} rotation={[0.3, 0, 0.15]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
        </mesh>
        <mesh position={[-0.1, -0.45, 0.18]} rotation={[0.9, 0, 0.1]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.28, 8, 12]} />
        </mesh>
        <mesh ref={leftHandRef} position={[-0.12, -1.42, -0.78]} castShadow material={skinMaterial}>
          <boxGeometry args={[0.1, 0.05, 0.13]} />
        </mesh>
      </group>

      <group position={[0.36, -0.85, 0]}>
        <mesh position={[0.05, -0.2, 0.05]} rotation={[0.3, 0, -0.15]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.06, 0.3, 8, 12]} />
        </mesh>
        <mesh position={[0.1, -0.45, 0.18]} rotation={[0.9, 0, -0.1]} castShadow material={bodyMaterial}>
          <capsuleGeometry args={[0.055, 0.28, 8, 12]} />
        </mesh>
        <mesh ref={rightHandRef} position={[0.12, -1.42, -0.78]} castShadow material={skinMaterial}>
          <boxGeometry args={[0.1, 0.05, 0.13]} />
        </mesh>
      </group>
    </group>
  );
}
