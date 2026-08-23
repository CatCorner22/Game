type PeerRow = { id: string; name: string };
type SignalRow = { id: number; from: string; kind: string; payload: unknown; to?: string };

const rooms = new Map<
  string,
  {
    peers: Map<string, PeerRow>;
    signals: SignalRow[];
    nextId: number;
  }
>();

function roomOf(name: string) {
  let r = rooms.get(name);
  if (!r) {
    r = { peers: new Map(), signals: [], nextId: 1 };
    rooms.set(name, r);
  }
  return r;
}

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "GET") {
      const room = url.searchParams.get("room") ?? "default";
      const peer = url.searchParams.get("peer") ?? "";
      const name = url.searchParams.get("name") ?? "";
      const since = Number(url.searchParams.get("since") ?? "0");
      const r = roomOf(room);
      if (peer) r.peers.set(peer, { id: peer, name: name || peer });
      const peers = [...r.peers.values()].filter((p) => p.id !== peer);
      const signals = r.signals.filter((s) => s.id > since && s.from !== peer);
      return Response.json({ peers, signals });
    }
    if (req.method === "POST") {
      const body = (await req.json()) as {
        op?: string;
        room?: string;
        peer?: string;
        from?: string;
        to?: string;
        kind?: string;
        payload?: unknown;
      };
      const room = body.room ?? "default";
      const r = roomOf(room);
      if (body.op === "leave" && body.peer) {
        r.peers.delete(body.peer);
        return new Response(null, { status: 204 });
      }
      if (body.op === "signal" && body.from && body.to && body.kind) {
        const id = r.nextId++;
        r.signals.push({ id, from: body.from, to: body.to, kind: body.kind, payload: body.payload });
        if (r.signals.length > 500) r.signals.splice(0, r.signals.length - 500);
        return new Response(null, { status: 204 });
      }
      return new Response("bad op", { status: 400 });
    }
    return new Response("method not allowed", { status: 405 });
  },
};
