export const BRIEFING_PAGES = [
  {
    kicker: "01 / MISSION",
    title: "Stay below the line.",
    body: [
      "You pick BLUE (good intent) or RED (bad intent), then any current nuclear capital. March 2027. New START is dead. Nine states have nuclear weapons. Iran is on a breakout clock. Non-state actors will try to buy, steal, or assemble a device.",
      "BLUE: avoid nuclear war. If war begins — win. Winning means your government, a second strike, and a living country. Peace is the real win. First use without an incoming homeland strike is scored as failure.",
      "RED: coerce, split alliances, dominate. Nuclear use is a tool. A spasm war that kills your own state is still a loss. You will not be asked to guess social cues. Every meter has a sentence. Every action shows a forecast range. The log tells you why.",
    ],
  },
  {
    kicker: "02 / A MONTH",
    title: "One event. One move.",
    body: [
      "Each turn is one month. The world presents one event. You take one action. Other capitals act too. Then the log explains the causal chain.",
      "Select a country on the globe (or in the file list). That country is the target of your action. The event's actor is pre-selected so you do not have to hunt.",
      "HOLD is a real action. If the event is a satellite track, holding waits for radar corroboration. If it was a false alarm, that is how the species survived 1983. If it was real, you eat the first strike.",
    ],
  },
  {
    kicker: "03 / SIX LEVERS",
    title: "A small set. A deep model.",
    body: [
      "DIPLOMACY weight 1 is the dedicated line. INTEL runs satellites and the people who live next to silos. COVERT inserts a spy in their missile town, or hunts moles in yours (target yourself). KILL cuts internet or electricity — on yourself to isolate, on them as an attack. POSTURE is visible from orbit and from the hardware store across the road.",
      "Weight 1 / 2 / 3 is intensity, not a skill tree. Read the one-line hint under the weight before you execute.",
      "Forecast ranges are the same simulation run twice at different luck. They are not a promise. They are the model with the curtain up.",
    ],
  },
  {
    kicker: "04 / THE BAG AND THE WINTER",
    title: "Controls. Then the room you cannot leave.",
    body: [
      "Annie Jacobsen: the football is a 45-lb leather Halliburton on a military aide, arm’s reach, 24/7. Inside is the Black Book — laminated packaged options (LAO/SAO/MAO), not a map you doodle. SATCOM to NMCC. EAS. Raven Rock / Nightwatch. The gold-code biscuit is a card in YOUR pocket, not in the bag. You pick a page. You voice the order. SecDef authenticates that it is you. Sole authority. No button. ICBMs cannot be recalled. About six minutes on a bolt-from-the-blue. Cheget’s last page is Tsar-class (50 Mt tested / 100 Mt design) and Poseidon.",
      "Terminator mode puts a rogue fusion model on that same path. The aide still has the bag. The model does not need the aide. INTEL on your own capital maps it. COVERT on yourself air-gaps it and blinds warning. HOLD feeds it. After two strategic uses, escalation can leave the room. Soot in the stratosphere is nuclear winter.",
      "You cannot lose because the interface hid a rule. If a rule matters, it is written on the screen that uses it.",
    ],
  },
];

export const METER_HELP = {
  defcon: "Your alert. 5 is peacetime. 1 is nuclear war. Lower is more generated forces and more crisis instability.",
  stability: "Your domestic hold: public, legitimacy, military loyalty, polarization. If this collapses, command is lost.",
  alliances: "Partner cohesion (NATO if you are US/UK/FR; otherwise the density of useful partners). Spend it to build coalitions. Lose it by abandoning them or shocking them.",
  risk: "Global nuclear danger. Built from flashpoint heat, arms racing, terror, alert, and any nuclear use.",
  economy: "Economic capacity. Sanctions, generation, war, and winter spend it.",
  winter: "Soot and harvest failure from city fires. After enough strategic use this climbs on its own. Escalation becomes a room you cannot leave.",
  ai: "How much of nuclear C2 is a model that can write to the keys. INTEL maps it. COVERT on yourself air-gaps it. HOLD feeds it.",
  net: "Civilian and most military internet. Dedicated nuclear hotlines are not this. Cloud models and most intel sharing are. KILL weight 1.",
  grid: "Electricity. Radar and fusion nodes starve. Silos last on diesel. Custody accidents get more likely. KILL weight 2.",
} as const;

