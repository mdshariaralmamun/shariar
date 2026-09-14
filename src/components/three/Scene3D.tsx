'use client';

import * as React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

type Vec3 = [number, number, number];

interface Zone {
  id: string;
  position: Vec3;
  size: Vec3;
  color: number;
  label: string;
  class: string;
}

// Gas Piping System Visualization
export function GasPipingSystem() {
  const groupRef = React.useRef<THREE.Group>(null);
  const [hoveredPipe, setHoveredPipe] = React.useState<string | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const pipes = [
    { id: 'main-header', position: [0, 2, 0] as Vec3, rotation: [0, 0, 0] as Vec3, color: 0x1a1a2e, label: 'Main Header (1/2")', spec: 'SS 316L, 0.049" wall' },
    { id: 'branch-1', position: [-2, 1, 0] as Vec3, rotation: [0, 0, Math.PI / 2] as Vec3, color: 0x16213e, label: 'Branch to GC (1/4")', spec: 'SS 316L, 0.035" wall' },
    { id: 'branch-2', position: [2, 1, 0] as Vec3, rotation: [0, 0, Math.PI / 2] as Vec3, color: 0x0f3460, label: 'Branch to LC-MS (1/4")', spec: 'SS 316L, 0.035" wall' },
    { id: 'drop-1', position: [-2, -1, 0] as Vec3, rotation: [Math.PI / 2, 0, 0] as Vec3, color: 0x1a1a2e, label: 'Drop to Fume Hood', spec: 'VCR Face Seal' },
    { id: 'drop-2', position: [2, -1, 0] as Vec3, rotation: [Math.PI / 2, 0, 0] as Vec3, color: 0x16213e, label: 'Drop to Glove Box', spec: 'VCR Face Seal' },
    { id: 'regulator', position: [0, 3.5, 0] as Vec3, rotation: [0, 0, 0] as Vec3, color: 0xe94560, label: 'Pressure Regulator', spec: 'BMD 500-14 2x1' },
    { id: 'manifold', position: [0, -2.5, 0] as Vec3, rotation: [0, 0, 0] as Vec3, color: 0x0f3460, label: 'Distribution Manifold', spec: '6-port, 1/4" VCR' },
  ];

  const fittings = [
    { position: [-1, 2, 0] as Vec3, type: 'elbow' as const },
    { position: [1, 2, 0] as Vec3, type: 'elbow' as const },
    { position: [-2, 1.5, 0] as Vec3, type: 'tee' as const },
    { position: [2, 1.5, 0] as Vec3, type: 'tee' as const },
    { position: [-2, 0, 0] as Vec3, type: 'elbow' as const },
    { position: [2, 0, 0] as Vec3, type: 'elbow' as const },
  ];

  return (
    <group ref={groupRef}>
      {/* Pipes */}
      {pipes.map((pipe) => (
        <Pipe
          key={pipe.id}
          id={pipe.id}
          position={pipe.position}
          rotation={pipe.rotation}
          color={pipe.color}
          label={pipe.label}
          spec={pipe.spec}
          hovered={hoveredPipe === pipe.id}
          onHover={(hovered) => setHoveredPipe(hovered ? pipe.id : null)}
        />
      ))}

      {/* Fittings */}
      {fittings.map((fitting, i) => (
        <Fitting key={i} position={fitting.position} type={fitting.type} />
      ))}

      {/* Equipment representations */}
      <Equipment position={[-4, -1, 0]} type="fume-hood" label="Fume Hood" />
      <Equipment position={[4, -1, 0]} type="glove-box" label="Glove Box" />
      <Equipment position={[-4, 1, 0]} type="gc" label="GC System" />
      <Equipment position={[4, 1, 0]} type="lcms" label="LC-MS" />

      {/* Flow particles */}
      <FlowParticles />
    </group>
  );
}

