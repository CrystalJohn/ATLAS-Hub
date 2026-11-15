'use client';

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { CanvasTexture, Quaternion, Sphere, SRGBColorSpace, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { worldPaths } from '../../../content/travel/catalog';

const anchors = { JP: [138, 37], US: [-99, 39] } as const;
type Destination = keyof typeof anchors;
type Focus = { id: string; coordinates: readonly [number, number] };
const overview = new Vector3(-3.1, 1.65, -2.1).normalize();
const globeBounds = new Sphere(new Vector3(), 1);
type CameraCommand = { action: 'in' | 'out' | 'reset' };

function direction([lon, lat]: readonly [number, number]) {
  const x = lon * Math.PI / 180;
  const y = lat * Math.PI / 180;
  return new Vector3(Math.cos(y) * Math.cos(x), Math.sin(y), -Math.cos(y) * Math.sin(x));
}

function makeMaps() {
  const paint = document.createElement('canvas');
  paint.width = 1536;
  paint.height = 768;
  const relief = paint.cloneNode() as HTMLCanvasElement;
  const color = paint.getContext('2d')!;
  const height = relief.getContext('2d')!;
  color.scale(paint.width / 1080, paint.height / 540);
  height.scale(paint.width / 1080, paint.height / 540);
  color.fillStyle = '#54b8cc';
  color.fillRect(0, 0, 1080, 540);
  height.fillStyle = '#222';
  height.fillRect(0, 0, 1080, 540);
  const palette = ['#87bc79', '#95c486', '#a4cb83', '#83bd92', '#a6c893'];
  for (const [index, country] of worldPaths.entries()) {
    const path = new Path2D(country.d);
    color.fillStyle = country.id === 'AQ' ? '#e2f4ed' : palette[index % palette.length];
    color.fill(path, 'evenodd');
    color.strokeStyle = '#4d927b';
    color.lineWidth = .55;
    color.stroke(path);
    height.fillStyle = '#ccc';
    height.fill(path, 'evenodd');
  }
  const map = new CanvasTexture(paint);
  map.colorSpace = SRGBColorSpace;
  const picks = worldPaths.filter(country => country.id === 'JP' || country.id === 'US')
    .map(country => ({ id: country.id as Destination, path: new Path2D(country.d) }));
  const hitTest = document.createElement('canvas').getContext('2d')!;
  return { map, bumpMap: new CanvasTexture(relief), picks, hitTest };
}

function Scene({ focus, selected, onSelect, onFailure, command }: {
  focus: Focus | null;
  selected: string;
  onSelect: (id: Destination) => void;
  onFailure: () => void;
  command: CameraCommand | null;
}) {
  const { camera, gl, invalidate } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const flight = useRef<{ from: Vector3; rotation: Quaternion; radius: number; start: number; frames: number } | null>(null);
  const turn = useRef(new Quaternion());
  const [maps] = useState(makeMaps);
  const firstFrame = useRef(true);

  useEffect(() => {
    const surface = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    surface.addEventListener('webglcontextlost', lost);
    const orbit = new OrbitControls(camera, surface);
    orbit.enablePan = false;
    orbit.minDistance = 2.65;
    orbit.maxDistance = 6;
    orbit.rotateSpeed = .7;
    orbit.addEventListener('change', () => invalidate());
    const cancelFlight = () => { flight.current = null; };
    orbit.addEventListener('start', cancelFlight);
    orbit.addEventListener('end', () => performance.mark('atlas-globe:orbit-input'));
    controls.current = orbit;
    camera.position.copy(overview).multiplyScalar(4.1);
    orbit.update();
    return () => {
      orbit.dispose();
      controls.current = null;
      surface.removeEventListener('webglcontextlost', lost);
    };
  }, [camera, gl, invalidate, onFailure]);

  useEffect(() => () => {
    maps.map.dispose();
    maps.bumpMap.dispose();
  }, [maps]);

  useEffect(() => {
    if (!focus || !controls.current) return;
    const to = direction(focus.coordinates);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      camera.position.copy(to).multiplyScalar(3.25);
      controls.current.update();
      invalidate();
      return;
    }
    flight.current = {
      from: camera.position.clone().normalize(),
      rotation: new Quaternion().setFromUnitVectors(camera.position.clone().normalize(), to),
      radius: camera.position.length(), start: performance.now(), frames: 0,
    };
    invalidate();
  }, [focus, camera, invalidate]);

  useEffect(() => {
    const orbit = controls.current;
    if (!command || !orbit) return;
    flight.current = null;
    if (command.action === 'reset') camera.position.copy(overview).multiplyScalar(4.1);
    else camera.position.setLength(camera.position.length() * (command.action === 'in' ? .84 : 1.19));
    orbit.update();
    invalidate();
  }, [command, camera, invalidate]);

  useFrame(() => {
    const current = flight.current;
    if (current) {
      const progress = Math.min(1, (performance.now() - current.start) / 850);
      const eased = progress * progress * (3 - 2 * progress);
      current.frames++;
      camera.position.copy(current.from).applyQuaternion(turn.current.identity().slerp(current.rotation, eased));
      camera.position.multiplyScalar(current.radius + (3.25 - current.radius) * eased);
      controls.current?.update();
      if (progress < 1) invalidate();
      else {
        flight.current = null;
        performance.measure('atlas-globe:fly-to', {
          start: current.start, end: performance.now(), detail: { frames: current.frames },
        });
      }
    }
    if (firstFrame.current) {
      firstFrame.current = false;
      queueMicrotask(() => performance.mark('atlas-globe:first-scene-frame', {
        detail: {
          calls: gl.info.render.calls, triangles: gl.info.render.triangles,
          textures: gl.info.memory.textures, pixelRatio: gl.getPixelRatio(),
        },
      }));
    }
  });

  function pick(event: ThreeEvent<MouseEvent>, id: Destination) {
    const surface = event.ray.intersectSphere(globeBounds, new Vector3());
    if (event.delta > 5 || (surface && surface.distanceTo(event.ray.origin) < event.distance)) return;
    event.stopPropagation();
    onSelect(id);
  }

  return <>
    <hemisphereLight args={['#fff6dd', '#5989ae', 2.25]} />
    <directionalLight position={[-3, 4, 4]} intensity={2} color="#fff2d7" />
    <mesh onClick={event => {
      if (!event.uv || event.delta > 5) return;
      const { x, y } = event.uv;
      const country = maps.picks.find(({ path }) => maps.hitTest.isPointInPath(path, x * 1080, (1 - y) * 540, 'evenodd'));
      if (country) onSelect(country.id);
    }}>
      <sphereGeometry args={[1, 72, 48]} />
      <meshStandardMaterial map={maps.map} bumpMap={maps.bumpMap} bumpScale={.043} flatShading roughness={.82} />
    </mesh>
    {(Object.keys(anchors) as Destination[]).map(id => {
      const normal = direction(anchors[id]);
      const position = normal.clone().multiplyScalar(1.07);
      const rotation = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), normal);
      return <group key={id} position={position} quaternion={rotation}>
        <mesh position={[0, -.045, 0]}>
          <cylinderGeometry args={[.058, .071, .055, 8]} />
          <meshStandardMaterial color={id === 'JP' ? '#5a7d68' : '#c99569'} flatShading />
        </mesh>
        <mesh onClick={event => pick(event, id)}>
          <sphereGeometry args={[.065, 10, 8]} />
          <meshStandardMaterial color={selected === id ? '#8c59d3' : '#eea57b'}
            emissive={selected === id ? '#4b2287' : '#492513'} emissiveIntensity={.45} flatShading />
        </mesh>
      </group>;
    })}
    <Landmark coordinates={[139, 34]} color="#748daf" peak="#fdf2df" />
    <Landmark coordinates={[-111, 36]} color="#bc785d" peak="#e1a876" mesa />
  </>;
}

