import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type RouteNodeKind = 'entry' | 'hub' | 'destination';

export interface RouteNode {
  id: string;
  label: string;
  stage: number;
  kind: RouteNodeKind;
}

export interface RouteGraph {
  nodes: RouteNode[];
  edges: Array<[string, string]>;
}

interface RouteFlow3DProps {
  graph: RouteGraph;
  theme?: 'dark' | 'light';
}

const KIND_COLOR: Record<RouteNodeKind, string> = {
  entry: '#f59e0b',
  hub: '#22d3ee',
  destination: '#94a3b8',
};

const KIND_RADIUS: Record<RouteNodeKind, number> = {
  entry: 0.34,
  hub: 0.28,
  destination: 0.16,
};

function createNodeLabel(text: string, colorHex: string): THREE.Sprite {
  const fontSize = 40;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
  const metrics = ctx.measureText(text);
  canvas.width = Math.ceil(metrics.width) + 28;
  canvas.height = fontSize + 24;
  ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
  const w = canvas.width, h = canvas.height;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 12);
  ctx.fill();
  ctx.fillStyle = colorHex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  const scale = 0.0035;
  sprite.scale.set(w * scale, h * scale, 1);
  return sprite;
}

const RouteFlow3D: React.FC<RouteFlow3DProps> = ({ graph, theme = 'dark' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(0, 2.6, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(theme === 'light' ? 0xffffff : 0x8899bb, theme === 'light' ? 1.1 : 0.9);
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(4, 8, 6);
    const rim = new THREE.PointLight(0x22d3ee, 6, 40);
    rim.position.set(-6, 4, -4);
    scene.add(ambient, key, rim);

    const root = new THREE.Group();
    scene.add(root);

    const maxStage = Math.max(...graph.nodes.map((n) => n.stage), 1);
    const stageGap = 6.4 / Math.max(maxStage, 1);
    const nodeMeshes = new Map<string, THREE.Group>();

    const byStage = new Map<number, RouteNode[]>();
    graph.nodes.forEach((n) => {
      const list = byStage.get(n.stage) ?? [];
      list.push(n);
      byStage.set(n.stage, list);
    });

    byStage.forEach((nodes, stage) => {
      const x = -3.2 + stage * stageGap;
      const radius = nodes.length <= 1 ? 0 : Math.min(2.4, 0.62 + nodes.length * 0.22);
      nodes.forEach((node, idx) => {
        const angle = nodes.length <= 1 ? 0 : (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const y = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const group = new THREE.Group();
        group.position.set(x, y, z);

        const color = KIND_COLOR[node.kind];
        const geo = new THREE.SphereGeometry(KIND_RADIUS[node.kind], 24, 24);
        const mat = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.35,
          roughness: 0.35,
          emissive: node.kind === 'destination' ? '#000000' : color,
          emissiveIntensity: node.kind === 'entry' ? 0.55 : node.kind === 'hub' ? 0.45 : 0,
        });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        if (node.kind !== 'destination') {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(KIND_RADIUS[node.kind] + 0.12, 0.022, 10, 40),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75 })
          );
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
        }

        const label = createNodeLabel(node.label, color);
        label.position.set(0, KIND_RADIUS[node.kind] + 0.42, 0);
        group.add(label);

        root.add(group);
        nodeMeshes.set(node.id, group);
      });
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: theme === 'light' ? '#64748b' : '#475569',
      transparent: true,
      opacity: 0.85,
    });
    const curves: THREE.QuadraticBezierCurve3[] = [];
    graph.edges.forEach(([fromId, toId]) => {
      const from = nodeMeshes.get(fromId);
      const to = nodeMeshes.get(toId);
      if (!from || !to) return;
      const a = from.position.clone();
      const b = to.position.clone();
      const mid = a.clone().lerp(b, 0.5);
      mid.y += a.distanceTo(b) * 0.18;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      curves.push(curve);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      root.add(new THREE.Line(geo, edgeMat));
    });

    const pulseGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: '#facc15' });
    const pulses = curves.slice(0, 24).map((curve, i) => {
      const p = new THREE.Mesh(pulseGeo, pulseMat);
      p.userData = { curve, offset: i / curves.length };
      root.add(p);
      return p;
    });

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(mount);

    let raf = 0;
    const start = performance.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - start) / 1000;
      root.rotation.y = t * 0.14;
      pulses.forEach((p) => {
        const u = (t * 0.25 + p.userData.offset) % 1;
        p.position.copy(p.userData.curve.getPoint(u));
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Sprite) {
          const o = obj as THREE.Mesh;
          o.geometry?.dispose?.();
          const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m?.dispose?.();
        }
      });
      renderer.dispose();
    };
  }, [graph, theme]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default RouteFlow3D;