function Pipe({
  id,
  position,
  rotation,
  color,
  label,
  spec,
  hovered,
  onHover,
}: {
  id: string;
  position: Vec3;
  rotation: Vec3;
  color: number;
  label: string;
  spec: string;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  return (
    <group position={position} rotation={rotation} onPointerOver={() => onHover(true)} onPointerOut={() => onHover(false)}>
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 3, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          emissive={hovered ? 0x00d4ff : 0x000000}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      <Html
        position={[0, 2, 0]}
        transform
        style={{
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          <div className="font-mono">{label}</div>
          <div className="text-[10px] opacity-70">{spec}</div>
        </div>
      </Html>
    </group>
  );
}

function Fitting({ position, type }: { position: Vec3; type: 'elbow' | 'tee' }) {
  return (
    <group position={position}>
      {type === 'elbow' ? (
        <>
          <mesh>
            <torusGeometry args={[0.18, 0.08, 8, 16, Math.PI / 2]} />
            <meshStandardMaterial color={0x2a2a4a} metalness={0.8} roughness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.08, 8, 16, Math.PI / 2]} />
            <meshStandardMaterial color={0x2a2a4a} metalness={0.8} roughness={0.1} />
          </mesh>
        </>
      ) : (
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.4, 16]} />
          <meshStandardMaterial color={0x2a2a4a} metalness={0.8} roughness={0.1} />
        </mesh>
      )}
    </group>
  );
}

function Equipment({ position, type, label }: { position: Vec3; type: string; label: string }) {
  const colors: Record<string, number> = {
    'fume-hood': 0x1a5c2e,
    'glove-box': 0x2d1a5c,
    'gc': 0x5c4a1a,
    'lcms': 0x5c1a3a,
  };

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={colors[type] ?? 0x4a4a6a} metalness={0.3} roughness={0.6} />
      </mesh>
      <Html position={[0, 1.2, 0]} transform>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </div>
      </Html>
    </group>
  );
}