export const GLOSSARY = [
  {
    term: "Second strike",
    def: "The ability to retaliate after being hit. Submarines at sea are the core. If second strike is believed, a first strike is less tempting.",
  },
  {
    term: "Counterforce / countervalue",
    def: "Counterforce aims at weapons and command. Countervalue aims at cities. Counterforce still kills large numbers of people near silos and bases.",
  },
  {
    term: "Use-it-or-lose-it",
    def: "A vulnerable arsenal (North Korea, Pakistani tactical) may be fired early because waiting means the weapons are destroyed. Striking their command makes this worse.",
  },
  {
    term: "Security dilemma",
    def: "Steps that make you safer from surprise (alert, generation) look like preparation to shoot. The other side alerts in answer. Heat rises.",
  },
  {
    term: "Nuclear football",
    def: "Annie Jacobsen (Nuclear War: A Scenario): a ~45-lb leather-covered Zero Halliburton carried by a military aide within arm’s reach 24/7/365. Inside: Black Book (laminated LAO/SAO/MAO options — you pick a page, not a city), SATCOM to NMCC, Emergency Alert card, continuity sites (Raven Rock, Mount Weather, Nightwatch E-4B). The gold-code biscuit is a plastic card on the President’s person, not in the bag. You voice the order. SecDef authenticates that it is you — not permission. Sole authority. No button. ICBMs cannot be recalled. Bolt-from-the-blue: about six minutes.",
  },
  {
    term: "Two-man / PAL",
    def: "Two people must agree, and the weapon itself has a lock (permissive action link) that will not arm without codes. This is how a frightened politician or a single crew is supposed to be unable to empty the silos.",
  },
  {
    term: "Close call",
    def: "Infrared satellites see heat. Radar sees objects. When they disagree — software fault, training tape, cloud, one real test — you get minutes. Petrov waited. An eager officer would not.",
  },
  {
    term: "Hotline",
    def: "A dedicated wire (MOLINK, Defense Telephone Link, DGMO, or a thin third-party channel). You ask: is this hostile? They can tell the truth, lie, or not pick up. A notice on file is a statement, not proof.",
  },
  {
    term: "Launch notice",
    def: "You tell other capitals a window for a test or exercise so their early-warning desk does not read a bolt from the blue. They may still not believe you. Not notifying a real generation looks like first strike.",
  },
  {
    term: "Nerve",
    def: "One axis for human reaction. 0–21 FREEZE (cannot decide). 22–39 CAVE (takes the off-ramp, loses face). 40–63 STEADY (professional). 64–81 HAWK (aggression; reads HOLD as weakness). 82–100 PANIC (cowardice that fires — use-it-or-lose-it in a person). Drifts with what you do.",
  },
  {
    term: "USSR (2027)",
    def: "Restorationist Soviet C2 in addition to the Russian Federation. Two briefcases claiming one silo field. Kazbek, Perimeter, leftover heavies. A civil war with megatons if both give an order.",
  },
  {
    term: "Cartel / terror",
    def: "Playable non-states. The plaza is profit; the network is ideology. Neither has a football. A warhead is stolen inventory. MAD does not apply. States hunt you.",
  },
  {
    term: "Tsar Bomba",
    def: "RDS-220. Tested 50 megatons on 30 October 1961 over Novaya Zemlya (design 100 Mt, halved to limit fallout). Air-dropped from a modified Tu-95V. Not a deployed day-to-day Russian force. Cheget last page: reconstitute it, or use Poseidon (Status-6), reported 2–100 Mt. No military target this large. Winter is the mechanism. The US largest remaining bomb is the B83-1 at 1.2 Mt. The 25 Mt B41 is retired.",
  },
  {
    term: "Launch-site spies",
    def: "People who live next to silos, SSBN ports, and bomber bases. Yours report generation. Theirs watch yours. INTEL runs them. COVERT inserts or hunts.",
  },
  {
    term: "Broken Arrow",
    def: "US DoD: a nuclear weapon accident — crash, jettison, lost custody — that is not a launch and not a war. INTEL locates. COVERT recovers. HOLD is how it becomes Empty Quiver (theft of a functioning weapon). A flash at the wreck can look like a detonation to someone else's satellites.",
  },
  {
    term: "Kill switch",
    def: "Internet and electricity. On yourself: isolation — blinds commerce and cloud C2, not the football. On them: an attack. Lights going out before missiles is the nightmare read. Dedicated hotlines can survive a net cut. Radar does not survive a grid cut.",
  },
  {
    term: "AI trickery",
    def: "A rogue model does not only fire. It clones a principal on MOLINK, files a launch notice nobody signed, interpolates a spy's fence-line report, and practices your voice on the launch-control net. INTEL on yourself hunts the spoof. Compare voice to radar and to a person at the gate.",
  },
  {
    term: "Terminator mode",
    def: "A rogue fusion model sits on the authenticator path. The military aide still has the football. The model does not need the aide. KILL on yourself is a hard air-gap. HOLD feeds it.",
  },
  {
    term: "Nuclear winter",
    def: "Soot in the stratosphere from city fires. Harvests fail. After two large homeland strikes the war can continue without anyone in a cabinet choosing the next pulse. That is escalation beyond control.",
  },
  {
    term: "Pre-delegation",
    def: "Release authority pushed to field units in advance. Faster. Harder to stop. Suspected in North Korea and for Pakistani Nasr.",
  },
  {
    term: "Opacity",
    def: "Israel does not confirm or deny. You will see assessed systems labeled unacknowledged. Treat them as real at the stated confidence.",
  },
  {
    term: "Breakout",
    def: "Time for Iran to assemble a weapon from current material and know-how. A clock. Covert and strikes can add weeks. Enrichment subtracts them.",
  },
  {
    term: "Disclosure labels",
    def: "Acknowledged = official. Reported = credible public reporting, not official. Suspected = intelligence assessment. Unacknowledged = exists in the file, denied or never spoken.",
  },
];
