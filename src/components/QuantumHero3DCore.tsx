import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/* ========================================================================= */
/* THREE.JS 3D SPATIAL QUANTUM CORE (Interactive WebGL Hero Scene)           */
/* ========================================================================= */
interface QuantumHero3DCoreProps {
  isPaused: boolean;
  cameraMode: 'orbit' | 'topdown' | 'closeup';
  theme: 'dark' | 'light';
  activeSubholdingIndex: number | null;
}

const QuantumHero3DCore: React.FC<QuantumHero3DCoreProps> = ({
  isPaused,
  cameraMode,
  theme,
  activeSubholdingIndex
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const stateRef = useRef({
    isPaused,
    cameraMode,
    activeSubholdingIndex,
    pointerX: 0,
    pointerY: 0
  });

  useEffect(() => {
    stateRef.current.isPaused = isPaused;
    stateRef.current.cameraMode = cameraMode;
    stateRef.current.activeSubholdingIndex = activeSubholdingIndex;
  }, [isPaused, cameraMode, activeSubholdingIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebGlAvailable(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebGlAvailable(false);
      return;
    }

    const initW = Math.max(container.clientWidth || 0, 320);
    const initH = Math.max(container.clientHeight || 0, 360);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, initW / initH, 0.1, 100);
    camera.position.set(0, 3.2, 11.5);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initW, initH);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting — Apple VisionOS spatial studio rig
    const ambientLight = new THREE.AmbientLight(theme === 'light' ? 0xffffff : 0x9bb8ff, theme === 'light' ? 1.4 : 0.85);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(6, 10, 8);
    const blueRimLight = new THREE.PointLight(0x0071e3, 8, 28);
    blueRimLight.position.set(-6, 3, 5);
    const cyanFillLight = new THREE.PointLight(0x2997ff, 6, 25);
    cyanFillLight.position.set(6, -4, 4);
    const emeraldAccentLight = new THREE.PointLight(0x30d158, 4, 20);
    emeraldAccentLight.position.set(0, -5, -4);

    scene.add(ambientLight, keyLight, blueRimLight, cyanFillLight, emeraldAccentLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Motherholding Core (QuantumInitium Ltd London)
    const coreGeo = new THREE.IcosahedronGeometry(1.18, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: theme === 'light' ? 0x0071e3 : 0x0a192f,
      emissive: 0x0071e3,
      emissiveIntensity: theme === 'light' ? 0.35 : 0.65,
      metalness: 0.4,
      roughness: 0.15,
      transmission: 0.45,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Outer Platinum Wireframe Cage around Motherholding
    const cageGeo = new THREE.IcosahedronGeometry(1.48, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x2997ff,
      wireframe: true,
      transparent: true,
      opacity: 0.32
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(cageMesh);

    // 2. Five Gyroscopic Orbital Rings (5 Ring-fenced Subholdings)
    const ringColors = [0x2997ff, 0x0071e3, 0x30d158, 0x5e5ce6, 0x64d2ff];
    const rings: THREE.Mesh[] = [];
    const ringRadii = [2.4, 3.0, 3.6, 4.2, 4.8];

    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.018, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx % ringColors.length],
        transparent: true,
        opacity: 0.38
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3 + (idx - 2) * 0.18;
      ring.rotation.y = idx * 0.25;
      rootGroup.add(ring);
      rings.push(ring);
    });

    // 3. Twelve Operating Entity Nodes in 3D Orbit + Energy Filaments to Core
    const satellites: {
      group: THREE.Group;
      mesh: THREE.Mesh;
      line: THREE.Line;
      radius: number;
      speed: number;
      angle: number;
      tilt: number;
      subIdx: number;
    }[] = [];

    for (let i = 0; i < 12; i++) {
      const subIdx = i % 5;
      const radius = ringRadii[subIdx];
      const angle = (i / 12) * Math.PI * 2;
      const tilt = (subIdx - 2) * 0.22;

      const satGroup = new THREE.Group();
      const satGeo = new THREE.SphereGeometry(0.16, 24, 24);
      const satMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: ringColors[subIdx],
        emissiveIntensity: 0.9,
        metalness: 0.3,
        roughness: 0.2
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satGroup.add(satMesh);

      // Subtle halo ring around each entity node
      const haloGeo = new THREE.RingGeometry(0.22, 0.27, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: ringColors[subIdx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      satGroup.add(haloMesh);

      rootGroup.add(satGroup);

      // Filament line to Motherholding Core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: ringColors[subIdx],
        transparent: true,
        opacity: 0.22
      });
      const line = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(line);

      satellites.push({
        group: satGroup,
        mesh: satMesh,
        line,
        radius,
        speed: 0.28 + (i % 4) * 0.07,
        angle,
        tilt,
        subIdx
      });
    }

    // 4. Ambient Starfield / Spatial Dust Particles
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 5.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x2997ff,
      size: 0.045,
      transparent: true,
      opacity: 0.55
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleCloud);

    // Pointer interaction
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      stateRef.current.pointerX = x;
      stateRef.current.pointerY = y;
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let rafId = 0;
    let clock = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const { isPaused: paused, cameraMode: mode, activeSubholdingIndex: activeSub, pointerX, pointerY } = stateRef.current;

      if (!paused) {
        clock += 0.008;
      }

      // Smooth camera transition based on preset + pointer parallax
      let targetCamX = pointerX * 1.4;
      let targetCamY = 3.0 + pointerY * 1.1;
      let targetCamZ = 11.2;

      if (mode === 'topdown') {
        targetCamX = pointerX * 0.8;
        targetCamY = 11.5;
        targetCamZ = 2.2;
      } else if (mode === 'closeup') {
        targetCamX = pointerX * 0.9;
        targetCamY = 1.4 + pointerY * 0.6;
        targetCamZ = 6.8;
      }

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate Core & Cage
      coreMesh.rotation.y = clock * 0.7;
      coreMesh.rotation.x = Math.sin(clock * 0.5) * 0.25;
      cageMesh.rotation.y = -clock * 0.45;
      cageMesh.rotation.z = clock * 0.3;

      const pulseScale = 1 + Math.sin(clock * 2.2) * 0.035;
      coreMesh.scale.setScalar(pulseScale);

      // Update Rings
      rings.forEach((ring, idx) => {
        ring.rotation.z = clock * (0.2 + idx * 0.05) * (idx % 2 === 0 ? 1 : -1);
        const mat = ring.material as THREE.MeshBasicMaterial;
        const isHighlighted = activeSub === null || activeSub === idx;
        mat.opacity = isHighlighted ? (activeSub === idx ? 0.85 : 0.36) : 0.1;
      });

      // Update 12 Entity Satellites & Energy Filaments
      satellites.forEach((sat) => {
        const currentAngle = sat.angle + clock * sat.speed;
        const x = Math.cos(currentAngle) * sat.radius;
        const z = Math.sin(currentAngle) * sat.radius;
        const y = Math.sin(currentAngle * 2 + sat.tilt) * (sat.radius * 0.24);

        sat.group.position.set(x, y, z);
        sat.group.lookAt(camera.position);

        const isHighlighted = activeSub === null || activeSub === sat.subIdx;
        const satScale = isHighlighted ? (activeSub === sat.subIdx ? 1.45 : 1.0) : 0.65;
        sat.group.scale.setScalar(satScale);

        const posArr = sat.line.geometry.attributes.position.array as Float32Array;
        posArr[0] = 0;
        posArr[1] = 0;
        posArr[2] = 0;
        posArr[3] = x;
        posArr[4] = y;
        posArr[5] = z;
        sat.line.geometry.attributes.position.needsUpdate = true;

        const lineMat = sat.line.material as THREE.LineBasicMaterial;
        lineMat.opacity = isHighlighted ? (activeSub === sat.subIdx ? 0.55 : 0.2) : 0.05;
      });

      particleCloud.rotation.y = clock * 0.12;

      try {
        renderer.render(scene, camera);
      } catch {
        // Ignore frame render error
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      try {
        renderer.dispose();
      } catch {
        // Safe disposal
      }
    };
  }, [theme]);

  if (!webGlAvailable) {
    return (
      <div className="w-full h-full min-h-[360px] sm:min-h-[440px] flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#070e1c] to-black">
        <div className="relative flex items-center justify-center p-8">
          <div className="w-64 h-64 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute w-48 h-48 rounded-full border border-blue-500/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
          <div className="absolute w-32 h-32 rounded-full border border-amber-400/40 animate-pulse" />
          <div className="absolute w-20 h-20 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 p-3 shadow-2xl flex items-center justify-center">
            <img src="/favicon.svg" alt="Quantum Initium" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full min-h-[360px] sm:min-h-[440px]" />;
};

export default QuantumHero3DCore;
