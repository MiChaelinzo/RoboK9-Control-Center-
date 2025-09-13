import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import { Vector3, Color } from 'three';
import { DogStatus } from '../types';

interface Robot3DVisualizationProps {
  dogStatus: DogStatus;
  onRobotClick?: (part: string) => void;
}

interface RobotPartProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const RobotPart: React.FC<RobotPartProps & { geometry: 'box' | 'sphere' | 'cylinder'; size: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
  color,
  onClick,
  geometry,
  size,
  children
}) => {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.color.setHex(hovered ? 0x00ff00 : new Color(color).getHex());
    }
  });

  const GeometryComponent = geometry === 'box' ? Box : geometry === 'sphere' ? Sphere : Cylinder;

  return (
    <group position={position} rotation={rotation}>
      <GeometryComponent
        ref={meshRef}
        args={size}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={color} />
      </GeometryComponent>
      {children}
    </group>
  );
};

const RobotDog: React.FC<{ status: DogStatus; onPartClick?: (part: string) => void }> = ({ status, onPartClick }) => {
  const groupRef = useRef<any>();
  const [animationPhase, setAnimationPhase] = useState(0);

  useFrame((state) => {
    if (groupRef.current) {
      // Animate based on robot status
      if (status.currentAction === 'Dance') {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.1;
      } else if (status.currentAction === 'Patrol') {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      } else if (status.currentAction.includes('Move')) {
        groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 3) * 0.05;
      }
    }
    setAnimationPhase(state.clock.elapsedTime);
  });

  const getStatusColor = () => {
    if (!status.online) return '#666666';
    if (status.intruderDetected) return '#ff0000';
    if (status.battery < 20) return '#ff6600';
    return '#00ff00';
  };

  const getLegPosition = (legIndex: number): [number, number, number] => {
    const basePositions: [number, number, number][] = [
      [-0.8, -0.5, 0.6],  // Front left
      [0.8, -0.5, 0.6],   // Front right
      [-0.8, -0.5, -0.6], // Back left
      [0.8, -0.5, -0.6]   // Back right
    ];

    const base = basePositions[legIndex];
    
    // Animate legs based on action
    if (status.currentAction.includes('Move')) {
      const offset = Math.sin(animationPhase * 4 + legIndex * Math.PI / 2) * 0.1;
      return [base[0], base[1] + offset, base[2]];
    }
    
    return base;
  };

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <RobotPart
        position={[0, 0, 0]}
        color={getStatusColor()}
        geometry="box"
        size={[1.5, 0.6, 1.2]}
        onClick={() => onPartClick?.('body')}
      >
        {/* Status Indicator */}
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {status.currentAction}
        </Text>
      </RobotPart>

      {/* Head */}
      <RobotPart
        position={[0, 0.5, 0.8]}
        color={status.cameraActive ? '#00ffff' : '#888888'}
        geometry="box"
        size={[0.6, 0.4, 0.4]}
        onClick={() => onPartClick?.('head')}
      >
        {/* Eyes/Cameras */}
        <Sphere args={[0.05]} position={[-0.15, 0.1, 0.2]}>
          <meshStandardMaterial color={status.nightVisionMode ? '#ff0000' : '#ffffff'} />
        </Sphere>
        <Sphere args={[0.05]} position={[0.15, 0.1, 0.2]}>
          <meshStandardMaterial color={status.nightVisionMode ? '#ff0000' : '#ffffff'} />
        </Sphere>
      </RobotPart>

      {/* Legs */}
      {[0, 1, 2, 3].map(legIndex => (
        <group key={legIndex}>
          {/* Upper leg */}
          <RobotPart
            position={getLegPosition(legIndex)}
            color="#666666"
            geometry="cylinder"
            size={[0.08, 0.4, 0.08]}
            onClick={() => onPartClick?.(`leg${legIndex}`)}
          />
          {/* Lower leg */}
          <RobotPart
            position={[getLegPosition(legIndex)[0], getLegPosition(legIndex)[1] - 0.4, getLegPosition(legIndex)[2]]}
            color="#444444"
            geometry="cylinder"
            size={[0.06, 0.3, 0.06]}
            onClick={() => onPartClick?.(`foot${legIndex}`)}
          />
          {/* Foot */}
          <Sphere 
            args={[0.08]} 
            position={[getLegPosition(legIndex)[0], getLegPosition(legIndex)[1] - 0.7, getLegPosition(legIndex)[2]]}
          >
            <meshStandardMaterial color="#222222" />
          </Sphere>
        </group>
      ))}

      {/* Tail */}
      <RobotPart
        position={[0, 0.2, -0.8]}
        rotation={[0, 0, status.emotion === 'happy' ? Math.sin(animationPhase * 3) * 0.3 : 0]}
        color="#888888"
        geometry="cylinder"
        size={[0.05, 0.3, 0.05]}
        onClick={() => onPartClick?.('tail')}
      />

      {/* Battery Indicator */}
      <group position={[-0.8, 0.4, 0]}>
        <Box args={[0.2, 0.1, 0.05]}>
          <meshStandardMaterial color="#333333" />
        </Box>
        <Box 
          args={[0.18 * (status.battery / 100), 0.08, 0.06]} 
          position={[0, 0, 0.01]}
        >
          <meshStandardMaterial color={status.battery > 50 ? '#00ff00' : status.battery > 20 ? '#ffff00' : '#ff0000'} />
        </Box>
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.05}
          color="white"
          anchorX="center"
        >
          {status.battery}%
        </Text>
      </group>

      {/* Emotion Indicator */}
      <group position={[0, 0.8, 0.8]}>
        <Text
          fontSize={0.2}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          {status.emotion === 'happy' ? '😊' : 
           status.emotion === 'excited' ? '🤩' :
           status.emotion === 'alert' ? '👀' :
           status.emotion === 'sleepy' ? '😴' :
           status.emotion === 'protective' ? '🛡️' : '🤖'}
        </Text>
      </group>
    </group>
  );
};

