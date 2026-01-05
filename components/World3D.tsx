'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WorldConfig } from '@/types/memory';

interface World3DProps {
  config: WorldConfig;
  onPositionUpdate?: (position: { x: number; y: number; z: number }) => void;
  className?: string;
}

export default function World3D({ config, onPositionUpdate, className = '' }: World3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Set initial camera position
    if (config.initialPosition) {
      camera.position.set(
        config.initialPosition.x,
        config.initialPosition.y,
        config.initialPosition.z
      );
    } else {
      camera.position.set(0, 0, 0);
    }

    // Load world based on type
    if (config.type === 'panorama') {
      // Load 360° panorama
      const loader = new THREE.TextureLoader();
      loader.load(
        config.url,
        (texture) => {
          // Create sphere geometry for panorama
          const geometry = new THREE.SphereGeometry(500, 60, 40);
          geometry.scale(-1, 1, 1); // Invert sphere
          
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
          
          setIsLoading(false);
        },
        undefined,
        (err) => {
          console.error('Error loading panorama:', err);
          setError('Failed to load 3D world');
          setIsLoading(false);
        }
      );
    } else {
      // For 3D scenes, you'd load a GLTF or other 3D format
      // For now, we'll use a placeholder
      const loader = new THREE.TextureLoader();
      loader.load(
        config.url,
        (texture) => {
          const geometry = new THREE.PlaneGeometry(10, 10);
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
          setIsLoading(false);
        },
        undefined,
        (err) => {
          console.error('Error loading scene:', err);
          setError('Failed to load 3D world');
          setIsLoading(false);
        }
      );
    }

    // Add points of interest markers
    if (config.pointsOfInterest) {
      config.pointsOfInterest.forEach((poi) => {
        if (poi.unlocked) {
          const geometry = new THREE.SphereGeometry(0.5, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
          const marker = new THREE.Mesh(geometry, material);
          marker.position.set(poi.position.x, poi.position.y, poi.position.z);
          scene.add(marker);
        }
      });
    }

    // Store scene reference
    sceneRef.current = { scene, camera, renderer };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (sceneRef.current) {
        // Update position callback
        if (onPositionUpdate) {
          onPositionUpdate({
            x: sceneRef.current.camera.position.x,
            y: sceneRef.current.camera.position.y,
            z: sceneRef.current.camera.position.z,
          });
        }
        
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [config, onPositionUpdate]);

  // Expose camera controls for bio-controller
  useEffect(() => {
    if (sceneRef.current) {
      // Store reference globally for bio-controller access
      (window as any).__world3d_camera = sceneRef.current.camera;
    }
  }, [sceneRef.current]);

  return (
    <div ref={mountRef} className={`w-full h-full relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading 3D World...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/50 z-10">
          <div className="text-white text-center">
            <p className="text-xl font-bold mb-2">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to move camera (called by bio-controller)
export function moveCameraForward(distance: number) {
  const camera = (window as any).__world3d_camera as THREE.PerspectiveCamera;
  if (camera) {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.addScaledVector(direction, distance);
  }
}

export function rotateCamera(angle: number) {
  const camera = (window as any).__world3d_camera as THREE.PerspectiveCamera;
  if (camera) {
    camera.rotateY(angle);
  }
}

export function setCameraPosition(x: number, y: number, z: number) {
  const camera = (window as any).__world3d_camera as THREE.PerspectiveCamera;
  if (camera) {
    camera.position.set(x, y, z);
  }
}

