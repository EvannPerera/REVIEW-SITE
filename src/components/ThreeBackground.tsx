import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    // Particle systems
    let particlesMesh: THREE.Points;
    let embersMesh: THREE.Points;

    // Mouse tracking for parallax & repulsion
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    try {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050505, 0.0018);

      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 100;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // --- 1. Background Red Dust Particle Field ---
      const particleCount = isMobile ? 650 : 2200;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 350;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        velocities[i * 3] = (Math.random() - 0.5) * 0.04;
        velocities[i * 3 + 1] = 0.03 + Math.random() * 0.08; // Gentle upward drift
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

        sizes[i] = Math.random() * 2.2 + 0.8;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Circular particle texture generator
      const createParticleTexture = (color: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.3, 'rgba(255, 23, 68, 0.7)');
          gradient.addColorStop(0.7, 'rgba(176, 0, 32, 0.25)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 64, 64);
        }
        return new THREE.CanvasTexture(canvas);
      };

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xFF1744,
        size: isMobile ? 3.0 : 4.5,
        map: createParticleTexture('#FFFFFF'),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particlesMesh);

      // --- 2. Floating Glowing Embers ---
      const emberCount = isMobile ? 120 : 350;
      const emberGeometry = new THREE.BufferGeometry();
      const emberPositions = new Float32Array(emberCount * 3);
      const emberVelocities = new Float32Array(emberCount * 3);

      for (let i = 0; i < emberCount; i++) {
        emberPositions[i * 3] = (Math.random() - 0.5) * 280;
        emberPositions[i * 3 + 1] = (Math.random() - 0.5) * 220;
        emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 180 + 20;

        emberVelocities[i * 3] = (Math.random() - 0.5) * 0.06;
        emberVelocities[i * 3 + 1] = 0.08 + Math.random() * 0.16; // Faster floating embers
        emberVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
      }

      emberGeometry.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

      const emberMaterial = new THREE.PointsMaterial({
        color: 0xFF5252,
        size: isMobile ? 4.5 : 7.0,
        map: createParticleTexture('#FFF1F2'),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      embersMesh = new THREE.Points(emberGeometry, emberMaterial);
      scene.add(embersMesh);

      // --- Event Listeners ---
      const onMouseMove = (e: MouseEvent) => {
        // Normalized coordinates [-1, 1]
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      const onResize = () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });

      // Handle visibility changes to conserve battery/CPU
      let isVisible = true;
      const onVisibilityChange = () => {
        isVisible = document.visibilityState === 'visible';
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      // --- Animation Loop ---
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isVisible) return;

        const elapsedTime = clock.getElapsedTime();

        // Parallax camera lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        camera.position.x = mouse.x * 12;
        camera.position.y = mouse.y * 8;
        camera.lookAt(0, 0, 0);

        if (!prefersReducedMotion) {
          // Animate particle field
          const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
          const posArray = posAttr.array as Float32Array;

          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            posArray[idx + 1] += velocities[idx + 1];
            posArray[idx] += velocities[idx] + Math.sin(elapsedTime * 0.5 + i) * 0.02;

            // Loop back when reaching top
            if (posArray[idx + 1] > 150) {
              posArray[idx + 1] = -150;
              posArray[idx] = (Math.random() - 0.5) * 400;
            }
          }
          posAttr.needsUpdate = true;

          // Animate glowing embers with swirling motion
          const emberPosAttr = emberGeometry.attributes.position as THREE.BufferAttribute;
          const emberPosArray = emberPosAttr.array as Float32Array;

          for (let i = 0; i < emberCount; i++) {
            const idx = i * 3;
            emberPosArray[idx + 1] += emberVelocities[idx + 1];
            emberPosArray[idx] += Math.sin(elapsedTime * 0.8 + i) * 0.04;
            emberPosArray[idx + 2] += Math.cos(elapsedTime * 0.7 + i) * 0.03;

            // Loop back
            if (emberPosArray[idx + 1] > 110) {
              emberPosArray[idx + 1] = -110;
              emberPosArray[idx] = (Math.random() - 0.5) * 280;
            }
          }
          emberPosAttr.needsUpdate = true;

          // Subtle pulse in ember brightness
          emberMaterial.opacity = 0.75 + Math.sin(elapsedTime * 2.0) * 0.2;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);

        // Resource disposal
        if (particleGeometry) particleGeometry.dispose();
        if (particleMaterial) particleMaterial.dispose();
        if (emberGeometry) emberGeometry.dispose();
        if (emberMaterial) emberMaterial.dispose();
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn('Three.js WebGL context initialization error, using CSS fallback:', err);
      setWebGLFailed(true);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="three-background-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Cinematic ambient red vignette & light haze overlays */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 50% 20%, rgba(255, 23, 68, 0.08) 0%, rgba(5, 5, 5, 0) 65%),
            radial-gradient(circle at 10% 90%, rgba(176, 0, 32, 0.06) 0%, rgba(5, 5, 5, 0) 55%),
            radial-gradient(ellipse at center, transparent 35%, rgba(5, 5, 5, 0.95) 100%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle red neon beam */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '30%',
          width: '40%',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(255, 23, 68, 0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* CSS-only fallback if WebGL fails */}
      {webGLFailed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 30%, #1a0408 0%, #050505 85%)',
          }}
        />
      )}
    </div>
  );
};
