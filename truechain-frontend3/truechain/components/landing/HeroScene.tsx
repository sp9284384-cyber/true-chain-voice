"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Line } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 7;
const TEAL = "#2FE0C6";

interface NodeState {
  position: [number, number, number];
  delay: number; // seconds before this node starts appearing
  phase: number; // offset for its pulse animation so nodes don't pulse in unison
}

function buildChainLayout(): NodeState[] {
  // A loose, slightly wavy arc through 3D space — reads as a "chain" rather
  // than a rigid straight line or a perfect circle.
  const nodes: NodeState[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / (NODE_COUNT - 1);
    const x = (t - 0.5) * 5.5;
    const y = Math.sin(t * Math.PI * 1.4) * 0.9;
    const z = Math.cos(t * Math.PI * 1.1) * 0.8;
    nodes.push({ position: [x, y, z], delay: i * 0.18, phase: i * 1.3 });
  }
  return nodes;
}

function ChainNode({ node }: { node: NodeState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    // Staggered scale-in: nodes appear one by one as if the chain is being
    // built in front of the viewer.
    const sinceStart = clock.elapsedTime - node.delay;
    const targetScale = sinceStart > 0 ? 1 : 0;
    const growthProgress = Math.min(Math.max(sinceStart / 0.5, 0), 1);
    const eased = 1 - Math.pow(1 - growthProgress, 3); // ease-out cubic
    const scale = targetScale === 1 ? eased : 0;
    meshRef.current.scale.setScalar(scale);

    // Subtle emissive pulse, offset per-node so the chain feels alive
    // rather than blinking in lockstep.
    const pulse = Math.sin(clock.elapsedTime * 1.4 + node.phase) * 0.35 + 0.85;
    materialRef.current.emissiveIntensity = pulse;
  });

  return (
    <RoundedBox ref={meshRef} args={[0.55, 0.55, 0.55]} radius={0.08} smoothness={4} position={node.position}>
      <meshStandardMaterial
        ref={materialRef}
        color={TEAL}
        emissive={TEAL}
        emissiveIntensity={0.8}
        transparent
        opacity={0.55}
        roughness={0.25}
        metalness={0.1}
      />
    </RoundedBox>
  );
}

function ChainLinks({ nodes }: { nodes: NodeState[] }) {
  const points = useMemo(() => nodes.map((n) => new THREE.Vector3(...n.position)), [nodes]);
  return <Line points={points} color={TEAL} lineWidth={1} transparent opacity={0.35} />;
}

function Scene() {
  const nodes = useMemo(() => buildChainLayout(), []);

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} intensity={1.2} color={TEAL} />
      <pointLight position={[-3, -2, -3]} intensity={0.4} color="#4C6EF5" />
      <ChainLinks nodes={nodes} />
      {nodes.map((node, i) => (
        <ChainNode key={i} node={node} />
      ))}
    </group>
  );
}

export function HeroScene() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="h-full w-full"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        {/*
          Rotation is the ONLY interaction available: auto-rotate stays on
          always, manual drag-rotate is off so a judge's stray cursor can't
          spin the framing off-camera mid-demo. Hover just nudges the speed
          up slightly (set below) so the scene still feels responsive.
        */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={hovered ? 1.8 : 1.15}
        />
      </Canvas>
    </div>
  );
}
