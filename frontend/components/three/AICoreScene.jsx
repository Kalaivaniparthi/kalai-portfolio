'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScenePalette } from '@/lib/hooks';

function Ring({ radius, tilt, speed, color, opacity }) {
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.rotation.z += Math.min(delta, 0.05) * speed;
  });
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[radius, 0.015, 16, 160]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
        {/* Orbiting satellite */}
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Core({ palette }) {
  const shell = useRef();
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    shell.current.rotation.y += d * 0.3;
    shell.current.rotation.x += d * 0.12;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={palette.primary}
          emissive={palette.primary}
          emissiveIntensity={palette.emissive}
          roughness={0.2}
          metalness={0.4}
          distort={0.35}
          speed={2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={shell} scale={1.35}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={palette.primary} wireframe transparent opacity={0.25} />
      </mesh>
      <Ring radius={1.9} tilt={[Math.PI / 2.4, 0, 0]} speed={0.6} color={palette.primary} opacity={0.6} />
      <Ring radius={2.3} tilt={[Math.PI / 3, Math.PI / 5, 0]} speed={-0.4} color={palette.secondary} opacity={0.5} />
      <Ring radius={2.7} tilt={[Math.PI / 1.7, -Math.PI / 6, 0]} speed={0.3} color={palette.primary} opacity={0.35} />
    </Float>
  );
}

export default function AICoreScene({ active = true }) {
  const palette = useScenePalette();
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={60} color={palette.primary} />
      <pointLight position={[-4, -2, 3]} intensity={30} color={palette.secondary} />
      <Core palette={palette} />
    </Canvas>
  );
}
