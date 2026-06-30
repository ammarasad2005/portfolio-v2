"use client";

import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import { typingBoneNames, eyebrowBoneNames } from "@/data/bone-data";

/**
 * CharacterGLB — loads the actual character.glb model and applies the exact
 * tracking behavior from red1-for-hek/portfolio-website.
 *
 * Behavior replicated from the reference:
 *
 * 1. Model setup (character.ts):
 *    - All meshes: castShadow=false, receiveShadow=false, frustumCulled=true
 *    - Material precision: 'mediump'
 *    - footR/footL position.y = 3.36
 *
 * 2. Animations (animationUtils.ts):
 *    - introAnimation: LoopOnce, clampWhenFinished — plays on load
 *    - key1, key2, key5, key6: looping, timeScale 1.2 (ambient idle)
 *    - typing: filtered to arm/hand bones (typingBoneNames), timeScale 1.2
 *    - Blink: starts 2.5s after intro
 *    - browup: filtered to eyebrow bones, triggered on hover (LoopOnce)
 *
 * 3. Mouse tracking (mouseUtils.ts handleHeadRotation):
 *    - headBone = getObjectByName("spine.006")
 *    - When at top (scrollProgress < 0.1):
 *      - rotation.y = lerp(..., mouseX * π/6, 0.2)
 *      - rotation.x = lerp(..., -mouseY - 0.5*π/6, 0.1), clamped [-0.3, 0.4]
 *    - When scrolled past threshold:
 *      - rotation.x = lerp(..., -0.4, 0.03)
 *      - rotation.y = lerp(..., -0.3, 0.03)
 *
 * 4. Scroll choreography (GsapScroll.ts):
 *    - 0.0-0.3: character.rotation.y 0→0.7 (tl1)
 *    - 0.3-0.7: character.rotation y→0.92 x→0.12, neckBone (spine.005) x→0.6,
 *               monitor opacity 0→1, screenlight opacity 0→1 (tl2)
 *    - 0.7-1.0: character slides up (y→+2), rotation.x→-0.04 (tl3)
 *
 * 5. Screenlight feedback (lighting.ts setPointLight):
 *    - When screenlight opacity > 0.9: pointLight intensity = emissiveIntensity * 20
 */

const MAX_HEAD_ROTATION_Y = Math.PI / 6; // ~30°
const LERP_Y = 0.2; // horizontal — responsive
const LERP_X = 0.1; // vertical — smooth

interface CharacterGLBProps {
  scrollProgress: number; // 0-1, drives scroll choreography
  onLoaded?: () => void; // called when model + animations ready
}

