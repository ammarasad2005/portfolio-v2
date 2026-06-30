"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";

/**
 * Avatar — loads the user's own Avaturn.me 3D avatar and plays a natural
 * greeting wave. No head/eye tracking.
 *
 * The model has a built-in idle animation ("IdleV4.2(maya_head)") with 53
 * channels. We play that as the base, then add a procedural wave on top.
 *
 * Wave animation (natural "hello" greeting):
 *   1. RightArm: raises outward to the side (Z rotation) + slightly forward
 *   2. RightForeArm: bends ~90° at elbow (X rotation) so forearm points up
 *   3. RightHand + forearm: oscillate side-to-side (Z rotation) — the wave
 *
 * The key insight: a natural wave raises the upper arm to ~90° out to the
 * side, bends the elbow 90° so the forearm points up, then the forearm +
 * hand pivot side-to-side at the elbow. NOT rotating the upper arm back
 * and forth (that looks like a broken arm).
 *
 * Rig (Mixamo standard, Y-up):
 *   Armature → Hips → Spine → Spine1 → Spine2 → Neck → Head
 *   Spine2 → RightShoulder → RightArm → RightForeArm → RightHand
 *
 * Bounding box: Y[-1, 1.85] — avatar is ~2.85 units tall, head at top.
 */

interface AvatarProps {
  scrollProgress: number;
  onLoaded?: () => void;
}

export function Avatar({ scrollProgress, onLoaded }: AvatarProps) {
  const [gltf, setGltf] = useState<any>(null);

  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  // Bone refs for procedural wave
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const rightForeArmRef = useRef<THREE.Object3D | null>(null);
  const rightHandRef = useRef<THREE.Object3D | null>(null);
  const spineRef = useRef<THREE.Object3D | null>(null);

  // Store rest rotations so we can offset from them
  const rightArmRest = useRef(new THREE.Quaternion());
  const rightForeArmRest = useRef(new THREE.Quaternion());
  const rightHandRest = useRef(new THREE.Quaternion());

  const wavePhase = useRef(0);
  const breathPhase = useRef(0);
  const introT = useRef(0);

  // ============ Load GLB ============
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/avatar-anim.glb",
      (loaded: any) => {
        const avatar = loaded.scene;

        avatar.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = true;
          }
        });

        // Find bones
        rightArmRef.current = avatar.getObjectByName("RightArm") || null;
        rightForeArmRef.current = avatar.getObjectByName("RightForeArm") || null;
        rightHandRef.current = avatar.getObjectByName("RightHand") || null;
        spineRef.current = avatar.getObjectByName("Spine1") || null;

        // Store rest rotations
        if (rightArmRef.current) rightArmRest.current.copy(rightArmRef.current.quaternion);
        if (rightForeArmRef.current) rightForeArmRest.current.copy(rightForeArmRef.current.quaternion);
        if (rightHandRef.current) rightHandRest.current.copy(rightHandRef.current.quaternion);

        // Play idle animation
        const mixer = new THREE.AnimationMixer(avatar);
        mixerRef.current = mixer;
        if (loaded.animations && loaded.animations.length > 0) {
          const action = mixer.clipAction(loaded.animations[0]);
          action.play();
        }

        setGltf(loaded);
        requestAnimationFrame(() => onLoaded?.());
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading avatar GLB:", error);
      }
    );
  }, [onLoaded]);

  // ============ Frame loop ============
  useFrame((_, delta) => {
    // Update idle animation
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // === Intro timing: arm raises over first 1.2s ===
    introT.current = Math.min(1, introT.current + delta / 1.2);
    // Smooth ease-in-out
    const intro = introT.current < 0.5
      ? 2 * introT.current * introT.current
      : 1 - Math.pow(-2 * introT.current + 2, 2) / 2;

    wavePhase.current += delta * 3; // wave speed (radians/sec)
    breathPhase.current += delta * 1.2;

    // === Natural greeting wave ===
    // The idle animation may also move the arm, so we SET the quaternion
    // (overriding idle for the right arm) using the rest rotation as base.
    //
    // Step 1: RightArm — raise out to the side + slightly forward
    //   For Mixamo right side, negative Z = arm goes out to the right side
    //   We want ~80° raise (not full 90°, looks more natural)
    if (rightArmRef.current) {
      const raiseAmount = -1.4 * intro; // ~80° outward
      const forwardTilt = -0.15 * intro; // slight forward
      // Build rotation: first the rest, then our offsets
      const raiseQ = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(forwardTilt, 0, raiseAmount, "XYZ")
      );
      rightArmRef.current.quaternion.copy(rightArmRest.current).multiply(raiseQ);
    }

    // Step 2: RightForeArm — bend at elbow so forearm points UP
    //   In Mixamo, the forearm's X rotation bends the elbow.
    //   We want ~100° bend so the forearm is pointing up/out.
    //   The wave oscillation goes HERE (on Z, pivoting forearm side-to-side).
    if (rightForeArmRef.current) {
      const elbowBend = 1.75 * intro; // ~100° bend
      // Wave: oscillate the forearm side-to-side (Z rotation)
      const waveOsc = intro > 0.8 ? Math.sin(wavePhase.current) * 0.35 : 0;
      const waveQ = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(elbowBend, 0, waveOsc, "XYZ")
      );
      rightForeArmRef.current.quaternion.copy(rightForeArmRest.current).multiply(waveQ);
    }

    // Step 3: RightHand — slight twist to make wave look natural
    if (rightHandRef.current) {
      const handTwist = intro > 0.8 ? Math.sin(wavePhase.current * 0.8) * 0.15 : 0;
      const handQ = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, 0, handTwist, "XYZ")
      );
      rightHandRef.current.quaternion.copy(rightHandRest.current).multiply(handQ);
    }

    // === Subtle breathing on spine ===
    if (spineRef.current) {
      const breath = Math.sin(breathPhase.current) * 0.015;
      spineRef.current.rotation.x = breath;
    }

    // === Scroll-driven exit: avatar sinks down and rotates ===
    if (groupRef.current) {
      const sinkProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) / 0.3));
      groupRef.current.position.y = -sinkProgress * 2.5;
      groupRef.current.rotation.y = sinkProgress * 0.3;
      const scale = 1 - sinkProgress * 0.1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  if (!gltf) return null;

  return <primitive ref={groupRef} object={gltf.scene} />;
}
