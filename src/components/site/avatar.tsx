"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";

/**
 * Avatar — loads the user's own Avaturn.me 3D avatar and plays a waving
 * animation. No head/eye tracking — the avatar stands and waves to the viewer.
 *
 * The model has a built-in idle animation ("IdleV4.2(maya_head)") with 53
 * channels. We play that as the base, then add a procedural wave on top by
 * rotating the right arm bones (RightArm → RightForeArm → RightHand).
 *
 * Rig (Mixamo standard):
 *   Armature → Hips → Spine → Spine1 → Spine2 → Neck → Head
 *                    → LeftUpLeg/RightUpLeg → legs
 *                    → LeftShoulder/RightShoulder → arms → hands
 *
 * Bounding box: X[-1,1], Y[-1,1.85], Z[-1,1] — ~2.85 units tall, feet at Y=-1.
 */

interface AvatarProps {
  scrollProgress: number; // 0-1, drives exit (avatar sinks down)
  onLoaded?: () => void;
}

export function Avatar({ scrollProgress, onLoaded }: AvatarProps) {
  const [gltf, setGltf] = useState<any>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const idleActionRef = useRef<THREE.AnimationAction | null>(null);

  // Bone refs for procedural wave
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const rightForeArmRef = useRef<THREE.Object3D | null>(null);
  const rightHandRef = useRef<THREE.Object3D | null>(null);
  const spineRef = useRef<THREE.Object3D | null>(null);

  const wavePhase = useRef(0);
  const breathPhase = useRef(0);
  const introComplete = useRef(false);

  // ============ Load GLB ============
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/avatar-anim.glb",
      (loaded: any) => {
        const avatar = loaded.scene;

        // Fix shadows + frustum culling
        avatar.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = true;
          }
        });

        // Find bones for procedural wave (Mixamo naming)
        rightArmRef.current = avatar.getObjectByName("RightArm") || null;
        rightForeArmRef.current = avatar.getObjectByName("RightForeArm") || null;
        rightHandRef.current = avatar.getObjectByName("RightHand") || null;
        spineRef.current = avatar.getObjectByName("Spine1") || avatar.getObjectByName("Spine") || null;

        // Set up AnimationMixer + play idle
        const mixer = new THREE.AnimationMixer(avatar);
        mixerRef.current = mixer;

        if (loaded.animations && loaded.animations.length > 0) {
          const idleClip = loaded.animations[0];
          const action = mixer.clipAction(idleClip);
          action.play();
          idleActionRef.current = action;
        }

        setGltf(loaded);
        requestAnimationFrame(() => onLoaded?.());
      },
      (event: ProgressEvent) => {
        if (event.total > 0) {
          setLoadProgress(event.loaded / event.total);
        }
      },
      (error: unknown) => {
        console.error("Error loading avatar GLB:", error);
      }
    );
  }, [onLoaded]);

  // ============ Frame loop: idle + procedural wave + scroll exit ============
  useFrame((_, delta) => {
    // Update idle animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    wavePhase.current += delta * 2.5; // wave speed
    breathPhase.current += delta * 1.2;

    // === Procedural wave on right arm ===
    // Intro: arm raises over first 1.5s, then waves
    const introT = Math.min(1, wavePhase.current / 4); // 4 seconds to full raise
    if (introT >= 0.99) introComplete.current = true;

    if (rightArmRef.current) {
      // Raise the upper arm: rotate Z (negative = arm goes up for right side)
      // Mixamo right arm: Z rotation raises the arm sideways/up
      const raiseAmount = -1.6 * introT; // ~90° raise
      // Add subtle wave oscillation
      const waveOsc = introComplete.current ? Math.sin(wavePhase.current * 1.5) * 0.15 : 0;
      rightArmRef.current.rotation.z = raiseAmount + waveOsc;
      // Slight forward rotation
      rightArmRef.current.rotation.x = -0.2 * introT;
    }

    if (rightForeArmRef.current) {
      // Bend the elbow: rotate X
      const elbowBend = 0.6 * introT; // ~35° bend
      // Wave oscillation on the forearm (the actual wave motion)
      const waveMotion = introComplete.current ? Math.sin(wavePhase.current) * 0.25 : 0;
      rightForeArmRef.current.rotation.x = elbowBend + waveMotion;
      // Slight Z rotation for natural wave angle
      rightForeArmRef.current.rotation.z = 0.3 * introT;
    }

    if (rightHandRef.current) {
      // Slight hand wave
      const handWave = introComplete.current ? Math.sin(wavePhase.current * 1.2) * 0.1 : 0;
      rightHandRef.current.rotation.z = handWave;
    }

    // === Subtle breathing on spine ===
    if (spineRef.current) {
      const breath = Math.sin(breathPhase.current) * 0.02;
      spineRef.current.rotation.x = breath;
      // Subtle side-to-side sway
      const sway = Math.sin(breathPhase.current * 0.4) * 0.015;
      spineRef.current.rotation.z = sway;
    }

    // === Scroll-driven exit: avatar sinks down and fades ===
    if (groupRef.current) {
      // 0.0-0.7: avatar stays in place (slow scroll phase)
      // 0.7-1.0: avatar sinks down
      const sinkProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) / 0.3));
      groupRef.current.position.y = -sinkProgress * 2.5;

      // Slight rotation as it sinks
      groupRef.current.rotation.y = sinkProgress * 0.3;

      // Scale down slightly
      const scale = 1 - sinkProgress * 0.1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  if (!gltf) return null;

  return <primitive ref={groupRef} object={gltf.scene} />;
}
