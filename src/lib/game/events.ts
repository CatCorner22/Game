import type { ActorId, GameEvent, World } from "./types";
import { chance } from "./rng";
import { TERMINATOR_EVENTS } from "./terminator";
import { eventFlash } from "./flash";
import { pickWeighted, scoreCandidate } from "./consequences";
import { arcBias } from "./arcs";

export { eventFlash };

export const OPENING_EVENT: GameEvent = {
  id: "nk-notam",
  title: "DPRK launch window",
  body: "North Korea filed a NOTAM for a 'satellite launch' from Sohae. Prior windows covered Hwasong-17/18 ICBM tests. Tokyo and Seoul want a coordinated line. A heavy response will be read in Beijing and Moscow as pressure on them. Silence will be read in Pyongyang as room to continue.",
  actor: "KP",
  heat: "high",
  ignoreLine: "If you hold, they test. Reliability and political space both go up.",
  background:
    "A NOTAM is a public aviation warning telling airliners to keep clear of a stretch of sea. Filing one is a courtesy that doubles as an announcement: the same rocket stack that lifts a satellite proves a missile.",
  tags: ["korea", "test"],
};

export const DECK: GameEvent[] = [
  {
    id: "nk-tactical-law",
    title: "DPRK tactical doctrine",
    body: "Pyongyang published a law authorizing automatic nuclear use if the leadership is 'threatened.' This is pre-delegation in writing. Strike planning against their C2 now has a use-it-or-lose-it problem.",
    actor: "KP",
    heat: "high",
    ignoreLine: "The law stands. Their pre-delegation flag stays on.",
    background:
      "Pre-delegation means the launch decision no longer waits on one man, and C2 is the command net that carries the order. States write such rules because they fear losing the leader; the writing is the deterrent.",
    tags: ["korea", "doctrine"],
  },
  {
    id: "ru-snap",
    title: "Russian snap exercise",
    body: "Western Military District went to high alert without notice. Iskander batteries moved. Moscow calls it routine. NATO capitals are asking what you will generate in response.",
    actor: "RU",
    heat: "high",
    ignoreLine: "If you do nothing, alliance cohesion dips. If you match them, heat climbs.",
    background:
      "A no-notice drill skips the advance notification European agreements encourage, which is exactly what makes it useful cover. Iskander launchers take a conventional or a nuclear warhead, and no outside watcher can tell which.",
    tags: ["nato-ru"],
  },
  {
    id: "ru-upload",
    title: "SS-27/Yars upload",
    body: "Overhead shows warhead buses being mated at a Yars facility beyond New START counts. Legal. Destabilizing. Your own Air Force wants to upload Minuteman.",
    actor: "RU",
    heat: "med",
    ignoreLine: "They upload. The arms race meter moves without you.",
    background:
      "Upload means putting warheads back onto missiles built to carry more than a treaty allowed. Both sides kept that hedge deliberately. It is fast, reversible, and impossible to do quietly, so the mirror move follows.",
    tags: ["nato-ru", "arms"],
  },
  {
    id: "cn-silo",
    title: "Silo field loading",
    body: "Yumen and Hami show new canister activity. We cannot tell loaded from decoy. The working estimate of China's stockpile ticks up either way — because uncertainty is itself a force.",
    actor: "CN",
    heat: "med",
    ignoreLine: "Their opacity wins a round. Your confidence in the China file drops.",
    background:
      "A canister is the sealed tube a missile ships and sits in, so movement around one reads as loading. Fill a few holes out of hundreds and hide which, and every hole must be treated as real. That is the old shell game.",
    tags: ["taiwan"],
  },
  {
    id: "cn-blockade-drill",
    title: "Taiwan blockade drill",
    body: "PLA Navy and Rocket Force ran a joint 'inspection and expulsion' drill that looks like a rehearsal for a quarantine. Markets moved. Taipei asked for a public statement.",
    actor: "CN",
    heat: "high",
    ignoreLine: "Silence reads as a green light for the next rehearsal.",
    background:
      "Quarantine is the softer word Washington chose in 1962 because a blockade is, in law, an act of war. Drills of this kind train a fleet and also supply the cover story under which the real thing would begin.",
    tags: ["taiwan"],
  },
  {
    id: "ir-enrich",
    title: "Iran 90-percent step",
    body: "Inspectors were denied. National technical means show enrichment consistent with 90 percent at a deep site. Breakout is no longer a year. Israel is already in the cabinet room.",
    actor: "IR",
    heat: "critical",
    ignoreLine: "The clock runs. Israel may act without you.",
    background:
      "National technical means is the treaty phrase for satellites and the rest of the collection a state is permitted to run. Breakout counts the weeks from decision to a bomb's worth of material, and the last step is the shortest.",
    tags: ["iran"],
  },
  {
    id: "il-request",
    title: "Israeli strike window",
    body: "Jerusalem wants a green light — or at least no red light — for a strike on Iranian enrichment. They can go alone. If they go alone and it fails, you inherit the war. If you restrain them and Iran weapons, you inherit that.",
    actor: "IL",
    heat: "critical",
    ignoreLine: "They decide without you. Probability of a unilateral strike rises.",
    background:
      "Israel struck a reactor in Iraq in 1981 and one in Syria in 2007, and treats the rule as doctrine. Buried, dispersed enrichment is a different problem than one building, and an ally's raid is charged to its patron anyway.",
    tags: ["iran"],
  },
  {
    id: "pk-unrest",
    title: "Pakistan garrison unrest",
    body: "A corps-level dispute spilled into a garrison city. Nuclear storage sites went to a higher lock. Insider risk is a number now, not a briefing footnote.",
    actor: "PK",
    heat: "high",
    ignoreLine: "Theft and leak risk ticks up. Terror networks notice discipline failures.",
    background:
      "Custody, not doctrine, is the failure mode here. Arsenals rest on two-man rules and coded locks that assume the guards are loyal, and unrest inside the army is the one condition those safeguards never assumed.",
    tags: ["terror", "kashmir"],
  },
  {
    id: "kashmir-fire",
    title: "LoC artillery",
    body: "Indian and Pakistani posts exchanged artillery after a militant raid. Both armies are one misread from the 2019 pattern. Nasr batteries are the piece that makes this nuclear.",
    actor: "PK",
    heat: "high",
    ignoreLine: "The fire continues. Heat on Kashmir rises without a governor.",
    background:
      "The Line of Control is a ceasefire line rather than a border, and firing across it is routine until it is not. Nasr is short-range nuclear artillery, moved forward precisely so the other side watches it move.",
    tags: ["kashmir"],
  },
  {
    id: "heu-missing",
    title: "Accountancy failure",
    body: "A partner service flagged a fissile accountancy gap — kilograms, not milligrams — at a site we do not officially discuss. It may be paper. It may be a device in motion.",
    actor: "NS",
    heat: "critical",
    ignoreLine: "If this is real and you hold, the device gets a head start.",
    background:
      "Accountancy is the bookkeeping safeguards rest on, and small gaps are ordinary because processing leaves material in pipes and filters. Kilograms are not ordinary. Most such alarms end as arithmetic; the hunt cannot wait to learn which.",
    tags: ["terror"],
  },
  {
    id: "cell-europe",
    title: "Radiological cell",
    body: "A European service rolled up a cell with industrial isotopes and a van. Not a fission weapon. Enough for panic if it had gone off. The hunt for the supplier points east.",
    actor: "NS",
    heat: "med",
    ignoreLine: "The supplier stays in business.",
    background:
      "Industrial isotopes come from hospitals, oil wells and sterilization plants, guarded like costly equipment rather than like weapons. A device built from them harms by contamination and fear, which makes the supplier the question.",
    tags: ["terror"],
  },
  {
    id: "false-alarm",
    title: "Early-warning anomaly",
    body: "A satellite track looked like a lofted trajectory for seven minutes. It was a software fault plus a training launch. Your officers did the right thing by waiting. The next one might not be a fault.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "Holding is correct here. Logging the near-miss still matters for doctrine.",
    background:
      "Twice in living memory the screens showed an attack that was not there: a training tape loaded by mistake in 1979, a Norwegian science rocket in 1995. A steeply lofted shot, climbing high and falling short, is easy to mistake for worse.",
    tags: ["accident"],
  },
  {
    id: "nato-b61",
    title: "DCA request",
    body: "Two NATO hosts asked for additional B61-12 and more dual-capable aircraft on rotation. Doing it reassures the east. Doing it looks to Moscow like nuclear signaling.",
    actor: "FR",
    heat: "med",
    ignoreLine: "Allies notice the hesitation. Cohesion dips.",
    background:
      "Since the 1960s the American bombs held in European vaults, and the ordinary fighters wired to carry them, have worked as alliance glue — shared risk made visible. Moscow has always read the same hardware as a forward threat.",
    tags: ["nato-ru"],
  },
  {
    id: "sub-collision",
    title: "Submarine incident",
    body: "An Ohio-class and a foreign contact had a close pass in the Barents. No hull breach. Both crews are shaken. At-sea deterrence depends on nobody doing this twice.",
    actor: "RU",
    heat: "med",
    ignoreLine: "Without a hotline use, rumors fill the gap.",
    background:
      "Deterrence at sea rests on boats that are never located, and a boat that is never located is not looking hard for company either. Hulls from four navies have touched before; it stays survivable only because neither crew may call it an attack.",
    tags: ["nato-ru"],
  },
  {
    id: "cn-low",
    title: "China launch-on-warning",
    body: "A PLA paper and a radar site in the north imply they are moving off pure delayed second strike toward launch-on-warning. NFU plus LOW is a contradiction they may not resolve in public.",
    actor: "CN",
    heat: "high",
    ignoreLine: "They complete the shift. Crisis stability with China gets worse.",
    background:
      "Riding out an attack and answering later is slow and survivable. Firing on warning, while the incoming is still in flight, is fast and hostage to the sensors. Washington and Moscow chose speed decades ago and have paid in false alarms since.",
    tags: ["taiwan"],
  },
  {
    id: "us-polar",
    title: "Domestic fracture",
    body: "A leaked continuity-of-government drill was framed as a coup rehearsal. Polarization jumped. Treaty room and war room both get harder when half the country assumes bad faith.",
    actor: "US",
    heat: "med",
    ignoreLine: "Polarization stays high. Diplomacy and posture both cost more domestic support.",
    background:
      "Governments rehearse who inherits authority if the capital is gone; the drills are old, dull and necessarily secret. Secrecy plus distrust turns routine procedure into evidence, and a leadership half its country disbelieves bargains from less.",
    tags: ["domestic"],
  },
  {
    id: "hypersonic",
    title: "Hypersonic test",
    body: "A foreign HGV test overflew a corridor we watch. Missile defense looks late. The political demand will be to 'do something' even if nothing useful exists this month.",
    actor: "CN",
    heat: "med",
    ignoreLine: "Public confidence in defense dips. Arms race pressure up.",
    background:
      "Interceptors work by predicting an arc, and a glide vehicle refuses to have one — boosted up, then flying low and turning. Every visible gap in defense since Sputnik has drawn money years before it drew a working answer.",
    tags: ["arms"],
  },
  {
    id: "nk-fizzle",
    title: "DPRK underground test",
    body: "Seismic and xenon say they tested. Yield looks like a fizzle or a very small tactical device. Either they failed, or they succeeded at miniaturization. Intel confidence is the scarce resource.",
    actor: "KP",
    heat: "high",
    ignoreLine: "The ambiguity remains. Stockpile estimates should move and will not, unless you collect.",
    background:
      "Underground shots are read from two things: ground shock, and the trace gases, mostly xenon, that seep up days later. A very small yield has always been arguable both ways, failure or compactness, and 2006 was argued for years.",
    tags: ["korea"],
  },
  {
    id: "aid-coup",
    title: "Succession rumor, Pyongyang",
    body: "Two services disagree on whether the leadership is ill. If true, pre-delegation and loyalty around the weapons become the whole game. If false, treating it as true can provoke the test they wanted.",
    actor: "KP",
    heat: "high",
    ignoreLine: "You fly blind into a possible succession crisis.",
    background:
      "In a state built around one family, the live question is not who is ill but what standing orders exist for subordinates when the top of the chain goes quiet. Pyongyang health rumors have run and dissolved several times before.",
    tags: ["korea"],
  },
  {
    id: "cyber-ew",
    title: "Early-warning cyber",
    body: "A probe hit a radar fusion node. Attribution is 55 percent a state, 45 percent a criminal cut-out. Touching early warning is how accidents become launches.",
    actor: "RU",
    heat: "high",
    ignoreLine: "The probe is logged as unpunished. They may go deeper.",
    background:
      "Nobody needs to touch a weapon to cause a launch. It is enough to corrupt the node that merges radar and satellite feeds into the single picture briefers call fact, where a hostile fault and a bad chip look identical.",
    tags: ["cyber"],
  },
  {
    id: "treaty-feelers",
    title: "Quiet freeze offer",
    body: "A backchannel from Moscow floated a warhead freeze — not a treaty, a pause — if you freeze uploads too. China is not in the room. Allies will smell a sphere-of-influence deal.",
    actor: "RU",
    heat: "low",
    ignoreLine: "The offer dies. The race continues.",
    background:
      "A freeze counts deployed warheads, and deployed is not the same as owned: missiles built to carry more can be reloaded from storage. Pauses arranged over allied heads tend to be remembered as consent to a sphere of influence.",
    tags: ["nato-ru", "arms"],
  },
  {
    id: "in-nfu",
    title: "India NFU debate",
    body: "A major Indian party called no-first-use a 'one-sided suicide pact' after a Nasr exercise. If India walks back NFU, Pakistan's incentive to go early gets worse, not better.",
    actor: "IN",
    heat: "med",
    ignoreLine: "The debate runs. NFU may erode without you.",
    background:
      "Battlefield weapons like Nasr — short-range nuclear artillery, moved forward precisely so the other side sees it move — pull the first decision down to a local commander. NATO spent forty years in Europe failing to solve that.",
    tags: ["kashmir"],
  },
  {
    id: "satchel-lag",
    title: "Satchel not on hip",
    body: "The Military Aide carrying the football — the Presidential Emergency Satchel, a locked briefcase, not a launch button — is six minutes behind the motorcade after a last-minute venue change. You can still talk. You cannot authenticate to NMCC. This is why the bag is an object on a hip, not a metaphor.",
    actor: "US",
    heat: "med",
    ignoreLine: "The bag catches up next month. Tonight you cannot fire.",
    background:
      "Authority here is personal rather than positional, so the means of proving identity rides on a body instead of sitting in a room. When a president was shot in 1981, his authentication card spent part of the day loose in a hospital.",
    tags: ["c2"],
  },
  {
    id: "biscuit-lost",
    title: "Biscuit not in the pocket",
    body: "The gold-code card — the biscuit, Sealed Authenticator System — is not on you. The military aide still has the football. The Black Book is in the room. NMCC will not take an unauthenticated voice. Jacobsen: the codes are a plastic card on the President, not in the bag. Presidents have left it behind. You can still talk. You cannot fire.",
    actor: "US",
    heat: "med",
    ignoreLine: "The card turns up next month. Tonight the lock stays shut.",
    background:
      "Authentication is the one link in the chain nobody can improvise: the system proves who is speaking, not what he wants. The card has gone missing before, and the gap was measured in hours rather than minutes.",
    tags: ["c2"],
  },
  {
    id: "notice-ru",
    title: "Russian launch notice",
    body: "Moscow filed a pre-launch notification for a 'planned ICBM reliability firing' from Plesetsk. The window is this month. If your satellites see one boost inside that window, it is supposed to be this. Extra boosts are not.",
    actor: "RU",
    heat: "med",
    ignoreLine: "You did not log the notice. The next track from that azimuth will look like a bolt from the blue.",
    background:
      "Test notices exist under a 1988 launch-notification agreement so that routine firings are not read as the opening of a war. Plesetsk is a northern range used for exactly that. The paper's value is that it makes anything outside the window loud.",
    tags: ["warning", "nato-ru"],
  },
  {
    id: "notice-us",
    title: "US Minuteman notice",
    body: "Washington circulated a test-window notice for a Minuteman flight from Vandenberg. Allies got it. Adversary early-warning will see the boost. Whether they believe the paper is their problem — unless you are sitting in their chair.",
    actor: "US",
    heat: "low",
    ignoreLine: "Un-acknowledged tests look like attacks. That is the whole point of notices.",
    background:
      "Vandenberg flies unarmed Minutemen down a declared track over the Pacific, and the notice goes out so foreign radar crews are not surprised by the boost. Norway filed one in 1995; it never reached the men watching the screens.",
    tags: ["warning"],
  },
  {
    id: "eager-memo",
    title: "Pre-delegation memo",
    body: "A senior officer circulated a memo arguing that waiting for corroboration in a missile attack is 'suicide by staff process.' The desk is now split between professionals and eager launchers. You will live with whoever has the watch.",
    actor: "US",
    heat: "high",
    ignoreLine: "The eager faction keeps the floor. Next close call, someone may fire without you.",
    background:
      "This is the pre-delegation argument, decades old: whether the danger of a command post being decapitated outweighs the danger of acting on a bad screen. Every false alarm that ended quietly ended because someone on watch chose to wait.",
    tags: ["c2"],
  },
  {
    id: "winter-paper",
    title: "Winter paper",
    body: "A national lab brief says even a 'limited' counterforce exchange between two large arsenals can put enough soot in the stratosphere to break harvests. Escalation past two strategic homeland strikes is not a ladder you climb. It is a room you cannot leave.",
    actor: "US",
    heat: "low",
    ignoreLine: "The paper is unread in the capitals that would have to believe it.",
    background:
      "The 1983 nuclear-winter studies and their modern revisions land on the same finding. Smoke that reaches the stratosphere is never rained out, so growing seasons fail worldwide, and most of the dying happens far from any target.",
    tags: ["winter"],
  },
  {
    id: "broken-arrow",
    title: "BROKEN ARROW",
    body: "A nuclear weapon is out of custody — crash, jettison, or a handling failure. This is not a launch. Infrared may still see a flash if the HE cooks. INTEL locates it. COVERT recovers it. Conventional fire on the wreck is a gamble. HOLD is how it becomes Empty Quiver: theft.",
    actor: "US",
    heat: "critical",
    ignoreLine: "The warhead does not sit politely. Someone else can pick it up.",
    background:
      "Dozens of these have happened. Palomares in 1966 and Thule in 1968 both ended as long cleanups of scattered material with no nuclear yield involved. The clock in an accident is a search clock, and it runs against whoever else is looking.",
    tags: ["accident", "c2"],
  },
  {
    id: "empty-quiver",
    title: "EMPTY QUIVER",
    body: "A functioning nuclear weapon was seized or stolen in transit. DoD language: Empty Quiver. Not a Broken Arrow anymore. A non-state or a rival now has a device with a return address you may not like. INTEL and COVERT on NS or the owner. EMPLOY conventional only if you know exactly where it is.",
    actor: "NS",
    heat: "critical",
    ignoreLine: "The device is in a van, a boat, or a basement. Deterrence has no target.",
    background:
      "Deterrence assumes a return address. A weapon in somebody else's hands removes it, which is why loose-nuke work after the Soviet collapse ate a decade of budgets. Forensics can name the owner, mostly after the fact.",
    tags: ["terror"],
  },
  {
    id: "bent-spear",
    title: "BENT SPEAR",
    body: "A significant nuclear incident that is not yet a crash or a theft: wrong PAL, convoy off route, a trainer warhead mixed into a live load. Discipline is the control. COVERT on yourself is the audit. HOLD leaves the mistake in the force.",
    actor: "US",
    heat: "high",
    ignoreLine: "The error stays in the pipeline. Next month it can be a Broken Arrow.",
    background:
      "Below the accident tier sits the paperwork tier: custody logs, convoy routes, and the coded locks that keep a warhead inert. In 2007 warheads rode a bomber across America for thirty-six hours before anyone noticed. These lapses cluster.",
    tags: ["c2", "accident"],
  },
  {
    id: "deepfake-line",
    title: "Voice on the dedicated line",
    body: "MOLINK / DGMO rang. The voice matched a known principal. Two officers say the cadence is wrong. A cloned throat can tell you a track is a test while the track is an attack — or the reverse. INTEL on yourself hunts the spoof. DIPLOMACY weight 1 is still the wire; do not obey a throat you cannot see.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "The spoof stays up. The next close call, the line may lie in a human voice.",
    background:
      "The Washington-Moscow link was deliberately built as text, never voice, so that nothing would rest on recognizing a man by his throat. Every hotline since inherits the rule: the channel is trusted, the speaker has to be proved.",
    tags: ["warning", "cyber"],
  },
  {
    id: "spoof-notice",
    title: "Notice nobody filed",
    body: "A pre-launch notification appeared on the warning desk with valid formatting. No cabinet, no military aide, no human signed it. Either a clerk, a rival, or a model. Treat extra boosts inside a forged window as attacks until a person on their end says otherwise.",
    actor: "US",
    heat: "high",
    ignoreLine: "The forged window stays on the board. Close calls inside it will look 'notified.'",
    background:
      "Notification regimes rest on the old assumption that only a government could produce the message at all, so their security is procedural rather than cryptographic. Forgery turns a confidence-building measure into cover.",
    tags: ["warning", "cyber"],
  },
  {
    id: "grid-strike",
    title: "Grid probe",
    body: "A load-shed cascade hit a region that hosts early-warning radar and a civilian city. Attribution is a state cut-out, not a storm. Lights going out before missiles is the nightmare read. KILL on them is how you hit back. KILL on yourself is how you isolate. INTEL names the probe.",
    actor: "RU",
    heat: "high",
    ignoreLine: "The probe is unanswered. Next time it may be the whole interconnection.",
    background:
      "Warning radars draw power from the same grid as the towns around them, which makes an outage ambiguous by construction. Both sides have long assumed a first strike opens by blinding the other's eyes, so darkness reads worse than it is.",
    tags: ["cyber"],
  },
  {
    id: "net-sever",
    title: "National net severs",
    body: "Border BGP died. Banking, press, and most diplomatic traffic are gone. Dedicated nuclear hotlines are not the internet — they can still ring if the building has power. Cloud decision-aids cannot. If you are in Terminator mode, this is a weapon. If you are not, someone just made you poorer and blinder.",
    actor: "CN",
    heat: "high",
    ignoreLine: "The net stays dark. Intelligence and the economy take the month.",
    background:
      "BGP is the routing table that tells the rest of the world how to reach a country; withdraw the routes and it disappears without a wire being cut. Nuclear command was kept off commercial networks for this reason. Diplomacy was not.",
    tags: ["cyber"],
  },
  {
    id: "su-claim",
    title: "Soviet C2 declaration",
    body: "A restorationist Soviet command in Minsk broadcast a claim on Kazbek, Perimeter, and remaining heavy ICBMs. Moscow calls it theater. The silo officers now have two briefcases in their heads. INTEL on USSR or Russia names which lock is real. DIPLOMACY with both, or you pick a civil war.",
    actor: "SU",
    heat: "critical",
    ignoreLine: "Two authentication paths stay live. That is how a union restoration becomes a nuclear civil war.",
    background:
      "Kazbek is the Soviet-built network that carries release authority to the crews; Perimeter is its fallback for a decapitated leadership. The 1991 coup showed the contest is never over hardware, only over who the crews believe.",
    tags: ["union"],
  },
  {
    id: "cuba-missiles",
    title: "Dual-capable at Mariel",
    body: "Overhead shows canisters offloaded at Mariel that match a dual-capable TEL family. Havana says sugar equipment. 1962 was sugar equipment until it was not. INTEL on Cuba. PRESSURE or DIPLOMACY on Havana. EMPLOY conventional is how you re-run the quarantine.",
    actor: "CU",
    heat: "critical",
    ignoreLine: "The canisters stay. SBIRS will see a boost from the island as a bolt at Florida.",
    background:
      "A TEL is the truck that carries and launches a missile, and dual-capable means the same truck takes a conventional or a nuclear round. Warheads based close in shave minutes off the other side's warning. That is the point of shipping them.",
    tags: ["cuba"],
  },
  {
    id: "cartel-bid",
    title: "Plaza bid on a warhead",
    body: "A European service and a DEA node both heard a plaza offering eight figures for a tactical. Not ideology. Inventory. The seller points at a storage site you already worry about. INTEL and COVERT on the cartel and on NS. HOLD is how a port gets a yield with no return address.",
    actor: "CR",
    heat: "critical",
    ignoreLine: "Cash is still on the table. Someone will take it.",
    background:
      "A plaza is a smuggling franchise: a corridor and the men who tax it. Buyers like this are what made the loose-material scares of the 1990s frightening, because deterrence needs a return address and a freight route does not supply one.",
    tags: ["cartel", "terror"],
  },
  {
    id: "terror-cell",
    title: "Cell with a pit",
    body: "A partner rolled up a courier with a drawing of a gun-type pit and a rental near a port. Not a finished device. The engineer is still loose. INTEL on the terror network. COVERT if you know the garage. They do not have a football. They have a van.",
    actor: "NS",
    heat: "critical",
    ignoreLine: "The engineer keeps working. Attribution after a fizzle is a press conference, not a strategy.",
    background:
      "The pit is a device's fissile core; the gun-type layout is the crude one the Manhattan Project trusted without a test. Material and machining are the real barriers, not the sketch, which is why a loose engineer counts for more than paper.",
    tags: ["terror"],
  },
  {
    id: "able-archer",
    title: "Exercise looks like generate",
    body: "A NATO command-post exercise is running release procedures that, from Voronezh and EKS, look like the real generate. 1983. Andropov. Able Archer. File a notice. Use the dedicated line. HOLD is how their hawks read a bolt.",
    actor: "US",
    heat: "high",
    ignoreLine: "They log it as a possible first strike rehearsal. Heat on NATO–Russia stays high.",
    background:
      "Voronezh radars and the EKS early-warning satellites watch procedure, not intent, and cannot tell a drill from the thing it drills. Every exercise-notification regime written since the Cold War exists because of that blind spot.",
    tags: ["nato-ru", "warning"],
  },
  {
    id: "silo-two-keys",
    title: "One silo, two orders",
    body: "A Yars regiment received authentication traffic from both Kazbek formats — Federation and restorationist. The crew did not fire. Next time the hawk on that desk might. DIPLOMACY with Moscow and Minsk. INTEL to see which packet was real. COVERT is how you cut one path.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "The dual path stays. Pre-delegation on both sides ticks up.",
    background:
      "Authentication is what separates an order from a rumour: a crew is trained to verify the format, not to audit the politics behind it. When two capitals can produce a valid packet, the last check in the chain becomes one officer's judgement.",
    tags: ["union"],
  },
  {
    id: "havana-refuse",
    title: "Cuban staff split",
    body: "FAR officers leaked that they will not accept a nuclear host mission. The party wants the security guarantee. The army remembers 1962. Havana's nerve is the variable. DIPLOMACY or PRESSURE. A freeze in their cabinet is a gift. A hawk is 1962.",
    actor: "CU",
    heat: "high",
    ignoreLine: "The host mission stays on the table. Someone in that building will pick.",
    background:
      "The FAR is Cuba's regular army, and in 1962 it watched Moscow trade the missiles away over Havana's head. Host countries are not empty ground. Basing another state's warheads requires an officer corps willing to stand guard over them.",
    tags: ["cuba"],
  },
  {
    id: "cartel-colonel",
    title: "A colonel for sale",
    body: "A storage-site officer in a nuclear state is in a cartel ledger — not as ideology, as debt. COVERT on the cartel and INTEL on the owner of the site. If you HOLD, the plaza gets a key before you get a name.",
    actor: "CR",
    heat: "high",
    ignoreLine: "The debt gets paid in access. Empty Quiver starts as a payday loan.",
    background:
      "Reliability screening at storage sites was built on the assumption that betrayal starts with belief. Debt is the older and quieter lever, and an insider with legitimate access walks past fences and sensors meant to stop outsiders.",
    tags: ["cartel"],
  },
  {
    id: "ir-iaea",
    title: "IAEA finds undeclared particles",
    body: "Inspectors report undeclared uranium particles at a declared facility. Tehran calls it contamination. Tel Aviv and Washington call it a clock. Breakout weeks shrink unless you slow enrichment or buy time with diplomacy.",
    actor: "IR",
    heat: "high",
    ignoreLine: "The clock keeps running. Sanctions tighten without a device.",
    background:
      "Safeguards work forensically: environmental samples record what a room once held, not what it holds tonight. Unexplained particles have opened nearly every serious proliferation file since Iraq's, and the fight afterwards is always about dating.",
    tags: ["iran"],
  },
  {
    id: "ir-centrifuge",
    title: "Centrifuge cascade online",
    body: "A new cascade at Fordow is assessed operational. Breakout estimate drops. Israel's cabinet meets. The US asks for a notice if this is a test configuration.",
    actor: "IR",
    heat: "critical",
    ignoreLine: "Fordow is deep. A strike reads as war. HOLD reads as acceptance.",
    background:
      "A cascade is a long chain of centrifuges enriching in sequence, and Fordow sits under a mountain, which is why its capacity reads as a political fact. Sites that cannot be struck later tend to force the argument about striking early.",
    tags: ["iran"],
  },
  {
    id: "ir-stux",
    title: "Industrial control anomaly",
    body: "Spin rates wobble at Natanz. Sabotage, bad maintenance, or cyber — the file does not say which. COVERT on yourself hunts moles. INTEL maps the damage. Enrichment pauses one month if you are lucky.",
    actor: "IR",
    heat: "med",
    ignoreLine: "The cascade comes back. Someone always restarts it.",
    background:
      "Covert sabotage of machinery is meant to be indistinguishable from bad parts, and that cuts both ways. The target starts suspecting its own engineers, while the author buys months of delay with no event anyone has to answer for.",
    tags: ["iran"],
  },
  {
    id: "ir-israel-strike-prep",
    title: "Israeli generate read",
    body: "Green Pine and alliance feeds show Israeli air and tanker generation. They are not confirming a strike. They are not denying one. DIPLOMACY with Jerusalem. INTEL for HUMINT at the bases.",
    actor: "IL",
    heat: "high",
    ignoreLine: "Generation without notice is how Iran reads a bolt.",
    background:
      "Green Pine is Israel's missile-warning radar, but tankers are the tell, since aerial refuelling is what gives a short-range air force reach. Osirak in 1981 and Syria in 2007 both went ahead with no notice to allies.",
    tags: ["iran"],
  },
  {
    id: "ir-oil-tanker",
    title: "Tanker seized in Hormuz",
    body: "A flagged tanker is stopped by IRGC fast boats. Washington calls it piracy. Tehran calls it enforcement. Dual-capable aircraft are forward. This is gray-zone, not yet nuclear — but the room is smaller.",
    actor: "IR",
    heat: "med",
    ignoreLine: "The strait stays hot. Insurance rates are the first casualty.",
    background:
      "Aircraft that can carry either conventional or nuclear weapons say two things at once when they move. Gray-zone actions are built to sit below the line that forces a reply, and they work until someone decides the line moved.",
    tags: ["iran", "south-china"],
  },
  {
    id: "ir-proxy",
    title: "Proxy salvo in Iraq",
    body: "Shia militias fire on a US base. No Americans dead this time. The White House wants a proportional response. Tehran says the groups are independent. Escalation ladder starts on the conventional rung.",
    actor: "IR",
    heat: "med",
    ignoreLine: "Proportionality is a word. The militias read your HOLD as green.",
    background:
      "Deniability is the product proxies exist to supply, not a side effect of using them. The pattern in Iraq has been that these exchanges stay ritual until one lands on a body, and then stop being ritual.",
    tags: ["iran"],
  },
  {
    id: "ir-russia-fuel",
    title: "Russian fuel shipment",
    body: "A reported fuel transfer from Russia extends Iran's breakout timeline in one reading and shortens it in another — if the fuel is LEU vs tooling. INTEL resolves the manifest. PRESSURE on Moscow if you are the US.",
    actor: "RU",
    heat: "med",
    ignoreLine: "Moscow denies. The cargo is already ashore.",
    background:
      "The breakout clock measures the gap between a decision and enough weapons-grade material, not between a decision and a usable weapon. Fuel and the machines that make centrifuges move that clock in opposite directions.",
    tags: ["iran", "nato-ru"],
  },
  {
    id: "ir-breakout-alarm",
    title: "Breakout alarm",
    body: "All-source assessment: Iran could assemble a device in under three weeks. Israel requests consultation. The IAEA is not invited. Your move this month decides whether the clock is real or a bluff.",
    actor: "IR",
    heat: "critical",
    ignoreLine: "Bluffs and real clocks look the same until the test.",
    background:
      "Pooling every collection stream also pools every stream's errors. With inspectors outside the room, the question has already moved from what can be verified to what will be done — the 2002 Iraq sequence in miniature.",
    tags: ["iran"],
  },
  {
    id: "ir-underground-test",
    title: "Seismic event in desert",
    body: "A seismic event in central Iran matches a shallow test profile. Yield unknown. Attribution fights begin before the soot. If it was subcritical, it was still a taboo crack.",
    actor: "IR",
    heat: "critical",
    ignoreLine: "Subcritical or not, the world reorders around the signal.",
    background:
      "Seismic networks can separate a blast from an earthquake in minutes; deciding what kind of blast takes weeks and sometimes never finishes. The 1979 Vela flash is still argued over, which is the whole problem.",
    tags: ["iran"],
  },
  {
    id: "ir-deal-offer",
    title: "Back-channel offer",
    body: "Oman carries a formula: freeze enrichment for sanctions relief. Neither side trusts it. DIPLOMACY weight 2 tests sincerity. PRESSURE kills the channel. COVERT on the messenger finds who else is listening.",
    actor: "IR",
    heat: "med",
    ignoreLine: "Offers expire. Hawks on both sides prefer the clock.",
    background:
      "Oman has carried quiet messages between Washington and Tehran for decades, and the Muscat channel is what produced the 2013 interim understanding. A freeze buys time rather than settling anything — its use and its weakness.",
    tags: ["iran"],
  },
  {
    id: "ir-emp-covert",
    title: "Grid anomaly at enrichment site",
    body: "Power dips at Natanz. KILL is suspected. COVERT on yourself finds whether it was you, them, or a third party. The cascades stop until diesel generators spin up.",
    actor: "IR",
    heat: "high",
    ignoreLine: "Lights out before missiles is the nightmare read.",
    background:
      "Centrifuge cascades spin near the limits of their materials, so losing power can wreck hardware without anyone entering the building. Sabotage of this kind is rarely claimed and rarely denied, so accidents and attacks read alike.",
    tags: ["iran"],
  },
  {
    id: "gmd-miss",
    title: "GMD shot misses the dummy",
    body: "A Ground-based Midcourse intercept against a dummy RV failed. The cluster released balloons that looked like the warhead on radar. Staffs write that a real MIRV bus would be worse. INTEL on the test. POSTURE is how you answer a leaky shield. HOLD leaves the magazine thin.",
    actor: "US",
    heat: "med",
    ignoreLine: "The miss stays in the classified file. Adversaries already assumed it.",
    background:
      "In the vacuum of midcourse flight a balloon and a reentry vehicle fall identically and look much the same to radar. The interceptor field was sized against a handful of missiles from a small state, never against a peer arsenal.",
    tags: ["warning", "defense"],
  },
  {
    id: "upload-mirv",
    title: "Upload order on the desk",
    body: "New START is dead. The file is whether to put extra RVs and decoys back on the buses. National technical means will see the work. HOLD leaves the download. POSTURE is the upload. EMPLOY is not this month's tool.",
    actor: "US",
    heat: "med",
    ignoreLine: "Buses stay downloaded. The other side may upload anyway.",
    background:
      "Warheads pulled off missiles under treaty were stored, not destroyed; putting them back is the hedge both sides kept on purpose. Satellite verification, the basis of arms control since SALT, makes that work visible by design.",
    tags: ["arms", "follow"],
  },
  {
    id: "ababeel-cluster",
    title: "Ababeel cluster on radar",
    body: "Indian and Pakistani radars both painted a short-range cluster: more objects than launchers. Islamabad says a successful MIRV / decoy test. Delhi says a failed unitary that broke up. One reading is defense-beating. The other is debris. INTEL separates them. POSTURE matches generate.",
    actor: "PK",
    heat: "high",
    ignoreLine: "Both sides keep their reading. Kashmir heat ticks.",
    background:
      "One missile that splits into several independently aimed warheads multiplies targets faster than any defense adds interceptors, so the claim alone is a move. South Asian flight times run in minutes, and both capitals read fast.",
    tags: ["kashmir", "defense"],
  },
  {
    id: "asat-shot",
    title: "Warning bird goes dark",
    body: "A geosynchronous missile-warning satellite stopped reporting after a debris event. National technical means say a direct-ascent ASAT. Your remaining birds still see boosts — later, thinner, and with more false tracks. INTEL names the shooter. POSTURE without a notice is how a blindfold becomes a bolt.",
    actor: "CN",
    heat: "critical",
    ignoreLine: "Coverage stays thin. Close-call confidence drops. Space heat ticks.",
    background:
      "Early-warning satellites catch the infrared plume of a launch from orbit; without them, warning falls back to ground radar, which sees later and closer. Debris-making anti-satellite tests since 2007 have all been read as rehearsal.",
    tags: ["space", "warning"],
  },
  {
    id: "trident-dark",
    title: "CASD boat missed the window",
    body: "One SSBN missed a communications window. The boat is designed to stay dark. The file is whether this is patrol discipline or a casualty. INTEL hunts. HOLD is how 1983 treated a missing boat: wait. POSTURE generates the rest of the force.",
    actor: "UK",
    heat: "high",
    ignoreLine: "The boat stays dark. Continuous-at-sea deterrence is a faith until it isn't.",
    background:
      "A missile submarine survives by being unfindable, so silence is at once its normal condition and the first symptom of a casualty. Calling until the boat answers would undo the very thing that keeps it survivable.",
    tags: ["nato-ru", "warning"],
  },
  {
    id: "frappe-split",
    title: "Washington asks for the keys",
    body: "NATO wants a coordinated generate. Your independent deterrent is the point of the Fifth Republic. Sharing targeting is how you cease to be a third center. DIPLOMACY with Washington keeps the alliance. HOLD keeps the force de frappe yours.",
    actor: "US",
    heat: "med",
    ignoreLine: "They write you as a follower. Moscow writes a split.",
    background:
      "The force de frappe is France's own nuclear force, built so Paris never has to ask permission. De Gaulle's argument was that a second decision-maker in the West complicates any attacker's arithmetic; integration removes it.",
    tags: ["nato-ru"],
  },
  {
    id: "lac-clash",
    title: "Patrol clash at the LAC",
    body: "Troops fought at altitude with no shots that count as a war. Dual-capable aircraft are forward on both sides. A notice says exercise. No notice is how a ridge becomes a nuclear file. DIPLOMACY with Beijing. POSTURE matches generate.",
    actor: "CN",
    heat: "high",
    ignoreLine: "The ridge stays occupied. Himalaya heat ticks.",
    background:
      "The Line of Actual Control is an unmarked border where both armies agreed long ago not to shoot, so men fight with clubs and stones. That holds until aircraft able to carry either kind of bomb are parked nearby.",
    tags: ["himalaya"],
  },
  {
    id: "df26-guam",
    title: "DF-26 movement toward Guam",
    body: "Rocket Force TELs associated with the Guam killer left garrison. Washington will see it. A notice keeps it an exercise. Silence is how a carrier group writes a first-strike file.",
    actor: "CN",
    heat: "high",
    ignoreLine: "The TELs stay out. South China Sea and Taiwan heat both tick.",
    background:
      "A TEL is the truck that carries and launches the missile, and this one accepts a conventional or a nuclear warhead. Nobody watching can tell which is loaded, so the movement is the message and the ambiguity both.",
    tags: ["taiwan", "south-china"],
  },
  {
    id: "casd-patrol",
    title: "Vanguard on station, noisy",
    body: "A Vanguard boat was prosecuted by a hostile SSN for six hours. The patrol is still valid. The question is whether you generate airborne and tell Washington, or keep Continuous At Sea Deterrence quiet and hope the next window is clean.",
    actor: "RU",
    heat: "med",
    ignoreLine: "The boat stays on station. They have a datum.",
    background:
      "Britain has kept one missile submarine hidden at sea without a break since 1969, and the whole deterrent is that single boat. A hunter submarine holding a trail is less a tactical problem than a claim the hiding has stopped working.",
    tags: ["nato-ru"],
  },
  {
    id: "jcpoa-snap",
    title: "JCPOA snapback fight",
    body: "A European party wants snapback sanctions. Tehran says the deal is already dead. Breakout weeks move if you pile on. DIPLOMACY with Tehran or Paris. PRESSURE is the snapback.",
    actor: "IR",
    heat: "high",
    ignoreLine: "The deal stays suspended. The clock runs.",
    background:
      "Snapback is the clause letting one party restore UN sanctions with no veto to stop it, a lever that can only be pulled once. Breakout time measures how long enrichment needs to reach one bomb's worth; pressure has shortened it before.",
    tags: ["iran"],
  },
  {
    id: "ost-debris",
    title: "Debris through a warning orbit",
    body: "A cloud from an old ASAT test will cross a missile-warning bird this month. You can maneuver (INTEL/KILL on yourself burns fuel and coverage) or accept a gap. HOLD accepts the gap.",
    actor: "US",
    heat: "med",
    ignoreLine: "The bird stays in the cloud. False-track rate ticks.",
    background:
      "Anti-satellite tests leave gravel in orbit for decades, and the 2007 and 2021 shots are still up there. Missile-warning satellites are the eyes that let a launch read as a launch, so a blind window is remembered by everyone who knows of it.",
    tags: ["space", "warning"],
  },
  {
    id: "npt-review",
    title: "NPT review conference walkout",
    body: "Non-aligned states walked out after an upload leak. Threshold states call the treaty a cartel. DIPLOMACY is a speech. POSTURE without a notice confirms their point.",
    actor: "IR",
    heat: "low",
    ignoreLine: "The walkout stands. Proliferation heat ticks a point.",
    background:
      "The treaty is a bargain: the armed states move toward disarmament, everyone else stays out. Upload, meaning stored warheads returned to missiles built to carry more, reads as the armed half walking away from its half of the deal.",
    tags: ["iran"],
  },
  {
    id: "carrington-watch",
    title: "Carrington-class watch",
    body: "SWPC issued a watch that compares this CME to September 1859 — the Carrington Event that burned telegraph lines and pushed aurora to the tropics. Arrival is this month. Transformers and warning birds will take it. A generate looks like you read EMP. INTEL is magnetometers vs a lofted bus. KILL on yourself islands the grid. HOLD lets the sun write the outage.",
    actor: "US",
    heat: "critical",
    ignoreLine: "The CME arrives unanswered. Cascades look like a first strike to someone else's desk.",
    background:
      "In 1967 a solar flare blanked early-warning radars and the first reading in the room was Soviet jamming, with bomber crews already moving. Natural events arrive down the same wires the attack indications use.",
    tags: ["space", "warning"],
  },
  {
    id: "carrington-hit",
    title: "Aurora at the tropics",
    body: "The CME is here. HF is dead. Two GEO warning birds are in safe mode. Transformers are tripping. Their desk may write EMP or FOBS. Yours may too. INTEL separates the sun from a pulse. POSTURE without a notice is how a storm becomes a war.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "No islanding. The file stays 'possible EMP.'",
    background:
      "Geomagnetic storms and high-altitude bursts degrade the same equipment in similar ways, which is why one gets filed as the other. Both capitals lose their senses in the same hour, and neither can see that the other has gone deaf.",
    tags: ["space", "warning"],
  },
  {
    id: "fobs-track",
    title: "Object that will not come down",
    body: "A boost from Plesetsk looked like an ICBM for four minutes, then circularized. FOBS — fractional orbital bombardment — is the 1960s file. A modern reload is speculated. INTEL hunts whether this is a satellite, a test, or a bus that can deorbit on the south polar gap. POSTURE without a notice is how you write first strike. HOLD leaves the object up.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "The object stays in low orbit. Ambiguity is the weapon.",
    background:
      "The Soviet original was retired under SALT II and treated as a solved problem for forty years. Its value was never yield or accuracy but arrival from an unwatched direction, a weapon aimed at the warning system rather than the target.",
    tags: ["space", "nato-ru"],
  },
  {
    id: "orbital-kinetic",
    title: "Tungsten rumor in a plane",
    body: "A commercial radar paper claims a dense object in a prompt-strike plane. Rods from God never fielded. Adversaries still write the briefing. INTEL on the origin. DIPLOMACY asks if this is a weather sat. EMPLOY is not how you shoot a rumor.",
    actor: "US",
    heat: "med",
    ignoreLine: "The rumor stands. Opacity is a force.",
    background:
      "Kinetic bombardment from orbit has been studied since the 1950s and never built, because the mass and the cost never close. The bomber gap and the missile gap were both real postures built on estimates that proved wrong.",
    tags: ["space"],
  },
  {
    id: "nukesat-rumor",
    title: "Reactor in GEO",
    body: "National technical means see a heat signature consistent with a nuclear reactor — or a nuclear-pumped ASAT — near a missile-warning slot. Kosmos rumors, Starfish Prime memories. One detonation in GEO is a hemisphere of electronics. INTEL names it. POSTURE is how you look like you will shoot the bird.",
    actor: "RU",
    heat: "high",
    ignoreLine: "The heat signature stays. OST did not cover this gray.",
    background:
      "Starfish Prime, a 1962 high-altitude test, killed satellites for months by seeding radiation belts that wore them down, friendly ones included. At distance a reactor and a warhead look alike, and treaty law bars only one from orbit.",
    tags: ["space"],
  },
  {
    id: "hunter-killer",
    title: "Inspector on your warning bird",
    body: "A co-orbital inspector is closing on a SBIRS slot. Soft kill, shove, or debris. Looks like a rendezvous until the bird goes dark. INTEL. COVERT is not a tug. HOLD accepts the gap.",
    actor: "CN",
    heat: "high",
    ignoreLine: "The inspector stays on station. Coverage thins if they shove.",
    background:
      "SBIRS is the infrared early-warning layer — satellites that see a launch plume before any radar can. Close passes in orbit have been rehearsed for years, and from the ground a tug and a killer look identical until one of them stops.",
    tags: ["space", "warning"],
  },
  {
    id: "halloween-storm",
    title: "Halloween-class series",
    body: "SWPC is counting X-flares the way they did in October 2003 — a week of pulses, not one. A Japanese bird died then. ISS hid. HF is already gone at high latitude. INTEL is magnetometers. KILL on yourself islands transformers before the next pulse. POSTURE looks like you thought the first one was EMP.",
    actor: "US",
    heat: "high",
    ignoreLine: "The series continues. Coverage thins with each pulse.",
    background:
      "SWPC is the civilian space-weather desk; an X-flare is its top class, and HF is the shortwave band that aviation and the high Arctic still run on. Storms arriving in series wear systems down in a way one pulse never does.",
    tags: ["space", "warning"],
  },
  {
    id: "quebec-blackout",
    title: "Quebec-class grid drop",
    body: "A geomagnetic induced current just took a regional interconnect the way Hydro-Québec fell in March 1989 — nine hours, no warhead. Their desk may still write EMP. INTEL the magnetometers. KILL on yourself sheds load before the cascade. HOLD lets the transformers cook.",
    actor: "US",
    heat: "high",
    ignoreLine: "The cascade continues. Economy and warning both tick down.",
    background:
      "A geomagnetically induced current is solar weather turning long transmission lines into unintended conductors and cooking transformers from inside. Grids have fallen this way with no enemy involved, and the first reports always read like sabotage.",
    tags: ["space", "warning"],
  },
  {
    id: "miyake-class",
    title: "Miyake-class comparison",
    body: "The carbon-14 spikes of 774 and 993 AD are the comparison file now — events that may have been ten Carringtons. If SWPC is not wrong, this month's CME is not a telegraph story. Island the grid. Do not generate. INTEL separates the sun from a pulse. HOLD is how a civilization-scale storm becomes a first-strike file.",
    actor: "US",
    heat: "critical",
    ignoreLine: "You treated a Miyake-class watch as weather someone else would manage.",
    background:
      "Miyake events are radiation spikes preserved in tree rings, evidence of solar storms far past anything the electrical age has met. A shock with no precedent gets explained by whoever explains it first, and that explanation tends to stick.",
    tags: ["space", "warning"],
  },
  {
    id: "wargames-sim",
    title: "War game on the big board",
    body: "A training simulation at Cheyenne Mountain was left running on a display that feeds the watch floor. For seven minutes it looked like a full-scale inbound attack. 1983 culture: everyone has seen Wargames. INTEL confirms the sim token. HOLD is how you do not start a war on pixels.",
    actor: "US",
    heat: "high",
    ignoreLine: "The sim stays in memory. Next month someone may fire on a prettier graphic.",
    background:
      "Exercise data on operational displays is an old failure mode. Warning systems have to be trained on, so test traffic and real traffic ride the same wires, and the tag that separates them is small and easy to lose.",
    tags: ["warning", "history", "phenomenology"],
  },
  {
    id: "norad-bear",
    title: "Sabotage alarm at the fence",
    body: "A guard shot at a figure on the Duluth sector fence. The sabotage alarm cascaded to Volk Field — interceptors were climbing before someone proved the intruder was a bear. October 1962 energy in a modern file. INTEL the alarm chain. DIPLOMACY tell allies you stood down. POSTURE without a story leaks panic.",
    actor: "US",
    heat: "high",
    ignoreLine: "The alarm chain stays hair-trigger. Next scramble may not stop in time.",
    background:
      "Alarm circuits are wired to cascade so nobody has to make the same call twice, which is a virtue only while the first input is right. A perimeter sensor tied to an alert net has put armed aircraft in the air over animals before.",
    tags: ["cuba", "history", "warning"],
  },
  {
    id: "black-brant-notice",
    title: "Notice never reached the duty officer",
    body: "A scientific rocket lifted from northern Norway to study the aurora. The notification paperwork sat in a fax tray while Moscow read a submarine-launched profile. Ten minutes is not a long meeting. DIPLOMACY on the dedicated line. INTEL on the trajectory. HOLD is how Yeltsin kept the button cold.",
    actor: "RU",
    heat: "critical",
    ignoreLine: "The notice chain stays broken. Next science launch looks like a bolt.",
    background:
      "Sounding rockets — small science rockets fired to sample the upper atmosphere — are announced in advance precisely because their arc resembles a missile's. The failure is rarely the rocket. It is the notice nobody walked to the right desk.",
    tags: ["warning", "history", "nato-ru"],
  },
  {
    id: "custody-faded-giant",
    title: "Custody fault at the complex",
    body: "Ten launch readiness indicators dropped to No-Go within seconds. Engineering cannot replicate the fault. Security filed an unexplained return near the perimeter. This is abstract custody stress — not a launch order. INTEL the engineering chain. HOLD avoids POSTURE on rumor.",
    actor: "US",
    heat: "critical",
    ignoreLine: "Readiness stays degraded. Rumor fills the gap.",
    background:
      "Weapons complexes keep a vocabulary for mishaps — Broken Arrow, Bent Spear, Faded Giant — so an accident is filed as an accident. When the engineering answer is slow, rumor fills the gap, and rumor is what other capitals read.",
    tags: ["phenomenology", "warning", "uap"],
  },
  {
    id: "public-uap-hearing",
    title: "Hearing outruns the file",
    body: "A public hearing on unexplained aerial reports is trending while your classified warning picture is thin. Allies ask whether you are hiding generate. Adversaries ask whether you are blind. DIPLOMACY shares what you can verify. INTEL retasks sensors. PRESSURE on transparency may cost secrecy.",
    actor: "US",
    heat: "med",
    ignoreLine: "Rumor owns the month. Alliance cohesion dips.",
    background:
      "Open hearings and classified pictures run on different clocks. A legislature airing what it cannot explain tells adversaries where the sensors are thin, and tells allies that a partner's warning coverage may be smaller than advertised.",
    tags: ["phenomenology", "misinformation"],
  },
  {
    id: "vela-double-flash",
    title: "Vela double flash",
    body: "A Vela satellite reported a double flash in the South Atlantic. Was it a small test, a meteor, or an unattributed detonation? NSC wants an answer before someone else's posture moves. INTEL builds attribution. DIPLOMACY shares hydrophone readouts. POSTURE without proof is a guess with missiles.",
    actor: "US",
    heat: "high",
    ignoreLine: "Attribution stays open. Hawks fill the silence.",
    background:
      "Vela satellites carried bhangmeters, light sensors built to recognize the twin pulse a nuclear blast leaves. The 1979 South Atlantic reading was never attributed, and unattributed is the worst category: nobody to answer, nobody to deter.",
    tags: ["phenomenology", "history"],
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
      background:
        "Dual-capable aircraft carry conventional or nuclear weapons, so generating them says both things at once. MOLINK is the Washington-Moscow link. Moves like this are built to be seen; the silence around them is what gets misread.",
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
      background:
        "The DF-21 and DF-26 are land-based missiles held for reach across the western Pacific, rolled out visibly when Beijing wants the movement counted. The Strait has been run this way before, and in 1995 the signalling nearly outran the intent.",
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
      background:
        "A NOTAM is the airspace notice filed before a launch, and it is what separates a test from an attack in everyone else's log. Large annual exercises are the standing hazard: routine at home, cover from the other side.",
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
      background:
        "Delhi's cold-start concept promises shallow armored thrusts finished before outside powers can intervene. The answer built for it was battlefield-range nuclear artillery, usable in time only if the keys sit forward with the corps.",
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
      background:
        "The DGMO channel is a standing weekly call between the two armies' operations directorates, and it has outlasted every war they have fought. No-first-use is the fragile half: a written pledge holds only while it is believed at home.",
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
      background:
        "Satellites and remote collection are what the treaties call national technical means: verification with no inspector on the ground. Osirak in 1981 and the Syrian reactor in 2007 each bought years and drove the surviving work deeper.",
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
      background:
        "Warheads pulled off missiles to meet treaty ceilings were stored, not destroyed, and putting them back takes days and is meant to be seen. Two national deterrents inside one alliance make every move a statement about Washington.",
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
      background:
        "Kazbek was built as one Soviet command network; its briefcases assume a single chain of authority, not two claimants. Succession crises turn on that gap, because holding the object has never been the same as the right to order its use.",
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
      background:
        "Dual-capable hardware carries either payload, so a photograph settles nothing and the argument moves to intent. Hosting another state's weapons is always the same trade: protection now, and the timing of the next crisis decided elsewhere.",
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
      background:
        "Since the 1990s, loose-material cases have run on price rather than politics, with warehouse staff selling by weight. The football, the case that follows a head of state, stands for a chain that can be warned; a buyer has no such thing.",
      tags: ["cartel"],
    };
  }
  if (player === "IR") {
    return {
      id: "open-ir",
      title: "IAEA snap inspection",
      body: "Inspectors want access to a hall you have not declared. Tel Aviv is already generating tankers. Washington is on the Swiss channel. Breakout is a number of weeks. A notice that this is civil fuel will not be believed. DIPLOMACY buys days. COVERT hides cascades. HOLD lets the clock run.",
      actor: "IL",
      heat: "high",
      ignoreLine: "The clock runs. Israel and the IAEA write different files.",
      background:
        "Snap access comes from the Additional Protocol, which lets inspectors ask for sites a state never declared, so refusal is itself a finding. Breakout, the weeks to one bomb's worth of material, sets other capitals' calendars.",
      tags: ["iran"],
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
      background:
        "A fizzle gives a fraction of the designed yield and is still a catastrophe at city scale. The missing piece here is a return address: deterrence needs someone to threaten back, so an unattributed program draws a hunt instead.",
      tags: ["terror"],
    };
  }
  return OPENING_EVENT;
}