const Robot3DVisualization: React.FC<Robot3DVisualizationProps> = ({ dogStatus, onRobotClick }) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handlePartClick = (part: string) => {
    setSelectedPart(part);
    onRobotClick?.(part);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">3D Robot Visualization</h3>
        {selectedPart && (
          <div className="text-sm text-cyan-400">
            Selected: {selectedPart}
          </div>
        )}
      </div>
      
      <div className="h-96 w-full rounded-lg overflow-hidden bg-slate-800">
        <Canvas camera={{ position: [3, 2, 3], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <RobotDog status={dogStatus} onPartClick={handlePartClick} />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
          
          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          
          {/* Grid */}
          <gridHelper args={[10, 10, '#333333', '#333333']} position={[0, -0.99, 0]} />
        </Canvas>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-2 bg-slate-800/50 rounded">
          <div className="text-slate-400">Status</div>
          <div className={`font-medium ${dogStatus.online ? 'text-green-400' : 'text-red-400'}`}>
            {dogStatus.online ? 'Online' : 'Offline'}
          </div>
        </div>
        
        <div className="p-2 bg-slate-800/50 rounded">
          <div className="text-slate-400">Battery</div>
          <div className={`font-medium ${
            dogStatus.battery > 50 ? 'text-green-400' : 
            dogStatus.battery > 20 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {dogStatus.battery}%
          </div>
        </div>
        
        <div className="p-2 bg-slate-800/50 rounded">
          <div className="text-slate-400">Action</div>
          <div className="text-white font-medium">{dogStatus.currentAction}</div>
        </div>
        
        <div className="p-2 bg-slate-800/50 rounded">
          <div className="text-slate-400">Emotion</div>
          <div className="text-white font-medium capitalize">{dogStatus.emotion}</div>
        </div>
      </div>
    </div>
  );
};

export default Robot3DVisualization;