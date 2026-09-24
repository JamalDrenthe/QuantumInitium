import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { ecosystemData } from '../data/ecosystem';
import { EntityItem } from '../types';

export interface EcosystemCanvasHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  setCameraPreset: (preset: 'orbit' | 'topdown' | 'cinematic') => void;
}

interface EcosystemCanvasProps {
  selectedNodeKey: string;
  selectedLtdName?: string | null;
  onSelectNode: (key: string, entityName?: string | null) => void;
  autoRotate: boolean;
  velocityMultiplier?: number;
  theme?: 'dark' | 'light';
}

/* Helper om een afgeronde rechthoek te tekenen op canvas */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* Creëert een scherpe holografische sprite tekstlabel boven elk knooppunt */
function createNodeHoloLabel(title: string, subtitle: string, colorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 200);

    /* Achtergrond badge */
    ctx.fillStyle = 'rgba(8, 14, 28, 0.82)';
    drawRoundedRect(ctx, 16, 20, 480, 160, 24);
    ctx.fill();

    /* Neon rand */
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, 16, 20, 480, 160, 24);
    ctx.stroke();

    /* Status indicator stip */
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(60, 80, 10, 0, Math.PI * 2);
    ctx.fill();

    /* Titel */
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(title, 88, 90);

    /* Subtitel */
    ctx.fillStyle = colorHex;
    ctx.font = '22px sans-serif';
    ctx.fillText(subtitle, 88, 138);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.95,
    depthTest: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(4.5, 1.75, 1);
  return sprite;
}

/* Creëert een compacte holografische sprite tekstlabel boven elke entiteit */
function createSmallOrbLabel(name: string, colorHex: string, role?: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 460;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 460, 120);

    /* Achtergrond badge */
    ctx.fillStyle = 'rgba(6, 12, 26, 0.92)';
    drawRoundedRect(ctx, 8, 10, 444, 100, 30);
    ctx.fill();

    /* Neon rand */
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3.5;
    drawRoundedRect(ctx, 8, 10, 444, 100, 30);
    ctx.stroke();

    /* Oplichtende stip */
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(42, 60, 9, 0, Math.PI * 2);
    ctx.fill();

    /* Bepaal hoofdnaam en subtitel */
    let mainName = name;
    let subInfo = '';
    if (name.includes('(')) {
      const parts = name.split('(');
      mainName = parts[0].trim();
      subInfo = parts[1].replace(')', '').trim();
    } else if (role && role.length <= 26) {
      subInfo = role;
    }

    if (subInfo) {
      const nameFontSize = mainName.length > 18 ? 24 : 28;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${nameFontSize}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(mainName, 64, 52);

      ctx.fillStyle = colorHex;
      ctx.font = '600 18px sans-serif';
      ctx.fillText(subInfo, 64, 84);
    } else {
      const nameFontSize = mainName.length > 18 ? 26 : 30;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${nameFontSize}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(mainName, 64, 60);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.95,
    depthTest: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(2.4, 0.62, 1);
  sprite.position.set(0, 0.92, 0);
  sprite.name = 'ltd_label_sprite';
  return sprite;
}

function createSynergyConnectionLabel(text: string, subText: string, colorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 128);

    ctx.fillStyle = 'rgba(10, 15, 30, 0.94)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(16, 16, 480, 96, 48);
    } else {
      ctx.rect(16, 16, 480, 96);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(52, 64, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, 78, 56);

    ctx.fillStyle = colorHex;
    ctx.font = '600 19px sans-serif';
    ctx.fillText(subText, 78, 88);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.95,
    depthTest: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.0, 0.75, 1);
  sprite.name = 'synergy_label_sprite';
  return sprite;
}

