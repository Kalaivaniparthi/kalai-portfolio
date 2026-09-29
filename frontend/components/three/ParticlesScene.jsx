'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenePalette } from '@/lib/hooks';

const BOUNDS = { x: 14, y: 9, z: 6 }; // half-extents of the drifting volume

// Soft round sprite so points render as glowing dots instead of squares
function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.8)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Particles({ count, animate }) {
  const palette = useScenePalette();
  const pointsRef = useRef();
  const matRef = useRef();
  const invalidate = useThree((s) => s.invalidate);
  const initial = useRef(palette).current;
  const target = useMemo(() => new THREE.Color(), []);
  const texture = useMemo(makeGlowTexture, []);
  const lastScroll = useRef(typeof window === 'undefined' ? 0 : window.scrollY);

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;
      // Slow drift, biased gently upward and to the right
      velocities[i * 3] = 0.05 + Math.random() * 0.12;
      velocities[i * 3 + 1] = (Math.random() - 0.3) * 0.08;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
      const brightness = 0.45 + Math.random() * 0.55; // per-particle twinkle level
      colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = brightness;
    }
    return { positions, velocities, colors };
  }, [count]);

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => invalidate(), [palette, invalidate]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const pts = pointsRef.current;
    const mat = matRef.current;

    // Ease colours between themes (~700ms) instead of snapping
    const k = animate ? 1 - Math.exp(-d * 6) : 1;
    target.set(palette.particle);
    mat.color.lerp(target, k);
    mat.opacity += ((palette.additive ? 0.85 : 0.7) - mat.opacity) * k;
    mat.blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

    if (!animate) return;

    // Scroll parallax: particles move up with the page, but far slower than the content
    const scrollY = window.scrollY;
    const scrollShift = (scrollY - lastScroll.current) * 0.0025;
    lastScroll.current = scrollY;

    const pos = pts.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      pos[ix] += velocities[ix] * d;
      pos[ix + 1] += velocities[ix + 1] * d + scrollShift;
      pos[ix + 2] += velocities[ix + 2] * d;
      if (pos[ix] > BOUNDS.x) pos[ix] -= BOUNDS.x * 2;
      if (pos[ix + 1] > BOUNDS.y) pos[ix + 1] -= BOUNDS.y * 2;
      else if (pos[ix + 1] < -BOUNDS.y) pos[ix + 1] += BOUNDS.y * 2;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={texture}
        color={initial.particle}
        vertexColors
        size={0.14}
        sizeAttenuation
        transparent
        opacity={initial.additive ? 0.85 : 0.7}
        depthWrite={false}
        blending={initial.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

export default function ParticlesScene({ count = 600, animate = true }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      frameloop={animate ? 'always' : 'demand'}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* key: buffer sizes are fixed once uploaded to the GPU, so remount when the count changes */}
      <Particles key={count} count={count} animate={animate} />
    </Canvas>
  );
}
