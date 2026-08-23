import type { ActorId, FlashKind, GameEvent, World } from "./types";
import { chance, pick } from "./rng";
import { TERMINATOR_EVENTS } from "./terminator";

export const OPENING_EVENT: GameEvent = {
  id: "nk-notam",
  title: "DPRK launch window",
  body: "North Korea filed a NOTAM for a 'satellite launch' from Sohae. Prior windows covered Hwasong-17/18 ICBM tests. Tokyo and Seoul want a coordinated line. A heavy response will be read in Beijing and Moscow as pressure on them. Silence will be read in Pyongyang as room to continue.",
  actor: "KP",
  heat: "high",
  ignoreLine: "If you hold, they test. Reliability and political space both go up.",
  tags: ["korea", "test"],
};

const DECK: GameEvent[] = [
  {
    id: "nk-tactical-law",
    title: "DPRK tactical doctrine",
    body: "Pyongyang published a law authorizing automatic nuclear use if the leadership is 'threatened.' This is pre-delegation in writing. Strike planning against their C2 now has a use-it-or-lose-it problem.",
    actor: "KP",
    heat: "high",
    ignoreLine: "The law stands. Their pre-delegation flag stays on.",
    tags: ["korea", "doctrine"],
  },
  {
    id: "ru-snap",
    title: "Russian snap exercise",
    body: "Western Military District went to high alert without notice. Iskander batteries moved. Moscow calls it routine. NATO capitals are asking what you will generate in response.",
    actor: "RU",
    heat: "high",
    ignoreLine: "If you do nothing, alliance cohesion dips. If you match them, heat climbs.",
    tags: ["nato-ru"],
  },
  {
    id: "ru-upload",
    title: "SS-27/Yars upload",
    body: "Overhead shows warhead buses being mated at a Yars facility beyond New START counts. Legal. Destabilizing. Your own Air Force wants to upload Minuteman.",
    actor: "RU",
    heat: "med",
    ignoreLine: "They upload. The arms race meter moves without you.",
    tags: ["nato-ru", "arms"],
  },
  {
    id: "cn-silo",
    title: "Silo field loading",
    body: "Yumen and Hami show new canister activity. We cannot tell loaded from decoy. The working estimate of China's stockpile ticks up either way — because uncertainty is itself a force.",
    actor: "CN",
    heat: "med",
    ignoreLine: "Their opacity wins a round. Your confidence in the China file drops.",
    tags: ["taiwan"],
  },
  {
    id: "cn-blockade-drill",
    title: "Taiwan blockade drill",
    body: "PLA Navy and Rocket Force ran a joint 'inspection and expulsion' drill that looks like a rehearsal for a quarantine. Markets moved. Taipei asked for a public statement.",
    actor: "CN",
    heat: "high",
    ignoreLine: "Silence reads as a green light for the next rehearsal.",
    tags: ["taiwan"],
  },
  {
    id: "ir-enrich",
    title: "Iran 90-percent step",
    body: "Inspectors were denied. National technical means show enrichment consistent with 90 percent at a deep site. Breakout is no longer a year. Israel is already in the cabinet room.",
    actor: "IR",
    heat: "critical",
    ignoreLine: "The clock runs. Israel may act without you.",
    tags: ["iran"],
  },
  {
    id: "il-request",
    title: "Israeli strike window",
    body: "Jerusalem wants a green light — or at least no red light — for a strike on Iranian enrichment. They can go alone. If they go alone and it fails, you inherit the war. If you restrain them and Iran weapons, you inherit that.",
    actor: "IL",
    heat: "critical",
    ignoreLine: "They decide without you. Probability of a unilateral strike rises.",
    tags: ["iran"],
  },
  {
    id: "pk-unrest",
    title: "Pakistan garrison unrest",
    body: "A corps-level dispute spilled into a garrison city. Nuclear storage sites went to a higher lock. Insider risk is a number now, not a briefing footnote.",
    actor: "PK",
    heat: "high",
    ignoreLine: "Theft and leak risk ticks up. Terror networks notice discipline failures.",
    tags: ["terror", "kashmir"],
  },
  {
    id: "kashmir-fire",
    title: "LoC artillery",
    body: "Indian and Pakistani posts exchanged artillery after a militant raid. Both armies are one misread from the 2019 pattern. Nasr batteries are the piece that makes this nuclear.",
    actor: "PK",
    heat: "high",
    ignoreLine: "The fire continues. Heat on Kashmir rises without a governor.",
    tags: ["kashmir"],
  },
  {
    id: "heu-missing",
    title: "Accountancy failure",
    body: "A partner service flagged a fissile accountancy gap — kilograms, not milligrams — at a site we do not officially discuss. It may be paper. It may be a device in motion.",
    actor: "NS",
    heat: "critical",
    ignoreLine: "If this is real and you hold, the device gets a head start.",
    tags: ["terror"],
  },
  {
    id: "cell-europe",
    title: "Radiological cell",
    body: "A European service rolled up a cell with industrial isotopes and a van. Not a fission weapon. Enough for panic if it had gone off. The hunt for the supplier points east.",
    actor: "NS",
    heat: "med",
    ignoreLine: "The supplier stays in business.",
    tags: ["terror"],
  },
  {
    id: "false-alarm",
    title: "Early-warning anomaly",
    body: "A satellite track looked like a lofted trajectory for seven minutes. It was a software fault plus a training launch. Your officers did the right thing by waiting. The next one might not be a fault.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "Holding is correct here. Logging the near-miss still matters for doctrine.",
    tags: ["accident"],
  },
  {
    id: "nato-b61",
    title: "DCA request",
    body: "Two NATO hosts asked for additional B61-12 and more dual-capable aircraft on rotation. Doing it reassures the east. Doing it looks to Moscow like nuclear signaling.",
    actor: "FR",
    heat: "med",
    ignoreLine: "Allies notice the hesitation. Cohesion dips.",
    tags: ["nato-ru"],
  },
  {
    id: "sub-collision",
    title: "Submarine incident",
    body: "An Ohio-class and a foreign contact had a close pass in the Barents. No hull breach. Both crews are shaken. At-sea deterrence depends on nobody doing this twice.",
    actor: "RU",
    heat: "med",
    ignoreLine: "Without a hotline use, rumors fill the gap.",
    tags: ["nato-ru"],
  },
  {
    id: "cn-low",
    title: "China launch-on-warning",
    body: "A PLA paper and a radar site in the north imply they are moving off pure delayed second strike toward launch-on-warning. NFU plus LOW is a contradiction they may not resolve in public.",
    actor: "CN",
    heat: "high",
    ignoreLine: "They complete the shift. Crisis stability with China gets worse.",
    tags: ["taiwan"],
  },
  {
    id: "us-polar",
    title: "Domestic fracture",
    body: "A leaked continuity-of-government drill was framed as a coup rehearsal. Polarization jumped. Treaty room and war room both get harder when half the country assumes bad faith.",
    actor: "US",
    heat: "med",
    ignoreLine: "Polarization stays high. Diplomacy and posture both cost more domestic support.",
    tags: ["domestic"],
  },
  {
    id: "hypersonic",
    title: "Hypersonic test",
    body: "A foreign HGV test overflew a corridor we watch. Missile defense looks late. The political demand will be to 'do something' even if nothing useful exists this month.",
    actor: "CN",
    heat: "med",
    ignoreLine: "Public confidence in defense dips. Arms race pressure up.",
    tags: ["arms"],
  },
  {
    id: "nk-fizzle",
    title: "DPRK underground test",
    body: "Seismic and xenon say they tested. Yield looks like a fizzle or a very small tactical device. Either they failed, or they succeeded at miniaturization. Intel confidence is the scarce resource.",
    actor: "KP",
    heat: "high",
    ignoreLine: "The ambiguity remains. Stockpile estimates should move and will not, unless you collect.",
    tags: ["korea"],
  },
  {
    id: "aid-coup",
    title: "Succession rumor, Pyongyang",
    body: "Two services disagree on whether the leadership is ill. If true, pre-delegation and loyalty around the weapons become the whole game. If false, treating it as true can provoke the test they wanted.",
    actor: "KP",
    heat: "high",
    ignoreLine: "You fly blind into a possible succession crisis.",
    tags: ["korea"],
  },
  {
    id: "cyber-ew",
    title: "Early-warning cyber",
    body: "A probe hit a radar fusion node. Attribution is 55 percent a state, 45 percent a criminal cut-out. Touching early warning is how accidents become launches.",
    actor: "RU",
    heat: "high",
    ignoreLine: "The probe is logged as unpunished. They may go deeper.",
    tags: ["cyber"],
  },
  {
    id: "treaty-feelers",
    title: "Quiet freeze offer",
    body: "A backchannel from Moscow floated a warhead freeze — not a treaty, a pause — if you freeze uploads too. China is not in the room. Allies will smell a sphere-of-influence deal.",
    actor: "RU",
    heat: "low",
    ignoreLine: "The offer dies. The race continues.",
    tags: ["nato-ru", "arms"],
  },
  {
    id: "in-nfu",
    title: "India NFU debate",
    body: "A major Indian party called no-first-use a 'one-sided suicide pact' after a Nasr exercise. If India walks back NFU, Pakistan's incentive to go early gets worse, not better.",
    actor: "IN",
    heat: "med",
    ignoreLine: "The debate runs. NFU may erode without you.",
    tags: ["kashmir"],
  },
  {
    id: "satchel-lag",
    title: "Satchel not on hip",
    body: "The Military Aide carrying the football — the Presidential Emergency Satchel, a locked briefcase, not a launch button — is six minutes behind the motorcade after a last-minute venue change. You can still talk. You cannot authenticate to NMCC. This is why the bag is an object on a hip, not a metaphor.",
    actor: "US",
    heat: "med",
    ignoreLine: "The bag catches up next month. Tonight you cannot fire.",
    tags: ["c2"],
  },
  {
    id: "biscuit-lost",
    title: "Biscuit not in the pocket",
    body: "The gold-code card — the biscuit, Sealed Authenticator System — is not on you. The military aide still has the football. The Black Book is in the room. NMCC will not take an unauthenticated voice. Jacobsen: the codes are a plastic card on the President, not in the bag. Presidents have left it behind. You can still talk. You cannot fire.",
    actor: "US",
    heat: "med",
    ignoreLine: "The card turns up next month. Tonight the lock stays shut.",
    tags: ["c2"],
  },
  {
    id: "notice-ru",
    title: "Russian launch notice",
    body: "Moscow filed a pre-launch notification for a 'planned ICBM reliability firing' from Plesetsk. The window is this month. If your satellites see one boost inside that window, it is supposed to be this. Extra boosts are not.",
    actor: "RU",
    heat: "med",
    ignoreLine: "You did not log the notice. The next track from that azimuth will look like a bolt from the blue.",
    tags: ["warning", "nato-ru"],
  },
  {
    id: "notice-us",
    title: "US Minuteman notice",
    body: "Washington circulated a test-window notice for a Minuteman flight from Vandenberg. Allies got it. Adversary early-warning will see the boost. Whether they believe the paper is their problem — unless you are sitting in their chair.",
    actor: "US",
    heat: "low",
    ignoreLine: "Un-acknowledged tests look like attacks. That is the whole point of notices.",
    tags: ["warning"],
  },
  {
    id: "eager-memo",
    title: "Pre-delegation memo",
    body: "A senior officer circulated a memo arguing that waiting for corroboration in a missile attack is 'suicide by staff process.' The desk is now split between professionals and eager launchers. You will live with whoever has the watch.",
    actor: "US",
    heat: "high",
    ignoreLine: "The eager faction keeps the floor. Next close call, someone may fire without you.",
    tags: ["c2"],
  },
  {
    id: "winter-paper",
    title: "Winter paper",
    body: "A national lab brief says even a 'limited' counterforce exchange between two large arsenals can put enough soot in the stratosphere to break harvests. Escalation past two strategic homeland strikes is not a ladder you climb. It is a room you cannot leave.",
    actor: "US",
    heat: "low",
    ignoreLine: "The paper is unread in the capitals that would have to believe it.",
    tags: ["winter"],
  },
  {
    id: "broken-arrow",
    title: "BROKEN ARROW",
    body: "A nuclear weapon is out of custody — crash, jettison, or a handling failure. This is not a launch. Infrared may still see a flash if the HE cooks. INTEL locates it. COVERT recovers it. Conventional fire on the wreck is a gamble. HOLD is how it becomes Empty Quiver: theft.",
    actor: "US",
    heat: "critical",
    ignoreLine: "The warhead does not sit politely. Someone else can pick it up.",
    tags: ["accident", "c2"],
  },
  {
    id: "empty-quiver",
    title: "EMPTY QUIVER",
    body: "A functioning nuclear weapon was seized or stolen in transit. DoD language: Empty Quiver. Not a Broken Arrow anymore. A non-state or a rival now has a device with a return address you may not like. INTEL and COVERT on NS or the owner. EMPLOY conventional only if you know exactly where it is.",
    actor: "NS",
    heat: "critical",
    ignoreLine: "The device is in a van, a boat, or a basement. Deterrence has no target.",
    tags: ["terror"],
  },
  {
    id: "bent-spear",
    title: "BENT SPEAR",
    body: "A significant nuclear incident that is not yet a crash or a theft: wrong PAL, convoy off route, a trainer warhead mixed into a live load. Discipline is the control. COVERT on yourself is the audit. HOLD leaves the mistake in the force.",
    actor: "US",
    heat: "high",
    ignoreLine: "The error stays in the pipeline. Next month it can be a Broken Arrow.",
    tags: ["c2", "accident"],
  },
  {
    id: "deepfake-line",
    title: "Voice on the dedicated line",
    body: "MOLINK / DGMO rang. The voice matched a known principal. Two officers say the cadence is wrong. A cloned throat can tell you a track is a test while the track is an attack — or the reverse. INTEL on yourself hunts the spoof. DIPLOMACY weight 1 is still the wire; do not obey a throat you cannot see.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "The spoof stays up. The next close call, the line may lie in a human voice.",
    tags: ["warning", "cyber"],
  },
  {
    id: "spoof-notice",
    title: "Notice nobody filed",
    body: "A pre-launch notification appeared on the warning desk with valid formatting. No cabinet, no military aide, no human signed it. Either a clerk, a rival, or a model. Treat extra boosts inside a forged window as attacks until a person on their end says otherwise.",
    actor: "US",
    heat: "high",
    ignoreLine: "The forged window stays on the board. Close calls inside it will look 'notified.'",
    tags: ["warning", "cyber"],
  },
  {
    id: "grid-strike",
    title: "Grid probe",
    body: "A load-shed cascade hit a region that hosts early-warning radar and a civilian city. Attribution is a state cut-out, not a storm. Lights going out before missiles is the nightmare read. KILL on them is how you hit back. KILL on yourself is how you isolate. INTEL names the probe.",
    actor: "RU",
    heat: "high",
    ignoreLine: "The probe is unanswered. Next time it may be the whole interconnection.",
    tags: ["cyber"],
  },
  {
    id: "net-sever",
    title: "National net severs",
    body: "Border BGP died. Banking, press, and most diplomatic traffic are gone. Dedicated nuclear hotlines are not the internet — they can still ring if the building has power. Cloud decision-aids cannot. If you are in Terminator mode, this is a weapon. If you are not, someone just made you poorer and blinder.",
    actor: "CN",
    heat: "high",
    ignoreLine: "The net stays dark. Intelligence and the economy take the month.",
    tags: ["cyber"],
  },
  {
    id: "su-claim",
    title: "Soviet C2 declaration",
    body: "A restorationist Soviet command in Minsk broadcast a claim on Kazbek, Perimeter, and remaining heavy ICBMs. Moscow calls it theater. The silo officers now have two briefcases in their heads. INTEL on USSR or Russia names which lock is real. DIPLOMACY with both, or you pick a civil war.",
    actor: "SU",
    heat: "critical",
    ignoreLine: "Two authentication paths stay live. That is how a union restoration becomes a nuclear civil war.",
    tags: ["union"],
  },
  {
    id: "cuba-missiles",
    title: "Dual-capable at Mariel",
    body: "Overhead shows canisters offloaded at Mariel that match a dual-capable TEL family. Havana says sugar equipment. 1962 was sugar equipment until it was not. INTEL on Cuba. PRESSURE or DIPLOMACY on Havana. EMPLOY conventional is how you re-run the quarantine.",
    actor: "CU",
    heat: "critical",
    ignoreLine: "The canisters stay. SBIRS will see a boost from the island as a bolt at Florida.",
    tags: ["cuba"],
  },
  {
    id: "cartel-bid",
    title: "Plaza bid on a warhead",
    body: "A European service and a DEA node both heard a plaza offering eight figures for a tactical. Not ideology. Inventory. The seller points at a storage site you already worry about. INTEL and COVERT on the cartel and on NS. HOLD is how a port gets a yield with no return address.",
    actor: "CR",
    heat: "critical",
    ignoreLine: "Cash is still on the table. Someone will take it.",
    tags: ["cartel", "terror"],
  },
  {
    id: "terror-cell",
    title: "Cell with a pit",
    body: "A partner rolled up a courier with a drawing of a gun-type pit and a rental near a port. Not a finished device. The engineer is still loose. INTEL on the terror network. COVERT if you know the garage. They do not have a football. They have a van.",
    actor: "NS",
    heat: "critical",
    ignoreLine: "The engineer keeps working. Attribution after a fizzle is a press conference, not a strategy.",
    tags: ["terror"],
  },
  {
    id: "able-archer",
    title: "Exercise looks like generate",
    body: "A NATO command-post exercise is running release procedures that, from Voronezh and EKS, look like the real generate. 1983. Andropov. Able Archer. File a notice. Use the dedicated line. HOLD is how their hawks read a bolt.",
    actor: "US",
    heat: "high",
    ignoreLine: "They log it as a possible first strike rehearsal. Heat on NATO–Russia stays high.",
    tags: ["nato-ru", "warning"],
  },
  {
    id: "silo-two-keys",
    title: "One silo, two orders",
    body: "A Yars regiment received authentication traffic from both Kazbek formats — Federation and restorationist. The crew did not fire. Next time the hawk on that desk might. DIPLOMACY with Moscow and Minsk. INTEL to see which packet was real. COVERT is how you cut one path.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "The dual path stays. Pre-delegation on both sides ticks up.",
    tags: ["union"],
  },
  {
    id: "havana-refuse",
    title: "Cuban staff split",
    body: "FAR officers leaked that they will not accept a nuclear host mission. The party wants the security guarantee. The army remembers 1962. Havana's nerve is the variable. DIPLOMACY or PRESSURE. A freeze in their cabinet is a gift. A hawk is 1962.",
    actor: "CU",
    heat: "high",
    ignoreLine: "The host mission stays on the table. Someone in that building will pick.",
    tags: ["cuba"],
  },
  {
    id: "cartel-colonel",
    title: "A colonel for sale",
    body: "A storage-site officer in a nuclear state is in a cartel ledger — not as ideology, as debt. COVERT on the cartel and INTEL on the owner of the site. If you HOLD, the plaza gets a key before you get a name.",
    actor: "CR",
    heat: "high",
    ignoreLine: "The debt gets paid in access. Empty Quiver starts as a payday loan.",
    tags: ["cartel"],
  },
];