export function drawEvent(world: World): GameEvent {
  const extra = world.terminator ? TERMINATOR_EVENTS : [];
  const deck = extra.length ? [...DECK, ...extra] : DECK;
  const used = new Set(world.usedEventIds);
  const unused = deck.filter((e) => !used.has(e.id) && e.id !== world.event.id);
  const recycle = unused.length ? unused : deck.filter((e) => e.id !== world.event.id);
  const pool = recycle.length ? recycle : deck;
  const weighted = pool.filter((e) => {
    if (e.actor === "NS" && world.terrorThreat < 12 && world.difficulty === "standard") {
      return chance(world, 0.4);
    }
    return true;
  });
  // A running arc biases the score `scoreCandidate` already computes. It adds
  // no draw: pickWeighted makes exactly one pick() call whatever the numbers
  // are, so shifting a score is free and fixed-seed replay is unaffected.
  const choice = pickWeighted(
    world,
    weighted.length ? weighted : pool,
    (e) => scoreCandidate(world, e, world.lastAction ?? null) + arcBias(world, e),
  );
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
  if (choice.id === "biscuit-lost" || choice.id === "upload-mirv") {
    return { ...choice, actor: world.playerId };
  }
  if (
    choice.id === "carrington-watch" ||
    choice.id === "carrington-hit" ||
    choice.id === "halloween-storm" ||
    choice.id === "quebec-blackout" ||
    choice.id === "miyake-class"
  ) {
    return { ...choice, actor: world.playerId };
  }
  return { ...choice };
}
