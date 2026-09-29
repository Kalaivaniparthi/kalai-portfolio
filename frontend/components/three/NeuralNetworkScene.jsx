'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScenePalette } from '@/lib/hooks';

const NODE_COUNT = 36;
const LINK_DISTANCE = 2.1;
const MAX_LINKS_PER_NODE = 4;
const SIGNAL_COUNT = 28;
const DUST_COUNT = 350;
const ACCENT_EVERY = 4; // every 4th connection uses the accent colour (pink in light mode)

// Deterministic PRNG so the network looks identical on every load
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork() {
  const rand = mulberry32(7);
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = 1.4 + rand() * 1.8;
    nodes.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta) * 1.5,
        r * Math.sin(phi) * Math.sin(theta) * 0.95,
        r * Math.cos(phi)
      )
    );
  }

  const edges = [];
  const degree = new Array(NODE_COUNT).fill(0);
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (degree[i] >= MAX_LINKS_PER_NODE || degree[j] >= MAX_LINKS_PER_NODE) continue;
      if (nodes[i].distanceTo(nodes[j]) < LINK_DISTANCE) {
        edges.push([i, j]);
        degree[i]++;
        degree[j]++;
      }
    }
  }
  return { nodes, edges };
}

const edgePositions = (nodes, edges) => {
  const arr = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    nodes[a].toArray(arr, k * 6);
    nodes[b].toArray(arr, k * 6 + 3);
  });
  return arr;
};

/** Eases a material colour / opacity toward the palette each frame (~700ms theme crossfade). */
function easeMaterial(mat, color, opacity, k, tmp) {
  if (!mat) return;
  tmp.set(color);
  mat.color.lerp(tmp, k);
  if (mat.emissive) mat.emissive.lerp(tmp, k);
  if (opacity !== undefined) mat.opacity += (opacity - mat.opacity) * k;
}