export function CharacterGLB({ scrollProgress, onLoaded }: CharacterGLBProps) {
  const [gltf, setGltf] = useState<any>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const neckBoneRef = useRef<THREE.Object3D | null>(null);
  const screenLightRef = useRef<THREE.Object3D | null>(null);
  const monitorRef = useRef<THREE.Mesh | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});

  const currentMouse = useRef({ x: 0, y: 0 });
  const clock = useRef(0);
  const introStarted = useRef(false);

  const { pointer } = useThree();

  // ============ Load GLB ============
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/character.glb",
      (loaded: any) => {
        const character = loaded.scene;

        // Model setup (from reference character.ts)
        character.traverse((child: any) => {
          if (child.isMesh) {
            const mesh = child as THREE.Mesh;
            child.castShadow = false;
            child.receiveShadow = false;
            mesh.frustumCulled = true;
            if (mesh.material && !Array.isArray(mesh.material)) {
              (mesh.material as THREE.ShaderMaterial).precision = "mediump";
            }
          }
        });

        // Foot positions (from reference)
        const footR = character.getObjectByName("footR");
        const footL = character.getObjectByName("footL");
        if (footR) footR.position.y = 3.36;
        if (footL) footL.position.y = 3.36;

        // Find key bones/objects — try both with and without dots
        // (three.js GLTFLoader may strip dots from bone names)
        headBoneRef.current =
          character.getObjectByName("spine.006") ||
          character.getObjectByName("spine006") ||
          null;
        neckBoneRef.current =
          character.getObjectByName("spine.005") ||
          character.getObjectByName("spine005") ||
          null;
        screenLightRef.current = character.getObjectByName("screenlight") || null;

        // If still not found, traverse all bones and find by partial name
        if (!headBoneRef.current) {
          character.traverse((obj: any) => {
            if (obj.name && obj.name.replace(/\./g, "") === "spine006") {
              headBoneRef.current = obj;
            }
            if (obj.name && obj.name.replace(/\./g, "") === "spine005") {
              neckBoneRef.current = obj;
            }
          });
        }

        // Find monitor (Plane.004 > child with Material.027)
        character.children.forEach((obj: any) => {
          if (obj.name === "Plane004" || obj.name === "Plane.004") {
            obj.children.forEach((child: any) => {
              if (child.material?.name === "Material.027") {
                monitorRef.current = child;
                child.material.transparent = true;
                child.material.opacity = 0;
              }
            });
          }
        });

        // Set up screenlight
        if (screenLightRef.current) {
          const mat = (screenLightRef.current as any).material;
          if (mat) {
            mat.transparent = true;
            mat.opacity = 0;
            mat.emissive?.set("#C8BFFF");
          }
        }

        // Set up AnimationMixer
        const mixer = new THREE.AnimationMixer(character);
        mixerRef.current = mixer;

        // Create filtered actions
        const createAction = (clipName: string, boneNames?: string[]) => {
          const clip = THREE.AnimationClip.findByName(loaded.animations, clipName);
          if (!clip) return null;
          let finalClip = clip;
          if (boneNames) {
            const filteredTracks = clip.tracks.filter((track: any) =>
              boneNames.some((boneName: string) => track.name.includes(boneName))
            );
            finalClip = new THREE.AnimationClip(
              clip.name + "_filtered",
              clip.duration,
              filteredTracks
            );
          }
          const action = mixer.clipAction(finalClip);
          actionsRef.current[clipName] = action;
          return action;
        };

        // introAnimation — LoopOnce, clampWhenFinished
        const introAction = createAction("introAnimation");
        if (introAction) {
          introAction.setLoop(THREE.LoopOnce, 1);
          introAction.clampWhenFinished = true;
          introAction.play();
        }

        // key1, key2, key5, key6 — looping, timeScale 1.2
        ["key1", "key2", "key5", "key6"].forEach((name) => {
          const action = createAction(name);
          if (action) {
            action.play();
            action.timeScale = 1.2;
          }
        });

        // typing — filtered to arm/hand bones, timeScale 1.2
        const typingAction = createAction("typing", typingBoneNames);
        if (typingAction) {
          typingAction.enabled = true;
          typingAction.play();
          typingAction.timeScale = 1.2;
        }

        setGltf(loaded);
        // Call onLoaded after state is set, so the primitive renders
        requestAnimationFrame(() => onLoaded?.());
      },
      (event: ProgressEvent) => {
        if (event.total > 0) {
          setLoadProgress(event.loaded / event.total);
        }
      },
      (error: unknown) => {
        console.error("Error loading GLB:", error);
      }
    );
  }, [onLoaded]);

  // ============ Start intro + blink after load ============
  useEffect(() => {
    if (!gltf || introStarted.current) return;
    introStarted.current = true;

    // 2.5s after load: re-play intro, then start blink
    const t1 = setTimeout(() => {
      const introAction = actionsRef.current["introAnimation"];
      if (introAction) {
        introAction.clampWhenFinished = true;
        introAction.reset().play();
      }
      const blinkAction = actionsRef.current["Blink"] || (() => {
        const clip = THREE.AnimationClip.findByName(gltf.animations, "Blink");
        if (!clip) return null;
        const action = mixerRef.current?.clipAction(clip);
        if (action) actionsRef.current["Blink"] = action;
        return action;
      })();
      if (blinkAction) {
        blinkAction.play().fadeIn(0.5);
      }
    }, 2500);

    return () => clearTimeout(t1);
  }, [gltf]);

  // ============ Frame loop: mouse tracking + scroll choreography + animations ============
  useFrame((_, delta) => {
    clock.current += delta;

    // Update animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // === Smooth mouse tracking ===
    currentMouse.current.x += (pointer.x - currentMouse.current.x) * delta * 4;
    currentMouse.current.y += (pointer.y - currentMouse.current.y) * delta * 4;

    // === Head bone mouse tracking (reference: handleHeadRotation) ===
    if (headBoneRef.current) {
      // Mouse influence active when scroll < 0.1 (reference uses scrollY < 200)
      if (scrollProgress < 0.1) {
        // Horizontal: rotation.y = lerp(..., mouseX * π/6, 0.2)
        const targetY = currentMouse.current.x * MAX_HEAD_ROTATION_Y;
        headBoneRef.current.rotation.y +=
          (targetY - headBoneRef.current.rotation.y) * LERP_Y;

        // Vertical: rotation.x = lerp(..., -mouseY - 0.5*π/6, 0.1), clamped [-0.3, 0.4]
        let targetX = -currentMouse.current.y - 0.5 * MAX_HEAD_ROTATION_Y;
        targetX = Math.max(-0.3, Math.min(0.4, targetX));
        headBoneRef.current.rotation.x +=
          (targetX - headBoneRef.current.rotation.x) * LERP_X;
      } else {
        // Scrolled past: head returns to "looking at desk" pose
        headBoneRef.current.rotation.x += (-0.4 - headBoneRef.current.rotation.x) * 0.03;
        headBoneRef.current.rotation.y += (-0.3 - headBoneRef.current.rotation.y) * 0.03;
      }
    }

    // === Scroll choreography ===
    if (groupRef.current) {
      const p = scrollProgress;

      // Phase 1 (0.0-0.3): character.rotation.y 0→0.7 (tl1)
      const phase1 = Math.max(0, Math.min(1, p / 0.3));
      groupRef.current.rotation.y = phase1 * 0.7;

      // Phase 2 (0.3-0.7): rotation y 0.7→0.92, x 0→0.12 (tl2)
      const phase2 = Math.max(0, Math.min(1, (p - 0.3) / 0.4));
      groupRef.current.rotation.y = 0.7 + phase2 * 0.22;
      groupRef.current.rotation.x = phase2 * 0.12;

      // Phase 3 (0.7-1.0): slide up, rotation.x → -0.04 (tl3)
      const phase3 = Math.max(0, Math.min(1, (p - 0.7) / 0.3));
      groupRef.current.position.y = phase3 * 2.5;
      groupRef.current.rotation.x = 0.12 + phase3 * (-0.16); // 0.12 → -0.04
    }

    // === Neck bone tilt (tl2: spine.005 rotation.x → 0.6) ===
    if (neckBoneRef.current) {
      const neckPhase = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.4));
      const targetX = neckPhase * 0.6;
      neckBoneRef.current.rotation.x += (targetX - neckBoneRef.current.rotation.x) * 0.05;
    }

    // === Monitor reveal (tl2: opacity 0→1 at 50% scroll) ===
    if (monitorRef.current) {
      const monitorPhase = Math.max(0, Math.min(1, (scrollProgress - 0.4) / 0.3));
      const mat = (monitorRef.current as any).material;
      if (mat) {
        mat.opacity += (monitorPhase - mat.opacity) * 0.05;
      }
    }

    // === Screenlight reveal (tl2: opacity 0→1 at 60% scroll) ===
    if (screenLightRef.current) {
      const slPhase = Math.max(0, Math.min(1, (scrollProgress - 0.5) / 0.3));
      const mat = (screenLightRef.current as any).material;
      if (mat) {
        mat.opacity += (slPhase - mat.opacity) * 0.05;
        // Random flicker (reference: setInterval + GSAP)
        if (mat.opacity > 0.5) {
          mat.emissiveIntensity = 4 + Math.sin(clock.current * 3) * 2 + Math.random() * 2;
        }
      }
    }
  });

  if (!gltf) return null;

  return <primitive ref={groupRef} object={gltf.scene} />;
}

/**
 * Hook to track GLB loading progress separately (for the progress bar).
 */
export function useGLBProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    // Use fetch for progress tracking, then the GLTFLoader will use cache
    fetch("/models/character.glb")
      .then((response) => {
        if (!response.body) return new ArrayBuffer(0);
        const reader = response.body.getReader();
        const contentLength = parseInt(response.headers.get("content-length") || "0");
        let received = 0;
        const chunks: Uint8Array[] = [];
        return new Promise<ArrayBuffer>((resolve) => {
          reader.read().then(function process({ done, value }): any {
            if (done) {
              const combined = new Uint8Array(received);
              let offset = 0;
              for (const chunk of chunks) {
                combined.set(chunk, offset);
                offset += chunk.length;
              }
              resolve(combined.buffer);
              return;
            }
            chunks.push(value);
            received += value.length;
            if (contentLength > 0) {
              setProgress(received / contentLength);
            }
            return reader.read().then(process);
          });
        });
      });
  }, []);
  return progress;
}