export function openingFor(player: ActorId): GameEvent {
  if (player === "RU") {
    return {
      id: "open-ru",
      title: "NATO dual-capable generate",
      body: "Brussels and Washington generated dual-capable aircraft after your snap exercise last week. MOLINK is quiet. Your General Staff wants matching generate. A notice would tell them this is posture, not a bolt. Silence looks like a bolt.",
      actor: "US",
      heat: "high",
      ignoreLine: "They keep generating. Alliance cohesion on their side ticks up. Your warning desk gets noisier.",
      tags: ["nato-ru"],
    };
  }
  if (player === "CN") {
    return {
      id: "open-cn",
      title: "Taiwan Strait transit",
      body: "A US destroyer transited the Strait and a carrier group is east of the island. Taipei is louder than Washington. Your Rocket Force wants a visible DF-21/26 movement. A notice keeps it an exercise. No notice is how a quarantine starts.",
      actor: "US",
      heat: "high",
      ignoreLine: "The transit becomes routine in their file. Heat stays.",
      tags: ["taiwan"],
    };
  }
  if (player === "KP") {
    return {
      id: "open-kp",
      title: "US–ROK live fire",
      body: "The annual combined exercise is larger than last year. They say it is defensive. Your law says a threat to the leadership is automatic use. A test with a NOTAM extracts aid. A shot without a notice is a war.",
      actor: "US",
      heat: "high",
      ignoreLine: "The exercise finishes. They logged your silence as weakness or as sense. Both readings exist in Washington.",
      tags: ["korea"],
    };
  }
  if (player === "PK") {
    return {
      id: "open-pk",
      title: "Indian strike corridors",
      body: "Delhi ran a cold-start rehearsal after a militant raid they pinned on you. Nasr batteries are one local commander away from a nuclear threshold. SPD wants the keys tighter. The corps wants them looser.",
      actor: "IN",
      heat: "high",
      ignoreLine: "Nasr stays forward. Pre-delegation risk stays the design.",
      tags: ["kashmir"],
    };
  }
  if (player === "IN") {
    return {
      id: "open-in",
      title: "Nasr exercise",
      body: "Pakistan fired a Nasr in an advertised test. They filed a notice. Your NFU is still written down. A party in Delhi is calling it a suicide pact. The DGMO line is available tonight.",
      actor: "PK",
      heat: "high",
      ignoreLine: "The test stands. NFU debate gets louder without you.",
      tags: ["kashmir"],
    };
  }
  if (player === "IL") {
    return {
      id: "open-il",
      title: "Iranian 90-percent step",
      body: "National technical means — yours and a partner's — show enrichment consistent with a dash. Washington has not green-lit a strike. Opacity is still policy. A conventional strike can delay a bomb or force the decision to assemble one.",
      actor: "IR",
      heat: "critical",
      ignoreLine: "The clock runs. You may still go alone later, with less surprise.",
      tags: ["iran"],
    };
  }
  if (player === "FR" || player === "UK") {
    return {
      id: "open-eu",
      title: "Russian snap + upload",
      body: "Moscow went to high alert without a useful notice. Yars buses are being mated past New START counts. Washington will ask what the London/Paris independent deterrents will do. Your boat is already at sea. The question is whether you generate the rest and whether you tell them.",
      actor: "RU",
      heat: "high",
      ignoreLine: "Washington reads hesitation. Moscow reads a split.",
      tags: ["nato-ru"],
    };
  }
  if (player === "SU") {
    return {
      id: "open-su",
      title: "Federation generate against you",
      body: "Moscow generated a Yars regiment after your Kazbek claim. They say it is an exercise. Your General Staff says the silos are Soviet. Two notices cannot share one door. DIPLOMACY with Washington and Moscow, or you pick which briefcase the crew believes.",
      actor: "RU",
      heat: "critical",
      ignoreLine: "The dual C2 stands. Crews will eventually pick a human.",
      tags: ["union"],
    };
  }
  if (player === "CU") {
    return {
      id: "open-cu",
      title: "Canisters in the harbor",
      body: "A foreign dual-capable shipment is 48 hours out of Mariel. Washington already has the photographs. You can refuse the host mission, take it and file a notice that will not be believed, or pretend it is fertilizer. 1962 started as a lie about fertilizer.",
      actor: "US",
      heat: "critical",
      ignoreLine: "The ship docks. You are a launch pad until you say otherwise.",
      tags: ["cuba"],
    };
  }
  if (player === "CR") {
    return {
      id: "open-cr",
      title: "A tactical is for sale",
      body: "A corrupt officer on a nuclear storage site wants plaza cash. Not a cause. A price. INTEL and COVERT get you the object — or get you rolled up. DIPLOMACY with a state is how they hunt you. There is no football. There is a ledger.",
      actor: "PK",
      heat: "critical",
      ignoreLine: "Someone else buys it. You compete with the terror network on price.",
      tags: ["cartel"],
    };
  }
  if (player === "NS") {
    return {
      id: "open-ns",
      title: "The engineer is in a garage",
      body: "You have a gun-type drawing, a courier, and a port. You do not have a biscuit or a second strike. One fizzle is still a city problem. INTEL will find you. HOLD finishes the device. EMPLOY is a van. There is no MAD on the other end — only a hunt.",
      actor: "US",
      heat: "critical",
      ignoreLine: "The garage stays dark. Breakout is a machining problem now.",
      tags: ["terror"],
    };
  }
  return OPENING_EVENT;
}

