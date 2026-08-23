# Omnibus: Nuclear Close Calls, Phenomenology, and Game Design

Research companion for THRESHOLD's historical close-call pack and UAP-as-sensor-puzzles. This document maps real incidents and video-game equivalents to in-game systems. It is not operational guidance.

## Design frame

THRESHOLD treats brinkmanship as **one event per month, one decision, human veto**. Ambiguity arrives through independent evidence channels:

- **Infrared** — heat / boost signatures (Oko, SBIRS, DSP)
- **Radar** — object tracks (BMEWS, Voronezh, phased arrays)
- **HUMINT** — people at fences and launch sites
- **Hotline** — words that can lie or arrive late
- **Space weather** — second phenomenology (CME, Carrington-class)
- **Anomalous return** — third phenomenology: unexplained tracks or custody faults without a boost signature

UAP content uses **competing log lines** (security report vs engineering report). The game does not assert extraterrestrial causation. The player wins by verification and restraint.

---

## A1. Real-life close-call catalog

| Incident | Year | Failure mode | THRESHOLD hook | Scenario / event |
|---|---|---|---|---|
| Cuban Missile Crisis (bear / Volk Field) | 1962 | Sabotage alarm → ADC nuclear scramble | Deck + `cuba-1962` | `norad-bear` event |
| Arkhipov / B-59 submarine | 1962 | Submarine captain veto under depth charges | Copy in `command.ts` | `arkhipov-1962` |
| Yom Kippur mobilization scare | 1973 | Soviet mobilization misread | — | `yom-kippur-scare-1973` |
| NORAD training tape | 1979 | Exercise tape loaded as live attack | `false-alarm` deck | `norad-false-cascade` |
| NORAD computer chip | 1980 | Faulty chip → 2,200 missile report | — | `norad-false-cascade` |
| Vela satellite flash | 1979 | Unattributed South Atlantic signal | — | `vela-flash-1979`, `vela-double-flash` |
| Petrov / Oko false alarm | 1983 | IR misread; human hold | `petrov-1983`, `resolveCloseCallHold()` | Expanded follow-ups |
| Able Archer 83 | 1983 | NATO CPX read as generate | `able-archer` | Deck weight when `nato-ru` hot |
| Wargames culture | 1983 | Training sim mistaken for live | — | `wargames-sim` event |
| Malmstrom Echo Flight | 1967 | Simultaneous guidance No-Go + contested sightings | — | `malmstrom-1967` |
| November 1975 NORAD tracks | 1975 | Radar tracks over missile fields | `space` flashpoint | `november-uap-1975` |
| Black Brant / Norway rocket | 1995 | Science launch; notice chain failed | — | `black-brant-1995`, `black-brant-notice` |
| Damascus Titan II | 1980 | Broken Arrow HE risk | `broken-arrow` | Briefing cross-link |
| Thule / Palomares | 1968/66 | Broken Arrow geopolitical | `trickery.ts` places | Glossary |

**Primary sources (starting points):** NTI [Close Calls](https://www.nti.org/analysis/articles/close-calls/), Wikipedia [List of nuclear close calls](https://en.wikipedia.org/wiki/List_of_nuclear_close_calls), BBC Future on nuclear mistakes, declassified NORAD / 341st SMW unit histories (Malmstrom).

**What the player learns**

| Pattern | Best actions |
|---|---|
| Single phenomenology (IR only) | HOLD, INTEL retask |
| Exercise without notice | DIPLOMACY, file notice |
| Computer / tape fault | HOLD, demand second source |
| Custody / readiness fault | INTEL, avoid POSTURE on rumor |
| Public rumor without sensor change | DIPLOMACY, PRESSURE on transparency |

---

## A2. Video-game equivalent matrix

| Game | Brinkmanship mechanic | THRESHOLD equivalent | Design takeaway |
|---|---|---|---|
| **DEFCON** | DEFCON 1–5, radar, megadeath | `defcon`, `closeCall`, radar sheet | Keep **minutes-to-impact** without RTS speed |
| **Twilight Struggle** | DEFCON track; coup at DEFCON 2 loses | `phase`, flashpoint heat, alliances | Asymmetric risk: acting at high alert punishes the actor |
| **Terminal Conflict** | Doomsday Clock, era events, MIRV | `globalRisk`, doctrine, MIRV sim | Era-tagged historical event cards |
| **First Strike** | Fast first-strike race | `employ`, launch-on-warning | Counter with verification loops |
| **Wargames** | "Shall we play a game?" | Petrov HOLD, `signal-window` | Training sim vs live is a recurring deck theme |

THRESHOLD's differentiator: **readable depth + human veto**, not destruction scoring.

---

## A3. UAP as third phenomenology

Historical UAP incidents at nuclear sites (e.g. Malmstrom 1967, 1975 NORAD tracks) are modeled as:

1. **Anomalous radar return** — `TrackKind: "anomalous"`, no boost signature, low confidence
2. **Custody readiness fault** — abstract `No-Go` tokens, not weapon procedures
3. **Competing HUMINT** — security log vs engineering log in scenario text
4. **Public rumor** — alliance cohesion / public opinion without confirming sensors

**Not modeled:** disclosure campaigns, alien narratives, or real targeting data.

---

## A4. Implementation map (code)

| System | File |
|---|---|
| Track taxonomy | `src/lib/game/types.ts`, `src/lib/game/warning.ts` |
| Scenarios | `src/lib/game/scenarios.ts` |
| Sandbox events | `src/lib/game/events.ts` |
| Follow-ups | `src/lib/game/consequences.ts` |
| Staff / AI | `src/lib/game/staff.ts`, `src/lib/game/strategicSystems.ts` |
| Copy / UI | `src/lib/game/copy.ts`, `CloseCallOverlay.tsx`, `RadarScreen.tsx`, `TitleScreen.tsx` |
| Regression | `src/lib/game/integrity.ts`, `scripts/commercial-expansion.test.mjs` |

---

## New scenarios (P0)

| ID | Title | Seat | Era | Category |
|---|---|---|---|---|
| `black-brant-1995` | Ten minutes to decide | RU | historical | history |
| `norad-false-cascade` | Training tape / bad chip | US | historical | history |
| `arkhipov-1962` | B-59 in the blockade | RU | historical | history |
| `malmstrom-1967` | Echo Flight No-Go | US | historical | phenomenology |
| `vela-flash-1979` | South Atlantic flash | US | historical | phenomenology |
| `yom-kippur-scare-1973` | Mobilization misread | US | historical | history |
| `november-uap-1975` | Tracks over the fields | US | historical | phenomenology |
| `phenomenology-window-2027` | Unidentified return | US | threshold | phenomenology |
