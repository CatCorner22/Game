import { useEffect, useRef, useState } from "react";
import { P2PRoom } from "@/lib/multiplayer/p2p";
import { useGame } from "@/lib/game/store";
import type { PlayerAction, World } from "@/lib/game/types";
import { resolveTurn } from "@/lib/game/sim";
import { saveWorld } from "@/lib/game/save";
import { recordTurn } from "@/lib/game/replay";
import { GlassPanel, HudButton, HudChip, HudLabel } from "./ui/Hud";

type MpMsg =
  | { type: "turn"; world: World; action: PlayerAction; seat: string }
  | { type: "sync"; world: World };

export function MultiplayerScreen() {
  const setScreen = useGame((s) => s.setScreen);
  const world = useGame((s) => s.world);
  const [roomId, setRoomId] = useState("threshold-duel");
  const [name, setName] = useState("commander");
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<{ id: string; name: string; state: string }[]>([]);
  const [mode, setMode] = useState<"async" | "hotseat">("async");
  const roomRef = useRef<P2PRoom | null>(null);
  const selfId = useRef(`p-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    return () => {
      roomRef.current?.close();
      roomRef.current = null;
    };
  }, []);

  function connect() {
    roomRef.current?.close();
    const room = new P2PRoom({
      room: roomId,
      selfId: selfId.current,
      name,
      onConnected: () => setConnected(true),
      onPeersChanged: (list) =>
        setPeers(list.map((p) => ({ id: p.id, name: p.name, state: p.connectionState }))),
      onMessage: (from, data) => {
        const msg = data as MpMsg;
        if (msg.type === "turn" && msg.world) {
          recordTurn(msg.world, msg.action);
          const next = resolveTurn(structuredClone(msg.world), msg.action);
          saveWorld(next);
          useGame.setState({
            world: next,
            screen: next.ended ? "end" : next.phase === "nuclear" || next.defcon <= 2 ? "war" : "play",
          });
          roomRef.current?.send({ type: "sync", world: next }, from);
        }
        if (msg.type === "sync" && msg.world) {
          saveWorld(msg.world);
          useGame.setState({
            world: msg.world,
            screen: msg.world.ended ? "end" : msg.world.phase === "nuclear" || msg.world.defcon <= 2 ? "war" : "play",
          });
        }
      },
    });
    roomRef.current = room;
    void room.join();
  }

  function broadcastTurn() {
    const st = useGame.getState();
    if (!st.world || mode !== "async") return;
    roomRef.current?.send({ type: "turn", world: st.world, action: st.action(), seat: st.world.playerId });
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-10">
      <HudButton variant="ghost" className="self-start text-sm uppercase" onClick={() => setScreen("title")}>
        Back
      </HudButton>
      <div className="mt-6 flex items-center gap-3">
        <h1 className="font-display text-4xl tracking-[0.12em] text-glow-accent text-fg uppercase">Multiplayer</h1>
        {connected ? <HudChip active>Link live</HudChip> : <HudChip>Offline</HudChip>}
      </div>
      <p className="mt-3 text-sm text-muted">
        Async brinkmanship: alternate monthly turns over WebRTC. Hot-seat: pass the device between seats on one world.
      </p>
      <GlassPanel glow="accent" className="mt-6 rounded-xl p-4">
        <label className="block">
          <HudLabel>Room</HudLabel>
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mt-1 w-full rounded-md glass-panel px-3 py-2 font-mono text-sm text-fg outline-none focus:neon-border-accent"
          />
        </label>
        <label className="mt-4 block">
          <HudLabel>Callsign</HudLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md glass-panel px-3 py-2 font-mono text-sm text-fg outline-none focus:neon-border-accent"
          />
        </label>
        <div className="mt-4 flex gap-2">
          {(["async", "hotseat"] as const).map((m) => (
            <HudButton
              key={m}
              variant={mode === m ? "active" : "default"}
              className="min-h-10 flex-1 text-xs uppercase"
              onClick={() => setMode(m)}
            >
              {m}
            </HudButton>
          ))}
        </div>
        <HudButton variant="active" className="mt-6 min-h-12 w-full tracking-wider uppercase" onClick={connect}>
          {connected ? "Reconnect" : "Join room"}
        </HudButton>
      </GlassPanel>
      {connected ? (
        <ul className="mt-4 space-y-1 font-mono text-xs text-muted">
          {peers.map((p) => (
            <li key={p.id}>
              {p.name} · {p.state}
            </li>
          ))}
          {!peers.length ? <li>Waiting for peer…</li> : null}
        </ul>
      ) : null}
      {world && mode === "async" ? (
        <HudButton variant="accent" className="mt-6 min-h-11 w-full text-xs uppercase" onClick={broadcastTurn}>
          Send turn to peer
        </HudButton>
      ) : null}
      {mode === "hotseat" && world ? (
        <p className="mt-6 text-sm text-subtle">
          Hot-seat: pass device to {world.playerId === "US" ? "RU" : "US"} after each month. Same save, alternating humans.
        </p>
      ) : null}
    </div>
  );
}
