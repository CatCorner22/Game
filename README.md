# THRESHOLD

A fictional, turn-based crisis-management and strategic puzzle game about staying below the line.

The player receives one major event per turn, incomplete evidence, institutional constraints, and a limited set of consequential actions. The intended challenge is not destruction. It is keeping control when information, alliances, infrastructure, public trust, and human judgment begin to fail together.

## What is in the current commercial-expansion branch

- Responsive command interface with dedicated mobile **Map**, **Status**, and **Act** views.
- Mobile-safe command bar, bottom navigation, safe-area support, 48px touch targets, and mutually exclusive critical overlays.
- 45+ handcrafted scenarios across history, crisis diplomacy, information integrity, infrastructure, humanitarian response, machine-risk, and phenomenology themes.
- Historical close-call pack (Petrov, Black Brant, NORAD faults, Arkhipov, Malmstrom, Vela) plus UAP-as-sensor puzzles — see [docs/omnibus-close-calls-and-phenomenology.md](docs/omnibus-close-calls-and-phenomenology.md).
- Scenario metadata for challenge, duration, variables, dependencies, content notes, and learning goals.
- Sandbox campaigns with flashpoints, unreliable intelligence, domestic politics, alliances, infrastructure, and cascading consequences.
- Four fictional command-intelligence configurations:
  - **Human Watch** — no model recommendation.
  - **ORACLE Copilot** — one explainable recommendation.
  - **CHORUS Ensemble** — competing model votes and visible dissent.
  - **SKYNET // Fictional** — adversarial autonomy and takeover pressure.
- Three continuity configurations:
  - Off.
  - Guarded continuity with a human veto.
  - **DEADHAND // Abstract**, a fail-deadly assurance-and-ambiguity puzzle.
- Explicit AI variables: calibration, confidence, data integrity, dissent, explainability, hallucination risk, automation bias, alignment, autonomy, and drift.
- Career statistics, replay codes, doctrine choices, save slots, multiplayer experiments, a 3D globe, and a radar evidence view.

## Safety and design boundaries

THRESHOLD is a game, not a weapons simulator or command tool.

- No real operational weapon, agent, targeting, trigger, delivery, safeguard-bypass, or vulnerability instructions are represented.
- Nuclear, biological, and chemical themes are translated into abstract systems such as escalation, contamination tokens, contagion tokens, public-health capacity, sensor confidence, and continuity assurance.
- The fictional AI systems run locally as deterministic game logic. They do not connect to an external LLM, military system, or live data source.
- The DEADHAND mechanic does not reproduce real trigger conditions or an operational sequence. It models the strategic danger of ambiguity, damaged communications, and over-automation while preserving a visible human veto.
- Scenarios use non-graphic language and include content notes. The recommended audience is age 16+.

## Design pillars

1. **Readable depth** — every meter and model recommendation should expose the variables and dependencies beneath it.
2. **Reversible choices first** — diplomacy, verification, and resilience should remain strategically interesting rather than becoming “soft” options.
3. **Human systems matter** — officers, public trust, alliance cohesion, institutional legitimacy, and dissent can prevent or cause catastrophe.
4. **Uncertainty is gameplay** — confidence is not proof; model agreement is not independence; missing data is not evidence of hostility.
5. **Replayability through interactions** — scenarios combine the same systems differently instead of relying only on scripted events.

## Stack

- TanStack Start
- React 19
- TypeScript
- Three.js / React Three Fiber
- Zustand
- Tailwind CSS
- Local saves; no account required for solo play

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

## Running on Replit

Import the repository into Replit and press **Run**. `.replit` is checked in, so
no further setup is needed: it installs dependencies, starts the dev server, and
maps the app to the repl's public URL.

Three things in the stock config had to change for that to work — worth knowing
if you fork or host this somewhere else:

| Issue | Symptom off-platform | Fix |
| --- | --- | --- |
| Vite's DNS-rebinding protection allows only localhost | Every request through a `*.replit.dev` proxy host returns `Blocked request. This host is not allowed.` — a blank webview over a healthy server | `server.allowedHosts` / `preview.allowedHosts` in `vite.config.ts` allow `.replit.dev`, `.replit.app`, `.repl.co`, plus whatever `REPLIT_DOMAINS`/`REPLIT_DEV_DOMAIN` names |
| The port was hardcoded to 8080 | A deployment health check probes `$PORT` and finds nothing listening | `PORT` is honored and still falls back to 8080 |
| Nitro built for Vercel only | `npm run build` emits `.vercel/output`, which has no server you can start | `NITRO_PRESET` selects the preset; `npm run build:node` emits `.output/server/index.mjs` and `npm start` runs it |

Unrelated hosts are still rejected, so the rebinding protection stays intact.

### Deploying from Replit

`.replit` points Replit's deploy at the Node build:

```bash
npm run build:node   # NITRO_PRESET=node-server → .output/server/index.mjs
npm start            # binds $PORT (default 8080) on all interfaces
```

Autoscale is the configured target — solo saves live in the browser and the
PGLite fallback is per-instance, so there is no server-side state to keep warm.

### Environment variables

Nothing is required to play. The ones that change behavior:

| Variable | Default | Effect |
| --- | --- | --- |
| `PORT` | `8080` | Port the dev, preview, and production servers bind |
| `NITRO_PRESET` | `vercel` (`node-server` on Replit) | Nitro build target |
| `DATABASE_URL` | unset | Uses Postgres instead of the embedded PGLite fallback |
| `VITE_AUTH_ENABLED` | `false` (`.grok/app-env.json`) | Federated sign-in; solo play needs no account |
| `GROK_EXTENSIONS` | on, off on Replit | Injects the grok.com "Created with Grok" script. Off-platform it is a third-party request that fails in the console, so Replit skips it |

## Scenario authoring

Scenario definitions live in `src/lib/game/scenarios.ts`. Each scenario declares:

- category and duration;
- challenge rating;
- player seat, intent, and difficulty;
- major variables;
- cross-system dependencies;
- content note and learning goal;
- default AI and continuity configuration;
- a safe, abstracted opening state.

The architecture intentionally keeps scenario content separate from the core simulation so additional campaigns can be added without embedding real operational details.
