import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  useGLTF, 
  Text, 
  Sky, 
  PerspectiveCamera,
  Html,
  useAnimations
} from '@react-three/drei';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { Box, Flex, Button, Text as ChakraText, Spinner, useToast } from '@chakra-ui/react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

// Define Model component for virtual idol
function IdolModel({ position, modelUrl, animationName }: { position: [number, number, number], modelUrl: string, animationName?: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, group);
  
  useEffect(() => {
    if (animationName && actions[animationName]) {
      actions[animationName]?.reset().fadeIn(0.5).play();
    }
    return () => {
      if (animationName && actions[animationName]) {
        actions[animationName]?.fadeOut(0.5);
      }
    };
  }, [animationName, actions]);

  return (
    <group ref={group} position={position} dispose={null}>
      <primitive object={scene} scale={1} />
    </group>
  );
}

// Define Floor component
function Floor() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0] 
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial 
        attach="material" 
        color="#1a1a2e" 
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

// Stage lighting component
function StageLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} color="#ff57b9" intensity={1.5} />
      <pointLight position={[10, 10, -10]} color="#00ffff" intensity={1.5} />
    </>
  );
}

// Floating text for idol name
function FloatingText({ text, position }: { text: string, position: [number, number, number] }) {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.5}
      color="#ffffff"
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      font="https://fonts.gstatic.com/s/orbitron/v19/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff"
    >
      {text}
    </Text>
  );
}

// Particle effect for the stage
function Particles({ count = 500 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport, camera } = useThree();
  
  // Create a temporary object to hold each particle's position and scale
  const dummy = new THREE.Object3D();
  const particles = Array.from({ length: count }, () => ({
    position: [
      (Math.random() - 0.5) * 20,
      Math.random() * 15,
      (Math.random() - 0.5) * 20
    ],
    scale: Math.random() * 0.5,
    velocity: Math.random() * 0.05 + 0.05
  }));

  useFrame(({ clock }) => {
    if (mesh.current) {
      particles.forEach((particle, i) => {
        const time = clock.getElapsedTime();
        const [x, y, z] = particle.position;
        
        // Update y position for floating effect
        particle.position[1] = y - particle.velocity;
        
        // Reset position if particle goes below the floor
        if (particle.position[1] < 0) {
          particle.position[1] = 15;
        }
        
        // Set position and scale
        dummy.position.set(x, particle.position[1], z);
        dummy.scale.set(particle.scale, particle.scale, particle.scale);
        dummy.updateMatrix();
        
        // Update the instance matrix
        mesh.current.setMatrixAt(i, dummy.matrix);
      });
      
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial 
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

// Control panel component
function ControlPanel({ onStartPerformance, isPerforming }: { onStartPerformance: () => void, isPerforming: boolean }) {
  return (
    <Html position={[0, 1, -5]} transform>
      <Box
        bg="rgba(0, 0, 0, 0.7)"
        p={4}
        borderRadius="md"
        border="1px solid #ff57b9"
        width="300px"
        color="white"
        textAlign="center"
        backdropFilter="blur(10px)"
      >
        <ChakraText fontWeight="bold" mb={2}>Virtual Stage Controls</ChakraText>
        <Button
          colorScheme="pink"
          onClick={onStartPerformance}
          isDisabled={isPerforming}
          size="sm"
          width="100%"
        >
          {isPerforming ? 'Performance in Progress' : 'Start Performance'}
        </Button>
      </Box>
    </Html>
  );
}

// Main MetaverseStage component
const MetaverseStage: React.FC = () => {
  const [isPerforming, setIsPerforming] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string | undefined>(undefined);
  const toast = useToast();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Mock idol data - in a real app, this would come from Redux store
  const idol = {
    name: "Cyber Nova",
    modelUrl: "https://models.versearendream.com/idol_1.glb", // Replace with actual model URL
    animations: ["idle", "dance", "wave", "victory"]
  };
  
  // Handle starting a performance
  const handleStartPerformance = () => {
    setIsPerforming(true);
    setCurrentAnimation("dance");
    
    // Move camera to performance view
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 3,
        y: 2,
        z: 5,
        duration: 2,
        ease: "power2.inOut"
      });
    }
    
    // Show toast notification
    toast({
      title: "Performance Started",
      description: `${idol.name} is now performing for the audience!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // End performance after 30 seconds
    setTimeout(() => {
      setIsPerforming(false);
      setCurrentAnimation("idle");
      
      // Reset camera
      if (cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: 0,
          y: 2,
          z: 8,
          duration: 1.5,
          ease: "power2.inOut"
        });
      }
    }, 30000);
  };
  
  return (
    <Box width="100%" height="80vh" position="relative">
      <Canvas shadows>
        <PerspectiveCamera 
          makeDefault 
          ref={cameraRef} 
          position={[0, 2, 8]} 
          fov={60}
        />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2 - 0.1} />
        
        <fog attach="fog" args={['#1a1a2e', 10, 40]} />
        <Sky sunPosition={[100, 10, 100]} />
        <StageLighting />
        
        <Physics>
          <Floor />
          <Suspense fallback={null}>
            <IdolModel 
              position={[0, 0.5, 0]} 
              modelUrl={idol.modelUrl}
              animationName={currentAnimation}
            />
            <Environment preset="night" />
            <Particles />
          </Suspense>
        </Physics>
        
        <FloatingText text={idol.name} position={[0, 3, 0]} />
        <ControlPanel onStartPerformance={handleStartPerformance} isPerforming={isPerforming} />
      </Canvas>
      
      {/* Loading indicator */}
      <Suspense fallback={
        <Flex 
          position="absolute" 
          top="50%" 
          left="50%" 
          transform="translate(-50%, -50%)"
          direction="column"
          align="center"
        >
          <Spinner size="xl" color="#ff57b9" thickness="4px" />
          <ChakraText color="white" mt={4}>Loading Metaverse Stage...</ChakraText>
        </Flex>
      } />
    </Box>
  );
};

export default MetaverseStage; 