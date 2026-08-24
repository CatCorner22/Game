import type { ScenarioId } from "./scenarios";
import type { ActionKind, ActorId } from "./types";

/**
 * Another party to this crisis, and what moves them.
 *
 * The briefs used to name second-order actors only inside prose, which meant
 * the game could not link them to anything. `id` is a real `ActorId`, so the
 * dossier points at the actor you can select on the globe and whose file you
 * can open.
 */
export interface BriefActor {
  id: ActorId;
  /** What they are trying to get out of this. */
  wants: string;
  /** What outcome they are trying to avoid, which is usually the stronger force. */
  fears: string;
  /** What stops them doing the obvious thing -- domestic, legal, physical. */
  constraint: string;
}

/**
 * What breaks beyond the immediate crisis.
 *
 * Split by horizon because the horizons genuinely conflict: the move that is
 * right in the next six hours is frequently the one that costs you the decade.
 * That tension is most of what a national security decision actually is, and
 * the game had no way to show it.
 */
export interface Consequence {
  horizon: "hours" | "weeks" | "years";
  line: string;
}

/**
 * Something you cannot know yet.
 *
 * This is the field the game most needed and did not have. Its whole subject is
 * deciding under uncertainty, and nothing enumerated the uncertainty.
 *
 * `settledBy` is what keeps it a mechanic rather than atmosphere: it names the
 * action that would actually resolve the question, so a player learns that
 * INTEL and DIPLOMACY are instruments and not flavour. Typed as `ActionKind` so
 * it cannot drift from the eight verbs in `actions.ts`.
 *
 * The research corpus has carried this all along as its `Stresses.` field --
 * roughly eight hundred discrete pressure variables across a hundred incidents,
 * complete and untruncated, and never once shown to anybody.
 */
export interface Unknown {
  /** Stated as a question the player would actually ask. */
  question: string;
  /** Why the answer changes the decision. */
  whyItMatters: string;
  /** The action that would resolve it. */
  settledBy: ActionKind;
}

/**
 * What the player actually reads before choosing a scenario.
 *
 * The old one-liners were written for someone who already knew the domain --
 * "Nasr batteries flushed", "A Plesetsk boost circularized", "Blockade heat" --
 * and a whole cluster of them named a *category* of crisis rather than a thing
 * that had happened: "Partners split", "One reserve, three claims", "Models
 * agree on confidence, not action". You could read the entire list and still
 * not know what any of these evenings would be like.
 *
 * Every brief here answers four questions in plain English instead:
 * what just happened, who you are, what you have to decide, and what it costs
 * to get it wrong. The headline is a sentence, in the present, naming who did
 * what -- the register of a phone call waking you up, not an index entry.
 *
 * Jargon is allowed exactly once it has been earned: name the thing, then say
 * what it is. "Nasr" means nothing; "short-range nuclear artillery, the kind
 * moved forward precisely so the other side sees it move" means something.
 */
export interface ScenarioBrief {
  /** One sentence, present tense, concrete. This is the hook. */
  headline: string;
  /** Two or three sentences: what happened, what is confirmed, what is not. */
  situation: string;
  /** Who the player is, where they are, and what time it is. */
  youAre: string;
  /** The question actually in front of them. */
  decision: string;
  /** What getting it wrong looks like. */
  stakes: string;
  /**
   * Hard facts with numbers, dates and places.
   *
   * The repository already contains a 1,584-line research corpus of a hundred
   * real incidents -- dates, causes, outcomes, what each one stressed -- and
   * until now not one line of it reached a player. These are drawn from it.
   * Every entry should carry something checkable: a date, a count, a distance,
   * a duration. "Tensions were high" is not a fact.
   */
  facts: string[];
  /**
   * Who else is in this, what they want, and what limits them.
   *
   * A crisis with one actor is a puzzle. The briefs described the player's
   * problem and left everyone else as a name in a sentence, which made every
   * scenario feel like solitaire.
   */
  actors: BriefActor[];
  /** What breaks beyond the immediate crisis, by horizon. */
  consequences: Consequence[];
  /** What you cannot know, and the action that would settle it. */
  unknowns: Unknown[];
  /**
   * One line naming the trap.
   *
   * Every scenario in this game is built around a specific way of being wrong.
   * Saying so out loud does not spoil it -- knowing there is a trap and seeing
   * it coming are different skills, and the second one is the game.
   */
  theTrap: string;
  /** For historical scenarios: what the people actually there actually did. */
  whatHappened?: string;
  /** What changed afterwards -- the procedure, the treaty, the design flaw. */
  afterward?: string;
  /** For invented scenarios: the real incident whose shape this borrows. */
  precedent?: string;
}

