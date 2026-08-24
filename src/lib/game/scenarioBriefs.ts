import type { ScenarioId } from "./scenarios";

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
      "NORAD's commander later testified that earlier balloon transits had gone undetected because radar processing was rejecting slow, small, high-altitude returns -- 'a domain awareness gap.' Once the filters were changed, the tracks appeared immediately.",
      "Beginning 6 December 2023, unmanned aircraft operated over Joint Base Langley-Eustis on roughly 17 separate nights. No operator was ever identified, and some F-22s were moved to another base.",
      "NORAD's counter-drone remit was written for an 'attack of national consequence'; NORTHCOM had no authority to act, and base commanders owned the problem inside the fence and nothing outside it.",
      "In the New Jersey drone flap of November and December 2024, thousands of reports were jointly assessed by four federal agencies as lawful commercial, hobbyist and police aircraft plus misidentified manned planes.",
    ],
    precedent:
      "The balloon and drone incursions of 2023-2024: one real intrusion the sensors were not tuned to see, followed by a wave of reports that were mostly nothing.",
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
      "Western governments read the allegation as a possible pretext rather than a warning -- an accusation constructed in advance to justify something later.",
      "Public American assessments through late 2022 held that no decision to use a nuclear weapon had been taken, while treating preparation indicators as a standing collection priority. Both halves of that sentence were doing work.",
    ],
    precedent:
      "The October 2022 dirty-bomb allegation: managing what other capitals believe you are about to do, when they are wrong and you cannot prove a negative.",
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
      "A lofted trajectory -- flown steeply so the missile lands in nearby water -- demonstrates energy without demonstrating range. The tests of July 2017 and November 2022 were both flown that way.",
      "North Korea conducted six nuclear tests between 2006 and 2017 and none since. The pause is itself a form of message.",
      "In 2017 state media declared a high-altitude electromagnetic pulse capability. No independent assessment has confirmed it, and its value depends entirely on not being tested.",
    ],
    precedent:
      "The lofted-test pattern since 2017: the programme's leverage is what cannot be ruled out, and a full-range demonstration spends exactly that.",
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
      "Since 1992 the two states have exchanged lists of their nuclear installations every 1 January under an agreement not to attack them. Neither has ever missed a year -- not during the 1999 Kargil fighting, not in 2019, not in any of the crises since.",
    ],
    precedent:
      "Kargil (1999) and the 2019 exchange: two nuclear neighbours with almost no decision time and a doctrine that has never had to survive a bad night.",
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
      "The IAEA's leverage is access. When monitoring cameras were removed in June 2022 the agency said it had lost continuity of knowledge -- a gap that cannot be filled in retrospectively.",
      "Israel struck Iraq's Osirak reactor on 7 June 1981 and a suspected reactor at Al-Kibar in Syria on 6 September 2007. Neither strike was preceded by a public warning to anyone.",
    ],
    precedent:
      "Osirak (1981) and Al-Kibar (2007): in the record, the decision to pre-empt is usually taken by the other government, on a clock you cannot see.",
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
      "Central Iran is roughly 1,600 km from Israel, which makes any strike package dependent on aerial refuelling -- and tanker movements are visible to satellites days in advance.",
    ],
    precedent:
      "Osirak (1981), Al-Kibar (2007), and what happened in Iraq afterwards: pre-emption buys time, and the record disagrees sharply about how much.",
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
      "On 24 January 1961 a B-52 broke up over Goldsboro, North Carolina and released two thermonuclear bombs. One came down intact under a parachute; the other broke apart in a swamp, and its secondary stage was never recovered -- the Air Force bought rights to the ground rather than keep digging.",
      "A 1969 Sandia review of that weapon, declassified in 2013, concluded the design 'did not possess adequate safety for the airborne alert role in the B-52.' The public statement at the time had been that there was no danger.",
      "On 17 January 1966 a B-52 collided with a tanker over Palomares, Spain. Two of four bombs had their conventional explosive detonate on impact, scattering plutonium over roughly 2 km2 of farmland; about 1,750 tons of soil were shipped to South Carolina.",
      "The fourth Palomares weapon was found because a local fisherman gave a bearing on where it had entered the water. It was recovered on 7 April, 80 days after the crash, from around 2,700 feet.",
      "No accident of this kind has ever produced a nuclear detonation. The harm is contamination, cost, and what a commander says in the first hours on incomplete data.",
    ],
    precedent:
      "Goldsboro (1961) and Palomares (1966): the physical event is over in seconds, and everything that follows is a disclosure problem.",
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
      "For those 36 hours the accounting system said the warheads were in a bunker. The failure was not the flight -- it was learning that the inventory did not inventory anything.",
      "Four commanders were relieved and many personnel decertified. Restoring confidence and stripping out experience turned out to be the same action.",
      "On 5 December 1965 an aircraft carrying a nuclear bomb rolled off the deck of USS Ticonderoga into roughly 16,000 feet of water. The loss was concealed for years, and when the location's proximity to Japan became clear in 1989 it produced a far larger crisis than an early admission would have.",
      "Between 1992 and 1994 three separate insider thefts of weapon-usable material surfaced in Russia. All the material was recovered, and every thief was an amateur who stole first and went looking for a buyer afterwards.",
    ],
    precedent:
      "Minot (2007) and the Ticonderoga loss (1965): custody failures where the only clock that mattered was the reporting clock.",
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
      "The United Kingdom has kept at least one armed ballistic missile submarine at sea continuously since April 1969 -- more than fifty years without a gap.",
      "Every patrol carries a handwritten letter from the Prime Minister with instructions for what to do if national command no longer exists. The letters are destroyed unopened when a Prime Minister leaves office, so nobody has ever read one.",
      "On 24 November 1961 every communications link between SAC headquarters, NORAD and the three early-warning radars failed at once. Because the links were deliberately routed independently, their simultaneous failure was itself read as evidence of attack and bombers were readied.",
      "The 1961 cause was a single relay station in Colorado through which the supposedly independent routes all happened to pass.",
      "On 12 August 2000 the submarine Kursk sank with 118 aboard. Twenty-three men survived for some hours in the aft compartment; domestic rescue attempts failed repeatedly and foreign offers of help were not accepted for days.",
    ],
    precedent:
      "The 1961 blackout and the Kursk (2000): silence that could be a fault, an evasion, or the thing the letters were written for.",
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
      "Employment rests with the President alone. There is no second signature in the French chain -- a different design choice from the American two-person rule, made deliberately and never revisited.",
      "NATO's nuclear planning group has existed since 1966. France has never joined it.",
    ],
    precedent:
      "The 1966 withdrawal from the integrated command: an independent deterrent is only independent on the first day that independence is inconvenient.",
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
      "On 11 January 2007 China destroyed one of its own weather satellites, producing more than 3,000 trackable fragments -- still the largest single debris event on record.",
      "On 15 November 2021 a Russian test destroyed a defunct satellite and produced roughly 1,500 trackable pieces. The crew of the International Space Station sheltered in their return capsules as the cloud passed.",
      "A satellite failing on its own looks identical from the ground to a satellite being attacked, for hours. The catalogue tells you an object stopped reporting, never why.",
      "Starfish Prime in 1962 killed satellites indiscriminately over the following months: Transit 4B stopped transmitting on 2 August 1962, TRAAC on 14 August, and Britain's Ariel 1 was crippled within days. None were targets; all were casualties of a belt of trapped electrons that lasted years.",
    ],
    precedent:
      "The 2007 and 2021 anti-satellite tests, and Starfish Prime: losing a sensor is unambiguous, and losing it for a reason is not.",
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
      "On 27 July 2021 China tested a vehicle that entered a partial orbit and released a hypersonic glide vehicle which then flew a long atmospheric course. Neither element was new -- the Soviet Union fielded and retired a fractional orbital system under SALT II -- but the combination had not been demonstrated.",
      "The Chairman of the Joint Chiefs called it 'very close' to a Sputnik moment. China's foreign ministry described it as a routine reusable-spacecraft test. Both statements were made about the same object.",
      "A partial-orbit approach is attractive precisely because it can arrive from the south, where early-warning radars built to look north are thinnest.",
      "Telling a satellite insertion from a partial-orbit weapon takes hours of orbital determination, against a warning timeline of 25 to 30 minutes for an ordinary intercontinental trajectory. The boost phase looks the same either way, and the hours are the problem.",
    ],
    precedent:
      "The July 2021 orbital and glide test: a profile whose entire value is that it cannot be classified quickly.",
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
      "In early 2020 a pair of Russian satellites shadowed an American reconnaissance satellite closely enough that the head of the US Space Force described the behaviour publicly as unusual -- an unusual step in itself.",
      "An inspection pass and an attack run share a trajectory until the last moments. There is no approach that reassures the owner, because the reassuring version looks the same from their console.",
      "Blinding early warning is one of the classic indicators of preparation for a first strike. That makes a close approach to a warning satellite an announcement of intent whatever the intent actually is.",
    ],
    precedent:
      "The 2015 and 2020 close approaches: an ambiguity built into orbital mechanics rather than into anybody's intentions.",
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
      "On 15 November 2022 a missile killed two people in the Polish village of Przewodow, about six kilometres from the Ukrainian border. Poland confirmed only that it was of Russian manufacture -- true, and misleading, because Ukraine flies Soviet-designed air defences.",
      "Within hours the American president said publicly it was 'unlikely' to have been launched from Russia and NATO's Secretary General attributed it to Ukrainian air defence. The decision was to be publicly slow, and it deflated the pressure for treaty consultations.",
      "Ukraine contested that assessment in public for weeks. An ally disagreeing loudly is part of the price of getting it right quickly.",
      "Article 4 is consultation and Article 5 is collective defence. The distance between them is where an alliance decides how large something is going to be.",
    ],
    precedent:
      "Przewodow (2022): the only modern case where treaty machinery met a live attribution question, and the winning move was refusing to be fast.",
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
      "The Washington-Moscow link has never been a telephone. It was teleprinter, then fax, then secure computer -- text throughout, deliberately, so that what arrives can be verified rather than merely recognised.",
    ],
    precedent:
      "The design of the Washington-Moscow link: it was never a red telephone, and this scenario is the reason why.",
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
      "In Surat in September 1994 an estimated quarter of the city's population fled within days of a reported plague outbreak -- several hundred thousand people, including a large share of its doctors and administrators.",
      "Emergency reserves are sized against a planning scenario, never against the day. Every allocation is defensible in advance and indefensible afterwards, in public, with names attached.",
    ],
    precedent:
      "Bhopal (1984) and Graniteville (2005): the part of a disaster that is arithmetic, performed live, where the arithmetic has a face.",
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
      "Undersea cables carry over 95% of intercontinental data traffic, and roughly 150 to 200 faults occur worldwide every year -- overwhelmingly from fishing gear and anchors.",
      "In October 2023 a gas pipeline and two telecom cables were damaged in the Gulf of Finland. Investigators concluded a ship's anchor had been dragged across the seabed; establishing whether it was deliberate took months and stayed contested.",
      "Cables break constantly. A cable breaking during a crisis is the same physical event with a different meaning attached, and nothing in the evidence separates them quickly.",
      "When traffic reroutes, reports arrive out of sequence. A calm situation reconstructed from out-of-order reports reads as an escalating one, and the correction always lags the alarm.",
    ],
    precedent:
      "The Baltic seabed damage of 2023: an ordinary annual accident rate meeting a week when nobody can afford to call anything ordinary.",
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
      "The ballistic missile defence test record since 1999 turns repeatedly on discrimination -- telling a warhead from a decoy -- under conditions the tester controls. A scored success is not a forecast.",
      "Three systems agreeing on their confidence while disagreeing on the answer is a measurement of the confidence, not of the answer.",
    ],
    precedent:
      "The 1979 training tape and the 1980 chip failures: the display was authoritative, internally consistent, and completely wrong.",
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
      "Published accounts describe human beings at the final rung -- officers in a hardened facility who would still have to act. Guaranteed retaliation and human judgement are in tension by design, and the design chose both.",
      "The system exists because of the fear of decapitation, which is the same fear that pushes leaders to delegate release authority in advance. Every remedy for one of those problems worsens the other.",
      "On 26 September 1983 the Soviet officer who declined to pass a satellite warning up the chain received no commendation, and retired the following year. Being the human in the loop has never been a career.",
    ],
    precedent:
      "The Perimeter design problem: a mechanism built to work when nobody can answer, now receiving mixed signals about whether anybody can.",
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
      "The 25th Amendment, ratified in 1967, provides for transfer of power but requires written declarations delivered to named officers -- a procedure that quietly assumes the communications are working.",
      "On 30 March 1981, with the President in surgery and the Vice President airborne, the Secretary of State told the press 'I am in control here.' He was constitutionally wrong, and the moment is remembered because the confusion behind it was real.",
      "Nuclear authority depends on there being exactly one answer to who holds it. Two lawful-looking answers is not a legal puzzle; it is an instruction problem at every command post simultaneously.",
    ],
    precedent:
      "The confusion of March 1981 and the succession statute: rules written for a vacancy, applied to an ambiguity.",
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
      "Verification is slower than the news cycle by construction. The Douma inspection team reached Damascus on 14 April 2018 and could not access the site until 21 April -- a week in which a disputed violation only had to be asserted once.",
      "A monitoring channel is the first thing both sides attack once it starts producing findings either of them dislikes. Protecting it costs more than using it.",
      "Punishing an unverified violation may be punishing a fabrication, and fabrications are cheap. The side that wants the pause to collapse only needs to be believed once.",
    ],
    precedent:
      "The Douma dissent (2018): the machinery that could have settled it becoming the thing under attack instead.",
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
      "The track was assessed as non-threatening in about 8 minutes, once it was clearly heading away from Russian territory -- inside the roughly 10-minute window a close-in submarine launch would have allowed.",
      "A single object is more alarming than many: one high-altitude detonation could blind radars immediately before a mass strike, so a lone track reads as the opening move.",
    ],
    whatHappened:
      "No launch order was given and the alert lapsed. President Yeltsin later stated the Cheget nuclear briefcase had been activated.",
    afterward:
      "The severity is genuinely contested \u2014 analysts including Pavel Podvig have argued the alert may never have risen to that level, and Russia has not released records. That dispute is itself part of the lesson.",
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
      "Loring, Wurtsmith, Malmstrom, Minot and Canadian Forces Station Falconbridge -- 5 installations across the northern tier -- filed reports over roughly 3 weeks.",
      "Security police reported visual sightings; some sites reported radar returns. Interceptors were launched and made no identifications.",
      "The reports were documented in NORAD and Air Force message traffic later released under freedom-of-information requests.",
      "No cause was ever established. The candidate explanations \u2014 helicopters, misidentification, deliberate reconnaissance \u2014 were never resolved either way.",
    ],
    whatHappened:
      "No object was ever identified or intercepted, and the reports stopped as abruptly as they began.",
    afterward:
      "The file is a durable example of the harder problem: reports from serious people at serious sites that cannot be confirmed and cannot be dismissed.",
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
      "The ODNI assessment of 25 June 2021 examined 144 US government reports and resolved exactly one -- a large deflating balloon -- leaving 143 unresolved. It stated plainly that the limiting factor was insufficient and inconsistent data, not exotic performance.",
      "In the Nimitz encounter of 14 November 2004, shipboard radar, aircrew eyewitness accounts and infrared targeting-pod video all recorded something, and the sensors did not agree with each other about what.",
      "The doctrinal standard for a launch warning is dual phenomenology: two independent sensor types, working on different physics, agreeing. It exists because one sensor type has been wrong before, repeatedly, in exactly this way.",
      "Public belief moves faster than analysis and does not wait for it. The New Jersey drone flap of late 2024 generated thousands of reports which four federal agencies jointly assessed as ordinary aircraft.",
    ],
    precedent:
      "The 2021 ODNI assessment and the Nimitz case (2004): sensors disagreeing is the normal condition, and the public gets the video first.",
  },
};

export function briefFor(id: ScenarioId): ScenarioBrief | null {
  return SCENARIO_BRIEFS[id] ?? null;
}