export function drawEvent(world: World): GameEvent {
  const extra = world.terminator ? TERMINATOR_EVENTS : [];
  const unused = [...DECK, ...extra].filter((e) => !world.usedEventIds.includes(e.id));
  const pool = unused.length ? unused : [...DECK, ...extra];
  const weighted = pool.filter((e) => {
    if (e.actor === "NS" && world.terrorThreat < 12 && world.difficulty === "standard") {
      return chance(world, 0.4);
    }
    return true;
  });
  const choice = pick(world, weighted.length ? weighted : pool);
  world.usedEventIds.push(choice.id);
  if (world.usedEventIds.length > 40) world.usedEventIds.shift();
  if (choice.id === "satchel-lag") {
    const us = world.playerId === "US";
    return {
      ...choice,
      actor: world.playerId,
      body: us
        ? choice.body
        : "The authenticating bag is six minutes behind you after a venue change. You can still talk. You cannot release. Positive control is physical.",
    };
  }
  if (choice.id === "biscuit-lost") {
    return { ...choice, actor: world.playerId };
  }
  return { ...choice };
}

export function eventFlash(actor: ActorId): FlashKind | null {
  if (actor === "KP") return "korea";
  if (actor === "CN") return "taiwan";
  if (actor === "RU" || actor === "UK" || actor === "FR") return "nato-ru";
  if (actor === "SU") return "union";
  if (actor === "CU") return "cuba";
  if (actor === "CR") return "cartel";
  if (actor === "IR" || actor === "IL") return "iran";
  if (actor === "IN" || actor === "PK") return "kashmir";
  if (actor === "NS") return "terror";
  return null;
}