function Landmark({ coordinates, color, peak, mesa = false }: {
  coordinates: readonly [number, number]; color: string; peak: string; mesa?: boolean;
}) {
  const normal = direction(coordinates);
  return <group position={normal} quaternion={new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), normal)}>
    <mesh position={[0, .028, 0]}>
      <cylinderGeometry args={[mesa ? .037 : .022, .062, .076, 6]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
    <mesh position={[0, .077, 0]}>
      <cylinderGeometry args={[mesa ? .029 : 0, mesa ? .037 : .022, .022, 6]} />
      <meshStandardMaterial color={peak} flatShading />
    </mesh>
  </group>;
}

export default function WorldGlobe({ labels, ...props }: Omit<Parameters<typeof Scene>[0], 'command'> & {
  labels: readonly [string, string, string];
}) {
  const [command, setCommand] = useState<CameraCommand | null>(null);
  return <><Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 39, near: .1, far: 30 }}
    gl={async options => {
      try {
        return new WebGLRenderer({ ...options, antialias: true, powerPreference: 'low-power' });
      } catch {
        // R3F configures the renderer asynchronously. Leave initialization pending until the fallback unmounts Canvas.
        queueMicrotask(props.onFailure);
        return new Promise<never>(() => {});
      }
    }}
    onCreated={() => performance.mark('atlas-globe:renderer-created')}>
    <Scene {...props} command={command} />
  </Canvas>
  <div className="world-zoom">{(['in', 'out', 'reset'] as const).map((action, index) =>
    <button key={action} type="button" aria-label={labels[index]} onClick={() => setCommand({ action })}>
      {['+', '−', '↺'][index]}
    </button>)}</div></>;
}