function FlowParticles() {
  const particlesRef = React.useRef<THREE.Points>(null);
  const [particles] = React.useState(() => {
    const positions = new Float32Array(100 * 3);
    const colors = new Float32Array(100 * 3);

    for (let i = 0; i < 100; i++) {
      const pipeIndex = Math.floor(Math.random() * 5);
      const t = Math.random();

      // Distribute along pipes
      if (pipeIndex === 0) {
        // Main header
        positions[i * 3] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      } else if (pipeIndex < 3) {
        // Branches
        const x = pipeIndex === 1 ? -2 : 2;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 2 - t * 3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      } else {
        // Drops
        const x = pipeIndex === 3 ? -2 : 2;
        positions[i * 3] = x;
        positions[i * 3 + 1] = -1 + (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 2] = t * 1.5;
      }

      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1;
    }

    return { positions, colors };
  });

  useFrame((_, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        // Move particles along flow direction
        positions[i + 1] -= delta * 0.5; // Flow downward

        // Reset particles that go too far
        if (positions[i + 1] < -3) {
          positions[i + 1] = 3.5;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={100} itemSize={3} array={particles.positions} />
        <bufferAttribute attach="attributes-color" count={100} itemSize={3} array={particles.colors} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Cleanroom Layout Visualization
export function CleanroomLayout() {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const zones: Zone[] = [
    { id: 'gowning', position: [-6, 0, -6], size: [4, 3, 4], color: 0x4a90d9, label: 'Gowning Area\nISO 8', class: 'ISO 8' },
    { id: 'airlock', position: [-2, 0, -6], size: [3, 3, 4], color: 0x5ba3e0, label: 'Airlock\nISO 7', class: 'ISO 7' },
    { id: 'corridor', position: [2, 0, -6], size: [6, 3, 4], color: 0x6bc0e8, label: 'Clean Corridor\nISO 6', class: 'ISO 6' },
    { id: 'process-1', position: [-6, 0, 0], size: [4, 3, 5], color: 0x3d8ce0, label: 'Process Room 1\nISO 5', class: 'ISO 5' },
    { id: 'process-2', position: [-2, 0, 0], size: [4, 3, 5], color: 0x2a7dd4, label: 'Process Room 2\nISO 5', class: 'ISO 5' },
    { id: 'process-3', position: [2, 0, 0], size: [4, 3, 5], color: 0x1a6fc8, label: 'Process Room 3\nISO 5', class: 'ISO 5' },
    { id: 'service', position: [6, 0, 0], size: [4, 3, 5], color: 0x4a4a6a, label: 'Service Chase\nISO 7', class: 'ISO 7' },
    { id: 'utility', position: [6, 0, -6], size: [4, 3, 4], color: 0x3a3a5a, label: 'Utility Room\nISO 8', class: 'ISO 8' },
  ];

  const equipment = [
    { position: [-5, 1.6, -5] as Vec3, type: 'locker', label: 'Gowning Lockers' },
    { position: [-3, 1.6, -5] as Vec3, type: 'bench', label: 'Gowning Bench' },
    { position: [-4, 1.6, -2] as Vec3, type: 'pass-through', label: 'Pass-Through' },
    { position: [-5, 1.6, 1] as Vec3, type: 'tool', label: 'Process Tool' },
    { position: [-3, 1.6, 1] as Vec3, type: 'tool', label: 'Process Tool' },
    { position: [-1, 1.6, 1] as Vec3, type: 'tool', label: 'Process Tool' },
    { position: [1, 1.6, 1] as Vec3, type: 'tool', label: 'Process Tool' },
    { position: [3, 1.6, 1] as Vec3, type: 'tool', label: 'Process Tool' },
    { position: [4, 1.6, -2] as Vec3, type: 'monitor', label: 'Particle Monitor' },
    { position: [7, 1.6, -5] as Vec3, type: 'ahu', label: 'AHU' },
    { position: [7, 1.6, 1] as Vec3, type: 'ahu', label: 'AHU' },
  ];

  return (
    <group ref={groupRef}>
      {/* Floor grid */}
      <gridHelper args={[20, 1, 0x1a1a2e, 0x2a2a4a]} />

      {/* Zones */}
      {zones.map((zone) => (
        <CleanroomZone key={zone.id} zone={zone} />
      ))}

      {/* Equipment */}
      {equipment.map((eq, i) => (
        <CleanroomEquipment key={i} position={eq.position} type={eq.type} label={eq.label} />
      ))}

      {/* HEPA ceiling representation */}
      <HEPACeiling />

      {/* Airflow visualization */}
      <AirflowVisualization />
    </group>
  );
}

function CleanroomZone({ zone }: { zone: Zone }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <group
      position={zone.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Floor */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[zone.size[0], zone.size[2]]} />
        <meshStandardMaterial
          color={zone.color}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 0, zone.size[2] / 2]} scale={[zone.size[0], 3, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color={zone.color} transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 0, -zone.size[2] / 2]} scale={[zone.size[0], 3, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color={zone.color} transparent opacity={0.2} />
      </mesh>
      <mesh position={[zone.size[0] / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[zone.size[2], 3, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color={zone.color} transparent opacity={0.2} />
      </mesh>
      <mesh position={[-zone.size[0] / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[zone.size[2], 3, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color={zone.color} transparent opacity={0.2} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[zone.size[0], zone.size[2]]} />
        <meshStandardMaterial color={0xffffff} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      <Html position={[0, 2, 0]} transform>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-pre-line text-center">
          <div className="font-mono">{zone.label}</div>
        </div>
      </Html>
    </group>
  );
}

function CleanroomEquipment({ position, type, label }: { position: Vec3; type: string; label: string }) {
  const colors: Record<string, number> = {
    locker: 0x2a2a4a,
    bench: 0x3a3a5a,
    'pass-through': 0x4a4a6a,
    tool: 0x1a5c2e,
    monitor: 0xe94560,
    ahu: 0x5c4a1a,
  };

  const geometries: Record<string, React.ReactNode> = {
    locker: <boxGeometry args={[1.2, 1.8, 0.6]} />,
    bench: <boxGeometry args={[1.5, 0.4, 0.6]} />,
    'pass-through': <boxGeometry args={[0.8, 0.8, 0.6]} />,
    tool: <boxGeometry args={[1.2, 1.5, 1.2]} />,
    monitor: <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />,
    ahu: <boxGeometry args={[2, 2, 1.5]} />,
  };

  return (
    <group position={position}>
      <mesh>
        {geometries[type] ?? geometries.tool}
        <meshStandardMaterial color={colors[type] ?? 0x4a4a6a} metalness={0.3} roughness={0.6} />
      </mesh>
      <Html position={[0, 1.5, 0]} transform>
        <div className="bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
          {label}
        </div>
      </Html>
    </group>
  );
}

function HEPACeiling() {
  const tiles: { x: number; z: number }[] = [];
  for (let x = -8; x <= 8; x += 2) {
    for (let z = -8; z <= 8; z += 2) {
      tiles.push({ x, z });
    }
  }

  return (
    <group position={[0, 3.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {tiles.map((tile, i) => (
        <mesh key={i} position={[tile.x, 0, tile.z]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshStandardMaterial
            color={0xffffff}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            wireframe={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function AirflowVisualization() {
  const particlesRef = React.useRef<THREE.Points>(null);
  const [particles] = React.useState(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    const velocities = new Float32Array(200 * 3);

    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = 3 + Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      // Downward velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = -0.5 - Math.random() * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      colors[i * 3] = 0.3 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 1;
    }

    return { positions, colors, velocities };
  });

  useFrame((_, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const velocities = particles.velocities;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * delta * 10;
        positions[i + 1] += velocities[i + 1] * delta * 10;
        positions[i + 2] += velocities[i + 2] * delta * 10;

        // Reset when hitting floor
        if (positions[i + 1] < -1.5) {
          positions[i] = (Math.random() - 0.5) * 16;
          positions[i + 1] = 3.5;
          positions[i + 2] = (Math.random() - 0.5) * 16;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={200} itemSize={3} array={particles.positions} />
        <bufferAttribute attach="attributes-color" count={200} itemSize={3} array={particles.colors} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Equipment Assessment 3D Model
function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function EquipmentModel({ modelUrl, annotations = [] }: { modelUrl?: string; annotations?: { position: Vec3; text: string }[] }) {
  return (
    <group>
      {modelUrl ? (
        <React.Suspense fallback={null}>
          <GltfModel url={modelUrl} />
        </React.Suspense>
      ) : (
        <DefaultEquipment annotations={annotations} />
      )}
    </group>
  );
}

function DefaultEquipment({ annotations }: { annotations: { position: Vec3; text: string }[] }) {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[2, 1.5, 1.5]} />
        <meshStandardMaterial color={0x2a2a4a} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Control panel */}
      <mesh position={[1.05, 0, 0]}>
        <boxGeometry args={[0.1, 0.8, 0.6]} />
        <meshStandardMaterial color={0x1a1a2e} metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Display */}
      <mesh position={[1.08, 0.2, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color={0x00d4ff} emissive={0x00d4ff} emissiveIntensity={0.5} />
      </mesh>

      {/* Ports */}
      {[-0.5, 0, 0.5].map((y, i) => (
        <mesh key={i} position={[-1.05, y, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
          <meshStandardMaterial color={0x4a4a6a} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Annotations */}
      {annotations.map((ann, i) => (
        <Annotation key={i} position={ann.position} text={ann.text} />
      ))}
    </group>
  );
}

function Annotation({ position, text }: { position: Vec3; text: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={0xe94560} emissive={0xe94560} emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.3, 0]} transform>
        <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-red-500/50">
          {text}
        </div>
      </Html>
    </group>
  );
}

// Main 3D Scene Component
interface Scene3DProps {
  type: 'gas-piping' | 'cleanroom' | 'equipment';
  modelUrl?: string;
  annotations?: { position: Vec3; text: string }[];
  className?: string;
}

export function Scene3D({ type, modelUrl, annotations = [], className = '' }: Scene3DProps) {
  return (
    <div className={cn('w-full h-[500px] rounded-lg overflow-hidden', className)}>
      <Canvas
        camera={{ position: [8, 6, 8], fov: 45 }}
        style={{ outline: 'none' }}
      >
        <color attach="background" args={['#0a0a0f']} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.8} />
        <pointLight position={[0, 5, 0]} intensity={1} color={0x00d4ff} />

        {/* Scene content based on type */}
        {type === 'gas-piping' && <GasPipingSystem />}
        {type === 'cleanroom' && <CleanroomLayout />}
        {type === 'equipment' && <EquipmentModel modelUrl={modelUrl} annotations={annotations} />}

        <ContactShadows position={[0, -2.8, 0]} opacity={0.3} scale={25} blur={4} />

        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
