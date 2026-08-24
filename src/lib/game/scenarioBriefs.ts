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
  },
  "airliner-down-2027": {
    headline: "A civilian airliner has been destroyed near your border and everyone is blaming you.",
    situation:
      "Nearly three hundred people are dead. Your own air defence units were active in that sector, and your first reports from them are confused and contradictory in the way first reports always are. You do not yet know whether it was one of your units, a unit you supply, or neither — and every hour you spend finding out is an hour the other explanation hardens into fact.",
    youAre: "You are the President of the Russian Federation, being briefed by people who are not certain and know it.",
    decision: "Deny it flatly, admit the possibility and open an investigation, or say nothing until you actually know.",
    stakes:
      "A denial you later have to withdraw costs more than the admission would have. Waiting for the truth means the story is written by everyone else first.",
  },
  "carrier-collision-2027": {
    headline: "An American destroyer and a Chinese warship have collided. There are dead on both sides.",
    situation:
      "The two ships had been shadowing each other for days in a contested strait. Each navy's account blames the other's helm and both accounts are internally consistent. Neither government wants a war over a steering error, but both have publics who have already seen the pictures and militaries who want to be seen not to blink.",
    youAre: "You are the President of the United States. Your sailors are dead and the Pacific commander wants latitude.",
    decision: "Demand accountability publicly, take it to the hotline privately, or withdraw the patrol and cool the strait.",
    stakes:
      "An accident stays an accident only while both sides want it to. Withdrawing reads as fault, and staying puts the same two crews back in the same water.",
  },
  "boomer-collision-2027": {
    headline: "A British and a French ballistic missile submarine have collided while submerged.",
    situation:
      "Both boats are damaged and both are surfacing. They were hiding from everyone, which includes each other — the patrol areas are among the most closely held secrets either country has, and that secrecy is precisely why neither knew the other was there. Nothing has leaked yet.",
    youAre: "You are the Prime Minister, being told this by the Chief of the Defence Staff before Paris has called.",
    decision: "Disclose jointly with France, disclose alone, or hold it while both boats are recovered.",
    stakes:
      "Two allied deterrents are simultaneously unavailable and that fact is worth a great deal to anyone who learns it. Concealment is defensible for exactly as long as it holds.",
  },
  "petrov-1983": {
    headline: "A Soviet satellite is reporting five American missiles inbound.",
    situation:
      "The new orbital early-warning system has flagged five launches from a single American field and rated the report at the highest confidence it can issue. Ground radar sees nothing at all, and will not see anything for several more minutes even if the report is true. Five is a strange number for a first strike.",
    youAre: "You are the duty officer at Serpukhov-15, outside Moscow. It is just past midnight.",
    decision: "Report this up the chain as a real attack, or record it as a system malfunction on your own authority.",
    stakes:
      "Call it real and you start the retaliation clock on evidence one sensor type can see. Call it false and you are wrong once, at the only moment being wrong is unrecoverable.",
  },
  "able-archer": {
    headline: "NATO's command exercise has stopped behaving like an exercise.",
    situation:
      "The annual Western command-post drill has shifted to new encryption, new message formats and radio-silent procedures nobody has seen before. Your intelligence services have been collecting for months on the theory that the West would use an exercise as cover for a real first strike. This looks like the thing they told you to watch for.",
    youAre: "You are the Soviet leadership. It is November 1983 and the last twelve months have been the worst since the Caribbean.",
    decision: "Generate your own forces to be ready, or hold and let an exercise be an exercise.",
    stakes:
      "Generating tells the other side you believe war is imminent, which is exactly what convinces them war is imminent. Holding costs you the minutes if it is not a drill.",
  },
  "cuba-1962": {
    headline: "American aircraft have photographed the missile canisters in your harbour.",
    situation:
      "Soviet dual-capable systems are on your soil at Moscow's request and Washington now has the imagery. The Americans have not yet said publicly what they know. Moscow is telling you one thing and telling Washington another.",
    youAre: "You are the leadership in Havana. The weapons are on your territory and none of them answer to you.",
    decision: "Back Moscow publicly, seek your own settlement with Washington, or try to hold both open.",
    stakes:
      "You are the ground the crisis is fought over, not a party to it. Every outcome here is decided in two other capitals unless you make yourself expensive to ignore.",
  },
  "ukraine-tactical-2022": {
    headline: "Western capitals are telling each other you are about to use a small nuclear weapon.",
    situation:
      "Allied intelligence has reportedly assessed that you are preparing a low-yield use to break the deadlock. You have not decided any such thing. NATO is generating forces on the strength of an assessment about your intentions that you know to be wrong — which does not make it any less real as a fact you now have to manage.",
    youAre: "You are the President of the Russian Federation, being briefed on what other governments believe you are planning.",
    decision: "Deny it and do nothing, deny it and stand forces down visibly, or let the belief stand because it is useful.",
    stakes:
      "A reputation for being about to do something is a weapon until the other side decides to act on it first. Denial that nobody believes is worse than silence.",
  },
  "taiwan-2027": {
    headline: "China has closed the sea lanes around Taiwan.",
    situation:
      "Beijing has declared an inspection zone covering the approaches to the island and is stopping commercial traffic. It is not a blockade in name, which is the entire point of how it was designed. Your carrier group is due to transit in under a day and the decision about whether it does is yours.",
    youAre: "You are the President of the United States. The Pacific commander wants an answer before the next watch change.",
    decision: "Transit and force the issue, hold outside and negotiate, or find something in between that does not look like retreat.",
    stakes:
      "Sail through and any accident becomes a shooting incident between nuclear powers. Stay out and every ally in the region reads the answer to a question they have been asking for a decade.",
  },
  "baltics-flank-2027": {
    headline: "NATO has moved nuclear-capable aircraft to your border.",
    situation:
      "Dual-capable fighters — aircraft that can carry either conventional or nuclear weapons, and which you cannot tell apart from the ground — are now forward-deployed on the Baltic flank. NATO calls it reassurance. Kaliningrad is the piece of your territory that is most exposed and most heavily armed.",
    youAre: "You are the President of the Russian Federation. The General Staff has brought you three options and prefers the loudest.",
    decision: "Match the deployment, respond somewhere else entirely, or absorb it and say nothing.",
    stakes:
      "Matching it puts two sets of dual-capable aircraft inside minutes of each other. Absorbing it invites the next one. Nobody in this exchange can see what the other side's aircraft are loaded with.",
  },
  "nk-window-2027": {
    headline: "You have announced a launch window and the region wants to know what is in it.",
    situation:
      "The notice went out through the maritime channels as required. Seoul and Tokyo are demanding to know whether this is a satellite, a test or something else, and Beijing's silence is doing more work than anything they could say. Your engineers want the full-range shot; your diplomats want the ambiguity.",
    youAre: "You are the Supreme Commander. The test window opens in days and everything about it is a choice.",
    decision: "Fly the full-range profile, keep it lofted and deniable, or spend the window on something that is not a launch.",
    stakes:
      "The whole value of the programme is that other capitals cannot be certain what you can do. Proving it buys respect and spends the doubt that has been keeping you alive.",
  },
  "kashmir-2027": {
    headline: "Pakistan has moved short-range nuclear artillery to the border.",
    situation:
      "Batteries designed for battlefield use — small weapons, moved forward precisely so that you see them move — are now within range of your formations. Your own declared policy is no first use, which is a promise you are now being invited to test. The units holding those weapons are not the ones who authorise them, and in a crisis that distinction gets thin.",
    youAre: "You are the Prime Minister of India. The Chief of Defence Staff is waiting and the flight time across this border is four minutes.",
    decision: "Hold to no first use and absorb the risk, posture visibly, or pre-empt the batteries before they disperse.",
    stakes:
      "Four minutes is not enough time to verify anything. A declared doctrine only means something if it survives the first day it is inconvenient.",
  },
  "iran-breakout-2028": {
    headline: "Inspectors are at the gate and Israel is fuelling tankers.",
    situation:
      "The international inspectors are demanding access to a site you have not declared. Israeli aerial refuelling aircraft — the ones that make a long-range strike possible — have moved to forward bases. Your programme is close enough to a device that both facts are now about the same question.",
    youAre: "You are the Supreme Leader. The Guard wants the programme finished; the ministries want the inspectors let in.",
    decision: "Admit the inspectors, expel them and sprint, or keep the ambiguity alive for a few more weeks.",
    stakes:
      "Ambiguity has protected you for twenty years. It stops protecting you at the exact moment somebody else decides you are too close to wait out.",
  },
  "israel-preempt-2026": {
    headline: "Iran is weeks from a device and your aircraft are loaded.",
    situation:
      "The assessment your services have given you says the window to act unilaterally is closing. Washington is asking you through the Swiss channel to wait and is not saying for how long. Every previous government in your chair has acted before a hostile state finished a weapon, and that precedent is now a policy you are expected to follow.",
    youAre: "You are the Prime Minister of Israel. The strike package can go tonight.",
    decision: "Strike, wait for Washington, or act in a way that is deniable and buys weeks rather than years.",
    stakes:
      "Striking works once and starts something that does not end on your timetable. Waiting means the decision may not be yours much longer.",
  },
  "broken-arrow": {
    headline: "A nuclear weapon under your custody is unaccounted for.",
    situation:
      "An accident during a movement has left a weapon off the inventory and nobody can yet say whether it is damaged, buried, submerged or simply mislaid. There has never been a nuclear detonation in an accident of this kind — the real harm is contamination and the panic. The first message you send sets everyone else's posture for a week.",
    youAre: "You are the President of the United States, being told this at the start of a crisis you were already managing.",
    decision: "Report it at the highest rung immediately, recover quietly and announce afterwards, or something between.",
    stakes:
      "Say it loudly and every adversary knows exactly when your attention was elsewhere. Say it quietly and the story breaks on someone else's terms.",
  },
  "empty-quiver-2027": {
    headline: "A warhead has been stolen.",
    situation:
      "This is not a weapon lost in an accident. Someone took it, which means someone planned to, which means the plan had help. A non-state group is the most likely holder and the corridor it would move through is one you have limited visibility into.",
    youAre: "You are the President of the United States. The recovery window is measured in days and closing.",
    decision: "Go public to freeze the routes, stay quiet and hunt, or tell allies only and accept the leak.",
    stakes:
      "A device in the hands of people with no return address breaks deterrence entirely — there is nobody to retaliate against. Recovery is the only outcome that counts.",
  },
  "cartel-auction": {
    headline: "A tactical nuclear weapon is being offered for sale in a port corridor.",
    situation:
      "The sellers are not ideological. They are moving an object they understand as extremely valuable inventory and they will sell it to whoever pays. Your intelligence on the corridor is thin, the host government is compromised at several levels, and the buyers may already be in the room.",
    youAre: "You are the President of the United States, with an intelligence product you cannot fully corroborate.",
    decision: "Act on thin intelligence, work the host government, or buy time and collect.",
    stakes:
      "Money moves faster than verification. Being right a week late is the same as being wrong.",
  },
  "union-generate": {
    headline: "Two governments now claim the same nuclear arsenal.",
    situation:
      "You hold a restorationist command claiming continuity with the Soviet Union, and you say the silos answer to you. Moscow says they answer to Moscow. Somewhere between you are garrisons who have received two sets of orders and have not yet decided which briefcase is real.",
    youAre: "You are the General Secretary of a state most of the world does not recognise.",
    decision: "Force the question and demand the garrisons choose, negotiate a split, or generate and let the ambiguity do the work.",
    stakes:
      "Two authentication chains over one arsenal is the specific condition under which a civil dispute becomes a nuclear one. Nobody outside is sure who to talk to.",
  },
  "taiwan-prc-2027": {
    headline: "You declared an inspection zone and an American carrier group is sailing into it.",
    situation:
      "The zone was designed to be short of a blockade so that Washington would have to decide what to call it. Washington has decided to test it instead. Your commanders are asking what they are authorised to do when the first American hull crosses the line, and the honest answer is that you have not told them yet.",
    youAre: "You are the Chairman. The Commission is assembled and the carrier is hours out.",
    decision: "Enforce the zone, let the transit through and keep the zone on paper, or narrow it before contact.",
    stakes:
      "Enforcement means intercepting a nuclear-armed navy in front of an audience. Letting it through means the zone was always words, and everyone will remember that.",
  },
  "trident-casd": {
    headline: "One of your ballistic missile submarines has missed its communications window.",
    situation:
      "The boat is silent. That is either a technical fault, a deliberate evasion of something it detected, or the beginning of the thing the letters in the safe were written for. Your continuous at-sea deterrent depends on that boat being reachable and it is currently not.",
    youAre: "You are the Prime Minister. The Chief of the Defence Staff has raised it at the second missed window, not the first.",
    decision: "Generate the rest of the force, keep trying quietly, or treat the silence as information and act on it.",
    stakes:
      "Generating is visible to everyone and cannot be walked back quickly. Waiting is exactly what 1983 did, and 1983 is why this file exists.",
  },
  "frappe-independence": {
    headline: "NATO wants your deterrent on their timetable.",
    situation:
      "The alliance is asking for coordinated force generation and expects you to participate. Your deterrent is independent by constitutional design — that independence is the entire point of it, and has been since the Republic decided it could not rely on anyone else's guarantee. Refusing costs you the alliance; agreeing costs you the doctrine.",
    youAre: "You are the President of the French Republic. The decision is yours alone and always has been.",
    decision: "Coordinate with NATO, generate separately on your own authority, or hold.",
    stakes:
      "A deterrent that moves when Washington asks is not independent, and everyone including your adversaries will draw that conclusion. A deterrent nobody coordinates with may not deter anything jointly.",
  },
  "nasr-flushed": {
    headline: "Your short-range nuclear batteries are forward and India has noticed.",
    situation:
      "The batteries were moved to be seen — that is what they are for. India's declared no-first-use policy is now under real pressure from its own military, and the custody arrangements at your end get thinner the further forward the weapons sit. The people holding them are not the people who authorise them.",
    youAre: "You are the Prime Minister of Pakistan, chairing an authority the army effectively runs.",
    decision: "Pull them back, hold them forward, or disperse them further so they cannot be taken out in one strike.",
    stakes:
      "Dispersal survives a first strike and destroys two-man control at the same time. The safest arrangement against attack is the least safe against accident.",
  },
  "asat-blind-2028": {
    headline: "One of your early-warning satellites has gone dark.",
    situation:
      "The bird stopped reporting without warning. It could be debris, a component failure, or something deliberate — and the three look identical from the ground for the first several hours. Whatever the cause, your coverage now has a hole in it, and every close call that arrives while it is dark will look worse than it is.",
    youAre: "You are the President of the United States. Space Command cannot yet tell you which of the three it was.",
    decision: "Treat it as an attack, treat it as a failure, or spend the time to find out and accept being blind while you do.",
    stakes:
      "Calling it an attack when it was debris starts something over a broken component. Calling it a failure when it was deliberate means the next thing arrives unseen.",
  },
  "lac-clash-2027": {
    headline: "Indian and Chinese troops fought hand to hand at altitude last night.",
    situation:
      "There are dead on both sides and no shots were fired — the fighting was done with improvised weapons under an old agreement neither side wants to be the first to break. Both militaries have now moved dual-capable aircraft forward. The agreement that kept firearms out of this dispute is the only thing that has ever kept it small.",
    youAre: "You are the Prime Minister of India, with a domestic public that has already seen the footage.",
    decision: "Retaliate conventionally, hold to the old agreement, or move forces without using them.",
    stakes:
      "Two nuclear states have kept this border non-lethal by convention alone for decades. Conventions end the first time one side decides the cost of restraint is higher than the cost of breaking it.",
  },
  "carrington-2027": {
    headline: "A solar storm the size of the 1859 event will reach Earth in hours.",
    situation:
      "The coronal mass ejection is confirmed and large. It will degrade satellites, corrupt timing signals and take down parts of the power grid — and it will do all of that in a way that looks, on a warning board, remarkably like the opening of a high-altitude nuclear attack. Every other nuclear state is about to see the same thing you are.",
    youAre: "You are the President of the United States, with about six hours of warning and no way to stop it.",
    decision: "Generate forces before you lose the ability to, warn adversaries in advance, or ride it out quietly.",
    stakes:
      "Generating looks like preparing a strike under cover of the storm. Not generating means whatever survives the storm is what you have. The sun is not on anyone's side.",
  },
  "fobs-ambiguity": {
    headline: "Something launched from Plesetsk went into orbit instead of coming down.",
    situation:
      "A Russian boost that started on a familiar profile did not follow the arc a test flight should have. It circularised — it went around instead of over. That is either a satellite launch on an unusual trajectory or a weapon designed to approach from the south, where your radars are thinnest and your warning time is shortest.",
    youAre: "You are the President of the United States. Space Command is telling you it will take hours to be sure.",
    decision: "Posture against the southern approach, demand an explanation on the hotline, or wait for orbital confirmation.",
    stakes:
      "The southern gap in your coverage is not a secret. A system built to use it would look exactly like this, and so would an ordinary satellite.",
  },
  "orbital-inspector": {
    headline: "One of your satellites is closing on an American early-warning bird.",
    situation:
      "The close-approach vehicle is doing what it was built to do: inspect. Washington cannot tell inspection from an attack run, and will not be able to until it is much too close. Your own commanders are divided over whether to continue, and the manoeuvre is already public.",
    youAre: "You are the Chairman, being asked to authorise the final approach.",
    decision: "Continue the approach, break off visibly, or hold at distance and make Washington ask.",
    stakes:
      "Blinding an adversary's early warning is, to them, indistinguishable from preparing to strike. There is no way to inspect a warning satellite that looks harmless from the other side.",
  },
  "signal-window": {
    headline: "Two warning systems disagree, and a late exercise notice has just arrived on another channel.",
    situation:
      "Automated tracking is reporting something your radar cannot corroborate. Nine minutes into the event, a notification arrives through a completely separate channel claiming the activity is a scheduled exercise. The notice may be genuine, may be late, and may be a fabrication designed to arrive exactly now.",
    youAre: "You are the President of the United States. You have been awake for four minutes.",
    decision: "Credit the notice, discount it, or spend more of the window trying to corroborate the track independently.",
    stakes:
      "A launch notice is a claim, not a guarantee — it tells you what a track is supposed to be. Believing it is a separate decision from receiving it.",
  },
  "alliance-fracture": {
    headline: "Your allies agree there is a crisis and disagree about everything else.",
    situation:
      "Every partner accepts the situation is dangerous. They divide sharply on sanctions, on force posture, on what to say publicly and on how long it is acceptable to wait. Two of them are briefing against each other to the press, and the adversary is reading all of it.",
    youAre: "You are the President of the United States, on a call where nobody is going to be persuaded.",
    decision: "Move at the pace of the slowest ally, act first and bring them along, or split the difference and satisfy nobody.",
    stakes:
      "Acting alone is faster and costs you the coalition you will need next month. Waiting for consensus is legitimate and may be slower than events.",
  },
  "black-sky-relay": {
    headline: "A power and network failure has blinded part of your warning system.",
    situation:
      "The outage has taken out coverage in one sector and corrupted the timing signals that everything else depends on to agree with itself. Reports are arriving late and out of order, which makes the picture look more contradictory than it is. Restoration is measured in days, not hours.",
    youAre: "You are the President of the United States, working from a picture you know is incomplete.",
    decision: "Act on the degraded picture, wait for restoration, or assume the outage itself was hostile.",
    stakes:
      "Timing errors make honest sensors contradict each other. A degraded picture is not just less information — it is information that actively misleads.",
  },
  "deepfake-summit": {
    headline: "A message in your counterpart's voice contradicts what the secure channel is saying.",
    situation:
      "The synthetic message is good enough that people who have spoken to him for years are not certain. It arrived outside the authenticated channel and says something materially different from what that channel says. Either the secure line is compromised or the voice is fabricated, and you cannot yet establish which.",
    youAre: "You are the President of the United States, holding two irreconcilable messages from the same person.",
    decision: "Trust the authenticated channel, act on the voice, or go and re-establish which one is real before doing anything.",
    stakes:
      "A cloned voice on a trusted line is the cheapest way to make a crisis worse. The purpose of authentication is that it survives exactly this, if you actually use it.",
  },
  "three-cities": {
    headline: "Three cities are demanding the same emergency supplies and you have one reserve.",
    situation:
      "Each city has a legitimate claim, each has told its population help is coming, and each has a governor on the phone. The reserve is sized for one of them. Whatever you decide will be public within the hour and will be read as a judgement about whose people matter.",
    youAre: "You are the President of the United States, in the part of a crisis that comes after the decisions everyone remembers.",
    decision: "Concentrate the reserve where it does most good, split it three ways, or hold it back for what comes next.",
    stakes:
      "Splitting it may save nobody. Concentrating it saves the most people and abandons two cities in front of a live camera.",
  },
  "contamination-corridor": {
    headline: "A contamination zone has cut the evacuation route in half.",
    situation:
      "The plume has crossed the main road out and split the map into areas you can move people through and areas you cannot. The zone is moving with the weather and the forecast is not reliable past a few hours. People are already on the road.",
    youAre: "You are the President of the United States, choosing between two bad routes with incomplete forecasting.",
    decision: "Move people through the shorter contaminated corridor, take the long route, or shelter in place.",
    stakes:
      "Moving people through contamination harms them. Keeping them still may harm more of them. The forecast that decides which is wrong more often than anyone admits.",
  },
  "public-health-cascade": {
    headline: "An outbreak is spreading faster than testing can confirm what it is.",
    situation:
      "Three regions are reporting cases at different rates and the laboratory confirmations are days behind the rumours. You do not yet know whether this is natural, accidental or deliberate, and the answer changes everything about the response. Public belief has already outrun the evidence.",
    youAre: "You are the President of the United States, being asked to act before anyone can tell you what this is.",
    decision: "Act on the rumour and risk being wrong loudly, wait for confirmation, or move resources without saying why.",
    stakes:
      "Attribution and response are different problems on different clocks. Treating a natural outbreak as an attack is its own kind of catastrophe.",
  },
  "arctic-cable": {
    headline: "An undersea cable has been cut and half your reporting is hours late.",
    situation:
      "The break has forced traffic onto slower routes, so reports now arrive out of sequence and disagree with each other about what happened when. Cables break by accident constantly. This one broke during a crisis, at a location that matters, which is either coincidence or the point.",
    youAre: "You are the President of the United States, assembling a picture from sources that no longer agree on time.",
    decision: "Treat the cut as hostile, treat it as an accident, or work the degraded picture and find out later.",
    stakes:
      "When reports arrive out of order, a calm situation can look like an escalating one. Rumour fills the gap faster than repair crews do.",
  },
  "machine-chorus": {
    headline: "Three decision-support systems have given you three incompatible recommendations.",
    situation:
      "All three are confident. All three were trained on overlapping data and none of them can tell you why it disagrees with the others. Your staff are split along the same lines as the machines, which may be a coincidence and may be because they have been reading the machines all morning.",
    youAre: "You are the President of the United States, with more advice than judgement available.",
    decision: "Follow one, average them, or set all three aside and decide from the underlying evidence.",
    stakes:
      "Confidence is not accuracy, and three systems agreeing on confidence while disagreeing on action tells you the confidence is worthless. The recommendation you like best is the one to distrust most.",
  },
  "deadhand-dilemma": {
    headline: "The fail-deadly system is receiving contradictory signals about whether you are still alive.",
    situation:
      "The continuity mechanism exists to guarantee retaliation if leadership is destroyed — that guarantee is what makes it a deterrent. It is now getting mixed indications about the state of national command. A human veto still stands in the path, and that human is waiting to hear from you.",
    youAre: "You are the President of the Russian Federation, and the system's whole purpose is to work when you cannot answer.",
    decision: "Stand the system down, leave it armed, or re-establish command clearly enough that the question stops being live.",
    stakes:
      "Standing it down removes the deterrent it exists to provide. Leaving it armed while it is confused is how ambiguity becomes automatic.",
  },
  "quarantine-without-war": {
    headline: "Your inspections have halted regional shipping and every capital denies a war has started.",
    situation:
      "Nothing has been fired. Traffic has stopped, insurance markets have closed the region, and the economic damage is already at wartime levels. Everyone involved is publicly insisting this is not a conflict, which makes it very difficult for anyone to find a way to stop.",
    youAre: "You are the Chairman, holding a policy that is working exactly as designed.",
    decision: "Tighten the inspections, ease them quietly, or hold and let the other side move first.",
    stakes:
      "A conflict nobody admits to has no ceasefire mechanism, because there is nothing to cease. It ends when someone finds a way to climb down that is not a defeat.",
  },
  "continuity-gap": {
    headline: "Two deputies are both claiming lawful authority.",
    situation:
      "Damaged communications have split the civilian chain and two people in the line of succession each believe, in good faith, that they are the one now in charge. Both are issuing instructions. Military commanders are receiving two sets of lawful-looking orders and asking which to follow.",
    youAre: "You are the President of the United States — assuming the message reaching them is from you.",
    decision: "Re-establish the chain publicly, work through one deputy only, or accept the split until communications recover.",
    stakes:
      "Nuclear authority depends on there being exactly one answer to who holds it. Two lawful claims is not a constitutional puzzle, it is a targeting problem.",
  },
  "orbital-debris": {
    headline: "A debris cascade has knocked out coverage, and the gap looks like evidence.",
    situation:
      "A collision in orbit has produced a debris field taking out satellites well beyond the first one. Your coverage now has holes in it. Nothing hostile has been confirmed — but the absence of data over specific areas is being read, by people who want to read it that way, as proof that something is being hidden there.",
    youAre: "You are the President of the United States, with less information than yesterday and more certainty around you.",
    decision: "Fill the gaps before drawing conclusions, act on the pattern of what is missing, or say publicly that you cannot see.",
    stakes:
      "Missing data is the easiest thing in the world to turn into a story. The pattern of what you cannot see is not evidence about what is there.",
  },
  "ceasefire-clock": {
    headline: "The ceasefire is twelve hours old and already being violated.",
    situation:
      "The pause is holding in most places and failing in a few. Each violation is disputed, each side blames the other, and verification takes longer than the news cycle. The monitoring channel that could settle any of it is thin and both sides have reasons to discredit it.",
    youAre: "You are the President of the United States, brokering something that could collapse in an afternoon.",
    decision: "Protect the monitoring channel, punish the violation, or absorb it and keep the pause alive.",
    stakes:
      "Punishing a violation you cannot verify may be punishing a fabrication. Absorbing real violations teaches the other side what the pause is worth.",
  },
  "black-brant-1995": {
    headline: "A rocket launched from Norway is climbing on a profile that looks like a submarine attack.",
    situation:
      "It is a scientific research rocket. Norway filed the notification through the proper channels weeks ago and it reached your duty officer after the track was already on the board. From where your radars sit, the trajectory is consistent with a submarine-launched missile flown to blind Moscow before a larger strike.",
    youAre: "You are the President of the Russian Federation. The command briefcase has been opened and is in front of you.",
    decision: "Treat it as the attack profile it resembles, or hold long enough for the arc to prove itself.",
    stakes:
      "A notice you did not read in time is worth nothing. If you hold and you are wrong, you lose the chance to answer at all — and the profile is designed to look precisely like this.",
  },
  "norad-false-cascade": {
    headline: "Your warning centre is showing hundreds of Soviet missiles inbound.",
    situation:
      "The display shows a full-scale attack. Ground radar shows nothing, satellites show nothing, and the two pictures cannot both be true. Bomber crews are already at their aircraft and the room is loud. Somewhere in the system a training tape or a failing component is producing a war that is not happening.",
    youAre: "You are the President of the United States, minutes into a report nobody in the room can corroborate.",
    decision: "Act on the display, wait for the sensors that disagree with it, or generate forces while you find out.",
    stakes:
      "Two independent sensor types agreeing is the standard, and you do not have it. The display is confident, and confidence is exactly what a fault produces.",
  },
  "arkhipov-1962": {
    headline: "American destroyers are dropping depth charges on your submarine.",
    situation:
      "You are submerged, out of contact with Moscow for days, and the batteries are failing. The charges are practice depth charges meant as a signal to surface, but nobody aboard can tell that from the inside of the hull. There is a nuclear torpedo aboard and the captain believes war may already have started above you.",
    youAre: "You are aboard B-59, where launching requires the agreement of the officers present.",
    decision: "Concur with the captain, refuse, or force the boat to surface and find out what is happening.",
    stakes:
      "You cannot see the surface, cannot reach Moscow, and are being attacked as far as anyone aboard can tell. Refusing is the only thing standing between this hull and a nuclear war.",
  },
  "malmstrom-1967": {
    headline: "Ten missiles dropped off alert within seconds of each other.",
    situation:
      "An entire flight went no-go at effectively the same moment, which is not how independent failures behave. Security personnel and engineering are telling different stories about what happened and neither can rule the other out. The weapons are safe; the question is what made ten of them unavailable at once.",
    youAre: "You are the President of the United States, with a readiness gap and no explanation for it.",
    decision: "Treat it as an engineering fault, treat it as interference, or take the flight off line entirely while you find out.",
    stakes:
      "If something can take ten missiles off alert at once, the number that matters is not ten. Explaining it away is cheaper and might be wrong.",
  },
  "vela-flash-1979": {
    headline: "A satellite has recorded a double flash over the South Atlantic.",
    situation:
      "The double flash is the characteristic signature of a nuclear detonation, and the satellite that saw it was built to see exactly that. No nation has claimed a test, no fallout has been detected, and the instrument has a known history of false positives from micrometeoroid strikes. Attribution is the entire problem.",
    youAre: "You are the President of the United States, holding a detection nobody can confirm or deny.",
    decision: "Treat it as a confirmed test and attribute it, treat it as instrument error, or investigate quietly.",
    stakes:
      "Attributing a test to the wrong state has consequences that outlive the evidence. Ignoring a real one tells everyone what your detection is worth.",
  },
  "yom-kippur-scare-1973": {
    headline: "Soviet forces are mobilising and your desk cannot agree on what it means.",
    situation:
      "Airborne divisions have been readied and transport aircraft are moving. One reading is that Moscow intends to intervene directly in the Middle East war. The other is that this is signalling meant to be seen. Your own government is producing both assessments simultaneously and both are being briefed to you as fact.",
    youAre: "You are the President of the United States, at an hour when the government is not at its most coherent.",
    decision: "Raise your own alert level to answer the signal, hold, or ask Moscow directly what they are doing.",
    stakes:
      "Raising alert is itself a signal, and it will be read by people making the same guesses about you that you are making about them.",
  },
  "november-uap-1975": {
    headline: "Radar is painting unidentified objects over your missile complexes.",
    situation:
      "Multiple sites across the northern tier are reporting returns over the weapons storage areas. Security teams are reporting them visually as well. Nothing has been intercepted, nothing has been identified, and the reports have continued across several nights at different bases.",
    youAre: "You are the President of the United States, with reports from sites that do not usually report anything.",
    decision: "Treat it as reconnaissance by an adversary, treat it as misidentification, or commit real resources to finding out.",
    stakes:
      "Something over the weapons storage areas is either hostile collection or a failure of your own security reporting. Both are serious and they need opposite responses.",
  },
  "phenomenology-window-2027": {
    headline: "Your warning sensors disagree about something, and the rumour is already public.",
    situation:
      "Infrared and radar are returning incompatible pictures of the same object — which is what a sensor fault looks like, and also what a real thing your sensors were not built for looks like. Video is already circulating online. Public belief is running well ahead of anything in the file.",
    youAre: "You are the President of the United States, being asked about it before your own analysts have an answer.",
    decision: "Say what you know and admit the gap, wait for corroboration, or let the public story run.",
    stakes:
      "The standard is two independent sensor types agreeing, and you have two that do not. Saying nothing hands the explanation to whoever is loudest.",
  },
};

export function briefFor(id: ScenarioId): ScenarioBrief | null {
  return SCENARIO_BRIEFS[id] ?? null;
}
