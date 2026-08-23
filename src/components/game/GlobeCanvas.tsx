import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { Actor, ActorId, LaunchSite, MissileFx } from "@/lib/game/types";
import { ACTOR_IDS } from "@/lib/game/types";
import { latLonToVec3 } from "@/lib/game/geo";

const R = 1.62;

function Earth() {
  const dark = useMemo(() => new THREE.TextureLoader().load("/textures/earth-dark.jpg"), []);
  const night = useMemo(() => new THREE.TextureLoader().load("/textures/earth-night.jpg"), []);
  dark.colorSpace = THREE.SRGBColorSpace;
  night.colorSpace = THREE.SRGBColorSpace;
  dark.anisotropy = 8;
  night.anisotropy = 8;
  return (
    <mesh>
      <sphereGeometry args={[R, 64, 64]} />
      <meshStandardMaterial
        map={dark}
        emissiveMap={night}
        emissive={new THREE.Color("#c4b8a0")}
        emissiveIntensity={0.42}
        roughness={0.92}
        metalness={0.05}
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
            gl_FragColor = vec4(0.55, 0.62, 0.78, 1.0) * i;
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
      <sphereGeometry args={[R, 48, 48]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function markerColor(actor: Actor, selected: boolean): string {
  if (selected) return "#f2f0ea";
  if (actor.id === "US") return "#c4a35a";
  if (actor.hostility.US >= 70) return "#b42318";
  if (actor.hostility.US <= 28) return "#6b7f5a";
  return "#8a8680";
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
          const color = ours ? "#c4a35a" : watched ? "#b42318" : "#5c5955";
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

function Markers({
  actors,
  selected,
  onSelect,
}: {
  actors: Record<ActorId, Actor>;
  selected: ActorId;
  onSelect: (id: ActorId) => void;
}) {
  return (
    <group>
      {ACTOR_IDS.map((id) => {
        const a = actors[id];
        if (a.nonstate && !a.hasDevice && a.intel < 40) return null;
        const [x, y, z] = latLonToVec3(a.lat, a.lon, R + 0.04);
        const sel = id === selected;
        return (
          <mesh
            key={id}
            position={[x, y, z]}
            scale={sel ? 1.45 : 1}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
          >
            <octahedronGeometry args={[sel ? 0.045 : 0.032, 0]} />
            <meshBasicMaterial color={markerColor(a, sel)} />
          </mesh>
        );
      })}
    </group>
  );
}

function ArcPrimitive({ points }: { points: THREE.Vector3[] }) {
  const obj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xb42318,
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Line(geo, mat);
  }, [points]);
  return <primitive object={obj} />;
}

function Arcs({ missiles, actors }: { missiles: MissileFx[]; actors: Record<ActorId, Actor> }) {
  const curves = useMemo(() => {
    return missiles.map((m) => {
      const from = actors[m.from];
      const to = actors[m.to];
      const a = new THREE.Vector3(...latLonToVec3(from.lat, from.lon, R + 0.02));
      const b = new THREE.Vector3(...latLonToVec3(to.lat, to.lon, R + 0.02));
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + 0.55);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      return { id: m.id, pts: curve.getPoints(48), toPos: b };
    });
  }, [missiles, actors]);

  return (
    <group>
      {curves.map((c) => (
        <ArcPrimitive key={c.id} points={c.pts} />
      ))}
      {curves.map((c) => (
        <mesh key={`${c.id}-flash`} position={c.toPos}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#f2f0ea" transparent opacity={0.7} />
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
}: {
  actors: Record<ActorId, Actor>;
  selected: ActorId;
  onSelect: (id: ActorId) => void;
  missiles: MissileFx[];
  sites: LaunchSite[];
}) {
  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[6, 2.4, 3.2]} intensity={1.35} color="#fff4e0" />
      <directionalLight position={[-4, -1, -2]} intensity={0.25} color="#6a7a9a" />
      <Stars radius={40} depth={20} count={1200} factor={2.2} fade speed={0.3} />
      <Earth />
      <Atmosphere />
      <Markers actors={actors} selected={selected} onSelect={onSelect} />
      <SiteMarks sites={sites} selected={selected} />
      <Arcs missiles={missiles} actors={actors} />
      <OrbitControls
        enablePan={false}
        autoRotate
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
};

export function GlobeCanvas(props: GlobeCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [-0.4, 1.1, 3.35], fov: 38 }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