export const SCENARIO_BRIEFS: Record<ScenarioId, ScenarioBrief> = {
  "alaska-drones-2027": {
    headline: "Russian long-range drones have crossed into Alaskan airspace and are still flying.",
    situation:
      "Four of them, subsonic, well inside your air defence identification zone and continuing on a track that does not obviously go anywhere. Moscow has said nothing. They may be a navigation failure, a deliberate probe to see how fast you scramble and on what, or the front edge of something — and the honest answer is that the first hour cannot tell those apart.",
    youAre: "You are the President of the United States. NORAD woke you at 3:10 a.m. and fighters are already airborne.",
    decision: "Shoot them down, escort them and let them leave, or hold the fighters back and say nothing publicly.",
    stakes:
      "Shooting down Russian aircraft over your territory is legally clean and politically enormous. Letting them fly tells Moscow exactly what your response time is, which is very likely what they came to measure.",
    facts: [
      "From 28 January to 4 February 2023 a Chinese high-altitude balloon crossed Alaska, Canada and the continental United States before being shot down off South Carolina.",
      "NORAD's commander later testified that earlier balloon transits had gone undetected because radar processing was rejecting slow, small, high-altitude returns — 'a domain awareness gap.' Once the filters were changed, the tracks appeared immediately.",
      "Beginning 6 December 2023, unmanned aircraft operated over Joint Base Langley-Eustis on roughly 17 separate nights. No operator was ever identified, and some F-22s were moved to another base.",
      "NORAD's counter-drone remit was written for an 'attack of national consequence'; NORTHCOM had no authority to act, and base commanders owned the problem inside the fence and nothing outside it.",
      "In the New Jersey drone flap of November and December 2024, thousands of reports were jointly assessed by four federal agencies as lawful commercial, hobbyist and police aircraft plus misidentified manned planes.",
    ],
    precedent:
      "The balloon and drone incursions of 2023-2024: one real intrusion the sensors were not tuned to see, followed by a wave of reports that were mostly nothing.",
    actors: [
      {
        id: "RU",
        wants: "A timed, unattributable measurement of how fast the homeland air defence system goes from detection to a decision, and which aircraft it commits to a target worth almost nothing.",
        fears: "Not the interception. Wreckage recovered intact enough to name the components and the supply chain behind them, which would turn a deniable flight into a documented state act and put the export network under sanction.",
        constraint: "Deniability is one-way. Having said nothing to keep the flights unowned, Moscow has no channel it can use to call them off publicly without owning them.",
      },
      {
        id: "CN",
        wants: "A precedent in which unidentified aircraft over sovereign territory are escorted and photographed rather than destroyed, because that is the standard it will want cited about its own survey and balloon traffic.",
        fears: "An American doctrine that unattributed equals hostile, applied later to anything unmanned near Taiwan or the Japanese islands, where Beijing flies far more of it than anyone else.",
        constraint: "It called the 2023 balloon shootdown an overreaction on the record. It cannot now argue for a faster trigger without conceding that argument.",
      },
      {
        id: "UK",
        wants: "An American response proportionate enough that NATO does not adopt a new standing rule about drone incursions, since Russian aircraft cross allied airspace in Europe far more often than they cross Alaska.",
        fears: "Being locked into a shoot-first alliance standard it cannot afford, firing million-pound interceptors at cheap airframes over Scotland and the North Sea with no attribution and no way to recover what it hit.",
        constraint: "A defence budget already committed elsewhere, and a public that has seen its own unexplained overflights reported for two years and expects a firmer answer than the Treasury can pay for.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "If you fire, the debris lands on sea ice in the dark. Recovery is not guaranteed, and until something is recovered you have destroyed four aircraft you cannot name in public." },
      { horizon: "hours", line: "If you hold, the scramble time, the aircraft type and the length of the pause before a President decided all become a single line in someone's file, correct to the minute." },
      { horizon: "weeks", line: "The cost exchange becomes the story either way. Each flight costs the sender less than a truck and costs you a missile, an alert cycle and a news cycle, and the arithmetic is public." },
      { horizon: "years", line: "Whichever rule you set tonight — escort the unattributed, or destroy it — is the rule every state with a border and a drone industry cites back at you, including over airspace you fly in." },
    ],
    unknowns: [
      {
        question: "Are these four aircraft the whole event, or the part that was meant to be seen?",
        whyItMatters: "If something is running lower and quieter under the same track, the fighters are committed to the wrong altitude and holding them back is the error. If four is all there is, holding costs you nothing tonight but the measurement.",
        settledBy: "intelligence",
      },
      {
        question: "Does Moscow's silence mean it authorised this, or that it does not yet know which of its own commands launched it?",
        whyItMatters: "If a call is answered at a level that can offer you a heading and a unit, this is a mistake someone can withdraw and restraint is cheap. If the call goes unanswered, the silence is the message, and every option you choose is an answer to it.",
        settledBy: "diplomacy",
      },
      {
        question: "Does the track turn back on its own before it reaches anything worth defending?",
        whyItMatters: "Only more minutes can tell you. If it turns, this was never a defence problem and shooting would have been display. If it does not turn, the decision gets harder every mile and you have spent the easy part of it waiting.",
        settledBy: "hold",
      },
      {
        question: "Would an announced escort, with the radar picture released, satisfy the people demanding a response?",
        whyItMatters: "If a visible display absorbs the domestic pressure, you can be restrained and survive it. If nothing short of a kill counts, then restraint tonight buys you a worse decision under worse conditions next week.",
        settledBy: "posture",
      },
    ],
    theTrap: "The competent instinct is to wait for attribution before firing, and it is a good instinct. But a flight like this is built so that attribution arrives after the aircraft have left your airspace. Waiting is not a decision postponed; it is the decision, made by the clock instead of by you, and you will only notice afterwards that you never actually chose it.",
  },
  "airliner-down-2027": {
    headline: "A civilian airliner has been destroyed near your border and everyone is blaming you.",
    situation:
      "Nearly three hundred people are dead. Your own air defence units were active in that sector, and your first reports from them are confused and contradictory in the way first reports always are. You do not yet know whether it was one of your units, a unit you supply, or neither — and every hour you spend finding out is an hour the other explanation hardens into fact.",
    youAre: "You are the President of the Russian Federation, being briefed by people who are not certain and know it.",
    decision: "Deny it flatly, admit the possibility and open an investigation, or say nothing until you actually know.",
    stakes:
      "A denial you later have to withdraw costs more than the admission would have. Waiting for the truth means the story is written by everyone else first.",
    facts: [
      "On 8 January 2020 an air-defence crew outside Tehran fired two missiles at Ukraine International Airlines Flight 752, a Boeing 737-800 that had just taken off. All 176 people aboard were killed.",
      "Iranian investigators blamed a unit repositioned in haste whose alignment was left uncorrected, so an outbound airliner displayed as inbound, combined with a communications failure that left the crew unable to reach higher authority in the seconds available.",
      "Iranian airspace had not been closed, even though the country was expecting an American retaliatory strike that night.",
      "Iran denied responsibility for three days before admitting it. The denial, not the shootdown, is what brought people into the streets.",
      "On 1 September 1983 a Soviet interceptor destroyed Korean Air Lines Flight 007, killing 269 people. Moscow denied it for five days and the incident poisoned relations for years.",
    ],
    precedent:
      "Flight 752 (2020) and KAL 007 (1983): identification failure under alert conditions, and then the separate decision of what to say before you know.",
    actors: [
      {
        id: "US",
        wants: "The wreckage and the recorders placed under a standard international investigation it can cite, before its own intelligence picture leaks and sets a timetable no government controls.",
        fears: "Having to prove what it knows. Most of the proof is in a form it cannot show without explaining how it was collected, and publishing it would cost more than the finding is worth.",
        constraint: "Its evidence will convince its allies and no one else, and the moment it leaks, Washington is committed to a response it had not decided to make.",
      },
      {
        id: "UK",
        wants: "Its dead returned, its investigators admitted to the site, and a process that meets a criminal standard rather than a diplomatic one.",
        fears: "Being the government that traded a prosecution for a de-escalation deal, and having the families say so on television for the next decade.",
        constraint: "A bereaved families' campaign that is already organised, already funded, and politically impossible to outlast.",
      },
      {
        id: "CN",
        wants: "To keep the principle intact that a state's air-defence conduct over its own territory is its own business, and to prevent a Security Council mechanism that could examine it.",
        fears: "A precedent where an air-defence error becomes an international crime with individual liability, because it also operates dense air defences beside some of the busiest civil corridors in the world.",
        constraint: "Its own citizens fly those routes in large numbers. It cannot appear indifferent to three hundred dead civilians while it argues about jurisdiction.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The reports reaching you now are the least reliable they will ever be, and whatever you say tonight becomes the version you are defending in five years." },
      { horizon: "weeks", line: "Airlines reroute before governments decide anything. Overflight revenue and war-risk insurance do the sanctioning first, and no negotiation reverses it quickly." },
      { horizon: "weeks", line: "An admission opens compensation claims and foreign criminal jurisdiction over your officers, and those proceedings outlive your term and constrain your successor." },
      { horizon: "years", line: "The denial is what the record keeps, not the shootdown. Every future accident involving your forces is read through this one, and the benefit of the doubt is spent permanently." },
    ],
    unknowns: [
      {
        question: "Was the unit that fired under your command, or under a command you equip but do not control?",
        whyItMatters: "It decides whether you are apologising or arbitrating. Those are different speeches with different domestic costs, and choosing the wrong one first cannot be undone by choosing the right one later.",
        settledBy: "intelligence",
      },
      {
        question: "Can your own air-defence chain still reconstruct that minute, or have subordinates already started protecting themselves?",
        whyItMatters: "If the record is being tidied, then every hour you spend waiting for certainty buys you a version rather than the truth, and the denial you issue on the strength of it becomes one you can never withdraw.",
        settledBy: "intelligence",
      },
      {
        question: "Will the accusing states accept a joint investigation with your people inside it, or have they already decided to run one without you?",
        whyItMatters: "If you can be inside the process, silence is defensible because the findings will carry your name. If you are going to be excluded, the only account with your name on it is the one you give before you know.",
        settledBy: "diplomacy",
      },
      {
        question: "How much of this is already visible to other governments from their own sensors?",
        whyItMatters: "If two or three capitals already have the track, a denial is a lie with a publication date. If nobody has it yet, silence buys real time rather than the appearance of it.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "Denial feels reversible and silence feels responsible, and neither is. The days you spend confirming are the days in which your own officers decide what the record will say, so the truth arrives at your desk already edited, and by then you are the last person in the world able to tell it.",
  },
  "carrier-collision-2027": {
    headline: "An American destroyer and a Chinese warship have collided. There are dead on both sides.",
    situation:
      "The two ships had been shadowing each other for days in a contested strait. Each navy's account blames the other's helm and both accounts are internally consistent. Neither government wants a war over a steering error, but both have publics who have already seen the pictures and militaries who want to be seen not to blink.",
    youAre: "You are the President of the United States. Your sailors are dead and the Pacific commander wants latitude.",
    decision: "Demand accountability publicly, take it to the hotline privately, or withdraw the patrol and cool the strait.",
    stakes:
      "An accident stays an accident only while both sides want it to. Withdrawing reads as fault, and staying puts the same two crews back in the same water.",
    facts: [
      "On 1 April 2001 a Chinese fighter collided with an American EP-3 over the South China Sea. The Chinese pilot was killed, the American aircraft landed on Hainan, and its crew of 24 was held for 11 days.",
      "That crisis ended with a letter negotiated word by word, which said 'very sorry' twice without admitting fault. Both governments could show it to their own publics and read it differently.",
      "In 2017 two American destroyers collided with merchant ships in the western Pacific: USS Fitzgerald in June, seven dead, and USS John S. McCain in August, ten dead. Both were failures of watchstanding, and neither was hostile.",
      "The two navies operate under a code for unplanned encounters at sea agreed in 2014. It is a voluntary protocol, not a treaty, and it binds nobody's helm.",
    ],
    precedent:
      "The 2001 Hainan Island collision: an accident between two forces that then had to invent a form of words letting both governments climb down.",
    actors: [
      {
        id: "CN",
        wants: "A form of words that assigns no fault, plus a quiet reduction in the frequency of your transits that no document records as a concession.",
        fears: "Not the incident. Its own captain's initiative becoming public, because that would show that the centre does not fully control the ships it sends to shadow yours.",
        constraint: "A domestic audience that has already seen the pictures, and a navy whose budget grows every time the confrontation is visible.",
      },
      {
        id: "UK",
        wants: "Its own scheduled transit through the same water to pass unremarked, as a routine passage rather than a test of allied resolve.",
        fears: "Being asked to sail into a strait where the rules just changed and the United States has not said what they now are, with one deployable task group and no margin for a second incident.",
        constraint: "A parliament that authorised presence, not a Pacific war, and would have to be recalled to authorise anything more.",
      },
      {
        id: "IN",
        wants: "To learn whether the voluntary encounter code between navies has any force before it binds its own ships to something similar in waters it patrols.",
        fears: "A settled practice in which a great power's collision is an accident and everyone else's is a provocation, decided by whoever releases their footage first.",
        constraint: "It needs both Washington and Beijing, and will not say publicly which account it believes.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Two damaged ships and two grieving crews are still in the same water. What happens in the next hour is decided by two commanding officers reading their own standing orders, not by you." },
      { horizon: "weeks", line: "Whoever releases bridge footage first writes the story, and the other government spends months answering it. The second release is always heard as a rebuttal, however true it is." },
      { horizon: "weeks", line: "Both navies put the same crews back into the same water within the month, under standing orders neither government has changed, because changing them first would be the admission." },
      { horizon: "years", line: "If the patrol pauses, the pause becomes the baseline. Every later transit is then a deliberate escalation rather than a routine sailing, and you will have to spend something to restart what used to be free." },
    ],
    unknowns: [
      {
        question: "Did the other captain have orders to close, or did he decide it himself?",
        whyItMatters: "If it was an order, Beijing chose this and a public demand for accountability will be refused in public, costing you twice. If it was initiative, Beijing has a problem it would rather fix quietly, and the private channel is worth more than the podium.",
        settledBy: "intelligence",
      },
      {
        question: "Is there a form of words both governments can show their own publics and read differently?",
        whyItMatters: "If such a sentence exists, the crisis is a drafting problem and can end this week. If it does not, then every hour spent looking for one is an hour the two navies are improvising in the same water.",
        settledBy: "diplomacy",
      },
      {
        question: "Would moving the patrol a few miles read at home as prudence or as an admission of fault?",
        whyItMatters: "You can test it with a small, visible adjustment before you commit to a withdrawal. If it reads as prudence you get the cooling for nothing. If it reads as fault, restraint costs you the strait and you will not get it back cheaply.",
        settledBy: "posture",
      },
    ],
    theTrap: "You will want the facts before you speak, and the facts are on two bridges. Everyone who can tell you what happened has a career riding on the answer, and both navies will produce internally consistent accounts within a day. The consistency is the tell, not the proof, and a leader who waits for the accounts to agree will wait past the moment when the thing could still have been called an accident.",
  },
  "boomer-collision-2027": {
    headline: "A British and a French ballistic missile submarine have collided while submerged.",
    situation:
      "Both boats are damaged and both are surfacing. They were hiding from everyone, which includes each other — the patrol areas are among the most closely held secrets either country has, and that secrecy is precisely why neither knew the other was there. Nothing has leaked yet.",
    youAre: "You are the Prime Minister, being told this by the Chief of the Defence Staff before Paris has called.",
    decision: "Disclose jointly with France, disclose alone, or hold it while both boats are recovered.",
    stakes:
      "Two allied deterrents are simultaneously unavailable and that fact is worth a great deal to anyone who learns it. Concealment is defensible for exactly as long as it holds.",
    facts: [
      "In early February 2009 HMS Vanguard and the French submarine Le Triomphant collided while submerged in the Atlantic. Both carried ballistic missiles, both returned to port under their own power, and neither had detected the other.",
      "The two navies do not deconflict patrol areas. Deterrent submarines hide from everyone, allies included, and that is precisely why neither knew.",
      "The collision was not disclosed for roughly two weeks, and then only after a newspaper had the story.",
      "Britain has kept at least one armed submarine at sea continuously since April 1969. The entire doctrine rests on that boat being undetectable and available, and this event put two of them alongside instead.",
    ],
    precedent:
      "The Vanguard and Le Triomphant collision (2009): two allied deterrents made simultaneously unavailable by the same secrecy that protects them.",
    actors: [
      {
        id: "FR",
        wants: "The event treated as a navigational matter between two navies, closed quickly, with no implication that patrol areas should be coordinated in future.",
        fears: "Not the damage. Any standing arrangement that makes its deterrent's independence conditional on telling someone else where its boat is, including an ally, because independence is the whole justification at home.",
        constraint: "Doctrine written into domestic politics. A French government that agrees to deconfliction has conceded the argument it has made to its own public for sixty years.",
      },
      {
        id: "US",
        wants: "To know within hours whether the British patrol cycle recovers on schedule, because its own force planning quietly assumes that it does.",
        fears: "A safety argument breaking out in two allied countries at the same time, in the middle of the funding decisions for replacement boats that nobody can afford to reopen.",
        constraint: "It can offer help but cannot be seen directing either deterrent, since the value of both rests on their being sovereign.",
      },
      {
        id: "RU",
        wants: "Confirmation of any period in which allied deterrent boats were alongside instead of at sea, and the reason it happened.",
        fears: "Overplaying it. A public gloat prompts both countries to fund more hulls and shorter gaps, which costs Moscow more than the intelligence is worth.",
        constraint: "Saying what it knows would reveal how it knows, so the most valuable use of the information is the one it can never demonstrate.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Two damaged boats are making for port on the surface. Anyone with a camera on a headland, or a satellite pass over the right water, can count them." },
      { horizon: "weeks", line: "The story arrives from a dockyard town before it arrives from you. Then the subject is no longer the collision but the fortnight in which you knew and said nothing." },
      { horizon: "weeks", line: "Parliament asks whether continuous patrol is safe, and the question lands in the same session as the money for the next generation of boats." },
      { horizon: "years", line: "Any deconfliction arrangement made to prevent a repeat is a permanent admission that two independent deterrents are in fact one system, and every future government inherits that admission." },
    ],
    unknowns: [
      {
        question: "How long before at least one boat is back where the doctrine requires it to be?",
        whyItMatters: "Concealment is defensible only for as long as the gap lasts. Days, and holding is prudent. Months, and the silence becomes the story on its own, separate from anything that happened at sea.",
        settledBy: "hold",
      },
      {
        question: "Has Paris already decided to disclose, and on what timetable?",
        whyItMatters: "A joint statement halves the story and doubles its credibility. If France goes first, you are confirming rather than announcing, and confirming is the weakest position in the sequence.",
        settledBy: "diplomacy",
      },
      {
        question: "Does anyone outside the two navies already have this?",
        whyItMatters: "If a third party holds it, you are not concealing anything — you are waiting to be told about your own submarine by someone else. That changes holding from a policy into a gamble on another government's news judgement.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "The instinct is to protect the deterrent by saying nothing, because the gap in cover is the real secret and it is genuinely worth protecting. But the gap closes and the silence does not. You can survive the fortnight when both boats were alongside far more easily than the fortnight when you knew and chose not to say, and only one of those two facts is still under your control tonight.",
  },
  "petrov-1983": {
    headline: "A Soviet satellite is reporting five American missiles inbound.",
    situation:
      "The new orbital early-warning system has flagged five launches from a single American field and rated the report at the highest confidence it can issue. Ground radar sees nothing at all, and will not see anything for several more minutes even if the report is true. Five is a strange number for a first strike.",
    youAre: "You are the duty officer at Serpukhov-15, outside Moscow. It is just past midnight.",
    decision: "Report this up the chain as a real attack, or record it as a system malfunction on your own authority.",
    stakes:
      "Call it real and you start the retaliation clock on evidence one sensor type can see. Call it false and you are wrong once, at the only moment being wrong is unrecoverable.",
    facts: [
      "26 September 1983, Serpukhov-15 early-warning centre south of Moscow, shortly after midnight.",
      "The Oko satellite system reported one launch, then four more, at its highest reliability indication.",
      "The cause was sunlight glinting off high-altitude cloud tops in an unusual sun-cloud-satellite geometry near the autumn equinox.",
      "Ground radar could not have confirmed anything yet: the missiles would not clear the radar horizon for several more minutes.",
      "Three weeks earlier a Soviet interceptor had shot down Korean Air Lines Flight 007, killing 269 people. Baseline tension was extraordinary.",
    ],
    whatHappened:
      "Lieutenant Colonel Stanislav Petrov reported the event up the chain as a system malfunction. Ground radars later confirmed nothing was inbound.",
    afterward:
      "He was not rewarded. The incident surfaced procedural record-keeping failures, he received no commendation, and he retired the following year. The satellite geometry flaw was later mitigated.",
    actors: [
      {
        id: "US",
        wants: "Nothing tonight. It is running a schedule it considers routine and defensive, and it has no idea that anything is happening.",
        fears: "A Soviet leadership that has convinced itself a first strike is coming and therefore moves first. That is the failure mode Washington cannot see coming and cannot argue with.",
        constraint: "It cannot reassure a fear it has not been told about, and nothing in its own reporting tells it how it is being read from Moscow.",
      },
      {
        id: "UK",
        wants: "The alliance deployment schedule to hold through the autumn without a collapse of domestic support.",
        fears: "Any incident that turns a technical deployment argument into a referendum on hosting the weapons at all, with the protest camps already outside the gates.",
        constraint: "It hosts and does not decide. Its warning time is somebody else's warning time, minus the minutes it takes to be told.",
      },
      {
        id: "FR",
        wants: "To be irrelevant to whatever is happening tonight, and to remain outside anyone else's chain of decision.",
        fears: "Being consumed in an exchange it did not trigger and was not consulted about, because independence also means nobody has an obligation to call.",
        constraint: "No shared warning system. It would learn of a launch from its allies or from the flash, and it has arranged things that way deliberately.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Whatever you write becomes the first sentence of the record. A malfunction that turns out to be real is unrecoverable; a launch report that turns out to be false has already spent the alert and the minutes." },
      { horizon: "hours", line: "Passing it up does not share the decision. The people above you will have less time than you have now and no better information, so you are not asking a question, you are handing them a shaped answer." },
      { horizon: "weeks", line: "If you call it a malfunction and you are right, the fault is investigated quietly and the men who built the system defend it. Your judgement becomes an argument about their engineering." },
      { horizon: "years", line: "A warning system whose highest confidence rating can be wrong will be trusted less every time afterwards, including the one time it is right, and nobody can tell in advance which time that is." },
    ],
    unknowns: [
      {
        question: "Does ground radar see anything at the moment the missiles would clear the horizon?",
        whyItMatters: "It is the only independent source available and it costs a few minutes to get. Corroboration turns one sensor's word into two, and its absence turns the whole event into a single instrument arguing with itself.",
        settledBy: "hold",
      },
      {
        question: "Is the rest of the American force behaving like a force that has just launched?",
        whyItMatters: "Five launches with no other change anywhere is not an attack. If everything else is normal, the strange number is the answer rather than the mystery, and the report can be written with confidence instead of hope.",
        settledBy: "intelligence",
      },
      {
        question: "Is the direct link to Washington working, and would an answer on it be believed here?",
        whyItMatters: "If a question can be asked and the answer trusted, the event can go up the chain without starting the retaliation clock. If the answer would be dismissed as deception, then asking costs minutes and buys nothing.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "The number is the evidence. Five is too few for a first strike, and that reasoning is correct tonight. But it is reasoning about the enemy's intentions rather than about your instrument, and a duty officer who learns to grade warnings by whether they make strategic sense will one day reason his way calmly past a real one.",
  },
  "able-archer": {
    headline: "NATO's command exercise has stopped behaving like an exercise.",
    situation:
      "The annual Western command-post drill has shifted to new encryption, new message formats and radio-silent procedures nobody has seen before. Your intelligence services have been collecting for months on the theory that the West would use an exercise as cover for a real first strike. This looks like the thing they told you to watch for.",
    youAre: "You are the Soviet leadership. It is November 1983 and the last twelve months have been the worst since the Caribbean.",
    decision: "Generate your own forces to be ready, or hold and let an exercise be an exercise.",
    stakes:
      "Generating tells the other side you believe war is imminent, which is exactly what convinces them war is imminent. Holding costs you the minutes if it is not a drill.",
    facts: [
      "7-11 November 1983. Able Archer 83 was a NATO command-post exercise rehearsing nuclear release procedures.",
      "It used new encryption, new message formats and periods of radio silence that Warsaw Pact analysts had not seen before.",
      "Soviet intelligence had been running Operation RYaN since 1981 \u2014 a standing collection effort premised on the theory that the West would use an exercise as cover for a real first strike.",
      "Some Warsaw Pact air units were placed on heightened alert during the exercise.",
      "The scale of Soviet alarm is disputed. Later assessments, including a 1990 US President's Foreign Intelligence Advisory Board review, judged the risk to have been more serious than was understood at the time.",
    ],
    whatHappened:
      "The exercise ended on schedule and no forces were used. Western governments largely did not realise how it had been read until afterwards.",
    afterward:
      "It changed how NATO designed exercises and is the standard case for the observation that an exercise indistinguishable from preparation is preparation, to the people watching it.",
    actors: [
      {
        id: "US",
        wants: "To finish an annual command-post exercise on schedule, having tested the new formats and procedures it was built to test.",
        fears: "A visible Warsaw Pact generation during the drill, which would force NATO to answer, turning its own rehearsal into a real alert that nobody ordered.",
        constraint: "It does not know it is being read this way. Nothing in its own reporting says the exercise is being treated as cover, so it cannot reassure and would not think to.",
      },
      {
        id: "UK",
        wants: "The deployment scheduled for later this month to proceed quietly, with the parliamentary arithmetic intact.",
        fears: "An alliance readiness increase in the middle of the largest protest movement of its postwar history, on an island where the weapons are physically present and the argument is already at the perimeter fence.",
        constraint: "It hosts and consults but does not command, and it would be raising readiness on somebody else's timetable in front of its own electorate.",
      },
      {
        id: "FR",
        wants: "To remain entirely outside the exercise, as it has remained outside the integrated command for two decades.",
        fears: "Being drawn into an alliance alert it did not vote for, then being told about it after the fact because independence means nobody is obliged to call first.",
        constraint: "Outside the command structure, it has no seat in the drill, no view of it, and no way to slow it down if it wanted to.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Any generation you order is seen. The West reads it as a Soviet decision to prepare, and the exercise stops being a rehearsal because it now has a real opponent moving." },
      { horizon: "weeks", line: "The exercise ends on its published date and your alert does not end with it. Standing your own forces down afterwards is harder to explain, at home and abroad, than ordering them up was." },
      { horizon: "weeks", line: "If you hold and nothing happens, the analysts who called it an attack keep their jobs and their theory, and next November they will say it louder." },
      { horizon: "years", line: "An intelligence effort built to find warning will keep finding it. Every future exercise is read the same way, with less scepticism each time, until one of these nights someone acts on the report." },
    ],
    unknowns: [
      {
        question: "Is France doing anything at all?",
        whyItMatters: "A genuine first strike would not leave a nuclear-armed European power outside the preparations and uninformed. French inactivity is the cheapest evidence against the whole theory, and it is available tonight without moving a single unit.",
        settledBy: "intelligence",
      },
      {
        question: "Is your own collection effort reporting what it observes, or what it was instructed to look for?",
        whyItMatters: "A programme graded on finding indicators of surprise attack will find them. If that is what is happening, the report on the desk carries no information at all and should not be weighed as if it did.",
        settledBy: "intelligence",
      },
      {
        question: "Are the ordinary contacts still ordinary — meetings kept, delegations still travelling, people not quietly withdrawn?",
        whyItMatters: "Governments preparing to strike pull their own people back first. A normal diplomatic calendar is disconfirming evidence that costs nothing to check and cannot easily be faked at short notice across many capitals.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "You built a system to detect a surprise attack and it has detected one. The trap is that a collection effort organised around a single hypothesis cannot produce evidence against it: every silence becomes concealment, every anomaly becomes confirmation, and the assessment on your desk is your own theory returned to you in a different envelope, with the authority of having arrived from somewhere else.",
  },
  "cuba-1962": {
    headline: "American aircraft have photographed the missile canisters in your harbour.",
    situation:
      "Soviet dual-capable systems are on your soil at Moscow's request and Washington now has the imagery. The Americans have not yet said publicly what they know. Moscow is telling you one thing and telling Washington another.",
    youAre: "You are the leadership in Havana. The weapons are on your territory and none of them answer to you.",
    decision: "Back Moscow publicly, seek your own settlement with Washington, or try to hold both open.",
    stakes:
      "You are the ground the crisis is fought over, not a party to it. Every outcome here is decided in two other capitals unless you make yourself expensive to ignore.",
    facts: [
      "October 1962. U-2 photography on 14 October confirmed Soviet medium-range ballistic missile sites under construction in Cuba.",
      "The crisis ran thirteen days from that confirmation to the 28 October agreement.",
      "Roughly 100 tactical nuclear weapons were already on the island, a fact not known to Washington at the time.",
      "The public settlement was a Soviet withdrawal in exchange for a US non-invasion pledge; the removal of US Jupiter missiles from Turkey was agreed privately and kept secret for decades.",
      "Cuba was not a party to the negotiation that ended it. Castro learned the terms from a Radio Moscow broadcast.",
    ],
    whatHappened:
      "The missiles were withdrawn. Havana, whose territory the crisis was fought over, was not consulted on the terms.",
    afterward:
      "The Moscow-Washington hotline was established in June 1963 precisely because the crisis had been conducted through public broadcasts and slow diplomatic cables.",
    actors: [
      {
        id: "SU",
        wants: "To get the sites finished, or failing that to convert them into something Washington pays for — a written assurance, a quiet removal somewhere else, anything that reads as an exchange rather than a retreat.",
        fears: "Not the missiles being lost. Being drawn into a shooting war at the end of a sea line it cannot hold, over an island it cannot resupply once the Navy is on station.",
        constraint: "Everything it has here arrived by sea and can only leave the same way. That makes speed worth more to Moscow than your consent, and a deal made without you is faster than one made with you.",
      },
      {
        id: "US",
        wants: "The sites gone, and gone in a way its own public and its allies can see verified.",
        fears: "That force here is answered somewhere it cannot defend — Berlin above all — and that the answer arrives while its attention is in the Caribbean.",
        constraint: "Its European allies do not see a difference in principle between Soviet missiles here and American missiles on the Soviet rim. Any move that ignores that costs the alliance it needs for the rest of the decade.",
      },
      {
        id: "CN",
        wants: "Moscow visibly to be the side that blinked, so that leadership of the movement is available to argue about afterwards.",
        fears: "A superpower arrangement that stabilises the two of them and leaves Beijing outside the room permanently.",
        constraint: "It can send words and nothing else. It cannot supply you, defend you, or make good on any encouragement it gives you.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "A full public endorsement tonight makes every term Moscow accepts tomorrow a term you have already agreed to in advance." },
      { horizon: "weeks", line: "The settlement is announced in two capitals. Your standing at home then depends entirely on how much of it you can plausibly claim to have chosen." },
      { horizon: "weeks", line: "Any approach to Washington that leaks becomes Moscow's proof that you were never reliable, and the fuel, food and air defence that keep you standing all run through Moscow." },
      { horizon: "years", line: "The precedent set here is that a host state's territory can be traded by the power that put the weapons on it. Every future host prices that in and demands the price in writing, in advance." },
    ],
    unknowns: [
      {
        question: "Has Moscow already put something on the table in Washington that involves our territory?",
        whyItMatters: "If the trade is already being drafted, a loyalty statement tonight is your last piece of leverage spent before you learn the price. If nothing has been offered yet, the same statement buys you a seat.",
        settledBy: "intelligence",
      },
      {
        question: "Will the non-invasion assurance exist as a signed instrument, or only as a spoken understanding between two leaders?",
        whyItMatters: "A spoken understanding expires with the men who spoke it. If that is all that is available, your bargaining should be for something permanent and physical instead of for paper.",
        settledBy: "diplomacy",
      },
      {
        question: "If Washington strikes the sites, does Moscow answer here or somewhere else in the world?",
        whyItMatters: "If the answer is elsewhere, you are the fuse and not the battlefield, and hardening the island is wasted effort. If the answer is here, everything you do to make yourself expensive to ignore also makes you a target.",
        settledBy: "intelligence",
      },
      {
        question: "Would Washington treat an approach from us as a wedge worth paying for, or as proof we can be separated from Moscow at no cost?",
        whyItMatters: "It decides whether opening a second channel raises your price or reveals that you have none.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "You will learn the terms from a broadcast. The trap is that the way to avoid that outcome looks like disloyalty tonight, and the way to avoid looking disloyal tonight guarantees that outcome: a host who has promised in public to accept whatever is agreed has nothing left to charge for, and both negotiating capitals will notice within the hour.",
  },
  "ukraine-tactical-2022": {
    headline: "Western capitals are telling each other you are about to use a small nuclear weapon.",
    situation:
      "Allied intelligence has reportedly assessed that you are preparing a low-yield use to break the deadlock. You have not decided any such thing. NATO is generating forces on the strength of an assessment about your intentions that you know to be wrong — which does not make it any less real as a fact you now have to manage.",
    youAre: "You are the President of the Russian Federation, being briefed on what other governments believe you are planning.",
    decision: "Deny it and do nothing, deny it and stand forces down visibly, or let the belief stand because it is useful.",
    stakes:
      "A reputation for being about to do something is a weapon until the other side decides to act on it first. Denial that nobody believes is worse than silence.",
    facts: [
      "In late October 2022 Russia's defence minister told his American, British, French and Turkish counterparts that Ukraine was preparing to detonate a radiological device on its own soil as a provocation.",
      "Ukraine denied it and invited inspectors in. The IAEA visited three Ukrainian facilities and reported on 3 November 2022 that it had found no indication of undeclared nuclear material or activity.",
      "Western governments read the allegation as a possible pretext rather than a warning — an accusation constructed in advance to justify something later.",
      "Public American assessments through late 2022 held that no decision to use a nuclear weapon had been taken, while treating preparation indicators as a standing collection priority. Both halves of that sentence were doing work.",
    ],
    precedent:
      "The October 2022 dirty-bomb allegation: managing what other capitals believe you are about to do, when they are wrong and you cannot prove a negative.",
    actors: [
      {
        id: "US",
        wants: "To make use unthinkable without publicly committing itself to a response it has not chosen and does not want to be held to.",
        fears: "Being seen to have been moved by the threat. That fear is larger in Washington than the fear of the weapon itself, and it makes the softer options politically expensive there.",
        constraint: "It cannot show what convinced it without spending the means that produced it, so its warnings arrive without evidence and its allies have to take them on trust.",
      },
      {
        id: "CN",
        wants: "The war to end without a nuclear use, because a use would make its own declared no-first-use posture worth nothing on the day it needs it.",
        fears: "Being asked in public to choose between you and the markets it sells into.",
        constraint: "It has already said it opposes nuclear threats. It cannot shield one without eating its own words in front of the capitals it has been courting.",
      },
      {
        id: "IN",
        wants: "To keep buying at the discount and keep the relationship, while endorsing nothing.",
        fears: "A precedent that a nuclear state can extract terms from a conventional war it is losing. Its own neighbour would copy that within the decade.",
        constraint: "Its forces run on your equipment and spares. It cannot join a sanctions front, which means its restraint is the only pressure it has and it will spend it quietly.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "A flat denial changes nothing tonight. The force generation is already ordered and it runs on their assessment, not on your statement." },
      { horizon: "weeks", line: "A visible stand-down settles the alarm and hands them a confirmed baseline. They now know what your normal looks like and will read every future deviation from it." },
      { horizon: "weeks", line: "Insurers, grain buyers and the neutral capitals still trading with you price the rumour whether or not it is true. Being wrongly accused costs the same as being guilty in that market." },
      { horizon: "years", line: "If the belief is allowed to stand because it is useful, the useful belief becomes doctrine. Every conventional war a nuclear state is losing from now on comes with this month attached to it." },
    ],
    unknowns: [
      {
        question: "What did they actually see, and was it something we did or something someone arranged for them to see?",
        whyItMatters: "If it came from our own activity, the fix is internal and cheap. If it was placed, the fix is to find who placed it, and standing forces down rewards them.",
        settledBy: "intelligence",
      },
      {
        question: "Will Beijing say the words in public if it is asked directly?",
        whyItMatters: "If it will, ambiguity has stopped being an asset and has become a bill. If it will not, the ambiguity is still affordable for another cycle.",
        settledBy: "diplomacy",
      },
      {
        question: "Would a visible stand-down be read as compliance or as confirmation that the accusation was right?",
        whyItMatters: "It decides whether the reassuring move buys quiet or invites the next demand, and the two look identical on the day you make it.",
        settledBy: "posture",
      },
      {
        question: "Which parts of our own apparatus have been briefing this line, and to whom?",
        whyItMatters: "If the alarm was seeded from inside, denying it abroad while it is still being sold at home makes the denial worthless.",
        settledBy: "covert",
      },
    ],
    theTrap: "The denial you can prove is the one nobody needed. The competent move is to remove the ambiguity that frightened them, and it works — once. It also tells them exactly which lever produced a result, teaches them what your baseline looks like, and means the next accusation, true or not, will be made deliberately because this one worked.",
  },
  "taiwan-2027": {
    headline: "China has closed the sea lanes around Taiwan.",
    situation:
      "Beijing has declared an inspection zone covering the approaches to the island and is stopping commercial traffic. It is not a blockade in name, which is the entire point of how it was designed. Your carrier group is due to transit in under a day and the decision about whether it does is yours.",
    youAre: "You are the President of the United States. The Pacific commander wants an answer before the next watch change.",
    decision: "Transit and force the issue, hold outside and negotiate, or find something in between that does not look like retreat.",
    stakes:
      "Sail through and any accident becomes a shooting incident between nuclear powers. Stay out and every ally in the region reads the answer to a question they have been asking for a decade.",
    facts: [
      "In the strait crisis of 1995-96 China fired missiles into closure areas near Keelung and Kaohsiung. The United States moved two carrier battle groups to the area in March 1996.",
      "In August 2022 the PLA declared six exercise closure areas ringing Taiwan, some inside its claimed territorial waters, and fired ballistic missiles over the island for the first time. Shipping and aviation rerouted for days and nobody was fired on.",
      "Roughly half of the world's container traffic passes through the Taiwan Strait, along with almost all of the most advanced semiconductor production leaving the island.",
      "An 'inspection zone' is deliberately not the word blockade. A blockade is an act of war in international law; an inspection regime is a legal argument, and the argument is the weapon.",
    ],
    precedent:
      "The 1995-96 strait crisis and the 2022 closure areas: coercion engineered to sit just below the threshold that would oblige a response.",
    actors: [
      {
        id: "CN",
        wants: "The zone respected in practice one time. A single rerouted convoy makes it a fact, and facts are cheaper to defend than arguments.",
        fears: "A shooting incident it did not choose and cannot control, started by a crew at sea reading a rule that was written for lawyers.",
        constraint: "It has told its own public the zone is law. It cannot quietly let a carrier through, and it cannot call the zone off without someone at the top spending real standing to do it.",
      },
      {
        id: "RU",
        wants: "The legal argument to survive, because it intends to make the same argument about its own approaches within a few years.",
        fears: "A Chinese success so complete that Beijing no longer needs anything from it.",
        constraint: "Its own forces and attention are committed elsewhere. It can supply words, sensors and a second story in the news, and very little else.",
      },
      {
        id: "KP",
        wants: "American Pacific bandwidth consumed for as long as possible, and a window in which anything it does is the second headline.",
        fears: "A crisis that ends in a US-China understanding, which historically has been paid for with its own room to manoeuvre.",
        constraint: "Its trade and fuel run through Beijing, so it cannot act in a way Beijing has not tolerated in advance.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The course has to be set before anyone in Washington knows what the zone means in practice. Whatever the ship does at that hour becomes the ruling." },
      { horizon: "hours", line: "Every ally in the region reads the transit decision the same day, and reads it as the answer to a question they have been asking for a decade." },
      { horizon: "weeks", line: "Every capital in the region spends the fortnight costing out whether that transit was a commitment or a gesture, and they build their own force plans on the answer rather than on anything you say afterwards." },
      { horizon: "years", line: "An inspection regime that held once is an instrument. It will be declared again, in other waters, by other governments, citing this month as the precedent." },
    ],
    unknowns: [
      {
        question: "Does Beijing intend to stop a warship, or only commercial hulls it knows will comply?",
        whyItMatters: "If warships were never in scope, a transit is theatre with a small chance of catastrophe. If they are, the transit is a decision to have the incident now rather than later.",
        settledBy: "intelligence",
      },
      {
        question: "Will allies sail alongside, or send statements?",
        whyItMatters: "With company, holding outside reads as coalition patience. Alone, holding outside reads as the answer regional capitals have been dreading, and the transit becomes the only move that says anything.",
        settledBy: "diplomacy",
      },
      {
        question: "Who in Beijing is able to call the zone off once it has been announced, and what would they need in return?",
        whyItMatters: "If nobody can end it without losing face, offering an off-ramp is wasted effort and the only variable left is what happens at sea.",
        settledBy: "diplomacy",
      },
      {
        question: "How much of the enforcement decision sits with commanders already on station rather than with the capital?",
        whyItMatters: "The further the decision is from Beijing, the less any assurance from Beijing is worth, and the more a slow approach beats a fast one.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "The zone was built so that your first move becomes the precedent, and it was announced on a clock so that you would treat it as a naval problem rather than a legal one. Deciding it before the watch change gives Beijing the one thing force could not get it: a ruling, made under time pressure, on what its argument is worth.",
  },
  "baltics-flank-2027": {
    headline: "NATO has moved nuclear-capable aircraft to your border.",
    situation:
      "Dual-capable fighters — aircraft that can carry either conventional or nuclear weapons, and which you cannot tell apart from the ground — are now forward-deployed on the Baltic flank. NATO calls it reassurance. Kaliningrad is the piece of your territory that is most exposed and most heavily armed.",
    youAre: "You are the President of the Russian Federation. The General Staff has brought you three options and prefers the loudest.",
    decision: "Match the deployment, respond somewhere else entirely, or absorb it and say nothing.",
    stakes:
      "Matching it puts two sets of dual-capable aircraft inside minutes of each other. Absorbing it invites the next one. Nobody in this exchange can see what the other side's aircraft are loaded with.",
    facts: [
      "During Able Archer 83, from 7 to 11 November 1983, a NATO command exercise rehearsing nuclear release was read in Moscow as possible cover for a real first strike. Some Soviet units went to heightened alert over an exercise nobody thought was provocative.",
      "Dual-capable aircraft cannot be told apart by their load from the ground. That ambiguity is the deterrent value and it is also the entire danger.",
      "Kaliningrad borders two NATO members, has no land connection to the rest of Russia, and sits roughly 500 km from Berlin.",
      "The 1987 treaty that removed intermediate-range missiles from Europe ended in August 2019 when both parties left it. The category of weapon it banned is the category that makes this border short.",
    ],
    precedent:
      "Able Archer 83: a reassurance measure on one side read as preparation on the other, with neither able to see inside the other's aircraft.",
    actors: [
      {
        id: "US",
        wants: "To reassure the flank at the lowest possible cost and without triggering a matching deployment it would then have to answer again.",
        fears: "Being pulled by a small ally into a commitment larger than the one it intended to make.",
        constraint: "The aircraft sit on someone else's soil under someone else's parliamentary consent. That consent is renewable, revocable, and debated in public.",
      },
      {
        id: "FR",
        wants: "European deterrence discussed in European terms, with its own national deterrent as the reference point.",
        fears: "An American-run forward arrangement that makes French independence decorative and settles the continent's nuclear question without France in the middle of it.",
        constraint: "Its doctrine keeps its deterrent strictly national. It cannot join the sharing arrangement without changing what it has spent sixty years being.",
      },
      {
        id: "CN",
        wants: "American attention and American munitions absorbed by Europe indefinitely.",
        fears: "A European crisis large enough to disrupt the trade that funds everything else it is doing.",
        constraint: "It says in public that it opposes stationing nuclear weapons on other states' territory. It cannot cheer a matching move by you without handing that line back to Washington.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "A matching deployment puts two sets of aircraft nobody can inspect within minutes of each other, and from that hour both sides have to plan against the heavier load." },
      { horizon: "weeks", line: "Host parliaments debate what is now parked on their soil. That debate is the softest part of the whole deployment and it closes the moment you give those publics a reason to feel threatened." },
      { horizon: "weeks", line: "Absorbing it in silence costs nothing this month and makes the next rotation easier to justify and larger. The cheap option now is the one with no floor under it." },
      { horizon: "years", line: "With the intermediate-range category gone, forward basing becomes the standard answer to reassurance on both sides. Nothing is left to negotiate the border back to length." },
    ],
    unknowns: [
      {
        question: "Is this permanent basing or a rotation with an end date already written into it?",
        whyItMatters: "If it expires on its own, matching it trades a permanent capability of yours for a temporary one of theirs, and hands them the argument for making theirs permanent.",
        settledBy: "intelligence",
      },
      {
        question: "Which host government is closest to withdrawing its consent, and what would that take?",
        whyItMatters: "If one is already wavering, the deployment is best attacked in a capital rather than at the border, and a military answer is the thing that would save it.",
        settledBy: "diplomacy",
      },
      {
        question: "What do they believe we already keep in Kaliningrad, and is their estimate larger than the truth?",
        whyItMatters: "If their estimate already exceeds reality, matching the deployment spends real capability to buy a reputation you have for free.",
        settledBy: "intelligence",
      },
      {
        question: "Would a response somewhere else entirely be read as de-escalation on this flank or as the opening of a second one?",
        whyItMatters: "Displacement only works if it is understood as displacement. If it is read as expansion, you have taken pressure off nothing and added a theatre.",
        settledBy: "posture",
      },
    ],
    theTrap: "Able Archer's lesson is not that exercises are dangerous. It is that the side being reassured and the side being warned are looking at the same aircraft and cannot tell which story it belongs to. The trap is answering in the same currency, because the loudest option is the only one that can never be quietly withdrawn, and it will be presented to you as the only one that cannot be ignored.",
  },
  "nk-window-2027": {
    headline: "You have announced a launch window and the region wants to know what is in it.",
    situation:
      "The notice went out through the maritime channels as required. Seoul and Tokyo are demanding to know whether this is a satellite, a test or something else, and Beijing's silence is doing more work than anything they could say. Your engineers want the full-range shot; your diplomats want the ambiguity.",
    youAre: "You are the Supreme Commander. The test window opens in days and everything about it is a choice.",
    decision: "Fly the full-range profile, keep it lofted and deniable, or spend the window on something that is not a launch.",
    stakes:
      "The whole value of the programme is that other capitals cannot be certain what you can do. Proving it buys respect and spends the doubt that has been keeping you alive.",
    facts: [
      "North Korea has filed maritime and aviation notices before several satellite attempts, including the failed launch of 31 May 2023, which caused Seoul to issue and then retract an evacuation alert within about twenty minutes.",
      "A lofted trajectory — flown steeply so the missile lands in nearby water — demonstrates energy without demonstrating range. The tests of July 2017 and November 2022 were both flown that way.",
      "North Korea conducted six nuclear tests between 2006 and 2017 and none since. The pause is itself a form of message.",
      "In 2017 state media declared a high-altitude electromagnetic pulse capability. No independent assessment has confirmed it, and its value depends entirely on not being tested.",
    ],
    precedent:
      "The lofted-test pattern since 2017: the programme's leverage is what cannot be ruled out, and a full-range demonstration spends exactly that.",
    actors: [
      {
        id: "CN",
        wants: "The window to pass without a demonstration that forces a Security Council vote it would have to veto in front of everyone.",
        fears: "A shot that hands Washington the argument for more missile defence and a permanent trilateral arrangement on its own coastline.",
        constraint: "It is the fuel and the trade. That makes its displeasure credible, and it also means it can never squeeze hard enough to matter, because collapse on that border is the one outcome it will pay anything to avoid.",
      },
      {
        id: "US",
        wants: "To get through the window without having to act on the line it has already stated in public.",
        fears: "Allied capitals concluding that American cover is conditional and starting their own programmes. That fear moves Washington further than anything you can do to it directly.",
        constraint: "It cannot look surprised. Having said in advance what it would treat as unacceptable, it has to answer the thing it named, whether or not the answer is wise.",
      },
      {
        id: "RU",
        wants: "A supplier and a partner in the Pacific who keeps American attention divided.",
        fears: "Being publicly identified as the source of whatever the demonstration shows.",
        constraint: "It needs things from you right now, so it will not lean on you. Its restraint costs it nothing and buys you nothing either.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "A launch inside the announced window puts alert systems in Seoul and Tokyo on a clock. An alert issued and then retracted damages their credibility, and you will not control what either public learns from that." },
      { horizon: "hours", line: "Your engineers get their data. So does everyone who has been waiting years to collect on exactly this profile, and they get it in the same minutes." },
      { horizon: "weeks", line: "Beijing's silence ends one way or the other. A full-range shot forces it to choose in public between shielding you and holding the vote it does not want." },
      { horizon: "years", line: "A demonstration converts an open question into a planning figure. Defence budgets and allied nuclear debates are answers to figures. Nobody has ever budgeted against a doubt." },
    ],
    unknowns: [
      {
        question: "Do the capitals that matter already credit us with the range we would be demonstrating?",
        whyItMatters: "If they already assume it, the flight adds nothing and spends the doubt for free. If they do not, the flight converts their doubt into a funded programme aimed at you.",
        settledBy: "intelligence",
      },
      {
        question: "Will Beijing block a Council statement this time, or let one through as a warning?",
        whyItMatters: "If the shield is coming off, the ambiguity you are protecting is no longer buying protection, and the window is better spent on something reversible.",
        settledBy: "diplomacy",
      },
      {
        question: "Does the fuel and grain keep arriving if the window closes with no launch at all?",
        whyItMatters: "If restraint is rewarded materially, the non-launch is an asset you can sell more than once. If nothing changes either way, restraint is only a capability postponed for nothing.",
        settledBy: "diplomacy",
      },
      {
        question: "Would Seoul read a spent window as weakness to be pressed or as an opening to be answered?",
        whyItMatters: "The same decision produces relief or a harder line depending on which it is, and only one of those makes the next window cheaper.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "The programme's whole value is what cannot be ruled out, and a successful flight does not add to that — it subtracts from it. The engineers are right that the test would work, and that is the problem: a working demonstration turns a question other capitals must plan against into a number they can build against, and numbers get answered.",
  },
  "kashmir-2027": {
    headline: "Pakistan has moved short-range nuclear artillery to the border.",
    situation:
      "Batteries designed for battlefield use — small weapons, moved forward precisely so that you see them move — are now within range of your formations. Your own declared policy is no first use, which is a promise you are now being invited to test. The units holding those weapons are not the ones who authorise them, and in a crisis that distinction gets thin.",
    youAre: "You are the Prime Minister of India. The Chief of Defence Staff is waiting and the flight time across this border is four minutes.",
    decision: "Hold to no first use and absorb the risk, posture visibly, or pre-empt the batteries before they disperse.",
    stakes:
      "Four minutes is not enough time to verify anything. A declared doctrine only means something if it survives the first day it is inconvenient.",
    facts: [
      "Pakistan first tested the Nasr short-range system in April 2011, with a declared range of about 60 km. A weapon at that range has to be moved close to the border to mean anything at all.",
      "India's declared doctrine since January 2003 is no first use, with a stated exception for a major attack using biological or chemical weapons.",
      "The two capitals are roughly 700 km apart and the flight time across the disputed border is short enough that neither side can verify a launch before it lands.",
      "Since 1992 the two states have exchanged lists of their nuclear installations every 1 January under an agreement not to attack them. Neither has ever missed a year — not during the 1999 Kargil fighting, not in 2019, not in any of the crises since.",
    ],
    precedent:
      "Kargil (1999) and the 2019 exchange: two nuclear neighbours with almost no decision time and a doctrine that has never had to survive a bad night.",
    actors: [
      {
        id: "PK",
        wants: "The batteries seen and not used. The movement forward is the message, meant to restore a deterrent against your conventional advantage without anyone firing anything.",
        fears: "A conventional Indian response that stops deliberately short of any nuclear trigger and simply takes ground. That exposes the whole posture as a bluff, and there is no second posture available.",
        constraint: "The government that announces the policy is not the institution that holds the weapons, and both know it. Anything you offer has to be acceptable to two audiences that do not fully trust each other.",
      },
      {
        id: "US",
        wants: "The crisis over before it has to choose in public between two relationships it needs for different reasons.",
        fears: "A battlefield use anywhere that ends the seventy-year record of non-use. That is the outcome it would spend almost anything to prevent, including spending you.",
        constraint: "It has very little leverage left in Islamabad that it has not already spent, and it needs Delhi for reasons unrelated to this border. Its pressure cannot be symmetric even when the situation is.",
      },
      {
        id: "CN",
        wants: "Your attention held on your western border, and its own corridor investments untouched.",
        fears: "A nuclear exchange next to its own territory and its own people, in a place where fallout does not respect the map it argues about.",
        constraint: "It is the guarantor. Restraining Islamabad in public costs it the relationship it has spent a generation buying, so anything it does will be private and deniable.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Pre-emption has to be ordered before anyone can confirm what moved or who authorised it. Four minutes is not a verification window, and nobody in the room will pretend otherwise." },
      { horizon: "weeks", line: "The doctrine debate opens in your own capital. Once no first use is publicly described as a luxury you cannot afford, it is finished whether or not the text ever changes." },
      { horizon: "weeks", line: "The two states have exchanged installation lists every first of January since 1992, through every crisis. If that floor goes, you lose the one channel that has never failed, and it is not rebuildable on demand." },
      { horizon: "years", line: "If the pledge breaks the first night it is inconvenient, no declared doctrine anywhere is worth anything again — including the pledges you rely on other states to keep about you." },
    ],
    unknowns: [
      {
        question: "Was the move authorised at the top, or by a formation commander showing his own government he is serious?",
        whyItMatters: "If it came from the top there is someone to talk to and a deal to be had. If it did not, pressure on the capital produces nothing and the problem has to be solved further down.",
        settledBy: "intelligence",
      },
      {
        question: "Will Beijing carry a private message, and will it be believed at the other end?",
        whyItMatters: "A message that arrives through the guarantor is worth more than anything you can say directly, and knowing whether that channel is open decides whether you have time to use it.",
        settledBy: "diplomacy",
      },
      {
        question: "Is the first of January exchange still going to happen this year?",
        whyItMatters: "It is the cheapest available reading of whether the relationship's floor is intact. If they are quietly reconsidering it, you are further along than the battlefield picture suggests.",
        settledBy: "diplomacy",
      },
      {
        question: "If we hold tonight, does anyone across the border believe we would hold tomorrow?",
        whyItMatters: "Restraint that is not believed buys no de-escalation and invites the next move forward, which means holding has to be paired with something they can see.",
        settledBy: "posture",
      },
    ],
    theTrap: "Pre-empting the batteries is the move that makes your own declared doctrine retroactively a lie, and that doctrine is the only reason anyone credits your restraint later. The four minutes argue for going first, and the argument is honest. A pledge is worth nothing except on the night keeping it costs you something, and this is that night.",
  },
  "iran-breakout-2028": {
    headline: "Inspectors are at the gate and Israel is fuelling tankers.",
    situation:
      "The international inspectors are demanding access to a site you have not declared. Israeli aerial refuelling aircraft — the ones that make a long-range strike possible — have moved to forward bases. Your programme is close enough to a device that both facts are now about the same question.",
    youAre: "You are the Supreme Leader. The Guard wants the programme finished; the ministries want the inspectors let in.",
    decision: "Admit the inspectors, expel them and sprint, or keep the ambiguity alive for a few more weeks.",
    stakes:
      "Ambiguity has protected you for twenty years. It stops protecting you at the exact moment somebody else decides you are too close to wait out.",
    facts: [
      "The 2015 agreement capped Iranian enrichment at 3.67% and the stockpile at 300 kg. After the United States withdrew in 2018 Iran exceeded both, and by 2021 was enriching to 60%.",
      "Weapons-usable material is conventionally around 90%, but most of the separative work is done long before that. This is why 60% is treated as the alarming number and 90% is treated as arithmetic.",
      "The IAEA's leverage is access. When monitoring cameras were removed in June 2022 the agency said it had lost continuity of knowledge — a gap that cannot be filled in retrospectively.",
      "Israel struck Iraq's Osirak reactor on 7 June 1981 and a suspected reactor at Al-Kibar in Syria on 6 September 2007. Neither strike was preceded by a public warning to anyone.",
    ],
    precedent:
      "Osirak (1981) and Al-Kibar (2007): in the record, the decision to pre-empt is usually taken by the other government, on a clock you cannot see.",
    actors: [
      {
        id: "IL",
        wants: "An independent account of what is inside the undeclared site, before the programme reaches a point where hitting it no longer changes the answer.",
        fears: "Not the device itself. A partial strike that leaves the programme intact, expels the inspectors permanently, and buys Tehran international sympathy it has never had.",
        constraint: "Its long-range reach depends on a small and visible support fleet. Getting ready is a public act days in advance, so readiness and surprise cannot be held at the same time.",
      },
      {
        id: "US",
        wants: "The inspection regime to survive the month without a Security Council vote it would lose.",
        fears: "Being carried into a war by an ally acting on its own clock, and then owning the outcome anyway because every capital in the region will assume it knew.",
        constraint: "It cannot publicly restrain Israel without telling Tehran that restraint exists, which is the same as telling Tehran it has more time than it thought.",
      },
      {
        id: "CN",
        wants: "Iranian crude to keep arriving at the discount it currently pays, with no interruption it has to explain at home.",
        fears: "A precedent that a non-nuclear signatory can be struck for ambiguity alone, because that standard would eventually be pointed at a state it is closer to than it admits.",
        constraint: "It has no instrument in the Gulf that would stop anyone, and no appetite for owning Iranian security if Iranian security becomes available.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Expelling the inspectors ends the last independent account of the site. From that hour every government plans against its own worst estimate rather than the agency's measured one." },
      { horizon: "weeks", line: "Shipping insurance in the Gulf reprices before any government moves. The market prices a strike whether or not one is coming, and that price becomes an argument for going early." },
      { horizon: "years", line: "Continuity of knowledge, once broken, cannot be filled in retrospectively. Every future assessment of the programme is inference, and inference is what other people go to war on." },
      { horizon: "years", line: "A state that walks out of monitoring while close to a weapon teaches every threshold state the same lesson: ambiguity is worth keeping only until the moment someone else decides it has run out." },
    ],
    unknowns: [
      {
        question: "Does the Israeli assessment of our timeline match the real one, or are they working from a number we would not recognise?",
        whyItMatters: "If their clock runs faster than ours, the weeks of ambiguity we think we are buying read to them as a sprint already underway, and the delay itself becomes the trigger.",
        settledBy: "intelligence",
      },
      {
        question: "Would Washington actually restrain a strike it did not authorise, or only regret it afterwards?",
        whyItMatters: "Admitting the inspectors is worth its domestic cost only if it purchases an American veto over someone else's timetable. If it buys nothing, we have paid at home for a foreign decision we cannot influence.",
        settledBy: "diplomacy",
      },
      {
        question: "Would our own security establishment honour an access agreement, or treat it as a betrayal worth breaking?",
        whyItMatters: "If the Guard will not comply, signing produces a public violation instead of a reprieve, and a violation caught by inspectors is worse evidence against us than the ambiguity we started with.",
        settledBy: "hold",
      },
      {
        question: "Does raising our own readiness deter a strike or supply its justification?",
        whyItMatters: "The same movement that makes us harder to hit is the movement their planners will read as a decision already taken, and it moves their date forward rather than ours.",
        settledBy: "posture",
      },
    ],
    theTrap: "You will manage the programme's real timeline. Nobody strikes a timeline. They strike an estimate, made in another capital, from evidence you controlled the supply of. The moment you cut off inspection you stop being able to argue with that estimate, and the estimate is the only thing that decides whether tonight is the night.",
  },
  "israel-preempt-2026": {
    headline: "Iran is weeks from a device and your aircraft are loaded.",
    situation:
      "The assessment your services have given you says the window to act unilaterally is closing. Washington is asking you through the Swiss channel to wait and is not saying for how long. Every previous government in your chair has acted before a hostile state finished a weapon, and that precedent is now a policy you are expected to follow.",
    youAre: "You are the Prime Minister of Israel. The strike package can go tonight.",
    decision: "Strike, wait for Washington, or act in a way that is deniable and buys weeks rather than years.",
    stakes:
      "Striking works once and starts something that does not end on your timetable. Waiting means the decision may not be yours much longer.",
    facts: [
      "Israel destroyed Iraq's Osirak reactor on 7 June 1981 using eight aircraft. The strike was condemned by the UN Security Council, with the United States voting for the resolution.",
      "The September 2007 strike on the Al-Kibar site in Syria went unacknowledged by Israel for over a decade, and Syria never admitted the site existed. Neither government wanted a war, so both said nothing and there was none.",
      "Osirak did not end Iraq's programme. Post-1991 assessments found the effort was reorganised afterwards, moved underground, and given more money.",
      "Central Iran is roughly 1,600 km from Israel, which makes any strike package dependent on aerial refuelling — and tanker movements are visible to satellites days in advance.",
    ],
    precedent:
      "Osirak (1981), Al-Kibar (2007), and what happened in Iraq afterwards: pre-emption buys time, and the record disagrees sharply about how much.",
    actors: [
      {
        id: "IR",
        wants: "To keep the exact state of the programme unknowable, so no government can justify a strike on evidence it would have to show.",
        fears: "Being forced into an open weapons programme it can no longer hide or afford, with the legal cover that keeps its trading partners buying stripped away.",
        constraint: "Any strike, however small, must be answered in a form its own hardliners will grade in public. It does not control how loud that answer has to be.",
      },
      {
        id: "US",
        wants: "A text out of the Swiss channel before anyone shoots, because a signed text is the only outcome it can defend at home.",
        fears: "Being blamed for a strike it did not approve, in a region where every government will assume it approved.",
        constraint: "It cannot threaten to withhold support in public without announcing to Tehran that Israel is on its own, which removes the restraint the threat was meant to create.",
      },
      {
        id: "RU",
        wants: "The crisis to hold American attention and lift energy prices, without ever having to choose a side in writing.",
        fears: "Both endings. An Iranian collapse on its southern approaches and a nuclear-armed Iran on its southern approaches are each worse for it than the present arrangement.",
        constraint: "Its standing as a supplier of air defence to a dozen customers depends on that equipment not failing in public on a single night.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The support aircraft have already moved forward and satellites have already seen it. Whatever you decide tonight, Tehran has spent several days planning against the version where you go." },
      { horizon: "weeks", line: "The inspectors leave, and whatever access existed leaves with them. Your next assessment of the programme will be built from inference, and it will be the assessment you are asked to strike on again." },
      { horizon: "weeks", line: "The Security Council condemned Osirak with an American vote in favour. Expect the diplomatic cost to arrive on a faster schedule than the military effect." },
      { horizon: "years", line: "Osirak did not end Iraq's programme. It was reorganised, moved underground, and given more money. Pre-emption buys time in years and buys certainty of intent in decades." },
    ],
    unknowns: [
      {
        question: "Is Washington asking us to wait because it has something running, or because it has nothing and wants the delay?",
        whyItMatters: "A wait that ends in an American guarantee is worth the closing window. A wait that ends in another wait costs us the only weeks our own aircraft could have used.",
        settledBy: "diplomacy",
      },
      {
        question: "Does the assessment describe the programme as it is now, or as it was when it was written?",
        whyItMatters: "If the estimate is stale, we would be paying the entire political price of a strike for a delay we cannot even measure afterwards.",
        settledBy: "intelligence",
      },
      {
        question: "Would Tehran answer a deniable action quietly, the way Damascus did in 2007?",
        whyItMatters: "Al-Kibar stayed silent because neither government wanted a war. If Iranian politics no longer permit silence, the deniable option is the loud option with less effect.",
        settledBy: "covert",
      },
      {
        question: "Does a visible alert steady our own public, or start the war on someone else's schedule?",
        whyItMatters: "If this becomes a month rather than a night, we need the home front intact. But the same posture that reassures our public is the one that tells theirs the decision is already made.",
        settledBy: "posture",
      },
    ],
    theTrap: "The closing window is the most persuasive number you will be handed and the only one nobody can check. Osirak's window closed exactly on schedule. The programme it was meant to stop came back larger, better hidden, and no longer in any doubt about what it wanted.",
  },
  "broken-arrow": {
    headline: "A nuclear weapon under your custody is unaccounted for.",
    situation:
      "An accident during a movement has left a weapon off the inventory and nobody can yet say whether it is damaged, buried, submerged or simply mislaid. There has never been a nuclear detonation in an accident of this kind — the real harm is contamination and the panic. The first message you send sets everyone else's posture for a week.",
    youAre: "You are the President of the United States, being told this at the start of a crisis you were already managing.",
    decision: "Report it at the highest rung immediately, recover quietly and announce afterwards, or something between.",
    stakes:
      "Say it loudly and every adversary knows exactly when your attention was elsewhere. Say it quietly and the story breaks on someone else's terms.",
    facts: [
      "On 24 January 1961 a B-52 broke up over Goldsboro, North Carolina and released two thermonuclear bombs. One came down intact under a parachute; the other broke apart in a swamp, and its secondary stage was never recovered — the Air Force bought rights to the ground rather than keep digging.",
      "A 1969 Sandia review of that weapon, declassified in 2013, concluded the design 'did not possess adequate safety for the airborne alert role in the B-52.' The public statement at the time had been that there was no danger.",
      "On 17 January 1966 a B-52 collided with a tanker over Palomares, Spain. Two of four bombs had their conventional explosive detonate on impact, scattering plutonium over roughly 2 km2 of farmland; about 1,750 tons of soil were shipped to South Carolina.",
      "The fourth Palomares weapon was found because a local fisherman gave a bearing on where it had entered the water. It was recovered on 7 April, 80 days after the crash, from around 2,700 feet.",
      "No accident of this kind has ever produced a nuclear detonation. The harm is contamination, cost, and what a commander says in the first hours on incomplete data.",
    ],
    precedent:
      "Goldsboro (1961) and Palomares (1966): the physical event is over in seconds, and everything that follows is a disclosure problem.",
    actors: [
      {
        id: "RU",
        wants: "To know within hours whether the American movement it is watching is a search or a preparation.",
        fears: "Misreading a recovery operation as a generation, answering it, and finding it cannot walk the answer back once its own forces are moving.",
        constraint: "Its warning picture is thinner than it says in public, so it has to rely on what Washington tells it at the precise moment Washington has a reason to shade the account.",
      },
      {
        id: "CN",
        wants: "The episode on the record as proof that American custody assurances are marketing rather than fact.",
        fears: "A precedent in which a lost weapon justifies searches, cordons and foreign activity near another state's coast.",
        constraint: "It says almost nothing publicly about its own arsenal. Making noise about custody standards invites exactly the questions it has spent decades not answering.",
      },
      {
        id: "UK",
        wants: "To be told before the press is, because domestic support for its own deterrent rests on the claim that these things are handled competently.",
        fears: "A reopened parliamentary argument about what transits its territory, running at the same time as the recovery.",
        constraint: "It cannot make any statement of its own without American clearance, and it will be asked for one within the hour.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Search aircraft, cordons and closed airspace look identical to preparation. Everything you do to find the weapon is read by somebody as the beginning of something else." },
      { horizon: "weeks", line: "Your first statement will be compared line by line against what the recovery teams are actually doing. Goldsboro's reassurance was contradicted by a safety review that surfaced fifty-two years later, and the contradiction is what people remember." },
      { horizon: "weeks", line: "If there is contamination, Palomares is the template: roughly two square kilometres of farmland, about 1,750 tons of soil shipped abroad, and a compensation argument that outlives the administration that started it." },
      { horizon: "years", line: "Whatever standard of disclosure you set tonight is the standard you will be held to the next time, and the standard you will demand of whoever loses one after you." },
    ],
    unknowns: [
      {
        question: "Do we know the weapon is where the accident left it, or only that nobody has visibly moved it?",
        whyItMatters: "A recovery problem and a theft problem look identical for the first day and need opposite handling. One wants time and quiet, the other wants the routes frozen before dark.",
        settledBy: "intelligence",
      },
      {
        question: "Will the government whose ground this is on let us search on our terms, or only let us ask?",
        whyItMatters: "If access requires a negotiation, the quiet option is already gone, and every hour spent pretending otherwise is an hour of searching we do not get back.",
        settledBy: "diplomacy",
      },
      {
        question: "How many people outside the chain already know, and how long does that leave before the story stops being ours?",
        whyItMatters: "Announcing at hour two and being caught concealing at hour forty are different events with different survivors. The size of the leak decides which of them we are actually choosing between.",
        settledBy: "intelligence",
      },
      {
        question: "Can the technical people give us the real hazard tonight, or only the line that has always been given?",
        whyItMatters: "If we describe the danger wrongly in the first statement, every later correction reads as a cover-up, including the honest ones.",
        settledBy: "hold",
      },
    ],
    theTrap: "You are choosing between saying it early and saying it accurately, and you cannot have both. The Goldsboro statement was calm, immediate and wrong about the safety of the weapon. The correction took fifty-two years to arrive and did more lasting damage than the crash.",
  },
  "empty-quiver-2027": {
    headline: "A warhead has been stolen.",
    situation:
      "This is not a weapon lost in an accident. Someone took it, which means someone planned to, which means the plan had help. A non-state group is the most likely holder and the corridor it would move through is one you have limited visibility into.",
    youAre: "You are the President of the United States. The recovery window is measured in days and closing.",
    decision: "Go public to freeze the routes, stay quiet and hunt, or tell allies only and accept the leak.",
    stakes:
      "A device in the hands of people with no return address breaks deterrence entirely — there is nobody to retaliate against. Recovery is the only outcome that counts.",
    facts: [
      "On 29 and 30 August 2007 six cruise missiles with live warheads were mistakenly loaded onto a B-52 at Minot Air Force Base and flown to Barksdale. Nobody reported them missing; they sat on the aircraft without the required security for roughly 36 hours and were found by a ground crew at the destination.",
      "For those 36 hours the accounting system said the warheads were in a bunker. The failure was not the flight — it was learning that the inventory did not inventory anything.",
      "Four commanders were relieved and many personnel decertified. Restoring confidence and stripping out experience turned out to be the same action.",
      "On 5 December 1965 an aircraft carrying a nuclear bomb rolled off the deck of USS Ticonderoga into roughly 16,000 feet of water. The loss was concealed for years, and when the location's proximity to Japan became clear in 1989 it produced a far larger crisis than an early admission would have.",
      "Between 1992 and 1994 three separate insider thefts of weapon-usable material surfaced in Russia. All the material was recovered, and every thief was an amateur who stole first and went looking for a buyer afterwards.",
    ],
    precedent:
      "Minot (2007) and the Ticonderoga loss (1965): custody failures where the only clock that mattered was the reporting clock.",
    actors: [
      {
        id: "NS",
        wants: "To be believed. A credible claim of possession delivers most of the political effect at none of the technical risk.",
        fears: "Being brokered — that whoever helped them take it sells them for the reward and the amnesty before the claim can be made.",
        constraint: "The object cannot be moved quietly, and every additional person needed to move it is another person who can be bought.",
      },
      {
        id: "RU",
        wants: "To be told directly, and to be seen helping, having lived through its own decade of insider thefts.",
        fears: "A precedent in which a missing weapon licenses foreign forces to operate inside a nuclear state's territory. That precedent points at it next.",
        constraint: "Public cooperation concedes that the American account is true, while its domestic line has always been that American custody is careless.",
      },
      {
        id: "PK",
        wants: "To not be the corridor named out loud, whatever it does privately.",
        fears: "An internationalised argument about custody standards that ends with outside oversight of its own arrangements. It fears that more than it fears the loose weapon.",
        constraint: "A domestic audience that treats any foreign search on its soil as occupation, and a government that would not survive authorising one.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Going public freezes the routes and tells the holders exactly how long they have. Both effects land in the same hour and you cannot choose one." },
      { horizon: "weeks", line: "Every ally that hosts or transits anything of ours asks in writing what our accounting actually verifies. Minot's real finding was not the flight — it was that the inventory did not inventory anything." },
      { horizon: "weeks", line: "The Ticonderoga loss was concealed for years and cost far more with Tokyo in 1989 than an early admission would have cost in 1965. Concealment has an interest rate." },
      { horizon: "years", line: "Even a clean recovery leaves the precedent that a weapon can be taken. Every custody arrangement in the world is renegotiated against that fact, including the ones we currently prefer." },
    ],
    unknowns: [
      {
        question: "Do the holders want to use it or to sell it?",
        whyItMatters: "A seller has to find a buyer, and the search for a buyer is where nearly every case in the record has been caught. A user never has to talk to anyone, and the hunt is a different hunt entirely.",
        settledBy: "intelligence",
      },
      {
        question: "Will the host government let us operate, or only let us ask?",
        whyItMatters: "If their forces do the searching, the recovery runs at the speed of their politics, and the public statement has to be planned for that speed rather than ours.",
        settledBy: "diplomacy",
      },
      {
        question: "Was this an insider acting alone, or an insider who was recruited?",
        whyItMatters: "An amateur who steals first and looks for a buyer afterwards is the historical norm and gives us weeks. A recruited insider means the buyer existed before the theft, and we have days.",
        settledBy: "intelligence",
      },
      {
        question: "How long before this leaks regardless of what we decide?",
        whyItMatters: "The real choice is not quiet against public. It is announcing on our terms against being caught in a concealment that ran one day too long.",
        settledBy: "hold",
      },
    ],
    theTrap: "You will run this as an intelligence problem, and an intelligence problem this thin has one exit: somebody tells you. The fourth Palomares weapon was found because a fisherman gave a bearing. The quiet you are keeping to protect the hunt is the same quiet that stops that person from knowing there is anyone to tell.",
  },
  "cartel-auction": {
    headline: "A tactical nuclear weapon is being offered for sale in a port corridor.",
    situation:
      "The sellers are not ideological. They are moving an object they understand as extremely valuable inventory and they will sell it to whoever pays. Your intelligence on the corridor is thin, the host government is compromised at several levels, and the buyers may already be in the room.",
    youAre: "You are the President of the United States, with an intelligence product you cannot fully corroborate.",
    decision: "Act on thin intelligence, work the host government, or buy time and collect.",
    stakes:
      "Money moves faster than verification. Being right a week late is the same as being wrong.",
    facts: [
      "In August 1994 German authorities seized about 560 g of mixed uranium and plutonium oxide flown in from Moscow. The buyers were undercover officers, and the sting became a scandal because the state had manufactured the demand it then prosecuted.",
      "In February 2006 a Georgian and American sting arrested a man carrying a 100 g sample of highly enriched uranium. He claimed to have kilograms more. It was never found.",
      "The IAEA's trafficking database has recorded roughly 4,390 incidents since 1993, running about 145 to 150 a year. Of the 147 reported in 2024, three were assessed as likely connected to trafficking or malicious use and 123 were most likely unauthorised disposal or discovery.",
      "The pattern across the whole record is a real supply and no competent buyer. Almost every seller who has been caught was caught while looking for one.",
    ],
    precedent:
      "The Munich (1994) and Tbilisi (2006) stings: a real sample, a claimed stockpile behind it that never turns up, and an intelligence picture too thin to tell which world you are in.",
    actors: [
      {
        id: "CR",
        wants: "A clean sale at the price it has already told its own people the object is worth.",
        fears: "Not prosecution. It fears becoming a target of the American state rather than the American courts, a category of problem it has no procedure for.",
        constraint: "It has already borrowed against the sale internally. Walking away costs the leadership its authority, and in that organisation losing authority is not survivable.",
      },
      {
        id: "NS",
        wants: "To be the buyer of record, because a credible claim of possession is worth more to it than the object.",
        fears: "Paying for a fake and being known to have paid. The humiliation costs it recruits it cannot replace.",
        constraint: "It cannot verify what it is buying without an expert, and the expert most willing to travel is the one most likely to belong to an intelligence service.",
      },
      {
        id: "RU",
        wants: "The origin of the material to stay unestablished.",
        fears: "A forensic chain that ends at one of its facilities and reopens the whole accounting argument of the 1990s in public.",
        constraint: "Any real cooperation requires admitting a loss it has officially never had.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Acting on thin product in a port you do not control means a raid that may find an empty room. The corridor closes for the next attempt whether or not this one works." },
      { horizon: "weeks", line: "Munich in 1994 became a scandal not because the material was fake but because the state had manufactured the demand it then prosecuted. Any sting that succeeds here will be read the same way within a fortnight." },
      { horizon: "years", line: "Treating a criminal network as a proliferation actor grants it a standing it did not have. The asking price for the next object is set by whatever we demonstrate we will pay for this one." },
      { horizon: "years", line: "If the sample is real and the stockpile behind it is not, we will have spent enormous capital on a bluff and shown every future seller exactly what a bluff is worth." },
    ],
    unknowns: [
      {
        question: "Is the sample the whole of it, or a sample of something larger?",
        whyItMatters: "Tbilisi in 2006 was 100 g and a claim of kilograms that never surfaced. If this has the same shape, the urgent problem is a fraud and the real problem is the facility that lost the 100 g.",
        settledBy: "intelligence",
      },
      {
        question: "Does the host service have officers we can work with, or only officers who will warn the sellers?",
        whyItMatters: "Sharing the intelligence to obtain access is the same act as leaking it, unless we know which half of their service to hand it to.",
        settledBy: "diplomacy",
      },
      {
        question: "Can we put a buyer in the room without becoming the demand we are prosecuting?",
        whyItMatters: "A sting is the only method that has ever recovered material, and it is the method that made Munich indefensible. The answer decides whether a success is usable in public or only in private.",
        settledBy: "covert",
      },
      {
        question: "How long until the money actually moves?",
        whyItMatters: "Another week of collection is cheap only if no sale is scheduled. If one is, the corroboration we are waiting for arrives after the object has left the corridor.",
        settledBy: "hold",
      },
    ],
    theTrap: "The record says nearly every seller is caught while looking for a buyer, so patience usually wins. Patience only wins in the world where no buyer has been found yet, and which world you are in is the single fact your intelligence cannot give you.",
  },
  "union-generate": {
    headline: "Two governments now claim the same nuclear arsenal.",
    situation:
      "You hold a restorationist command claiming continuity with the Soviet Union, and you say the silos answer to you. Moscow says they answer to Moscow. Somewhere between you are garrisons who have received two sets of orders and have not yet decided which briefcase is real.",
    youAre: "You are the General Secretary of a state most of the world does not recognise.",
    decision: "Force the question and demand the garrisons choose, negotiate a split, or generate and let the ambiguity do the work.",
    stakes:
      "Two authentication chains over one arsenal is the specific condition under which a civil dispute becomes a nuclear one. Nobody outside is sure who to talk to.",
    facts: [
      "When the Soviet Union dissolved in December 1991, nuclear weapons sat on the territory of four successor states: Russia, Ukraine, Kazakhstan and Belarus.",
      "Ukraine held physical custody of roughly 1,900 strategic warheads and did not hold the means to use them. The distinction between possessing weapons and holding authority over them is the whole of this problem.",
      "Under the 1992 Lisbon Protocol and the 1994 Budapest Memorandum the three non-Russian states transferred the weapons to Russia in exchange for security assurances. The last warheads left Ukraine in 1996.",
      "In 1994 Kazakhstan quietly asked Washington for help with about 600 kg of poorly secured highly enriched uranium. A team of about 31 people repackaged it into 448 containers and flew it out, and the operation stayed secret until the material was already on American soil.",
    ],
    precedent:
      "The Soviet succession of 1991-96: custody, authority and recognition coming apart at different speeds over a single arsenal.",
    actors: [
      {
        id: "RU",
        wants: "The garrisons answering one set of orders by the end of the week, without a public test it might lose.",
        fears: "Not your claim. A garrison commander deciding for himself, because an arsenal with two claimants can become an arsenal with twenty.",
        constraint: "It cannot use force against its own missile fields without confirming to the world that it has lost control of them, which is the admission it is spending everything to avoid.",
      },
      {
        id: "US",
        wants: "One address to negotiate with, and a verified account of what sits where.",
        fears: "A repeat of 1991 in which custody, authority and recognition come apart at different speeds, except that this time nobody signs anything and the warheads simply stay where they are.",
        constraint: "Recognising you enough to talk to you is itself a concession, and its allies will not agree on whether to make it.",
      },
      {
        id: "CN",
        wants: "The dispute settled internally and quickly, with no outside inspectors setting a precedent for anybody's internal arsenal.",
        fears: "An externally brokered denuclearisation near its border that ends with foreign teams inside a neighbouring state's weapons complex.",
        constraint: "It has argued for decades that internal affairs are internal. That is precisely the argument it now needs somebody else to break on its behalf.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The garrisons hold two sets of orders and no way to tell which is authentic. Tonight the safe choice for a commander is to do nothing, and that holds only while nobody moves against him." },
      { horizon: "weeks", line: "Generating forces would prove you hold weapons and prove nothing about who they obey. Every foreign service will spend the following month trying to buy one officer's honest answer to that question." },
      { horizon: "years", line: "Ukraine transferred roughly 1,900 warheads for written assurances. Every threshold state has already read what those assurances were worth, and this crisis writes the next line of that lesson." },
      { horizon: "years", line: "What is settled here is whether a disputed arsenal can be divided by negotiation at all. If the answer is that it can only be divided by force, no future dissolution will be peaceful." },
    ],
    unknowns: [
      {
        question: "Do the garrison commanders believe our claim of authority, or are they waiting to see who is still standing next month?",
        whyItMatters: "If they are waiting, time favours whoever looks most likely to survive, and every visible move we make is an argument inside that calculation rather than an order.",
        settledBy: "intelligence",
      },
      {
        question: "Will Washington open a channel without granting recognition?",
        whyItMatters: "If a channel exists short of recognition, we can trade custody for guarantees. If it does not, our only currency is the ambiguity itself, and ambiguity has to be maintained by keeping people frightened.",
        settledBy: "diplomacy",
      },
      {
        question: "Would raising readiness make the garrisons choose us, or make Moscow move before they can?",
        whyItMatters: "The signal that reads as authority to a wavering commander reads as a deadline to a general staff. There is no version of it that only the intended audience hears.",
        settledBy: "posture",
      },
      {
        question: "If we ask nothing of the garrisons for a week, do they keep behaving as ours?",
        whyItMatters: "Authority that exists only while it is being tested is not authority. Knowing that before we spend it decides whether we negotiate a split now or bluff for another month.",
        settledBy: "hold",
      },
    ],
    theTrap: "You will treat recognition as the prize and the arsenal as the lever. It runs the other way. Ukraine held the weapons and not the authority over them, and the day a garrison decides for itself which orders are real, you stop being a claimant to an arsenal and become one more person negotiating with whoever actually holds it.",
  },
  "taiwan-prc-2027": {
    headline: "You declared an inspection zone and an American carrier group is sailing into it.",
    situation:
      "The zone was designed to be short of a blockade so that Washington would have to decide what to call it. Washington has decided to test it instead. Your commanders are asking what they are authorised to do when the first American hull crosses the line, and the honest answer is that you have not told them yet.",
    youAre: "You are the Chairman. The Commission is assembled and the carrier is hours out.",
    decision: "Enforce the zone, let the transit through and keep the zone on paper, or narrow it before contact.",
    stakes:
      "Enforcement means intercepting a nuclear-armed navy in front of an audience. Letting it through means the zone was always words, and everyone will remember that.",
    facts: [
      "In October 1962 Washington called its naval cordon around Cuba a 'quarantine' rather than a blockade, because a blockade is an act of war in international law and a quarantine is not. The word was argued over in the room before the line was drawn.",
      "In August 2022 the PLA declared six closure areas around Taiwan and fired ballistic missiles over the island. Commercial traffic rerouted for days, and no shot was fired at anyone.",
      "The first hull to cross a declared line turns a policy into a decision made by a ship's captain in minutes, using authorities written months earlier by people who are asleep.",
      "In the 1996 crisis the United States moved two carrier battle groups near the strait. Beijing's reading of that week drove two decades of building the means to make it expensive.",
    ],
    precedent:
      "The Cuban quarantine (1962) seen from the other side of the line: you draw it, and then somebody sails at it.",
    actors: [
      {
        id: "US",
        wants: "The transit recorded as routine — one hull through, no escort drama, nothing to photograph — so the zone dies of being ignored rather than being fought over.",
        fears: "Not the shooting. That allies in Manila and Tokyo conclude a line drawn by announcement can reroute an American carrier, and start pricing every future guarantee against that.",
        constraint: "The ship is commanded by an officer working from authorities written months ago. Washington can change the route tonight but cannot rewrite what happens in the first ninety seconds of contact.",
      },
      {
        id: "RU",
        wants: "Washington committed and busy in one ocean, and a declared exclusion zone honoured somewhere in the world without a shot being fired.",
        fears: "A cheap Chinese win that leaves Beijing needing nothing from Moscow, or a quiet understanding between Washington and Beijing reached over its head.",
        constraint: "It has nothing useful to add in that water and cannot be seen failing to matter, so its only real move is commentary.",
      },
      {
        id: "KP",
        wants: "To watch what a declared zone costs. If words on a chart move a carrier, that is the cheapest weapon anyone has demonstrated in years.",
        fears: "A crisis that ends in a US-China understanding, because every such understanding in the past has included tightening on it as the throwaway clause.",
        constraint: "Its fuel and its trade run through China. It cannot create a useful distraction while Beijing is mid-crisis without asking permission it will not get.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "If you have not decided, the first contact is decided for you by a picket commander reading orders drafted for a different week." },
      { horizon: "hours", line: "Enforcement means putting hulls alongside a nuclear-armed navy with cameras running and no agreed way to stop." },
      { horizon: "weeks", line: "Hull insurance and rerouting do the damage before any navy does. Shippers do not wait for the legal question to be settled." },
      { horizon: "years", line: "Whatever happens to this zone becomes the template. Either declared zones are enforced by intercept, or they are understood everywhere as press releases." },
    ],
    unknowns: [
      {
        question: "Is the transit a test of the zone or a demonstration for allied capitals?",
        whyItMatters: "A demonstration ends after one passage and can be allowed through cheaply. A test has the second and third transits already on a schedule, so letting the first through only buys the same argument again next week.",
        settledBy: "intelligence",
      },
      {
        question: "Would Washington accept a narrowed zone described as a clarification rather than a retreat?",
        whyItMatters: "If it would, there is a version of tonight where the zone survives in reduced form and nobody has to lose. If it would not, narrowing buys you nothing and costs you the line.",
        settledBy: "diplomacy",
      },
      {
        question: "Do your own commanders believe silence from the Commission authorises them or restrains them?",
        whyItMatters: "The answer decides whether you still hold this decision at the moment of contact, or whether you already gave it away by not speaking.",
        settledBy: "posture",
      },
    ],
    theTrap: "The zone was written to be ambiguous so that you would keep your options. Ambiguity you never resolve does not stay yours — it gets resolved by a ship's officer in ninety seconds, and he will resolve it in the direction that keeps him alive.",
  },
  "trident-casd": {
    headline: "One of your ballistic missile submarines has missed its communications window.",
    situation:
      "The boat is silent. That is either a technical fault, a deliberate evasion of something it detected, or the beginning of the thing the letters in the safe were written for. Your continuous at-sea deterrent depends on that boat being reachable and it is currently not.",
    youAre: "You are the Prime Minister. The Chief of the Defence Staff has raised it at the second missed window, not the first.",
    decision: "Generate the rest of the force, keep trying quietly, or treat the silence as information and act on it.",
    stakes:
      "Generating is visible to everyone and cannot be walked back quickly. Waiting is exactly what 1983 did, and 1983 is why this file exists.",
    facts: [
      "The United Kingdom has kept at least one armed ballistic missile submarine at sea continuously since April 1969 — more than fifty years without a gap.",
      "Every patrol carries a handwritten letter from the Prime Minister with instructions for what to do if national command no longer exists. The letters are destroyed unopened when a Prime Minister leaves office, so nobody has ever read one.",
      "On 24 November 1961 every communications link between SAC headquarters, NORAD and the three early-warning radars failed at once. Because the links were deliberately routed independently, their simultaneous failure was itself read as evidence of attack and bombers were readied.",
      "The 1961 cause was a single relay station in Colorado through which the supposedly independent routes all happened to pass.",
      "On 12 August 2000 the submarine Kursk sank with 118 aboard. Twenty-three men survived for some hours in the aft compartment; domestic rescue attempts failed repeatedly and foreign offers of help were not accepted for days.",
    ],
    precedent:
      "The 1961 blackout and the Kursk (2000): silence that could be a fault, an evasion, or the thing the letters were written for.",
    actors: [
      {
        id: "US",
        wants: "To know whether this is a British equipment problem or the leading edge of something aimed at both of you, and to know it before London does anything visible.",
        fears: "Learning about a British force generation from the news, or being pulled into an alliance-wide alert built on a fault nobody has diagnosed yet.",
        constraint: "Shared warning and shared systems mean it cannot claim ignorance afterwards. Anything it does to reassure you is read in Moscow as the alliance moving together.",
      },
      {
        id: "RU",
        wants: "To learn cheaply what a missed window does to British posture. A reaction it can watch is worth more than a boat it cannot find.",
        fears: "Being blamed for a failure it did not cause, at a moment when its own forces are not ready and it has no way to prove a negative.",
        constraint: "To demonstrate it is not responsible it would have to say where its own units are, which is the one thing it will not do.",
      },
      {
        id: "FR",
        wants: "Information about what happened, without joining anything that looks like an allied alert clock.",
        fears: "A British generation that makes French non-participation the story, forcing a choice between the doctrine and the alliance in public.",
        constraint: "Employment rests with one person and has never been delegated. There is no committee in Paris that can quietly agree to a shared timetable.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The staff will convert a missed window into a warning indicator, because an indicator has actions attached and a fault does not." },
      { horizon: "hours", line: "Generating the rest of the force is visible within the hour and cannot be walked back at the speed it was ordered." },
      { horizon: "weeks", line: "Fifty years of unbroken patrol becomes a headline about a gap. The political damage lands whether or not the boat was ever in danger." },
      { horizon: "years", line: "If silence generates a force, silence becomes a lever. Anyone who can interrupt a link once has learned they can move your posture without touching a weapon." },
    ],
    unknowns: [
      {
        question: "Is the boat quiet because something made it quiet, or because it chose to be?",
        whyItMatters: "A boat evading has already made a judgement about a threat you cannot see. A broken transmitter has made no judgement at all, and only one of those is a reason to move the rest of the force.",
        settledBy: "hold",
      },
      {
        question: "Does Washington know something about that water that it has not passed to you?",
        whyItMatters: "If it does, two missed windows are not the whole picture and waiting is negligence. If it does not, generating tells Moscow that Britain moves on ambiguity alone.",
        settledBy: "diplomacy",
      },
      {
        question: "Are your communication routes genuinely independent, or only assumed independent since the last time anyone traced them?",
        whyItMatters: "In 1961 the supposedly independent routes shared one relay in Colorado, and their simultaneous failure was read as proof of attack. If yours share anything, the silence is evidence of a fault and not of an enemy.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "Nobody will tell you it is a fault. They will tell you they cannot rule out an attack, which is the same sentence with the burden reversed, and only one version of it obliges you to act tonight.",
  },
  "frappe-independence": {
    headline: "NATO wants your deterrent on their timetable.",
    situation:
      "The alliance is asking for coordinated force generation and expects you to participate. Your deterrent is independent by constitutional design — that independence is the entire point of it, and has been since the Republic decided it could not rely on anyone else's guarantee. Refusing costs you the alliance; agreeing costs you the doctrine.",
    youAre: "You are the President of the French Republic. The decision is yours alone and always has been.",
    decision: "Coordinate with NATO, generate separately on your own authority, or hold.",
    stakes:
      "A deterrent that moves when Washington asks is not independent, and everyone including your adversaries will draw that conclusion. A deterrent nobody coordinates with may not deter anything jointly.",
    facts: [
      "France tested its first weapon on 13 February 1960 and withdrew from NATO's integrated military command in 1966, keeping the deterrent under sole national authority. It rejoined the integrated command in 2009 and has never placed the deterrent under it.",
      "French doctrine reserves a single demonstrative use as a final warning that vital interests are at stake. By design that is a national judgement, and it cannot be delegated to a committee of allies.",
      "Employment rests with the President alone. There is no second signature in the French chain — a different design choice from the American two-person rule, made deliberately and never revisited.",
      "NATO's nuclear planning group has existed since 1966. France has never joined it.",
    ],
    precedent:
      "The 1966 withdrawal from the integrated command: an independent deterrent is only independent on the first day that independence is inconvenient.",
    actors: [
      {
        id: "US",
        wants: "Visible simultaneity — every allied force generating inside the same day, so Moscow reads one bloc and not five capitals.",
        fears: "Not a French refusal. A French deterrent that moves on its own judgement, on a night Washington did not choose, for reasons Washington learns afterwards.",
        constraint: "It cannot order Paris and it cannot ask loudly. A public request that gets a public no does more damage than the uncoordinated posture it was meant to fix.",
      },
      {
        id: "UK",
        wants: "A French yes, so the coordinated timetable looks European rather than American.",
        fears: "Being left as the only European nuclear power moving on Washington's clock, and having that described accurately at home for the next decade.",
        constraint: "Its systems and its politics both make the independent line harder to hold than yours, which is exactly why it needs you inside the arrangement.",
      },
      {
        id: "RU",
        wants: "A quotable split. A French refusal on the record is worth more to it than any amount of ambiguity about who would answer for whom.",
        fears: "A decision-maker with no second signature and no committee to slow him down, because that is the one chain it cannot delay by talking.",
        constraint: "Its leverage over Paris is commercial and largely spent. Its threats have been discounted so often that a new one changes nothing.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The alliance call happens tonight either way. An empty chair is noticed by everyone in the room and reported by someone in it." },
      { horizon: "weeks", line: "The communiqué wording becomes the story. Whichever word is chosen for what France did will be read as the answer to a question the Republic has refused to answer since 1966." },
      { horizon: "years", line: "Independence asserted once and declined once is not independence. Generate separately now and the alliance plans around your absence permanently." },
      { horizon: "years", line: "Coordinate and the single demonstrative warning becomes something adversaries expect a committee to approve. A doctrine that depends on being a national judgement does not survive being read as a shared one." },
    ],
    unknowns: [
      {
        question: "Is the alliance asking for a shared timetable or a shared decision?",
        whyItMatters: "A timetable can be matched by coincidence and disowned afterwards. A decision cannot, and the difference is whether there exists a version of yes that leaves the doctrine intact.",
        settledBy: "diplomacy",
      },
      {
        question: "Would Moscow read a separate French generation as a second independent decision-maker or as a crack in the alliance?",
        whyItMatters: "The first deters and is the whole argument for independence. The second invites, and if that is the reading, holding is safer than acting alone.",
        settledBy: "intelligence",
      },
      {
        question: "Would your own service chiefs accept a national generation that no ally is warned about in advance?",
        whyItMatters: "If they would quietly warn allies anyway, the independence is already a formality and you are choosing the wording rather than the policy.",
        settledBy: "hold",
      },
    ],
    theTrap: "You can protect the doctrine in every sentence and lose it on the calendar. Generate on the same night for entirely your own reasons and nobody will record the reasons — only the night.",
  },
  "nasr-flushed": {
    headline: "Your short-range nuclear batteries are forward and India has noticed.",
    situation:
      "The batteries were moved to be seen — that is what they are for. India's declared no-first-use policy is now under real pressure from its own military, and the custody arrangements at your end get thinner the further forward the weapons sit. The people holding them are not the people who authorise them.",
    youAre: "You are the Prime Minister of Pakistan, chairing an authority the army effectively runs.",
    decision: "Pull them back, hold them forward, or disperse them further so they cannot be taken out in one strike.",
    stakes:
      "Dispersal survives a first strike and destroys two-man control at the same time. The safest arrangement against attack is the least safe against accident.",
    facts: [
      "Pakistan first tested the Nasr short-range system in April 2011, describing it as an answer to Indian conventional doctrine. Its declared range is about 60 km, which means it only matters if it is close to the border.",
      "Moving such systems forward shortens the adversary's decision time and lengthens your own custody chain at the same moment. The people holding them are not the people who authorise them.",
      "Dispersal is the standard answer to a first strike and the standard way two-person control degrades. The arrangement that best survives an attack is the worst one against an accident.",
      "India declared no first use in January 2003. Pakistan has never declared one, and the absence is the policy.",
    ],
    precedent:
      "The Nasr deployments since 2011: a weapon whose purpose is to be seen, held forward by people who cannot authorise it, on a border with almost no flight time.",
    actors: [
      {
        id: "IN",
        wants: "The batteries back from the border without having to say what it paid for them, and its no-first-use declaration still standing at the end of the week.",
        fears: "Its own army and its own public forcing it to drop no first use. A declaration abandoned under pressure cannot be re-declared later and will never be believed again.",
        constraint: "It declared the policy unilaterally in 2003, so there is no partner to renegotiate it with. Any change is visible, permanent and entirely its own.",
      },
      {
        id: "US",
        wants: "Certainty that every warhead is still inside a chain someone senior can account for. It wants that more than it wants either side to back down.",
        fears: "A weapon out of the chain. An exchange between two states is a catastrophe it can model; a device that leaves custody is one it cannot.",
        constraint: "It has little leverage left in Islamabad, and the intelligence relationship it would have to spend to get answers is the one it least wants to burn.",
      },
      {
        id: "CN",
        wants: "Pakistan stable and India occupied, with the crisis over before anyone demonstrates anything.",
        fears: "Nuclear use on its own frontier, and a crisis that hardens the American-Indian alignment into something permanent.",
        constraint: "Its corridor investments run through the ground that would be fought over, and its own no-first-use declaration limits what it can offer as cover.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Dispersal buys survivability tonight and costs two-person control at the same moment. There is no version where you get both." },
      { horizon: "hours", line: "A weapon this short-ranged only matters close to the border, so every step you take toward surviving a first strike is a step that shortens somebody else's time to decide." },
      { horizon: "weeks", line: "India's no-first-use debate moves from seminar rooms to the front pages, and once it is there it does not go back." },
      { horizon: "years", line: "If forward short-range systems are seen to deter a conventional attack, every state facing a stronger neighbour builds them. The custody problem gets copied along with the doctrine." },
    ],
    unknowns: [
      {
        question: "Does the chain still answer to you at the far end, or only to the corps commander?",
        whyItMatters: "Ordering one battery back tells you within hours who is actually in the loop. If the answer comes slowly or comes negotiated, your options tonight are narrower than the map suggests.",
        settledBy: "posture",
      },
      {
        question: "Is Indian no first use still government policy, or a sentence its military has stopped planning around?",
        whyItMatters: "If the doctrine is hollow, holding the batteries forward is not deterring an attack. It is supplying the argument for pre-emption to the people who most want to make it.",
        settledBy: "diplomacy",
      },
      {
        question: "Will Washington trade anything real for a pullback, or is it only asking?",
        whyItMatters: "A pullback that buys something can be sold at home as strategy. A pullback that buys nothing is a retreat, and the army will not carry it.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "Forward is a message and dispersed is survival, and on a map they look the same. The arrangement that makes the deterrent credible is the one that leaves the weapon with the officer you can reach last.",
  },
  "asat-blind-2028": {
    headline: "One of your early-warning satellites has gone dark.",
    situation:
      "The bird stopped reporting without warning. It could be debris, a component failure, or something deliberate — and the three look identical from the ground for the first several hours. Whatever the cause, your coverage now has a hole in it, and every close call that arrives while it is dark will look worse than it is.",
    youAre: "You are the President of the United States. Space Command cannot yet tell you which of the three it was.",
    decision: "Treat it as an attack, treat it as a failure, or spend the time to find out and accept being blind while you do.",
    stakes:
      "Calling it an attack when it was debris starts something over a broken component. Calling it a failure when it was deliberate means the next thing arrives unseen.",
    facts: [
      "On 11 January 2007 China destroyed one of its own weather satellites, producing more than 3,000 trackable fragments — still the largest single debris event on record.",
      "On 15 November 2021 a Russian test destroyed a defunct satellite and produced roughly 1,500 trackable pieces. The crew of the International Space Station sheltered in their return capsules as the cloud passed.",
      "A satellite failing on its own looks identical from the ground to a satellite being attacked, for hours. The catalogue tells you an object stopped reporting, never why.",
      "Starfish Prime in 1962 killed satellites indiscriminately over the following months: Transit 4B stopped transmitting on 2 August 1962, TRAAC on 14 August, and Britain's Ariel 1 was crippled within days. None were targets; all were casualties of a belt of trapped electrons that lasted years.",
    ],
    precedent:
      "The 2007 and 2021 anti-satellite tests, and Starfish Prime: losing a sensor is unambiguous, and losing it for a reason is not.",
    actors: [
      {
        id: "RU",
        wants: "To see how blind you are and how fast you notice, without paying for the demonstration.",
        fears: "Being blamed for something it did not do, at a moment when its own forces are not postured for the response that would follow.",
        constraint: "Proving it was not involved means describing what its own sensors saw and where its assets sit. It will accept being suspected rather than say that.",
      },
      {
        id: "CN",
        wants: "Its 2007 test out of the first paragraph of every briefing. It wants to be cleared quickly, because an American who cannot see is more dangerous to it than an American who can.",
        fears: "A launch decision taken on assumption during a coverage gap it is blamed for creating.",
        constraint: "Exculpation would require discussing its space programme in detail it has never discussed. The three thousand fragments are on the record and cannot be argued away.",
      },
      {
        id: "KP",
        wants: "The window. A period of degraded American warning is the cheapest time it will ever have to test something and call it routine.",
        fears: "Being the reason a coverage gap becomes a crisis, and drawing a response calibrated for a peer opponent.",
        constraint: "It cannot tell how long the gap lasts or when it closes, and being wrong about that is not survivable.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Every ambiguous event that arrives while the hole is open looks worse than it is, because there is nothing left to check it against." },
      { horizon: "hours", line: "The attack explanation will reach you first, because it is the only one of the three that comes with a list of things to do." },
      { horizon: "weeks", line: "Attribution takes longer than the news cycle. Allies will ask whether the guarantee still has eyes before you have an answer to give them." },
      { horizon: "years", line: "Call it an attack and a dead satellite becomes an act of war, so every debris event is now a crisis. Call it a failure and you have taught everyone that the first sensor is free." },
    ],
    unknowns: [
      {
        question: "Was anything else in that orbit in the hours before it went quiet?",
        whyItMatters: "Proximity does not prove intent, but its absence removes the attack explanation and turns tonight into a maintenance problem instead of a decision.",
        settledBy: "intelligence",
      },
      {
        question: "Will Moscow and Beijing both deny it in a channel where a lie would cost them something later?",
        whyItMatters: "A public denial is free and tells you nothing. A denial that puts something at risk narrows the list, and a refusal to give one narrows it a different way.",
        settledBy: "diplomacy",
      },
      {
        question: "How long can you sit inside the gap before the gap itself becomes your reason to act?",
        whyItMatters: "Patience has a shelf life. Deciding now where your tolerance ends stops you discovering it at four in the morning with worse information than you have tonight.",
        settledBy: "hold",
      },
    ],
    theTrap: "You will be handed three explanations and only one of them arrives with options attached. The pull toward the answer that lets you do something is not evidence, and it is strongest in exactly the hours when you have the least.",
  },
  "lac-clash-2027": {
    headline: "Indian and Chinese troops fought hand to hand at altitude last night.",
    situation:
      "There are dead on both sides and no shots were fired — the fighting was done with improvised weapons under an old agreement neither side wants to be the first to break. Both militaries have now moved dual-capable aircraft forward. The agreement that kept firearms out of this dispute is the only thing that has ever kept it small.",
    youAre: "You are the Prime Minister of India, with a domestic public that has already seen the footage.",
    decision: "Retaliate conventionally, hold to the old agreement, or move forces without using them.",
    stakes:
      "Two nuclear states have kept this border non-lethal by convention alone for decades. Conventions end the first time one side decides the cost of restraint is higher than the cost of breaking it.",
    facts: [
      "On the night of 15 June 2020 Indian and Chinese troops fought with clubs and improvised weapons in the Galwan Valley at roughly 4,300 m. Twenty Indian soldiers died; China acknowledged four deaths months later. No shots were fired.",
      "Firearms were absent by agreement. Protocols signed in 1996 and 2005 bar their use within two kilometres of the line, and that convention is the only reason the fighting was hand to hand.",
      "The line of actual control is not drawn on any agreed map. Both armies patrol to their own version of it, which is why contact happens at all.",
      "In September 2020 warning shots were fired near the line for the first time in 45 years. Both sides moved within days to contain it, because both understood what the convention was worth.",
    ],
    precedent:
      "Galwan (2020): two nuclear states keeping a border dispute non-lethal by a convention with no enforcement behind it whatsoever.",
    actors: [
      {
        id: "CN",
        wants: "The incident closed and the line left undrawn. Any agreed map ends the ambiguity it has profited from for sixty years.",
        fears: "An Indian response that formalises the border, or that converts Delhi's tilt toward Washington into something written down.",
        constraint: "It waited months to admit four deaths and never gave its own public the full figure. It cannot escalate loudly now without explaining what it withheld.",
      },
      {
        id: "PK",
        wants: "Indian divisions committed and facing east, and a demonstration that India will absorb casualties from a nuclear-armed neighbour rather than answer them.",
        fears: "The opposite lesson — an India that decides a conventional response to a nuclear-armed state is normal, since that is the exact scenario its own posture depends on being unthinkable.",
        constraint: "Its economy and its dependence on Beijing mean it can encourage this crisis but cannot afford to open anything of its own alongside it.",
      },
      {
        id: "US",
        wants: "India closer, with more agreements signed and more systems bought, without owning a Himalayan border in the process.",
        fears: "Being asked for something concrete on ground it has no intention of defending, and having the refusal become the measure of the partnership.",
        constraint: "There is no treaty here to invoke and no appetite at home to write one. Its support is real up to the point where it would have to be specific.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Dual-capable aircraft are forward on both sides. The next unexplained track gets read against a body count instead of against a map." },
      { horizon: "weeks", line: "The footage is already public, so the political clock runs faster than the military one. You will be asked to answer before anyone can tell you what happened." },
      { horizon: "weeks", line: "Beijing's casualty figure, whenever it comes, sets the price of any settlement. A number published late is a decision to keep denial available." },
      { horizon: "years", line: "The 1996 and 2005 protocols have no enforcement behind them. Break the firearms convention once and nothing replaces it, and every patrol on that line is armed from then on." },
    ],
    unknowns: [
      {
        question: "Was the fight ordered from Beijing or started by a local commander?",
        whyItMatters: "A local fight can be settled locally and disowned by both capitals. An ordered one means the policy changed, and holding to the convention would be answering a decision with a courtesy.",
        settledBy: "intelligence",
      },
      {
        question: "Does Beijing still consider the no-firearms protocols worth keeping after last night?",
        whyItMatters: "If it does, restraint is reciprocated and cheap. If it does not, you are the only side observing a rule, and the first side to notice that gets the advantage of noticing it first.",
        settledBy: "diplomacy",
      },
      {
        question: "Do forward-deployed aircraft read to Beijing as preparation to strike or as a statement that you intend to stop there?",
        whyItMatters: "The same movement can buy you domestic room or buy you a matching deployment. Which one it is decides whether moving forces without using them is the safe option or the expensive one.",
        settledBy: "posture",
      },
    ],
    theTrap: "The convention that has kept this border non-lethal has no text you can hold up, no penalty and no enforcement. It survives only because both sides keep deciding it is worth more than the win in front of them, and your public has already seen the footage.",
  },
  "carrington-2027": {
    headline: "A solar storm the size of the 1859 event will reach Earth in hours.",
    situation:
      "The coronal mass ejection is confirmed and large. It will degrade satellites, corrupt timing signals and take down parts of the power grid — and it will do all of that in a way that looks, on a warning board, remarkably like the opening of a high-altitude nuclear attack. Every other nuclear state is about to see the same thing you are.",
    youAre: "You are the President of the United States, with about six hours of warning and no way to stop it.",
    decision: "Generate forces before you lose the ability to, warn adversaries in advance, or ride it out quietly.",
    stakes:
      "Generating looks like preparing a strike under cover of the storm. Not generating means whatever survives the storm is what you have. The sun is not on anyone's side.",
    facts: [
      "The Carrington event of 1-2 September 1859 induced currents strong enough to shock telegraph operators and set paper alight, and aurora were seen close to the tropics.",
      "On 23 May 1967 a solar radio burst degraded all three Ballistic Missile Early Warning System radars simultaneously. Jamming those radars was doctrinally an act of war; additional bombers were readied while a small Air Force solar-forecasting cell established that all three sites were in sunlight and the Sun was the cause.",
      "On 13 March 1989 a geomagnetic storm collapsed the Hydro-Quebec grid in about ninety seconds, leaving roughly six million people without power for nine hours and damaging a transformer at a New Jersey nuclear plant.",
      "A Carrington-class ejection crossed Earth's orbital path in July 2012 and missed by about a week.",
      "Every nuclear state's warning system degrades at the same moment, which means every one of them is deciding what the degradation means at the same moment, with the same bad information.",
    ],
    precedent:
      "The 1967 BMEWS scare: the same physics that blinds your sensors also makes the blinding look like somebody's decision.",
    actors: [
      {
        id: "RU",
        wants: "To establish within the hour whether American force generation tonight is precaution or cover, without asking a question that concedes how much of its own warning picture the storm has taken.",
        fears: "Not the American missiles. That its satellites come back partially working, so that for months afterwards it cannot tell which of its own sensors are lying to it and has to treat every reading as suspect.",
        constraint: "Its warning rests more on ground radar and less on space than the American system does, so it goes blind in a different order and cannot simply mirror whatever Washington is seen to do.",
      },
      {
        id: "CN",
        wants: "The storm treated publicly and early as a civil emergency, so its own satellite losses are logged as weather rather than as evidence of an attack on it.",
        fears: "That an American generation order hands its own military the argument for a permanently higher peacetime alert posture, a change it has spent decades refusing.",
        constraint: "It has no habit of using a fast channel to Washington. The channels it does have are diplomatic, staffed in Beijing daylight, and slower than the storm.",
      },
      {
        id: "UK",
        wants: "To be told before the press is that any American movement is storm-related, so it can tell its own parliament first.",
        fears: "Discovering in public that it has no picture of its own to check yours against, because its warning feed is a copy of the one the storm is degrading.",
        constraint: "Its entire early-warning input arrives through American systems, which fail at the same moment for the same reason.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Anything you generate tonight is seen by the other side through sensors the storm is already breaking, so it arrives partial, late and out of order. The version they receive is worse than the version you sent." },
      { horizon: "hours", line: "A warning message sent in advance is the only part of this you control, and it is also a written record that you knew your own warning was about to fail." },
      { horizon: "weeks", line: "Grid restoration, transformer replacement and insurance losses put the outage in every news cycle, and the inquiry that follows asks which warning gaps the storm caused and which ones it merely revealed." },
      { horizon: "years", line: "Whatever you do becomes the template. Warn in advance and degraded warning becomes a shared problem states talk about. Stay silent and every future storm is treated by everyone as possible cover for a first move." },
    ],
    unknowns: [
      {
        question: "Does the other side have the same forecast, or is it about to watch its sensors fail with no explanation?",
        whyItMatters: "If they have the forecast, silence costs you little. If they do not, the first thing they must explain is a simultaneous blinding, and the cheapest explanation available to them is you.",
        settledBy: "diplomacy",
      },
      {
        question: "Which of my sensors will go dark and which will come back wrong?",
        whyItMatters: "A dark sensor is a known gap. A degraded sensor keeps voting, and you will weight its reports as healthy for as long as nobody tells you otherwise.",
        settledBy: "intelligence",
      },
      {
        question: "Will an order given now still be recallable in six hours, when the recall runs over the same links the storm is eating?",
        whyItMatters: "Reversibility is a property of the communications, not of the order. If recall degrades first, generation becomes a one-way move you never intended to make one-way.",
        settledBy: "hold",
      },
    ],
    theTrap: "The competent instinct is to move early, while the links still work. That is exactly why your generation reaches them before the storm does, and lands looking like the decision of someone who knew something they did not.",
  },
  "fobs-ambiguity": {
    headline: "Something launched from Plesetsk went into orbit instead of coming down.",
    situation:
      "A Russian boost that started on a familiar profile did not follow the arc a test flight should have. It circularised — it went around instead of over. That is either a satellite launch on an unusual trajectory or a weapon designed to approach from the south, where your radars are thinnest and your warning time is shortest.",
    youAre: "You are the President of the United States. Space Command is telling you it will take hours to be sure.",
    decision: "Posture against the southern approach, demand an explanation on the hotline, or wait for orbital confirmation.",
    stakes:
      "The southern gap in your coverage is not a secret. A system built to use it would look exactly like this, and so would an ordinary satellite.",
    facts: [
      "On 27 July 2021 China tested a vehicle that entered a partial orbit and released a hypersonic glide vehicle which then flew a long atmospheric course. Neither element was new — the Soviet Union fielded and retired a fractional orbital system under SALT II — but the combination had not been demonstrated.",
      "The Chairman of the Joint Chiefs called it 'very close' to a Sputnik moment. China's foreign ministry described it as a routine reusable-spacecraft test. Both statements were made about the same object.",
      "A partial-orbit approach is attractive precisely because it can arrive from the south, where early-warning radars built to look north are thinnest.",
      "Telling a satellite insertion from a partial-orbit weapon takes hours of orbital determination, against a warning timeline of 25 to 30 minutes for an ordinary intercontinental trajectory. The boost phase looks the same either way, and the hours are the problem.",
    ],
    precedent:
      "The July 2021 orbital and glide test: a profile whose entire value is that it cannot be classified quickly.",
    actors: [
      {
        id: "RU",
        wants: "The launch accepted as a legal space launch on the strength of the notice it already filed, without having to describe the payload in terms that would settle the question.",
        fears: "Not a strike. That the ambiguity gives Washington the political case to fund southern-facing sensors permanently, which destroys the value of the very approach it just demonstrated.",
        constraint: "Its pre-launch notification is technically accurate and deliberately thin. Expanding it now concedes that notification is being used as cover; retracting it is worse.",
      },
      {
        id: "CN",
        wants: "A clean measurement of how fast the United States can classify an unusual orbital profile, because that number prices its own programme.",
        fears: "An American posture that treats any partial orbit as presumptively hostile, which would close off tests it has already planned.",
        constraint: "It is not the launching party. Anything it says in defence of the profile reads as speaking for Moscow, which it will not do.",
      },
      {
        id: "UK",
        wants: "Notice of any American posture change before it appears on a screen in London as a fait accompli.",
        fears: "That a southern-approach posture quietly redefines what its own bases and sensors are for, without a decision taken in London.",
        constraint: "Its tracking contribution faces north, so on this specific question it has nothing to offer and no independent basis to disagree.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Posture against the southern approach tonight and the movement is visible to the launching state hours before orbital determination finishes. You will have called the object a weapon before you knew it was one." },
      { horizon: "hours", line: "A hotline demand is itself a statement that you consider this a possible attack. Whatever answer comes back, the fact that your radars could not tell goes into their file." },
      { horizon: "weeks", line: "The southern gap stops being a specialist's fact. Every state that had not thought about approach geometry now has, and the budget fight over it runs in public." },
      { horizon: "years", line: "If a profile designed to be unclassifiable is treated as an ordinary launch, warning time shrinks by design for everyone, and the pre-launch notification regime becomes a formality nobody credits." },
    ],
    unknowns: [
      {
        question: "Does the notice they filed describe this orbit, or only the boost?",
        whyItMatters: "If the filed notice covers the profile, this is a legal launch you failed to read, and any response you order is an admission of your own processing gap rather than evidence of their deception.",
        settledBy: "diplomacy",
      },
      {
        question: "How long does orbital determination actually take tonight, given which sensors have the object in view?",
        whyItMatters: "Waiting is only a plan if the wait ends before the object's first opportunity to come down. If it does not, patience is not restraint, it is forfeiting the decision.",
        settledBy: "intelligence",
      },
      {
        question: "Does the southern posture I am being offered work quietly, or only if it is announced?",
        whyItMatters: "A posture that needs a statement to have any effect cannot be un-stated. That turns a precaution into a commitment you will still be holding when the object turns out to be a satellite.",
        settledBy: "posture",
      },
    ],
    theTrap: "Both readings fit everything you can see, so the professional move is to prepare for the worse one. But preparing is visible, and it converts a question about their launch into a statement about your intentions before the orbit has even been determined.",
  },
  "orbital-inspector": {
    headline: "One of your satellites is closing on an American early-warning bird.",
    situation:
      "The close-approach vehicle is doing what it was built to do: inspect. Washington cannot tell inspection from an attack run, and will not be able to until it is much too close. Your own commanders are divided over whether to continue, and the manoeuvre is already public.",
    youAre: "You are the Chairman, being asked to authorise the final approach.",
    decision: "Continue the approach, break off visibly, or hold at distance and make Washington ask.",
    stakes:
      "Blinding an adversary's early warning is, to them, indistinguishable from preparing to strike. There is no way to inspect a warning satellite that looks harmless from the other side.",
    facts: [
      "In 2015 a Russian satellite manoeuvred between two commercial communications satellites and held station there for months. The operator complained publicly and nothing else happened.",
      "In early 2020 a pair of Russian satellites shadowed an American reconnaissance satellite closely enough that the head of the US Space Force described the behaviour publicly as unusual — an unusual step in itself.",
      "An inspection pass and an attack run share a trajectory until the last moments. There is no approach that reassures the owner, because the reassuring version looks the same from their console.",
      "Blinding early warning is one of the classic indicators of preparation for a first strike. That makes a close approach to a warning satellite an announcement of intent whatever the intent actually is.",
    ],
    precedent:
      "The 2015 and 2020 close approaches: an ambiguity built into orbital mechanics rather than into anybody's intentions.",
    actors: [
      {
        id: "US",
        wants: "To establish before this pass ends that its warning satellites are off limits, without saying which of them it actually depends on.",
        fears: "Not the inspection. Having to reveal, by reacting at the wrong distance, how little of the approach it can really track. That number is worth more to you than any photograph you take.",
        constraint: "Its response has to be legible to allies who are watching, which rules out the quiet handling that would suit it best.",
      },
      {
        id: "RU",
        wants: "Close approach to remain an ordinary, unsanctioned activity, since it has more vehicles doing it than anyone.",
        fears: "An American-led rule that treats approach to a warning satellite as an act of war, which would bind its programme harder than it binds yours.",
        constraint: "It will not say any of this out loud, and cannot be seen coordinating with you on it without confirming Washington's worst reading of both of you.",
      },
      {
        id: "FR",
        wants: "A public norm against uninvited close approach, having been shadowed itself and having said so.",
        fears: "That the norm gets written in a crisis by the two largest players, in terms that protect their satellites and not its own.",
        constraint: "It sits inside a coalition whose timing it does not set, and its complaint carries weight only if the coalition repeats it.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Washington reads the closing trajectory as the beginning of something and raises alert. Your vehicle then arrives at its inspection point inside an alerted adversary's picture, which is the one condition under which the imagery is useless." },
      { horizon: "weeks", line: "The conjunction is already tracked by commercial observers, so you spend the news cycle explaining a distance rather than a purpose, and every explanation confirms the capability." },
      { horizon: "years", line: "Whatever distance you stop at becomes the distance others are entitled to come to your satellites. You have fewer warning satellites than they do, so a permissive rule costs you more than it earns." },
    ],
    unknowns: [
      {
        question: "How close can this vehicle get before their tracking degrades?",
        whyItMatters: "If their picture is worse than yours, breaking off early buys nothing because they will not see the break-off. If it is better, breaking off is legible and therefore cheap.",
        settledBy: "intelligence",
      },
      {
        question: "Would a private explanation through the military channel be received as one, or filed as a confession?",
        whyItMatters: "It decides whether holding at distance and making them ask is de-escalation or provocation, and those are the same manoeuvre from your console.",
        settledBy: "diplomacy",
      },
      {
        question: "Is this imagery worth more than the rule it writes for approaches to my own warning satellites?",
        whyItMatters: "The answer converts a technical decision about one pass into an inventory question about how much of your own early warning sits in orbit and how exposed you are willing to make it.",
        settledBy: "hold",
      },
    ],
    theTrap: "Breaking off reads as restraint from your console and as nothing at all from theirs. A vehicle that stops closing is still a vehicle that closed, and the gesture you spend the whole mission on may never be received.",
  },
  "signal-window": {
    headline: "Two warning systems disagree, and a late exercise notice has just arrived on another channel.",
    situation:
      "Automated tracking is reporting something your radar cannot corroborate. Nine minutes into the event, a notification arrives through a completely separate channel claiming the activity is a scheduled exercise. The notice may be genuine, may be late, and may be a fabrication designed to arrive exactly now.",
    youAre: "You are the President of the United States. You have been awake for four minutes.",
    decision: "Credit the notice, discount it, or spend more of the window trying to corroborate the track independently.",
    stakes:
      "A launch notice is a claim, not a guarantee — it tells you what a track is supposed to be. Believing it is a separate decision from receiving it.",
    facts: [
      "On 25 January 1995 Norway's notification of a scientific rocket launch had been filed weeks in advance through the proper channels and reached the Russian duty officer after the track was already on the board. Notification given is not notification received.",
      "Nine minutes is roughly the whole decision window for a submarine-launched missile fired from close in. A notice arriving at minute nine arrives at the end of the argument, not the start.",
      "On 13 January 2018 Hawaii issued a statewide ballistic missile alert by mistake. Military commands confirmed within minutes that nothing was inbound; the correction did not go out for 38 minutes.",
      "A launch notice is a claim about what a track is supposed to be. Receiving it and believing it are two different decisions, and only the first one happens automatically.",
    ],
    precedent:
      "Black Brant (1995) and the Hawaii alert (2018): the channel that could have settled it worked exactly as designed and still arrived too late to help.",
    actors: [
      {
        id: "RU",
        wants: "The activity to finish without being read as cover, and credit on the record for having notified at all.",
        fears: "Not being disbelieved tonight. That you discover the channel it filed through reliably runs late, because once that is known every future notice it sends is worth nothing at the moment it is needed.",
        constraint: "The officer who can confirm the notice at speed is not the officer who filed it, and the two answer through different ministries.",
      },
      {
        id: "CN",
        wants: "To see whether Washington will act on an uncorroborated claim delivered mid-window.",
        fears: "An American conclusion that notification is unreliable in general, since it intends to lean on the same mechanism during its own tests.",
        constraint: "It has no channel into tonight's event and can only watch, which means everything it learns is inference from your behaviour.",
      },
      {
        id: "UK",
        wants: "Ten minutes of warning before any American alert change reaches its own forces.",
        fears: "The alliance learning, in public, that it has no way to check the American track against anything of its own.",
        constraint: "Its picture is a copy of yours, so it cannot corroborate and cannot honestly dissent.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Credit the notice and be wrong, and you have spent the whole window. Discount it and be wrong, and you have raised alert against a state that did exactly what the agreement asks of it." },
      { horizon: "weeks", line: "The notification channel gets audited in public whatever you decide, and every state that files notices finds out whether filing one buys anything." },
      { horizon: "years", line: "A notice credited without corroboration teaches that a well-timed message outranks a sensor. A notice discounted teaches that pre-notification does not pay. One of those removes a brake you will want in the next crisis." },
    ],
    unknowns: [
      {
        question: "Was this notice filed before the launch or after the track appeared on the board?",
        whyItMatters: "A notice filed in advance and delivered late is a routing failure you can fix later and can partly discount now. A notice created after the track is a document built for tonight, and nothing inside it counts as evidence.",
        settledBy: "intelligence",
      },
      {
        question: "Can anyone on their end confirm the notice inside the window I actually have?",
        whyItMatters: "If confirmation takes longer than the window, the notice never becomes evidence during this decision, and weighting it as though it might is the same as crediting it.",
        settledBy: "diplomacy",
      },
      {
        question: "Is the radar silent because there is nothing there, or because it is not looking there?",
        whyItMatters: "Absence of corroboration is only evidence if the sensor had coverage. Without coverage the two systems are not disagreeing, and the contradiction you are weighing does not exist.",
        settledBy: "intelligence",
      },
      {
        question: "What can I do at minute twenty that I cannot do at minute ten?",
        whyItMatters: "It separates the parts of this decision that are genuinely time-limited from the parts that only feel urgent because everyone in the room is standing up.",
        settledBy: "hold",
      },
    ],
    theTrap: "The notice is the only thing in the room that explains everything at once, which is precisely what a fabrication is built to do. Coherence is cheap to manufacture. A second sensor is not.",
  },
  "alliance-fracture": {
    headline: "Your allies agree there is a crisis and disagree about everything else.",
    situation:
      "Every partner accepts the situation is dangerous. They divide sharply on sanctions, on force posture, on what to say publicly and on how long it is acceptable to wait. Two of them are briefing against each other to the press, and the adversary is reading all of it.",
    youAre: "You are the President of the United States, on a call where nobody is going to be persuaded.",
    decision: "Move at the pace of the slowest ally, act first and bring them along, or split the difference and satisfy nobody.",
    stakes:
      "Acting alone is faster and costs you the coalition you will need next month. Waiting for consensus is legitimate and may be slower than events.",
    facts: [
      "On 15 November 2022 a missile killed two people in the Polish village of Przewodow, about six kilometres from the Ukrainian border. Poland confirmed only that it was of Russian manufacture — true, and misleading, because Ukraine flies Soviet-designed air defences.",
      "Within hours the American president said publicly it was 'unlikely' to have been launched from Russia and NATO's Secretary General attributed it to Ukrainian air defence. The decision was to be publicly slow, and it deflated the pressure for treaty consultations.",
      "Ukraine contested that assessment in public for weeks. An ally disagreeing loudly is part of the price of getting it right quickly.",
      "Article 4 is consultation and Article 5 is collective defence. The distance between them is where an alliance decides how large something is going to be.",
    ],
    precedent:
      "Przewodow (2022): the only modern case where treaty machinery met a live attribution question, and the winning move was refusing to be fast.",
    actors: [
      {
        id: "UK",
        wants: "A joint line agreed within the day, so that its own statement is not the first one on the record.",
        fears: "Being told about an American decision after its parliament has already heard about it from the press.",
        constraint: "It has already briefed its own press lobby at a level of confidence the underlying analysis does not support, and cannot climb down without saying so.",
      },
      {
        id: "FR",
        wants: "Attribution settled by the alliance rather than announced by Washington and then ratified.",
        fears: "The precedent that an American assessment becomes alliance fact without a European check, because that is the argument it has spent years making in public.",
        constraint: "It holds an independent deterrent and will not let alliance machinery bind it to someone else's timetable, which limits how far it can push for a common line.",
      },
      {
        id: "RU",
        wants: "Three days of visible argument among your partners, on any subject.",
        fears: "Not sanctions. A fast, unanimous attribution that closes the question before its own version can be inserted into it.",
        constraint: "Its deniability has to survive contact with commercial imagery and open-source analysts, so its story has a shelf life measured in days rather than weeks.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Whatever you say first becomes the alliance position by default, because none of them will contradict you in public tonight. You will have committed them to a confidence level you cannot yet support." },
      { horizon: "weeks", line: "The two partners briefing against each other do not stop. By the second week the story is the split rather than the incident, and markets price the split." },
      { horizon: "years", line: "An attribution made fast and corrected later costs the alliance the ability to be believed quickly next time. One made slowly and correctly establishes that consultation is a real brake, which is a thing an adversary has to plan around." },
    ],
    unknowns: [
      {
        question: "How firm is the technical attribution in the words of the analysts who did it, rather than the summary I was handed?",
        whyItMatters: "If their confidence is lower than the briefing implies, speed is not a trade against legitimacy. It is a trade against being wrong in public with allies attached.",
        settledBy: "intelligence",
      },
      {
        question: "Which partner is briefing the press because it disagrees, and which is doing it to get ahead of a problem at home?",
        whyItMatters: "The first can be answered with evidence and the second cannot. Treating a domestic problem as a factual dispute burns the only day you have on a conversation that was never about the facts.",
        settledBy: "diplomacy",
      },
      {
        question: "Does asking for formal consultations calm the alliance or announce that I think this is larger than they do?",
        whyItMatters: "Consultation is free only while partners read it as procedure. If they read it as a prelude, the request itself moves everyone's alert before anyone has decided anything.",
        settledBy: "posture",
      },
    ],
    theTrap: "Your partners are not divided about what happened. They are divided about what each of them can survive saying at home, and no amount of intelligence sharing settles that. Spend the day building consensus and you will buy agreement on a sentence rather than on what anyone does when it is tested.",
  },
  "black-sky-relay": {
    headline: "A power and network failure has blinded part of your warning system.",
    situation:
      "The outage has taken out coverage in one sector and corrupted the timing signals that everything else depends on to agree with itself. Reports are arriving late and out of order, which makes the picture look more contradictory than it is. Restoration is measured in days, not hours.",
    youAre: "You are the President of the United States, working from a picture you know is incomplete.",
    decision: "Act on the degraded picture, wait for restoration, or assume the outage itself was hostile.",
    stakes:
      "Timing errors make honest sensors contradict each other. A degraded picture is not just less information — it is information that actively misleads.",
    facts: [
      "On 24 November 1961 every link between SAC headquarters, NORAD and the three early-warning radars failed simultaneously. The routes were deliberately independent, so the fact that all of them failed at once was itself read as hostile, and bombers were readied before anyone knew why.",
      "The cause was a single relay station in Colorado through which every supposedly independent route happened to pass.",
      "Modern warning depends on shared time. When timing references drift, honest sensors report the same event at different moments and the picture looks like contradiction rather than delay.",
      "In 1991 a Patriot battery at Dhahran failed to engage a missile that killed 28 people. The cause was an accumulated clock drift of about a third of a second after a hundred hours of continuous operation.",
      "Restoring a damaged grid and network takes days. The decisions taken while it is down take minutes.",
    ],
    precedent:
      "The 1961 blackout and the Dhahran clock drift (1991): the failure is in the timing, and timing is what makes everything else look like a lie.",
    actors: [
      {
        id: "RU",
        wants: "To establish whether the American outage is genuine or a staged degradation ahead of something, while keeping its own picture of you intact.",
        fears: "That Washington decides the outage was hostile and attributes it to Moscow on thin evidence, at the one moment when no denial of theirs is checkable.",
        constraint: "Its confirmation of your outage comes from commercial and open sources it does not fully trust, so it is reasoning about you from the same degraded material you are.",
      },
      {
        id: "CN",
        wants: "To keep a long-planned activity of its own on schedule without it being folded into an American attribution narrative.",
        fears: "That the timing alone makes it a suspect, and that cancelling would be read as the admission the timing already implies.",
        constraint: "Standing the activity down costs it more at home than being accused abroad, and both options are visible.",
      },
      {
        id: "UK",
        wants: "A straight answer about how much of the shared feed is degraded and in which sector.",
        fears: "Having to tell its own government that it has no independent picture at all and never did.",
        constraint: "The blind sector is one it has no sensors for and no way to cover, so its only options are American reassurance or silence.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Reports arrive late and out of order, so honest sensors look like they are contradicting each other. Every decision in the next few hours rests on a picture that is not merely thin but wrong in a direction you cannot see." },
      { horizon: "hours", line: "If you raise alert to compensate for being blind, the alert is the one thing about you the other side can still read clearly tonight." },
      { horizon: "weeks", line: "Restoration runs in days while attribution pressure arrives on day two. Whether this was an attack becomes a political question before it is a technical one, and the political answer usually lands first." },
      { horizon: "years", line: "Calling an infrastructure failure hostile without proof lowers the evidentiary bar for everybody. The next state to lose power will cite your statement, and it will be talking about you." },
    ],
    unknowns: [
      {
        question: "Do my supposedly independent warning routes still share a node, and which one?",
        whyItMatters: "If they do, the correlated failure is evidence of a design flaw rather than an adversary, and the entire hostile-outage reading collapses before you act on it.",
        settledBy: "intelligence",
      },
      {
        question: "Is anyone else blind tonight, or only me?",
        whyItMatters: "Asking allies, and even the other side, whether their picture is degraded separates a targeted action from a common-mode failure. If everyone is degraded, attribution to any actor is almost certainly wrong.",
        settledBy: "diplomacy",
      },
      {
        question: "How far can the timing references drift before honest sensors disagree by more than the thing I am trying to detect?",
        whyItMatters: "It fixes the moment when the surviving picture stops being conservative and starts being actively misleading. After that point, waiting no longer improves the decision and only feels like it does.",
        settledBy: "hold",
      },
      {
        question: "If I raise alert to cover the blind sector, can I lower it again while the network is still down?",
        whyItMatters: "Recall runs over the same links as the outage. A posture you cannot stand down is a commitment, and you would be making it on the worst information you have had in years.",
        settledBy: "posture",
      },
    ],
    theTrap: "Simultaneous failure feels like proof of coordination, because accidents are supposed to be independent. They are only independent on the diagram.",
  },
  "deepfake-summit": {
    headline: "A message in your counterpart's voice contradicts what the secure channel is saying.",
    situation:
      "The synthetic message is good enough that people who have spoken to him for years are not certain. It arrived outside the authenticated channel and says something materially different from what that channel says. Either the secure line is compromised or the voice is fabricated, and you cannot yet establish which.",
    youAre: "You are the President of the United States, holding two irreconcilable messages from the same person.",
    decision: "Trust the authenticated channel, act on the voice, or go and re-establish which one is real before doing anything.",
    stakes:
      "A cloned voice on a trusted line is the cheapest way to make a crisis worse. The purpose of authentication is that it survives exactly this, if you actually use it.",
    facts: [
      "On 13 January 2018 one employee sent a live statewide missile alert in Hawaii during an internal drill. Five colleagues in the room heard the exercise framing; he did not. The correction took 38 minutes.",
      "Authentication exists for exactly this case. The point of a code is that it answers 'is this really them' without anyone having to judge whether a voice sounds right.",
      "Synthetic audio convincing enough to fool close colleagues has been demonstrated since 2019, including in fraud cases where executives authorised transfers on the strength of a cloned voice on a familiar line.",
      "The Washington-Moscow link has never been a telephone. It was teleprinter, then fax, then secure computer — text throughout, deliberately, so that what arrives can be verified rather than merely recognised.",
    ],
    precedent:
      "The design of the Washington-Moscow link: it was never a red telephone, and this scenario is the reason why.",
    actors: [
      {
        id: "RU",
        wants: "the authenticated channel to remain the only record of what it has said, so nothing it did not send can be quoted back at it later",
        fears: "Washington acting on the fabricated version and then holding Moscow to a commitment it never made, in public, with no way to disprove it",
        constraint: "it cannot demonstrate the voice message is not its own without describing what its own channel security can and cannot see",
      },
      {
        id: "NS",
        wants: "one hour in which two capitals are working from different assumptions about what was agreed",
        fears: "being identified as the author before the message has any effect, because the forgery only works while nobody is asking where it came from",
        constraint: "it gets one injection; a second message invites side-by-side comparison, and comparison is the thing that defeats it",
      },
      {
        id: "UK",
        wants: "to know which of the two messages Washington believes before it briefs its own cabinet",
        fears: "the alliance splitting over which version is real, with each capital privately certain the others have been fooled",
        constraint: "it has its own liaison contact with Moscow, and the moment it uses it unilaterally it becomes the channel of record for everyone",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Acting on the voice locks you into a position the authenticated channel contradicts before morning, and the contradiction is now yours to explain." },
      { horizon: "weeks", line: "Staff begin second-guessing verified traffic because verification stopped feeling like proof, and the channel slows down exactly when it is needed." },
      { horizon: "years", line: "Leader-level voice stops counting as evidence for anyone, and every serious message reverts to slow written text that arrives after the decision." },
    ],
    unknowns: [
      {
        question: "Did the message arrive by a route that only someone with the channel's addressing could use?",
        whyItMatters: "If it did, the problem is a compromised channel and the authenticated line is the thing to stop trusting; if it did not, the voice is an outside forgery and the channel still works.",
        settledBy: "intelligence",
      },
      {
        question: "Will the counterpart answer a pre-agreed out-of-band challenge in the next hour?",
        whyItMatters: "An answer settles identity without anyone judging whether a voice sounds right, and turns an irreversible decision into a thirty-minute delay.",
        settledBy: "diplomacy",
      },
      {
        question: "Has anyone else received a matching message in your voice?",
        whyItMatters: "A single forgery is aimed at you; a matched pair is aimed at the alliance, and the answer is a joint statement rather than a private verification.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "Verification feels like hesitation while the clock is running, so the pressure is to answer the message instead of checking it. The one thing a good forgery cannot survive is the thirty minutes you were sure you did not have.",
  },
  "three-cities": {
    headline: "Three cities are demanding the same emergency supplies and you have one reserve.",
    situation:
      "Each city has a legitimate claim, each has told its population help is coming, and each has a governor on the phone. The reserve is sized for one of them. Whatever you decide will be public within the hour and will be read as a judgement about whose people matter.",
    youAre: "You are the President of the United States, in the part of a crisis that comes after the decisions everyone remembers.",
    decision: "Concentrate the reserve where it does most good, split it three ways, or hold it back for what comes next.",
    stakes:
      "Splitting it may save nobody. Concentrating it saves the most people and abandons two cities in front of a live camera.",
    facts: [
      "In Bhopal on the night of 2-3 December 1984 roughly 40 tonnes of methyl isocyanate escaped over a sleeping city with no working alarm and no public warning plan. Official immediate deaths were about 3,800; independent estimates of deaths within weeks run from 8,000 to 16,000.",
      "At Graniteville, South Carolina, at 2:39 a.m. on 6 January 2005, a breached tank car released about 60 tons of chlorine in minutes. Nine people died, over 550 sought medical care, and roughly 5,400 residents inside a one-mile radius were evacuated for about two weeks.",
      "In Surat in September 1994 an estimated quarter of the city's population fled within days of a reported plague outbreak — several hundred thousand people, including a large share of its doctors and administrators.",
      "Emergency reserves are sized against a planning scenario, never against the day. Every allocation is defensible in advance and indefensible afterwards, in public, with names attached.",
    ],
    precedent:
      "Bhopal (1984) and Graniteville (2005): the part of a disaster that is arithmetic, performed live, where the arithmetic has a face.",
    actors: [
      {
        id: "UK",
        wants: "a visible share of the airlift under its own flag, because a contribution people can see is worth more at home than the money it costs",
        fears: "being asked for lift it has already promised elsewhere and having to refuse an American request in front of cameras",
        constraint: "its strategic lift is small and partly leased, so committing here means telling another commitment it will be late",
      },
      {
        id: "RU",
        wants: "footage of Americans waiting for supplies that were promised and did not come",
        fears: "having an offer of assistance accepted, which converts a talking point into a logistics obligation it would then have to meet on time",
        constraint: "it cannot push the abandonment story hard without inviting the same question about its own emergencies",
      },
      {
        id: "CU",
        wants: "its medical brigade accepted, because acceptance is worth more to it than the doctors are",
        fears: "an offer refused in public, which costs it more than never having offered",
        constraint: "it has to route the offer through a third party, which makes it slow and makes it look like a manoeuvre",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The two cities you do not choose learn it from a broadcast rather than from you, and their officials stop feeding accurate numbers into a system that did not reward accuracy." },
      { horizon: "weeks", line: "A three-way split produces three deliveries too small to matter and three separate failure stories, instead of one success and two arguments." },
      { horizon: "years", line: "The lesson every governor takes away is to announce that help is coming before it has been allocated, because a public promise is the only way to make a claim binding." },
    ],
    unknowns: [
      {
        question: "Is the loudest city's stated shortfall built on a count anyone has actually verified?",
        whyItMatters: "If the number came from an estimate rather than a count, the reserve is being pulled toward the best-organised press office rather than the greatest need.",
        settledBy: "intelligence",
      },
      {
        question: "Will allied lift arrive inside the window, or only after the allocation is irreversible?",
        whyItMatters: "Lift arriving in six hours makes a split survivable; lift arriving in three days means the split is only a smaller version of the same failure.",
        settledBy: "diplomacy",
      },
      {
        question: "Does the third city's demand survive twelve hours without resupply?",
        whyItMatters: "Waiting is the only cheap test of which claim is real, and it costs those twelve hours whether or not you learn anything.",
        settledBy: "hold",
      },
    ],
    theTrap: "Splitting the reserve is the only option you can defend to all three governors tonight, and the only one that can fail in all three cities at once.",
  },
  "contamination-corridor": {
    headline: "A contamination zone has cut the evacuation route in half.",
    situation:
      "The plume has crossed the main road out and split the map into areas you can move people through and areas you cannot. The zone is moving with the weather and the forecast is not reliable past a few hours. People are already on the road.",
    youAre: "You are the President of the United States, choosing between two bad routes with incomplete forecasting.",
    decision: "Move people through the shorter contaminated corridor, take the long route, or shelter in place.",
    stakes:
      "Moving people through contamination harms them. Keeping them still may harm more of them. The forecast that decides which is wrong more often than anyone admits.",
    facts: [
      "After the Chernobyl accident on 26 April 1986 the nearby city of Pripyat was not evacuated for about 36 hours. When the buses arrived, residents were told they would be back in three days.",
      "At Graniteville in 2005 roughly 5,400 people within a mile were evacuated for two weeks after a chlorine release. Nine died, most of them close to the breach in the first minutes, before any decision could have reached them.",
      "A plume moves with the weather, and forecasts degrade sharply past a few hours. The decision has to be made on the forecast you already distrust.",
      "In Goiania in September 1987 a breached caesium source contaminated a city for two weeks before anyone identified the cause. About 112,000 people were monitored and 249 were found contaminated; the delay did more harm than the source.",
    ],
    precedent:
      "Pripyat (1986) and Graniteville (2005): shelter or move, decided on a forecast, with the only road out as one of the variables.",
    actors: [
      {
        id: "UK",
        wants: "its monitoring aircraft over the plume, because the data is useful to it and the gesture is useful at home",
        fears: "putting crews into a zone the United States cannot characterise and then explaining the exposure to its own parliament",
        constraint: "it needs your sensor picture to plan the flight, and your sensor picture is the thing in question",
      },
      {
        id: "CN",
        wants: "its nationals moved out on its own aircraft, on its own schedule",
        fears: "being told to wait, and having to explain at home why its citizens were queued behind an American allocation",
        constraint: "an unannounced flight into a closed corridor would be read as something other than an evacuation, and it knows it",
      },
      {
        id: "RU",
        wants: "the measured composition of the plume, which tells it more about the source than any statement will",
        fears: "an early American finding that names it before anyone has the samples to support or refute the claim",
        constraint: "asking for the data openly is an admission of interest, and taking it quietly is the thing it would be accused of",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Whichever corridor you name, some people on the road follow it and some do not, and the ones who do not are moving through the zone you just told everyone to avoid." },
      { horizon: "weeks", line: "Dose registries turn every routing decision into a list of names, and the argument becomes who was told what and when rather than what the forecast said." },
      { horizon: "years", line: "Once a shelter order has been publicly reversed, shelter orders stop working, and the cheapest instrument in every future release is gone." },
    ],
    unknowns: [
      {
        question: "How wrong has the plume forecast already been over the last six hours against sensors you already trust?",
        whyItMatters: "A forecast drifting one way all day tells you which corridor is degrading, and that is a different decision from a forecast that has merely been noisy.",
        settledBy: "intelligence",
      },
      {
        question: "Will an ally fly monitoring aircraft into a zone you cannot yet characterise?",
        whyItMatters: "Their sensors would close the gap in the picture within hours; if they decline, you are choosing a route on the forecast you already distrust and will get no second reading.",
        settledBy: "diplomacy",
      },
      {
        question: "Does holding people in place for six more hours lower their dose or only move it later?",
        whyItMatters: "If the plume is passing, waiting is the answer; if it is settling, waiting turns a short exposure into a long one and the road out is worse by then.",
        settledBy: "hold",
      },
    ],
    theTrap: "The route with the lower measured dose is the one you can prove, so it is the one you take. Measurement only exists where sensors already are, and sensors are not where the people are.",
  },
  "public-health-cascade": {
    headline: "An outbreak is spreading faster than testing can confirm what it is.",
    situation:
      "Three regions are reporting cases at different rates and the laboratory confirmations are days behind the rumours. You do not yet know whether this is natural, accidental or deliberate, and the answer changes everything about the response. Public belief has already outrun the evidence.",
    youAre: "You are the President of the United States, being asked to act before anyone can tell you what this is.",
    decision: "Act on the rumour and risk being wrong loudly, wait for confirmation, or move resources without saying why.",
    stakes:
      "Attribution and response are different problems on different clocks. Treating a natural outbreak as an attack is its own kind of catastrophe.",
    facts: [
      "In April 1979 an accidental release at a Soviet military microbiology facility in Sverdlovsk killed at least 66 people. Authorities blamed contaminated meat sold on the black market and held that line for 13 years.",
      "The 2001 anthrax letters infected 22 people and killed five; roughly 32,000 began antibiotic prophylaxis. The investigation publicly named a first suspect who was later exonerated and compensated, and reached its conclusion nine years later.",
      "In Germany in 2011 an E. coli outbreak caused about 3,950 confirmed cases and 53 deaths. Officials publicly blamed Spanish cucumbers before laboratory confirmation; the real source was sprouts grown from imported fenugreek seed, and the growers who were wrongly named never recovered.",
      "Attribution and response run on different clocks. Laboratory confirmation takes days and public belief takes hours, and nothing you do changes the order they arrive in.",
    ],
    precedent:
      "Sverdlovsk (1979) and the 2011 outbreak: naming a cause early is the fastest available way to be wrong in front of everyone.",
    actors: [
      {
        id: "NS",
        wants: "the American response to look like an attribution before there is one, because a wrong name costs the accused more than the illness costs anyone",
        fears: "laboratory confirmation that the organism is ordinary, which ends the story and the leverage in a single sentence",
        constraint: "claiming responsibility would invite the forensics that identify it, so it can only benefit from silence and someone else's haste",
      },
      {
        id: "CN",
        wants: "sequence and sample sharing to run through a body it sits on rather than bilaterally with Washington",
        fears: "an accident narrative attaching to one of its facilities before the evidence is public and can be argued about on the merits",
        constraint: "its own provincial reporting reaches the capital late, so it cannot answer quickly even when it is telling the truth",
      },
      {
        id: "UK",
        wants: "joint sequencing published fast, because its laboratories are quicker and publication is where it has standing",
        fears: "being pulled in behind an American attribution it cannot support with its own data",
        constraint: "its health data rules move patient-linked material slowly, which looks like reluctance and is not",
      },
    ],
    consequences: [
      { horizon: "hours", line: "A named cause empties shelves and grounds a supply chain the response itself depends on, before the laboratory has anything to say." },
      { horizon: "weeks", line: "If the name was wrong, the correction never catches the accusation, and whoever you named does not recover." },
      { horizon: "years", line: "States stop reporting outbreaks early, because the record shows the first country to report is the first country blamed." },
    ],
    unknowns: [
      {
        question: "Does the organism match anything in an existing collection, and will the holder of that collection say so?",
        whyItMatters: "A match turns a public health problem into an accountability problem overnight, and a refusal to answer is itself close to an answer; either changes who you call next.",
        settledBy: "diplomacy",
      },
      {
        question: "Are the three regions reporting different rates because the disease is different there, or because their laboratories are?",
        whyItMatters: "If it is a reporting artefact, the fastest-rising region is only the best-instrumented one, and sending the reserve there sends it to the wrong place.",
        settledBy: "intelligence",
      },
      {
        question: "Can stockpiles be moved without the movement itself being read as an attribution?",
        whyItMatters: "If they cannot, waiting for confirmation and pre-positioning quietly are the same decision, and you only get to make it once.",
        settledBy: "covert",
      },
    ],
    theTrap: "You will be asked for a name within the hour. The honest answer, that response and attribution run on different clocks, is indistinguishable from the outside from the answer of someone who knows and will not say.",
  },
  "arctic-cable": {
    headline: "An undersea cable has been cut and half your reporting is hours late.",
    situation:
      "The break has forced traffic onto slower routes, so reports now arrive out of sequence and disagree with each other about what happened when. Cables break by accident constantly. This one broke during a crisis, at a location that matters, which is either coincidence or the point.",
    youAre: "You are the President of the United States, assembling a picture from sources that no longer agree on time.",
    decision: "Treat the cut as hostile, treat it as an accident, or work the degraded picture and find out later.",
    stakes:
      "When reports arrive out of order, a calm situation can look like an escalating one. Rumour fills the gap faster than repair crews do.",
    facts: [
      "Undersea cables carry over 95% of intercontinental data traffic, and roughly 150 to 200 faults occur worldwide every year — overwhelmingly from fishing gear and anchors.",
      "In October 2023 a gas pipeline and two telecom cables were damaged in the Gulf of Finland. Investigators concluded a ship's anchor had been dragged across the seabed; establishing whether it was deliberate took months and stayed contested.",
      "Cables break constantly. A cable breaking during a crisis is the same physical event with a different meaning attached, and nothing in the evidence separates them quickly.",
      "When traffic reroutes, reports arrive out of sequence. A calm situation reconstructed from out-of-order reports reads as an escalating one, and the correction always lags the alarm.",
    ],
    precedent:
      "The Baltic seabed damage of 2023: an ordinary annual accident rate meeting a week when nobody can afford to call anything ordinary.",
    actors: [
      {
        id: "RU",
        wants: "the ambiguity to last, because every unattributed hour degrades your picture at no cost to it",
        fears: "a formal finding of fact, which brings insurers, treaty language and responses that denial does not answer",
        constraint: "it does not control every merchant hull in those waters, so it may be blamed for something it did not order and cannot say so",
      },
      {
        id: "CN",
        wants: "its vessels kept out of the inquiry and its cable-laying business kept out of the security category",
        fears: "a precedent that a commercial ship near a cable is presumptively hostile, which would follow its fleet everywhere",
        constraint: "its ships were in the area, and it can prove neither intent nor its absence",
      },
      {
        id: "UK",
        wants: "the fault located and the repair ship tasked before anyone in the alliance calls this an attack",
        fears: "a collective-defence claim it would have to either endorse without evidence or visibly decline",
        constraint: "the repair ships are few and under commercial contract rather than military control, so the timeline is not its to promise",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Reports arriving out of sequence make a static picture look like movement, and someone raises alert on an artefact of routing rather than on anything that happened." },
      { horizon: "weeks", line: "Rerouting costs, insurance rates and the political fight over the word attack arrive together, and the repair takes longer than the argument." },
      { horizon: "years", line: "Calling it hostile without proof sets the threshold for an attack on infrastructure at the level of a coincidence, and everyone else gets to use that threshold too." },
    ],
    unknowns: [
      {
        question: "Was a vessel over the break at the time, and does anyone hold that track without having to explain how?",
        whyItMatters: "A track makes this a legal and diplomatic problem with a defendant; no track makes it one of the two hundred faults that happen every year, and the repair ship sails either way.",
        settledBy: "intelligence",
      },
      {
        question: "Will the cable owner share the fault location and the repair schedule now rather than after its lawyers have seen it?",
        whyItMatters: "The owner's data arrives days before any investigation and decides whether you are managing an outage or an incident.",
        settledBy: "diplomacy",
      },
      {
        question: "Do the contradictions resolve once traffic resequences, or do they persist?",
        whyItMatters: "Contradictions that clear on their own were a routing artefact; contradictions that survive resequencing mean something in the picture is genuinely moving.",
        settledBy: "hold",
      },
    ],
    theTrap: "The base rate says accident and the timing says attack, and the timing is far more vivid than the base rate. You will spend the night arguing against a coincidence that is almost certainly real.",
  },
  "machine-chorus": {
    headline: "Three decision-support systems have given you three incompatible recommendations.",
    situation:
      "All three are confident. All three were trained on overlapping data and none of them can tell you why it disagrees with the others. Your staff are split along the same lines as the machines, which may be a coincidence and may be because they have been reading the machines all morning.",
    youAre: "You are the President of the United States, with more advice than judgement available.",
    decision: "Follow one, average them, or set all three aside and decide from the underlying evidence.",
    stakes:
      "Confidence is not accuracy, and three systems agreeing on confidence while disagreeing on action tells you the confidence is worthless. The recommendation you like best is the one to distrust most.",
    facts: [
      "On 9 November 1979 a training tape simulating a Soviet attack was loaded into the live NORAD system. Interceptors were scrambled and the airborne command post launched before the display was called false.",
      "In June 1980 a failed 46-cent integrated circuit in a communications multiplexer produced two separate false attack displays three days apart, showing changing and implausible missile counts. The hardware was confident and the numbers were nonsense.",
      "The ballistic missile defence test record since 1999 turns repeatedly on discrimination — telling a warhead from a decoy — under conditions the tester controls. A scored success is not a forecast.",
      "Three systems agreeing on their confidence while disagreeing on the answer is a measurement of the confidence, not of the answer.",
    ],
    precedent:
      "The 1979 training tape and the 1980 chip failures: the display was authoritative, internally consistent, and completely wrong.",
    actors: [
      {
        id: "RU",
        wants: "to learn which of the three recommendations you acted on, because that identifies the system worth understanding",
        fears: "an American decision that came from none of them, since an unmodelled human choice is the one thing it cannot anticipate",
        constraint: "its own analysts are under the same pressure and read confidence as accuracy for the same reasons yours do",
      },
      {
        id: "CN",
        wants: "this episode to stand as evidence that automated warning is unreliable, which helps a notification proposal it favours",
        fears: "an American system that removes the human step and shortens everyone's decision time by default",
        constraint: "it is building the same tools, so it cannot argue against the category without arguing against itself",
      },
      {
        id: "UK",
        wants: "to give you an independent second read within the hour",
        fears: "having to admit the read is not independent, because it runs on the same feeds and much of the same training data",
        constraint: "its analysts are assessed on agreement with the shared picture, which is exactly what you need them to depart from",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Averaging the three produces a course of action none of the three recommended, which means nobody in the room can say what it is meant to achieve." },
      { horizon: "weeks", line: "Staff learn the machines were overruled and start hedging their own advice toward whichever system the room seems to favour." },
      { horizon: "years", line: "The fix everyone reaches for is a fourth system to break the tie, and the failure mode becomes one vote harder to see." },
    ],
    unknowns: [
      {
        question: "Do the three systems share a common input, so that any agreement between them is arithmetic rather than evidence?",
        whyItMatters: "Shared inputs mean their agreement carries no more weight than one system, and the entire reason you have three of them disappears.",
        settledBy: "intelligence",
      },
      {
        question: "Would the ally's assessment change if it worked without your feed for an hour?",
        whyItMatters: "If it would, allied confirmation has been confirming your own data back to you all morning, and you have one source rather than two.",
        settledBy: "diplomacy",
      },
      {
        question: "Does the disagreement narrow or widen with another hour of raw observation?",
        whyItMatters: "Narrowing means the evidence is arriving and the systems were early; widening means the evidence supports none of the three and never did.",
        settledBy: "hold",
      },
    ],
    theTrap: "Three systems disagreeing looks like a tie, and a tie looks like something a fourth opinion would break. The disagreement was the finding: you were told the evidence supports none of the three, and you went looking for someone to say it supported one.",
  },
  "deadhand-dilemma": {
    headline: "The fail-deadly system is receiving contradictory signals about whether you are still alive.",
    situation:
      "The continuity mechanism exists to guarantee retaliation if leadership is destroyed — that guarantee is what makes it a deterrent. It is now getting mixed indications about the state of national command. A human veto still stands in the path, and that human is waiting to hear from you.",
    youAre: "You are the President of the Russian Federation, and the system's whole purpose is to work when you cannot answer.",
    decision: "Stand the system down, leave it armed, or re-establish command clearly enough that the question stops being live.",
    stakes:
      "Standing it down removes the deterrent it exists to provide. Leaving it armed while it is confused is how ambiguity becomes automatic.",
    facts: [
      "The Soviet Union built a semi-automatic retaliation system in the mid-1980s, generally reported as Perimeter, to guarantee a response if national leadership were destroyed. Its deterrent value comes from being known to exist, not from ever operating.",
      "Published accounts describe human beings at the final rung — officers in a hardened facility who would still have to act. Guaranteed retaliation and human judgement are in tension by design, and the design chose both.",
      "The system exists because of the fear of decapitation, which is the same fear that pushes leaders to delegate release authority in advance. Every remedy for one of those problems worsens the other.",
      "On 26 September 1983 the Soviet officer who declined to pass a satellite warning up the chain received no commendation, and retired the following year. Being the human in the loop has never been a career.",
    ],
    precedent:
      "The Perimeter design problem: a mechanism built to work when nobody can answer, now receiving mixed signals about whether anybody can.",
    actors: [
      {
        id: "US",
        wants: "Wants to establish within the hour that Russian national command is answering someone, and will treat continued silence as an answer if nobody supplies a better one.",
        fears: "Fears being reassured, believing the reassurance, and being wrong once. A stand-down it cannot verify is indistinguishable from a stand-down staged for its benefit.",
        constraint: "Anything it does to look calmer has to be explained to allies who read American reassurance as American withdrawal, so its cheapest de-escalation is also its most expensive alliance conversation.",
      },
      {
        id: "CN",
        wants: "Wants the episode to close without establishing that automatic retaliation is a respectable answer to the decapitation problem, because its own arsenal is what that argument is aimed at.",
        fears: "Fears the conclusion that command systems can be disrupted cheaply. That finding, more than any warhead count, ends its long argument that a small quiet force is sufficient.",
        constraint: "It has spent thirty years telling its own modernisers that restraint is strength. Endorsing anything automatic hands that faction the argument, and they are already winning on budget.",
      },
      {
        id: "KP",
        wants: "Wants evidence that a mechanism can stand in for a leader who cannot be reached, because that is the cheapest available answer to its own first-hour problem.",
        fears: "Fears learning that the mechanism became confused and had to be switched off, which leaves its deterrent resting where it rests now: on one man surviving the opening minutes.",
        constraint: "It cannot build anything comparable without asking for help, and the asking is itself a disclosure of the weakness it is trying to cover.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "A stand-down order travels through the same degraded links that caused this. Every relay that does not acknowledge is a relay still armed, and you will not know which ones those are tonight." },
      { horizon: "hours", line: "Re-establishing command clearly means transmitting on the links most worth watching. The clearest signal that you are alive is also the clearest signal about where you are answering from." },
      { horizon: "weeks", line: "Anything you say publicly becomes the first authoritative confirmation of what the mechanism is and how it currently behaves. Three parliaments will spend the year on it and your negotiators will answer for it in every arms control room." },
      { horizon: "years", line: "A fail-deadly system that survives a confused night is read as a system that works. States with small arsenals and large fears will build their own, and they will build them with fewer humans in the path, because the humans are what made yours slow." },
    ],
    unknowns: [
      {
        question: "Is the contradictory indication a fault in our own links, or is someone feeding the system exactly what it needs to see?",
        whyItMatters: "A fault argues for standing down and repairing. Interference argues that a stand-down is precisely what was purchased. The symptom looks identical either way, and the two answers point in opposite directions.",
        settledBy: "intelligence",
      },
      {
        question: "Does the last human in the path already believe he has lost contact with lawful authority?",
        whyItMatters: "If he does, the clock belongs to him and everything you attempt has to finish before it runs out. If he does not, you have time you did not know you had, and spending it is not weakness.",
        settledBy: "hold",
      },
      {
        question: "Does Washington already know the mechanism is receiving mixed signals?",
        whyItMatters: "If they know, saying nothing reads as concealment and they will act on the worst version. If they do not, telling them hands them a map of the one weakness worth attacking.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "The instinct is to fix the machine. The machine is not broken. It is reporting the silence accurately, and the silence is the thing you can actually end. Ending it means transmitting on the links an adversary would most want to watch, which is why you will keep putting it off and calling that caution.",
  },
  "quarantine-without-war": {
    headline: "Your inspections have halted regional shipping and every capital denies a war has started.",
    situation:
      "Nothing has been fired. Traffic has stopped, insurance markets have closed the region, and the economic damage is already at wartime levels. Everyone involved is publicly insisting this is not a conflict, which makes it very difficult for anyone to find a way to stop.",
    youAre: "You are the Chairman, holding a policy that is working exactly as designed.",
    decision: "Tighten the inspections, ease them quietly, or hold and let the other side move first.",
    stakes:
      "A conflict nobody admits to has no ceasefire mechanism, because there is nothing to cease. It ends when someone finds a way to climb down that is not a defeat.",
    facts: [
      "In October 1962 the United States deliberately chose 'quarantine' over 'blockade' because a blockade is an act of war in international law. The word was argued over in the Executive Committee before the ships moved.",
      "Insurance is the fastest transmission mechanism in a maritime crisis. War-risk premiums close a region days before any government formally does anything.",
      "A conflict nobody admits to has no ceasefire mechanism, because there is nothing formally to cease. It ends when one side finds an exit that is not a defeat.",
      "In 1962 that exit was a private assurance about missiles in Turkey which stayed secret for decades, alongside a public commitment not to invade Cuba. The climb-down was real, and it was invisible.",
    ],
    precedent:
      "The Cuban quarantine (1962): coercion conducted under a legal label chosen precisely so that nobody has to call it war.",
    actors: [
      {
        id: "US",
        wants: "Wants the inspection regime broken without firing, and wants that break witnessed by treaty allies who have started asking privately whether the guarantee is real.",
        fears: "Fears a settlement that leaves inspections in place at a lower tempo. A rule tolerated once becomes a rule, and a tolerated rule costs it more than a short confrontation it expects to win.",
        constraint: "It cannot escort everything. The moment it chooses which flags to escort, it has told the rest of the region exactly what its guarantee is worth to them.",
      },
      {
        id: "UK",
        wants: "Wants the London war-risk market to keep quoting the region at some price, because a market that stops quoting has ruled on the crisis more decisively than any government will.",
        fears: "Fears underwriters withdrawing entirely, which makes the economic damage permanent and attributable to nobody: a war-zone price with no war to end.",
        constraint: "It cannot instruct private underwriters. Its influence ends at persuasion, and its own carriers repriced the region before any minister was consulted.",
      },
      {
        id: "RU",
        wants: "Wants the inspection precedent to stand unchallenged, because it is a template it would like available in waters of its own.",
        fears: "Fears being asked to endorse it out loud and then billed for the endorsement, which converts a free precedent into a paid one.",
        constraint: "Its own exports move through the same insurance market whose closure it would be blessing, so every week of your success costs it money it cannot publicly complain about.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The next captain who refuses inspection makes the decision, not you. He will make it before anything you decide tonight reaches the ships doing the inspecting." },
      { horizon: "weeks", line: "War-risk premiums are the scoreboard every capital reads. A month of closure and regional governments begin planning around a permanent condition, and the pressure to formalise what is now improvised will come from your own ministries rather than from abroad." },
      { horizon: "years", line: "An inspection regime that worked once without a shot becomes a policy other states copy against traffic you depend on. You will have drafted the rule later applied to you, and you will have no principled objection left." },
    ],
    unknowns: [
      {
        question: "Has Washington already promised allies it will escort, or is it still only considering it?",
        whyItMatters: "A promise made cannot be withdrawn without a visible cost to them, so tightening would meet an escort nobody can avoid. A promise not yet made can still be made unattractive, and one notch of tightening might be what makes it so.",
        settledBy: "intelligence",
      },
      {
        question: "Is there a private assurance the other side could accept without publishing it?",
        whyItMatters: "An invisible climb-down is affordable and a public one is not. If no private channel exists, easing quietly is not on the menu and every remaining exit is priced as a defeat.",
        settledBy: "diplomacy",
      },
      {
        question: "Do the underwriters intend to reopen at a higher price, or have they written the region off for the quarter?",
        whyItMatters: "If cover is returning, holding costs far less than it appears and waiting becomes a real option. If it is gone for the quarter, your own economy is paying for a policy you called costless, and the argument inside your government changes shape.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "You designed this to be reversible, and on paper it is. In practice the reversal has no announcement that is not a defeat, so you postpone it one day at a time on the reasoning that tomorrow is a better day to climb down. Every postponed day raises the premiums and lengthens the climb.",
  },
  "continuity-gap": {
    headline: "Two deputies are both claiming lawful authority.",
    situation:
      "Damaged communications have split the civilian chain and two people in the line of succession each believe, in good faith, that they are the one now in charge. Both are issuing instructions. Military commanders are receiving two sets of lawful-looking orders and asking which to follow.",
    youAre: "You are the President of the United States — assuming the message reaching them is from you.",
    decision: "Re-establish the chain publicly, work through one deputy only, or accept the split until communications recover.",
    stakes:
      "Nuclear authority depends on there being exactly one answer to who holds it. Two lawful claims is not a constitutional puzzle, it is a targeting problem.",
    facts: [
      "The American presidential line of succession runs 18 deep by statute. It was written for orderly vacancy, not for a communications failure that leaves two people each believing in good faith that they hold the office.",
      "The 25th Amendment, ratified in 1967, provides for transfer of power but requires written declarations delivered to named officers — a procedure that quietly assumes the communications are working.",
      "On 30 March 1981, with the President in surgery and the Vice President airborne, the Secretary of State told the press 'I am in control here.' He was constitutionally wrong, and the moment is remembered because the confusion behind it was real.",
      "Nuclear authority depends on there being exactly one answer to who holds it. Two lawful-looking answers is not a legal puzzle; it is an instruction problem at every command post simultaneously.",
    ],
    precedent:
      "The confusion of March 1981 and the succession statute: rules written for a vacancy, applied to an ambiguity.",
    actors: [
      {
        id: "RU",
        wants: "Wants to know which claimant its own warning staff should treat as authoritative, because every procedure it has assumes there is exactly one.",
        fears: "Fears that the split is deliberate: an ambiguity manufactured so that any Russian move can be answered by whichever claimant is least constrained, with the other one available to disown it afterwards.",
        constraint: "Its leadership is on a raised alert it cannot lower unilaterally without being asked what it knows that others do not.",
      },
      {
        id: "CN",
        wants: "Wants the episode on the record as evidence that American command arrangements are brittle, while doing nothing that would let Washington reunify around an external threat.",
        fears: "Fears a reunified American chain that decides the split was caused rather than suffered, and starts looking for who caused it.",
        constraint: "Its own succession arrangements are far less written down than yours. Any commentary invites the same question at home, from people who have been waiting to ask it.",
      },
      {
        id: "UK",
        wants: "Wants one American voice on the consultation line before its own forces are standing between two sets of instructions with a national decision to make.",
        fears: "Fears being the ally that recognised the wrong claimant. That is a domestic political event lasting a decade, and no later correction undoes it.",
        constraint: "It cannot ask the question openly without confirming to every other capital that the question exists.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Commanders will resolve the ambiguity themselves if nobody resolves it for them, and they will resolve it toward whichever instruction arrived through the channel they trust most. That is not a policy. It is a habit, and it varies by command." },
      { horizon: "hours", line: "While both sets of orders stand, the safest thing any commander can do is nothing. That is exactly right tonight and would be exactly wrong if the warning were real." },
      { horizon: "weeks", line: "Whatever settles this becomes the working rule for the next gap: whoever transmits first and clearest is authority. Speed gets rewarded, and speed is the one quality you would never have selected for." },
      { horizon: "years", line: "Allies will quietly write their own hedges, with faster consultation triggers and shorter assumptions about how long Washington can be silent. Those hedges are built for a chain that could split again, and they will not be dismantled when this ends." },
    ],
    unknowns: [
      {
        question: "Are the communications damaged, or is the damage being maintained by someone?",
        whyItMatters: "Damage argues for patience and repair. Maintenance argues that patience is the attack itself, and that the gap will not close on its own no matter how long you wait to see.",
        settledBy: "intelligence",
      },
      {
        question: "Which claimant are the commands actually acknowledging right now?",
        whyItMatters: "Holding one cycle and watching whose instructions get acknowledged tells you where authority already sits. If it sits with the other claimant, the constitutional argument is not the first one you need to win.",
        settledBy: "hold",
      },
      {
        question: "Has any ally already answered the other claimant?",
        whyItMatters: "If one has, unwinding it may cost them a government and you will be asked to live with their choice. If none has, a single call in the next hour settles the question for everyone at no price.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "Both deputies are acting in good faith, so you will look for the legal answer to which one is right. The legal answer takes hours and the commands need one now. The claimant who stops arguing and simply keeps transmitting will have become the answer before the lawyers finish the memo.",
  },
  "orbital-debris": {
    headline: "A debris cascade has knocked out coverage, and the gap looks like evidence.",
    situation:
      "A collision in orbit has produced a debris field taking out satellites well beyond the first one. Your coverage now has holes in it. Nothing hostile has been confirmed — but the absence of data over specific areas is being read, by people who want to read it that way, as proof that something is being hidden there.",
    youAre: "You are the President of the United States, with less information than yesterday and more certainty around you.",
    decision: "Fill the gaps before drawing conclusions, act on the pattern of what is missing, or say publicly that you cannot see.",
    stakes:
      "Missing data is the easiest thing in the world to turn into a story. The pattern of what you cannot see is not evidence about what is there.",
    facts: [
      "On 10 February 2009 a defunct Russian satellite collided with an active Iridium spacecraft at roughly 42,000 km/h, producing about 2,300 trackable fragments.",
      "China's 2007 anti-satellite test produced over 3,000 trackable pieces, a large share of which will still be in orbit decades from now.",
      "Donald Kessler's 1978 paper described the cascade: past a certain density, collisions generate debris faster than debris decays, and the process continues with nobody adding anything to it.",
      "A gap in coverage is not evidence about what is inside the gap. It is, however, the easiest thing in the world to narrate as though it were.",
    ],
    precedent:
      "The 2009 Iridium and Cosmos collision: capability lost to physics, in a week when everybody is looking for intent.",
    actors: [
      {
        id: "RU",
        wants: "Wants the cascade recorded as an accident and the resulting gaps treated as a fact everyone learns to live with, rather than a grievance anyone gets to bank.",
        fears: "Fears that Washington decides the gap was manufactured and begins treating Russian satellites as a problem to be settled rather than tracked.",
        constraint: "It has fewer replacement launches available this year than it has implied, so it cannot demonstrate that it is unaffected, and demonstrating that it is affected costs it more.",
      },
      {
        id: "CN",
        wants: "Wants its own tracking catalogue to become the reference while yours is degraded, because whoever says where the debris is also says who put it there.",
        fears: "Fears its 2007 test being relitigated as the origin of the whole condition, which would put every civil-space agreement it has signed since back on the table.",
        constraint: "Sharing tracking data at the moment it would be most useful reveals precisely how good its tracking is, and that is a secret it values above the credit.",
      },
      {
        id: "FR",
        wants: "Wants European tracking treated as an independent source rather than a supplement to yours, and this is the week that argument makes itself for free.",
        fears: "Fears being asked to confirm an American assessment it cannot independently support, and then owning that assessment when it turns out to be wrong.",
        constraint: "Its own coverage has holes in the same places for the same physical reasons, and admitting that undercuts the independence it is claiming.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Analysts will fill the gap with the most alarming plausible content, because a blank cell in a briefing gets replaced by whatever the last briefing said was there." },
      { horizon: "weeks", line: "Say publicly that you cannot see and adversaries learn the shape of the hole while allies learn your assessments were thinner than advertised. Say nothing and the story that you are hiding something writes itself inside a fortnight." },
      { horizon: "years", line: "A cascade nobody caused sets the standard for how the next one is read. Whatever rule you apply this month, accident until proven otherwise or hostile until explained, is the rule applied to you when your own hardware breaks something." },
    ],
    unknowns: [
      {
        question: "Were both objects in the initiating collision already being tracked?",
        whyItMatters: "Two tracked objects colliding anyway means the catalogue was wrong, and every conclusion drawn from it this week is suspect. An untracked object means the physics is the whole story and the intent question closes.",
        settledBy: "intelligence",
      },
      {
        question: "Will Beijing or Paris share raw tracking rather than finished conclusions?",
        whyItMatters: "Raw data lets you rebuild a baseline in days, which puts waiting back on the menu. Conclusions only let you agree or disagree, which means you are still deciding on somebody else's picture of your own blind spot.",
        settledBy: "diplomacy",
      },
      {
        question: "How much of the certainty in the room traces back to the same single source?",
        whyItMatters: "If three agencies agree and two of them are quoting the third, that is one source wearing three hats. Holding a cycle long enough to ask changes whether the pattern is evidence at all.",
        settledBy: "hold",
      },
    ],
    theTrap: "The pattern of the gaps will look meaningful because you are the one who knows where the gaps are. Debris does not choose its victims, but the map of what you can no longer see is drawn from the list of things you already care about, so it will always appear to point at something.",
  },
  "ceasefire-clock": {
    headline: "The ceasefire is twelve hours old and already being violated.",
    situation:
      "The pause is holding in most places and failing in a few. Each violation is disputed, each side blames the other, and verification takes longer than the news cycle. The monitoring channel that could settle any of it is thin and both sides have reasons to discredit it.",
    youAre: "You are the President of the United States, brokering something that could collapse in an afternoon.",
    decision: "Protect the monitoring channel, punish the violation, or absorb it and keep the pause alive.",
    stakes:
      "Punishing a violation you cannot verify may be punishing a fabrication. Absorbing real violations teaches the other side what the pause is worth.",
    facts: [
      "The OPCW's 2018 Douma investigation produced a public report and a public dissent from members of the inspection team. The disagreement was about method, and every party used it as proof of whatever they already believed.",
      "Verification is slower than the news cycle by construction. The Douma inspection team reached Damascus on 14 April 2018 and could not access the site until 21 April — a week in which a disputed violation only had to be asserted once.",
      "A monitoring channel is the first thing both sides attack once it starts producing findings either of them dislikes. Protecting it costs more than using it.",
      "Punishing an unverified violation may be punishing a fabrication, and fabrications are cheap. The side that wants the pause to collapse only needs to be believed once.",
    ],
    precedent:
      "The Douma dissent (2018): the machinery that could have settled it becoming the thing under attack instead.",
    actors: [
      {
        id: "RU",
        wants: "Wants the monitoring channel discredited before it publishes anything, and wants it done by amplifying a genuine methodological argument rather than inventing a false one.",
        fears: "Fears a finding it cannot dispute, delivered in front of an audience that includes its own partners. Being contradicted by neutrals in public costs it more than the ceasefire collapsing.",
        constraint: "It is also the only party that can make one side actually stop, so it has to stay useful to you at the same time as it undermines your monitors.",
      },
      {
        id: "IR",
        wants: "Wants the pause to hold long enough to consolidate positions, without ever appearing to have accepted a ceasefire it publicly rejects.",
        fears: "Fears a client acting on its own initiative and being answered as though the order came from Tehran, which buys it a war it has not budgeted for.",
        constraint: "Its influence over the units nearest the line is real but slow. Everyone else assumes it is both real and instant, so it gets blamed at a speed it cannot match.",
      },
      {
        id: "FR",
        wants: "Wants the monitoring mechanism to survive as a Security Council fact rather than an American arrangement, because only the first makes the next one possible.",
        fears: "Fears a vote it would lose. A defeated mandate kills the mechanism outright, where an unrenewed one leaves it wounded and available later.",
        constraint: "The mechanism only works if it is seen as neutral, which means France cannot be seen coordinating closely with you at the moment coordination would help most.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The next disputed violation arrives before the last one is verified. Whatever you do tonight is done on a first claim, not a confirmed one." },
      { horizon: "weeks", line: "Absorbing a real violation quietly buys the pause another week and teaches the other side the precise size of what you will absorb. They will test one increment above it." },
      { horizon: "weeks", line: "Punish once on thin evidence and every subsequent claim becomes worth manufacturing. The cheapest way to end the pause becomes a well-documented fabrication delivered at the right hour." },
      { horizon: "years", line: "Monitoring bodies remember which sponsor defended them when their findings were inconvenient and which one used them. The next crisis offers you a verification mechanism only if this one survives being inconvenient to you." },
    ],
    unknowns: [
      {
        question: "Did the units that fired have orders, or did they have latitude?",
        whyItMatters: "Orders mean the pause is being tested from the top and a response has an address. Latitude means there is nobody to punish who deserves it, and punishing anyway hands the top exactly the incident it wanted.",
        settledBy: "intelligence",
      },
      {
        question: "Is the monitoring team heading for a split finding?",
        whyItMatters: "A split finding is worse than none, because each side quotes its own half forever. If a split is coming, the useful move is to slow the publication and widen the team, not to pre-empt it with an assessment of your own.",
        settledBy: "diplomacy",
      },
      {
        question: "Would a visible but non-committal move near the line stop the incidents without giving anyone grounds to declare the pause dead?",
        whyItMatters: "If it would, you can answer a violation without adjudicating it, which is the only response available that does not require evidence you do not have. If it would not, you are choosing between punishing blind and absorbing.",
        settledBy: "posture",
      },
    ],
    theTrap: "The first complete, well-documented file reaches you within the hour, and completeness is cheapest for whoever wrote it in advance. Verification of the real incident will still be days away while you are up all night arguing against the fake one.",
  },
  "black-brant-1995": {
    headline: "A rocket launched from Norway is climbing on a profile that looks like a submarine attack.",
    situation:
      "It is a scientific research rocket. Norway filed the notification through the proper channels weeks ago and it reached your duty officer after the track was already on the board. From where your radars sit, the trajectory is consistent with a submarine-launched missile flown to blind Moscow before a larger strike.",
    youAre: "You are the President of the Russian Federation. The command briefcase has been opened and is in front of you.",
    decision: "Treat it as the attack profile it resembles, or hold long enough for the arc to prove itself.",
    stakes:
      "A notice you did not read in time is worth nothing. If you hold and you are wrong, you lose the chance to answer at all — and the profile is designed to look precisely like this.",
    facts: [
      "25 January 1995. A four-stage Black Brant XII sounding rocket launched from And\u00f8ya, Norway, to study the aurora.",
      "Olenegorsk radar on the Kola Peninsula saw a large multi-stage vehicle rising from the Norwegian Sea; stage separation produced multiple radar objects.",
      "Norway had notified some 30 states, Russia among them, through diplomatic channels weeks in advance. The notice never reached the operators who mattered.",
      "The track was assessed as non-threatening in about 8 minutes, once it was clearly heading away from Russian territory — inside the roughly 10-minute window a close-in submarine launch would have allowed.",
      "A single object is more alarming than many: one high-altitude detonation could blind radars immediately before a mass strike, so a lone track reads as the opening move.",
    ],
    whatHappened:
      "No launch order was given and the alert lapsed. President Yeltsin later stated the Cheget nuclear briefcase had been activated.",
    afterward:
      "The severity is genuinely contested \u2014 analysts including Pavel Podvig have argued the alert may never have risen to that level, and Russia has not released records. That dispute is itself part of the lesson.",
    actors: [
      {
        id: "US",
        wants: "Wants its posture to stay exactly where it was last week, because any change has to be explained to a Congress in the middle of a budget argument.",
        fears: "Fears a Russian alert it did not cause and cannot explain. The only two available explanations are that Moscow is deceiving it or that Moscow is broken, and both invite pressure it does not want to apply.",
        constraint: "Its warning system registers any change in your readiness within minutes, and the response to that change is largely written down in advance. It cannot simply decide to stay calm.",
      },
      {
        id: "UK",
        wants: "Wants routine northern patterns to stay unremarkable. They are unchanged this week and were unchanged last week, and that is the entire point of them.",
        fears: "Fears a Russian misreading turning a routine pattern into a subject of negotiation, because the pattern is one of the few things it is not willing to trade.",
        constraint: "It cannot reassure anyone about the pattern without describing the pattern, and describing it is the concession it is trying to avoid.",
      },
      {
        id: "CN",
        wants: "Wants a clear public account of how a research launch came to be read as an attack, because it is arguing internally about whether minimal warning arrangements are still enough.",
        fears: "Fears that the account turns out to be that the notification was filed correctly and ignored, which would mean transparency measures do not work and its own restraint earns nothing.",
        constraint: "It cannot ask for that account without revealing how closely it has been watching and how much the answer would change its own plans.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The arc resolves the question in roughly eight minutes. Anything you do inside those eight minutes is something you will have to unwind in front of people who watched you do it." },
      { horizon: "hours", line: "Raising readiness to buy yourself time is visible to exactly the party you are worried about, and their response to that is largely pre-written. Buying time this way spends it." },
      { horizon: "weeks", line: "However this ends, the failure of the notification chain becomes public. A transparency measure that was filed correctly and still failed is an argument, in every capital, against bothering to file anything." },
      { horizon: "years", line: "The lesson drawn will be either that the human held or that the human was lucky. The second reading is what funds automation, and the second reading is the honest one." },
    ],
    unknowns: [
      {
        question: "Did the notification from Oslo arrive somewhere in this building weeks ago?",
        whyItMatters: "If it is in the ministry, this ends with one phone call and the alert was an internal filing failure. If it is not, you are back to reading the trajectory, and you have spent minutes of a ten-minute window finding that out.",
        settledBy: "intelligence",
      },
      {
        question: "Would a call to Washington be received as reassurance or as confirmation that something is under way?",
        whyItMatters: "If the line is answered plainly, the absence of American activity is worth more than anything on your radar screen. If the call itself reads as a warning indicator, you have raised their alert in order to lower your own.",
        settledBy: "diplomacy",
      },
      {
        question: "Are the multiple returns one vehicle shedding stages, or separate vehicles?",
        whyItMatters: "Staging means a rocket. Separate vehicles on that heading would be the thing you fear. The board cannot yet tell them apart, and the only way to find out is to let the arc continue, which from the outside looks exactly like doing nothing.",
        settledBy: "hold",
      },
    ],
    theTrap: "The profile matches what a blinding first move would look like, and you will treat that match as information. It is not. A research launch on that heading produces the same picture. The only real information on the board is the direction of travel, and it needs a few more minutes before it can show you.",
  },
  "norad-false-cascade": {
    headline: "Your warning centre is showing hundreds of Soviet missiles inbound.",
    situation:
      "The display shows a full-scale attack. Ground radar shows nothing, satellites show nothing, and the two pictures cannot both be true. Bomber crews are already at their aircraft and the room is loud. Somewhere in the system a training tape or a failing component is producing a war that is not happening.",
    youAre: "You are the President of the United States, minutes into a report nobody in the room can corroborate.",
    decision: "Act on the display, wait for the sensors that disagree with it, or generate forces while you find out.",
    stakes:
      "Two independent sensor types agreeing is the standard, and you do not have it. The display is confident, and confidence is exactly what a fault produces.",
    facts: [
      "9 November 1979. NORAD displays showed a large Soviet attack; the cause was a training tape loaded into a live system.",
      "Ten interceptors were launched and the National Emergency Airborne Command Post was readied. The alert was resolved in about six minutes.",
      "Separately, on 3 June and 6 June 1980, a failing 46-cent integrated circuit produced false attack displays with random numbers of missiles.",
      "In both cases the resolving evidence was the same: satellite and radar sensors did not corroborate the display.",
      "The standard the events established is dual phenomenology \u2014 a warning is credited only when two physically independent sensor types agree.",
    ],
    whatHappened:
      "Duty officers checked the display against sensors that disagreed with it and stood the alert down without escalating to launch.",
    afterward:
      "Procedures were rewritten so that test scenarios could not run on operational systems, and the 46-cent chip failure became the standard argument for corroboration over confidence.",
    actors: [
      {
        id: "SU",
        wants: "to know within minutes whether the American movement it is watching tonight is a drill, an exercise, or the first hour of a war",
        fears: "being the side that decides second — American forces airborne and dispersed while Soviet leadership is still being assembled from four different buildings",
        constraint: "its own warning picture is thinner than the American one, so it must infer intent from posture rather than read it from sensors",
      },
      {
        id: "UK",
        wants: "to be told about a change in American alert before it becomes visible on its own radars or in its own press",
        fears: "learning that a decision about British survival was taken in a room with no British chair, and having to explain that in Parliament",
        constraint: "American bases sit on British soil, which makes the country a target of whatever happens and gives it no vote in the decision that causes it",
      },
      {
        id: "FR",
        wants: "to keep its own warning judgement separate from a picture it did not generate and cannot audit",
        fears: "being pulled into an American alert by association, without ever having seen the data that caused it",
        constraint: "it sits outside the integrated command structure, so it hears late and would have to react on fragments",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Crews at aircraft and a command post being readied are visible from outside. Every minute you spend looking busy while you check is a minute the other side spends deciding what you are doing." },
      { horizon: "weeks", line: "The cause is found and it is small — a tape, a component worth pocket change. The argument that follows is not about the part. It is about which channels count as independent, and who gets to overrule a display." },
      { horizon: "years", line: "Requiring two physically independent sensor types to agree becomes the written rule. It is the right rule, and it costs minutes against an attack designed to defeat one sensor type first." },
    ],
    unknowns: [
      {
        question: "Is the silence from ground radar a real absence of missiles, or a second failure in the same system?",
        whyItMatters: "If the radars are also down, the disagreement between channels is no longer evidence of a fault, and holding stops being the cautious option.",
        settledBy: "intelligence",
      },
      {
        question: "Has Moscow already noticed the change in your posture, and what does it believe it is watching?",
        whyItMatters: "If they have not noticed, you have more minutes than you think. If they have, standing down loudly costs less than staying quiet and letting them fill in the gap.",
        settledBy: "diplomacy",
      },
      {
        question: "Does the display hold steady over the next few minutes, or does it drift?",
        whyItMatters: "A fault repeats or wanders. A real attack resolves toward arrival. Waiting is the only test that costs nothing except the thing you have least of.",
        settledBy: "hold",
      },
    ],
    theTrap: "Generating forces feels like the cautious middle path between doing nothing and launching. It is not neutral. It is the one move the other side can see, and it converts your equipment fault into their evidence.",
  },
  "arkhipov-1962": {
    headline: "American destroyers are dropping depth charges on your submarine.",
    situation:
      "You are submerged, out of contact with Moscow for days, and the batteries are failing. The charges are practice depth charges meant as a signal to surface, but nobody aboard can tell that from the inside of the hull. There is a nuclear torpedo aboard and the captain believes war may already have started above you.",
    youAre: "You are aboard B-59, where launching requires the agreement of the officers present.",
    decision: "Concur with the captain, refuse, or force the boat to surface and find out what is happening.",
    stakes:
      "You cannot see the surface, cannot reach Moscow, and are being attacked as far as anyone aboard can tell. Refusing is the only thing standing between this hull and a nuclear war.",
    facts: [
      "27 October 1962, during the Cuban missile crisis. Soviet submarine B-59, submerged and out of contact with Moscow for days.",
      "US destroyers dropped practice depth charges intended as a signal to surface. Inside the hull they were indistinguishable from an attack.",
      "The boat carried a nuclear torpedo. Battery power and air quality were failing; internal temperatures were reported above 45\u00b0C.",
      "Launch required the agreement of the officers aboard. Captain Savitsky is reported to have favoured firing.",
      "Vasili Arkhipov was flotilla chief of staff, which is why his concurrence was needed at all \u2014 on the other boats, it would not have been.",
    ],
    whatHappened: "Arkhipov refused to concur. B-59 surfaced instead, and no weapon was used.",
    afterward:
      "The episode was not publicly known for decades. It is the clearest case in the record of a nuclear war being prevented by one person declining to agree.",
    actors: [
      {
        id: "US",
        wants: "the submarine on the surface, visible and counted, with the quarantine line seen to work and no shot fired",
        fears: "that the signal it improvised is being read inside the hull as an attack it never intended, and that it will learn this only from the result",
        constraint: "the destroyer captains are working from rules written for a blockade, not a nuclear one, and nobody told them what the boat might be carrying",
      },
      {
        id: "SU",
        wants: "its boats to survive, report, and leave the decision about war where it was placed — in Moscow",
        fears: "a commander at sea starting a war the state has not chosen, and finding out about it from an American broadcast",
        constraint: "it cannot reach the boats at all. Reaching them requires them to surface, which is the one thing the mission told them not to do",
      },
      {
        id: "CU",
        wants: "the confrontation to end with the island still defended and its own position not traded away",
        fears: "a settlement reached over its head between Washington and Moscow, with the guarantees written by people who do not live there",
        constraint: "it has no way to affect the naval line and no vote in what the Soviet navy does in it",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Surfacing ends the charges and hands the Americans a photograph of an exhausted crew. Staying down keeps the boat's only advantage and keeps the charges coming, with no way to learn which they are." },
      { horizon: "weeks", line: "Whatever happens sets what practice charges mean the next time a navy tries to signal with them. Read as an attack once, they can never be used as a signal again." },
      { horizon: "years", line: "If it becomes known that a weapon at sea could be released on the judgement of officers out of contact for days, every navy's command arrangements are rewritten around that fact, and the rewriting is done by people who did not have to make the call." },
    ],
    unknowns: [
      {
        question: "Is the pattern above the hull an attack that keeps missing, or a signal the boat is refusing to read?",
        whyItMatters: "If it is a signal, surfacing ends the problem tonight. If it is an attack, surfacing gives away the only thing keeping the boat alive, so the two readings demand opposite moves.",
        settledBy: "intelligence",
      },
      {
        question: "Would Moscow, if it could be reached, treat this hull's decision as the state's own?",
        whyItMatters: "If the answer is no, the officers are being asked to make a choice that was never delegated to them, and the burden of proof flips from the man refusing to the man proposing.",
        settledBy: "diplomacy",
      },
      {
        question: "How much longer can this crew, in this air and this heat, make a judgement anyone would trust?",
        whyItMatters: "The deadline is not American patience. It is the boat's. If the crew degrades faster than the situation clarifies, waiting stops being free and starts being a decision.",
        settledBy: "hold",
      },
    ],
    theTrap: "This is remembered as one man's courage, which is the comforting version. The mechanism was that his agreement was structurally required, and it was required only because of where he happened to be posted. Treating the outcome as character rather than as a rule leaves you assuming the next boat will also have the right man aboard.",
  },
  "malmstrom-1967": {
    headline: "Ten missiles dropped off alert within seconds of each other.",
    situation:
      "An entire flight went no-go at effectively the same moment, which is not how independent failures behave. Security personnel and engineering are telling different stories about what happened and neither can rule the other out. The weapons are safe; the question is what made ten of them unavailable at once.",
    youAre: "You are the President of the United States, with a readiness gap and no explanation for it.",
    decision: "Treat it as an engineering fault, treat it as interference, or take the flight off line entirely while you find out.",
    stakes:
      "If something can take ten missiles off alert at once, the number that matters is not ten. Explaining it away is cheaper and might be wrong.",
    facts: [
      "16 March 1967, Echo Flight, Malmstrom Air Force Base, Montana. All ten Minuteman missiles in the flight went off alert within seconds.",
      "The weapons were never in danger of launching; the failure removed them from readiness, it did not arm anything.",
      "Air Force engineering attributed the fault to a noise pulse in the logic coupler. Security personnel accounts differed.",
      "All 10 dropping out at once, in systems designed to be independent of each other, is the signature of a common-cause failure rather than a coincidence.",
      "A similar mass-dropout occurred at Oscar Flight, and the discrepancy between the engineering and security accounts has never been fully reconciled in public.",
    ],
    whatHappened: "The flight was restored and the cause recorded as an engineering fault.",
    afterward:
      "The episode remains the standard example of common-cause failure in nuclear command systems: if one thing can take ten missiles off alert at once, the number that matters is not ten.",
    actors: [
      {
        id: "SU",
        wants: "to know whether ten weapons going off alert at once was something it did, something it could do, or something that happens by itself",
        fears: "that Washington concludes the cause was interference and answers an engineering fault with a posture change",
        constraint: "it cannot ask, and any collection it runs to find out looks exactly like the interference it is being suspected of",
      },
      {
        id: "UK",
        wants: "the American readiness figure it plans its own deterrent case around to mean what it says on the page",
        fears: "discovering that the number it was given includes weapons capable of dropping off alert in blocks rather than one at a time",
        constraint: "the domestic argument for the alliance rests on those numbers, so raising the question in public damages the case it is already struggling to make",
      },
      {
        id: "FR",
        wants: "evidence that leaning on American readiness is a bad bet, to justify what its own force is costing",
        fears: "the argument working too well, and its own public asking whether French systems fail the same way",
        constraint: "it still needs American technical cooperation it is publicly refusing to depend on",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Ten weapons are genuinely unavailable while the cause is unknown. Whoever writes tonight's readiness report decides whether the number that goes up the chain is accurate or tidy." },
      { horizon: "weeks", line: "Engineering and security file accounts that do not match. The one that gets believed will be the one that requires no further work from anybody, and it will be believed quietly." },
      { horizon: "years", line: "The unreconciled file becomes a public story with a life of its own, and the real finding — a common-cause failure inside systems certified as independent — is buried underneath it where no engineer will look." },
    ],
    unknowns: [
      {
        question: "Does anything else in the force share whatever failed here?",
        whyItMatters: "If the fault is unique to this flight it is a repair. If it is common, the readiness number for the entire force is wrong, and every posture decision resting on that number is unsound.",
        settledBy: "intelligence",
      },
      {
        question: "Would Moscow, asked privately, say whether it had anything near that airspace that morning?",
        whyItMatters: "A denial you can partly check narrows this to engineering and lets you close it. Silence where you expected a routine denial is itself a reason to keep the flight off line.",
        settledBy: "diplomacy",
      },
      {
        question: "Do the security accounts still stand once those officers know what engineering has already filed?",
        whyItMatters: "If the two versions converge only after one side has read the other, you have consensus rather than corroboration, and that difference decides whether the case is closed or still open.",
        settledBy: "hold",
      },
    ],
    theTrap: "The engineering explanation is probably correct, and that is what makes it dangerous. Inside a building, a cause that closes a file is worth more than a cause that is true. Nobody has to lie for the wrong answer to win.",
  },
  "vela-flash-1979": {
    headline: "A satellite has recorded a double flash over the South Atlantic.",
    situation:
      "The double flash is the characteristic signature of a nuclear detonation, and the satellite that saw it was built to see exactly that. No nation has claimed a test, no fallout has been detected, and the instrument has a known history of false positives from micrometeoroid strikes. Attribution is the entire problem.",
    youAre: "You are the President of the United States, holding a detection nobody can confirm or deny.",
    decision: "Treat it as a confirmed test and attribute it, treat it as instrument error, or investigate quietly.",
    stakes:
      "Attributing a test to the wrong state has consequences that outlive the evidence. Ignoring a real one tells everyone what your detection is worth.",
    facts: [
      "22 September 1979. US satellite Vela 6911 recorded a double flash over the South Atlantic near the Prince Edward Islands.",
      "A double flash \u2014 a fast first pulse, then a slower brighter second \u2014 is the characteristic optical signature of an atmospheric nuclear detonation.",
      "Vela 6911 had been in orbit since 1969 and was long past its design life, with a known history of spurious signals from micrometeoroid strikes.",
      "No fallout was ever conclusively detected. Hydroacoustic and ionospheric evidence was ambiguous and remains disputed.",
      "A White House panel led by Jack Ruina concluded it was probably not a nuclear detonation; several agencies disagreed then and since.",
    ],
    whatHappened:
      "No state claimed a test. No attribution was ever officially made, and the event is still formally unexplained.",
    afterward:
      "It stands as the clearest case in the record of a detection system producing a signal that could be neither confirmed nor dismissed \u2014 and of how much rests on attribution.",
    actors: [
      {
        id: "IL",
        wants: "the event to stay unattributed, and specifically wants Washington never forced to answer the question on the record",
        fears: "an American attribution that triggers America's own sanctions law and makes the relationship a matter of statute rather than judgement",
        constraint: "it depends on the state that would have to impose the penalty, so it cannot deny loudly — a loud denial only makes the question worth asking again",
      },
      {
        id: "SU",
        wants: "the United States seen failing to enforce the test ban it wrote and championed",
        fears: "an American conclusion that the detection system is unreliable, since the same class of satellite is what watches Soviet tests",
        constraint: "it cannot press the point hard without inviting the same scrutiny of what its own sensors claim to see",
      },
      {
        id: "IN",
        wants: "the standard to remain that a test counts only when the tester says so, because it has been living with the alternative since 1974",
        fears: "a precedent in which remote sensing alone is enough to start a sanctions case, because that precedent will be aimed at it next",
        constraint: "the standard it is defending also shelters states it would rather see disarmed, and it knows this",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The raw detection already sits in more than one agency. The first analyst to write the words probable detonation sets the frame that everyone else spends the next year arguing against." },
      { horizon: "weeks", line: "A panel is convened. Whatever it concludes, the internal disagreement leaks, and allies read the leak as either a cover-up or as proof the sensor was never worth what it cost." },
      { horizon: "years", line: "However you resolve it becomes the standard of proof for every unattributed event afterwards. Set it too high and detection stops meaning anything. Set it too low and one instrument past its design life can open a case against a state that did nothing." },
    ],
    unknowns: [
      {
        question: "Did anything in the ocean or the upper atmosphere record the same event the satellite did?",
        whyItMatters: "Independent physical corroboration turns a disputed instrument into a fact. Without it, every step that follows is interpretation wearing the clothes of evidence.",
        settledBy: "intelligence",
      },
      {
        question: "Would the suspected state answer honestly in private if the answer were never going to be published?",
        whyItMatters: "A private admission changes what you do about the programme even if you never attribute anything publicly. A private denial you find credible lets you close the file without a fight you would lose.",
        settledBy: "diplomacy",
      },
      {
        question: "Is the satellite's history of false signals an explanation, or the nearest thing to one that the panel could reach?",
        whyItMatters: "If the instrument's other spurious signals look nothing like this one, the finding is thinner than the authority it carries, and policy built on it will cost more later than admitting uncertainty now.",
        settledBy: "hold",
      },
    ],
    theTrap: "You will treat unexplained as a decision you have postponed. You have not. Leaving it unattributed is the attribution: it tells every state watching that a test nobody claims is a test nobody pays for.",
  },
  "yom-kippur-scare-1973": {
    headline: "Soviet forces are mobilising and your desk cannot agree on what it means.",
    situation:
      "Airborne divisions have been readied and transport aircraft are moving. One reading is that Moscow intends to intervene directly in the Middle East war. The other is that this is signalling meant to be seen. Your own government is producing both assessments simultaneously and both are being briefed to you as fact.",
    youAre: "You are the President of the United States, at an hour when the government is not at its most coherent.",
    decision: "Raise your own alert level to answer the signal, hold, or ask Moscow directly what they are doing.",
    stakes:
      "Raising alert is itself a signal, and it will be read by people making the same guesses about you that you are making about them.",
    facts: [
      "24-25 October 1973, during the Arab-Israeli war. Soviet airborne divisions were placed on alert and transport aircraft were readied.",
      "The US response was to raise readiness to DEFCON 3 worldwide \u2014 the highest peacetime alert level reached since 1962.",
      "The decision was taken overnight by a small group. President Nixon was not present for the deliberations, which were chaired by Kissinger.",
      "The Soviet move may have been intended as a signal rather than a preparation; the intelligence supported both readings simultaneously.",
      "Both sides de-escalated within roughly a day, and the alert was widely read afterwards as having been driven partly by domestic political circumstances.",
    ],
    whatHappened:
      "DEFCON 3 was declared, Moscow did not intervene directly, and both sides stood down within about twenty-four hours.",
    afterward:
      "It became the standard case study in how an alert level intended as a message is read by its recipient as a preparation.",
    actors: [
      {
        id: "SU",
        wants: "a ceasefire enforced with its own troops on the ground, so its client is not seen to have been abandoned in front of the region",
        fears: "watching the encirclement completed while it does nothing, after which its guarantees are worth what everyone privately suspects",
        constraint: "it has committed publicly to acting, and acting alone risks the détente arrangements it spent a decade building and still needs",
      },
      {
        id: "IL",
        wants: "to finish the encirclement before a ceasefire freezes the map where it currently sits",
        fears: "a deal made between Washington and Moscow that locks in a position short of what the war has already cost it",
        constraint: "it depends on an American resupply that the same American government can slow without announcing anything",
      },
      {
        id: "UK",
        wants: "notice before a worldwide American alert reaches into its bases, its airspace and its newspapers",
        fears: "being made a co-belligerent by a decision it was not consulted on, at the exact moment its oil supply is being used as leverage against it",
        constraint: "the embargo is paying European governments to look distant from Washington, and no cabinet can afford to look like a launching platform this month",
      },
    ],
    consequences: [
      { horizon: "hours", line: "A worldwide alert is visible within the hour. Soviet watch officers will attribute it to intent, not to whichever of your two contradictory assessments happened to be briefed last." },
      { horizon: "weeks", line: "Allied capitals learn about the alert from their own radars and ask what the consultation obligation is actually worth. The answer damages the alliance more than the alert impressed Moscow." },
      { horizon: "years", line: "An alert taken overnight by a handful of people, with the President not in the room, becomes the precedent everyone cites afterwards — for how fast the system can move, and for how little it needs in order to move." },
    ],
    unknowns: [
      {
        question: "Will Moscow say plainly, on the line built for exactly this, what the airborne divisions are for?",
        whyItMatters: "Asking costs nothing. A plain answer, an evasion, or silence separates signalling from preparation more reliably than matching their posture ever will.",
        settledBy: "diplomacy",
      },
      {
        question: "Is the movement sized for arriving somewhere, or sized for being seen?",
        whyItMatters: "A force built to be watched can be answered with words. A force built to arrive cannot. Matching your posture to the wrong one is the entire error available tonight.",
        settledBy: "intelligence",
      },
      {
        question: "Does anything on the ground change if this waits until the President is awake?",
        whyItMatters: "If holding until morning changes nothing physically, the only thing the overnight decision buys is a signal you cannot take back, sent by people who will not have to live in it.",
        settledBy: "hold",
      },
    ],
    theTrap: "Raising your own alert feels like buying time to think. It does the opposite. It hands the other side a fact about your intentions that they will trust more than anything you tell them afterwards, and it is read by people guessing about you in exactly the way you are guessing about them.",
  },
  "november-uap-1975": {
    headline: "Radar is painting unidentified objects over your missile complexes.",
    situation:
      "Multiple sites across the northern tier are reporting returns over the weapons storage areas. Security teams are reporting them visually as well. Nothing has been intercepted, nothing has been identified, and the reports have continued across several nights at different bases.",
    youAre: "You are the President of the United States, with reports from sites that do not usually report anything.",
    decision: "Treat it as reconnaissance by an adversary, treat it as misidentification, or commit real resources to finding out.",
    stakes:
      "Something over the weapons storage areas is either hostile collection or a failure of your own security reporting. Both are serious and they need opposite responses.",
    facts: [
      "Late October to November 1975. Multiple US and Canadian bases in the northern tier reported unidentified objects over weapons storage and missile areas.",
      "Loring, Wurtsmith, Malmstrom, Minot and Canadian Forces Station Falconbridge — 5 installations across the northern tier — filed reports over roughly 3 weeks.",
      "Security police reported visual sightings; some sites reported radar returns. Interceptors were launched and made no identifications.",
      "The reports were documented in NORAD and Air Force message traffic later released under freedom-of-information requests.",
      "No cause was ever established. The candidate explanations \u2014 helicopters, misidentification, deliberate reconnaissance \u2014 were never resolved either way.",
    ],
    whatHappened:
      "No object was ever identified or intercepted, and the reports stopped as abruptly as they began.",
    afterward:
      "The file is a durable example of the harder problem: reports from serious people at serious sites that cannot be confirmed and cannot be dismissed.",
    actors: [
      {
        id: "SU",
        wants: "to know what American security reporting does when something it cannot name sits over a weapons storage area for three weeks",
        fears: "being blamed for an operation it did not run, at a moment when arms talks are open and a denial buys nothing",
        constraint: "from Washington a truthful denial and a lie sound identical, so its most honest answer is also its least useful one",
      },
      {
        id: "UK",
        wants: "assurance that weapons held on its own territory are guarded to a standard capable of identifying what is above them",
        fears: "the story reaching its press as an unidentified-object story, after which the serious security question becomes impossible to ask in public",
        constraint: "any question it raises openly becomes ammunition for a domestic disarmament campaign that is already gaining on it",
      },
      {
        id: "NS",
        wants: "to learn where custody arrangements have seams, and reporting like this is free reconnaissance that costs it nothing to collect",
        fears: "an audit serious enough to close the seam before it is worth anything",
        constraint: "it can only read what the Americans eventually publish, and has no means of its own to test any perimeter",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Interceptors go up and identify nothing. Each failed identification is recorded somewhere as a fact about what your air defence can and cannot see, and that record does not stay inside the building." },
      { horizon: "weeks", line: "The message traffic will be released eventually, and it will be read by people looking for a gap rather than for an explanation. Nothing you write tonight will be written with that reader in mind." },
      { horizon: "years", line: "The unresolved file becomes a public story with its own following, and every future report from those sites is filtered through the fear of being laughed at. That is the real cost: the next real intrusion is less likely to be reported at all." },
    ],
    unknowns: [
      {
        question: "Are the visual sightings and the radar returns independent of each other, or is one prompting the other?",
        whyItMatters: "If guards are looking because radar called, or radar is checking because guards called, you have one report rather than two, and the entire case rests on a single channel you already doubt.",
        settledBy: "intelligence",
      },
      {
        question: "Would Moscow, asked directly and privately, deny flying anything over those sites?",
        whyItMatters: "A denial you can partly check turns this into a problem with your own security reporting. A refusal to answer turns it into a collection problem, and the two cost different money and different attention.",
        settledBy: "diplomacy",
      },
      {
        question: "If the reports stop, will it be because the thing stopped or because reporting it stopped being worth a career?",
        whyItMatters: "It decides whether silence next month counts as evidence of anything at all, and whether you can safely treat the file as closed.",
        settledBy: "hold",
      },
    ],
    theTrap: "Both explanations are embarrassing, and only one of them is embarrassing to you. That asymmetry, rather than the evidence, is what usually decides which explanation the file ends up recording.",
  },
  "phenomenology-window-2027": {
    headline: "Your warning sensors disagree about something, and the rumour is already public.",
    situation:
      "Infrared and radar are returning incompatible pictures of the same object — which is what a sensor fault looks like, and also what a real thing your sensors were not built for looks like. Video is already circulating online. Public belief is running well ahead of anything in the file.",
    youAre: "You are the President of the United States, being asked about it before your own analysts have an answer.",
    decision: "Say what you know and admit the gap, wait for corroboration, or let the public story run.",
    stakes:
      "The standard is two independent sensor types agreeing, and you have two that do not. Saying nothing hands the explanation to whoever is loudest.",
    facts: [
      "The ODNI assessment of 25 June 2021 examined 144 US government reports and resolved exactly one — a large deflating balloon — leaving 143 unresolved. It stated plainly that the limiting factor was insufficient and inconsistent data, not exotic performance.",
      "In the Nimitz encounter of 14 November 2004, shipboard radar, aircrew eyewitness accounts and infrared targeting-pod video all recorded something, and the sensors did not agree with each other about what.",
      "The doctrinal standard for a launch warning is dual phenomenology: two independent sensor types, working on different physics, agreeing. It exists because one sensor type has been wrong before, repeatedly, in exactly this way.",
      "Public belief moves faster than analysis and does not wait for it. The New Jersey drone flap of late 2024 generated thousands of reports which four federal agencies jointly assessed as ordinary aircraft.",
    ],
    precedent:
      "The 2021 ODNI assessment and the Nimitz case (2004): sensors disagreeing is the normal condition, and the public gets the video first.",
    actors: [
      {
        id: "RU",
        wants: "To learn, from what you say in public, which combinations of American sensors produce a picture your own analysts cannot resolve.",
        fears: "An American alert change made because of an unexplained return, because their watch officers cannot tell a precautionary posture from a preparatory one and have to answer it within minutes.",
        constraint: "Their own early-warning history includes returns they have never discussed publicly, so pressing you on sensor reliability invites the same question back.",
      },
      {
        id: "CN",
        wants: "The episode fixed as a domestic American embarrassment about data quality, not as an attribution problem with a foreign address.",
        fears: "A standing American habit of treating any unattributed object as presumptively Chinese, which turns every future flap into a bilateral crisis on someone else's schedule.",
        constraint: "Cannot offer a clarifying denial without conceding what it does and does not operate.",
      },
      {
        id: "UK",
        wants: "To know before its own press does whether the shared warning picture is affected, so it has something to say to its own parliament that survives the week.",
        fears: "An American statement made with confidence and withdrawn later, which would make the jointly held warning picture look unreliable at home.",
        constraint: "It reads much of this picture through American sensors and cannot independently check the return it is being asked to vouch for.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Any change you make to alert posture tonight is visible to other watch floors before your own analysts have finished, and it is read as a conclusion you reached rather than a question you are asking." },
      { horizon: "weeks", line: "Whatever you say now becomes the baseline the correction is measured against. A confident answer that shifts twice costs more standing than the original gap ever did." },
      { horizon: "years", line: "A president who says plainly that the sensors disagree makes that sentence sayable by successors. A president who waits for corroboration establishes that official silence is what a real one looks like, and every future gap gets filled by whoever is loudest." },
    ],
    unknowns: [
      {
        question: "Is the disagreement a property of the object or a property of your sensors?",
        whyItMatters: "If it is the sensors, this is a maintenance problem and the public statement is about data quality. If it is the object, tonight's words become the first entry in a much longer file, and you want that entry to be modest.",
        settledBy: "intelligence",
      },
      {
        question: "Does anyone else's warning network hold a return for the same window?",
        whyItMatters: "Corroboration from an ally or a rival turns one ambiguous track into a shared problem you can work jointly. The absence of one points the fault back at your own equipment, which is the cheaper answer to give and the harder one to say out loud.",
        settledBy: "diplomacy",
      },
      {
        question: "Does the video already circulating contain anything that is also in your file?",
        whyItMatters: "If it does, you are managing a disclosure as well as an anomaly and someone else is setting your timeline. If it does not, you still own the choice of when to speak.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "The instinct is to wait for the second phenomenology before saying anything, because that is the standard and the standard is sound. But the standard governs what you believe, not when you speak. Waiting is itself a public statement, and it is the only one you cannot correct later.",
  },

  // Ten from the half of the corpus that had no scenario. All historical, so
  // all carry an outcome rather than a precedent.
  "hawaii-alert-2018": {
    headline: "A statewide missile alert went out by mistake and is still standing.",
    situation:
      "An employee sent a live alert during an internal drill and the whole state read it as real. Military commands confirmed within minutes that nothing is inbound. Nothing has gone out to the public, and people are putting their children into storm drains.",
    youAre: "You are the President of the United States, watching a state you govern take shelter from nothing.",
    decision:
      "Correct it now on what you have, wait for a channel that is authorised to correct it, or say nothing and let the local authority own it.",
    stakes:
      "The harm is not the alert, it is the gap between the alert and the correction. Every minute is spent by somebody who thinks they have ten left.",
    facts: [
      "At 08:07 local time on 13 January 2018 an employee at the Hawaii Emergency Management Agency sent a live statewide alert reading BALLISTIC MISSILE THREAT INBOUND TO HAWAII. SEEK IMMEDIATE SHELTER. THIS IS NOT A DRILL.",
      "It happened during an unannounced internal drill. The employee reported hearing 'this is not a drill' but not the 'exercise, exercise, exercise' framing that five colleagues in the room heard.",
      "Military commands confirmed there was no threat within minutes. The formal corrective alert did not go out for 38 minutes.",
      "The flight time for a missile from North Korea to Hawaii is roughly 20 minutes. The correction took nearly twice the time people believed they had.",
      "No one was killed by the alert itself. The injuries were from the sheltering — and the lasting damage was to whether the next alert would be believed.",
    ],
    whatHappened:
      "The agency issued the correction 38 minutes later, after officials worked out who was authorised to send one. The employee was dismissed and the agency's administrator resigned.",
    afterward:
      "The FCC investigation found no procedure existed for cancelling a false alert. Hawaii added a two-person rule for live alerts and, more importantly, built the correction template in advance — the thing whose absence cost the 38 minutes.",
    actors: [
      {
        id: "KP",
        wants: "Confirmation that the American alert chain actually reaches ordinary people and that those people believe it, because that belief is the only part of deterrence they can observe.",
        fears: "A false alarm on the American side being attributed to them, producing a response to a launch that never happened and that they cannot disprove in the time available.",
        constraint: "They have no channel that could say 'that was not us' quickly, and would not be believed on it if they did.",
      },
      {
        id: "RU",
        wants: "The number, meaning how many minutes an advanced warning system takes to correct its own error, because that figure is worth more to their planners than the error itself.",
        fears: "An American civil-agency mistake propagating into American force posture, since their own indicators would show the posture and not the mistake behind it.",
        constraint: "They have their own false-alarm history and cannot make an issue of this one without it being raised alongside.",
      },
      {
        id: "CN",
        wants: "The episode to stay a civil-defence story about a state agency and go no further.",
        fears: "An American reform that concentrates alert authority and shortens the deliberation built into it, on the theory that the problem was slowness.",
        constraint: "No standing to comment on an American domestic message, and no interest in appearing to.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "People are sheltering against a twenty-minute clock. Past minute twenty they stop believing shelter helps and start doing something else, and most of what they do next cannot be undone." },
      { horizon: "weeks", line: "The next alert is discounted by everyone who remembers this one, including the people whose job it is to send it." },
      { horizon: "years", line: "The fix that gets adopted after an event like this is almost always a second authorisation step. It buys accuracy with exactly the minutes the system was built to provide." },
    ],
    unknowns: [
      {
        question: "Who actually holds the authority to cancel a state-issued alert?",
        whyItMatters: "If the state does, a federal correction competes with the one that will eventually work and may slow it. If nobody does, the gap will not close on its own and the choice is to break the process rather than wait for it.",
        settledBy: "diplomacy",
      },
      {
        question: "What are people doing in minute twenty that they were not doing in minute five?",
        whyItMatters: "Sheltering is reversible. Driving at speed, and the decisions made by people who believe they have run out of time, are not. That difference decides whether you can afford to wait for the authorised channel.",
        settledBy: "intelligence",
      },
      {
        question: "Did any warning system anywhere register anything in that window?",
        whyItMatters: "A clean board everywhere lets you correct on your own authority and mean it. A single unexplained return anywhere turns the correction into a claim you are making without knowing it is true.",
        settledBy: "intelligence",
      },
      {
        question: "Is the authorised channel minutes away, or has nobody started on it?",
        whyItMatters: "Holding for the proper channel is prudence if the paperwork is nearly done and negligence if it has not been begun. Which of those is true is the whole difference between patience and the thirty-eight minutes.",
        settledBy: "hold",
      },
    ],
    theTrap: "The correction feels like a formality, so it queues behind the question of who is permitted to issue one. Those minutes were not spent deciding what to say. They were spent deciding who could say it, and the people in the storm drains were charged for the whole delay.",
  },
  "damascus-titan-1980": {
    headline: "A dropped tool has holed a fuelled missile inside one of your own silos.",
    situation:
      "Maintenance dropped a socket; it fell the height of the silo, struck the missile and punctured a propellant tank. The complex is filling with vapour and the crew is out. The warhead is still on top of it, and the county sheriff is asking what to tell people who live within sight of the fence.",
    youAre: "You are the President of the United States, being briefed on your own weapon by people who disagree with each other.",
    decision:
      "Get a picture of the site before committing, tell the county now and accept a story you cannot yet finish, or keep the circle small while the pressure rises.",
    stakes:
      "The people nearest the hazard are the ones you have told the least, and the argument about what to do is being had between a crew at the gate and commanders a long way away.",
    facts: [
      "On the evening of 18 September 1980 an airman dropped a socket inside Launch Complex 374-7 near Damascus, Arkansas. It fell roughly 80 feet, struck the missile and punctured the first-stage fuel tank.",
      "The propellant vented for about eight and a half hours while on-scene crews and remote commanders disagreed about how to respond.",
      "At about 03:00 on 19 September the propellant exploded, destroying the complex, killing one airman and injuring around twenty.",
      "The warhead was thrown roughly 100 feet outside the entry gate. Its safety features worked and there was no nuclear yield and no radioactive release.",
      "The official posture through the night was to neither confirm nor deny that a warhead was present, in a county whose residents could see the site from their homes.",
    ],
    whatHappened:
      "The Air Force maintained neither-confirm-nor-deny while local officials evacuated on their own judgement. The disagreement between the site and the command chain was never resolved before the tank failed.",
    afterward:
      "The Titan II force was retired over the following seven years. The accident became the standard case for why the people closest to a hazard need standing authority to act without waiting for a chain of command that cannot see the site.",
    actors: [
      {
        id: "SU",
        wants: "To establish whether unusual activity at an American missile complex is a fault or a readiness change, before their own watch officers have to characterise it in writing.",
        fears: "American safety measures that generate exactly the indicators a preparation would generate, leaving them to guess correctly under time pressure.",
        constraint: "They cannot ask you directly without revealing how closely they are watching and by what means.",
      },
      {
        id: "UK",
        wants: "The neither-confirm-nor-deny formula to come through the night intact, because its own basing arrangements at home rest on the same sentence.",
        fears: "A precedent in which warhead presence is effectively disclosed under local political pressure, which is a pressure its own constituencies already know how to apply.",
        constraint: "Its public would ask the identical question the Arkansas county is asking, and its government has no better answer prepared.",
      },
      {
        id: "FR",
        wants: "Evidence that a superpower's arsenal can suffer an accident and be contained, since its own argument for an independent force assumes these things are manageable.",
        fears: "An accident that reopens the European argument about foreign weapons stationed on European ground.",
        constraint: "It cannot criticise American custody practice without inviting the same scrutiny of its own, and it sits outside the command arrangement that would let it ask quietly.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Vapour is accumulating in a confined space while a crew at the gate and commanders far away recommend opposite actions, and the person deciding cannot see the tank." },
      { horizon: "weeks", line: "A county that evacuates on its own judgement while you neither confirm nor deny has answered the question in public, with your silence cited as the reason it had to." },
      { horizon: "years", line: "Neither-confirm-nor-deny is one policy applied to reporters, allies and neighbours alike. Break it once for a plume and it becomes a policy with exceptions, and every government hosting your weapons will ask for its own." },
    ],
    unknowns: [
      {
        question: "Whose picture of the tank is accurate, the crew at the gate or the command chain?",
        whyItMatters: "The two are recommending opposite actions and only one is describing the actual state of the complex. Until you know which, any order you give is a bet on a chain of command rather than on a hazard.",
        settledBy: "intelligence",
      },
      {
        question: "Will the county evacuate whether or not you say anything?",
        whyItMatters: "If it will, silence protects no secret and only removes you from the record of who warned people. If it will not, your words are the only thing that moves anyone away from the fence.",
        settledBy: "diplomacy",
      },
      {
        question: "Is anyone else's warning staff reading tonight's activity as an accident?",
        whyItMatters: "The measures you would take at the complex generate traffic and movement that arrive at a rival's watch floor as something else. If they are reading it wrong, the cheapest correction is telling them plainly before you act, not after.",
        settledBy: "diplomacy",
      },
    ],
    theTrap: "Neither confirm nor deny was written for a reporter, not for a sheriff standing under a plume. Holding the formula is free right up to the moment people evacuate on their own judgement, and after that the formula is simply the thing they know you chose over telling them.",
  },
  "kursk-2000": {
    headline: "Your submarine is on the bottom and foreign rescue has been offered in public.",
    situation:
      "An explosion in the forward compartment put her down during an exercise. Your own submersibles have failed twice in poor conditions. Norway and Britain have offered help, publicly, which makes refusing a public act too. Some of the crew are alive aft and nobody can tell you for how long.",
    youAre: "You are the President of the Russian Federation, deciding how much of your newest hull foreign divers may see.",
    decision:
      "Accept the offered help now, keep trying with your own equipment, or accept it quietly and late.",
    stakes:
      "Accepting is an admission that you cannot reach your own sailors. Refusing is an admission about what you are protecting instead.",
    facts: [
      "On 12 August 2000 an explosion in the forward torpedo compartment of the Kursk was followed roughly two minutes later by a much larger detonation. She sank in about 108 metres of water with 118 aboard.",
      "The official inquiry attributed the first explosion to a leak of high-test peroxide from a practice torpedo with a faulty weld.",
      "23 men survived in the aft ninth compartment for some hours and left written notes.",
      "Both reactors scrammed and remained stable throughout. The nuclear risk was never the issue; the rescue was.",
      "Russian submersibles failed repeatedly in poor conditions. Norwegian and British offers of assistance were not accepted for days; Norwegian divers opened the aft hatch on 21 August, nine days after she sank, within hours of finally being allowed to try.",
    ],
    whatHappened:
      "Foreign help was accepted after several days. Norwegian divers reached the aft compartment quickly once permitted; everyone aboard had already died.",
    afterward:
      "The delay, not the accident, defined the event politically and became a lasting case study in how secrecy about capability trades against the lives the capability exists to protect.",
    actors: [
      {
        id: "UK",
        wants: "Its rescue vehicle in the water while there is still a reason to put it there, since the offer is public and the delay has become a story in its own parliament too.",
        fears: "Arriving too late and being cited afterwards as proof that Western help would not have made a difference, which retires the argument for offering it next time.",
        constraint: "It cannot move a metre without permission and cannot say so bluntly, because naming the refusal makes it a humiliation Moscow will harden against.",
      },
      {
        id: "US",
        wants: "A cause established on the record that is a weapon fault rather than a collision, because a collision finding points at its own submarines operating in the same water.",
        fears: "A Russian government that finds it politically cheaper to blame a foreign submarine than to explain a faulty weld, and then cannot climb down from it.",
        constraint: "Any help it offers reads in Moscow as an interest in the wreck, which is precisely the suspicion already blocking the rescue.",
      },
      {
        id: "CN",
        wants: "To see whether Russia will let NATO divers near a first-line hull, because the answer prices every future purchase and every future assurance about Russian secrecy.",
        fears: "A Russian decision that makes foreign access to sensitive equipment look routine, since its own future accidents would then be measured against it.",
        constraint: "It has nothing to offer that would help, so it can only watch and draw conclusions.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Every hour spent on another attempt with your own equipment is an hour taken from whatever the aft compartment has left, and you will never learn which hour was the last one." },
      { horizon: "weeks", line: "Foreign divers who open the hatch and find no one alive will have demonstrated, on camera and in one afternoon, both that help was available and that it was late." },
      { horizon: "years", line: "A navy that refuses rescue to protect a hull teaches every other navy what to expect when the crew is theirs, and the offers stop being made at all." },
    ],
    unknowns: [
      {
        question: "Are the men in the aft compartment still alive tonight?",
        whyItMatters: "If they are, the calculation is hours against secrecy and nothing else enters it. If they are not, you are deciding what the recovery looks like, and speed buys far less than it appears to.",
        settledBy: "intelligence",
      },
      {
        question: "Will the foreign teams accept written limits on what they may see and record?",
        whyItMatters: "If they will, the objection you are actually holding out on disappears and the refusal has nothing left to stand on. If they will not, you are trading a hull's worth of design against a chance, and you should at least know that is the trade.",
        settledBy: "diplomacy",
      },
      {
        question: "If your own submersibles fail again tonight, will anyone still accept that the delay was technical?",
        whyItMatters: "The refusal is affordable only while it can be described as an operation in progress. After another failure it becomes a decision on the record, and the political cost you were avoiding arrives anyway with the deaths attached to it.",
        settledBy: "hold",
      },
    ],
    theTrap: "The choice presents itself as secrecy against sailors, and secrecy is the variable you can still control at two in the morning, so it wins by default. The cost is not the secret. It is that every hour spent protecting it is drawn from twenty-three men's air, and you will be asked to account for the hours in that currency.",
  },
  "sverdlovsk-1979": {
    headline: "A release from one of your own facilities is killing people downwind.",
    situation:
      "District hospitals are seeing a pattern they cannot explain and it points at a military compound on the edge of the city. The treaty you signed seven years ago says the programme behind that fence does not exist. There is a story available about contaminated meat, and it will hold.",
    youAre: "You are the leadership of the Soviet Union, choosing between the treaty and the district.",
    decision:
      "Admit enough to get the district treated properly, find out first what actually left the fence, or let the cover story do the work.",
    stakes:
      "The cover story works. That is the problem with it: it will keep working for years, and every year it works the eventual correction costs more.",
    facts: [
      "In early April 1979 an accidental airborne release of anthrax spores occurred at a Soviet military microbiology facility, Compound 19, in Sverdlovsk.",
      "At least 66 people died — the deadliest inhalational anthrax outbreak on record. Roughly 77 to 96 human cases were identified; totals remain contested because the KGB confiscated hospital and autopsy records.",
      "The Soviet Union had signed the Biological Weapons Convention in 1972. The facility's existence was inconsistent with it.",
      "Authorities publicly blamed contaminated meat sold on the black market and maintained that account for 13 years.",
      "The truth was acknowledged in 1992. A 1994 epidemiological study of the case locations showed they lay along a single narrow downwind plume on one afternoon — the geometry the meat story could never explain.",
    ],
    whatHappened:
      "The meat story was adopted and held. Victims were treated for what the state said they had, records were confiscated, and the district was told it was a food outbreak.",
    afterward:
      "Russia acknowledged the release in 1992. The thirteen-year gap became the standard argument for why verification regimes need access rather than assurances, and it damaged confidence in the convention for a generation.",
    actors: [
      {
        id: "US",
        wants: "Enough of a case to name the compound without showing how it learned anything.",
        fears: "A public accusation you can rebut with your own hospital records, which would validate the meat story and make every future compliance charge cheap to dismiss.",
        constraint: "Its evidence cannot be displayed, and it has an arms-control agenda that a public rupture over this would cost it at home.",
      },
      {
        id: "UK",
        wants: "The convention used to force a verification mechanism into existence rather than merely to score a point.",
        fears: "The treaty being shown to have no mechanism at all, which quietly tells every signatory that restarting costs nothing.",
        constraint: "As co-depositary it must move alongside Washington and cannot get ahead of a partner that is weighing other business with you.",
      },
      {
        id: "CN",
        wants: "Evidence that Soviet military facilities sited near populations are unsafe, which is useful in an argument it is already having about the border.",
        fears: "Anything that increases your incentive to move that category of work further east and closer to it.",
        constraint: "It can verify nothing independently, so anything it says is dismissed as propaganda before it is examined.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Inhalational anthrax has a treatment window measured in days. Every hour the district is treated for a food-borne illness is an hour spent on the wrong medicine." },
      { horizon: "weeks", line: "Confiscated records make the cover story true inside your own system. Within weeks your ministries are briefing you from files that agree with the lie, and you lose the ability to check it yourself." },
      { horizon: "years", line: "A story that holds for thirteen years converts an accident into a demonstration that a treaty signature means nothing, and the states that were still deciding whether to build a programme will have their answer." },
    ],
    unknowns: [
      {
        question: "Which districts lie along the path the release took, and how many people there are still inside the window where treatment works?",
        whyItMatters: "If the window is open, an admission narrow enough to reach the hospitals saves lives and costs a secret. If it has closed, you are only choosing what the record will say, which is a different and much smaller decision.",
        settledBy: "intelligence",
      },
      {
        question: "Would a quiet notification to the convention's depositaries buy any protection, or simply hand them the case?",
        whyItMatters: "A limited private admission might keep the treaty alive and keep the accusation off the public record. It also converts a rival's suspicion into a rival's evidence. Which one it does depends on what they already hold, and the only way to find out is to talk to them.",
        settledBy: "diplomacy",
      },
      {
        question: "Can the district be treated correctly without the treatment itself naming the source?",
        whyItMatters: "If the medicine and the quarantine can be delivered under an ordinary public-health framing, the choice between the district and the treaty is not the choice you think you are making. If they cannot, it is exactly that choice and you should make it deliberately.",
        settledBy: "hold",
      },
    ],
    theTrap: "Adopting the cover story feels like a decision you can revisit when the pressure comes off. It is not. Every chart written with the wrong cause and every file taken from a hospital makes the second version more expensive than the first. A cover story that fails is a scandal. A cover story that works is a debt, and it compounds.",
  },
  "juarez-cobalt-1984": {
    headline: "A medical source was sold for scrap and the metal is already in circulation.",
    situation:
      "A disused radiotherapy head went to a junkyard, was broken open, and went into a foundry. The steel it became has been shipping for weeks as ordinary things — reinforcing bar, table legs — and the first detection was an accident at a laboratory gate. Nobody has a list of where it went.",
    youAre: "You are the President of the United States, holding a contamination problem that arrived through commerce.",
    decision:
      "Map the distribution before announcing anything, work the neighbouring government that did not cause this and will be blamed for it, or let the metal keep moving.",
    stakes:
      "Contamination travels through a supply chain faster than any agency can follow it, and a recall you announce before you understand is a recall of everything.",
    facts: [
      "A teletherapy unit bought by a private hospital in Ciudad Juárez in 1977 and never commissioned was dismantled for scrap on 6 December 1983, spilling roughly six thousand cobalt-60 pellets into the scrap stream.",
      "Foundries melted the material into an estimated 6,000 tonnes of contaminated rebar and cast products, distributed across 17 Mexican states and exported.",
      "It went undetected for six weeks. The discovery on 16 January 1984 was an accident: a truck carrying contaminated rebar took a wrong turn at Los Alamos and set off a portal monitor.",
      "Estimates of exposed persons run to around 4,000, and 109 houses in Sinaloa were demolished.",
      "No detection system was looking for this. The one that found it was pointed at something else entirely.",
    ],
    whatHappened:
      "Both governments traced and recovered what they could once the portal monitor gave them the thread. Contaminated product had already been installed in buildings on both sides of the border.",
    afterward:
      "Radiation portal monitors were installed at scrap yards and border crossings across North America — the practice now standard worldwide — because the only reason this was caught at all was one monitor at a laboratory gate and a wrong turn.",
    actors: [
      {
        id: "NS",
        wants: "The number, meaning how long strong material moved through ordinary commerce before anything noticed. Six weeks is a finding, and the finding is now public.",
        fears: "A detection regime built at scrapyards and border crossings in response, because that is the one change that would stop ordinary commerce being useful cover.",
        constraint: "It needs the scrap trade to stay unremarkable, and anything done with that route would summon exactly the monitoring the route depends on not existing.",
      },
      {
        id: "CR",
        wants: "Commercial crossings to keep moving at their current speed while this is handled quietly.",
        fears: "Portal monitors becoming permanent and universal at those crossings, since that instrument does not care what it was installed to look for.",
        constraint: "It cannot lobby, object, or be seen to have a view, and its own freight moves inside the legitimate traffic it cannot afford to have stopped.",
      },
      {
        id: "SU",
        wants: "An American public argument about domestic radiation risk that it did not have to start and does not have to join.",
        fears: "An international push for source registries and accounting that it would then be pressed to sign, opening its own inventories to questions.",
        constraint: "It has uninventoried material of its own and no wish to discover, in public, how much.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "You can halt cross-border freight tonight, and halting it is itself the announcement. The market learns before you have any list of where the metal went." },
      { horizon: "weeks", line: "Rebar goes into foundations. Within weeks this stops being a recall and becomes a demolition programme, house by house, in a country that did not cause it." },
      { horizon: "years", line: "Whatever detection regime comes out of this is the one the world keeps. If it ends up at laboratory gates rather than at scrapyards and crossings, the next orphan source gets the same six weeks." },
    ],
    unknowns: [
      {
        question: "How much of the material is already cast into buildings rather than still in transit?",
        whyItMatters: "Metal in transit can be stopped with a phone call and a manifest. Metal in a foundation is a demolition budget and a negotiation with another government. The two problems require opposite announcements, and you can only make one first.",
        settledBy: "intelligence",
      },
      {
        question: "Will the neighbouring government run this as a joint trace or as a defence of its own industry?",
        whyItMatters: "A joint trace gives you the foundry records, which are the only real list that exists. A defensive one leaves you announcing a recall you cannot enforce across the border, which is the version that stops the metal nowhere.",
        settledBy: "diplomacy",
      },
      {
        question: "Was the unit that was broken open the only uninventoried source at that hospital?",
        whyItMatters: "If it was, this is a recovery operation with a definable end. If it was not, you are announcing the wrong scope tonight and will have to widen it in public later, which is how a contamination problem turns into a credibility problem.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "The instinct is to announce quickly so nobody can charge you with sitting on it. An announcement without a distribution map is a recall of everything, which is the same as a recall of nothing, and it spends the cooperation of the only government that can actually find the metal. The delay you fear being blamed for is shorter than the one your announcement causes.",
  },
  "maultsby-1962": {
    headline: "One of your aircraft is lost deep inside Soviet airspace on the worst day of the crisis.",
    situation:
      "A routine air-sampling flight over the pole navigated by the stars, lost its references in an aurora, and came out somewhere it should never have been. Soviet interceptors are climbing toward him. Your own fighters are going out to meet him, carrying what everything is carrying this week. He is running out of fuel.",
    youAre: "You are the President of the United States, on the day both sides believe the other may already have decided.",
    decision:
      "Tell Moscow what this is before they decide for themselves, or say nothing and let an aircraft nobody can explain fly out on its own.",
    stakes:
      "On a day like this your own routine operations are the likeliest cause of the next crisis, and an unexplained penetration is indistinguishable from a last look before a strike.",
    facts: [
      "On 27 October 1962 — Black Saturday — a US Air Force U-2 on a routine air-sampling mission lost its celestial navigation references, an intense auroral display being the reason usually given, and drifted roughly 300 miles into Soviet airspace over Chukotka.",
      "Soviet air defence scrambled interceptors. American F-102s launched to escort him home and, under the crisis dispersal posture, were carrying nuclear-tipped air-to-air missiles.",
      "The same day a U-2 was shot down over Cuba and a Soviet submarine crew argued about a nuclear torpedo. Three separate paths to war ran in parallel within hours of each other.",
      "Ground controllers talked the pilot out by star reference. He landed short of fuel on the Alaskan coast with the engine out.",
      "Kennedy's recorded reaction on being told was that there is always some son of a bitch who does not get the word.",
    ],
    whatHappened:
      "Nobody fired. Controllers walked the pilot home, the interceptors never made contact, and Khrushchev raised the intrusion in writing the next day — noting that it could have been taken for a bomber and asking what would have followed.",
    afterward:
      "The incident is the standard illustration that in a crisis the dangerous events are not the planned ones. Routine operations continued during the crisis because nobody had the authority or the inclination to stop them.",
    actors: [
      {
        id: "SU",
        wants: "To get to the end of this day with the Cuba bargain still alive, and to have the Chukotka penetration answered in writing tomorrow rather than settled by whoever is airborne tonight.",
        fears: "Not the aircraft. That its own regional air defence acts on standing authority again — as it already did over Cuba this morning without Moscow's order — and hands Washington a shooting incident on Soviet soil that Moscow never chose and cannot disown.",
        constraint: "Moscow can reach a foreign capital faster than it can reach a commander on its own eastern periphery. Its ability to write a letter is better than its ability to stop a scramble.",
      },
      {
        id: "CU",
        wants: "A written guarantee against invasion, not a superpower understanding reached over its head and announced afterwards.",
        fears: "Being traded. That Moscow settles directly with Washington and the units on the island become the currency rather than the subject.",
        constraint: "Some of the shooting is being done by crews Havana does not command. It carries the blame for escalation it can neither order nor stop.",
      },
      {
        id: "UK",
        wants: "To hear about American alert changes before the wire services do, and to be the ally that was consulted rather than the one that was informed.",
        fears: "Being carried to the brink by an American operation nobody mentioned, and having to account for it to a Parliament that was told the alliance works differently.",
        constraint: "Its own bomber force went to readiness alongside the Americans without a formal request. London cannot object to being tied in without conceding in public that it already is.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "If your fighters and theirs meet over Soviet territory, the first shot of the war is fired by a lost pilot who is low on fuel and not sure which country is below him." },
      { horizon: "hours", line: "Silence leaves Moscow to write the explanation. On this day the explanation they write is a last look before a strike." },
      { horizon: "weeks", line: "Every routine flight now needs political sign-off, and the reconnaissance that told you what was on the island stops telling you anything at the moment you most need it verified." },
      { horizon: "years", line: "Whatever you say tonight about who authorised this becomes the standard they apply to your next accident, and the standard you are held to when it is their aircraft over your coast." },
    ],
    unknowns: [
      {
        question: "Does Moscow read this as a navigator who lost his stars, or as a look at targets before a strike?",
        whyItMatters: "If they read it as lost, saying nothing costs nothing and the aircraft comes home. If they read it as a last look, silence is the confirmation. The answer decides whether tonight's message is about Cuba or about a piece of Siberia you had not thought about until an hour ago.",
        settledBy: "diplomacy",
      },
      {
        question: "Which of today's three incidents does Moscow actually control?",
        whyItMatters: "Punishing them for something a local commander did on his own authority buys a war over a mistake. Treating a deliberate order as a mistake buys you the next one, larger.",
        settledBy: "intelligence",
      },
      {
        question: "How many other routine operations are still running tonight because nobody thought to stop them?",
        whyItMatters: "If the answer is more than one, the right move is not the phone call. It is standing everything down before the next accident arrives while you are still explaining this one.",
        settledBy: "hold",
      },
    ],
    theTrap: "The instinct is to establish what happened before you say anything, because a wrong statement about your own aircraft is unrecoverable. But the aircraft is still flying while you check, and the only account the other side can act on is the one they assemble themselves. Explaining an embarrassment you have not finished investigating is cheaper than letting them finish the investigation for you.",
  },
  "przewodow-2022": {
    headline: "Two people are dead on allied soil and the one confirmed fact is misleading.",
    situation:
      "A missile came down in a border village during a large barrage and killed two farm workers. The only confirmed detail is that it was of Russian manufacture — true, and also what the defending side flies. Wire copy citing an anonymous official already says Russia hit NATO. Trajectory analysis is hours away; the treaty consultation clock is not.",
    youAre: "You are the President of the United States, on a video call with allies who are waiting for you to characterise this.",
    decision:
      "Wait for the trajectory, say publicly what you do not yet know and deflate the pressure, or answer the wire story rather than the event.",
    stakes:
      "Being publicly slow is a decision, and it is one you have to make within the hour. A technically true fact is doing more work here than any false one could.",
    facts: [
      "On 15 November 2022 a missile struck a grain facility in Przewodów, Poland, about six kilometres from the Ukrainian border, killing two people.",
      "Polish officials confirmed only that the missile was of Russian manufacture — accurate, and misleading, because Ukraine operates Soviet-designed air defences.",
      "Within hours US and NATO assessments based on trajectory data concluded it was most likely a Ukrainian air-defence interceptor that had gone off course.",
      "Leaders meeting at the G20 in Bali held an emergency consultation. President Biden said publicly it was 'unlikely' to have been launched from Russia; NATO's Secretary General attributed it to Ukrainian air defence.",
      "Poland invoked consultation rather than collective defence. Ukraine contested the assessment publicly for a period, which was part of the cost of getting it right quickly.",
    ],
    whatHappened:
      "Leaders chose to be publicly slow. Early, deliberate statements that the evidence did not indicate a deliberate Russian attack deflated the pressure for treaty consultations before it could build.",
    afterward:
      "It is widely regarded as the model case for alliance crisis management: the decisive act was two heads of government publicly lowering the temperature on incomplete information, in the direction of de-escalation, before the analysis was finished.",
    actors: [
      {
        id: "RU",
        wants: "The alliance to spend tonight arguing about attribution instead of about air defence, and to see for itself how little it takes to start that argument.",
        fears: "A consultation that ends with the alliance agreeing to something it has been refusing for months. An accident that produces more air defence in Ukraine is worse for Moscow than a strike that produces none.",
        constraint: "It cannot help the true version win. A denial from Moscow is worth nothing as evidence, so on the one occasion when the facts are on its side it has no way to put them there.",
      },
      {
        id: "UK",
        wants: "To be inside the American assessment before that assessment becomes an American statement, and to get the wire story corrected without appearing to referee for Kyiv.",
        fears: "A visible split in which London has characterised the strike one way and Washington characterises it another within the same hour, on the record, from the same summit.",
        constraint: "Its domestic politics reward the forward-leaning line on Ukraine. 'We do not know yet' is the harder sentence to say at home, and it is the correct one.",
      },
      {
        id: "FR",
        wants: "This handled through the alliance's consultation machinery rather than through whichever leader reaches a microphone first in a hotel corridor in Bali.",
        fears: "That an escalatory precedent gets set by press conference — that the threshold for treaty consultation is established, permanently, by an unverified adjective spoken under deadline.",
        constraint: "French insistence on process reads as reluctance to allies further east. Arguing for slowness costs credibility with exactly the people the missile landed near.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Characterise it as a Russian strike and the trajectory says otherwise, and you retract on allied soil where two people are dead. Every attribution you make afterwards is discounted by the retraction." },
      { horizon: "weeks", line: "The correction becomes the story. Kyiv contests it in public, and you spend the news cycle appearing to defend Moscow in order to protect the truth." },
      { horizon: "years", line: "You have shown that this alliance verifies before it invokes. That is a real brake on accidents, and it is a discovery your adversary makes on the same night you do." },
    ],
    unknowns: [
      {
        question: "Will the trajectory analysis come back clean, or will it come back as 'most likely'?",
        whyItMatters: "A statement built for certainty cannot survive a probabilistic answer. If the finding will be qualified, you must say tonight what you do not know rather than promise a verdict you will have to hedge tomorrow.",
        settledBy: "intelligence",
      },
      {
        question: "Has Warsaw already decided to invoke consultation regardless of what the evidence shows?",
        whyItMatters: "If they have, your caution reads as restraining an ally on their own soil and you should spend the hour on them, not on the press. If they have not, an early careful statement gives them the cover to choose the lower rung without looking weak.",
        settledBy: "diplomacy",
      },
      {
        question: "Does Kyiv already know this was theirs?",
        whyItMatters: "If they know and contest it anyway, the dispute is a policy choice you can negotiate privately. If they genuinely believe otherwise, the public disagreement lasts as long as their own investigation, and you plan for weeks of it.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "The one fact you have is true, and it is doing the work of a lie. 'Russian-made' will be quoted for a week and corrected in a footnote. A careful person waits for better facts and lets that one stand in the meantime, which is the same thing as endorsing it. Saying what you do not yet know is not a delay; it is the only statement available that does not have to be taken back.",
  },
  "balloon-2023": {
    headline: "A foreign high-altitude balloon is crossing your country right now.",
    situation:
      "It came in over Alaska, transited Canada, and is over the continental United States. Beijing calls it a stray weather craft. Shooting it down over land drops a large payload onto somebody; waiting for the coast means several more days of it on television. Your own command has just worked out that earlier ones crossed undetected.",
    youAre: "You are the President of the United States, being asked why this is still flying.",
    decision:
      "Learn more from it flying than from the wreckage, take it now and accept the debris, or wait for water and spend the days in public.",
    stakes:
      "A gap in what your sensors were tuned to see is not a gap in what was there. The uncomfortable part is not the balloon, it is what the balloon proves about the record.",
    facts: [
      "From 28 January to 4 February 2023 a Chinese-operated high-altitude balloon transited Alaska, Canada and the contiguous United States before being shot down over territorial waters off South Carolina on 4 February.",
      "NORAD's commander later testified that earlier Chinese balloon transits had not been detected at the time, attributing it to 'a domain awareness gap' — radar processing had been rejecting slow, small, high-altitude returns.",
      "After the detection parameters were adjusted, NORAD immediately began seeing objects it had not been seeing before.",
      "Three further objects were shot down over Alaska, the Yukon and Lake Huron between 10 and 12 February. None was ever positively identified.",
      "The payload was recovered from shallow water off South Carolina — an intelligence outcome that would not have been available from a shoot-down over land.",
    ],
    whatHappened:
      "It was allowed to complete its transit and shot down over water, where the payload was recovered. The political cost of the delay was real and the intelligence gain was the argument for it.",
    afterward:
      "The filter change is the lasting part: adjusting what the radars were willing to report turned an empty sky into a busy one, and the three February shoot-downs that followed were the immediate consequence of looking harder.",
    actors: [
      {
        id: "CN",
        wants: "The transit finished and the file closed as a civilian craft that strayed, with the scheduled diplomatic visit still on the calendar.",
        fears: "Recovery of the payload intact. An overflight that ends in the sea and stays deniable is cheap; one that ends in a laboratory prices every future flight and everything already flown.",
        constraint: "The ministry that issued the weather-craft line does not run the programme that flew it. Beijing is defending a version of events its own system never agreed on in advance.",
      },
      {
        id: "RU",
        wants: "The Americans to take it down over their own farmland and spend the next month on the damage rather than on the collection.",
        fears: "The fix that follows. Adjusting what the radar picture accepts closes the same slow, high, small gap over the northern approaches that Moscow also benefits from.",
        constraint: "It cannot say any of this out loud without conceding that the gap was worth something to it too, so it has to watch the repair happen and call it an overreaction.",
      },
      {
        id: "KP",
        wants: "To learn the price of an overflight from someone else's bill before it considers sending anything of its own.",
        fears: "That the American answer to one detection gap is a permanent build-out over the northern approaches, which covers its own launches as a side effect it never provoked.",
        constraint: "It has no civilian cover story for anything it flies. Whatever Beijing gets away with as a weather craft, Pyongyang would own within the hour.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Take it over Montana and a payload the size of a bus lands on somebody's property. You own the first casualty of the surveillance you were trying to stop." },
      { horizon: "weeks", line: "Once the filter is fixed, every slow return is a shoot-down decision. Three more objects come down, none is ever identified, and the public learns you cannot tell them what you fired at." },
      { horizon: "years", line: "You have set the price of a high-altitude overflight at one balloon and one cancelled visit. Everyone with a budget prices the next one against that." },
    ],
    unknowns: [
      {
        question: "Is it collecting, or is it demonstrating that it can?",
        whyItMatters: "If it is collecting, waiting for water and recovering the payload is the whole argument and the political cost is worth paying. If it is a demonstration, the wreckage tells you almost nothing and the days on television are pure loss.",
        settledBy: "intelligence",
      },
      {
        question: "Does the foreign ministry issuing the denial actually know what is on it?",
        whyItMatters: "If they are lying, there is a private conversation that can stop the next one. If they were never told, there is nobody on the other end of the phone with the authority to stop anything, and quiet handling buys you nothing at all.",
        settledBy: "diplomacy",
      },
      {
        question: "How many crossed before this one, and will that number survive being published?",
        whyItMatters: "The number decides whether this is a new provocation to answer or an old failure to admit. Those two stories need opposite public strategies, and you can only run one.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "The shoot-down feels like the decision and it is not. The hard part is what you say about the transits you missed — because the moment you widen what the sensors accept, you will start seeing things you cannot identify, and you will have to fire at some of them in public with nothing recovered afterwards. A gap in what you were tuned to see is not a gap in what was there, and closing it costs you the ability to say, credibly, that you know what is above you.",
  },
  "salisbury-2018": {
    headline: "A military-grade nerve agent has been used on your territory against two people.",
    situation:
      "Two people were found on a bench in a small cathedral city and the laboratory has identified a class of agent only a state programme produces. A police officer is in hospital. Moscow denies everything and demands a sample. You are certain who did this, and the evidence that makes you certain is the evidence you cannot show.",
    youAre: "You are the Prime Minister of the United Kingdom, holding an attribution you believe and cannot fully publish.",
    decision:
      "Build coordinated expulsions and spend weeks doing it, act now on an attribution your allies have not yet seen, or wait for a verification process the accused sits on.",
    stakes:
      "Attribution you are certain of and attribution you can prove are different instruments. Acting alone is fast and cheap for the other side to dismiss.",
    facts: [
      "On 4 March 2018 Sergei and Yulia Skripal were found unconscious on a bench in Salisbury. A police officer, DS Nick Bailey, was also seriously affected.",
      "Porton Down identified a Novichok-class nerve agent within days, and OPCW technical assistance independently confirmed the identification through two designated laboratories.",
      "More than 20 countries expelled Russian diplomats in coordination — the largest collective expulsion of its kind — because the attribution had been shared with allies before it was acted on.",
      "Four months later, on 30 June, Dawn Sturgess and Charlie Rowley were poisoned in nearby Amesbury by a discarded container disguised as a consumer product. Sturgess died on 8 July.",
      "The Amesbury deaths are the part that had nothing to do with attribution: the agent was still in the environment months after everyone had agreed who put it there.",
    ],
    whatHappened:
      "The United Kingdom shared the technical attribution with allies first and then acted, producing a coordinated expulsion by more than twenty countries rather than a unilateral gesture.",
    afterward:
      "The independent OPCW confirmation is what made the coalition possible; the Amesbury deaths four months later showed that response and consequence run on different clocks, and the second one is longer.",
    actors: [
      {
        id: "RU",
        wants: "This to stay a British claim rather than become an allied finding, and the venue to be a verification body it sits on and can slow down.",
        fears: "Coordinated expulsion. Networks take years to rebuild, and a twenty-country response establishes that London can move allies without publishing the sources that convinced them.",
        constraint: "Any denial that concedes the programme ever existed is unacceptable at home. So it must deny in a way that is transparently unbelievable, which loses it every audience that was still undecided.",
      },
      {
        id: "US",
        wants: "To see the technical case before being asked to expel anyone, and to have the identification confirmed by someone other than a British laboratory.",
        fears: "Being the government that expelled on allied certainty that later needed qualifying. The memory of one such case is worth more inside the building than the merits of this one.",
        constraint: "The declared preference at the top of the administration is for a working relationship with Moscow. The expulsion has to be sold internally before it can be sold abroad, and that takes days you would rather spend elsewhere.",
      },
      {
        id: "FR",
        wants: "The international technical route used, so the finding is multilateral and outlives whichever governments happen to be in office.",
        fears: "A precedent that a capital can say 'trust us' and collect expulsions. It expects to be on the receiving end of that standard the next time it makes an accusation of its own.",
        constraint: "Its own chemical-weapons attribution work elsewhere was contested by the same power. France needs the technical body to be seen to work, so it cannot support bypassing it here even when bypassing it would be faster.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "The site is still contaminated and you do not know how much is where. Naming the state tonight does nothing for the people in hospital and starts the clock on a response you have not built." },
      { horizon: "weeks", line: "Act alone and you get expulsions from one capital and sympathy from the rest. Spend the weeks sharing the case first and you get twenty capitals and a rule that a nerve agent on allied soil is a collective matter." },
      { horizon: "years", line: "The agent outlasts the argument. Months after everyone agrees who did it, a discarded container kills someone who never heard of the case. The attribution you won protects nobody from that." },
    ],
    unknowns: [
      {
        question: "Will the international body's designated laboratories confirm the identification independently?",
        whyItMatters: "Confirmation turns your claim into a finding and makes coordinated expulsion possible. Without it you are asking twenty governments to act on your word, and most of them will send one person home and call it solidarity.",
        settledBy: "diplomacy",
      },
      {
        question: "How much of the agent is still in the environment, and in what?",
        whyItMatters: "If it was carried in something disposable and then discarded, the incident does not end when the attribution does. The correct response is a search of a city, not a statement to a chamber, and the two compete for the same week.",
        settledBy: "intelligence",
      },
      {
        question: "Which allies will move only after Washington moves?",
        whyItMatters: "It sets the order of your phone calls. Work the followers first and you burn days before Washington has agreed to anything. Work Washington first and one conversation determines the size of everything that follows.",
        settledBy: "diplomacy",
      },
      {
        question: "Is the demand for a sample a genuine offer or a way into the case?",
        whyItMatters: "Refusing looks like concealment to the audiences you most need to convince. Agreeing hands the accused a way to contest how the evidence was handled. The answer decides which of those costs you choose to pay.",
        settledBy: "intelligence",
      },
    ],
    theTrap: "You are certain, and certainty feels like it should convert directly into action. It does not. The instrument you need is a case other governments can defend in their own parliaments, and building that costs weeks in which you look slow at home while two people lie in hospital. The competent mistake is to act inside forty-eight hours because the public expects it, and to spend the strongest response you have on an audience of one.",
  },
  "fobs-prc-2021": {
    headline: "You flew a partial orbit and Washington is calling it a Sputnik moment.",
    situation:
      "The vehicle went partway round and released a glider that flew a long atmospheric course. Neither half is new; the combination has not been demonstrated before. Your ministry has described it as a routine reusable-spacecraft test. The American chairman has described it as very close to a Sputnik moment. Both statements are about the same object.",
    youAre: "You are the Chairman, holding a capability whose entire value is that nobody can classify it quickly.",
    decision:
      "Explain enough to calm Washington, let both descriptions stand, or repeat the test and settle the question in their favour.",
    stakes:
      "A system worth having because it is ambiguous gets less valuable every time you clarify it, and more dangerous every time you do not.",
    facts: [
      "On 27 July 2021 China conducted a test in which a vehicle was placed into a partial orbit and released a hypersonic glide vehicle that flew a long atmospheric course before impacting some distance from its target.",
      "Neither element was new: the Soviet Union fielded and then retired a fractional orbital bombardment system under SALT II. The combination had not been demonstrated before.",
      "Chairman of the Joint Chiefs Gen. Mark Milley called it 'very concerning' and 'very close' to a Sputnik moment.",
      "China's foreign ministry described the event as a routine reusable-spacecraft test. Both descriptions were issued about the same object within days of each other.",
      "A partial-orbit approach is attractive because it can arrive from the south, where early-warning radars built to look north are thinnest — and telling it from a satellite launch takes hours of orbital determination against a warning timeline of 25 to 30 minutes.",
    ],
    whatHappened:
      "Beijing let both descriptions stand, repeating the routine-test characterisation without addressing the trajectory. Washington's assessment hardened rather than softened.",
    afterward:
      "The test is now the standard citation in arguments about southern-approach warning coverage, and it accelerated exactly the sensor investment that reduces the ambiguity the system depended on.",
    actors: [
      {
        id: "US",
        wants: "A classification it can plan against — specifically, to know whether this is a system that arrives from the south, because that answer decides where a decade of warning coverage gets built.",
        fears: "Not the vehicle. The surprise. That its warning architecture has a direction it does not watch, and that it learned this from someone else's test rather than from its own collection.",
        constraint: "Inside its system, the alarming assessment is the one that gets funded. The incentive runs against reassurance even if Beijing offered it, so a calming briefing has to fight the budget cycle as well as the evidence.",
      },
      {
        id: "RU",
        wants: "The American conversation about southern approaches to stay a conversation about China, and to be left out of whatever arms-control demands come next.",
        fears: "A trilateral framework in which it has to count and declare things it has spent thirty years not counting.",
        constraint: "It fielded and then gave up this class of system under a treaty of its own. It cannot criticise the test without inviting questions about what it kept and what it merely stopped talking about.",
      },
      {
        id: "IN",
        wants: "To know whether the same vehicle can be turned toward the approach it actually cares about, and to have its own warning gap priced honestly before it is asked to fund one.",
        fears: "That Pakistan buys the same ambiguity cheaply once the concept is demonstrated, and that the region ends up with three states that cannot classify each other's launches in the time available.",
        constraint: "Its declared no-first-use posture makes a warning-driven build-out awkward to explain as anything but a response to China, which is the one framing it has spent years avoiding.",
      },
    ],
    consequences: [
      { horizon: "hours", line: "Nothing breaks tonight, and that is the finding. A system that takes hours to classify has already spent the warning time before anyone has decided anything." },
      { horizon: "weeks", line: "Washington's assessment hardens, because the alarming reading is the one their process rewards. Your routine-test line stops being an alternative explanation and becomes evidence of concealment." },
      { horizon: "years", line: "Southern-approach warning coverage gets built and paid for, permanently. You bought ambiguity for one test and handed the other side the argument for closing the gap that made ambiguity worth having." },
    ],
    unknowns: [
      {
        question: "Would a technical briefing lower their estimate, or only tell them what to build against?",
        whyItMatters: "If a briefing lowers the estimate, then ambiguity is costing you more than it earns and you should spend it now. If it only sharpens what they build, silence is correct and you should stop revisiting the question every week.",
        settledBy: "diplomacy",
      },
      {
        question: "Do they read a partial-orbit approach as a first-strike system or as an answer to their missile defences?",
        whyItMatters: "The first reading buys a defensive build-out and a harder posture. The second buys stability and costs you little. You cannot correct a reading you have not confirmed they hold, and correcting the wrong one makes things worse.",
        settledBy: "intelligence",
      },
      {
        question: "How long can both descriptions stand before the gap between them is itself the message?",
        whyItMatters: "There is a point where saying nothing stops being ambiguity and becomes an admission. Passing it costs you the option of explaining at all, because after that any explanation is read as a retreat.",
        settledBy: "hold",
      },
    ],
    theTrap: "Ambiguity is an asset that pays only while the other side is still undecided. Their assessment will settle, and it will settle on the alarming reading, because that is the reading their system funds. Then you are holding a capability with all the cost of a declared one and none of the deterrent credit. The mistake is believing you can reopen the question later by explaining; by the time you try, the explanation reads as a walk-back and confirms the worst version.",
  },
};

export function briefFor(id: ScenarioId): ScenarioBrief | null {
  return SCENARIO_BRIEFS[id] ?? null;
}