export const EcosystemCanvas = forwardRef<EcosystemCanvasHandle, EcosystemCanvasProps>(({
  selectedNodeKey,
  selectedLtdName,
  onSelectNode,
  autoRotate,
  velocityMultiplier = 1,
  theme = 'dark'
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const animatedLtdEntitiesRef = useRef<THREE.Group[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const touchDistanceRef = useRef<number | null>(null);

  /* Auto-rotate ref zodat de WebGL scene niet herstart bij in- of uitschakelen */
  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  /* Update fog dynamically if theme changes */
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.fog = new THREE.FogExp2(theme === 'light' ? 0xe0f2fe : 0x050914, 0.015);
    }
  }, [theme]);

  /* Hover state */
  const [hoveredEntity, setHoveredEntity] = useState<{
    name: string;
    role?: string;
    desc?: string;
    holdco: string;
  } | null>(null);

  /* Imperatieve zoom en camerastand API */
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (!cameraRef.current) return;
      const target = cameraTargetRef.current;
      const offset = cameraRef.current.position.clone().sub(target);
      const currentDist = offset.length();
      const newDist = Math.max(5, currentDist * 0.78);
      offset.setLength(newDist);
      cameraRef.current.position.copy(target).add(offset);
    },
    zoomOut: () => {
      if (!cameraRef.current) return;
      const target = cameraTargetRef.current;
      const offset = cameraRef.current.position.clone().sub(target);
      const currentDist = offset.length();
      const newDist = Math.min(85, currentDist * 1.28);
      offset.setLength(newDist);
      cameraRef.current.position.copy(target).add(offset);
    },
    resetView: () => {
      if (!cameraRef.current) return;
      cameraTargetRef.current.set(0, 0, 0);
      currentLookAtRef.current.set(0, 0, 0);
      cameraRef.current.position.set(0, 16, 32);
      cameraRef.current.lookAt(0, 0, 0);
    },
    setCameraPreset: (preset: 'orbit' | 'topdown' | 'cinematic') => {
      if (!cameraRef.current) return;
      if (preset === 'topdown') {
        cameraTargetRef.current.set(0, 0, 0);
        cameraRef.current.position.set(0, 36, 4);
      } else if (preset === 'cinematic') {
        cameraTargetRef.current.set(0, 2, 0);
        cameraRef.current.position.set(18, 5, 22);
      } else {
        cameraTargetRef.current.set(0, 0, 0);
        cameraRef.current.position.set(0, 16, 32);
      }
    }
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* Initialisatie Scene, Camera en Renderer */
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    /* Subtiele sci fi mist voor ruimtelijke diepte */
    scene.fog = new THREE.FogExp2(theme === 'light' ? 0xe0f2fe : 0x050914, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 16, 32);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    /* Verlichting met rijke kleurcontrasten */
    const ambientLight = new THREE.AmbientLight(0x0c162e, 2.8);
    scene.add(ambientLight);

    const centralGoldLight = new THREE.PointLight(0xffd700, 4.2, 60);
    centralGoldLight.position.set(0, 7, 0);
    scene.add(centralGoldLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3.5, 55);
    cyanLight.position.set(0, 0, 0);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2.5, 45);
    blueLight.position.set(0, -4, 0);
    scene.add(blueLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6);
    directionalLight.position.set(20, 30, 25);
    scene.add(directionalLight);

    /* Luminous Cybernetic Floor Grid */
    const floorY = -6.5;
    const gridHelper = new THREE.GridHelper(70, 46, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = floorY;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    scene.add(gridHelper);

    /* Concentrische pulserende ringen op de grond */
    const concentricFloorRings: THREE.Mesh[] = [];
    const floorRadii = [8, 16, 24, 32];
    floorRadii.forEach((radius, i) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.12, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffd700 : 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.28
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = floorY + 0.05;
      scene.add(ring);
      concentricFloorRings.push(ring);
    });

    /* Radiale pulsgolf over de vloer */
    const pulseWaveGeo = new THREE.RingGeometry(0.1, 0.6, 64);
    const pulseWaveMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const pulseWave = new THREE.Mesh(pulseWaveGeo, pulseWaveMat);
    pulseWave.rotation.x = Math.PI / 2;
    pulseWave.position.y = floorY + 0.08;
    scene.add(pulseWave);

    /* Twinkelend Quantum Sterrenveld */
    const particleCount = 1100;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() * 2 - 1) * 75;
      particlePositions[idx + 1] = (Math.random() * 2 - 1) * 55;
      particlePositions[idx + 2] = (Math.random() * 2 - 1) * 75;

      const dice = Math.random();
      if (dice > 0.7) {
        /* Goud */
        particleColors[idx] = 1.0;
        particleColors[idx + 1] = 0.84;
        particleColors[idx + 2] = 0.0;
      } else if (dice > 0.35) {
        /* Cyaan */
        particleColors[idx] = 0.0;
        particleColors[idx + 1] = 0.94;
        particleColors[idx + 2] = 1.0;
      } else {
        /* Violet */
        particleColors[idx] = 0.72;
        particleColors[idx + 1] = 0.45;
        particleColors[idx + 2] = 1.0;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* Helper voor individuele Ltd dochterondernemingen */
    const createLtdEntityMesh = (
      entity: EntityItem,
      index: number,
      total: number,
      holdColor: string,
      holdcoKey: string
    ): THREE.Group => {
      const entityGroup = new THREE.Group();
      entityGroup.name = `Ltd_${entity.name.replace(/\s+/g, '_')}`;

      const entityColor = new THREE.Color(entity.color || holdColor);
      let geom: THREE.BufferGeometry;

      switch (entity.shape) {
        case 'cube':
          geom = new THREE.BoxGeometry(0.58, 0.58, 0.58);
          break;
        case 'sphere':
          geom = new THREE.SphereGeometry(0.4, 24, 24);
          break;
        case 'cylinder':
          geom = new THREE.CylinderGeometry(0.34, 0.34, 0.7, 20);
          break;
        case 'pyramid':
          geom = new THREE.ConeGeometry(0.45, 0.8, 4);
          break;
        case 'torus':
          geom = new THREE.TorusGeometry(0.38, 0.13, 16, 32);
          break;
        case 'diamond':
        case 'octahedron':
        default:
          geom = new THREE.OctahedronGeometry(0.48, 0);
          break;
      }

      /* Hoofdkernelement */
      const mat = new THREE.MeshStandardMaterial({
        color: entityColor,
        metalness: 0.85,
        roughness: 0.18,
        emissive: entityColor,
        emissiveIntensity: 0.55
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = 'ltd_core_mesh';
      mesh.userData = {
        isLtdEntity: true,
        entityName: entity.name,
        parentHoldcoKey: holdcoKey,
        role: entity.role
      };
      entityGroup.add(mesh);

      /* Externe draaiende wireframe kooi */
      const wireGeo = new THREE.OctahedronGeometry(0.65, 0);
      const wireMat = new THREE.MeshBasicMaterial({
        color: entityColor,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const wireCage = new THREE.Mesh(wireGeo, wireMat);
      wireCage.name = 'ltd_wire_cage';
      entityGroup.add(wireCage);

      /* Roterende holografische microring */
      const miniRingGeo = new THREE.TorusGeometry(0.72, 0.025, 8, 28);
      const miniRingMat = new THREE.MeshBasicMaterial({
        color: entityColor,
        transparent: true,
        opacity: 0.7
      });
      const miniRing = new THREE.Mesh(miniRingGeo, miniRingMat);
      miniRing.rotation.x = Math.PI / 2;
      miniRing.name = 'ltd_mini_ring';
      entityGroup.add(miniRing);

      /* Selectie aura halo */
      const selectAuraGeo = new THREE.RingGeometry(0.78, 0.95, 32);
      const selectAuraMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const selectAura = new THREE.Mesh(selectAuraGeo, selectAuraMat);
      selectAura.rotation.x = Math.PI / 2;
      selectAura.name = 'ltd_select_aura';
      selectAura.visible = false;
      entityGroup.add(selectAura);

      /* Ruime onzichtbare kliktarget */
      const hitTargetGeo = new THREE.SphereGeometry(1.05, 12, 12);
      const hitTargetMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitTarget = new THREE.Mesh(hitTargetGeo, hitTargetMat);
      hitTarget.name = 'ltd_hit_target';
      hitTarget.userData = {
        isLtdEntity: true,
        entityName: entity.name,
        parentHoldcoKey: holdcoKey,
        role: entity.role,
        desc: entity.desc
      };
      entityGroup.add(hitTarget);

      /* Holografisch tekstlabel met de naam van de entiteit standaard zichtbaar */
      const labelSprite = createSmallOrbLabel(entity.name, entity.color || holdColor, entity.role);
      labelSprite.name = 'ltd_label_sprite';
      labelSprite.userData = {
        isLtdEntity: true,
        entityName: entity.name,
        parentHoldcoKey: holdcoKey,
        role: entity.role
      };
      entityGroup.add(labelSprite);

      /* Orbitale baan rondom het holdco platform */
      const orbitRadius = total === 1 ? 0 : 2.6 + (total > 2 ? 0.35 : 0);
      const angle = (index / total) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = 0.85 + (index % 2 === 0 ? 0.25 : -0.25);

      entityGroup.position.set(x, y, z);
      entityGroup.userData = {
        orbitRadius,
        initialAngle: angle,
        orbitSpeed: holdcoKey === 'RealEstate' ? 0.36 : 0.42 + index * 0.16,
        entityName: entity.name,
        entityBadge: entity.badge,
        parentHoldcoKey: holdcoKey,
        isLtdEntity: true,
        role: entity.role,
        desc: entity.desc
      };

      /* Dynamische tether straal naar platform kern */
      if (orbitRadius > 0) {
        const tetherGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0.55, 0),
          new THREE.Vector3(x, y, z)
        ]);
        const tetherMat = new THREE.LineBasicMaterial({
          color: entityColor,
          transparent: true,
          opacity: 0.4
        });
        const tether = new THREE.Line(tetherGeo, tetherMat);
        tether.name = `tether_${index}`;
        entityGroup.userData.tether = tether;
      }

      return entityGroup;
    };

    /* Opbouw van Holdco Knooppunten in Ecosysteem */
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const animatedLtdEntities: THREE.Group[] = [];

    Object.entries(ecosystemData).forEach(([key, data]) => {
      const group = new THREE.Group();
      group.name = data.objectName;
      group.position.set(data.pos[0], data.pos[1], data.pos[2]);
      group.userData = { key, title: data.title, objectName: data.objectName };

      const baseColor = new THREE.Color(data.color);

      if (key === 'Moederholding') {
        /* Centraal Goud Moederholding Platform */
        const coreGeo = new THREE.CylinderGeometry(2.3, 2.8, 0.6, 36);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x1f1906,
          metalness: 0.9,
          roughness: 0.18,
          emissive: 0x3d2c00
        });
        const corePlatform = new THREE.Mesh(coreGeo, coreMat);
        group.add(corePlatform);

        /* Primaire gouden ring */
        const goldRingGeo = new THREE.TorusGeometry(3.3, 0.09, 16, 64);
        const goldRingMat = new THREE.MeshBasicMaterial({
          color: 0xffd700,
          transparent: true,
          opacity: 0.92
        });
        const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
        goldRing.rotation.x = Math.PI / 2;
        goldRing.name = 'ring_gold';
        group.add(goldRing);

        /* Tweede gyroscopische ring */
        const gyroRingGeo = new THREE.TorusGeometry(3.8, 0.04, 12, 64);
        const gyroRingMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.65
        });
        const gyroRing = new THREE.Mesh(gyroRingGeo, gyroRingMat);
        gyroRing.rotation.y = Math.PI / 4;
        gyroRing.name = 'gyro_ring';
        group.add(gyroRing);

        /* Centraal pulserend kristal */
        const crystalGeo = new THREE.OctahedronGeometry(1.3, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0xffea70,
          metalness: 0.35,
          roughness: 0.1,
          emissive: 0xffd700,
          emissiveIntensity: 0.6
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.y = 1.35;
        crystal.name = 'crystal';
        group.add(crystal);

        /* Buitenste gouden kooihalo */
        const haloGeo = new THREE.IcosahedronGeometry(1.8, 1);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xffd700,
          wireframe: true,
          transparent: true,
          opacity: 0.45
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.y = 1.35;
        halo.name = 'halo';
        group.add(halo);

        /* Holografische zwevende titel */
        const label = createNodeHoloLabel('QuantumInitium Ltd', 'Centrale Moederholding', '#ffd700');
        label.position.set(0, 3.8, 0);
        group.add(label);
      } else {
        /* Subholding Platformen */
        const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.4, 24);
        const baseMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.85,
          roughness: 0.22,
          emissive: baseColor,
          emissiveIntensity: 0.28
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        /* Buitenste neonring */
        const ringGeo = new THREE.TorusGeometry(2.1, 0.06, 16, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.name = 'orbital_ring';
        group.add(ring);

        /* Kernpilaar */
        const pillarGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.85, 18);
        const pillarMat = new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.75,
          roughness: 0.2,
          emissive: baseColor,
          emissiveIntensity: 0.45
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.y = 0.6;
        pillar.name = 'center_symbol';
        group.add(pillar);

        /* Holografische zwevende titel */
        const label = createNodeHoloLabel(data.title.replace(' Holdco', ''), data.subTitle, data.color);
        label.position.set(0, 2.9, 0);
        group.add(label);
      }

      /* Genereer satelliet entiteiten voor elke Ltd */
      data.entities.forEach((entity, index) => {
        const ltdGroup = createLtdEntityMesh(entity, index, data.entities.length, data.color, key);
        group.add(ltdGroup);
        if (ltdGroup.userData.tether) {
          group.add(ltdGroup.userData.tether);
        }
        animatedLtdEntities.push(ltdGroup);
      });

      /* Platform Hit Target gefocust op de kern */
      const hitPlatformGeo = new THREE.CylinderGeometry(1.8, 2.0, 1.4, 16);
      const hitPlatformMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitPlatform = new THREE.Mesh(hitPlatformGeo, hitPlatformMat);
      hitPlatform.userData = { parentKey: key };
      group.add(hitPlatform);

      nodesGroup.add(group);
      nodesMapRef.current.set(key, group);
    });

    animatedLtdEntitiesRef.current = animatedLtdEntities;

    /* Directe Synergie Lijn tussen WoningVry Ltd en Afterstudenthousing Ltd */
    const realEstateGroup = nodesMapRef.current.get('RealEstate');
    const woningVryGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('woningvry')
    );
    const afterStudentGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('afterstudenthousing')
    );

    let synergyBeam: THREE.Mesh | null = null;
    let synergyHalo: THREE.Mesh | null = null;
    let synergyArchLine: THREE.Line | null = null;
    let synergyAnchor1: THREE.Mesh | null = null;
    let synergyAnchor2: THREE.Mesh | null = null;
    let synergyBead1: THREE.Mesh | null = null;
    let synergyBead2: THREE.Mesh | null = null;
    let synergyLabel: THREE.Sprite | null = null;

    if (realEstateGroup && woningVryGroup && afterStudentGroup) {
      const synergyGroup = new THREE.Group();
      synergyGroup.name = 'synergy_woningvry_afterstudent_group';

      /* 1. Volumetrische 3D cilindrische gouden lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.09, 0.09, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.6,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      synergyBeam = new THREE.Mesh(beamGeo, beamMat);
      synergyBeam.name = 'woningvry_afterstudent_beam';
      synergyBeam.userData = {
        isSynergyConnection: true,
        entityName: 'WoningVry Ltd',
        parentHoldcoKey: 'RealEstate'
      };
      synergyGroup.add(synergyBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.20, 0.20, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffea70,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      synergyHalo = new THREE.Mesh(haloGeo, haloMat);
      synergyGroup.add(synergyHalo);

      /* 3. Twee fysiek verankerde gouden bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.5,
        metalness: 0.85,
        roughness: 0.2
      });
      synergyAnchor1 = new THREE.Mesh(anchorGeo, anchorMat);
      synergyAnchor2 = new THREE.Mesh(anchorGeo, anchorMat.clone());
      synergyGroup.add(synergyAnchor1);
      synergyGroup.add(synergyAnchor2);

      /* 4. Boogvormige energielijn die over het platform reikt */
      const archPointsCount = 33;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xfffbeb,
        transparent: true,
        opacity: 0.95
      });
      synergyArchLine = new THREE.Line(archGeo, archMat);
      synergyArchLine.frustumCulled = false;
      synergyGroup.add(synergyArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.18, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xfffbeb,
        transparent: true,
        opacity: 0.98
      });
      synergyBead1 = new THREE.Mesh(beadGeo, beadMat1);
      synergyBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      synergyGroup.add(synergyBead1);
      synergyGroup.add(synergyBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      synergyLabel = createSynergyConnectionLabel(
        'WoningVry ⇄ Afterstudenthousing',
        'Directe Vastgoed en Living Synergie',
        '#f59e0b'
      );
      synergyLabel.userData = {
        isSynergyConnection: true,
        entityName: 'WoningVry Ltd',
        parentHoldcoKey: 'RealEstate'
      };
      synergyGroup.add(synergyLabel);

      /* Toevoegen aan nodesGroup op wereldniveau ter voorkoming van transformatiefouten */
      nodesGroup.add(synergyGroup);
    }

    /* Directe Synergie Lijn tussen WoningVry Ltd en Spontiva Ltd (Vastgoed en Compute) */
    const spontivaGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('spontiva')
    );

    let spontivaBeam: THREE.Mesh | null = null;
    let spontivaHalo: THREE.Mesh | null = null;
    let spontivaArchLine: THREE.Line | null = null;
    let spontivaAnchor1: THREE.Mesh | null = null;
    let spontivaAnchor2: THREE.Mesh | null = null;
    let spontivaBead1: THREE.Mesh | null = null;
    let spontivaBead2: THREE.Mesh | null = null;
    let spontivaLabel: THREE.Sprite | null = null;

    if (woningVryGroup && spontivaGroup) {
      const spontivaSynergyGroup = new THREE.Group();
      spontivaSynergyGroup.name = 'synergy_woningvry_spontiva_group';

      /* 1. Volumetrische 3D cilindrische fuchsia lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        emissive: 0xdb2777,
        emissiveIntensity: 1.6,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      spontivaBeam = new THREE.Mesh(beamGeo, beamMat);
      spontivaBeam.name = 'woningvry_spontiva_beam';
      spontivaBeam.userData = {
        isSynergyConnection: true,
        isSpontivaSynergy: true,
        entityName: 'WoningVry Ltd',
        partnerName: 'Spontiva Ltd',
        parentHoldcoKey: 'RealEstate'
      };
      spontivaSynergyGroup.add(spontivaBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf472b6,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      spontivaHalo = new THREE.Mesh(haloGeo, haloMat);
      spontivaSynergyGroup.add(spontivaHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        emissive: 0xdb2777,
        emissiveIntensity: 1.5,
        metalness: 0.85,
        roughness: 0.2
      });
      spontivaAnchor1 = new THREE.Mesh(anchorGeo, anchorMat);
      spontivaAnchor2 = new THREE.Mesh(anchorGeo, anchorMat.clone());
      spontivaSynergyGroup.add(spontivaAnchor1);
      spontivaSynergyGroup.add(spontivaAnchor2);

      /* 4. Boogvormige energielijn die door de holografische ruimte reikt */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xfdf2f8,
        transparent: true,
        opacity: 0.95
      });
      spontivaArchLine = new THREE.Line(archGeo, archMat);
      spontivaArchLine.frustumCulled = false;
      spontivaSynergyGroup.add(spontivaArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      spontivaBead1 = new THREE.Mesh(beadGeo, beadMat1);
      spontivaBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      spontivaSynergyGroup.add(spontivaBead1);
      spontivaSynergyGroup.add(spontivaBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      spontivaLabel = createSynergyConnectionLabel(
        'WoningVry ⇄ Spontiva',
        'Directe Vastgoed en Time Gap Cashflow Synergie',
        '#f472b6'
      );
      spontivaLabel.userData = {
        isSynergyConnection: true,
        isSpontivaSynergy: true,
        entityName: 'WoningVry Ltd',
        partnerName: 'Spontiva Ltd',
        parentHoldcoKey: 'RealEstate'
      };
      spontivaSynergyGroup.add(spontivaLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(spontivaSynergyGroup);
    }

    /* Directe Synergie Lijn tussen Boostplug Ltd en Spontiva Ltd */
    const boostplugGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('boostplug')
    );

    let boostplugSpontivaBeam: THREE.Mesh | null = null;
    let boostplugSpontivaHalo: THREE.Mesh | null = null;
    let boostplugSpontivaArchLine: THREE.Line | null = null;
    let boostplugSpontivaAnchor1: THREE.Mesh | null = null;
    let boostplugSpontivaAnchor2: THREE.Mesh | null = null;
    let boostplugSpontivaBead1: THREE.Mesh | null = null;
    let boostplugSpontivaBead2: THREE.Mesh | null = null;
    let boostplugSpontivaLabel: THREE.Sprite | null = null;

    if (boostplugGroup && spontivaGroup) {
      const boostplugSpontivaGroup = new THREE.Group();
      boostplugSpontivaGroup.name = 'synergy_boostplug_spontiva_group';

      /* 1. Volumetrische 3D cilindrische paarse lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0xa855f7,
        emissiveIntensity: 1.7,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      boostplugSpontivaBeam = new THREE.Mesh(beamGeo, beamMat);
      boostplugSpontivaBeam.name = 'boostplug_spontiva_beam';
      boostplugSpontivaBeam.userData = {
        isSynergyConnection: true,
        isBoostplugSpontivaSynergy: true,
        entityName: 'Boostplug Ltd',
        partnerName: 'Spontiva Ltd',
        parentHoldcoKey: 'Compute'
      };
      boostplugSpontivaGroup.add(boostplugSpontivaBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xe879f9,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      boostplugSpontivaHalo = new THREE.Mesh(haloGeo, haloMat);
      boostplugSpontivaGroup.add(boostplugSpontivaHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 1.5,
        metalness: 0.85,
        roughness: 0.2
      });
      boostplugSpontivaAnchor1 = new THREE.Mesh(anchorGeo, anchorMat);
      boostplugSpontivaAnchor2 = new THREE.Mesh(anchorGeo, anchorMat.clone());
      boostplugSpontivaGroup.add(boostplugSpontivaAnchor1);
      boostplugSpontivaGroup.add(boostplugSpontivaAnchor2);

      /* 4. Boogvormige energielijn over het compute platform */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xf3e8ff,
        transparent: true,
        opacity: 0.95
      });
      boostplugSpontivaArchLine = new THREE.Line(archGeo, archMat);
      boostplugSpontivaArchLine.frustumCulled = false;
      boostplugSpontivaGroup.add(boostplugSpontivaArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      boostplugSpontivaBead1 = new THREE.Mesh(beadGeo, beadMat1);
      boostplugSpontivaBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      boostplugSpontivaGroup.add(boostplugSpontivaBead1);
      boostplugSpontivaGroup.add(boostplugSpontivaBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      boostplugSpontivaLabel = createSynergyConnectionLabel(
        'Boostplug ⇄ Spontiva',
        'Directe GPU Compute en Time Gap Cashflow Synergie',
        '#c084fc'
      );
      boostplugSpontivaLabel.userData = {
        isSynergyConnection: true,
        isBoostplugSpontivaSynergy: true,
        entityName: 'Boostplug Ltd',
        partnerName: 'Spontiva Ltd',
        parentHoldcoKey: 'Compute'
      };
      boostplugSpontivaGroup.add(boostplugSpontivaLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(boostplugSpontivaGroup);
    }

    /* Directe Synergie Lijn tussen Investbotiq Ltd en Spontiva Ltd */
    const investbotiqGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('investbotiq')
    );

    let investbotiqSpontivaBeam: THREE.Mesh | null = null;
    let investbotiqSpontivaHalo: THREE.Mesh | null = null;
    let investbotiqSpontivaArchLine: THREE.Line | null = null;
    let investbotiqSpontivaAnchor1: THREE.Mesh | null = null;
    let investbotiqSpontivaAnchor2: THREE.Mesh | null = null;
    let investbotiqSpontivaBead1: THREE.Mesh | null = null;
    let investbotiqSpontivaBead2: THREE.Mesh | null = null;
    let investbotiqSpontivaLabel: THREE.Sprite | null = null;

    if (investbotiqGroup && spontivaGroup) {
      const investbotiqSpontivaGroup = new THREE.Group();
      investbotiqSpontivaGroup.name = 'synergy_investbotiq_spontiva_group';

      /* 1. Volumetrische 3D cilindrische cyaanblauwe lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x06b6d4,
        emissiveIntensity: 1.8,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      investbotiqSpontivaBeam = new THREE.Mesh(beamGeo, beamMat);
      investbotiqSpontivaBeam.name = 'investbotiq_spontiva_beam';
      investbotiqSpontivaBeam.userData = {
        isSynergyConnection: true,
        isInvestbotiqSpontivaSynergy: true,
        entityName: 'Investbotiq Ltd',
        partnerName: 'Spontiva Ltd',
        parentHoldcoKey: 'IP_Tech'
      };
      investbotiqSpontivaGroup.add(investbotiqSpontivaBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      investbotiqSpontivaHalo = new THREE.Mesh(haloGeo, haloMat);
      investbotiqSpontivaGroup.add(investbotiqSpontivaHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat1 = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      const anchorMat2 = new THREE.MeshStandardMaterial({
        color: 0xe879f9,
        emissive: 0xc026d3,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      investbotiqSpontivaAnchor1 = new THREE.Mesh(anchorGeo, anchorMat1);
      investbotiqSpontivaAnchor2 = new THREE.Mesh(anchorGeo, anchorMat2);
      investbotiqSpontivaGroup.add(investbotiqSpontivaAnchor1);
      investbotiqSpontivaGroup.add(investbotiqSpontivaAnchor2);

      /* 4. Boogvormige energielijn hoog over het centrum */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xa5f3fc,
        transparent: true,
        opacity: 0.95
      });
      investbotiqSpontivaArchLine = new THREE.Line(archGeo, archMat);
      investbotiqSpontivaArchLine.frustumCulled = false;
      investbotiqSpontivaGroup.add(investbotiqSpontivaArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      investbotiqSpontivaBead1 = new THREE.Mesh(beadGeo, beadMat1);
      investbotiqSpontivaBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      investbotiqSpontivaGroup.add(investbotiqSpontivaBead1);
      investbotiqSpontivaGroup.add(investbotiqSpontivaBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      investbotiqSpontivaLabel = createSynergyConnectionLabel(
        'Investbotiq ⇄ Spontiva',
        'Directe AI Executie en Kasstroom Activatie',
        '#06b6d4'
      );
      investbotiqSpontivaLabel.userData = {
        isSynergyConnection: true,
        isInvestbotiqSpontivaSynergy: true,
        entityName: 'Investbotiq Ltd',
        partnerName: 'Spontiva Ltd',
        parentHoldcoKey: 'IP_Tech'
      };
      investbotiqSpontivaGroup.add(investbotiqSpontivaLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(investbotiqSpontivaGroup);
    }

    /* Directe Synergie Lijn tussen Investbotiq Ltd en VVC Ltd */
    const vvcGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('vvc')
    );

    let investbotiqVvcBeam: THREE.Mesh | null = null;
    let investbotiqVvcHalo: THREE.Mesh | null = null;
    let investbotiqVvcArchLine: THREE.Line | null = null;
    let investbotiqVvcAnchor1: THREE.Mesh | null = null;
    let investbotiqVvcAnchor2: THREE.Mesh | null = null;
    let investbotiqVvcBead1: THREE.Mesh | null = null;
    let investbotiqVvcBead2: THREE.Mesh | null = null;
    let investbotiqVvcLabel: THREE.Sprite | null = null;

    if (investbotiqGroup && vvcGroup) {
      const investbotiqVvcGroup = new THREE.Group();
      investbotiqVvcGroup.name = 'synergy_investbotiq_vvc_group';

      /* 1. Volumetrische 3D cilindrische lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.8,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      investbotiqVvcBeam = new THREE.Mesh(beamGeo, beamMat);
      investbotiqVvcBeam.name = 'investbotiq_vvc_beam';
      investbotiqVvcBeam.userData = {
        isSynergyConnection: true,
        isInvestbotiqVvcSynergy: true,
        entityName: 'Investbotiq Ltd',
        partnerName: 'VVC Ltd',
        parentHoldcoKey: 'IP_Tech'
      };
      investbotiqVvcGroup.add(investbotiqVvcBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      investbotiqVvcHalo = new THREE.Mesh(haloGeo, haloMat);
      investbotiqVvcGroup.add(investbotiqVvcHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat1 = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      const anchorMat2 = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0369a1,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      investbotiqVvcAnchor1 = new THREE.Mesh(anchorGeo, anchorMat1);
      investbotiqVvcAnchor2 = new THREE.Mesh(anchorGeo, anchorMat2);
      investbotiqVvcGroup.add(investbotiqVvcAnchor1);
      investbotiqVvcGroup.add(investbotiqVvcAnchor2);

      /* 4. Boogvormige energielijn hoog over het centrum */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xbae6fd,
        transparent: true,
        opacity: 0.95
      });
      investbotiqVvcArchLine = new THREE.Line(archGeo, archMat);
      investbotiqVvcArchLine.frustumCulled = false;
      investbotiqVvcGroup.add(investbotiqVvcArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      investbotiqVvcBead1 = new THREE.Mesh(beadGeo, beadMat1);
      investbotiqVvcBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      investbotiqVvcGroup.add(investbotiqVvcBead1);
      investbotiqVvcGroup.add(investbotiqVvcBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      investbotiqVvcLabel = createSynergyConnectionLabel(
        'Investbotiq ⇄ VVC',
        'Directe Talent Allocatie en AI Intake Stroom',
        '#38bdf8'
      );
      investbotiqVvcLabel.userData = {
        isSynergyConnection: true,
        isInvestbotiqVvcSynergy: true,
        entityName: 'Investbotiq Ltd',
        partnerName: 'VVC Ltd',
        parentHoldcoKey: 'IP_Tech'
      };
      investbotiqVvcGroup.add(investbotiqVvcLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(investbotiqVvcGroup);
    }

    /* Directe Synergie Lijn tussen Boostplug Ltd en Zheavenzy Ltd */
    const zheavenzyGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('zheavenzy')
    );

    let boostplugZheavenzyBeam: THREE.Mesh | null = null;
    let boostplugZheavenzyHalo: THREE.Mesh | null = null;
    let boostplugZheavenzyArchLine: THREE.Line | null = null;
    let boostplugZheavenzyAnchor1: THREE.Mesh | null = null;
    let boostplugZheavenzyAnchor2: THREE.Mesh | null = null;
    let boostplugZheavenzyBead1: THREE.Mesh | null = null;
    let boostplugZheavenzyBead2: THREE.Mesh | null = null;
    let boostplugZheavenzyLabel: THREE.Sprite | null = null;

    if (boostplugGroup && zheavenzyGroup) {
      const boostplugZheavenzyGroup = new THREE.Group();
      boostplugZheavenzyGroup.name = 'synergy_boostplug_zheavenzy_group';

      /* 1. Volumetrische 3D cilindrische lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xdb2777,
        emissiveIntensity: 1.8,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      boostplugZheavenzyBeam = new THREE.Mesh(beamGeo, beamMat);
      boostplugZheavenzyBeam.name = 'boostplug_zheavenzy_beam';
      boostplugZheavenzyBeam.userData = {
        isSynergyConnection: true,
        isBoostplugZheavenzySynergy: true,
        entityName: 'Boostplug Ltd',
        partnerName: 'Zheavenzy Ltd',
        parentHoldcoKey: 'Compute'
      };
      boostplugZheavenzyGroup.add(boostplugZheavenzyBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf472b6,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      boostplugZheavenzyHalo = new THREE.Mesh(haloGeo, haloMat);
      boostplugZheavenzyGroup.add(boostplugZheavenzyHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat1 = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x9333ea,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      const anchorMat2 = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xdb2777,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      boostplugZheavenzyAnchor1 = new THREE.Mesh(anchorGeo, anchorMat1);
      boostplugZheavenzyAnchor2 = new THREE.Mesh(anchorGeo, anchorMat2);
      boostplugZheavenzyGroup.add(boostplugZheavenzyAnchor1);
      boostplugZheavenzyGroup.add(boostplugZheavenzyAnchor2);

      /* 4. Boogvormige energielijn hoog over het centrum */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xfbcfe8,
        transparent: true,
        opacity: 0.95
      });
      boostplugZheavenzyArchLine = new THREE.Line(archGeo, archMat);
      boostplugZheavenzyArchLine.frustumCulled = false;
      boostplugZheavenzyGroup.add(boostplugZheavenzyArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      boostplugZheavenzyBead1 = new THREE.Mesh(beadGeo, beadMat1);
      boostplugZheavenzyBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      boostplugZheavenzyGroup.add(boostplugZheavenzyBead1);
      boostplugZheavenzyGroup.add(boostplugZheavenzyBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      boostplugZheavenzyLabel = createSynergyConnectionLabel(
        'Boostplug ⇄ Zheavenzy',
        'GPU Compute en Media Streaming Bandbreedte',
        '#ec4899'
      );
      boostplugZheavenzyLabel.userData = {
        isSynergyConnection: true,
        isBoostplugZheavenzySynergy: true,
        entityName: 'Boostplug Ltd',
        partnerName: 'Zheavenzy Ltd',
        parentHoldcoKey: 'Compute'
      };
      boostplugZheavenzyGroup.add(boostplugZheavenzyLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(boostplugZheavenzyGroup);
    }

    /* Directe Synergie Lijn tussen Boostplug Ltd en Logs.rent */
    const logsRentGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('logs')
    );

    let boostplugLogsBeam: THREE.Mesh | null = null;
    let boostplugLogsHalo: THREE.Mesh | null = null;
    let boostplugLogsArchLine: THREE.Line | null = null;
    let boostplugLogsAnchor1: THREE.Mesh | null = null;
    let boostplugLogsAnchor2: THREE.Mesh | null = null;
    let boostplugLogsBead1: THREE.Mesh | null = null;
    let boostplugLogsBead2: THREE.Mesh | null = null;
    let boostplugLogsLabel: THREE.Sprite | null = null;

    if (boostplugGroup && logsRentGroup) {
      const boostplugLogsGroup = new THREE.Group();
      boostplugLogsGroup.name = 'synergy_boostplug_logs_group';

      /* 1. Volumetrische 3D cilindrische lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0xa855f7,
        emissiveIntensity: 1.8,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      boostplugLogsBeam = new THREE.Mesh(beamGeo, beamMat);
      boostplugLogsBeam.name = 'boostplug_logs_beam';
      boostplugLogsBeam.userData = {
        isSynergyConnection: true,
        isBoostplugLogsSynergy: true,
        entityName: 'Boostplug Ltd',
        partnerName: 'Logs.rent',
        parentHoldcoKey: 'Compute'
      };
      boostplugLogsGroup.add(boostplugLogsBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xd8b4fe,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      boostplugLogsHalo = new THREE.Mesh(haloGeo, haloMat);
      boostplugLogsGroup.add(boostplugLogsHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat1 = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x9333ea,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      const anchorMat2 = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      boostplugLogsAnchor1 = new THREE.Mesh(anchorGeo, anchorMat1);
      boostplugLogsAnchor2 = new THREE.Mesh(anchorGeo, anchorMat2);
      boostplugLogsGroup.add(boostplugLogsAnchor1);
      boostplugLogsGroup.add(boostplugLogsAnchor2);

      /* 4. Boogvormige energielijn hoog over het centrum */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xe9d5ff,
        transparent: true,
        opacity: 0.95
      });
      boostplugLogsArchLine = new THREE.Line(archGeo, archMat);
      boostplugLogsArchLine.frustumCulled = false;
      boostplugLogsGroup.add(boostplugLogsArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      boostplugLogsBead1 = new THREE.Mesh(beadGeo, beadMat1);
      boostplugLogsBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      boostplugLogsGroup.add(boostplugLogsBead1);
      boostplugLogsGroup.add(boostplugLogsBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      boostplugLogsLabel = createSynergyConnectionLabel(
        'Boostplug ⇄ Logs.rent',
        'Directe GPU Capaciteit en Compute Marketplace Verhuur',
        '#c084fc'
      );
      boostplugLogsLabel.userData = {
        isSynergyConnection: true,
        isBoostplugLogsSynergy: true,
        entityName: 'Boostplug Ltd',
        partnerName: 'Logs.rent',
        parentHoldcoKey: 'Compute'
      };
      boostplugLogsGroup.add(boostplugLogsLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(boostplugLogsGroup);
    }

    /* Directe Synergie Lijn tussen Xabi World Ltd en Investbotiq Ltd */
    const xabiWorldGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('xabi')
    );

    let xabiInvestbotiqBeam: THREE.Mesh | null = null;
    let xabiInvestbotiqHalo: THREE.Mesh | null = null;
    let xabiInvestbotiqArchLine: THREE.Line | null = null;
    let xabiInvestbotiqAnchor1: THREE.Mesh | null = null;
    let xabiInvestbotiqAnchor2: THREE.Mesh | null = null;
    let xabiInvestbotiqBead1: THREE.Mesh | null = null;
    let xabiInvestbotiqBead2: THREE.Mesh | null = null;
    let xabiInvestbotiqLabel: THREE.Sprite | null = null;

    if (xabiWorldGroup && investbotiqGroup) {
      const xabiInvestbotiqGroup = new THREE.Group();
      xabiInvestbotiqGroup.name = 'synergy_xabi_investbotiq_group';

      /* 1. Volumetrische 3D cilindrische lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 1.8,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      xabiInvestbotiqBeam = new THREE.Mesh(beamGeo, beamMat);
      xabiInvestbotiqBeam.name = 'xabi_investbotiq_beam';
      xabiInvestbotiqBeam.userData = {
        isSynergyConnection: true,
        isXabiInvestbotiqSynergy: true,
        entityName: 'Xabi World Ltd',
        partnerName: 'Investbotiq Ltd',
        parentHoldcoKey: 'Fintech'
      };
      xabiInvestbotiqGroup.add(xabiInvestbotiqBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      xabiInvestbotiqHalo = new THREE.Mesh(haloGeo, haloMat);
      xabiInvestbotiqGroup.add(xabiInvestbotiqHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat1 = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      const anchorMat2 = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      xabiInvestbotiqAnchor1 = new THREE.Mesh(anchorGeo, anchorMat1);
      xabiInvestbotiqAnchor2 = new THREE.Mesh(anchorGeo, anchorMat2);
      xabiInvestbotiqGroup.add(xabiInvestbotiqAnchor1);
      xabiInvestbotiqGroup.add(xabiInvestbotiqAnchor2);

      /* 4. Boogvormige energielijn hoog over de ruimte */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xa7f3d0,
        transparent: true,
        opacity: 0.95
      });
      xabiInvestbotiqArchLine = new THREE.Line(archGeo, archMat);
      xabiInvestbotiqArchLine.frustumCulled = false;
      xabiInvestbotiqGroup.add(xabiInvestbotiqArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      xabiInvestbotiqBead1 = new THREE.Mesh(beadGeo, beadMat1);
      xabiInvestbotiqBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      xabiInvestbotiqGroup.add(xabiInvestbotiqBead1);
      xabiInvestbotiqGroup.add(xabiInvestbotiqBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      xabiInvestbotiqLabel = createSynergyConnectionLabel(
        'Xabi World ⇄ Investbotiq',
        'Directe Clearing en Autonome AI Executie',
        '#10b981'
      );
      xabiInvestbotiqLabel.userData = {
        isSynergyConnection: true,
        isXabiInvestbotiqSynergy: true,
        entityName: 'Xabi World Ltd',
        partnerName: 'Investbotiq Ltd',
        parentHoldcoKey: 'Fintech'
      };
      xabiInvestbotiqGroup.add(xabiInvestbotiqLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(xabiInvestbotiqGroup);
    }

    /* Directe Synergie Lijn tussen Spontiva Ltd en DJOBBA Ltd */
    const djobbaGroup = animatedLtdEntities.find(
      (g) => g.userData?.entityName?.toLowerCase().includes('djobba')
    );

    let spontivaDjobbaBeam: THREE.Mesh | null = null;
    let spontivaDjobbaHalo: THREE.Mesh | null = null;
    let spontivaDjobbaArchLine: THREE.Line | null = null;
    let spontivaDjobbaAnchor1: THREE.Mesh | null = null;
    let spontivaDjobbaAnchor2: THREE.Mesh | null = null;
    let spontivaDjobbaBead1: THREE.Mesh | null = null;
    let spontivaDjobbaBead2: THREE.Mesh | null = null;
    let spontivaDjobbaLabel: THREE.Sprite | null = null;

    if (spontivaGroup && djobbaGroup) {
      const spontivaDjobbaGroup = new THREE.Group();
      spontivaDjobbaGroup.name = 'synergy_spontiva_djobba_group';

      /* 1. Volumetrische 3D cilindrische lichtbundel */
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xd946ef,
        emissiveIntensity: 1.8,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95
      });
      spontivaDjobbaBeam = new THREE.Mesh(beamGeo, beamMat);
      spontivaDjobbaBeam.name = 'spontiva_djobba_beam';
      spontivaDjobbaBeam.userData = {
        isSynergyConnection: true,
        isSpontivaDjobbaSynergy: true,
        entityName: 'Spontiva Ltd',
        partnerName: 'DJOBBA Ltd',
        parentHoldcoKey: 'Compute'
      };
      spontivaDjobbaGroup.add(spontivaDjobbaBeam);

      /* 2. Buitenste pulserende hexagonale wireframe aura */
      const haloGeo = new THREE.CylinderGeometry(0.18, 0.18, 1, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf472b6,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      spontivaDjobbaHalo = new THREE.Mesh(haloGeo, haloMat);
      spontivaDjobbaGroup.add(spontivaDjobbaHalo);

      /* 3. Twee fysiek verankerde bollen op de entiteiten */
      const anchorGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const anchorMat1 = new THREE.MeshStandardMaterial({
        color: 0xe879f9,
        emissive: 0xc026d3,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      const anchorMat2 = new THREE.MeshStandardMaterial({
        color: 0x60a5fa,
        emissive: 0x2563eb,
        emissiveIntensity: 1.6,
        metalness: 0.85,
        roughness: 0.2
      });
      spontivaDjobbaAnchor1 = new THREE.Mesh(anchorGeo, anchorMat1);
      spontivaDjobbaAnchor2 = new THREE.Mesh(anchorGeo, anchorMat2);
      spontivaDjobbaGroup.add(spontivaDjobbaAnchor1);
      spontivaDjobbaGroup.add(spontivaDjobbaAnchor2);

      /* 4. Boogvormige energielijn hoog over de ruimte */
      const archPointsCount = 49;
      const archPositions = new Float32Array(archPointsCount * 3);
      const archGeo = new THREE.BufferGeometry();
      archGeo.setAttribute('position', new THREE.BufferAttribute(archPositions, 3));
      const archMat = new THREE.LineBasicMaterial({
        color: 0xfbcfe8,
        transparent: true,
        opacity: 0.95
      });
      spontivaDjobbaArchLine = new THREE.Line(archGeo, archMat);
      spontivaDjobbaArchLine.frustumCulled = false;
      spontivaDjobbaGroup.add(spontivaDjobbaArchLine);

      /* 5. Twee reizende energiefotonen tussen de entiteiten */
      const beadGeo = new THREE.SphereGeometry(0.20, 14, 14);
      const beadMat1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98
      });
      spontivaDjobbaBead1 = new THREE.Mesh(beadGeo, beadMat1);
      spontivaDjobbaBead2 = new THREE.Mesh(beadGeo, beadMat1.clone());
      spontivaDjobbaGroup.add(spontivaDjobbaBead1);
      spontivaDjobbaGroup.add(spontivaDjobbaBead2);

      /* 6. Holografisch synergie tekstlabel zwevend in het midden */
      spontivaDjobbaLabel = createSynergyConnectionLabel(
        'Spontiva ⇄ DJOBBA',
        'IT Kasstromen en Time Gap Liquiditeit',
        '#e879f9'
      );
      spontivaDjobbaLabel.userData = {
        isSynergyConnection: true,
        isSpontivaDjobbaSynergy: true,
        entityName: 'Spontiva Ltd',
        partnerName: 'DJOBBA Ltd',
        parentHoldcoKey: 'Compute'
      };
      spontivaDjobbaGroup.add(spontivaDjobbaLabel);

      /* Toevoegen aan nodesGroup op wereldniveau */
      nodesGroup.add(spontivaDjobbaGroup);
    }

    /* Energiestralen tussen Moederholding en subholdings */
    const beamBeads: { mesh: THREE.Mesh; progress: number; speed: number; curve: THREE.CatmullRomCurve3 }[] = [];
    const conduitGroup = new THREE.Group();
    scene.add(conduitGroup);

    const motherPos = new THREE.Vector3(...ecosystemData.Moederholding.pos);

    Object.entries(ecosystemData).forEach(([key, data]) => {
      if (key === 'Moederholding') return;

      const targetPos = new THREE.Vector3(...data.pos);
      const midPoint = new THREE.Vector3()
        .addVectors(motherPos, targetPos)
        .multiplyScalar(0.5);
      midPoint.y += 1.8;

      const curve = new THREE.CatmullRomCurve3([motherPos, midPoint, targetPos]);
      const tubeGeo = new THREE.TubeGeometry(curve, 54, 0.05, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(data.color),
        transparent: true,
        opacity: 0.5
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      conduitGroup.add(tube);

      /* Snellere en helderdere energiefotonen */
      for (let b = 0; b < 5; b++) {
        const beadGeo = new THREE.SphereGeometry(0.16, 12, 12);
        const beadMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(data.color),
          transparent: true,
          opacity: 0.98
        });
        const bead = new THREE.Mesh(beadGeo, beadMat);
        conduitGroup.add(bead);
        beamBeads.push({
          mesh: bead,
          progress: b * 0.2,
          speed: 0.006 + Math.random() * 0.004,
          curve
        });
      }
    });

    /* Spline Window Mock Interface */
    (window as unknown as { spline?: object }).spline = {
      ready: Promise.resolve(),
      emitEvent: (eventName: string, targetName: string) => {
        for (const [key, node] of nodesMapRef.current.entries()) {
          if (node.name === targetName || `Node_${key}` === targetName) {
            node.scale.set(1.22, 1.22, 1.22);
            setTimeout(() => node.scale.set(1, 1, 1), 350);
          }
        }
      }
    };

    /* Muis en Pointer Interacties */
    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDraggingRef.current && cameraRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        const target = cameraTargetRef.current;
        const offset = cameraRef.current.position.clone().sub(target);
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(offset);
        spherical.theta -= deltaX * 0.008;
        spherical.phi = Math.max(0.12, Math.min(Math.PI / 2.05, spherical.phi - deltaY * 0.008));
        offset.setFromSpherical(spherical);
        cameraRef.current.position.copy(target).add(offset);

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    /* Volledige klikdetectie voor entiteiten en platformen */
    const handleClick = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
      if (dx > 7 || dy > 7) {
        return; // drag operatie, negeer klik
      }

      const rect = container.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      );

      if (!cameraRef.current) return;
      raycasterRef.current.setFromCamera(clickMouse, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(nodesGroup.children, true);

      if (intersects.length === 0) return;

      /* Prioriteit 1: Satelliet entiteit detectie */
      let clickedLtd: { holdcoKey: string; entityName: string; group: THREE.Object3D } | null = null;

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        let foundLtdGroup: THREE.Object3D | null = null;
        while (curr && curr !== nodesGroup) {
          if (curr.userData?.isSynergyConnection) {
            clickedLtd = {
              holdcoKey: curr.userData.parentHoldcoKey,
              entityName: curr.userData.entityName,
              group: curr
            };
            break;
          }
          if (curr.userData?.isLtdEntity && curr.userData?.entityName) {
            foundLtdGroup = curr;
          }
          if (curr.name?.startsWith('Ltd_')) {
            foundLtdGroup = curr;
            break;
          }
          curr = curr.parent;
        }
        if (clickedLtd) break;
        if (foundLtdGroup && foundLtdGroup.userData?.entityName) {
          clickedLtd = {
            holdcoKey: foundLtdGroup.userData.parentHoldcoKey,
            entityName: foundLtdGroup.userData.entityName,
            group: foundLtdGroup
          };
          break;
        }
      }

      if (clickedLtd) {
        onSelectNode(clickedLtd.holdcoKey, clickedLtd.entityName);
        clickedLtd.group.scale.set(1.6, 1.6, 1.6);
        setTimeout(() => {
          clickedLtd?.group.scale.set(1, 1, 1);
        }, 320);
        return;
      }

      /* Prioriteit 2: Platform klik detectie */
      let clickedHoldcoKey: string | null = null;
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== nodesGroup) {
          if (curr.userData?.key || curr.userData?.parentKey) {
            clickedHoldcoKey = curr.userData.key || curr.userData.parentKey;
            break;
          }
          curr = curr.parent;
        }
        if (clickedHoldcoKey) break;
      }

      if (clickedHoldcoKey) {
        onSelectNode(clickedHoldcoKey, null);
      }
    };

    /* Muiswiel Zooming */
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const target = cameraTargetRef.current;
      const offset = cameraRef.current.position.clone().sub(target);
      const zoomFactor = 1 + Math.sign(e.deltaY) * 0.12;
      const currentDist = offset.length();
      const newDist = Math.max(5, Math.min(85, currentDist * zoomFactor));
      offset.setLength(newDist);
      cameraRef.current.position.copy(target).add(offset);
    };

    /* Touch Ondersteuning */
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistanceRef.current = Math.hypot(dx, dy);
      } else if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDistanceRef.current !== null && cameraRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const factor = touchDistanceRef.current / currentDistance;

        const target = cameraTargetRef.current;
        const offset = cameraRef.current.position.clone().sub(target);
        const currentDist = offset.length();
        const newDist = Math.max(5, Math.min(85, currentDist * factor));
        offset.setLength(newDist);
        cameraRef.current.position.copy(target).add(offset);
        touchDistanceRef.current = currentDistance;
      } else if (e.touches.length === 1 && isDraggingRef.current && cameraRef.current) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

        const target = cameraTargetRef.current;
        const offset = cameraRef.current.position.clone().sub(target);
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(offset);
        spherical.theta -= deltaX * 0.008;
        spherical.phi = Math.max(0.12, Math.min(Math.PI / 2.05, spherical.phi - deltaY * 0.008));
        offset.setFromSpherical(spherical);
        cameraRef.current.position.copy(target).add(offset);

        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      touchDistanceRef.current = null;
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    /* Animatie Loop */
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const speedMod = velocityMultiplier || 1;

      particles.rotation.y = elapsed * 0.018 * speedMod;

      /* Pulserende radar golf over de vloer */
      const waveCycle = (elapsed * 0.45 * speedMod) % 1;
      const currentRadius = 0.5 + waveCycle * 32;
      pulseWave.geometry.dispose();
      pulseWave.geometry = new THREE.RingGeometry(currentRadius, currentRadius + 0.5, 64);
      (pulseWave.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 * (1 - waveCycle));

      /* Zweefbeweging voor alle Hoofd Knooppunten */
      nodesMapRef.current.forEach((group, key) => {
        const initialY = ecosystemData[key].pos[1];
        group.position.y = initialY + Math.sin(elapsed * 1.6 * speedMod + (group.position.x || 1)) * 0.14;

        const crystal = group.getObjectByName('crystal');
        if (crystal) {
          crystal.rotation.y = elapsed * 0.9 * speedMod;
          crystal.rotation.x = Math.sin(elapsed * 0.6) * 0.25;
        }

        const halo = group.getObjectByName('halo');
        if (halo) {
          halo.rotation.y = -elapsed * 0.45 * speedMod;
        }

        const centerSymbol = group.getObjectByName('center_symbol');
        if (centerSymbol) {
          centerSymbol.rotation.y = elapsed * 1.0 * speedMod;
        }

        const ring = group.getObjectByName('orbital_ring');
        if (ring) {
          ring.rotation.z = elapsed * 0.35 * speedMod;
        }

        const goldRing = group.getObjectByName('ring_gold');
        if (goldRing) {
          goldRing.rotation.z = -elapsed * 0.3 * speedMod;
        }

        const gyroRing = group.getObjectByName('gyro_ring');
        if (gyroRing) {
          gyroRing.rotation.x = elapsed * 0.4 * speedMod;
          gyroRing.rotation.y = elapsed * 0.25 * speedMod;
        }
      });

      /* Vloeiende baanrotatie van de Ltd entiteiten */
      animatedLtdEntities.forEach((ltdGroup) => {
        const { orbitRadius, initialAngle, orbitSpeed, tether } = ltdGroup.userData;
        const currentAngle = initialAngle + elapsed * orbitSpeed * speedMod;

        if (orbitRadius > 0) {
          const currentX = Math.cos(currentAngle) * orbitRadius;
          const currentZ = Math.sin(currentAngle) * orbitRadius;
          const bobY = 0.85 + Math.sin(elapsed * 2.2 * speedMod + initialAngle) * 0.2;

          ltdGroup.position.set(currentX, bobY, currentZ);

          if (tether && tether.geometry) {
            const positions = tether.geometry.attributes.position.array as Float32Array;
            positions[0] = 0;
            positions[1] = 0.55;
            positions[2] = 0;
            positions[3] = currentX;
            positions[4] = bobY;
            positions[5] = currentZ;
            tether.geometry.attributes.position.needsUpdate = true;
          }
        }

        const coreMesh = ltdGroup.getObjectByName('ltd_core_mesh');
        if (coreMesh) {
          coreMesh.rotation.y = elapsed * 1.4 * speedMod;
          coreMesh.rotation.x = Math.sin(elapsed * 0.8) * 0.3;
        }

        const wireCage = ltdGroup.getObjectByName('ltd_wire_cage');
        if (wireCage) {
          wireCage.rotation.y = -elapsed * 1.1 * speedMod;
          wireCage.rotation.z = Math.cos(elapsed * 0.7) * 0.4;
        }

        const miniRing = ltdGroup.getObjectByName('ltd_mini_ring');
        if (miniRing) {
          miniRing.rotation.z = -elapsed * 1.2 * speedMod;
        }

        const aura = ltdGroup.getObjectByName('ltd_select_aura');
        if (aura && aura.visible) {
          aura.rotation.z = elapsed * 1.8 * speedMod;
        }
      });

      /* Dynamische update van de synergie lijn tussen WoningVry en Afterstudenthousing */
      if (woningVryGroup && afterStudentGroup && synergyBeam) {
        const v1 = new THREE.Vector3();
        const v2 = new THREE.Vector3();
        woningVryGroup.getWorldPosition(v1);
        afterStudentGroup.getWorldPosition(v2);

        const dir = new THREE.Vector3().subVectors(v2, v1);
        const dist = dir.length();
        const normDir = dir.clone().normalize();
        const midPoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D gouden lichtbundel */
        synergyBeam.position.copy(midPoint);
        synergyBeam.quaternion.setFromUnitVectors(upVector, normDir);
        synergyBeam.scale.set(1, dist, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (synergyHalo) {
          synergyHalo.position.copy(midPoint);
          synergyHalo.quaternion.setFromUnitVectors(upVector, normDir);
          synergyHalo.scale.set(1, dist, 1);
          synergyHalo.rotateY(elapsed * 1.5 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (synergyAnchor1) synergyAnchor1.position.copy(v1);
        if (synergyAnchor2) synergyAnchor2.position.copy(v2);

        /* 4. Boogvormige energielijn die over het platform reikt */
        const midArc = midPoint.clone().add(new THREE.Vector3(0, 1.35, 0));
        if (synergyArchLine) {
          const curve = new THREE.CatmullRomCurve3([v1, midArc, v2]);
          const points = curve.getPoints(32);
          const posAttr = synergyArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 32; i++) {
            arr[i * 3] = points[i].x;
            arr[i * 3 + 1] = points[i].y;
            arr[i * 3 + 2] = points[i].z;
          }
          posAttr.needsUpdate = true;
          synergyArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (synergyLabel) {
          synergyLabel.position.set(midArc.x, midArc.y + 0.65, midArc.z);
        }

        /* 6. Fotonen die continu reizen tussen WoningVry en Afterstudenthousing */
        const pMod1 = (elapsed * 0.75 * speedMod) % 1;
        const pMod2 = (1 - (elapsed * 0.75 * speedMod) % 1) % 1;
        if (synergyBead1) synergyBead1.position.lerpVectors(v1, v2, pMod1);
        if (synergyBead2) synergyBead2.position.lerpVectors(v1, v2, pMod2);

        /* 7. Oplichten bij selectie of hover van WoningVry of Afterstudenthousing */
        const isSynergyActive =
          selectedLtdName === 'WoningVry Ltd' ||
          selectedLtdName === 'Afterstudenthousing Ltd' ||
          hoveredEntity?.name?.includes('WoningVry') ||
          hoveredEntity?.name?.includes('Afterstudenthousing');

        const beamMat = synergyBeam.material as THREE.MeshStandardMaterial;
        if (isSynergyActive) {
          beamMat.emissiveIntensity = 2.4;
          synergyBeam.scale.set(1.5, dist, 1.5);
          if (synergyHalo) {
            (synergyHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMat.emissiveIntensity = 1.6;
          if (synergyHalo) {
            (synergyHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen WoningVry en Spontiva */
      if (woningVryGroup && spontivaGroup && spontivaBeam) {
        const vW = new THREE.Vector3();
        const vS = new THREE.Vector3();
        woningVryGroup.getWorldPosition(vW);
        spontivaGroup.getWorldPosition(vS);

        const dirWS = new THREE.Vector3().subVectors(vS, vW);
        const distWS = dirWS.length();
        const normDirWS = dirWS.clone().normalize();
        const midPointWS = new THREE.Vector3().addVectors(vW, vS).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D fuchsia lichtbundel */
        spontivaBeam.position.copy(midPointWS);
        spontivaBeam.quaternion.setFromUnitVectors(upVector, normDirWS);
        spontivaBeam.scale.set(1, distWS, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (spontivaHalo) {
          spontivaHalo.position.copy(midPointWS);
          spontivaHalo.quaternion.setFromUnitVectors(upVector, normDirWS);
          spontivaHalo.scale.set(1, distWS, 1);
          spontivaHalo.rotateY(elapsed * 1.3 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (spontivaAnchor1) spontivaAnchor1.position.copy(vW);
        if (spontivaAnchor2) spontivaAnchor2.position.copy(vS);

        /* 4. Boogvormige energielijn die hoog door de ruimte zweeft */
        const midArcWS = midPointWS.clone().add(new THREE.Vector3(0, 2.8, 0));
        if (spontivaArchLine) {
          const curveWS = new THREE.CatmullRomCurve3([vW, midArcWS, vS]);
          const pointsWS = curveWS.getPoints(48);
          const posAttr = spontivaArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsWS[i].x;
            arr[i * 3 + 1] = pointsWS[i].y;
            arr[i * 3 + 2] = pointsWS[i].z;
          }
          posAttr.needsUpdate = true;
          spontivaArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (spontivaLabel) {
          spontivaLabel.position.set(midArcWS.x, midArcWS.y + 0.65, midArcWS.z);
        }

        /* 6. Fotonen die continu reizen tussen WoningVry en Spontiva */
        const pModWS1 = (elapsed * 0.55 * speedMod) % 1;
        const pModWS2 = (1 - (elapsed * 0.55 * speedMod) % 1) % 1;
        if (spontivaBead1) spontivaBead1.position.lerpVectors(vW, vS, pModWS1);
        if (spontivaBead2) spontivaBead2.position.lerpVectors(vW, vS, pModWS2);

        /* 7. Oplichten bij selectie of hover van WoningVry of Spontiva */
        const isSpontivaSynergyActive =
          selectedLtdName === 'WoningVry Ltd' ||
          selectedLtdName === 'Spontiva Ltd' ||
          hoveredEntity?.name?.includes('WoningVry') ||
          hoveredEntity?.name?.includes('Spontiva');

        const beamMat = spontivaBeam.material as THREE.MeshStandardMaterial;
        if (isSpontivaSynergyActive) {
          beamMat.emissiveIntensity = 2.5;
          spontivaBeam.scale.set(1.5, distWS, 1.5);
          if (spontivaHalo) {
            (spontivaHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMat.emissiveIntensity = 1.6;
          if (spontivaHalo) {
            (spontivaHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen Boostplug en Spontiva */
      if (boostplugGroup && spontivaGroup && boostplugSpontivaBeam) {
        const vB = new THREE.Vector3();
        const vS = new THREE.Vector3();
        boostplugGroup.getWorldPosition(vB);
        spontivaGroup.getWorldPosition(vS);

        const dirBS = new THREE.Vector3().subVectors(vS, vB);
        const distBS = dirBS.length();
        const normDirBS = dirBS.clone().normalize();
        const midPointBS = new THREE.Vector3().addVectors(vB, vS).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D paarse lichtbundel */
        boostplugSpontivaBeam.position.copy(midPointBS);
        boostplugSpontivaBeam.quaternion.setFromUnitVectors(upVector, normDirBS);
        boostplugSpontivaBeam.scale.set(1, distBS, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (boostplugSpontivaHalo) {
          boostplugSpontivaHalo.position.copy(midPointBS);
          boostplugSpontivaHalo.quaternion.setFromUnitVectors(upVector, normDirBS);
          boostplugSpontivaHalo.scale.set(1, distBS, 1);
          boostplugSpontivaHalo.rotateY(elapsed * 1.3 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (boostplugSpontivaAnchor1) boostplugSpontivaAnchor1.position.copy(vB);
        if (boostplugSpontivaAnchor2) boostplugSpontivaAnchor2.position.copy(vS);

        /* 4. Boogvormige energielijn over het compute platform */
        const midArcBS = midPointBS.clone().add(new THREE.Vector3(0, 2.2, 0));
        if (boostplugSpontivaArchLine) {
          const curveBS = new THREE.CatmullRomCurve3([vB, midArcBS, vS]);
          const pointsBS = curveBS.getPoints(48);
          const posAttr = boostplugSpontivaArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsBS[i].x;
            arr[i * 3 + 1] = pointsBS[i].y;
            arr[i * 3 + 2] = pointsBS[i].z;
          }
          posAttr.needsUpdate = true;
          boostplugSpontivaArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (boostplugSpontivaLabel) {
          boostplugSpontivaLabel.position.set(midArcBS.x, midArcBS.y + 0.65, midArcBS.z);
        }

        /* 6. Fotonen die continu reizen tussen Boostplug en Spontiva */
        const pModBS1 = (elapsed * 0.65 * speedMod) % 1;
        const pModBS2 = (1 - (elapsed * 0.65 * speedMod) % 1) % 1;
        if (boostplugSpontivaBead1) boostplugSpontivaBead1.position.lerpVectors(vB, vS, pModBS1);
        if (boostplugSpontivaBead2) boostplugSpontivaBead2.position.lerpVectors(vB, vS, pModBS2);

        /* 7. Oplichten bij selectie of hover van Boostplug of Spontiva */
        const isBoostplugSpontivaActive =
          selectedLtdName === 'Boostplug Ltd' ||
          selectedLtdName === 'Spontiva Ltd' ||
          hoveredEntity?.name?.includes('Boostplug') ||
          hoveredEntity?.name?.includes('Spontiva');

        const beamMatBS = boostplugSpontivaBeam.material as THREE.MeshStandardMaterial;
        if (isBoostplugSpontivaActive) {
          beamMatBS.emissiveIntensity = 2.6;
          boostplugSpontivaBeam.scale.set(1.5, distBS, 1.5);
          if (boostplugSpontivaHalo) {
            (boostplugSpontivaHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMatBS.emissiveIntensity = 1.6;
          if (boostplugSpontivaHalo) {
            (boostplugSpontivaHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen Investbotiq en Spontiva */
      if (investbotiqGroup && spontivaGroup && investbotiqSpontivaBeam) {
        const vI = new THREE.Vector3();
        const vS = new THREE.Vector3();
        investbotiqGroup.getWorldPosition(vI);
        spontivaGroup.getWorldPosition(vS);

        const dirIS = new THREE.Vector3().subVectors(vS, vI);
        const distIS = dirIS.length();
        const normDirIS = dirIS.clone().normalize();
        const midPointIS = new THREE.Vector3().addVectors(vI, vS).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D cyaanblauwe lichtbundel */
        investbotiqSpontivaBeam.position.copy(midPointIS);
        investbotiqSpontivaBeam.quaternion.setFromUnitVectors(upVector, normDirIS);
        investbotiqSpontivaBeam.scale.set(1, distIS, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (investbotiqSpontivaHalo) {
          investbotiqSpontivaHalo.position.copy(midPointIS);
          investbotiqSpontivaHalo.quaternion.setFromUnitVectors(upVector, normDirIS);
          investbotiqSpontivaHalo.scale.set(1, distIS, 1);
          investbotiqSpontivaHalo.rotateY(elapsed * 1.4 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (investbotiqSpontivaAnchor1) investbotiqSpontivaAnchor1.position.copy(vI);
        if (investbotiqSpontivaAnchor2) investbotiqSpontivaAnchor2.position.copy(vS);

        /* 4. Hoge boogvormige energielijn die over het centrum welft */
        const midArcIS = midPointIS.clone().add(new THREE.Vector3(0, 3.2, 0));
        if (investbotiqSpontivaArchLine) {
          const curveIS = new THREE.CatmullRomCurve3([vI, midArcIS, vS]);
          const pointsIS = curveIS.getPoints(48);
          const posAttr = investbotiqSpontivaArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsIS[i].x;
            arr[i * 3 + 1] = pointsIS[i].y;
            arr[i * 3 + 2] = pointsIS[i].z;
          }
          posAttr.needsUpdate = true;
          investbotiqSpontivaArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (investbotiqSpontivaLabel) {
          investbotiqSpontivaLabel.position.set(midArcIS.x, midArcIS.y + 0.65, midArcIS.z);
        }

        /* 6. Fotonen die continu reizen tussen Investbotiq en Spontiva */
        const pModIS1 = (elapsed * 0.60 * speedMod) % 1;
        const pModIS2 = (1 - (elapsed * 0.60 * speedMod) % 1) % 1;
        if (investbotiqSpontivaBead1) investbotiqSpontivaBead1.position.lerpVectors(vI, vS, pModIS1);
        if (investbotiqSpontivaBead2) investbotiqSpontivaBead2.position.lerpVectors(vI, vS, pModIS2);

        /* 7. Oplichten bij selectie of hover van Investbotiq of Spontiva */
        const isInvestbotiqSpontivaActive =
          selectedLtdName?.includes('Investbotiq') ||
          selectedLtdName === 'Spontiva Ltd' ||
          hoveredEntity?.name?.includes('Investbotiq') ||
          hoveredEntity?.name?.includes('Spontiva');

        const beamMatIS = investbotiqSpontivaBeam.material as THREE.MeshStandardMaterial;
        if (isInvestbotiqSpontivaActive) {
          beamMatIS.emissiveIntensity = 2.8;
          investbotiqSpontivaBeam.scale.set(1.5, distIS, 1.5);
          if (investbotiqSpontivaHalo) {
            (investbotiqSpontivaHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMatIS.emissiveIntensity = 1.8;
          if (investbotiqSpontivaHalo) {
            (investbotiqSpontivaHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen Investbotiq en VVC */
      if (investbotiqGroup && vvcGroup && investbotiqVvcBeam) {
        const vI = new THREE.Vector3();
        const vV = new THREE.Vector3();
        investbotiqGroup.getWorldPosition(vI);
        vvcGroup.getWorldPosition(vV);

        const dirIV = new THREE.Vector3().subVectors(vV, vI);
        const distIV = dirIV.length();
        const normDirIV = dirIV.clone().normalize();
        const midPointIV = new THREE.Vector3().addVectors(vI, vV).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D lichtbundel */
        investbotiqVvcBeam.position.copy(midPointIV);
        investbotiqVvcBeam.quaternion.setFromUnitVectors(upVector, normDirIV);
        investbotiqVvcBeam.scale.set(1, distIV, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (investbotiqVvcHalo) {
          investbotiqVvcHalo.position.copy(midPointIV);
          investbotiqVvcHalo.quaternion.setFromUnitVectors(upVector, normDirIV);
          investbotiqVvcHalo.scale.set(1, distIV, 1);
          investbotiqVvcHalo.rotateY(elapsed * 1.35 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (investbotiqVvcAnchor1) investbotiqVvcAnchor1.position.copy(vI);
        if (investbotiqVvcAnchor2) investbotiqVvcAnchor2.position.copy(vV);

        /* 4. Hoge boogvormige energielijn die over het centrum welft */
        const midArcIV = midPointIV.clone().add(new THREE.Vector3(0, 3.0, 0));
        if (investbotiqVvcArchLine) {
          const curveIV = new THREE.CatmullRomCurve3([vI, midArcIV, vV]);
          const pointsIV = curveIV.getPoints(48);
          const posAttr = investbotiqVvcArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsIV[i].x;
            arr[i * 3 + 1] = pointsIV[i].y;
            arr[i * 3 + 2] = pointsIV[i].z;
          }
          posAttr.needsUpdate = true;
          investbotiqVvcArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (investbotiqVvcLabel) {
          investbotiqVvcLabel.position.set(midArcIV.x, midArcIV.y + 0.65, midArcIV.z);
        }

        /* 6. Fotonen die continu reizen tussen Investbotiq en VVC */
        const pModIV1 = (elapsed * 0.58 * speedMod) % 1;
        const pModIV2 = (1 - (elapsed * 0.58 * speedMod) % 1) % 1;
        if (investbotiqVvcBead1) investbotiqVvcBead1.position.lerpVectors(vI, vV, pModIV1);
        if (investbotiqVvcBead2) investbotiqVvcBead2.position.lerpVectors(vI, vV, pModIV2);

        /* 7. Oplichten bij selectie of hover van Investbotiq of VVC */
        const isInvestbotiqVvcActive =
          selectedLtdName?.includes('Investbotiq') ||
          selectedLtdName?.includes('VVC') ||
          hoveredEntity?.name?.includes('Investbotiq') ||
          hoveredEntity?.name?.includes('VVC');

        const beamMatIV = investbotiqVvcBeam.material as THREE.MeshStandardMaterial;
        if (isInvestbotiqVvcActive) {
          beamMatIV.emissiveIntensity = 2.8;
          investbotiqVvcBeam.scale.set(1.5, distIV, 1.5);
          if (investbotiqVvcHalo) {
            (investbotiqVvcHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMatIV.emissiveIntensity = 1.8;
          if (investbotiqVvcHalo) {
            (investbotiqVvcHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen Boostplug en Zheavenzy */
      if (boostplugGroup && zheavenzyGroup && boostplugZheavenzyBeam) {
        const vB = new THREE.Vector3();
        const vZ = new THREE.Vector3();
        boostplugGroup.getWorldPosition(vB);
        zheavenzyGroup.getWorldPosition(vZ);

        const dirBZ = new THREE.Vector3().subVectors(vZ, vB);
        const distBZ = dirBZ.length();
        const normDirBZ = dirBZ.clone().normalize();
        const midPointBZ = new THREE.Vector3().addVectors(vB, vZ).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D lichtbundel */
        boostplugZheavenzyBeam.position.copy(midPointBZ);
        boostplugZheavenzyBeam.quaternion.setFromUnitVectors(upVector, normDirBZ);
        boostplugZheavenzyBeam.scale.set(1, distBZ, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (boostplugZheavenzyHalo) {
          boostplugZheavenzyHalo.position.copy(midPointBZ);
          boostplugZheavenzyHalo.quaternion.setFromUnitVectors(upVector, normDirBZ);
          boostplugZheavenzyHalo.scale.set(1, distBZ, 1);
          boostplugZheavenzyHalo.rotateY(elapsed * 1.35 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (boostplugZheavenzyAnchor1) boostplugZheavenzyAnchor1.position.copy(vB);
        if (boostplugZheavenzyAnchor2) boostplugZheavenzyAnchor2.position.copy(vZ);

        /* 4. Hoge boogvormige energielijn die over het centrum welft */
        const midArcBZ = midPointBZ.clone().add(new THREE.Vector3(0, 3.1, 0));
        if (boostplugZheavenzyArchLine) {
          const curveBZ = new THREE.CatmullRomCurve3([vB, midArcBZ, vZ]);
          const pointsBZ = curveBZ.getPoints(48);
          const posAttr = boostplugZheavenzyArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsBZ[i].x;
            arr[i * 3 + 1] = pointsBZ[i].y;
            arr[i * 3 + 2] = pointsBZ[i].z;
          }
          posAttr.needsUpdate = true;
          boostplugZheavenzyArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (boostplugZheavenzyLabel) {
          boostplugZheavenzyLabel.position.set(midArcBZ.x, midArcBZ.y + 0.65, midArcBZ.z);
        }

        /* 6. Fotonen die continu reizen tussen Boostplug en Zheavenzy */
        const pModBZ1 = (elapsed * 0.55 * speedMod) % 1;
        const pModBZ2 = (1 - (elapsed * 0.55 * speedMod) % 1) % 1;
        if (boostplugZheavenzyBead1) boostplugZheavenzyBead1.position.lerpVectors(vB, vZ, pModBZ1);
        if (boostplugZheavenzyBead2) boostplugZheavenzyBead2.position.lerpVectors(vB, vZ, pModBZ2);

        /* 7. Oplichten bij selectie of hover van Boostplug of Zheavenzy */
        const isBoostplugZheavenzyActive =
          selectedLtdName?.includes('Boostplug') ||
          selectedLtdName?.includes('Zheavenzy') ||
          hoveredEntity?.name?.includes('Boostplug') ||
          hoveredEntity?.name?.includes('Zheavenzy');

        const beamMatBZ = boostplugZheavenzyBeam.material as THREE.MeshStandardMaterial;
        if (isBoostplugZheavenzyActive) {
          beamMatBZ.emissiveIntensity = 2.8;
          boostplugZheavenzyBeam.scale.set(1.5, distBZ, 1.5);
          if (boostplugZheavenzyHalo) {
            (boostplugZheavenzyHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMatBZ.emissiveIntensity = 1.8;
          if (boostplugZheavenzyHalo) {
            (boostplugZheavenzyHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen Boostplug en Logs.rent */
      if (boostplugGroup && logsRentGroup && boostplugLogsBeam) {
        const vB = new THREE.Vector3();
        const vL = new THREE.Vector3();
        boostplugGroup.getWorldPosition(vB);
        logsRentGroup.getWorldPosition(vL);

        const dirBL = new THREE.Vector3().subVectors(vL, vB);
        const distBL = dirBL.length();
        const normDirBL = dirBL.clone().normalize();
        const midPointBL = new THREE.Vector3().addVectors(vB, vL).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D lichtbundel */
        boostplugLogsBeam.position.copy(midPointBL);
        boostplugLogsBeam.quaternion.setFromUnitVectors(upVector, normDirBL);
        boostplugLogsBeam.scale.set(1, distBL, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (boostplugLogsHalo) {
          boostplugLogsHalo.position.copy(midPointBL);
          boostplugLogsHalo.quaternion.setFromUnitVectors(upVector, normDirBL);
          boostplugLogsHalo.scale.set(1, distBL, 1);
          boostplugLogsHalo.rotateY(elapsed * 1.35 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (boostplugLogsAnchor1) boostplugLogsAnchor1.position.copy(vB);
        if (boostplugLogsAnchor2) boostplugLogsAnchor2.position.copy(vL);

        /* 4. Hoge boogvormige energielijn die over het centrum welft */
        const midArcBL = midPointBL.clone().add(new THREE.Vector3(0, 2.8, 0));
        if (boostplugLogsArchLine) {
          const curveBL = new THREE.CatmullRomCurve3([vB, midArcBL, vL]);
          const pointsBL = curveBL.getPoints(48);
          const posAttr = boostplugLogsArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsBL[i].x;
            arr[i * 3 + 1] = pointsBL[i].y;
            arr[i * 3 + 2] = pointsBL[i].z;
          }
          posAttr.needsUpdate = true;
          boostplugLogsArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (boostplugLogsLabel) {
          boostplugLogsLabel.position.set(midArcBL.x, midArcBL.y + 0.65, midArcBL.z);
        }

        /* 6. Fotonen die continu reizen tussen Boostplug en Logs.rent */
        const pModBL1 = (elapsed * 0.60 * speedMod) % 1;
        const pModBL2 = (1 - (elapsed * 0.60 * speedMod) % 1) % 1;
        if (boostplugLogsBead1) boostplugLogsBead1.position.lerpVectors(vB, vL, pModBL1);
        if (boostplugLogsBead2) boostplugLogsBead2.position.lerpVectors(vL, vB, pModBL2);

        /* 7. Oplichten bij selectie of hover van Boostplug of Logs.rent */
        const isBoostplugLogsActive =
          selectedLtdName?.includes('Boostplug') ||
          selectedLtdName?.toLowerCase().includes('logs') ||
          hoveredEntity?.name?.includes('Boostplug') ||
          hoveredEntity?.name?.toLowerCase().includes('logs');

        const beamMatBL = boostplugLogsBeam.material as THREE.MeshStandardMaterial;
        if (isBoostplugLogsActive) {
          beamMatBL.emissiveIntensity = 2.8;
          boostplugLogsBeam.scale.set(1.5, distBL, 1.5);
          if (boostplugLogsHalo) {
            (boostplugLogsHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMatBL.emissiveIntensity = 1.8;
          if (boostplugLogsHalo) {
            (boostplugLogsHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen Xabi World en Investbotiq */
      if (xabiWorldGroup && investbotiqGroup && xabiInvestbotiqBeam) {
        const vX = new THREE.Vector3();
        const vI = new THREE.Vector3();
        xabiWorldGroup.getWorldPosition(vX);
        investbotiqGroup.getWorldPosition(vI);

        const dirXI = new THREE.Vector3().subVectors(vI, vX);
        const distXI = dirXI.length();
        const normDirXI = dirXI.clone().normalize();
        const midPointXI = new THREE.Vector3().addVectors(vX, vI).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D lichtbundel */
        xabiInvestbotiqBeam.position.copy(midPointXI);
        xabiInvestbotiqBeam.quaternion.setFromUnitVectors(upVector, normDirXI);
        xabiInvestbotiqBeam.scale.set(1, distXI, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (xabiInvestbotiqHalo) {
          xabiInvestbotiqHalo.position.copy(midPointXI);
          xabiInvestbotiqHalo.quaternion.setFromUnitVectors(upVector, normDirXI);
          xabiInvestbotiqHalo.scale.set(1, distXI, 1);
          xabiInvestbotiqHalo.rotateY(elapsed * 1.35 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (xabiInvestbotiqAnchor1) xabiInvestbotiqAnchor1.position.copy(vX);
        if (xabiInvestbotiqAnchor2) xabiInvestbotiqAnchor2.position.copy(vI);

        /* 4. Hoge boogvormige energielijn die over de ruimte welft */
        const midArcXI = midPointXI.clone().add(new THREE.Vector3(0, 3.2, 0));
        if (xabiInvestbotiqArchLine) {
          const curveXI = new THREE.CatmullRomCurve3([vX, midArcXI, vI]);
          const pointsXI = curveXI.getPoints(48);
          const posAttr = xabiInvestbotiqArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsXI[i].x;
            arr[i * 3 + 1] = pointsXI[i].y;
            arr[i * 3 + 2] = pointsXI[i].z;
          }
          posAttr.needsUpdate = true;
          xabiInvestbotiqArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (xabiInvestbotiqLabel) {
          xabiInvestbotiqLabel.position.set(midArcXI.x, midArcXI.y + 0.65, midArcXI.z);
        }

        /* 6. Fotonen die continu reizen tussen Xabi World en Investbotiq */
        const pModXI1 = (elapsed * 0.58 * speedMod) % 1;
        const pModXI2 = (1 - (elapsed * 0.58 * speedMod) % 1) % 1;
        if (xabiInvestbotiqBead1) xabiInvestbotiqBead1.position.lerpVectors(vX, vI, pModXI1);
        if (xabiInvestbotiqBead2) xabiInvestbotiqBead2.position.lerpVectors(vI, vX, pModXI2);

        /* 7. Oplichten bij selectie of hover van Xabi World of Investbotiq */
        const isXabiInvestbotiqActive =
          selectedLtdName?.toLowerCase().includes('xabi') ||
          selectedLtdName?.includes('Investbotiq') ||
          hoveredEntity?.name?.toLowerCase().includes('xabi') ||
          hoveredEntity?.name?.includes('Investbotiq');

        const beamMatXI = xabiInvestbotiqBeam.material as THREE.MeshStandardMaterial;
        if (isXabiInvestbotiqActive) {
          beamMatXI.emissiveIntensity = 2.8;
          xabiInvestbotiqBeam.scale.set(1.5, distXI, 1.5);
          if (xabiInvestbotiqHalo) {
            (xabiInvestbotiqHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMatXI.emissiveIntensity = 1.8;
          if (xabiInvestbotiqHalo) {
            (xabiInvestbotiqHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Dynamische update van de synergie lijn tussen Spontiva en DJOBBA */
      if (spontivaGroup && djobbaGroup && spontivaDjobbaBeam) {
        const vS = new THREE.Vector3();
        const vD = new THREE.Vector3();
        spontivaGroup.getWorldPosition(vS);
        djobbaGroup.getWorldPosition(vD);

        const dirSD = new THREE.Vector3().subVectors(vD, vS);
        const distSD = dirSD.length();
        const normDirSD = dirSD.clone().normalize();
        const midPointSD = new THREE.Vector3().addVectors(vS, vD).multiplyScalar(0.5);
        const upVector = new THREE.Vector3(0, 1, 0);

        /* 1. Rechte volumetrische 3D lichtbundel */
        spontivaDjobbaBeam.position.copy(midPointSD);
        spontivaDjobbaBeam.quaternion.setFromUnitVectors(upVector, normDirSD);
        spontivaDjobbaBeam.scale.set(1, distSD, 1);

        /* 2. Buitenste pulserende wireframe aura */
        if (spontivaDjobbaHalo) {
          spontivaDjobbaHalo.position.copy(midPointSD);
          spontivaDjobbaHalo.quaternion.setFromUnitVectors(upVector, normDirSD);
          spontivaDjobbaHalo.scale.set(1, distSD, 1);
          spontivaDjobbaHalo.rotateY(elapsed * 1.35 * speedMod);
        }

        /* 3. Vaste ankerpunten op de twee bedrijven */
        if (spontivaDjobbaAnchor1) spontivaDjobbaAnchor1.position.copy(vS);
        if (spontivaDjobbaAnchor2) spontivaDjobbaAnchor2.position.copy(vD);

        /* 4. Hoge boogvormige energielijn die over de ruimte welft */
        const midArcSD = midPointSD.clone().add(new THREE.Vector3(0, 3.2, 0));
        if (spontivaDjobbaArchLine) {
          const curveSD = new THREE.CatmullRomCurve3([vS, midArcSD, vD]);
          const pointsSD = curveSD.getPoints(48);
          const posAttr = spontivaDjobbaArchLine.geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i <= 48; i++) {
            arr[i * 3] = pointsSD[i].x;
            arr[i * 3 + 1] = pointsSD[i].y;
            arr[i * 3 + 2] = pointsSD[i].z;
          }
          posAttr.needsUpdate = true;
          spontivaDjobbaArchLine.geometry.computeBoundingSphere();
        }

        /* 5. Zwevend synergie badge label */
        if (spontivaDjobbaLabel) {
          spontivaDjobbaLabel.position.set(midArcSD.x, midArcSD.y + 0.65, midArcSD.z);
        }

        /* 6. Fotonen die continu reizen tussen Spontiva en DJOBBA */
        const pModSD1 = (elapsed * 0.58 * speedMod) % 1;
        const pModSD2 = (1 - (elapsed * 0.58 * speedMod) % 1) % 1;
        if (spontivaDjobbaBead1) spontivaDjobbaBead1.position.lerpVectors(vS, vD, pModSD1);
        if (spontivaDjobbaBead2) spontivaDjobbaBead2.position.lerpVectors(vD, vS, pModSD2);

        /* 7. Oplichten bij selectie of hover van Spontiva of DJOBBA */
        const isSpontivaDjobbaActive =
          selectedLtdName?.includes('Spontiva') ||
          selectedLtdName?.toLowerCase().includes('djobba') ||
          hoveredEntity?.name?.includes('Spontiva') ||
          hoveredEntity?.name?.toLowerCase().includes('djobba');

        const beamMatSD = spontivaDjobbaBeam.material as THREE.MeshStandardMaterial;
        if (isSpontivaDjobbaActive) {
          beamMatSD.emissiveIntensity = 2.8;
          spontivaDjobbaBeam.scale.set(1.5, distSD, 1.5);
          if (spontivaDjobbaHalo) {
            (spontivaDjobbaHalo.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        } else {
          beamMatSD.emissiveIntensity = 1.8;
          if (spontivaDjobbaHalo) {
            (spontivaDjobbaHalo.material as THREE.MeshBasicMaterial).opacity = 0.55;
          }
        }
      }

      /* Verplaatsing van energiefotonen over de banen */
      beamBeads.forEach((bead) => {
        bead.progress = (bead.progress + bead.speed * speedMod) % 1;
        const point = bead.curve.getPoint(bead.progress);
        bead.mesh.position.copy(point);
      });

      /* Automatische camerawandeling rondom het ecosysteem */
      if (autoRotateRef.current && !isDraggingRef.current && cameraRef.current) {
        const target = cameraTargetRef.current;
        const offset = cameraRef.current.position.clone().sub(target);
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(offset);
        spherical.theta += 0.0055 * speedMod;
        spherical.phi = Math.max(0.15, Math.min(Math.PI / 2.05, spherical.phi));
        offset.setFromSpherical(spherical);
        cameraRef.current.position.copy(target).add(offset);
      }

      /* Hover inspectie voor kleine orbs en platformen */
      if (cameraRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(nodesGroup.children, true);
        if (intersects.length > 0) {
          let isInteractive = false;
          let foundHoveredLtd: { name: string; role?: string; desc?: string; holdco: string } | null = null;

          for (const hit of intersects) {
            let curr: THREE.Object3D | null = hit.object;
            while (curr && curr !== nodesGroup) {
              if (curr.userData?.isSpontivaDjobbaSynergy) {
                foundHoveredLtd = {
                  name: 'Spontiva ⇄ DJOBBA',
                  role: 'IT Kasstromen en Time Gap Liquiditeit',
                  desc: 'Directe koppeling tussen de detacheringskasstromen van DJOBBA en de Time Gap Cashflow werkkapitaal optimalisatie van Spontiva.',
                  holdco: 'Compute'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isXabiInvestbotiqSynergy) {
                foundHoveredLtd = {
                  name: 'Xabi World ⇄ Investbotiq',
                  role: 'Directe Clearing en Autonome AI Executie',
                  desc: 'Directe financiële integratie tussen de SABI clearing rails van Xabi World en de autonome AI executie en kasstroomverdeling van Investbotiq.',
                  holdco: 'Fintech'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isBoostplugLogsSynergy) {
                foundHoveredLtd = {
                  name: 'Boostplug ⇄ Logs.rent',
                  role: 'Directe GPU Capaciteit en Compute Marketplace Verhuur',
                  desc: 'Directe koppeling tussen de mining clusters van Boostplug en het geautomatiseerde account en rekenkracht verhuurplatform Logs.rent.',
                  holdco: 'Compute'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isBoostplugZheavenzySynergy) {
                foundHoveredLtd = {
                  name: 'Boostplug ⇄ Zheavenzy',
                  role: 'GPU Compute en Media Streaming Bandbreedte',
                  desc: 'High performance GPU rekenkracht en stream point netwerkbandbreedte van Boostplug voeden de muziekproductie en streaming distributie van Zheavenzy.',
                  holdco: 'Compute'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isInvestbotiqVvcSynergy) {
                foundHoveredLtd = {
                  name: 'Investbotiq ⇄ VVC',
                  role: 'Directe Talent Allocatie en AI Intake Stroom',
                  desc: 'Autonome AI engine Investbotiq verwerkt continu talentstromen en onboarding via de centrale gateway VVC.',
                  holdco: 'IP_Tech'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isInvestbotiqSpontivaSynergy) {
                foundHoveredLtd = {
                  name: 'Investbotiq ⇄ Spontiva',
                  role: 'Directe AI Executie en Kasstroom Activatie',
                  desc: 'Autonome AI engine Investbotiq activeert direct de Time Gap Cashflow structuren van Spontiva voor continue liquiditeitsvoorziening.',
                  holdco: 'IP_Tech'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isBoostplugSpontivaSynergy) {
                foundHoveredLtd = {
                  name: 'Boostplug ⇄ Spontiva',
                  role: 'Directe GPU Compute en Time Gap Cashflow Synergie',
                  desc: 'GPU cluster infrastructuur van Boostplug gekoppeld aan Spontiva voor directe liquiditeitsallocatie en werkkapitaal financiering.',
                  holdco: 'Compute'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isSpontivaSynergy) {
                foundHoveredLtd = {
                  name: 'WoningVry ⇄ Spontiva',
                  role: 'Directe Vastgoed en Time Gap Cashflow Synergie',
                  desc: 'PropTech verhuurplatform WoningVry gekoppeld aan Spontiva voor versnelde werkkapitaal optimalisatie en directe liquiditeit in huurcycli.',
                  holdco: 'RealEstate'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isSynergyConnection) {
                foundHoveredLtd = {
                  name: 'WoningVry ⇄ Afterstudenthousing',
                  role: 'Directe Vastgoed en Living Synergie',
                  desc: 'PropTech verhuurplatform gekoppeld aan Young Professional Living voor maximale bezettingsgraad en huurdersretentie.',
                  holdco: 'RealEstate'
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.isLtdEntity && curr.userData?.entityName) {
                foundHoveredLtd = {
                  name: curr.userData.entityName,
                  role: curr.userData.role,
                  desc: curr.userData.desc,
                  holdco: curr.userData.parentHoldcoKey
                };
                isInteractive = true;
                break;
              }
              if (curr.userData?.key || curr.userData?.parentKey) {
                isInteractive = true;
                break;
              }
              curr = curr.parent;
            }
            if (isInteractive) break;
          }

          if (isInteractive) {
            container.style.cursor = 'pointer';
            setHoveredEntity(foundHoveredLtd);
          } else {
            container.style.cursor = 'default';
            setHoveredEntity(null);
          }
        } else {
          container.style.cursor = 'default';
          setHoveredEntity(null);
        }
      }

      /* Cameradoel vloeiend interpoleren */
      currentLookAtRef.current.lerp(cameraTargetRef.current, 0.06);
      if (cameraRef.current) {
        cameraRef.current.lookAt(currentLookAtRef.current);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [onSelectNode, velocityMultiplier]);

  /* Focus effect bij verandering van selectedNodeKey */
  useEffect(() => {
    const node = nodesMapRef.current.get(selectedNodeKey);
    if (node) {
      node.scale.set(1.2, 1.2, 1.2);
      setTimeout(() => {
        node.scale.set(1, 1, 1);
      }, 300);

      const targetPos = node.position.clone();
      if (selectedNodeKey === 'Moederholding') {
        cameraTargetRef.current.set(0, 1.0, 0);
      } else {
        cameraTargetRef.current.copy(targetPos).multiplyScalar(0.5);
      }
    }
  }, [selectedNodeKey]);

  /* Visuele markering wanneer een specifieke entiteit is geselecteerd */
  useEffect(() => {
    animatedLtdEntitiesRef.current.forEach((ltdGroup) => {
      const isSelected = ltdGroup.userData.entityName === selectedLtdName;
      const aura = ltdGroup.getObjectByName('ltd_select_aura');
      const coreMesh = ltdGroup.getObjectByName('ltd_core_mesh') as THREE.Mesh | undefined;

      if (aura) {
        aura.visible = isSelected;
      }

      if (coreMesh && coreMesh.material) {
        const mat = coreMesh.material as THREE.MeshStandardMaterial;
        if (isSelected) {
          mat.emissiveIntensity = 0.95;
          ltdGroup.scale.set(1.4, 1.4, 1.4);
        } else {
          mat.emissiveIntensity = 0.55;
          ltdGroup.scale.set(1, 1, 1);
        }
      }

      const labelSprite = ltdGroup.getObjectByName('ltd_label_sprite') as THREE.Sprite | undefined;
      if (labelSprite) {
        if (isSelected) {
          labelSprite.scale.set(2.9, 0.75, 1);
          (labelSprite.material as THREE.SpriteMaterial).opacity = 1.0;
        } else {
          labelSprite.scale.set(2.4, 0.62, 1);
          (labelSprite.material as THREE.SpriteMaterial).opacity = 0.95;
        }
      }
    });

    if (selectedLtdName) {
      const matchedEntity = animatedLtdEntitiesRef.current.find(
        (g) => g.userData.entityName === selectedLtdName
      );
      if (matchedEntity) {
        const worldPos = new THREE.Vector3();
        matchedEntity.getWorldPosition(worldPos);
        cameraTargetRef.current.copy(worldPos).multiplyScalar(0.65);
      }
    }
  }, [selectedLtdName]);

  return (
    <div
      ref={containerRef}
      id="canvasContainer"
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-auto"
      style={{
        background:
          theme === 'light'
            ? 'radial-gradient(ellipse at center, #f4f9ff 0%, #e0f2fe 100%)'
            : 'radial-gradient(ellipse at center, rgba(14, 25, 52, 0.95) 0%, rgba(4, 7, 15, 1) 100%)'
      }}
    >
      {/* Vliegende interactieve badge bij hoveren over een entiteit */}
      {hoveredEntity && (
        <div
          className={`absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl backdrop-blur-md text-xs font-medium shadow-2xl flex flex-col items-center gap-1 pointer-events-none z-30 animate-fade-in max-w-lg text-center ${
            theme === 'light'
              ? 'bg-white/95 border border-sky-200 text-sky-950 shadow-sky-500/10'
              : 'bg-slate-900/95 border border-amber-400/40 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
              {hoveredEntity.name}
            </span>
            {hoveredEntity.role && (
              <span className={`text-[11px] ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-300'}`}>
                | {hoveredEntity.role}
              </span>
            )}
          </div>
          {hoveredEntity.desc && (
            <p className={`text-[11px] font-normal leading-relaxed max-w-md ${theme === 'light' ? 'text-sky-900/80' : 'text-slate-300'}`}>
              {hoveredEntity.desc}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

EcosystemCanvas.displayName = 'EcosystemCanvas';

export default EcosystemCanvas;
