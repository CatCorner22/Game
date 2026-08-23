import { memo, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { Actor, ActorId, LaunchSite, MissileFx, World } from "@/lib/game/types";
import { ACTOR_IDS } from "@/lib/game/types";
import { latLonToVec3 } from "@/lib/game/geo";
import { actorFlashHeat } from "./FlashpointBoard";
import { loadSettings } from "@/lib/game/settings";

const R = 1.62;
const EARTH_SEGMENTS = 48;
const ATMOS_SEGMENTS = 32;
const ARC_POINTS = 28;
const EMISSIVE = new THREE.Color("#7ec8ff");

function useEarthTextures() {
  const [failed, setFailed] = useState(false);
  const dark = useMemo(() => {
    const t = new THREE.TextureLoader().load(
      "/textures/earth-dark.jpg",
      undefined,
      undefined,
      () => setFailed(true),
    );
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  const night = useMemo(() => {
    const t = new THREE.TextureLoader().load(
      "/textures/earth-night.jpg",
      undefined,
      undefined,
      () => setFailed(true),
    );
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  return { dark, night, failed };
}

function EarthFallback() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float lat = vNormal.y * 0.5 + 0.5;
            vec3 ocean = vec3(0.04, 0.06, 0.12);
            vec3 land = vec3(0.12, 0.14, 0.10);
            float landMask = step(0.52, sin(vNormal.x * 8.0) * cos(vNormal.z * 6.0) + 0.15 * sin(lat * 20.0));
            vec3 base = mix(ocean, land, landMask);
            float rim = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(base + rim * 0.08, 1.0);
          }
        `,
      }),
    [],
  );
  return (
    <mesh>
      <sphereGeometry args={[R, EARTH_SEGMENTS, EARTH_SEGMENTS]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function Earth() {
  const { dark, night, failed } = useEarthTextures();
  if (failed) return <EarthFallback />;
  return (
    <mesh>
      <sphereGeometry args={[R, EARTH_SEGMENTS, EARTH_SEGMENTS]} />
      <meshStandardMaterial
        map={dark}
        emissiveMap={night}
        emissive={EMISSIVE}
        emissiveIntensity={0.72}
        roughness={0.86}
        metalness={0.04}
      />
    </mesh>
  );
}

function Atmosphere() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float i = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(0.0, 0.78, 0.92, 1.0) * i;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  return (
    <mesh scale={1.12}>
      <sphereGeometry args={[R, ATMOS_SEGMENTS, ATMOS_SEGMENTS]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function markerColor(actor: Actor, selected: boolean, flashHeat: number): string {
  if (selected) return "#e8f4ff";
  if (flashHeat >= 70) return "#f2495f";
  if (flashHeat >= 45) return "#22d3ee";
  if (actor.id === "US") return "#22d3ee";
  if (actor.hostility.US >= 70) return "#f2495f";
  if (actor.hostility.US <= 28) return "#34d399";
  return "#8ba3bc";
}

function SiteMarks({ sites, selected }: { sites: LaunchSite[]; selected: ActorId }) {
  return (
    <group>
      {sites
        .filter((s) => s.owner === selected)
        .map((s) => {
          const [x, y, z] = latLonToVec3(s.lat, s.lon, R + 0.028);
          const ours = Boolean(s.ourSpy && !s.ourSpy.burned);
          const watched = Boolean(s.hostile && !s.hostile.burned && s.hostile.known);
          const color = ours ? "#22d3ee" : watched ? "#f2495f" : "#7d8fa6";
          return (
            <mesh key={s.id} position={[x, y, z]} scale={0.55}>
              <boxGeometry args={[0.04, 0.04, 0.04]} />
              <meshBasicMaterial color={color} />
            </mesh>
          );
        })}
    </group>
  );
}

function HeatRing({ lat, lon, heat }: { lat: number; lon: number; heat: number }) {
  if (heat < 25) return null;
  const [x, y, z] = latLonToVec3(lat, lon, R + 0.06);
  const scale = 0.08 + (heat / 100) * 0.12;
  const opacity = 0.15 + (heat / 100) * 0.35;
  return (
    <mesh position={[x, y, z]} scale={scale}>
      <ringGeometry args={[0.6, 1, 24]} />
      <meshBasicMaterial color={heat >= 70 ? "#f2495f" : "#22d3ee"} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Markers({
  actors,
  selected,
  onSelect,
  flashHeat,
}: {
  actors: Record<ActorId, Actor>;
  selected: ActorId;
  onSelect: (id: ActorId) => void;
  flashHeat: Record<ActorId, number>;
}) {
  return (
    <group>
      {ACTOR_IDS.map((id) => {
        const a = actors[id];
        if (a.nonstate && !a.hasDevice && a.intel < 40) return null;
        const heat = flashHeat[id] ?? 0;
        const [x, y, z] = latLonToVec3(a.lat, a.lon, R + 0.04);
        const sel = id === selected;
        return (
          <group key={id}>
            <HeatRing lat={a.lat} lon={a.lon} heat={heat} />
            <mesh
              position={[x, y, z]}
              scale={sel ? 1.45 : 1}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(id);
              }}
            >
              <octahedronGeometry args={[sel ? 0.045 : 0.032, 0]} />
              <meshBasicMaterial color={markerColor(a, sel, heat)} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function ArcPrimitive({ points, emphasized }: { points: THREE.Vector3[]; emphasized?: boolean }) {
  const obj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: emphasized ? 0xff3366 : 0x00e5ff,
      transparent: true,
      opacity: emphasized ? 1 : 0.85,
      linewidth: emphasized ? 2 : 1,
    });
    return new THREE.Line(geo, mat);
  }, [points, emphasized]);
  return <primitive object={obj} />;
}

function Arcs({
  missiles,
  actors,
  emphasized,
}: {
  missiles: MissileFx[];
  actors: Record<ActorId, Actor>;
  emphasized?: boolean;
}) {
  const curves = useMemo(() => {
    return missiles.map((m) => {
      const from = actors[m.from];
      const to = actors[m.to];
      const a = new THREE.Vector3(...latLonToVec3(from.lat, from.lon, R + 0.02));
      const b = new THREE.Vector3(...latLonToVec3(to.lat, to.lon, R + 0.02));
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + (emphasized ? 0.75 : 0.55));
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      return { id: m.id, pts: curve.getPoints(ARC_POINTS), toPos: b };
    });
  }, [missiles, actors, emphasized]);

  return (
    <group>
      {curves.map((c) => (
        <ArcPrimitive key={c.id} points={c.pts} emphasized={emphasized} />
      ))}
      {curves.map((c) => (
        <mesh key={`${c.id}-flash`} position={c.toPos}>
          <sphereGeometry args={[emphasized ? 0.08 : 0.05, 12, 12]} />
          <meshBasicMaterial color="#f2f0ea" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({
  actors,
  selected,
  onSelect,
  missiles,
  sites,
  flashHeat,
  emphasizedArcs,
}: {
  actors: Record<ActorId, Actor>;
  selected: ActorId;
  onSelect: (id: ActorId) => void;
  missiles: MissileFx[];
  sites: LaunchSite[];
  flashHeat: Record<ActorId, number>;
  emphasizedArcs?: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#070b12"]} />
      {/* Lift the terminator: enough ambient that the night side is a surface
          rather than a hole, and a cool rim light to separate limb from space. */}
      <ambientLight intensity={0.34} />
      <directionalLight position={[6, 2.4, 3.2]} intensity={1.35} color="#eef5ff" />
      <directionalLight position={[-4, -1, -2]} intensity={0.42} color="#22d3ee" />
      <Stars radius={40} depth={18} count={700} factor={2.2} fade speed={0.2} />
      <Earth />
      <Atmosphere />
      <Markers actors={actors} selected={selected} onSelect={onSelect} flashHeat={flashHeat} />
      <SiteMarks sites={sites} selected={selected} />
      <Arcs missiles={missiles} actors={actors} emphasized={emphasizedArcs} />
      <OrbitControls
        enablePan={false}
        autoRotate={!emphasizedArcs && !loadSettings().reducedMotion}
        autoRotateSpeed={0.28}
        minDistance={2.35}
        maxDistance={5.4}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

export type GlobeCanvasProps = {
  actors: Record<ActorId, Actor>;
  selected: ActorId;
  onSelect: (id: ActorId) => void;
  missiles: MissileFx[];
  sites: LaunchSite[];
  world?: World;
  emphasizedArcs?: boolean;
};

export const GlobeCanvas = memo(function GlobeCanvas({ world, emphasizedArcs, ...props }: GlobeCanvasProps) {
  const reduced = loadSettings().reducedMotion;
  const flashHeat = useMemo(() => {
    if (!world) return {} as Record<ActorId, number>;
    const out = {} as Record<ActorId, number>;
    for (const id of ACTOR_IDS) out[id] = actorFlashHeat(world, id);
    return out;
  }, [world?.turn, world?.flashpoints, world?.defcon]);

  return (
    <Canvas
      dpr={[1, 1.35]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [-0.4, 1.1, 3.35], fov: 38 }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <Scene {...props} flashHeat={flashHeat} emphasizedArcs={emphasizedArcs} />
    </Canvas>
  );
});