function Network({ palette, mouse, animate }) {
  const outer = useRef();
  const inner = useRef();
  const nodesRef = useRef();
  const signalsRef = useRef();
  const mats = useRef({});
  const { size } = useThree();
  const initial = useRef(palette).current; // materials start here, then ease toward `palette`
  const tmp = useMemo(() => new THREE.Color(), []);
  const tmpV = useMemo(() => new THREE.Vector3(), []);

  const { nodes, edges } = useMemo(buildNetwork, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { mainLines, accentLines } = useMemo(() => {
    const main = edges.filter((_, i) => i % ACCENT_EVERY !== 0);
    const accent = edges.filter((_, i) => i % ACCENT_EVERY === 0);
    return { mainLines: edgePositions(nodes, main), accentLines: edgePositions(nodes, accent) };
  }, [nodes, edges]);

  // Signals: bright particles travelling along edges like data packets
  const signals = useMemo(() => {
    const rand = mulberry32(99);
    return Array.from({ length: SIGNAL_COUNT }, () => ({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.25 + rand() * 0.45,
      forward: rand() > 0.5,
    }));
  }, [edges]);
  const signalPositions = useMemo(() => new Float32Array(SIGNAL_COUNT * 3), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    const k = animate ? 1 - Math.exp(-d * 6) : 1;

    // Theme colour easing
    const m = mats.current;
    const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    easeMaterial(m.nodes, palette.primary, undefined, k, tmp);
    if (m.nodes) m.nodes.emissiveIntensity += (palette.emissive - m.nodes.emissiveIntensity) * k;
    easeMaterial(m.lines, palette.primary, palette.lineOpacity, k, tmp);
    easeMaterial(m.accent, palette.secondary, palette.lineOpacity + 0.15, k, tmp);
    easeMaterial(m.signals, palette.signal, undefined, k, tmp);
    [m.lines, m.accent, m.signals].forEach((mat) => mat && (mat.blending = blending));

    // Slow auto-rotation + eased mouse parallax
    if (animate) inner.current.rotation.y += d * 0.08;
    outer.current.rotation.x = THREE.MathUtils.lerp(outer.current.rotation.x, mouse.current.y * 0.25, 0.04);
    outer.current.rotation.y = THREE.MathUtils.lerp(outer.current.rotation.y, mouse.current.x * 0.35, 0.04);

    // Gentle node pulse
    for (let i = 0; i < NODE_COUNT; i++) {
      const s = animate ? 1 + Math.sin(t * 1.6 + i * 0.9) * 0.3 : 1;
      dummy.position.copy(nodes[i]);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodesRef.current.setMatrixAt(i, dummy.matrix);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;

    // Advance signals
    for (let k2 = 0; k2 < SIGNAL_COUNT; k2++) {
      const sig = signals[k2];
      if (animate) sig.t += d * sig.speed;
      if (sig.t >= 1) {
        sig.t = 0;
        sig.edge = Math.floor(Math.random() * edges.length);
        sig.forward = Math.random() > 0.5;
      }
      const [a, b] = edges[sig.edge];
      const from = sig.forward ? nodes[a] : nodes[b];
      const to = sig.forward ? nodes[b] : nodes[a];
      tmpV.lerpVectors(from, to, sig.t).toArray(signalPositions, k2 * 3);
    }
    signalsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Shrink the network on narrow screens so it stays in frame
  const scale = Math.min(1, Math.max(0.6, size.width / 1000));
  const blending = initial.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group ref={outer} scale={scale}>
      <group ref={inner}>
        <instancedMesh ref={nodesRef} args={[null, null, NODE_COUNT]} frustumCulled={false}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            ref={(r) => (mats.current.nodes = r)}
            color={initial.primary}
            emissive={initial.primary}
            emissiveIntensity={initial.emissive}
            roughness={0.3}
            metalness={0.2}
            toneMapped={false}
          />
        </instancedMesh>

        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={mainLines.length / 3} array={mainLines} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={(r) => (mats.current.lines = r)}
            color={initial.primary}
            transparent
            opacity={initial.lineOpacity}
            blending={blending}
            depthWrite={false}
          />
        </lineSegments>

        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={accentLines.length / 3} array={accentLines} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={(r) => (mats.current.accent = r)}
            color={initial.secondary}
            transparent
            opacity={initial.lineOpacity + 0.15}
            blending={blending}
            depthWrite={false}
          />
        </lineSegments>

        <points ref={signalsRef} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={SIGNAL_COUNT} array={signalPositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            ref={(r) => (mats.current.signals = r)}
            color={initial.signal}
            size={0.09}
            sizeAttenuation
            transparent
            opacity={0.95}
            blending={blending}
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

function Dust({ palette, animate }) {
  const ref = useRef();
  const mat = useRef();
  const initial = useRef(palette).current;
  const tmp = useMemo(() => new THREE.Color(), []);
  const positions = useMemo(() => {
    const rand = mulberry32(3);
    const arr = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3] = (rand() - 0.5) * 24;
      arr[i * 3 + 1] = (rand() - 0.5) * 14;
      arr[i * 3 + 2] = (rand() - 0.5) * 10 - 3;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    easeMaterial(mat.current, palette.primary, palette.additive ? 0.5 : 0.45, animate ? 1 - Math.exp(-d * 6) : 1, tmp);
    if (animate) ref.current.rotation.y += d * 0.01;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={DUST_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={mat} color={initial.primary} size={0.025} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

// With frameloop="demand" (reduced motion) re-render once whenever the theme changes
function InvalidateOnChange({ value }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [value, invalidate]);
  return null;
}

export default function NeuralNetworkScene({ active = true, animate = true, onReady }) {
  const palette = useScenePalette();
  const mouse = useRef({ x: 0, y: 0 });

  // Track the pointer on window: the hero overlay sits above the canvas
  useEffect(() => {
    if (!animate) return;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [animate]);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={!active ? 'never' : animate ? 'always' : 'demand'}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <InvalidateOnChange value={palette} />
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color={palette.primary} />
      <pointLight position={[-5, -3, 2]} intensity={20} color={palette.secondary} />
      <Network palette={palette} mouse={mouse} animate={animate} />
      <Dust palette={palette} animate={animate} />
    </Canvas>
  );
}
