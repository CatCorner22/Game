# CBRN incident corpus — design reference

Research gathered for THRESHOLD's scenario and mechanics work. Every in-game
scenario stays an original fiction; this file records the **real** events behind
them, so after-action content can name them soberly and the simulation models
what actually happens rather than what feels dramatic.

**Scope rule.** Historical, policy and decision-making detail only. No synthesis
routes, device design, precursor chemistry, weaponisation methods, or any
procedure that would give real-world uplift — consistent with the safety posture
in `README.md`. Clinical presentation and response doctrine only.

**How to use this.** The *Mechanics to model* sections at the end of each domain
are the higher-value half: they are the structural rules and public numbers that
make the simulation honest. The incident entries supply the situations.

**Counter-cases are deliberate.** KAL 007, the Wood Green ricin false positive
and the Spanish cucumber misattribution are included because a game that only
teaches "be sceptical of warnings" teaches half a lesson. These are the cases
where caution or haste failed in the *other* direction.

---

## Nuclear command-and-control near-misses

*14 incidents.*

### BMEWS Thule moonrise false alarm (1960 (5 October))

*Thule BMEWS radar site, Greenland; NORAD Combat Operations Center, Colorado Springs; SAC HQ, Offutt AFB*

Days after the Ballistic Missile Early Warning System went operational, the Thule radar returned echoes that the processing logic interpreted as a mass launch from the Soviet Arctic; the NORAD display escalated to its top alarm level (accounts commonly cite a 5-of-5 reading and a '99.9 percent certainty' figure, both of which vary between retellings). The returns were in fact radar energy reflecting off the rising moon. NORAD and SAC treated the alarm as suspect and no forces were committed.

**Decision problem.** The purest case of a brand-new sensor with no established false-positive baseline. The decision dilemma: the machine reports near-certainty, but nobody yet knows what this machine's lies look like. Three cues did the work and each is a distinct game mechanic — (1) an internal inconsistency, the system could not compute plausible impact points despite claiming a mass raid; (2) a physics implausibility, the computed range was absurdly long for a ballistic object; (3) a political-context check, Khrushchev was …

**Outcome.** No alert forces were committed. The cause was identified as lunar returns and 'gating' filters were added to reject them. The incident became a founding case in the U.S. literature on warning-system reliability (Scott D. Sagan, The Limits of Safety).

**Stresses.** sensor confidence (reported vs. actual), novel-system false-positive baseline unknown, internal consistency of the report (impact points computable?), physical plausibility check, political context / adversary-intent prior, adversary leader location as an intent signal, time to irreversible action, cross-sensor corroboration availability.

### SAC–NORAD communications blackout (Thule/Colorado relay failure) (1961 (24 November))

*SAC HQ, Offutt AFB, Nebraska; NORAD; BMEWS sites at Thule (Greenland), Clear (Alaska), Fylingdales (UK); AT&T …*

All communication links between SAC headquarters, NORAD, and the three BMEWS early-warning sites went dead simultaneously. Because the links were deliberately redundant and routed independently, the simultaneous failure of all of them was itself read as evidence of hostile action rather than coincidence. SAC brought its bomber force to a higher state of readiness while it tried to find out what had happened.

**Decision problem.** The information state is *nothing at all*, and nothing is genuinely ambiguous: silence is equally consistent with a benign fault and with a decapitating first strike that has destroyed your sensors. Worse, the engineered redundancy inverted the inference — 'these links cannot all fail at once by accident' made the innocent explanation seem less likely, not more. The resolving cue is beautiful for a game: SAC reached a B-52 already flying airborne alert near Thule and had it establish radio contact with the BMEWS …

**Outcome.** Bomber crews went to their aircraft and started engines but did not take off. Radio contact through the airborne B-52 confirmed the BMEWS sites were intact and no attack had occurred. The single-point-of-failure routing was subsequently corrected.

**Stresses.** information blackout / absence of signal, redundancy that is nominally independent but shares a hidden single point of failure, inference inversion (redundancy makes benign failure look implausible), out-of-band verification channels, force generation ordered before the ambiguity is resolved, adversary observability of your alert actions, time pressure vs. verification latency.

### Maultsby U-2 navigation error into Soviet airspace ('Black Saturday') (1962 (27 October))

*North Pole / Chukotka Peninsula, USSR; launched from Eielson AFB, Alaska; intercept support from Galena, …*

A U.S. Air Force U-2 on a routine high-altitude air-sampling mission navigating by celestial fix lost its star references — an intense auroral display is the reason usually given — and drifted roughly 300 miles into Soviet airspace over Chukotka on the most dangerous day of the Cuban Missile Crisis. Soviet air defense scrambled interceptors; U.S. F-102s launched to escort the U-2 home, and under the crisis dispersal posture they were carrying nuclear-tipped air-to-air missiles. Ground controllers talked the pilot out by star reference and he landed short of fuel on the Alaskan coast.

**Decision problem.** Two simultaneous, mirrored epistemic problems. For Moscow: a U.S. reconnaissance aircraft deep over Soviet territory during a nuclear standoff is exactly what pre-strike targeting reconnaissance would look like — Khrushchev afterward wrote to Kennedy that such an intruder 'can be easily taken for a nuclear bomber, which might push us to a fateful step.' For Washington: nobody in the ExComm knew this was happening for most of its duration; the President learned of it late. And the escort aircraft had been given a …

**Outcome.** The U-2 exited Soviet airspace and landed safely. No shots were fired by either side. On the same day a U-2 was shot down over Cuba and the United States chose not to execute its pre-agreed retaliatory response — a separate and deliberate act of restraint …

**Stresses.** accident misread as intent, adversary attribution certainty, crisis posture placing nuclear weapons under looser, lower-level control, command awareness lag (leadership does not know what its own forces are doing), navigation/sensor degradation from environmental causes, de-escalation via non-response (Soviet interceptors did not engage; U.S. escorts did not fire), fuel/endurance as a hard clock.

### Soviet submarine B-59 and the nuclear torpedo (Vasili Arkhipov) (1962 (27 October))

*Atlantic, near the U.S. quarantine line off Cuba; USS Randolph task group*

U.S. Navy forces localized the diesel-electric submarine B-59 and dropped small practice depth charges intended as a signal to surface for identification. The submarine had been out of radio contact with Moscow for days, was too deep to receive broadcasts, and internal conditions had badly degraded — failed air conditioning, extreme heat, rising carbon dioxide, depleted batteries. Captain Valentin Savitsky, concluding that war might already have begun, ordered the boat's nuclear-armed torpedo readied; flotilla chief of staff Vasili Arkhipov, aboard B-59, did not concur, and the submarine surfaced instead.

**Decision problem.** This is the canonical 'signal that was not received as a signal' problem. The United States had communicated its quarantine-signalling procedures to Moscow, but that information never reached the submarines — so an act designed to be legible as 'surface and identify yourself' arrived aboard as 'we are being attacked.' Layer on total information isolation (no news, no orders, no way to check), physiological degradation of the decision-makers themselves, and the fact that surfacing to check meant surfacing into the …

**Outcome.** B-59 surfaced, was identified, was not attacked, and eventually returned to the Soviet Union. Crew members faced official displeasure on return. Note that the account is contested in detail: it rests largely on participant recollections aired at a 1962-crisis …

**Stresses.** signal intent vs. signal receipt (asymmetric codebooks), information isolation / no channel to check, decision-maker physiological and cognitive degradation, distributed consent as a safeguard, delegation of release authority to a disconnected unit, verification requires an act that increases vulnerability, time compression under sustained harassment.

### Moorestown radar false warning (test tape plus satellite coincidence) (1962 (28 October))

*Moorestown, New Jersey radar site; NORAD; national command posts*

Just before 09:00, a test tape simulating a missile launch from Cuba was running at the Moorestown radar site at the moment a satellite rose above the horizon on a pass the crew had not been warned about. The operators conflated the two, reported by voice line to NORAD that an attack was under way, and predicted impact 18 miles west of Tampa at 09:02. The overlapping radars that could have confirmed or contradicted were not in operation, so there was no cross-check available.

**Decision problem.** The resolving cue is unusual and highly gameable: nobody proved the report false — they *waited for the predicted impact time to pass with no detonation*. 'Run out the clock and see if the world ends' is a real, historically-used epistemic tool, and it works only when the predicted event is near-term and observable. Two upstream failures compound it, both classic crisis-load pathologies: simulated data was running on the same channel as live data, and the routine service that warned radar crews of scheduled …

**Outcome.** NORAD was alerted but no irrevocable action was taken. When 09:02 passed with no detonation reported, the alarm collapsed and Moorestown identified the test tape and satellite as the cause.

**Stresses.** test/simulation data on live channels, loss of cross-sensor corroboration (redundant sensors offline), crisis load degrading routine safeguards, impact-point prediction as a falsifiable claim, 'wait for the predicted event' as a verification method, voice-report chain with no automated validation, very short window (~3 minutes) between report and predicted impact.

### Solar storm mistaken for Soviet radar jamming (1967 (23 May))

*BMEWS sites at Thule (Greenland), Clear (Alaska), Fylingdales (UK); NORAD, Colorado Springs*

An exceptionally large solar flare produced radio emission that simultaneously degraded all three BMEWS early-warning radars. U.S. doctrine treated deliberate jamming of missile-warning radars as an act of war and a probable precursor to a strike, and nuclear-capable aircraft were readied while options were debated. NORAD's own Solar Forecast Center supplied the alternative explanation in time and no aircraft were launched in response.

**Decision problem.** The failure mode is not a false positive on the sensor but a false positive on *sensor failure itself*. Losing your eyes reads as an attack, and losing all three pairs at once reads as a coordinated attack — geographic dispersion, the very thing that should reassure you, becomes the incriminating fact. The resolving cue came from a domain nobody would have listed as part of the warning architecture: a duty solar forecaster who had already flagged a major flare, plus the geometric observation that all three sites …

**Outcome.** The aircraft stayed on the ground. The episode was not publicly detailed until a 2016 peer-reviewed space-weather paper and associated interviews with the officers involved; some operational specifics remain thin, and the degree to which launch was actually …

**Stresses.** sensor degradation misread as adversary action, simultaneity across dispersed sites as (false) evidence of coordination, availability of an alternative causal explanation, specialist knowledge outside the warning chain, force generation as a visible, escalatory signal, time to correlate an environmental cause with an operational anomaly.

### NORAD training-tape false alarm (1979 (9 November))

*NORAD Cheyenne Mountain; SAC HQ; National Military Command Center, Pentagon; Alternate NMCC (Site R)*

At about 08:50 EST, warning displays at NORAD, SAC, the NMCC and Site R showed a mass Soviet missile raid — figures of roughly 1,400 to over 2,000 inbound weapons appear in different accounts. The cause was exercise/simulation data inadvertently introduced into the live missile-warning computers. Ten fighter-interceptors were launched and the National Emergency Airborne Command Post took off from Andrews AFB without the President or Secretary of Defense aboard before the warning was judged spurious.

**Decision problem.** The authoritative display and the raw sensors disagreed, and the whole question was whether anyone would check the sensors rather than the display. A Threat Assessment Conference was convened and duty officers cross-checked against the actual radar and satellite feeds — BMEWS, PAVE PAWS, and the infrared satellites showed nothing at all — which resolved it in under six minutes. Crucially, real force actions had *already occurred* inside that six minutes: interceptors airborne, the airborne command post launched. A …

**Outcome.** Judged spurious in under six minutes; forces recovered. The Soviet Union lodged a formal protest. The Department of Defense subsequently built an off-line test facility so exercise data would never again run on live warning channels, and the episode fed a …

**Stresses.** display authority vs. raw sensor data, dual-phenomenology cross-check (radar + infrared satellite), conference-ladder escalation (Missile Display → Threat Assessment → Missile Attack), force actions taken before assessment completes, adversary observation of your alert actions, test/exercise data contaminating live channels, assessment latency (<6 min) vs. flight time (~25-30 min ICBM, ~10-15 min SLBM).

### The 46-cent chip false alarms (1980 (3 June and 6 June))

*NORAD Cheyenne Mountain; SAC HQ, Offutt AFB; National Military Command Center; Pacific Command*

Shortly after 02:00 EDT on 3 June, warning messages at SAC, NORAD and the NMCC showed varying numbers of submarine-launched and then land-based missiles inbound — at one point a figure of 2,200. A failing integrated circuit in a communications multiplexer, combined with a message format in which the count fields normally read as zeros, was corrupting those fields so that a routine 'no launches' message read as 002, 020, 200 or 2200. A second, smaller event followed on 6 June.

**Decision problem.** The discriminating cue is a pattern anomaly rather than a contradicting sensor: the numbers were *different at each of the three command posts* and changed erratically, which is not how a real raid presents. That gives a player a genuinely learnable skill — reading the shape of the data, not just its magnitude. Yet the doctrinal response still fired first: SAC's senior controller, following standard procedure, put alert bomber and tanker crews into their aircraft with engines running, and the Pacific Command …

**Outcome.** No launch recommendation was made and forces stood down. The faulty chip was located after deliberately running the system to failure and was replaced; SAC, NORAD and the NMCC established a continuous voice conference so that the three nodes could compare …

**Stresses.** pattern implausibility as a discriminator (inconsistent counts across nodes), intermittent fault — unresolvable cause, recurring risk, standard operating procedures firing before assessment, alert actions visible to the adversary, trust in the warning system itself as a depletable resource, 3 a.m. decision-maker cognitive state, interval between recurrences (3 days) with the fault unlocated.

### Korean Air Lines Flight 007 shootdown (counter-case: the judgment that went wrong) (1983 (1 September))

*Kamchatka and Sakhalin, USSR; Soviet Far East Air Defence District*

A Boeing 747 flying Anchorage to Seoul drifted several hundred kilometres off its assigned airway and crossed Soviet territory twice. Soviet air defense had been tracking a U.S. reconnaissance aircraft in the same area earlier that night, and the tracks are reported to have been confused. An interceptor pilot closed on the aircraft, fired cannon bursts that the airliner crew did not see, and on ground orders shot it down; all 269 aboard were killed.

**Decision problem.** Include this precisely because the human judgment failed, three weeks before Petrov's succeeded — it prevents a game from teaching that individual conscience reliably saves the day. The epistemic structure is rich: the intercepting pilot later said he could see it was a civilian type from the window rows and lights, and that this 'meant nothing' to him given his orders and his belief it could be a reconnaissance conversion. Warning shots were fired at night with ammunition that produced no visible trace. The …

**Outcome.** The aircraft was destroyed with all aboard. The USSR initially denied then acknowledged the shootdown; the incident hardened East-West relations weeks before Able Archer and Petrov. Consequences included the U.S. decision to open the Global Positioning System …

**Stresses.** identification under time pressure and degraded conditions, track confusion between civil and military objects, warning signals that the recipient cannot perceive, escaping-target deadline (act now or lose the option), institutional incentive asymmetry (punished for inaction, not for action), operator perception overridden by orders, post-event attribution and denial, and the cost to credibility.

### Able Archer 83 (1983 (7-11 November))

*NATO Europe (command-post exercise); Soviet air units in East Germany and Poland; KGB residencies worldwide*

NATO ran a command-post exercise rehearsing escalation to nuclear release. Several features were more realistic than in prior years — new coded communication formats, periods of radio silence, a simulated march up the alert ladder — and it followed the Autumn Forge deployments and the start of Pershing II and cruise missile basing. Soviet intelligence, already running Operation RYAN to look for indicators of a NATO first strike, circulated warnings that the exercise might be a cover for a real attack, and Soviet air units in East Germany and Poland went to an unusually high alert state.

**Decision problem.** The ambiguity is structural and unfixable: a realistic rehearsal for a first strike is observationally near-identical to preparation for a first strike, because realism is the point of the rehearsal. Neither side had a sensor problem; both had an interpretation problem, and RYAN's collection requirements (watch blood banks, watch officials' movements, watch lit windows) had already primed analysts to find confirming evidence. The single best game beat is General Leonard Perroots's decision, as a USAFE intelligence …

**Outcome.** The exercise ended on schedule and Soviet alert activity subsided. How close this came to catastrophe is genuinely contested: a 1990 PFIAB report, declassified in 2015, concluded the United States may have inadvertently placed the relationship on a hair …

**Stresses.** exercise vs. real preparation — indistinguishable by observation, confirmation bias built into intelligence collection requirements (Operation RYAN), reciprocal alert spirals, deliberate non-mirroring as a de-escalation move, adversary's threat perception as a hidden state variable, absence of any direct channel to ask 'is this real?', exercise end date as an externally imposed clock.

### Stanislav Petrov and the Oko satellite false alarm (1983 (26 September))

*Serpukhov-15 early-warning command centre, south of Moscow*

Shortly after midnight, the Oko satellite early-warning system reported a missile launch from the United States, then four more. The console showed the highest reliability indication and the alert klaxon sounded. Lieutenant Colonel Stanislav Petrov, the duty officer, reported the event up the chain as a system malfunction. The cause was sunlight glinting off high-altitude cloud tops in an unusual sun-cloud-satellite geometry near the equinox.

**Decision problem.** This is the sharpest epistemic trap in the whole domain, and games usually get it wrong. The critical point is that *absence of radar confirmation was not yet evidence of anything*: the ground radars physically could not see the missiles until they rose above the radar horizon, several minutes after satellite detection. So at the moment of decision, 'the radars show nothing' meant only 'the radars have not had time to show anything.' Petrov had to act on weaker things: five missiles is an incoherent way to open a …

**Outcome.** Petrov reported a malfunction; ground radars later confirmed nothing was inbound. He was not rewarded — the incident surfaced procedural record-keeping failures and he received no commendation, retiring the following year. The design flaw was later mitigated …

**Stresses.** single-sensor detection with no corroboration yet possible, radar-horizon delay (absence of confirmation ≠ disconfirmation), system-reported confidence vs. operator's knowledge of the system's history, attack-size plausibility against doctrinal expectations, operator's technical knowledge of the sensor as a decisive asset, time-to-radar-confirmation vs. time-to-decision, career risk of reporting a malfunction, recent context (KAL 007, three weeks earlier) raising baseline tension.

### Norwegian Black Brant XII rocket incident (1995 (25 January))

*Andøya Rocket Range, Norway; Olenegorsk early-warning radar, Kola Peninsula; Moscow*

Norwegian and American scientists launched a four-stage sounding rocket to study the aurora. Russian early-warning radar detected a large multi-stage vehicle rising from the Norwegian Sea on a profile that resembled a submarine-launched ballistic missile, and stage separation produced multiple radar objects. Russian nuclear command authorities were alerted; President Yeltsin later stated that the Cheget nuclear briefcase was activated. The track was assessed as non-threatening within roughly eight minutes when it was seen heading away from Russian territory and the stages fell into the sea.

**Decision problem.** A single missile is more frightening than many, because of a specific doctrinal fear: one weapon detonated at high altitude could blind radars and disrupt communications immediately before a mass strike, so a lone track is read as the opening move rather than an anomaly. That inverts the intuitive scaling and makes an excellent mechanic. The other lever is a pure institutional-plumbing failure: Norway had notified Russia through diplomatic channels roughly a month in advance, and the notice simply never reached …

**Outcome.** No launch order was given; the alert lapsed. The severity is genuinely contested: Yeltsin publicly described activating the briefcase, while analysts including Pavel Podvig have argued the alert may not have risen to that level, and Russia has never released …

**Stresses.** single-object detection interpreted as a strike precursor, advance notification that exists but does not reach the operators, trajectory divergence over time as the resolving cue, decision window (commonly described as ~10 minutes) vs. ~8 minutes to resolution, head-of-state involvement and the political record of it, degraded post-Soviet warning coverage raising reliance on a single radar, public accounts that cannot be verified.

### Hawaii false ballistic missile alert (2018 (13 January))

*Hawaii Emergency Management Agency; statewide Wireless Emergency Alert and Emergency Alert System, Hawaii*

At 08:07 local time an employee sent a live statewide alert reading 'BALLISTIC MISSILE THREAT INBOUND TO HAWAII. SEEK IMMEDIATE SHELTER. THIS IS NOT A DRILL.' during an unannounced internal drill. The employee reported hearing the phrase 'this is not a drill' but not the 'exercise, exercise, exercise' framing that five colleagues in the room heard. Military commands confirmed no threat within minutes, but the formal corrective alert did not go out for 38 minutes.

**Decision problem.** The decision problem here is not detection but *retraction*, which almost no crisis game models. The threat was disproved within about five minutes; the correction took thirty-eight, because no pre-written cancellation message existed and authority to send one was unclear. Meanwhile several hundred thousand people had an authoritative warning and no authoritative contradiction. This gives a designer two independent clocks — time-to-truth and time-to-correction — and a durable cost variable, because a false alert …

**Outcome.** A correction was posted on social media at about 13 minutes and the formal cancellation alert at 38 minutes. The employee was dismissed and the agency administrator resigned. The FCC investigated; the system was rebuilt with two-person authorization, clearly …

**Stresses.** retraction latency as distinct from detection latency, public trust as a depletable resource (cry-wolf cost), authority to cancel is unclear or unassigned, interface design placing live and exercise actions adjacent, single-person authorization, shift change and handover ambiguity, no pre-authored correction message, public panic behaviour and secondary harm.

### Przewodów missile explosion in Poland (2022 (15 November))

*Przewodów, Lublin Voivodeship, Poland, about 6 km from the Ukrainian border*

During a large Russian missile barrage against Ukrainian infrastructure, a missile struck a grain facility in a Polish border village and killed two people. Early reporting, including a wire story citing an anonymous U.S. official, indicated Russian missiles had hit NATO territory; Polish officials confirmed only that the missile was of Russian manufacture — accurate but misleading, since Ukraine operates Soviet-designed air defenses. Within hours U.S. and NATO assessments, based on trajectory data, concluded it was most likely a Ukrainian air-defense interceptor that had gone off course.

**Decision problem.** The only modern, non-Cold-War case here where a nuclear-armed alliance's treaty machinery was engaged on a live attribution question, and the decisive move was leaders choosing to be publicly slow. Within hours President Biden said it was 'unlikely' launched from Russia and NATO's Secretary General attributed it to Ukrainian air defense, deliberately deflating pressure for Article 4 consultations and beyond. Three mechanics fall out cleanly: a technically true but misleading fact ('Russian-made') doing enormous …

**Outcome.** Poland and NATO did not invoke Article 4; leaders meeting at the G20 in Bali held an emergency consultation and publicly characterized the strike as most likely a Ukrainian air-defense missile. Ukraine contested the assessment for a period. In September 2023 …

**Stresses.** attribution certainty under alliance-commitment time pressure, technically-true-but-misleading facts, single anonymous source shaping early framing, allied actors with divergent attribution interests, trajectory/sensor data held by a third party (the U.S.) as the decisive evidence, treaty tripwires (Article 4 consultation, Article 5) as discrete escalation gates, deliberate public slowness as a de-escalation instrument, fratricide — a defensive weapon causing the incident.

### Mechanics to model

- FLIGHT-TIME AND DECISION CLOCKS (public estimates, treat as ranges not constants): intercontinental ballistic missile flight time between Russia and the continental United States is commonly given as 25-30 minutes; submarine-launched missiles from close-in patrol areas as roughly 10-15 minutes, with shorter figures cited for depressed trajectories. Public reconstructions of the U.S. launch-decision timeline (e.g. Bruce Blair's) run roughly: detection within about a minute of launch, a warning conference convened within about three minutes, the President briefed and left with on the order of six minutes to decide, and several minutes for a launch order to be transmitted and executed. Build the game clock to be shorter than the verification clock — that gap is where every one of these incidents lives.

- THE WARNING CONFERENCE LADDER is the single most useful structural mechanic. The historical U.S. sequence escalates in three rungs: a low-level technical call among duty officers (Missile Display Conference), a call adding senior operational commanders when the event cannot be dismissed (Threat Assessment Conference), and a call to national leadership (Missile Attack Conference). Each rung costs time, widens the circle of people who now believe something might be happening, and generates observable activity. The 1980 chip alarms are documented as being contained at different rungs on 3 June and 6 June — same fault, different escalation depth, purely because of what procedures had been added in between. Let players spend time to buy confidence, and let each rung have a cost.

- DUAL PHENOMENOLOGY is the core doctrinal safeguard and the core trap. Warning is supposed to be credited only when two physically independent sensor types agree — typically infrared launch detection from satellites and radar tracking. It resolved 1979 (satellites and radars both showed nothing) and 1980. But Petrov 1983 shows the trap: the second sensor may be *physically unable* to see anything yet, because the target is still below the radar horizon. Model corroborating sensors with an explicit availability delay, and make the player distinguish 'the second sensor disagrees' from 'the second sensor has not looked yet.' A game that collapses these two states destroys the entire lesson.

- ABSENCE OF SIGNAL IS AMBIGUOUS IN BOTH DIRECTIONS. Silence can mean nothing is happening or that your sensors have been destroyed (1961 SAC-NORAD blackout). Sensor degradation can mean weather or jamming, and jamming means attack (1967 solar storm). Engineered redundancy makes coincident failure look deliberate — the 1961 case shows redundancy inverting the inference toward hostile action, when the true cause was a hidden shared path through one relay station. Give players a 'blackout' state distinct from 'nothing detected,' and reward out-of-band verification (the airborne B-52 that simply radioed Thule and looked).

- ATTACK SIZE AS A DISCRIMINATOR. Doctrine-driven expectations about what a real attack looks like did real epistemic work: five missiles made no sense to Petrov given Soviet assumptions about massive U.S. strike plans; conversely a single object was read in 1995 as a high-altitude blinding shot preceding a mass strike. Both readings are defensible and they point opposite ways. Make attack size a *cue that must be interpreted through a doctrinal prior*, and let different factions in the room hold different priors.

- PATTERN INCOHERENCE BEATS MAGNITUDE. The 1980 alarms were caught partly because the reported counts differed between the three command posts and changed erratically — real events are internally consistent. The 1960 moon alarm was caught partly because the system could not compute plausible impact points despite claiming a mass raid. Give the player readable internal-consistency signals (do nodes agree? is an impact point computable? does the count evolve physically?) rather than a single confidence number.

- WAIT-AND-SEE IS A LEGITIMATE VERIFICATION TOOL. Moorestown 1962 was resolved by letting the predicted impact time (09:02, three minutes out) pass with no detonation. This works only for near-term falsifiable predictions and it costs the entire remaining decision window. Implement it as a real option with a real price.

- TEST AND EXERCISE DATA ON LIVE CHANNELS is the single most recurrent technical cause: the 1962 Moorestown test tape, the 1979 NORAD training tape, the 2018 Hawaii drill script, and the Cuban-crisis Volk Field incident in which a miswired alarm at a hastily-prepared dispersal base turned a sabotage alarm — itself triggered by a sentry shooting at a bear at Duluth — into a scramble klaxon, with nuclear-armed interceptors taxiing before an officer drove onto the runway to stop them. Model an 'exercise/live channel separation' state as an infrastructure variable the player can invest in before a crisis and will regret not having.

- NOTIFICATION PIPELINES ARE LOSSY. Norway notified Russia of the 1995 launch roughly a month ahead and the notice never reached the warning operators. In 1962 the routine satellite-passage notification service that would have warned the Moorestown crew had been reassigned to crisis work. The 1962 quarantine signalling procedures were passed to Moscow but never reached the submarines. Model notifications as messages with independent delivery probability per handoff, and let 'confirm receipt at the operator level' be a purchasable action.

- CRISIS LOAD DEGRADES SAFEGUARDS. Repeatedly, the emergency itself disabled the checks that would have prevented the emergency: staff reassigned, cross-checking radars offline, weapons dispersed to bases with looser control, aircraft armed for missions that only nuclear weapons could execute. Implement a 'readiness posture' variable where raising it measurably increases accident probability. This is the mechanical heart of a de-escalation game.

- ESCALATION IS ASYMMETRIC AND OBSERVABLE. Raising alert is fast, procedural, and often automatic; standing down is slow and requires a decision. And every alert action is a signal the adversary reads: airborne command posts launching, bombers starting engines, interceptors scrambling. In 1979 and 1980 these actions occurred *before* the alarm was resolved. Model a lag between 'we know it was false' and 'our forces are back where they were,' and model the adversary's warning system reading your posture during that lag.

- NON-MIRRORING AS A PLAYABLE MOVE. Able Archer's most important documented decision was General Perroots's choice not to recommend a matching NATO alert increase in response to observed Soviet activity. Give the player an explicit 'observe but do not reciprocate' option, with the honest property that its correctness is unknowable at the time of choosing and possibly forever after.

- RETRACTION AND ATTRIBUTION ARE SEPARATE, SLOWER CLOCKS. Hawaii 2018: threat disproved in about 5 minutes, informal correction at 13, formal cancellation at 38, because no pre-written cancellation existed and cancel authority was unassigned. Przewodów 2022: initial misleading framing within an hour, a leader-level 'unlikely Russia' statement within hours, a formal prosecutorial finding after about ten months. Run three clocks — time to truth, time to public correction, time to authoritative attribution — and let the gaps between them be where damage accrues.

- PUBLIC TRUST AND SYSTEM TRUST ARE DEPLETABLE. A false alert spends credibility the next real warning needs; a warning system that has lied spends its operators' willingness to believe it. Petrov's decision drew on his knowledge that the system was new and had misbehaved. Between 3 and 6 June 1980, U.S. operators did not know whether their own warning system could be trusted at all. Track 'operator confidence in sensor' as a variable distinct from 'sensor accuracy,' and let it decay with each false positive — including ones the player caused.

- MULTI-PERSON CONSENT AND THE HUMAN FILTER. B-59's outcome turned on a required concurrence that one officer withheld; Hawaii's outcome turned on there being no second person in the loop at all. Both directions are gameable. But pair them with KAL 007, where the operator's own correct perception (a civilian aircraft) was overridden by orders and a closing time window, so the game never teaches that individual conscience is a reliable safety mechanism.

- ENVIRONMENTAL AND NATURAL CAUSES RECUR and should be a standing part of the scenario deck: the moon (1960), solar radio emission (1967), sunlight glinting off cloud tops (1983), aurora disrupting celestial navigation (1962). None of these are exotic; all are periodic and predictable, which means a player who invests in environmental monitoring can earn the resolving cue rather than being handed it.

- EPISTEMIC HONESTY IN THE GAME ITSELF. Several of these accounts are contested — B-59's details rest on 2002 participant recollections; the 1995 briefcase activation is disputed by serious analysts; Able Archer's danger level is the subject of a live historiographical argument between a declassified 1990 PFIAB report and a 1984 SNIE that reached opposite conclusions; Brzezinski's 1979 timings are retrospective. Consider surfacing this to the player: after a scenario resolves, the debrief can state what is documented, what is estimated, and what remains unknown. That teaches the actual condition of crisis decision-making better than any certainty the game could invent.

- WHAT THE GAME SHOULD NEVER MODEL: weapon design, yield, effects for targeting, arming or permissive-action mechanics, authorization code handling, launch procedures, sensor discrimination logic or spoofing, warning-message formats, NC3 circuit architecture, jamming techniques, or intercept tactics. Every incident above is fully playable at the level of 'what did the operator see, what could they check, how long did they have, and what did they decide.' None of them require a single operational detail to be dramatically effective — the drama is entirely in the epistemics.

---

## Nuclear weapon accidents and custody failures

*15 incidents.*

### Goldsboro B-52 breakup (two Mk 39 bombs released over North Carolina) (1961)

*Faro / Eureka, near Goldsboro, North Carolina, USA*

On 24 January 1961 a B-52G on airborne alert suffered a structural failure and broke up in flight, releasing two Mk 39 thermonuclear bombs. One descended by parachute and was recovered largely intact in a field; the other broke up on impact in a swamp and its secondary stage was never fully recovered — the Air Force bought an easement over the site rather than continue excavating. A 1969 internal Sandia review by Parker F. Jones, declassified in 2013, concluded the Mk 39 Mod 2 'did not possess adequate safety for the airborne alert role in the B-52' and that a credible in-flight short could have produced a …

**Decision problem.** This is the canonical 'how close was it, and who gets to say?' problem. Contemporaneous public statements said there was no danger of detonation; the internal engineering judgment years later said one low-voltage switch stood between the country and catastrophe. The dilemma is not the crash — it is what a commander says publicly within hours, on incomplete recovery data, and whether the honest internal finding ever reaches the people who set alert policy. A second live dilemma: when do you stop digging for a …

**Outcome.** Three of eight crew died. One weapon recovered intact; components of the second (including the uranium secondary) remain buried under the site, which the USAF purchased rights to and monitors. No contamination of significance detected. The incident became a …

**Stresses.** safety-interlock margin, official statement vs internal finding, recovery completeness, public trust, declassification lag, alert-posture policy.

### Tybee Island jettison (Mk 15 bomb lost in Wassaw Sound) — with the Mars Bluff accidental release (1958)

*Wassaw Sound off Tybee Island, Georgia, USA (Mars Bluff: Florence County, South Carolina)*

On 5 February 1958 a B-47 collided in mid-air with an F-86; the damaged bomber jettisoned a ~7,600 lb Mk 15 thermonuclear bomb into shallow coastal water so it could land safely. A 100-person Navy search with hand-held sonar and cable sweeps ran until 16 April and found nothing; the weapon is presumed buried under 5–15 ft of silt. Five weeks later, on 11 March 1958, a separate B-47 accidentally released a Mk 6 bomb over Mars Bluff, South Carolina when a crewman handling a locking pin triggered the emergency release; the conventional explosive detonated, cratering a family's yard and injuring six people. The Mars …

**Decision problem.** Tybee is a clean trolley problem run in real time: jettison a thermonuclear weapon into your own coastal waters to save a crew and a populated landing approach, or attempt a landing with it aboard. It then becomes a permanent, low-grade decision that recurs for seventy years — periodic public campaigns demand a new search, and every administration must weigh 'stir up 15 feet of silt and the politics with it' against 'leave a known object in a known place.' Mars Bluff is the counterweight: the harm was ordinary …

**Outcome.** Tybee: search terminated after ~10 weeks; weapon officially 'irretrievably lost.' A 2001 hydrographic survey and a 2004 interagency review both concluded the safest course was to leave it undisturbed; that remains US policy. Mars Bluff: family compensated, …

**Stresses.** jettison-vs-land decision, search cost, time pressure, recurring political pressure to re-search, disturbance risk vs recovery benefit, local community trust.

### Palomares B-52/KC-135 collision (four B28 bombs, plutonium dispersal, 80-day sea search) (1966)

*Palomares, Almería province, Spain, and offshore Mediterranean*

On 17 January 1966 a B-52G collided with a KC-135 tanker during refueling at ~31,000 ft, killing seven aircrew. Four B28 thermonuclear bombs fell. Three came down on land; two had their conventional explosive detonate on impact, scattering plutonium oxide over roughly 2 km² of farmland. The fourth fell into the sea and was located only after a Spanish fisherman, Francisco Simó Orts, gave a bearing on where it entered the water; DSV Alvin found it and it was recovered from roughly 2,550–2,850 ft on 7 April, 80 days after the crash. Figures for the naval effort vary by source (commonly ~20–33 ships, several …

**Decision problem.** Three simultaneous, competing decisions with different clocks. (1) A radiological cleanup on an allied nation's farmland where every honest measurement damages the ally's tourist economy and the alliance itself. (2) A deep-water search where the highest-value sensor turns out to be one local fisherman's eyewitness memory, not the fleet. (3) A public-reassurance problem, answered by the US ambassador and a Spanish official swimming at the beach for the cameras — a gesture that worked politically and is still argued …

**Outcome.** About 1,750 tons of contaminated soil and vegetation (roughly 5,000 drums) were shipped to the Savannah River Site. Spain later restricted and expropriated land around the site after further surveys found residual contamination. A 2015 US–Spain memorandum …

**Stresses.** contamination extent, allied-nation consent, public trust / tourism economy, local human intelligence value, search depth and cost, worker exposure, long-term liability, disclosure vs reassurance.

### Thule B-52 crash on sea ice (Project Crested Ice) (1968)

*North Star Bay near Thule Air Base, Greenland (Danish territory)*

On 21 January 1968 a cabin fire — traced to a stowage cushion blocking a heating vent — forced the crew of a Chrome Dome B-52 to bail out; one of seven died. The aircraft struck sea ice about 12 km from the base carrying four B28FI bombs. The conventional explosives detonated and burned, contaminating a blackened area roughly 720 x 155 yards. Cleanup ('Project Crested Ice') removed on the order of 237,000 cubic feet of contaminated ice, snow, water and debris to the United States, using roughly 1,500 Danish and US workers in Arctic winter. One weapon's secondary stage was never accounted for; a Star III …

**Decision problem.** The accident detonates a political device as well as a physical one. Denmark's declared policy was that no nuclear weapons were in Greenland — and the crash proved otherwise, forcing Copenhagen to manage a scandal about its own government's secret 1957 accommodation, which finally broke as 'Thulegate' in 1995. The operational dilemmas are brutal and time-boxed: you have a few weeks before the sea ice melts and carries contamination beyond reach; you are working in darkness at -50°F; and every worker-hour of …

**Outcome.** Cleanup completed before breakup of the ice; contaminated material shipped to Savannah River. Chrome Dome airborne alert with live weapons was terminated shortly after. In 1995 Denmark paid roughly 1,700 workers DKK 50,000 each in compensation; a Danish …

**Stresses.** environmental clock (ice melt), host-nation political exposure, secrecy vs allied trust, worker exposure and latent claims, unaccounted-for component, contamination in sediment, Arctic logistics.

### USS Ticonderoga A-4E loss (Empty Quiver at sea; delayed disclosure to Japan) (1965 (disclosed …)

*Philippine Sea, roughly 80 miles from the Ryukyu Islands, Japan*

On 5 December 1965 an A-4E Skyhawk being moved from a hangar bay to an elevator rolled off the deck of USS Ticonderoga with its pilot, Lt. Douglas M. Webster, and a B43 nuclear bomb aboard. Aircraft, pilot and weapon sank in roughly 16,000 ft of water and were never recovered. The loss was not disclosed publicly for years; a 1981 Pentagon list acknowledged a weapon lost 'more than 500 miles from land,' and only in 1989 did the location's proximity to Japan become clear.

**Decision problem.** This is a pure disclosure-timing scenario. The physical event is unrecoverable within minutes — nothing a crisis manager does changes the outcome at sea. Everything that follows is about information: the carrier was en route between Vietnam operations and Japan, and Japan's three non-nuclear principles made any admission that nuclear weapons transited its waters politically explosive. Concealment bought two decades of alliance calm and then produced a far larger crisis when it surfaced — a textbook compounding …

**Outcome.** No recovery was attempted; the depth made it impractical. The 1989 revelation provoked formal Japanese protests and parliamentary uproar and fed long-running disputes over secret US–Japan nuclear transit understandings. The weapon remains on the seabed.

**Stresses.** disclosure timing, host-nation political constraints, alliance trust, recovery infeasibility (depth), records declassification, classification ladder (Broken Arrow vs Empty Quiver).

### K-129 loss and Project Azorian recovery attempt (1968 (recovery 1974))

*North Pacific, ~1,600 nautical miles northwest of Hawaii; wreck at ~16,000 ft*

The Soviet Golf II ballistic missile submarine K-129 sank in March 1968 with all ~98 hands, carrying ballistic missiles with nuclear warheads and nuclear-armed torpedoes. The Soviet Navy searched and failed; US acoustic arrays localized the wreck. In 1974 the CIA, using the purpose-built Hughes Glomar Explorer under a deep-sea mining cover story, attempted to raise the hull from ~16,000 ft. A large portion of the recovered section broke away during the lift. The CIA has acknowledged recovering remains of six crewmen, who were given a burial at sea; claims about what weapons or cryptographic material were …

**Decision problem.** The decision is whether to spend on the order of several hundred million dollars and years of covert engineering to reach an adversary's sunken nuclear weapons — knowing that success is uncertain, that the operation is deniable only until it isn't, and that discovery would itself be a diplomatic crisis. Layered on top: a second lift attempt was planned and abandoned after the operation was exposed in the press, so the player experiences a leak as a mission-ending event. And there is a genuine moral thread — the …

**Outcome.** Partial recovery only; the second attempt was cancelled after press exposure in 1975. The episode produced the 'Glomar response' ('can neither confirm nor deny'), now a standard legal formulation. Much of K-129 and its weapons remain on the seabed. Soviet and …

**Stresses.** attribution/localization confidence, covert operation cost, leak risk, adversary reaction if discovered, handling of adversary dead, classification and denial posture, partial-success outcomes.

### Damascus Titan II explosion (Launch Complex 374-7, W53 warhead ejected) (1980)

*Near Damascus, Van Buren County, Arkansas, USA*

On the evening of 18 September 1980 an airman performing maintenance dropped a socket from a socket wrench inside the silo; it fell roughly 80 feet, struck the missile and punctured the first-stage fuel tank, which began venting hypergolic propellant. Over the next eight and a half hours, on-scene crews and remote commanders disagreed about how to respond. At about 03:00 on 19 September the propellant exploded, destroying the complex, killing one airman and injuring about twenty. The 9-megaton W53 warhead was thrown roughly 100 feet outside the entry gate; its safety features functioned and no radioactive …

**Decision problem.** The single best 'checklist authority vs on-scene judgment' scenario in the nuclear record, and it comes with a built-in eight-hour timer. Remote command structures were reading from procedures written for a situation that did not exist; the men at the hole could smell the propellant and could see the vapor. There was no approved procedure for the actual condition. Separately, local civil authorities and residents were not told there was a warhead on site — a county sheriff ordered evacuations largely on his own …

**Outcome.** One fatality, complex destroyed, warhead recovered intact with safety systems having worked as designed. The accident capped a long argument about Titan II's aging liquid-propellant system; the Titan II force was retired over the following years and the W53 …

**Stresses.** time pressure (multi-hour fuse), on-scene judgment vs remote checklist, absence of an applicable procedure, local-authority notification, evacuation radius, official confirmation policy, aging system risk.

### K-219 missile-tube explosion and manual reactor shutdown (1986)

*North Atlantic, ~680 nautical miles northeast of Bermuda*

On 3 October 1986 the Soviet Yankee I-class ballistic missile submarine K-219 suffered a seawater leak into a missile tube, leading to a rupture and explosion of liquid missile propellants and a serious fire. With control systems damaged, crewmen entered the reactor compartment to lower the control rods by hand; 20-year-old seaman Sergei Preminin completed the last one but could not get out and died. The boat surfaced, was taken under tow, and sank on 6 October in roughly 18,000 ft of water with its reactors and its full complement of nuclear weapons aboard. Soviet officials blamed a collision with USS Augusta; …

**Decision problem.** Two decisions, both under bad information. Aboard: whether to send men into a compartment they are unlikely to leave, to prevent a reactor event in international waters near a US coast — the captain reportedly overrode instructions in ways that later cost him his career. Ashore: Gorbachev chose to notify Reagan directly, and US warships and aircraft standing off the stricken submarine had to be read as either humanitarian presence or intelligence collection. That ambiguity is the game: the same US ship position is …

**Outcome.** Four crew died; the rest were evacuated to Soviet merchant ships. The submarine sank with its weapons and reactors and was never recovered. Preminin was decorated posthumously (later Hero of the Russian Federation, 1997). The incident is credited with a …

**Stresses.** crew sacrifice decision, reactor stability, adversary notification, presence-vs-intrusion ambiguity, attribution dispute (collision claim), tow-vs-scuttle, weapons lost at depth.

### Sunken nuclear inventory: USS Scorpion, K-278 Komsomolets, K-159 (1968 / 1989 / 2003)

*Atlantic ~400 nm SW of the Azores; Norwegian Sea (~1,680 m); Barents Sea near Kildin Island (~240 m)*

USS Scorpion (SSN-589) was lost with 99 hands in May 1968, carrying two nuclear-armed Mk 45 ASTOR torpedoes; the cause was never determined. K-278 Komsomolets sank in April 1989 after an engineering-compartment fire, with 42 dead, carrying a reactor and two nuclear-armed torpedoes. K-159, an unfueled-but-not-defueled decommissioned November-class boat, sank under tow to a scrapyard in August 2003 with about 800 kg of spent fuel aboard, killing nine of ten men on the towing party. All three remain on the seabed. Periodic sampling at Scorpion (1979, 1986, 1998) found no weapon-derived plutonium; Norwegian and …

**Decision problem.** These are the 'permanent open file' scenarios. There is no crisis to resolve — only a recurring annual decision about monitoring budgets, whether to publish sampling results, and whether to attempt recovery when a fishing industry, a neighboring state, or a newspaper demands it. K-159 adds an avoidable-negligence dimension: it sank because a derelict hull was towed in bad weather on pontoons to save money, with a crew aboard, and the decision chain was documented. The player's real question is how much you spend …

**Outcome.** None have been recovered. Scorpion is monitored under the US Navy's annual environmental monitoring reports. Komsomolets was partially sealed by Soviet/Russian expeditions in the 1990s and is surveyed periodically by Norwegian and Russian teams. K-159 remains …

**Stresses.** long-term monitoring cost, containment integrity over decades, neighbor-state standing, publication of sampling data, recovery feasibility vs disturbance risk, cost-driven negligence, fishing industry / public risk perception.

### Kursk (K-141) loss and the delayed acceptance of foreign rescue (2000)

*Barents Sea, ~108 m depth, during a Northern Fleet exercise*

On 12 August 2000 an explosion in the forward torpedo compartment of the Oscar II-class submarine Kursk — attributed by the official inquiry to a leak of high-test peroxide from a practice torpedo with a faulty weld — was followed roughly two minutes later by a much larger detonation of several torpedo warheads. The submarine sank with 118 aboard. The two reactors scrammed and remained stable. Twenty-three men survived in the aft ninth compartment for some hours and left written notes. Russian rescue attempts using domestic submersibles failed repeatedly in poor conditions; Norwegian and British offers of help …

**Decision problem.** The purest 'sovereignty vs survival' decision available, with a hard biological clock and deliberately degraded information. Every hour of delay was defended internally on grounds that are not absurd — a modern SSGN is a repository of secrets, and foreign divers on the hull is an intelligence event. Meanwhile the navy issued statements (contact with the crew, a supposed collision with a foreign submarine) that were false or unsupported, and the collapse of public credibility that followed was arguably more …

**Outcome.** All 118 died. The wreck was raised in 2001 by a Dutch-led commercial consortium (minus the destroyed bow section). The official investigation blamed the peroxide torpedo; a rival collision theory promoted by some Russian officials was not substantiated. The …

**Stresses.** survivor window / time pressure, sovereignty vs foreign assistance, secrecy value of the platform, official statements vs verifiable facts, public trust collapse, reactor stability, salvage cost.

### Minot–Barksdale Bent Spear (six warheads flown unaccounted for) and the ICBM-force follow-on failures (2007 (follow-on …)

*Minot AFB, North Dakota to Barksdale AFB, Louisiana, USA*

On 29–30 August 2007 six AGM-129 cruise missiles carrying W80-1 warheads were mistakenly loaded onto a B-52H at Minot and flown to Barksdale. The warheads were supposed to have been removed before the missiles left storage. Nobody reported them missing; they sat on the aircraft, without the mandated nuclear-security measures, for roughly 36 hours, and the error was discovered by a ground crew at the destination rather than by any inventory system. Investigations found repeated failures of handling procedure and inspection. Four commanders were relieved and many personnel were decertified; a task force under …

**Decision problem.** The failure mode here is not an explosion — it is the discovery that your accounting system does not actually account for anything. For 36 hours the state believed six warheads were in a bunker. The decision cascade is about what you do with that fact: how far up you report, how fast, what you tell allies and adversaries about your own custody reliability, and whether you fire commanders (which restores confidence but strips experience). The 2013–14 sequel adds the most useful mechanic in the whole set: the same …

**Outcome.** No weapon was damaged or at risk of detonation and no radiological event occurred. The Air Force restructured its nuclear oversight, stripped Minot's certification temporarily, and in 2009 stood up Air Force Global Strike Command; the Secretary and Chief of …

**Stresses.** custody accounting latency, discovery by accident, reporting-level decision (Bent Spear vs lower), metric capture / inspection-score inflation, command accountability vs experience loss, adversary perception of custody reliability, morale in a no-win career field.

### Post-Soviet fissile material theft wave (Podolsk 1992, Andreeva Guba and Sevmorput 1993) (1992–1994)

*Podolsk (Luch Production Association), Andreeva Guba and Sevmorput shipyard near Murmansk, Russia*

Between 1992 and 1994 a series of insider thefts of weapon-usable and naval fuel material came to light in Russia. A chemical engineer, Leonid Smirnov, removed roughly 1.5 kg of highly enriched uranium from Luch in Podolsk in small increments over several months; he had no buyer. In July 1993 two naval officers were arrested with about 1.8 kg of HEU taken from a Northern Fleet storage site at Andreeva Guba, roughly 40 km from the Norwegian border. In November 1993 Aleksei Tikhomirov and accomplices cut into a fuel store at the Sevmorput shipyard and removed roughly 4.5 kg of naval fuel (about 20% enriched); the …

**Decision problem.** The lesson these cases teach is counter-intuitive and makes excellent game design: the supply of stolen fissile material was real, the security was genuinely poor, and yet essentially nothing happened — because there was no competent buyer. Every one of these thieves was an amateur who stole first and looked for a market afterwards, and most were caught while looking. For a crisis manager, this creates the central ambiguity of the whole nuclear-security field: you are staring at an intelligence report of a theft …

**Outcome.** All three cases ended in arrests and relatively light sentences; the material was recovered in each. They were, however, the political trigger for a decade of US–Russian cooperative material protection, control and accounting work, and for the Nunn-Lugar …

**Stresses.** insider threat, inventory accounting gaps, absence of a buyer, intelligence ambiguity (amateur vs organized), host-state denial vs quiet cooperation, response proportionality, unknowable baseline.

### Project Sapphire (covert removal of 600 kg of HEU from Kazakhstan) (1994)

*Ulba Metallurgical Plant, Ust-Kamenogorsk, Kazakhstan to Oak Ridge, Tennessee, USA*

After Kazakhstan quietly informed the US ambassador of a poorly secured stock of highly enriched uranium at the Ulba plant, a US assay team confirmed roughly 600 kg of HEU — enough for a substantial number of weapons — sitting in a facility that could not afford to secure it. Options considered included upgrading security in place (rejected as unaffordable) and returning the material to Russia (which showed no interest; Chernomyrdin reportedly told Gore the US could have it). In October–November 1994 a team of about 31 DOE personnel repackaged roughly 2,200 kg of material including the HEU into 448 containers; …

**Decision problem.** This is the rare case where the crisis manager wins, and it is worth building a scenario around what winning looked like. It required a host government willing to be quietly helpful without being publicly seen to need help, a third country (Russia) whose consent or at least indifference had to be secured, a decision to spend real money and airlift capacity on a hypothetical, and a choice to keep the operation secret until after the material was on US soil — then to publicize it, because the publicity was itself a …

**Outcome.** Completed without incident; the material was down-blended over subsequent years. Sapphire became the template for later material-removal operations under the Global Threat Reduction Initiative and is still cited as the founding case of US–Kazakh nuclear …

**Stresses.** host-state consent and face-saving, third-party (Russian) acquiescence, secrecy during transit, cost of prevention with no visible payoff, material accounting and repackaging, announcement timing as a policy instrument.

### Nuclear smuggling stings and the attribution problem: Munich 1994, Tbilisi 2006 and 2010 (1994 / 2006 / 2010)

*Munich airport, Germany; Tbilisi, Georgia (material sourced via the Caucasus and Armenia)*

In August 1994 German authorities seized a container arriving on a Lufthansa flight from Moscow holding about 560 g of mixed uranium/plutonium oxide (roughly 363 g of Pu-239) plus lithium-6; the buyers were undercover officers, and it later emerged that the operation had offered a large financial inducement, which prompted a major political scandal and unusually light sentences in 1995. In February 2006 a Georgian–US sting arrested Oleg Khintsagov, a Russian national from North Ossetia, with a 100 g sample of HEU (assessed as roughly 89% enriched); he claimed to have kilograms more, which were never located. In …

**Decision problem.** Two of the hardest ambiguities in the field, side by side. First, the sting dilemma: an undercover buy is often the only way to take material off the market and identify a network, but a well-funded fake buyer can create the very transaction it interdicts — and Munich showed the consequences, including nuclear material being carried on a scheduled passenger flight at the investigators' instigation, and a court that responded by treating the smugglers leniently. Second, the attribution dilemma: the Georgian HEU …

**Outcome.** Munich: convictions with sentences well below the statutory maximum, a parliamentary inquiry in Germany, and lasting damage to the credibility of nuclear-smuggling intelligence reporting in the mid-1990s. Georgia 2006: Khintsagov convicted and imprisoned; …

**Stresses.** attribution certainty, induced-crime / entrapment risk, evidentiary admissibility, interstate cooperation under political conflict, unrecovered residual stock, sample vs bulk inference, public alarm proportionality.

### IAEA Incident and Trafficking Database (the statistical baseline for material out of regulatory control) (1995–present (records …)

*Global; voluntary reporting by IAEA member states*

The ITDB collects state-reported incidents of nuclear and other radioactive material lost, stolen, improperly disposed of, or otherwise out of regulatory control. As of the most recent public reporting, roughly 4,390 incidents have been recorded since 1993, running about 145–150 per year. In 2024, 147 incidents were reported by 32 of the 145 participating states; only 3 were assessed as likely connected to trafficking or malicious use, 21 were undetermined, and 123 were most likely unauthorized disposal, unauthorized shipment, or discovery of material. Across the database's history roughly 8% of incidents are …

**Decision problem.** This is the instrument panel a crisis manager actually has, and it is a deliberately imperfect one — which makes it excellent game material. Reporting is voluntary and fewer than a quarter of participating states filed anything in a given year, so the database is a floor, not a count; a rising number can mean worse security or simply better reporting, and the player cannot distinguish them from the number alone. It also sets the correct prior: the overwhelming majority of 'nuclear material out of control' events …

**Outcome.** Ongoing. The ITDB underpins IAEA nuclear security guidance, informs border-monitoring deployments, and is the standard public reference for trafficking trend claims. Recent reporting has highlighted growth in incidents involving manufactured goods and scrap …

**Stresses.** reporting completeness / voluntary participation, signal-to-noise ratio, base rates for false alarms, transport-phase vulnerability, orphan sources vs weapons material, trend interpretation ambiguity.

### Mechanics to model

- CLASSIFICATION LADDER AS A GAME RESOURCE. US reporting terms form a ladder the player must choose a rung on, under time pressure and with incomplete facts: NUCFLASH (possible detonation / risk of nuclear war), Broken Arrow (accident involving a weapon, no war risk), Bent Spear (significant incident short of Broken Arrow), Dull Sword (minor), Empty Quiver (confirmed seizure, theft or loss of a weapon), Faded Giant (reactor/radiological). The rung chosen determines notification speed, who wakes up, and how much political oxygen the event consumes. Under-classifying buys quiet and costs credibility later; over-classifying burns trust for the next event. The 2007 Minot case is the model: it was reported as a Bent Spear.

- SEPARATE THE TWO RISKS. Nuclear yield and radiological dispersal are almost independent outcomes with wildly different probabilities. In every historical US Broken Arrow, the conventional high explosive was the thing that detonated — at Palomares (2 of 4 weapons) and Thule (all 4) — dispersing plutonium oxide with zero nuclear yield. A simulation should model P(HE detonation | crash or fire) as material, and P(nuclear yield) as requiring multiple independent conditions that essentially never coincide. Never let a player's die roll produce a yield from an accident; that is both wrong and irresponsible design.

- CORRELATED SAFETY LAYERS. Goldsboro's lesson is that layered interlocks are not statistically independent: crash forces, fire and electrical faults attack several layers at once. Model safety as N layers with a correlation coefficient that rises with crash energy and fire duration. Represent it as an abstract counter ('four of five layers held'), never as a description of what the layers are.

- THE ALWAYS/NEVER TRADEOFF, AND ITS RETROFIT LAG. Every safety or use-control improvement trades availability against unauthorized-use and accident risk. Historically: NSAM-160 (1962) directed coded locks across the force; insensitive high explosive and enhanced detonation safety followed over subsequent decades; retrofits took 10-30 years and were resisted on cost and readiness grounds. Give the player an upgrade queue with multi-year lag, budget cost, and a readiness penalty — so that a decision made in scenario 1 pays off (or doesn't) in scenario 6.

- SEARCH AND RECOVERY ECONOMICS, SHALLOW. Palomares: 80 days, roughly 20-33 ships (sources vary), several thousand personnel, about $80M in 1966 dollars, weapon at ~2,550-2,850 ft, found using early Bayesian search allocation. The decisive input was a single fisherman's eyewitness bearing. Model local human intelligence as a cheap sensor with a large, discontinuous effect on search-area posterior — and make the player decide whether to trust an uncorroborated civilian.

- SEARCH AND RECOVERY ECONOMICS, DEEP. Feasibility collapses with depth. Tybee (~50 ft of water, buried under 5-15 ft of silt) was never recovered because disturbance risk exceeded benefit. Philippine Sea 1965 (~16,000 ft) and K-219 (~18,000 ft) were never attempted. Project Azorian reached ~16,000 ft at a cost on the order of several hundred million 1970s dollars and recovered only part of the hull. Rule of thumb for a sim: cost scales steeply with depth, success probability is well under 50% for hull-scale recovery, and political value (adversary weapons, cryptographic material) is what pays for it, not safety.

- CONTAMINATION IS A DECADES-LONG POLITICAL METER, NOT A CLEANUP TASK. Palomares: ~2 km² affected, ~1,750 tons (about 5,000 drums) of soil and vegetation shipped to Savannah River in 1966; land later expropriated by Spain after further surveys; a 2015 US-Spain memorandum on residual soil remains unimplemented as of the mid-2020s. Thule: roughly 237,000 cubic feet of contaminated ice, snow, water and debris removed; ~0.5 kg (~1.4 TBq) of Pu-239/240 assessed as remaining in Bylot Sound sediments. Design the contamination variable to persist across scenarios and generate recurring political events for 50+ years.

- LATENT WORKER-EXPOSURE LIABILITY. Roughly 1,500 workers on Project Crested Ice; Denmark compensated about 1,700 workers at DKK 50,000 each in 1995; a Danish epidemiological study reported around 40% higher cancer incidence versus comparison groups, a finding that is contested. Palomares cleanup veterans in the US fought for exposure recognition for decades. Mechanic: a hidden liability meter that grows with every hour of unprotected labor and surfaces 20-30 years later as compensation cost and trust damage.

- THE MULTI-HOUR FUSE. Damascus 1980 ran roughly 8.5 hours from the dropped socket (~18:30) to the explosion (~03:00). Real nuclear accidents frequently have long fuses, which is what makes them playable. Structure such scenarios so the player has many turns and the wrong kind of help: a remote command reading from procedures written for a different fault, and an on-scene crew with sensory information nobody upstream has.

- NO APPLICABLE PROCEDURE. The most valuable state to model is not 'the player made the wrong choice' but 'no correct choice was written down.' At Damascus the checklist did not cover the actual condition; at K-219 the reactor had to be shut down by hand because the control system was destroyed. Give scenarios a probability that the procedure library returns nothing, and make on-scene judgment override a costly, career-risking action rather than a free one.

- LOCAL-AUTHORITY NOTIFICATION TRADEOFF. At Damascus, county officials and residents were not told a warhead was on site; a sheriff evacuated on his own initiative and the Air Force declined to confirm the warhead's presence even after it was recovered from a field. Model a toggle: informing local authorities improves evacuation effectiveness and post-event trust but leaks, invites media, and may be constrained by a standing neither-confirm-nor-deny policy.

- DISCLOSURE DEBT COMPOUNDS. The 1965 Ticonderoga loss was not disclosed for 16-24 years and then produced a Japanese political crisis over the three non-nuclear principles. Thule exposed Denmark's own secret 1957 accommodation, which detonated as 'Thulegate' in 1995. Design rule: concealment reduces immediate political cost by some factor but multiplies the eventual cost by time held and by how the truth surfaces (leak > declassification > voluntary disclosure).

- RESCUE VS SOVEREIGNTY, WITH A SHRINKING WINDOW. Kursk: 23 men survived in the aft compartment for some hours; foreign assistance was declined for roughly 4-5 days; Norwegian divers opened the hatch on day 9. Model a survival curve, a national-asset success probability that is low and does not improve with repetition, a foreign-assistance option with a high intelligence-exposure cost, and a public-trust variable that punishes false official statements far more than it punishes failure.

- ADVERSARY PRESENCE IS AMBIGUOUS BY CONSTRUCTION. At K-219, Gorbachev notified Reagan and US ships stood off the stricken submarine; the same ship position reads as humanitarian assistance or as salvage/espionage depending on the trust variable. The Soviet side alleged a collision with USS Augusta; the US denies it. Give the player a 'presence' action whose interpretation by the other side is a function of accumulated trust, not of intent.

- CUSTODY ACCOUNTING HAS LATENCY. At Minot-Barksdale the state believed six W80-1 warheads were in a bunker for about 36 hours while they were on an aircraft, and discovery came from a ground crew, not from any inventory system. Model inventory reconciliation as periodic rather than continuous, with a discovery-latency distribution, and let accidental discovery be a real (and humbling) path.

- METRIC CAPTURE IS THE LEADING INDICATOR. Before the 2013-14 failures, the ICBM force produced 87% perfect scores on tests over two years; a Minot inspection's marginal rating was propped up by blending missile-crew scores with support-staff performance; the Malmstrom exam-cheating scandal implicated roughly 90+ of 190 missileers, surfacing only incidentally during a drug investigation. Design implication: put an 'inspection score' on the dashboard and make suspiciously perfect scores predictive of failure. Reward players who audit the audit.

- ACCOUNTABILITY COSTS EXPERIENCE. Relieving commanders (four in 2007; nine in the 2014 cheating aftermath, plus 14 Article 15s and 70 letters of reprimand) restores external confidence and depletes institutional competence and morale in a career field already regarded as a dead end. Model a tradeoff curve rather than a free action.

- THEFT PROFILE: SUPPLY WITHOUT DEMAND. Documented post-Soviet HEU/Pu thefts were insider, incremental, small-quantity, and buyer-less: Podolsk 1992 (~1.5 kg HEU, no buyer, caught looking for one), Andreeva Guba 1993 (~1.8 kg HEU), Sevmorput 1993 (~4.5 kg of ~20% naval fuel). Model 'seller competence' and 'buyer authenticity' as separate hidden variables — the historical record says the binding constraint on nuclear terrorism has been competent demand, not available supply, and a scenario where those two variables finally align is the genuinely frightening one.

- STING OPERATIONS CREATE WHAT THEY INTERDICT. Munich 1994: ~363 g of Pu-239 within ~560 g of mixed oxide moved on a scheduled passenger flight at the instigation of investigators who had offered a large inducement; the court responded with sentences far below the maximum and a political scandal followed. Georgia 2006: a 100 g HEU sample seized, the claimed 2-3 kg bulk never found. Model a sting as a choice with four outputs: material seized, network intelligence gained, risk of having induced the transaction, and evidentiary/diplomatic damage.

- ATTRIBUTION IS A SLOW, CAPPED CONFIDENCE VALUE. Nuclear forensics narrows origin; it rarely closes a case, and closure usually requires cooperation from the state under suspicion. Georgia 2006 HEU was assessed at around 89% enrichment with a probable Russian-facility origin, and Russia disputed the finding and withheld the access needed to confirm it. Model attribution as confidence that rises asymptotically, can plateau below certainty, and can be actively blocked — and make the player decide what to do at 70%.

- BASE RATES FOR A TRAFFICKING METER (IAEA ITDB). ~4,390 incidents recorded since 1993; ~145-150 per year recently; in 2024, 147 incidents from only 32 of 145 participating states, of which 3 were likely trafficking/malicious, 21 undetermined, 123 benign (unauthorized disposal, shipment, or discovery). All-time: ~8% confirmed trafficking/malicious, ~14% involving nuclear material rather than other radioactive sources, and only around a dozen confirmed trafficking cases involving HEU with a couple involving plutonium. More than half of reported thefts occur in transport. Use these to calibrate a false-alarm-heavy alert stream and to punish both over- and under-reaction.

- REPORTING IS A FLOOR, NOT A COUNT. Because ITDB participation is voluntary and most participating states file nothing in a given year, a rising incident count may reflect improved reporting rather than deteriorating security. Give the player a metric they cannot cleanly interpret, and make 'invest in better reporting' an action that visibly worsens the numbers while actually improving the situation — an excellent trap for a scoring system that rewards falling numbers.

- RESPONDER CAPABILITY IS THIN AND ON-CALL. The US NEST umbrella (NNSA) covers threat-based search, aerial measuring, radiological consequence management, render-safe support, and weapon-accident response, staffed largely by laboratory scientists and technicians serving part-time on call. Model responder availability as a small pool with transit time, competing simultaneous demands, and expertise that is specific rather than general — you cannot surge it.

- THE SUNKEN INVENTORY IS PERMANENT AND CHEAP TO IGNORE. Roughly 32 US Broken Arrows were officially acknowledged for 1950-1980, with about six weapons never recovered (counts vary by source and by what is counted). Soviet/Russian losses include K-129 (1968), K-219 (1986) and K-278 Komsomolets (1989), plus USS Scorpion (1968). Doctrine has settled on periodic monitoring rather than recovery: Scorpion sampled in 1979, 1986 and 1998 with no weapon-derived plutonium detected; Komsomolets surveys have found reactor-derived release from a ventilation duct but no warhead plutonium past 1990s titanium patches; K-159 sits in the Barents Sea with roughly 800 kg of spent fuel after sinking under tow in 2003. Mechanic: an annual monitoring line-item that is politically easy to cut and generates a low-probability, high-salience event when cut.

- CONTESTED RECORDS SHOULD BE PLAYABLE AS CONTESTED. Several canonical episodes rest on disputed or single-source testimony and should be presented to the player the way they reached decision-makers — plausible, uncorroborated, and consequential. Examples: John Bordne's account of a mistaken launch order reaching Mace B crews on Okinawa in October 1962, disputed by other missileers and never officially confirmed; the Soviet claim that USS Augusta collided with K-219; the full extent of what Project Azorian recovered; the Danish cancer-incidence findings among Thule workers; the exact size and composition of the Palomares naval task force. Building at least one scenario where the player must act on a claim that is never resolved is more faithful to the domain than any well-sourced disaster.

- PREVENTION HAS NO VISIBLE PAYOFF — MAKE THAT THE CENTRAL SCORING PROBLEM. Project Sapphire moved ~600 kg of HEU (about 2,200 kg of material total, in 448 containers, on five C-5 flights, 19-22 November 1994) out of a facility that could not afford to secure it, at real cost, against a threat that never materialized. Nunn-Lugar removed over 6,000 warheads from Belarus, Kazakhstan and Ukraine between 1992 and 1996. Neither produces a dramatic moment. If THRESHOLD's ethic is that prevention is the only victory, the scoring system has to reward expenditures whose success is indistinguishable from nothing having happened — and the honest way to show that is to let a player who skips them lose a scenario six turns later to something they cannot trace back.

---

## Chemical incidents and toxic industrial releases

*14 incidents.*

### Bhopal methyl isocyanate release (Union Carbide India Ltd. plant) (1984)

*Bhopal, Madhya Pradesh, India*

On the night of 2-3 December 1984 roughly 40 tonnes of methyl isocyanate and reaction products escaped from a pesticide plant into a densely populated, low-income area sleeping immediately outside the fence line. Safety systems were variously offline, undersized, or non-functional, and there was no working community alarm or public warning plan. Official immediate deaths were around 3,800; independent estimates of deaths within days to weeks run from roughly 8,000 to 16,000, and several hundred thousand people were exposed — figures remain contested to this day.

**Decision problem.** The central dilemma is treating a mass-casualty exposure when the plant operator will not, or cannot, tell you what is in the cloud. Physicians were told to 'just wash their eyes' and had no agent identity for days. A contested clinical hypothesis — that cyanide was a co-toxicant and that sodium thiosulfate would help — split the medical community; some clinicians administered it, the company and some officials denied the cyanide pathway, and the state at one point interfered with clinicians giving it. The crisis …

**Outcome.** The gas dispersed within hours; the medical and legal aftermath ran for decades. A 1989 settlement of USD 470 million was widely criticised as inadequate; Indian criminal convictions of local officials came only in 2010; site contamination persists. The …

**Stresses.** agent identity unknown, operator withholding/denying information, conflict of interest between information source and liable party, treatment decision under scientific uncertainty, no public alarm or warning system, population density at the fence line, wind direction vs. crowd flight direction, hospital surge with no toxidrome guidance.

### Halabja chemical attack (1988)

*Halabja, Iraqi Kurdistan (northern Iraq), during the Iran-Iraq War*

On 16 March 1988, in the closing months of the Iran-Iraq War and immediately after Iranian and Kurdish forces took the town, Iraqi forces attacked Halabja with a mix of chemical agents. Estimates of the dead range from about 3,200 to 5,000 with 7,000-10,000 injured, overwhelmingly civilians; Iranian figures were higher. It remains the largest chemical weapons attack against a civilian population.

**Decision problem.** This is the canonical case of attribution being deliberately fogged for policy convenience. Within a week, a US Defense Intelligence Agency assessment relayed through the State Department suggested Iran might also have used gas at Halabja — a claim later analysed as unsupported, and revived in 1990 by a former CIA analyst. That injected enough doubt that the UN Security Council delayed for roughly two months and then condemned 'both sides,' effectively producing no consequence for anyone. The player faces the …

**Outcome.** No contemporaneous international enforcement action followed. The evidentiary weight later settled firmly on Iraqi responsibility, supported by captured Iraqi Military Intelligence documents; Ali Hassan al-Majid was convicted and executed in 2010 and Iraqi …

**Stresses.** attribution certainty, politically motivated intelligence assessment, access denial (evidence behind a front line), adversary as the only evidence-holder, alliance and arms-supply entanglement, international response threshold, UNSC deadlock, refugee flow across an international border.

### Matsumoto sarin attack (Aum Shinrikyo) (1994)

*Matsumoto, Nagano Prefecture, Japan*

On the night of 27 June 1994, Aum Shinrikyo released sarin from a converted vehicle in a residential neighbourhood, targeting judges hearing a lawsuit against the cult. Eight people died and roughly 140-600 were affected depending on the counting criterion. It was the first confirmed use of a nerve agent by a non-state actor against a civilian population.

**Decision problem.** This is the missed warning that made Tokyo possible, and its failure mode was anchoring on the wrong suspect. Yoshiyuki Kono — who made the first emergency call and whose wife was left comatose — became the police's prime suspect because he kept garden chemicals and there was residue in his pond. Media amplified 'the Poison Gas Man'; he received hate mail for nine months. Prefectural scientists and at least one physician correctly identified the agent as a nerve agent early, but the investigative frame had already …

**Outcome.** Kono was never charged; after the Tokyo attack of March 1995 exposed Aum, the police chief and every major national newspaper publicly apologised to him. He later wrote about the ordeal and became an advocate on wrongful suspicion and media ethics. …

**Stresses.** confirmation bias / premature suspect anchoring, media amplification of an unverified theory, reputational harm to an innocent person, signal ignored between related events, forensic identification vs. investigative narrative, inter-agency information sharing (prefectural lab vs. police), warning-to-next-attack interval (9 months).

### Tokyo subway sarin attack (Aum Shinrikyo) (1995)

*Tokyo, Japan (Marunouchi, Hibiya and Chiyoda lines converging on Kasumigaseki)*

On the morning of 20 March 1995, Aum Shinrikyo released sarin on five subway trains during rush hour, timed to converge on the government district. Thirteen people died in the immediate aftermath (a fourteenth in 2020) and roughly 5,500-6,300 people sought medical care. Casualties self-presented across dozens of hospitals, mostly on foot or by taxi, before any responder knew what the agent was.

**Decision problem.** The best-documented case of the identification lag and the contaminated-patient problem. The agent was not confirmed as sarin for roughly three hours; the confirmation reportedly came from an alert physician and from investigators connecting it to Matsumoto, not from field detection. Responders had essentially no PPE for the first 40 minutes; there was no decontamination line, so patients carried the agent into emergency departments. About 10% of firefighters/EMS and roughly 20-23% of hospital staff at St. Luke's …

**Outcome.** Nobody died of secondary exposure. Aum was raided within days; Shoko Asahara and twelve others were eventually executed in 2018. The attack reshaped global CBRN doctrine: it is the origin point for modern hospital decontamination requirements, responder PPE …

**Stresses.** agent identification lag (~3 hours), responder PPE availability, secondary contamination of responders and hospitals, self-presenting casualties bypassing triage, worried-well ratio (~4:1 to 5:1), antidote stock on hand vs. required, hospital surge capacity and improvised space, inter-agency communication (transit, fire, police, hospitals).

### Al-Shifa pharmaceutical plant strike (Operation Infinite Reach) (1998)

*Khartoum North, Sudan*

On 20 August 1998, US cruise missiles destroyed the Al-Shifa pharmaceutical plant, which the US asserted was linked to VX production and to al-Qaeda. The hardest evidence was a single clandestinely collected soil sample reported to contain EMPTA, a chemical associated with VX production. The plant was a significant producer of medicines for the Sudanese market; subsequent independent scrutiny found no corroboration of the chemical weapons claim, and the strike is now widely characterised as a misjudgement.

**Decision problem.** This is the purest 'act on one sample' dilemma in the whole domain. There was no chain of custody the public or allies could audit: the sampling location, sampler, handling, and analysing laboratory were never disclosed. There was no second sample, no split sample, no independent confirmatory lab, and no on-site inspection. The decision window was compressed by the East Africa embassy bombings two weeks earlier and by a political environment that made both acting and not acting look self-serving. A player faces: …

**Outcome.** The plant owner's US assets were unfrozen without explanation in 1999 and no compensation or formal retraction followed. The episode is routinely cited in arms-control literature as the reason for insisting on multiple samples, documented chain of custody, …

**Stresses.** single-sample evidence / no replication, chain of custody absent or unverifiable, source protection vs. evidentiary transparency, political time pressure after a prior attack, dual-use ambiguity (pharmaceutical vs. precursor), allied and international credibility cost, collateral humanitarian effect (medicine supply), irreversibility of a kinetic response.

### Moscow theatre siege rescue (Dubrovka / Nord-Ost) (2002)

*Moscow, Russia*

Chechen militants seized a theatre with roughly 850 hostages. On 26 October 2002 Russian special forces pumped an aerosolised incapacitating agent — later analysed in survivors' clothing and urine as a carfentanil/remifentanil mixture — into the auditorium before storming it. All 40+ hostage-takers and about 130 hostages died; nearly all hostage deaths were attributed to the agent combined with inadequate medical handling rather than to gunfire.

**Decision problem.** Two nested dilemmas. First, the assault decision: hundreds of hostages with an explosive threat, a deadline, and a chemical option that will incapacitate everyone in the room including the people you are saving. Second — and more instructive for a crisis-management game — the information decision after the fact. Security services refused to tell arriving medics and hospitals what the agent was. Naloxone was given at the scene but in insufficient quantity and without the systemic preparation an opioid mass-casualty …

**Outcome.** Russia never officially named the agent; independent analysis of survivor samples published years later identified the mixture. The European Court of Human Rights ruled in 2011 (Finogenov v. Russia) that Russia violated the right to life through inadequate …

**Stresses.** hostage lives vs. assault risk, operational secrecy vs. clinician need-to-know, antidote quantity and pre-positioning, patient positioning and airway management at scale, EMS not pre-briefed on the intervention, deaths attributable to response rather than to the threat, international/consular pressure for disclosure, post-hoc legal accountability.

### Graniteville chlorine rail release (Norfolk Southern train 192) (2005)

*Graniteville, South Carolina, USA*

At about 02:39 on 6 January 2005, a freight train travelling roughly 47 mph was diverted by an improperly lined manual switch onto an industry track and struck a parked train. A tank car carrying about 90 tons of chlorine was breached, releasing an estimated 60 tons in minutes over a sleeping mill town. Nine people died (including the train engineer), over 550 sought medical care, and roughly 5,400 residents within a one-mile radius were evacuated for about two weeks.

**Decision problem.** A no-notice protective-action decision at 3 a.m. with a dense gas that hugs terrain and pools in low ground. Chlorine is heavier than air, so evacuation on foot or by car can drive people through the highest concentrations, while shelter-in-place is only protective if the building is reasonably tight and the plume passes quickly. Incident command had to make this call before plume modelling was available, at night, with the population asleep, with the fire station itself inside the hazard zone, and with a mill …

**Outcome.** The NTSB attributed the accident to a crew's failure to return a manually operated main-line switch to the normal position, with contributing organisational factors. It became a driver for switch-position awareness rules and for improved tank-car head shields …

**Stresses.** shelter-in-place vs. evacuate under a dense-gas plume, time-to-decision before plume model output, warning system reach and comprehension at night, spontaneous evacuation into the hazard, terrain channelling and low-lying pooling, responder entry with inadequate respiratory protection, hospital surge for respiratory casualties with no antidote, duration of exclusion zone and economic disruption.

### Jilin petrochemical explosion and Songhua River benzene/nitrobenzene spill (2005)

*Jilin City and Harbin, Heilongjiang, China; downstream to the Amur River and Khabarovsk, Russia*

On 13 November 2005 explosions at a CNPC petrochemical plant in Jilin killed five people and discharged roughly 100 tonnes of benzene and nitrobenzene into the Songhua River. The contaminant band travelled downstream toward Harbin, a city of nearly four million, where peak nitrobenzene concentrations were reported at more than thirty times drinking-water limits. Officials publicly denied significant environmental impact for about ten days before Harbin's water supply was cut off.

**Decision problem.** A slow-motion contamination event where the physics gives you days of warning and the politics burns them. Harbin's government initially announced the shutdown as 'maintenance,' which produced exactly the rumour cascade and panic-buying it was meant to avoid; residents concluded an earthquake was coming. The crisis manager holds a genuinely hard tradeoff — announce early with uncertain concentration data and trigger a run on bottled water and mass departure from the city, or delay and lose all credibility when the …

**Outcome.** Harbin's mains supply was suspended for roughly four to five days (about 21-27 November) and restored; China apologised to Russia, the State Environmental Protection Administration head resigned, and Russia mitigated the diluted plume reaching Khabarovsk in …

**Stresses.** public trust vs. panic management, cover story that backfires, time-to-arrival of a predictable contaminant front (days), measurement uncertainty at low concentrations, potable water for millions with supply cut for ~4-5 days, transboundary notification duty, upstream operator (state-owned) as information source, winter conditions and ice cover complicating remediation.

### Ghouta sarin attack (2013)

*Eastern and Western Ghouta, Damascus suburbs, Syria*

In the early hours of 21 August 2013 rockets carrying sarin struck opposition-held suburbs of Damascus. MSF-supported facilities reported roughly 3,600 patients with neurotoxic symptoms in under three hours, of whom about 355 died. Death-toll estimates diverge sharply: France assessed at least 281, the UK at least 350, the US 1,429, and Syrian opposition groups higher still — the range across sources runs roughly 281 to 1,729.

**Decision problem.** Attribution and the 'red line' collide in a compressed window. A UN inspection team led by Åke Sellström was already inside Damascus for a different investigation, and had to negotiate access to impact sites through the government whose forces were the leading suspect, arriving days late with evidence degrading (sarin environmental persistence is short, and impact sites in an active conflict get disturbed). Their mandate explicitly excluded assigning blame. Trajectory analysis of two recovered rockets was …

**Outcome.** The UK Parliament voted against military action; the US paused and pivoted to a Russian-brokered deal under which Syria acceded to the Chemical Weapons Convention and declared its stockpile for removal and destruction — roughly 1,300 tonnes were removed and …

**Stresses.** attribution certainty vs. political commitment (declared red line), evidence degradation clock (days), access negotiated through the suspect party, mandate limits (fact-finding without attribution), casualty estimates diverging 5x between allies, contested forensic geometry, legislative/parliamentary authorisation, alternative to force: negotiated disarmament.

### Khan Shaykhun sarin attack (2017)

*Khan Shaykhun, Idlib Governorate, Syria*

On the morning of 4 April 2017 sarin was released over Khan Shaykhun, killing roughly 80-100 people and affecting hundreds more. The OPCW Fact-Finding Mission concluded on 30 June 2017 that sarin or a sarin-like substance had been used; the OPCW-UN Joint Investigative Mechanism concluded on 26 October 2017 that the Syrian Arab Republic was responsible. The US struck Shayrat airbase with 59 cruise missiles on 7 April, before either finding was published.

**Decision problem.** This is the cleanest study of chain-of-custody under access denial. The FFM could not deploy to the site — security did not permit it — so it worked from samples collected by local actors and handed over in a neighbouring country, plus biomedical samples from casualties evacuated across the border, plus interviews and autopsy material. Russia's core objection was precisely that: samples the OPCW did not itself collect cannot be certified. The Director-General's answer was that custody was documented end to end and …

**Outcome.** The JIM's finding was unanimous among its leadership panel, but Russia vetoed renewal of the JIM's mandate in November 2017 and it lapsed. States Parties responded in June 2018 by voting (C-SS-4/DEC.3) to give the OPCW its own attribution capability — the …

**Stresses.** site access denied, third-party sample collection and documented handover, designated-laboratory independence (multiple labs, split samples), biomedical vs. environmental evidence strength, biomarker detection window (~2 weeks), strike decision preceding technical confirmation, UNSC veto and mandate renewal politics, adversary counter-narrative and information contest.

### Kim Jong-nam assassination with VX (2017)

*Kuala Lumpur International Airport, Malaysia*

On 13 February 2017 Kim Jong-nam, half-brother of the North Korean leader, was attacked in a public airport terminal by two women who wiped a substance on his face; he collapsed and died within roughly twenty minutes. Malaysian authorities identified VX from swabs of the victim's face and eyes. Four North Korean suspects left Malaysia the same day; South Korean intelligence assessed several as ministry of state security personnel.

**Decision problem.** A nerve agent used as an assassination tool in a crowded civilian terminal, discovered only after the fact. For hours nobody knew a chemical warfare agent was present — the terminal continued operating, the body was moved, one of the assailants reported becoming ill, and airport staff and medical personnel were potentially exposed with no PPE and no decontamination. The dilemma stack is unusually rich: when do you close and decontaminate an international hub on a preliminary lab result; how do you handle two …

**Outcome.** North Korea denied involvement and detained Malaysian nationals in Pyongyang; a negotiated swap returned them along with the body, and the two suspects fled. Siti Aisyah's charge was withdrawn in 2019 and Doan Thi Huong pleaded to a lesser offence and was …

**Stresses.** covert use with delayed agent recognition, bystander and responder exposure at a transport hub, decision to close or decontaminate a major facility, autopsy and swab forensics as the only physical evidence, cutouts and deniability (unwitting proxies), state attribution vs. prosecutable individuals, reciprocal hostage-taking and diplomatic escalation, CWC obligation vs. bilateral bargaining.

### Salisbury and Amesbury Novichok poisonings (2018)

*Salisbury and Amesbury, Wiltshire, United Kingdom*

On 4 March 2018 Sergei and Yulia Skripal were found unconscious on a bench in Salisbury; a police officer, DS Nick Bailey, was also seriously affected. Porton Down identified a Novichok-class nerve agent within days, and OPCW technical assistance independently confirmed the identification through two designated laboratories. Four months later, on 30 June, Dawn Sturgess and Charlie Rowley were poisoned in nearby Amesbury by a discarded container disguised as a consumer product; Sturgess died on 8 July.

**Decision problem.** Three distinct dilemmas in one incident. First, diagnostic: paramedics initially treated the Skripals as a suspected opioid overdose — a reasonable read of two unconscious people on a bench — and the drug given in error later turned out to have been clinically beneficial while making the eventual diagnosis harder. Second, public messaging: the government had to tell roughly 500 people who had been in the area to wash their clothes and belongings, which is a message that must convey real risk without triggering …

**Outcome.** The UK attributed the attack to Russian GRU officers; Britain and allies expelled over 150 Russian diplomats in a coordinated action. Twelve sites were decontaminated over about a year, involving an estimated 600-800 specialist military personnel and roughly …

**Stresses.** initial misdiagnosis (toxidrome ambiguity), persistent agent — long environmental residence, how-clean-is-clean / release of sites, risk communication to a worried public without panic, attribution to a state actor and the evidence standard, OPCW confirmation as independent corroboration, secondary victim unconnected to the target, allied coordination (mass diplomatic expulsions).

### Douma chemical incident and the OPCW dissent controversy (2018)

*Douma, Eastern Ghouta, Syria*

On 7 April 2018 an incident in Douma reportedly killed dozens of people, with images showing bodies in a residential building and two gas cylinders found at damaged sites. The US, UK and France struck Syrian facilities on 14 April, before OPCW inspectors reached the site. The OPCW Fact-Finding Mission's final report (1 March 2019) found reasonable grounds that chlorine was used as a weapon.

**Decision problem.** The most institutionally uncomfortable case in the set, and the most valuable for a game about judgement. Two experienced OPCW inspectors dissented from the published findings — one produced an engineering assessment arguing the cylinders were more likely placed than air-dropped, and a toxicological consultation was not reflected in the final text. The OPCW has been publicly criticised for how it handled those inspectors; one, Brendan Whelan, successfully challenged his censure at the ILO Administrative Tribunal. …

**Outcome.** The FFM's finding stands as the OPCW's official position; the IIT later attributed Douma to the Syrian Arab Air Force in a January 2023 report. The dissent controversy has not been resolved to the satisfaction of all parties and continues in tribunal …

**Stresses.** kinetic response preceding investigation, internal institutional dissent and its handling, evidentiary weight of engineering vs. witness vs. sample evidence, site access delayed and possibly disturbed, information operations exploiting genuine uncertainty, credibility of the verification body itself as a game resource, irreversibility of strikes vs. reversibility of sanctions, chlorine as a deniable, dual-use industrial agent.

### East Palestine derailment and vinyl chloride vent-and-burn (2023)

*East Palestine, Ohio, USA*

On 3 February 2023 a Norfolk Southern train derailed after an overheated wheel bearing failed, and eleven cars carrying hazardous materials were involved. Three days later, responders vented and burned the contents of five vinyl chloride tank cars into a trench, producing a large black plume and prompting a roughly one-by-two-mile evacuation. The NTSB later concluded the vent-and-burn was not necessary.

**Decision problem.** A modern, fully documented case of a high-consequence decision made with the wrong information in the room. The stated justification was fear of polymerisation leading to a catastrophic tank rupture — a real hazard, based on a rising temperature reading in one car. OxyVinyls, the chemical's manufacturer, had technical staff on scene who assessed venting as unnecessary, but their view never reached the incident commander (the local fire chief) or the governor; the decision-makers were not even told OxyVinyls was …

**Outcome.** The NTSB's final report (June 2024) attributed the derailment to a failed wheel bearing and found the vent-and-burn unnecessary, singling out the communication breakdown; NTSB Chair Jennifer Homendy testified to that effect in March 2024. Norfolk Southern …

**Stresses.** decision under time pressure with incomplete data, expert opinion present on scene but not routed to the decision-maker, operator/contractor as the primary information channel to command, local incident commander with national-scale consequences, evacuation radius and re-entry timing, public trust collapse and long-term health anxiety, conflicting agency messaging on 'safe to return', irreversibility of a deliberate release.

### Mechanics to model

- IDENTIFICATION LAG IS THE MASTER VARIABLE. In almost every incident the interval between exposure and confirmed agent identity dominated the outcome. Tokyo 1995: roughly 3 hours to confirmation, and it came from clinical pattern recognition plus linkage to a prior event, not from field detection. Bhopal 1984: days, because the operator would not say. Salisbury 2018: days, and the initial working diagnosis was opioid overdose. Kim Jong-nam 2017: hours, after the victim was already dead and the terminal still operating. Model this as a clock the player can shorten by spending on detection, clinical toxicology access, or pre-existing intelligence linkage — never to zero.

- WORRIED-WELL RATIO. Tokyo: roughly 5,500-6,300 sought care but only around 1,000 had objective findings. A ratio of 4:1 to 5:1 unexposed-to-exposed presentations is a reasonable default for a public chemical event; it can be far higher for an event with heavy media coverage and lower for a confined industrial release. The surge is a real resource drain and cannot be dismissed as 'not a real casualty' — triage capacity, not treatment capacity, is the binding constraint in hour one.

- SECONDARY CONTAMINATION RATES. Tokyo, with no decontamination line: roughly 10% of firefighters/EMS and 20-23% of hospital staff at the receiving hospital reported symptoms of secondary exposure. Nobody died of it, but staff attrition at the moment of peak demand is the cost. A game should let decontamination throughput trade directly against time-to-treatment: rushing patients in unwashed saves minutes and costs staff.

- SELF-PRESENTATION BYPASSES YOUR PLAN. In Tokyo the great majority of patients arrived on foot, by taxi, or by private car — before EMS, before any cordon, and at whichever hospital was nearest. Assume 60-80% of casualties in an urban public event reach hospitals outside the EMS system. Any model where the player controls patient distribution is wrong.

- TREATMENT DOCTRINE (public, encyclopedia-level, no uplift). Nerve agents / organophosphates: atropine titrated to drying of secretions and adequate ventilation, an oxime (pralidoxime or obidoxime), benzodiazepines for seizure control, aggressive airway management. Quantities required for a mass event far exceed routine hospital stock — the US pre-positions CHEMPACK caches intended to be reachable within about an hour, and Japan in 1995 had no equivalent. Cyanide: hydroxocobalamin or the nitrite/thiosulfate approach. Opioid incapacitants: naloxone in large repeated quantities plus airway support and correct positioning — Moscow 2002 shows that naloxone without positioning and ventilation still kills. Chlorine and other pulmonary irritants: no antidote at all — humidified oxygen, bronchodilators, supportive care, and watch for delayed pulmonary oedema over 6-24 hours. Vesicants: …

- DECONTAMINATION IS A TIME FUNCTION, NOT A BINARY. Removing clothing alone is commonly cited as eliminating a large majority of particulate and vapour-deposited contamination; the value collapses with delay. In Tokyo there was neither space nor replacement clothing to disrobe everyone. Model decon as throughput (persons/hour/line) against a decaying benefit curve.

- PERSISTENT VS. NON-PERSISTENT DRIVES EVERYTHING DOWNSTREAM. Non-persistent agents (sarin-class, chlorine) create a short, intense casualty event and a short evidence window — sarin environmental residues degrade in days, which is exactly why Ghouta and Khan Shaykhun turned on biomedical rather than environmental samples. Persistent agents (VX-class, Novichok-class, mustard) create a small immediate casualty count and a months-long remediation and liability problem: Salisbury required twelve sites, an estimated 600-800 specialist personnel and roughly 13,000 hours over about a year, and still produced a fatal secondary exposure four months later. Give the player two different loss functions for the two classes.

- BIOMEDICAL EVIDENCE OUTLASTS ENVIRONMENTAL EVIDENCE. Nerve-agent exposure biomarkers in blood are detectable for roughly two weeks or more after exposure — long enough for casualties evacuated across a border to carry the proof with them when inspectors cannot reach the site. This is the single most important forensic mechanic in the attribution game: victims are evidence.

- CHAIN OF CUSTODY IS THE ATTRIBUTION CURRENCY. The strong form: OPCW inspectors collect on site, seal and split the sample, and send to two or more independent designated laboratories that do not know each other's results. The weak form: a third party collects and hands over off-site, custody documented from handover onward (Khan Shaykhun). The failed form: a single sample with undisclosed collector, location, handling and analysing lab (Al-Shifa 1998). Make custody strength a numeric confidence multiplier the player can invest in — and make it visible to adversaries, who will attack the weakest link rhetorically rather than the finding itself.

- MANDATE LIMITS ARE A DELIBERATE CONSTRAINT, NOT AN OVERSIGHT. The UN Mission at Ghouta (Sellström, 2013) was chartered to determine whether chemical weapons were used, not by whom. The OPCW Fact-Finding Mission has the same limit. Attribution required separate bodies: the OPCW-UN Joint Investigative Mechanism (2015-2017, killed by veto in November 2017) and then the OPCW's own Investigation and Identification Team, created by a contested Conference vote in June 2018 (C-SS-4/DEC.3). The IIT has investigated a minority of eligible cases and attributed responsibility in only some of them, and it explicitly cannot assign individual criminal liability. Design implication: 'we confirmed use' and 'we named a perpetrator' should be two separate, sequentially unlocked game states with different time costs and different political prerequisites.

- STANDARDS OF PROOF ARE EXPLICIT AND LOW-ISH. The OPCW works to 'reasonable grounds' — deliberately below a criminal standard. A game should surface this to the player, because the gap between 'reasonable grounds' and 'beyond reasonable doubt' is precisely the space adversaries and domestic critics operate in.

- ALLIED ESTIMATES DIVERGE, AND THE DIVERGENCE IS INFORMATION. Ghouta death tolls: France at least 281, UK at least 350, MSF 355 deaths among about 3,600 neurotoxic presentations in under three hours, US 1,429, opposition sources up to 1,729. A five-fold spread among allies working the same event is a signal about collection thinness, not just about counting method. Let the player see multiple numbers and infer confidence from their spread.

- THE POLITICAL CLOCK RUNS FASTER THAN THE TECHNICAL CLOCK — ALWAYS. Khan Shaykhun: attack 4 April 2017, US strike 7 April, FFM report 30 June, JIM attribution 26 October. Douma: incident 7 April 2018, allied strikes 14 April, FFM report 1 March 2019, IIT attribution January 2023. Halabja: attribution muddied within a week, UNSC action delayed two months, historical consensus decades later. Build the game around this gap. Every response option should have a 'confidence at time of decision' value distinct from 'confidence eventually available.'

- DESTROYING THE INVESTIGATOR IS A LEGITIMATE ADVERSARY MOVE. Russia's 2017 veto of JIM renewal eliminated the attribution mechanism rather than contesting its finding; rebuilding took a contested vote and over a year. Similarly, contesting chain of custody, amplifying genuine internal dissent (Douma), or offering a rival narrative attacks the credibility of the finding without touching the science. Model institutional credibility as a depletable, slowly-regenerating resource that both sides can spend against.

- SHELTER-IN-PLACE VS. EVACUATE. The decision reduces to two questions: does sheltering give adequate protection for the expected exposure duration, and is there time to move people out before the plume arrives. Dense gases (chlorine) hug terrain and pool in low ground, so evacuation on foot can drive people into higher concentrations — Graniteville research documented residents driving into the cloud. Common practice is a combined action: shelter close in and immediately downwind, evacuate the outer ring that has lead time. US ERG-style initial isolation for a large chlorine release runs on the order of hundreds of metres immediately, with downwind protective action distances of one to several kilometres at night (worse at night — stable atmosphere, low mixing, sleeping population, degraded warning reach). Give the player a plume model that takes 20-60 minutes to produce output they will …

- WARNING SYSTEMS UNDERPERFORM THEIR SPEC. At Graniteville, sirens and reverse-911 reached only part of a town of about 5,400 residents at 3 a.m., and a substantial fraction of those who got the message did not know what shelter-in-place actually required (close windows, shut HVAC, interior room, do not evacuate). Model warning as reach × comprehension × compliance, each well below 1.0, and let the player invest in any of the three.

- INFORMATION ARCHITECTURE FAILURE IS THE MOST COMMON PROXIMATE CAUSE. East Palestine: the manufacturer's own expert was on scene saying the burn was unnecessary and the incident commander was never told they existed. Bhopal: the operator denied the toxicant. Moscow: security services refused to tell doctors the agent. Salisbury: paramedics worked an opioid hypothesis. In three of these, the right information physically existed inside the response and did not reach the decision-maker. Build an explicit routing layer: knowing a fact is not the same as the decider having it, and the player should be able to spend actions on 'who else is in the room and what do they know.'

- OPERATOR AS SOLE INFORMATION SOURCE IS A STRUCTURAL CONFLICT. Bhopal (Union Carbide), Jilin (CNPC), East Palestine (Norfolk Southern and its contractor), Graniteville (the railroad) — in each, the party with the technical knowledge was also the party facing liability. Model a disclosure-reliability parameter that degrades as liability exposure rises, and let the player break the monopoly (independent monitoring, mandatory chemical inventory access, a manufacturer hotline) at a cost.

- PUBLIC TRUST IS ASYMMETRIC: SLOW TO BUILD, INSTANT TO LOSE, AND A COVER STORY IS THE FASTEST WAY TO LOSE IT. Harbin announced a water shutdown as 'maintenance' and produced an earthquake panic. Bhopal, Jilin and East Palestine all show the same shape: official reassurance issued before the data supported it, followed by a durable refusal to believe later, accurate all-clears. Trust should be a state variable that gates compliance with future protective actions — a player who burns it in week one cannot get people to shelter in week three.

- PLUME AND RIVER PHYSICS GIVE DIFFERENT DECISION WINDOWS. Air: minutes to an hour, decision under total uncertainty. Water: the Songhua contaminant band travelled roughly 380 km from Jilin to Harbin over about ten days, arriving as a slick reported at tens of kilometres in length, then continued into the Amur and reached Russian cities weeks later. That is days of warning — which the Chinese authorities spent denying rather than preparing. Give riverine and groundwater scenarios a long, visible, predictable countdown so the failure mode is political rather than physical.

- MASS SUPPLY INTERRUPTION SCALES BRUTALLY. Harbin's mains supply was cut for roughly four to five days for a city of close to four million; peak nitrobenzene was reported at more than thirty times drinking-water limits. Water, unlike air, requires the player to substitute a commodity for millions of people on days of notice.

- INDUSTRIAL INVENTORY NUMBERS FOR CALIBRATION. A US pressurised rail tank car of chlorine holds about 90 short tons; Graniteville released roughly 60 tons in minutes and produced 9 deaths, 550+ seeking care, and a 5,400-person, ~2-week evacuation within a one-mile radius. Bhopal released about 40 tonnes of methyl isocyanate over a sleeping city and produced deaths in the thousands. Jilin discharged about 100 tonnes into a river. The lethality-per-tonne varies by orders of magnitude with agent, population density, time of day and confinement — do not let a game imply mass equals casualties.

- NO-NOTICE AND NIGHT MULTIPLY EVERYTHING. Graniteville (02:39), Bhopal (just after midnight), Matsumoto (late evening). Night releases combine a sleeping, unreachable population, atmospherically stable conditions that keep the plume concentrated, reduced staffing at hospitals and at the emergency operations centre, and a decision-maker woken from sleep. A time-of-day multiplier on warning reach, plume dispersion and response staffing is well justified.

- THE WRONG-SUSPECT TRAP DESERVES ITS OWN MECHANIC. Matsumoto is the model: a convenient local suspect who was in fact a victim, an investigation that anchored on him for nine months, and media that amplified an unverified theory to the point of sustained harassment. The prior-probability trap is that an organised non-state programme is genuinely unlikely — until it isn't. Let the player pay a real cost (time, resources, political capital) to keep a low-prior, high-consequence hypothesis alive, and make the cost of closing on the wrong suspect the nine months of the next attack.

- DELIBERATE-ACTION IRREVERSIBILITY. Vent-and-burn, a cruise-missile strike, an evacuation order, a city-wide water shutoff, an airport closure — the domain's decisive actions are one-way doors taken on partial information. Every one of these appears in the record as both a life-saving and an unnecessary act depending on the case. A game about de-escalation should make the reversible option (monitor, sample again, ask who else is on scene, wait for the second lab) mechanically viable and frequently correct, while making it feel as costly as it does in real command.

- THE STRONGEST HISTORICAL OUTCOME CAME FROM NOT STRIKING. After Ghouta, the UK Parliament voted against action and the US pivoted to a Russian-brokered deal; Syria acceded to the Chemical Weapons Convention and roughly 1,300 tonnes of declared agent and precursors were removed and destroyed by 2014. Subsequent chlorine and sarin use nonetheless continued. Both halves of that are true and a serious game should present them together — the disarmament was real and the deterrence failure was real. This is the cleanest available illustration of the game's stated ethic that prevention is the only victory.

- FURTHER REFERENCE CASES NOT WRITTEN UP HERE, if more scenarios are wanted: Seveso 1976 (dioxin release in Italy; a nine-day disclosure delay and a contested evacuation, and the origin of the EU Seveso Directives on major-accident hazards); Mississauga 1979 (chlorine and propane derailment in Ontario prompting the evacuation of about 200,000-220,000 people with zero deaths — the deliberate opposite of Graniteville's shelter decision and a useful paired scenario); 'Yellow Rain' 1981-82 (a US attribution to Soviet-bloc toxin weapons in Southeast Asia that was substantially eroded by the competing pollen/bee-defecation explanation — the case study in publicly committing to an attribution the science then undercuts); the Iraq chlorine VBIED campaign of 2006-07 (an industrial chemical used as a terror multiplier with low lethality but high psychological effect, and the response problem of …

- CONTENT BOUNDARY FOR THE WHOLE DOMAIN. Everything above is response doctrine, verification architecture, decision analysis and public-record history. Keep the game on that plane. Do not represent: synthesis or precursor routes, agent purity or stabilisation, munition or dispersal design, dose-response tables that could function as targeting guidance, environmental persistence figures precise enough to plan around, defeat sequences for specific industrial safeguards, or forensic discriminants precise enough to teach evasion of them. Where a real incident turned on such a detail (the Douma cylinder geometry, the Kim Jong-nam application method, the Bhopal reaction), state that experts disagreed or that a method existed, and move the scene to the decision it forced.

---

## Biological incidents, outbreaks and biosafety failures

*14 incidents.*

### Sverdlovsk anthrax release (1979)

*Sverdlovsk (now Yekaterinburg), Soviet Union*

In early April 1979 an accidental airborne release of anthrax spores occurred at a Soviet military microbiology facility (Compound 19). At least 66 people died — the deadliest inhalational anthrax outbreak on record — with roughly 77–96 identified human cases; totals remain contested because the KGB confiscated hospital and autopsy records. Soviet authorities publicly blamed contaminated meat sold on the black market and maintained that story for 13 years.

**Decision problem.** This is the canonical attribution problem. Both explanations fit the early data: an unusual anthrax cluster is genuinely consistent with tainted meat, and the Soviet meat story was internally coherent. What broke it was pattern, not proof — cases clustered in a narrow ellipse running downwind from the facility, and livestock died along the same axis further south. A crisis manager here must decide how much to stake on a geographic inference when the state holding the evidence is actively suppressing it, and must …

**Outcome.** Soviet authorities vaccinated tens of thousands locally and decontaminated buildings while publicly denying a release. Meselson's 1992 field investigation mapped cases against wind records and published in Science (1994); Yeltsin admitted the military origin …

**Stresses.** attribution certainty, sensor confidence, adversary denial and information suppression, incubation-period uncertainty, animal sentinel signal, time-to-confidence vs time-to-decision, treaty compliance stakes, public trust in official explanation.

### Aralsk smallpox outbreak (Vozrozhdeniye Island testing) (1971)

*Aralsk, Kazakh SSR, and the Aral Sea*

In July–August 1971 a smallpox outbreak in the port town of Aralsk sickened ten people and killed three, all of them unvaccinated. The apparent index case was a young fisheries technician aboard a research vessel that had transited the Aral Sea near Vozrozhdeniye Island, a secret Soviet open-air biological test site. A confidential Soviet report on the outbreak surfaced only in 2002.

**Decision problem.** An outbreak of an eradicable disease occurs in a place with no obvious source, and the only plausible source is a facility the state will not acknowledge. The link is inferential — a ship's track, a distance, a date — and it is genuinely contested: some analysts argue an aerosol could not have carried that far, so the case for a test-origin rests on circumstance rather than evidence. It creates a scenario where a responder must run an aggressive, expensive containment operation (mass vaccination, cordon) on a …

**Outcome.** Soviet authorities quietly ran a large local response — reported figures are roughly 50,000 people vaccinated within about two weeks and hundreds isolated — and the outbreak was contained. The event was not disclosed internationally at the time; the …

**Stresses.** attribution certainty, state secrecy, contested causal chain, ring vaccination capacity, quarantine compliance, eradication-program credibility, information declassification lag.

### Soviet Biopreparat program and the defector-evidence problem (1973–1992)

*Soviet Union (network of facilities including Obolensk, Koltsovo, Stepnogorsk)*

The USSR ratified the Biological Weapons Convention in 1975 while running a large covert offensive program under a civilian-pharmaceutical cover organization, Biopreparat, alongside Ministry of Defence facilities. Western estimates of its size vary widely — commonly cited figures are roughly 40 facilities and tens of thousands of personnel — and rest heavily on the accounts of two defectors, Vladimir Pasechnik (1989, UK) and Kanatjan Alibekov / Ken Alibek (1992, US). Yeltsin issued a decree ending offensive work in April 1992 and acknowledged the program publicly.

**Decision problem.** The core dilemma is what a government does with one credible human source and no physical proof, against a treaty with no verification machinery. Acting on Pasechnik's account meant confronting a nuclear-armed state mid-collapse and risking the arms-control relationship; not acting meant letting a violation stand. The US and UK chose a quiet track — private confrontation, then the 1991 site visits and the 1992 Trilateral Agreement — trading public accountability for access. That access then stalled when Russia …

**Outcome.** Trilateral (US/UK/Russia) reciprocal visits began in 1991–1992 and stalled by the mid-1990s over denied access to Ministry of Defence sites. Threat-reduction programs redirected funding to former weapons scientists. Some facilities' status has never been …

**Stresses.** single-source intelligence reliability, verification access, treaty compliance ambiguity, escalation cost of public accusation, regime instability, scientist brain-drain risk, transparency-vs-access tradeoff.

### "Yellow Rain" allegations (1979–1987)

*Laos, Cambodia, and Afghanistan; investigated from Thailand*

From 1981 the US government publicly alleged that Soviet-supplied trichothecene mycotoxins were being used against Hmong and other populations in Southeast Asia, based on refugee testimony and a small number of environmental samples. Matthew Meselson and Thomas Seeley later argued the yellow spots were the pollen-laden droppings of wild Asian honeybees on cleansing flights, and field work from 1983 onward undercut the physical evidence. The episode is still contested: refugee accounts of attacks and illness have never been fully explained, and the US never formally retracted the charge.

**Decision problem.** A near-perfect false-attribution case with the polarity reversed from Sverdlovsk. Here the intelligence community had eyewitness testimony, a plausible adversary, a political incentive to believe, and samples that seemed to confirm — and the samples were a natural phenomenon nobody had thought to rule out. The decision dilemma: how much do you spend proving a negative, and who is empowered to challenge a conclusion the government has already announced at cabinet level? It also models the reputational trap — once a …

**Outcome.** No consensus. The scientific mainstream accepts the natural-origin explanation for the yellow deposits; the allegation remains formally unwithdrawn and some analysts maintain the human-illness reports are unaccounted for. The episode is now standard teaching …

**Stresses.** attribution certainty, confirmation bias / institutional commitment, witness testimony vs physical evidence, baseline environmental confounders, political incentive to attribute, sample chain-of-custody, cost of retraction.

### Rajneeshee salmonella contamination of restaurant salad bars (1984)

*The Dalles, Wasco County, Oregon, USA*

Members of the Rajneeshpuram commune deliberately contaminated salad bars at ten local restaurants over roughly two weeks in September 1984, intending to suppress turnout in a county election. 751 people developed salmonellosis, 45 were hospitalized, and no one died. It remains the largest bioterrorism attack on US soil by case count.

**Decision problem.** The outbreak did not look deliberate. State and CDC investigators initially attributed it to food-handler hygiene — a completely reasonable read, because that is what almost every restaurant salmonella outbreak is. The deliberate nature was established more than a year later, and largely through a criminal investigation and insider disclosure rather than epidemiology. This gives a game the most uncomfortable lesson in the domain: the default hypothesis is usually correct, so the epistemically responsible …

**Outcome.** A separate law-enforcement investigation of the commune in 1985 uncovered the laboratory and the plot; two officials were convicted. The CDC/Oregon Health Division published a retrospective analysis in JAMA (1997) reconstructing how the deliberate signature …

**Stresses.** deliberate-vs-natural discrimination, base rates favoring the innocent explanation, two-wave epidemic curve, local-vs-federal jurisdiction, insider disclosure as the decisive evidence, public trust in food supply, proportionality of response.

### Birmingham smallpox escape (Janet Parker) (1978)

*University of Birmingham Medical School, UK*

Janet Parker, a medical photographer working a floor above a smallpox research laboratory, contracted smallpox in August 1978 and died on 11 September. Her mother also contracted the disease and survived. The Shooter Inquiry attributed transmission to airborne spread via poorly maintained ductwork and documented multiple containment and procedural deficiencies; that specific transmission route was later disputed by expert witnesses, and the University was acquitted at a health-and-safety prosecution.

**Decision problem.** It happened at the worst possible moment: the world was months from certifying smallpox eradication, and a single case in a Western city threatened both the public-health achievement and the legitimacy of continued laboratory retention of the virus. Decision pressure runs three ways — contain the outbreak, determine the source fast enough to close other labs if needed, and manage a scientist whose career and mental state are collapsing under the investigation. The laboratory director died by suicide in early …

**Outcome.** Contacts were traced, quarantined and vaccinated and the outbreak stopped at two cases. Global smallpox eradication was certified in 1980. The incident directly drove the consolidation of variola stocks into a small number of designated repositories and …

**Stresses.** containment integrity, source attribution within a facility, ring vaccination and contact tracing, reputational stakes for an eradication program, investigator blame vs learning culture, personnel psychological load, regulatory consequence.

### Aum Shinrikyo's biological weapons attempts (Kameido anthrax release) (1990–1995)

*Tokyo and other sites, Japan*

Aum Shinrikyo attempted roughly seven biological attacks between 1990 and 1995 — several using anthrax and several using botulinum toxin — none of which caused a single known casualty. In June–July 1993 the group released material from a building roof in Kameido, Tokyo; neighbours complained of a foul smell and a residue, and authorities handled it as an environmental nuisance complaint. Retrospective molecular analysis showed the organism matched an attenuated veterinary vaccine strain, consistent with cult members' later testimony.

**Decision problem.** This is the missed-warning scenario. A well-funded group made repeated attempts on a major capital over five years, and the state learned about it only after the group's 1995 chemical attack on the subway. The Kameido signal reached authorities — odour complaints, a visible residue, samples collected and archived — and was routed to the wrong institution. The game dilemma is triage: what threshold of anomaly justifies escalating a nuisance complaint to a national security investigation, given that almost all such …

**Outcome.** The bio program was uncovered during the post-1995 sarin investigation. A 1999 retrospective case-finding survey found no human anthrax cases from Kameido. Molecular work published in 2001–2004 confirmed the vaccine-strain identity. No one was prosecuted for …

**Stresses.** signal detection in noise, cross-agency routing and escalation thresholds, intent-vs-capability gap, retrospective forensics on archived samples, civil liberties constraints on investigating a group, zero-casualty attacks producing zero institutional learning.

### Surat plague outbreak and panic (1994)

*Surat, Gujarat, India*

In September 1994 an outbreak of what was reported as pneumonic plague in Surat triggered a national and international emergency. Roughly 1,200 people were treated as cases with around 53–56 deaths, but laboratory confirmation was slow and disputed at the time; a DNA-based study in 2000 confirmed Yersinia pestis. Within days, an estimated quarter of the city's population — several hundred thousand people, including a large share of its doctors and administrators — fled.

**Decision problem.** The disease was the smaller problem. The population's flight response, the collapse of local medical staffing, and the international reaction (flight suspensions, import bans, near-isolation of a country) all ran ahead of any confirmed diagnosis. Economic loss estimates run to hundreds of millions of dollars. For a crisis-management game this is the purest demonstration that public trust and information management are load-bearing state variables: announce too early with weak lab confirmation and you cause a …

**Outcome.** Antibiotic treatment and prophylaxis contained transmission within weeks; the feared national epidemic did not materialize. The episode was a direct driver of arguments for reforming international outbreak notification, which eventually fed into the revision …

**Stresses.** diagnostic confidence vs announcement timing, public trust, population flight / behavioral contagion, health-workforce attrition under panic, international trade and travel restrictions, economic cost, rumour and unfounded attribution claims.

### Amerithrax: the 2001 anthrax letters (2001)

*Florida, New York, New Jersey, Washington DC, USA*

Letters containing anthrax spores were mailed to news organizations and two US Senate offices in September–October 2001. Twenty-two people were infected (11 inhalational, 11 cutaneous) and five died; roughly 32,000 people started antibiotic prophylaxis. The FBI's nine-year investigation publicly named a first suspect, Steven Hatfill, who was later exonerated and compensated, then concluded in 2010 that a USAMRIID scientist, Bruce Ivins, had acted alone; Ivins died by suicide in 2008 before charges were filed.

**Decision problem.** Four separate decision dilemmas stack in one incident. (1) The first case looked like naturally acquired cutaneous anthrax and was nearly written off. (2) Prophylaxis had to be offered to tens of thousands of people on incomplete exposure data, and adherence to the 60-day course was poor. (3) Attribution was named publicly before it was established, and destroyed an innocent man's life. (4) The final conclusion rests on scientific evidence that a 2011 National Academies review found consistent with, but not …

**Outcome.** Case formally closed February 2010. Decontamination was long and expensive — roughly $42M for the Hart Senate Office Building and about $130M and a year for the Brentwood postal facility. Hatfill received a $4.6M settlement. The attacks drove US biodefense …

**Stresses.** attribution certainty, cost of premature public naming, prophylaxis logistics and adherence, decontamination time and cost, insider threat, novel forensic method reliability, hoax and copycat load on responders, public trust in mail and institutions.

### Wood Green "ricin plot" false positive (2003)

*London, UK*

Following January 2003 arrests in north London, a presumptive test suggested ricin was present at the flat. Within about two days Porton Down's confirmatory testing found no ricin on any of the items, but the correction was not propagated — the initial positive was passed on instead — and the 'discovery' entered public and political messaging, including a reference in the US Secretary of State's February 2003 UN Security Council presentation on Iraq. The absence of ricin became publicly known only at the 2005 trial.

**Decision problem.** A single laboratory communication failure propagated into a war rationale. The decision dilemma is about the gap between presumptive and confirmatory results: presumptive tests are fast and are designed to over-call, confirmatory tests are slow and authoritative, and crisis communications are built to consume the first and ignore the second. It models a scenario where the correct play is to hold the line on 'unconfirmed' against enormous political pressure to announce, and where a retraction pathway must exist and …

**Outcome.** One defendant, Kamel Bourgass, was convicted of murder (of a police officer during arrest) and of a poisons/explosives conspiracy; four co-defendants were acquitted in April 2005 and the ricin claim collapsed publicly. No formal correction had been issued in …

**Stresses.** presumptive vs confirmatory test discordance, false-positive rate, correction propagation and retraction latency, political demand for early certainty, irreversibility of a public claim, effect on an unrelated policy decision, wrongful accusation of individuals.

### SARS laboratory escapes after the natural outbreak ended (2003–2004)

*Singapore; Taipei; Beijing, China*

After the natural SARS epidemic was declared contained in July 2003, the virus re-emerged from research laboratories on several occasions — a graduate student in Singapore (September 2003) infected via a cross-contaminated specimen, a researcher in Taipei (December 2003), and a cluster at the National Institute of Virology in Beijing (March–April 2004). The Beijing events produced onward community transmission: roughly nine cases and one death — the index researcher's mother, a physician who nursed her — with about a thousand contacts quarantined.

**Decision problem.** This is the 'self-fulfilling epidemic' problem: the disease had been beaten in nature and was subsequently reintroduced by the people studying it. It gives a game an unusual, morally complicated decision — how much research on a pathogen is worth doing once the pathogen no longer circulates, and who decides. It also models rapid discrimination pressure: when a new SARS case appeared in 2004, responders had to determine within days whether it was a natural re-emergence (implying the containment claim had failed and …

**Outcome.** Each cluster was contained by isolation and contact tracing. WHO investigators raised biosafety concerns at the Beijing institute; Chinese authorities closed the laboratory and disciplined officials. The episodes are now standard citations in the literature …

**Stresses.** natural re-emergence vs lab origin discrimination, biosafety compliance and oversight, research-benefit vs residual-risk tradeoff, contact tracing scale, cross-contamination of unrelated specimens, travel-related seeding, regulator credibility.

### Pirbright foot-and-mouth disease escape (2007)

*Pirbright, Surrey, UK*

An FMD outbreak confirmed at a Surrey cattle farm on 3 August 2007 was traced within days to the Pirbright site shared by a government research institute and a commercial vaccine manufacturer. Investigators identified the virus as a reference strain not circulating in animals, and concluded that defective shared effluent drainage — combined with heavy rain and site construction traffic — had most plausibly carried infectious material off-site. A national livestock movement ban and export suspension followed; a second cluster in September was traced to the same source.

**Decision problem.** Attribution was unusually fast because the strain was effectively a museum specimen, which is a nice inversion of the usual game dynamic: the sensor gives you a near-certain answer almost immediately, and the hard decisions are all downstream. Those decisions are severe — you must impose an economy-wide movement ban on livestock within hours to prevent a repeat of 2001 (which cost the UK billions and millions of culled animals), while simultaneously handling the fact that the source is a government facility and a …

**Outcome.** Eight premises were infected and animals were culled on affected farms; the outbreak was declared over by the end of 2007. HSE and an independent review (Spratt) documented long-standing effluent pipework defects and inadequate site-wide biosecurity …

**Stresses.** rapid strain-based attribution, shared-infrastructure accountability gap, economy-wide movement restrictions, agricultural export and trade shock, culling decisions under uncertainty, regulator conflict of interest (state as operator and investigator), weather as a release amplifier.

### German E. coli O104:H4 outbreak and the Spanish cucumber misattribution (2011)

*Northern Germany, spreading to 16 countries*

A large Shiga-toxin-producing E. coli outbreak beginning in May 2011 caused roughly 3,950 confirmed cases and about 53 deaths, with an unusually high proportion of haemolytic uraemic syndrome and an atypical case profile skewed toward adult women. German authorities publicly identified Spanish cucumbers as the likely source before laboratory confirmation; the link was never confirmed. Traceback ultimately identified sprouts grown from a lot of fenugreek seed imported from Egypt.

**Decision problem.** A naturally occurring outbreak that produces exactly the attribution dilemma of a deliberate one. The pressure to name a source in a food outbreak is enormous — every day without a named vehicle is more cases — and the German authorities named one on preliminary information. The cost of being wrong was borne by an innocent third party and an entire national sector, with EU compensation of roughly €220 million and Spanish grower losses reported in the range of $200 million per week during the accusation period. The …

**Outcome.** The sprout source was identified in June 2011 and the outbreak ended by late July. The EU paid roughly €220M in compensation to growers; a German court later held that a wrongly accused Spanish grower should be compensated. The episode is a standard case …

**Stresses.** premature public attribution, traceback latency vs case accrual, collateral economic harm to a wrongly named party, atypical clinical signature as an anomaly flag, cross-border trade retaliation, compensation and liability, authority credibility after a retraction.

### US federal laboratory biosafety failures of 2014 (2014)

*CDC Atlanta; NIH/FDA campus, Bethesda, USA*

Three incidents surfaced within weeks: up to 84 CDC staff were potentially exposed to live anthrax after material was moved to lower-containment areas; a CDC influenza laboratory cross-contaminated a benign avian influenza culture with a highly pathogenic H5N1 strain and shipped it to a USDA laboratory, with the error reported roughly two months late; and six forgotten vials of variola dating to the 1960s were found in a cold room on the NIH campus. No one became ill in any of the three.

**Decision problem.** These are near-misses, which makes them ideal for a prevention-is-victory game: nothing bad happened, and the correct response was still drastic. The CDC director halted transfers out of high-containment laboratories and closed two labs — a decision that visibly damaged his own agency's credibility and capacity in order to fix a culture problem. The reporting delay on the H5N1 shipment is the sharpest variable: the failure was known internally for weeks before it was escalated, so the game mechanic is not 'did the …

**Outcome.** CDC imposed a moratorium on biological material transfers from BSL-3/4 laboratories, closed the anthrax and influenza laboratories temporarily, appointed a laboratory safety lead and an external safety workgroup, and testified before Congress. The variola …

**Stresses.** internal reporting latency, self-imposed operational shutdown as a credibility cost, inventory and material accountability, near-miss learning vs punishment, regulator investigating itself, congressional and public oversight response.

### Mechanics to model

- INCUBATION IS THE CLOCK. The defining biological mechanic is that the crisis begins invisibly and the manager learns about it late. Useful public ranges: salmonellosis 6–72 hours; SARS 2–10 days; smallpox 7–19 days (rash onset ~12–14); Ebola 2–21 days; inhalational anthrax typically 1–7 days but with a long tail — the Sverdlovsk outbreak produced fatal cases up to ~43 days after exposure, which is the single most important number in the domain because it means 'is it over?' is unanswerable for six weeks. Model detection lag separately from incubation: the first case is almost always diagnosed as something else.

- EPIDEMIC CURVE SHAPE IS THE PRIMARY 'SENSOR'. A sharp point-source curve (many cases with onsets clustered around one exposure time, no secondary spread) suggests a single release; a propagated curve with successive generations suggests person-to-person transmission. Sverdlovsk was resolved by geography (a narrow downwind ellipse plus livestock deaths along the extended axis), not by laboratory work. Give the player curve shape, spatial distribution, and animal sentinel data as noisy, gradually resolving instruments rather than a binary 'attack: yes/no' readout.

- FORMAL DELIBERATE-VS-NATURAL SCORING EXISTS AND IS WEAK. The Grunow–Finke Assessment Tool scores 11 non-conclusive criteria (biorisk, biothreat context, special aspects, geographic distribution, environmental concentration, epidemic intensity, transmission mode, timing, unusually rapid spread, population limitation, clinical presentation) at 0–3 points each with weighting factors of 1–3, plus 2 conclusive criteria (agent identified as a warfare agent; proof of release). Published evaluations found the original tool has low sensitivity — it under-calls genuine deliberate events — and a modified version (mGFT) was recalibrated to improve this. This is an ideal in-game mechanic: an official score that gives the player a defensible number that is known to be wrong in a specific direction.

- BASE RATES PUNISH SUSPICION. Nearly every unusual outbreak is natural. The Rajneeshee attack was initially attributed to food-handler hygiene because that is the correct answer for almost all restaurant salmonella outbreaks; the 2011 German E. coli outbreak looked atypical and was natural. A well-designed game should make the paranoid player lose points routinely and only occasionally be right — and should make premature public attribution (Spanish cucumbers, Steven Hatfill) carry heavy, durable penalties.

- ATTRIBUTION LATENCY IS MEASURED IN YEARS, NOT DAYS. Amerithrax ran roughly nine years, tens of thousands of investigator-hours, and over $100M, and the 2011 National Academies review still concluded the genetic evidence was consistent with but not conclusive of the government's theory. Genomic forensics reliably narrows a candidate pool and excludes hypotheses; it rarely names a person. By contrast, Pirbright was attributed in days because the strain was a non-circulating reference isolate. Model attribution speed as a function of how distinctive the organism is relative to its natural background, not of investigative effort.

- STATE ACCESS IS THE BINDING CONSTRAINT ON ORIGIN QUESTIONS. Sverdlovsk took 13 years to resolve because records were confiscated; Aralsk surfaced in 2002; COVID-19 origins remain formally unresolved, with US intelligence assessments split across agencies and almost all rated 'low confidence' — some favouring natural spillover, some a research-related incident, some declining to choose. The lesson for a game: an attribution track that depends on the cooperation of the state you are accusing can stall permanently, and the honest end-state for many scenarios is 'unresolved,' which should be a survivable outcome rather than a loss.

- DETECTORS AND PRESUMPTIVE TESTS OVER-CALL BY DESIGN. The US BioWatch environmental system logged on the order of 149 false positives between 2003 and 2014, including a 2003 Houston signal for tularemia caused by naturally occurring environmental bacteria and a 2005 signal on the National Mall during a mass gathering. The 2003 Wood Green case shows the corresponding failure mode in the lab: a presumptive positive, a confirmatory negative within about two days, and a correction that never propagated. Build in a two-stage test mechanic — fast/sensitive/wrong vs slow/specific/authoritative — plus an explicit retraction-latency variable.

- PROPHYLAXIS AND VACCINATION HAVE HARD WINDOWS AND SOFT ADHERENCE. Post-exposure antibiotic prophylaxis for inhalational anthrax exposure is a 60-day course; in 2001 roughly 32,000 people started it and completion rates were poor (widely reported well under two-thirds, varying by exposed group). Smallpox post-exposure vaccination is most effective given within about four days of exposure, which makes contact-tracing speed the whole game. Aralsk-style mass vaccination (on the order of 50,000 people in about two weeks in a small town) is achievable but consumes the entire local health workforce.

- RESPONSE COSTS ARE DOMINATED BY DECONTAMINATION AND TRADE, NOT TREATMENT. 2001 anthrax: ~$42M for the Hart Senate Office Building, ~$130M and about a year for the Brentwood postal facility. 1994 Surat plague: economic loss estimates commonly cited above $600M (some higher), against 53–56 deaths. 2011 E. coli: ~€220M in EU grower compensation, with Spanish losses reported around $200M/week while wrongly accused. 2001 UK foot-and-mouth (the counterfactual behind the 2007 response) cost billions and millions of culled animals. Damage models should weight economic and trust variables far above case counts.

- PANIC AND FLIGHT ARE FIRST-ORDER STATE VARIABLES. In Surat, roughly a quarter of the city's population left within about three days, including a large share of its doctors and administrators — the response capacity degraded faster than the epidemic grew. Model health-workforce attrition, population flight, and international travel/trade restrictions as feedback loops driven by announcement timing and perceived credibility, not by case numbers.

- WHO PHEIC MECHANICS (IHR 2005). A state party must assess events using the Annex 2 decision instrument and notify WHO within 24 hours of that assessment (Art. 6); it must respond to WHO verification requests within 24 hours (Art. 10). The Director-General convenes an Emergency Committee of independent experts, but the committee is advisory — the DG alone determines a PHEIC, defined as an extraordinary event constituting a public health risk to other states through international spread and potentially requiring a coordinated international response. Temporary Recommendations are non-binding and time-limited (expiring after three months unless renewed). There is no enforcement: states routinely impose trade and travel measures beyond WHO advice, and states routinely delay notification.

- PHEIC IS BINARY, WHICH IS ITS MAIN DESIGN FLAW. There is no intermediate alert tier, so the DG faces an all-or-nothing choice between under-reacting and triggering global economic consequences. Declarations to date: H1N1 (2009), wild poliovirus (2014, still in force), Ebola in West Africa (2014), Zika (2016), Ebola in Kivu (2019), COVID-19 (2020), mpox (2022) and mpox again (2024). The 2022 mpox declaration was made by the DG despite the Emergency Committee failing to reach consensus — a clean example of the DG overriding expert advice, in the direction of caution.

- THE 2014 EBOLA DELAY IS THE REFERENCE CASE FOR NOTIFICATION FAILURE. WHO was notified on 23 March 2014 and declared a PHEIC on 8 August 2014, by which point there were roughly 1,779 confirmed and suspected cases and close to a thousand deaths. WHO's own Ebola Interim Assessment Panel called the delay 'significant and unjustifiable,' attributing it to bureaucratic caution, political sensitivity, and deference to state sovereignty. In-game, make the declaration decision cost something real in both directions: declaring early imposes economic damage on the affected state, which is precisely why affected states lobby against it.

- THE BWC HAS NO VERIFICATION PROTOCOL AND NO INSPECTORATE. In force since 1975 with roughly 190 states parties, the Convention has no organization comparable to the OPCW or IAEA. An Ad Hoc Group negotiated a legally binding compliance protocol with declarations, routine visits and challenge inspections from 1995; the United States rejected the draft in July 2001, arguing it would expose legitimate biodefense and commercial secrets while failing to catch determined proliferators, and the Fifth Review Conference was suspended in December 2001 after the US moved to terminate the group's mandate. No verification regime has been agreed since. Confidence-Building Measure declarations are voluntary and submission is partial; the Implementation Support Unit is a handful of staff.

- THE ONLY INVESTIGATION MECHANISM FOR ALLEGED BW USE IS THE UNSGM, AND IT HAS NEVER BEEN USED FOR ONE. The UN Secretary-General's Mechanism (GA resolution 42/37C, 1987; reaffirmed by UNSC 620, 1988) maintains a roster of roughly 500 experts, 40 consultants and 80 laboratories, and can investigate alleged use of chemical or biological weapons independently of the BWC. It has been used for chemical allegations (Syria, 2013) but never for a biological one. Under the BWC itself, the escalation ladder is Article V (consultative meeting) then Article VI (complaint to the UN Security Council) — where a permanent member can veto. Any game that models an accusation pathway should make the ladder short, slow, and stoppable.

- DUAL-USE PUBLICATION DECISIONS ARE THEIR OWN CRISIS TYPE. In December 2011 the US NSABB recommended, for the first time, that two influenza transmissibility manuscripts be published without their experimental details. Redaction proved unworkable: it would have triggered export-control law and no mechanism existed for controlled sharing with legitimate public-health users, forcing a binary choice. In March–April 2012 the NSABB reversed — unanimously for one manuscript and 12–6 for the other — and both were published. A subsequent US funding pause on certain gain-of-function work ran from October 2014 to December 2017. This gives a game a decision node with no operational content at all: what a state does with dangerous knowledge that already exists.

- LABORATORY ESCAPE IS A RECURRING, NOT EXCEPTIONAL, EVENT. Documented cases in this set: Birmingham smallpox (1978, one death plus one survivor), six reported SARS escapes across three cities in 2003–2004 with the Beijing cluster producing about nine cases and one death and roughly a thousand quarantined, Pirbright FMD (2007), and the 2014 US near-misses. Two mechanics fall out of this: (a) reporting latency — the CDC H5N1 cross-contamination was shipped in March 2014 and reported in late May; (b) the 'self-fulfilling epidemic' — SARS was reintroduced from laboratories after natural transmission had ended, meaning research on a contained pathogen carries a nonzero chance of restarting it.

- BLAME CULTURE DESTROYS THE REPORTING PIPELINE. The Birmingham laboratory director died by suicide during the 1978 investigation; the CDC's 2014 response was to shut its own labs and publicly absorb the credibility hit. A game should reward voluntary early disclosure of near-misses and penalize concealment more heavily than it penalizes the underlying accident, because that is both the real regulatory lesson and the correct incentive to teach.

- HOAXES AND COPYCATS ARE A RESOURCE-DRAIN MECHANIC. After October 2001, US responders handled thousands of white-powder incidents, each consuming hazmat teams and laboratory capacity that were needed for real cases. Model a rising hoax rate as a downstream consequence of publicity, competing directly with the real investigation for the same limited assets.

- CLINICAL SEVERITY REFERENCE (for damage modelling, encyclopedic level only). Inhalational anthrax: historically ~85–90% fatal untreated; with modern intensive care, 5 of 11 died in 2001 (~45%). Cutaneous anthrax: ~20% fatal untreated, well under 1% treated. Variola major: ~30% case fatality. SARS: ~10% overall, strongly age-dependent. Ebola: 25–90% by outbreak, ~40% in West Africa 2014–16. Salmonellosis: rarely fatal — 751 cases, 45 hospitalizations, zero deaths in The Dalles. Note that low lethality does not mean low disruption; the Rajneeshee and Surat cases had the largest societal effects per death in this set.

- CONTENT-SAFETY RAIL FOR THE WHOLE DOMAIN. Every incident above can be dramatized entirely through detection, attribution, communication, logistics, and diplomacy. Keep agents as named diseases with clinical and epidemiological properties only. Never depict acquisition, culture, stabilization, dispersal, strain selection rationale, containment bypass steps, or why a historical attempt failed technically. Where a real failure mode is known (Kameido, Pirbright drainage, CDC transfers), resolve it at the level of 'established practices were not followed' or 'a maintenance defect existed' — the decision content lives in the response, not the mechanism.

---

## Ballistic missile defence

*14 incidents.*

### Patriot failure at Dhahran (software clock drift) (1991)

*Dhahran, Saudi Arabia*

On 25 February 1991 a Scud struck a US Army barracks at Dhahran, killing 28 soldiers and wounding around 100. The Patriot battery covering the site never engaged: an accumulating timekeeping error in the fire-control computer had shifted the system's tracking gate so far that the incoming missile was not held as a valid track. The battery had been running continuously for over 100 hours; field data flagging the drift had reached the Patriot Project Office on 11 February, corrected software shipped on 16 February, and it arrived at Dhahran on 26 February — one day late.

**Decision problem.** The dilemma is a boring, unglamorous one that recurs constantly in real crisis management: an operator receives a warning that a defensive system degrades after prolonged continuous operation, and the only mitigation is to cycle the battery offline — creating a real gap in coverage now, to prevent a probabilistic failure later. Under attack, nobody wants to turn the shield off. Also models the 'fix is in transit' problem: the correct answer existed and was physically en route while the failure occurred. A crisis …

**Outcome.** Deadliest single US loss of the Gulf War. The GAO investigation made the drift-plus-uptime interaction a canonical case study in software engineering and operational readiness; duty-cycle limits and restart discipline became standard practice.

**Stresses.** system uptime / degradation clock, coverage gap tolerance, warning-to-fix latency, operator authority vs program office authority, casualty count, sensor track quality.

### The Patriot 'success rate' controversy (Postol vs. the US Army) (1991-1992)

*United States / Israel*

During and after the Gulf War the US Army initially claimed very high Patriot interception rates (figures around 80 percent over Saudi Arabia and about 50 percent over Israel were briefed publicly). MIT's Theodore Postol, analyzing video and ground-damage evidence, argued the true warhead-kill rate was near zero. A 1992 GAO review concluded that strong evidence supported a warhead kill in only about 9 percent of Patriot engagements, with some supporting evidence in roughly a quarter — while noting the evidence base was genuinely poor in all directions.

**Decision problem.** This is the epistemics problem at the heart of the whole domain: after a defensive engagement, you frequently cannot tell whether you succeeded. An intercept and a near-miss look similar on video; falling debris looks like a kill; a warhead that separates and continues to its target looks like a shootdown of the discarded airframe. Meanwhile the political system demands an immediate number, alliance cohesion depends on that number, and the number gets locked in before the forensics exist. A crisis manager must …

**Outcome.** Claimed rates were quietly revised downward over years. The episode established the template for every subsequent interception-rate dispute (Iron Dome, Saudi Arabia, Ukraine) and made independent open-source debris forensics a permanent feature of the field.

**Stresses.** assessment confidence, public trust, alliance reassurance value, political cost of correction, time pressure to announce, evidence quality.

### Galosh, MIRV, and the ABM Treaty (defense provoking offense) (1966-1972)

*Moscow / Washington*

The Soviet Union began deploying the A-35 'Galosh' anti-ballistic missile system around Moscow in the 1960s; the US pursued Sentinel and then Safeguard. In the same period the US fielded multiple independently targetable reentry vehicles (MIRV) on Minuteman III and Poseidon. Whether MIRV was primarily a response to Galosh is genuinely contested — officials at the time argued it was driven by targeting flexibility, not penetration — but the two developments were publicly and analytically linked, and the resulting arithmetic (many warheads per booster, cheaply added) made defense look unaffordable.

**Decision problem.** The purest illustration of the action-reaction dynamic: a defensive deployment on one side produced an offensive response on the other, and the offensive response was strategically worse for everyone than the original defense was good for anyone. MIRV became the most destabilizing single technology of the Cold War — it made each silo a high-value target and rewarded striking first. The decision dilemma is that at every step each individual choice was locally defensible. A player who deploys a shield must decide …

**Outcome.** The 1972 ABM Treaty capped each side at two ABM sites (reduced to one in 1974) and 100 interceptors, and banned sea-, air-, space-, and mobile land-based ABM systems. The US Safeguard site at Grand Forks reached operational status in October 1975 and was shut …

**Stresses.** adversary offensive buildup response, arms-race pressure, first-strike incentive, treaty negotiability, cost per unit of defense vs offense, warhead-to-interceptor ratio.

### US withdrawal from the ABM Treaty (2001-2002)

*Washington / Moscow*

On 13 December 2001 President George W. Bush gave the six-month notice required by the treaty, stating that the ABM Treaty hindered the ability to develop defenses against future terrorist or rogue-state missile attacks. Withdrawal took effect 13 June 2002 — the first time a major power had exited a bilateral strategic arms control treaty in the nuclear era. Putin called the move 'mistaken' but explicitly declined to treat it as a threat to Russia, while noting Russia would regard START II as void and would be free to retain and expand MIRVed forces.

**Decision problem.** A decision made with a genuinely uncertain payoff on both sides of the ledger: the treaty constrained defenses against a small emerging threat, but it was also the load-bearing structure under two decades of offensive reductions. The immediate reaction was mild — 'global response muted' — which is precisely the trap: the costs arrived over fifteen to twenty years, in the form of Russian and Chinese offensive modernization explicitly justified by reference to US defenses. Models the scenario where the correct move …

**Outcome.** Ground-based Midcourse Defense deployment began at Fort Greely and Vandenberg from 2004. Russia subsequently cited US missile defense as the rationale for Avangard, Sarmat, Poseidon and Burevestnik; China cited it in expanding its own arsenal and pursuing …

**Stresses.** treaty regime integrity, adversary modernization response, time-delayed consequences, domestic political commitment, allied consultation, reversibility.

### Ground-based Midcourse Defense test record and the discrimination problem (1999-2019)

*Vandenberg / Kwajalein / Fort Greely*

GMD is the only US system intended to intercept ICBM-class threats against the homeland, engaging in the midcourse (exoatmospheric) phase with 44 interceptors deployed in Alaska and California. Its hit-to-kill flight test record is publicly reported at roughly 12 successes in 21 attempts (about 57 percent), with earlier tallies near 53 percent; failures have been traced to causes including manufacturing inconsistency in kill vehicles, component failures, and anomalies in test-only equipment. The Pentagon's own operational test authority and the GAO have repeatedly rated these tests low in operational realism, …

**Decision problem.** The National Academies concluded in 2012 that no practical midcourse system can avoid the requirement to identify the real warhead among accompanying objects in vacuum, and called this the most formidable challenge in the field — an unresolved problem for over forty years. So a crisis manager holds a system with a coin-flip test record under favorable conditions, an unquantified record under realistic ones, and a shot doctrine widely assessed at three to four interceptors per incoming object, meaning 44 …

**Outcome.** FTG-11 (25 March 2019) was the first two-interceptor salvo against an ICBM-class target; the lead interceptor destroyed the reentry vehicle and the trailing one struck the next most lethal object in the resulting debris. The Redesigned Kill Vehicle program …

**Stresses.** intercept probability (claimed vs assessed), decoy/penetration-aid discrimination confidence, interceptor magazine depth, shot doctrine multiplier, test realism, public disclosure vs deterrence signalling.

### Patriot fratricide during the invasion of Iraq (2003)

*Kuwait / Iraq*

On 23 March 2003 a US Patriot battery classified RAF Tornado GR4A ZG710, returning from a sortie, as an anti-radiation missile and engaged it under self-defense rules of engagement, killing both crew. On 2 April a US Navy F/A-18C was misidentified as a ballistic missile by Patriot batteries and shot down, killing Lt. Nathan White. Separately, a Patriot radar locked onto a US Air Force F-16, whose pilot fired an anti-radiation missile at the radar in self-defense.

**Decision problem.** The system was operating largely as designed. Highly automated classification, self-defense ROE that compress the human decision to seconds, degraded IFF, and batteries operating autonomously combined to produce three blue-on-blue events in under two weeks. The dilemma is the automation dial itself: in ballistic-missile defense the engagement timeline is genuinely too short for deliberate human judgment, so automation is not optional — but the same automation is what killed friendly aircrew. A crisis manager must …

**Outcome.** Boards of inquiry in both the UK and US identified a combined human-machine failure rather than a single culprit. US doctrine was changed so that air-breathing threats — aircraft, helicopters, cruise missiles — are engaged in manual mode, with a human making …

**Stresses.** automation level (auto vs manual), identification confidence vs track confidence, IFF integrity, engagement timeline (seconds), rules of engagement / self-defense authority, fratricide risk, airspace deconfliction.

### The Iron Dome interception-rate dispute (2011-2014)

*Israel / Gaza*

Israel has consistently claimed Iron Dome interception rates above 85-90 percent against rockets assessed as threatening populated areas. Theodore Postol, analyzing engagement geometry from public video, argued the true rate was in the low single digits; other US analysts placed it in the 30-40 percent range, and others below 10 percent. Defenders of the system objected that a small sample of video engagements cannot support a technical assessment of a large system, and pointed to the sharply reduced casualty and damage record.

**Decision problem.** An unusually clean case of irreducible measurement dispute where both the operator's incentive to overclaim and the critic's incentive to underclaim are visible, and neither side can produce dispositive evidence in public. Iron Dome's real product may be political rather than kinetic: it buys a government time before it must escalate on the ground, which is a genuine strategic good whether or not the intercept rate is 90 percent or 40 percent. The dilemma for a crisis manager is whether a defense that mainly buys …

**Outcome.** Unresolved. Iron Dome remains in service, has been substantially expanded, and the interception-rate argument has recurred in every subsequent conflict. The cost-exchange critique became the dominant line of argument instead.

**Stresses.** claimed vs assessed intercept probability, public trust, escalation pressure relief, cost-exchange ratio, civilian casualty rate, evidence contestability.

### Saudi Patriot claims versus open-source debris analysis (2017-2018)

*Riyadh, Saudi Arabia*

Following Houthi ballistic missile launches at Riyadh in November 2017 and March 2018, Saudi Arabia announced that all incoming missiles had been intercepted. Open-source analysts led by Jeffrey Lewis's team at the Middlebury Institute mapped debris fields and concluded that in the documented cases the missile airframe fell inside Riyadh while the separated warhead continued to and detonated near its intended target — meaning the visible destruction was of the discarded body, not the warhead. Video from March 2018 also showed a Patriot interceptor going out of control shortly after launch and falling back into a …

**Decision problem.** This is the Dhahran verification problem repeating twenty-seven years later, but now with an open-source community capable of contradicting an ally's official statement within 48 hours. The crisis manager's dilemma is layered: the host government has strong reasons to claim total success; the supplying government has commercial and alliance reasons not to contradict it; and independent analysts will publish regardless. Meanwhile the defensive interceptor itself became a source of civilian harm. Every announcement …

**Outcome.** Saudi claims were never formally retracted. The episode significantly damaged the export credibility of terminal ballistic missile defense and became a standard citation for the argument that advertised intercept rates are systematically overstated.

**Stresses.** assessment confidence, allied government messaging control, open-source contradiction speed, interceptor debris hazard to own population, public trust, attribution certainty.

### Abqaiq and Khurais: defenses facing the wrong way (2019)

*Eastern Province, Saudi Arabia*

On 14 September 2019 low-altitude drones and cruise missiles struck the Saudi Aramco processing facilities at Abqaiq and Khurais, briefly removing roughly half of Saudi crude output. Despite Patriot batteries in the area, essentially nothing was intercepted; the systems were oriented and optimized against ballistic threats from the south, and the projectiles approached from the north-northwest. The Houthis claimed responsibility; the US and a UN Panel of Experts concluded the Houthis could not have conducted the attack and the US publicly attributed it to Iran, which denied involvement.

**Decision problem.** Two decision problems stacked. First, an air defense architecture is a set of assumptions about threat axis, altitude and type — and an adversary that violates those assumptions renders very expensive equipment irrelevant without defeating it. Second, and more important for a de-escalation game: the claimed attacker and the assessed attacker were different actors, and the assessed attacker denied it. A crisis manager holding an attribution their own intelligence community rates as high-confidence, a public claim …

**Outcome.** The US did not respond militarily. Additional forces and air-defense assets were deployed to Saudi Arabia instead. Oil output was restored faster than expected. The restraint decision is widely read as a deliberate off-ramp; it is also read by critics as a …

**Stresses.** threat axis assumption, attribution certainty, claimed vs assessed attacker, economic shock magnitude, retaliation pressure, escalation off-ramp availability, time pressure.

### Ukraine International Airlines Flight 752 (2020)

*Tehran, Iran*

On 8 January 2020, hours after Iranian missile strikes on US bases in Iraq and with Iranian air defenses at maximum alert expecting US retaliation, an IRGC Tor-M1 crew fired two missiles at a Boeing 737-800 that had just departed Tehran, killing all 176 aboard. Iranian investigators attributed the engagement to a misconfigured system following relocation — reported as a substantial azimuth misalignment — which displayed the airliner as inbound toward Tehran rather than outbound, combined with a communications failure that left the crew unable to reach higher authority in the seconds available.

**Decision problem.** The single best available model of identification failure under alert conditions. Every ingredient was structural rather than malicious: a unit repositioned in haste, a calibration step missed, a network link that did not work, a crew with a few seconds and a delegated release authority, and a national airspace that had not been closed despite the country expecting to be attacked. The decisive counterfactual is not the operator's judgment — it is that civilian aviation was still flying out of Tehran while the …

**Outcome.** Iran denied responsibility for three days before admitting the shootdown, triggering domestic protests and a lasting international credibility cost. Ukraine, Canada and others pursued legal action; families dispute the completeness of the Iranian account. …

**Stresses.** identification confidence, alert posture, delegated release authority, communications integrity, civil airspace closure decision, seconds-scale decision window, admission vs denial timing, public trust.

### Przewodów: a defensive interceptor lands in NATO (2022)

*Przewodów, Poland*

On 15 November 2022, during a large Russian missile barrage against Ukraine, a missile struck a grain facility in the Polish border village of Przewodów, killing two Polish civilians — the first time a missile had killed people inside NATO territory during the war. Within roughly a day, US and NATO assessments indicated it was most likely a Ukrainian S-300 air defense interceptor that had gone astray, not a Russian strike. President Zelensky publicly and persistently maintained it was Russian; Poland formally confirmed the Ukrainian origin in September 2023.

**Decision problem.** Almost every variable a crisis-management game wants, in one event. A NATO member has dead civilians on its soil; the Article 4/Article 5 question is live; the initial and most natural inference points at Russia; the actual cause is a friendly defensive system doing its job imperfectly; and the closest ally publicly contradicts the assessment for reasons of its own. The crisis manager must hold the alliance response at 'consult, do not invoke' for the twelve to thirty-six hours it takes trajectory analysis to firm …

**Outcome.** Poland invoked consultations rather than Article 5; Biden and Stoltenberg publicly signalled early that the evidence did not indicate a deliberate Russian attack. Widely regarded as a model of deliberate slowness: the restraint held precisely because senior …

**Stresses.** attribution certainty, time to trajectory analysis, alliance treaty threshold (Article 4 vs 5), allied public contradiction, political pressure to respond, civilian casualties on protected territory, interceptor debris hazard.

### Iran-Israel direct exchanges: the telegraphed barrage (2024)

*Iran / Israel / Jordan / Iraq*

On 13-14 April 2024 Iran launched roughly 300 drones, cruise missiles and ballistic missiles at Israel in response to a strike on its consular compound in Damascus; on 1 October 2024 it launched around 181 ballistic missiles after further Israeli operations. Both barrages were substantially defeated by a layered Israeli defense supported by US, UK, French and Jordanian assets, with the April attack in particular preceded by broad advance warning. Israeli casualties were minimal in both cases, though some October missiles reached Israeli air bases. Israeli and Israeli-press estimates put the cost of the April …

**Decision problem.** A rare, documented case of an attack apparently designed to be intercepted — large enough to satisfy domestic demands for retaliation, telegraphed enough to be defeated, and therefore usable by both sides as an off-ramp. Successful defense functioned as an escalation valve. But it only works if the defense actually holds, if the coalition actually shows up, and if the defender chooses to accept the off-ramp rather than treat the attempt itself as the casus belli. The player's decision is whether to bank a …

**Outcome.** Israel's response to April was narrowly calibrated and both sides stepped back. The October exchange led to a larger Israeli strike on Iranian air defense and missile-production targets. The pattern did not hold in 2025. The cost asymmetry — roughly a million …

**Stresses.** advance warning / telegraphing, coalition participation, cost-exchange ratio, leakage rate, domestic pressure to respond, off-ramp acceptance, escalation ladder position.

### The June 2025 Israel-Iran war: interceptor exhaustion (2025)

*Israel / Iran / regional US forces*

Over twelve days in June 2025 Iran fired more than 500 ballistic missiles at Israel. Reporting and analysis indicate Israel's interception rate declined over the course of the conflict — figures of roughly 90 percent early falling to around 65 percent in the later days are widely cited, though the IDF publicly disputed claims of shortage. US THAAD expenditure in the same period has been estimated by outside analysts at roughly 92-150 interceptors, on the order of 15-25 percent of the entire US THAAD inventory, against reported annual production in the low double digits.

**Decision problem.** The salvo/exhaustion problem stops being theoretical here. Defense is a consumable, and its production line is measured in years while its expenditure is measured in days. Mid-conflict, a crisis manager must ration: stop defending lower-value targets, accept leakage in order to hold reserve, and decide whether to spend the strategic stockpile of an ally who may need it elsewhere. The exhaustion curve also creates a clock on the war itself — it can force a ceasefire, or it can create an incentive for the attacker …

**Outcome.** A ceasefire ended the twelve-day exchange. The episode moved interceptor industrial capacity from a budget footnote to a first-order strategic constraint in US, Israeli and European planning, and forced explicit tradeoffs between replenishing US stocks and …

**Stresses.** interceptor inventory / magazine depth, leakage rate over time, production rate vs expenditure rate, rationing / target prioritization, allied stockpile drawdown, pressure to attack launchers (left-of-launch), ceasefire timing forced by materiel.

### China's combined FOBS and hypersonic glide vehicle test (2021)

*China / global*

On 27 July 2021 China conducted a test in which a vehicle was placed into a partial orbit and released a hypersonic glide vehicle that flew a long atmospheric course before impacting some distance from its target. Neither fractional orbital bombardment nor hypersonic gliding was new — the Soviet Union fielded and then retired a FOBS system under SALT II — but the combination had not been demonstrated. Chairman of the Joint Chiefs Gen. Mark Milley called it 'very concerning' and 'very close' to a Sputnik moment; China's foreign ministry described the event as a routine reusable-spacecraft test.

**Decision problem.** The clearest modern instance of defense driving offense, and of intelligence surprise arriving with genuine interpretive ambiguity. FOBS attacks the early-warning problem by not arriving from the expected direction; gliding attacks the interception problem by not flying the expected trajectory. Together they are a direct answer to the architecture the US has been building since 2002. The crisis manager's dilemma is threefold: decide what was actually tested when the tester offers an innocuous explanation, decide …

**Outcome.** No arms-control framework covers FOBS or HGVs; the SALT II provision that retired the Soviet system has no successor. US programs for space-based sensing and, later, the Golden Dome architecture were justified in part by reference to this class of threat; …

**Stresses.** intelligence surprise, technical attribution of what was tested, adversary's innocuous explanation, public characterization / rhetoric escalation, early-warning coverage gaps, arms control availability, action-reaction spiral.

### Mechanics to model

- FLIGHT PHASES AND ENGAGEMENT WINDOWS. Boost: roughly 1-5 minutes (ICBM about 3-5; short-range ballistic missile about 1), bright and trackable but the interceptor must be very close and the window is short — the 2012 National Academies study concluded boost-phase intercept is impractical for realistic geographies. Midcourse: the longest window, about 20 minutes of exoatmospheric coast for an ICBM, but it is the phase where discrimination is hardest. Terminal: tens of seconds, atmosphere strips light objects, but defended footprint is small and leakage means impact on your own territory. A total ICBM flight of about 10,000 km runs roughly 30 minutes. Model each phase as a separate engagement opportunity with its own probability, cost, and consequence-of-failure.

- DECISION TIMELINE. Detection (infrared early-warning satellites see boost) → track (ground and sea radars) → impact-point prediction → engagement authority → shot. US practice targets an assessment conference in single-digit minutes; the executive decision window for an ICBM is on the order of 5-10 minutes and for a depressed-trajectory SLBM launched close in it can be under 7 minutes. The gap between 'launch detected' and 'we know where it is going' is the single most important interval in the domain — model it explicitly as a period where the manager knows something is coming but not what or where.

- COST PER INTERCEPTOR (published estimates, roughly, USD): Ground-Based Interceptor ~$70-100M; SM-3 Block IIA ~$28-38M; SM-3 Block IB ~$12-16M; THAAD ~$12-15.5M; PAC-3 MSE ~$4-4.5M; Arrow-3 ~$2-4M; Arrow-2 ~$1.5-3M; David's Sling Stunner ~$0.7-1M; Iron Dome Tamir ~$40-150K (early estimates ~$100K, more recent reporting $40-50K). Attacker side: Qassam-class rocket a few hundred dollars; one-way attack drone ~$20-50K; Houthi/Iranian medium-range ballistic missile roughly $1M or less. Cost-exchange ratio runs from about 5:1 to 500:1 against the defender depending on layer. Treat every figure as an estimate; sources disagree by factors of 2-3.

- SHOT DOCTRINE MULTIPLIER. Strategic defense commonly assumes 2-4 interceptors per incoming reentry vehicle. With 44 deployed GBIs this yields roughly 10-11 credible engagements. FTG-11 (March 2019) was the first two-interceptor salvo test; the trailing interceptor selected the next most lethal remaining object. Combine with MIRV and the arithmetic collapses: one booster carrying 6 reentry vehicles plus accompanying objects can demand 24+ interceptors. This multiplier is the core game mechanic — the defender pays 3-4x per object and the attacker pays 1x per object, before penetration aids.

- MAGAZINE DEPTH AND RELOAD. Model each battery as a finite magazine with a reload time in minutes to tens of minutes and a resupply time in weeks to years. Iron Dome battery: on the order of 3-4 launchers of ~20 interceptors each. Patriot battery: typically 4-8 launchers, PAC-3 MSE at 12 per launcher. Reported production: THAAD in the low double digits per year (FY2025 figures around 12 are cited, with wider ranges elsewhere); Arrow production also low double digits. In June 2025 more than a year's worth of some interceptors was expended in twelve days. Replenishment is 3-8 years for some lines.

- LEAKAGE RATE AS A DYNAMIC VARIABLE, NOT A CONSTANT. Interception rate degrades over a sustained campaign as magazines drain, crews fatigue, and rationing forces target prioritization. June 2025 reporting describes a fall from roughly 90 percent to roughly 65 percent over the course of the conflict. Model interception probability as a function of remaining inventory, elapsed campaign time, salvo density, and whether the incoming raid exceeds simultaneous-engagement capacity.

- SALVO SATURATION. Defenses fail not by being outfought but by being outnumbered within a single engagement window. Every fire unit has a maximum number of simultaneous engagements. A raid that exceeds this number leaks by arithmetic regardless of per-shot probability. This, not interceptor quality, is the dominant failure mode in every real-world case examined.

- DISCRIMINATION (state as constraint, never as method). The 2012 National Academies report concluded that no practical midcourse system can avoid the requirement to identify actual warheads among accompanying material in vacuum, and called it the most formidable challenge in the field — contested for over forty years. DOT&E has noted that in tests every physical property of target objects is known with unrealistic accuracy in advance and that challenging countermeasures have not been included. Model this as a 'discrimination confidence' variable that is high in tests and unknown in reality, and that the player cannot resolve by spending money.

- VERIFICATION AFTER THE FACT. Make 'did we hit it' a variable with its own uncertainty and its own clock. GAO 1992: strong evidence of warhead kill in about 9 percent of Patriot engagements. Iron Dome: Israel claims >85-90 percent; Postol has claimed as low as 1-5 percent; other analysts 30-40 percent or under 10 percent. Riyadh 2017-18: official claims of 100 percent interception contradicted within days by open-source debris mapping. The gap between the number announced in hour one and the number believed in year three is a first-class game mechanic.

- IDENTIFICATION FAILURE MODES. Model 'identification confidence' separately from 'track quality' — you can have a perfect track on a misclassified object. Reference cases: Iran Air 655 (1988, Aegis, 290 killed); Siberia Airlines 1812 (2001, Ukrainian S-200 during an exercise, 78 killed); MH17 (2014, Buk, 298 killed); PS752 (2020, Tor-M1 during high alert, 176 killed); Patriot fratricides in Iraq 2003. Common ingredients across all of them: elevated alert posture, delegated release authority, seconds-scale windows, degraded or absent IFF, and civil aviation still operating in the engagement volume. The last of these is a decision made hours earlier by someone not under time pressure.

- AUTOMATION POSTURE AS A DIAL WITH NO CORRECT SETTING. Ballistic-missile timelines are too short for deliberate human judgment; air-breathing threats are slow enough for it and are where misidentification kills friendlies. After 2003 US doctrine moved air-breathing engagement to manual mode while ballistic engagement retained automation. Model the auto/manual setting as a pre-commitment the player makes before knowing what arrives, with fratricide risk on one side and leakage risk on the other.

- INTERCEPTOR DEBRIS AS ITS OWN HAZARD. A defensive shot is not consequence-free. Riyadh 2018: a Patriot broke up shortly after launch and fell into a residential district. Przewodów 2022: a stray Ukrainian S-300 interceptor killed two civilians inside NATO territory and produced an Article 4/5 question. Reentry debris from successful intercepts also falls. Model 'own-territory harm from own defense' as a distinct outcome.

- FALSE ALARM AND ALERT MANAGEMENT. Hawaii, 13 January 2018: a false statewide ballistic-missile alert ran 38 minutes before retraction, largely because no pre-scripted cancellation procedure existed. Historical analogues worth citing at policy level: the 1979/1980 NORAD false alerts and the 1995 Norwegian Black Brant sounding-rocket incident, in which the Russian early-warning chain elevated a scientific launch. Model both a false-positive probability on the warning chain and, separately, a retraction latency that depends entirely on whether the player wrote the procedure in advance.

- ATTRIBUTION AS A SEPARATE CLOCK FROM DETECTION. Abqaiq 2019: the claimed attacker (Houthis) and the assessed attacker (Iran) differed, and the assessed attacker denied it. Przewodów 2022: the natural inference (Russia) and the assessed cause (Ukrainian air defense) differed, and an ally publicly disputed the assessment. Model attribution confidence rising over hours-to-days on a curve independent of the physical event, with political pressure to act peaking before the curve does.

- WHY DEFENSE DESTABILIZES — THE ADVERSARY'S RESPONSE MENU. Given an opposing defense, an adversary can: build more offensive missiles (cheaper per unit than interceptors); add penetration aids; MIRV existing boosters; shift to launch-on-warning to avoid being caught on the ground; develop FOBS or hypersonic glide to bypass the architecture; target the defense's sensors and interceptors directly; or, in crisis, strike first before the defense matures. Historical pattern: Galosh preceded MIRV; the 2002 ABM withdrawal preceded Avangard, Sarmat and Chinese arsenal expansion; Golden Dome is currently cited by both Moscow and Beijing. Model this as a delayed adversary-buildup response triggered by defensive deployment, with a lag of years.

- THE FIRST-STRIKE ENABLEMENT PROBLEM. A defense that cannot stop a full first strike may still be able to mop up a ragged, degraded retaliation. That makes a shield look, from the other side, like the second half of a first-strike package. Crisis instability peaks precisely in the band where a defense is believed good enough to blunt a retaliatory strike but not good enough to stop an initial one — model 'perceived defense effectiveness' as an adversary belief variable distinct from actual effectiveness, and have use-it-or-lose-it pressure rise inside that band.

- TREATY ARCHITECTURE. ABM Treaty signed 26 May 1972, in force 3 October 1972: two ABM sites per side (one after the 1974 protocol), 100 interceptors each, and an explicit ban on sea-, air-, space- and mobile land-based ABM systems. US Safeguard at Grand Forks reached operational status October 1975 and was shut down within months. Withdrawal announced 13 December 2001, effective 13 June 2002 — the first exit from a major bilateral strategic treaty of the nuclear era. Russia declared START II void in response. No FOBS or HGV constraint exists today; the SALT II provision that retired Soviet FOBS has no successor.

- BOOST-PHASE AND SPACE-BASED ECONOMICS. CBO's May 2026 estimate for a Golden Dome-like architecture is about $1.2 trillion over 20 years, roughly double its prior-year figure, against an initial White House figure of $175 billion over three years. Roughly 60-70 percent of that is a constellation of about 7,800 space-based interceptors sized merely to engage on the order of 10 near-simultaneous ICBM boosts. The driver is the absentee ratio: at any moment most of a constellation is over the wrong part of the Earth, so the number needed scales brutally with the size of the raid you must handle. Model space-based defense as enormous fixed cost with linear-at-best coverage improvement.

- NUCLEAR-ARMED INTERCEPTORS. Both the US Safeguard system (Spartan and Sprint) and the Russian A-135 around Moscow used or use nuclear-armed interceptors to compensate for miss distance and the discrimination problem; A-135's Don-2N radar and 53T6 short-range interceptors remain the operational core, with the A-235/Nudol successor reportedly mixing nuclear long-range and kinetic shorter-range types. Game-relevant consequence: a defense that detonates nuclear warheads over your own territory is itself an escalation event, blinds your own radars, and forecloses the option of characterizing the exchange as non-nuclear.

- SYSTEM-BY-SYSTEM PHASE AND RECORD SUMMARY. GMD: midcourse, homeland ICBM defense, 44 interceptors, ~12/21 hit-to-kill (about 57 percent) under scripted conditions, rated low in operational realism by DOT&E. Aegis BMD / SM-3: midcourse, sea- and shore-based; better test record than GMD but likewise scripted; FTM-44 (16 November 2020) was the first Aegis engagement of an ICBM-representative target; failures include a June 2017 test where a sailor inadvertently triggered self-destruct and FTM-29 (31 January 2018), attributed to a third-stage ignition component. THAAD: high-endoatmospheric to exoatmospheric terminal, unbroken developmental intercept record, first combat use 26 December 2024 in Israel against a Houthi MRBM, six-for-six claimed by March 2025. Patriot PAC-3: terminal/lower-tier, extensive and mixed combat record. Iron Dome: very short-range rockets and, increasingly, other …

- COUNTERS TO DEFENSE (describe strategically, never technically). MIRV: multiplies objects per booster, forcing the shot-doctrine multiplier against every one. FOBS: places the payload in a partial orbit so it can arrive from an unmonitored direction, defeating early-warning coverage rather than the interceptor. HGV: flies and maneuvers within the atmosphere, below the midcourse layer's floor and with an unpredictable ground track that defeats impact-point prediction. Depressed-trajectory SLBM: trades range and accuracy for a much lower apogee and much shorter flight time, compressing warning to minutes — a defense architected for a 30-minute lofted trajectory is not a defense against a 7-minute one. All four are best modeled as effects on the defender's warning time, engagement window count, and shot multiplier — never as buildable descriptions.

- LEFT-OF-LAUNCH AS THE ALTERNATIVE, AND ITS COST. When interception looks unaffordable, the alternative is attacking launchers before they fire — which is the most escalatory option available, drives the adversary toward launch-on-warning and pre-delegation, and creates exactly the use-it-or-lose-it pressure the game should be teaching players to avoid. In 2017 the option of shooting down North Korean test launches was publicly debated and rejected on escalation grounds despite pledges to engage anything threatening US or allied territory. Model 'attack the launchers' as an available, tempting, and almost always wrong move whose attractiveness rises as the interceptor magazine falls.

- DEFENSE AS AN ESCALATION VALVE. The April 2024 Iran-Israel exchange suggests a legitimate strategic function for missile defense that has nothing to do with intercept probability: a successfully defeated barrage lets both sides claim satisfaction and stop. This only works if the defense holds, the coalition participates, and the defender chooses to bank the outcome. Model 'successful defense' as producing an off-ramp the player may take or refuse — and make refusing it a live, tempting, costly choice.

---

## Unidentified anomalous phenomena (sensor and institutional)

*14 incidents.*

### The Robertson Panel and the closure of Project Blue Book (institutional arc) (1953–1969)

*Washington DC; Wright-Patterson AFB, Ohio; University of Colorado*

The CIA convened a five-scientist advisory panel under H.P. Robertson (14–18 Jan 1953) which concluded UFO reports were not themselves a direct national-security threat but posed an indirect one: they could clog air-defense communication channels, induce 'hysterical mass behavior,' and be deliberately exploited by an adversary to mask a real attack. The panel recommended stripping the subject of special status and 'debunking.' Project Blue Book ran 1952–1969, logged 12,618 sightings of which 701 remained 'unidentified,' and was closed after the University of Colorado's Condon Report ('Scientific Study of …

**Decision problem.** This is the purest institutional dilemma in the domain and it has nothing to do with what UFOs are. A crisis manager must set the *reporting threshold*. Encourage reporting and you get better data but you saturate the same channels an air-defense system needs to see a real attack — and you hand an adversary a cheap denial-of-service. Suppress reporting and you get quiet channels, a demoralized observer corps that stops calling things in, and a decades-long credibility debt that detonates later. The Robertson Panel …

**Outcome.** Blue Book closed December 1969; no official US UAP investigative office existed for roughly 50 years. The credibility gap created in this period is explicitly cited by Congress and by AARO as a driver of the 2021–2024 transparency push.

**Stresses.** reporting threshold / signal-to-noise, channel saturation, adversary exploitation of a reporting channel, institutional credibility debt, observer willingness to report (stigma), delayed consequence horizon.

### BMEWS Thule moonrise false alarm (1960)

*Thule Air Base, Greenland; NORAD Combat Operations Center, Colorado*

Days after the Ballistic Missile Early Warning System went operational (5 Oct 1960), the Thule detection radar returned an indication consistent with a mass missile launch from the USSR toward North America. The duty decision-maker at NORAD, Air Marshal Roy Slemon (RCAF), assessed the alert as implausible — partly on the corroborating context that Soviet Premier Khrushchev was physically in New York at the time — and did not escalate. The returns were later determined to be the radar beam reflecting off the rising Moon, which the system had not been designed to reject.

**Decision problem.** The sensor was working correctly and reporting exactly what it received; the *interpretation layer* was wrong. The correct action was inaction plus a demand for independent corroboration, at a moment when doctrine and time pressure both pushed toward response. It also models the newly-fielded-system problem: a brand-new sensor has no established false-alarm baseline, so operators cannot yet calibrate how much to trust it. Every subsequent 'unidentified track near a nuclear asset' decision in the game can be scored …

**Outcome.** No launch order was given; the alert was called off. A technical fix for lunar returns was implemented within weeks. Widely cited in nuclear-risk literature as an early near-miss driven by sensor artifact rather than hostile action.

**Stresses.** sensor confidence, single-modality vs multi-modality corroboration, new-system false-alarm baseline unknown, time pressure (minutes), contextual/geopolitical plausibility check, escalation threshold.

### Malmstrom AFB 'Echo Flight' simultaneous missile shutdown (1967)

*Malmstrom AFB, Montana (Echo Flight launch control facility and associated launch facilities)*

On 16 March 1967 at approximately 0845, all sites in Echo Flight went off strategic alert with 'No-Go' indications nearly simultaneously — an event documented contemporaneously in Air Force records. Technical investigators estimated the loss of alert occurred within roughly 10–40 seconds and stated they 'were unable to determine a logical cause for the incident.' The contemporaneous report also states that rumors of UFOs near Echo Flight at the time of the fault 'were disproven.' From the 1990s onward former missile officer Robert Salas publicly claimed a glowing object was reported by security personnel near a …

**Decision problem.** The single best 'contested evidence' case in the domain, and it sits directly on a nuclear asset. A crisis manager gets an unambiguous, high-confidence fact — a portion of the deterrent went off alert in under a minute, with no identified technical cause — plus an unverifiable, emotionally powerful correlated observation. The dilemma: do you treat the correlation as causal (and escalate readiness, or hunt for an adversary EW capability you may not have), treat it as coincidence (and possibly miss a real …

**Outcome.** Alert status was restored; no adversary attribution was ever made. The event remains publicly contested between a classified-test explanation, an undiagnosed technical fault, and the UAP-correlation account.

**Stresses.** attribution certainty, own-side compartmentation (blue-on-blue ambiguity), nuclear readiness state, witness reliability vs documentary record, contested-account handling, delayed and still-disputed resolution.

### Multi-base overflights of Strategic Air Command nuclear installations (1975)

*Loring AFB (Maine), Wurtsmith AFB (Michigan), Malmstrom AFB (Montana), Minot AFB (North Dakota), and Canadian …*

Over roughly two weeks in late October and November 1975, low-flying unidentified objects — variously logged as unknown helicopters, aircraft, or lights — were reported over or near weapons storage areas and alert facilities at multiple SAC bomber and missile bases. The incursions are documented in declassified NORAD/NMCC message traffic and base security logs. Responses included launching alert interceptors and helicopters; no object was identified, intercepted, or attributed.

**Decision problem.** A repeating, multi-night, multi-site pattern is qualitatively different from a single sighting: pattern implies intent, and intent implies an actor. But the pattern could equally be a real reconnaissance campaign, a set of unrelated mundane events being correlated by heightened alertness (an observation cascade), or a mix. The manager must decide whether to raise security posture across the whole nuclear enterprise — which is expensive, visible to an adversary, and itself a signal — on the basis of a pattern with …

**Outcome.** Activity ceased; no perpetrator was ever identified. Public awareness came largely via 1979 press reporting and later FOIA releases of the NORAD/NMCC traffic.

**Stresses.** pattern recognition vs observation cascade, attribution certainty (never achieved), readiness posture cost, escalation signaling to adversary, intercept rules of engagement, cross-site correlation.

### Tehran F-4 intercept (1976)

*Tehran, Iran*

On 19 September 1976, following civilian reports and radar contact, the Imperial Iranian Air Force scrambled two F-4 Phantom II interceptors against an unidentified object. Crews reported losing instrumentation and communications on approach with restoration on withdrawal, and one crew reported a weapons-system failure while preparing to engage. The event is recorded in a four-page US Defense Intelligence Agency report distributed to the White House, State, the Joint Chiefs, NSA and CIA; the US Defense Attaché's evaluation called it 'an outstanding report… a classic that meets all criteria for being a legitimate …

**Decision problem.** This is the intercept dilemma at its sharpest, and it happens in a foreign, allied, politically fragile air force. A pilot attempted to fire on an unidentified object over a capital city and reports his weapons would not function. Every branch is bad: if the systems truly failed near the object, you must consider an unknown electronic-warfare capability held by someone; if the failure was coincidental or procedural, you have just nearly discharged a weapon over a metropolitan area at an unidentified target; if the …

**Outcome.** No shot was fired; the object was not identified. The DIA document remains one of the most-cited official UAP records and its evaluation language is frequently quoted out of its original context as an endorsement of an extraterrestrial explanation, which it …

**Stresses.** intercept rules of engagement, weapons release over populated area, possible adversary EW capability (unverified), allied competence assessment, aircrew reliability under stress, intelligence dissemination and its amplifying effect.

### Rendlesham Forest / RAF Woodbridge–Bentwaters (1980)

*Rendlesham Forest, Suffolk, England, adjacent to twin USAF-operated RAF bases*

In late December 1980, USAF security personnel from RAF Woodbridge reported unexplained lights and an apparent landed object in adjacent Rendlesham Forest across two nights. Deputy Base Commander Lt Col Charles Halt documented the reports in a memorandum to the RAF liaison officer on 13 January 1981 (the 'Halt memo') and made a contemporaneous audio recording during the second night. The UK Ministry of Defence's position, restated in Parliament in 2001, is that its knowledge is essentially limited to the Halt memo and that 'nothing of defence significance' occurred. A widely-supported prosaic explanation …

**Decision problem.** The most instructive case for the *chain-of-command* problem: a deputy base commander personally went into the woods, personally saw lights he could not explain, and wrote it up. His observation is honest, first-hand, senior, and — on the leading explanation — wrong. That is the nightmare for a crisis manager, because seniority and sincerity are normally the proxies used for reliability. It also sits next to a base long rumored to store nuclear weapons, which is why the case never dies: the nuclear adjacency …

**Outcome.** No defence-significant finding by the MoD; the case remains the most-discussed European military UAP case and is heavily contested between the lighthouse/fireball explanation and witness accounts.

**Stresses.** witness seniority vs witness reliability, nuclear adjacency multiplier, night-vision / dark-adaptation misperception, official dismissal vs public trust, allied-nation jurisdiction and reporting chain, contemporaneous documentation quality.

### USS Nimitz Carrier Strike Group 'Tic Tac' encounter (2004)

*Off Southern California, warning area west of San Diego*

Over several days culminating on 14 November 2004, radar operators aboard the cruiser USS Princeton tracked unidentified contacts exhibiting anomalous behavior. On 14 November two F/A-18F crews from the Nimitz air wing were vectored to a contact; four aircrew reported visually observing a white, wingless, roughly 40-foot 'Tic Tac'-shaped object above a disturbed patch of ocean, which departed rapidly. A subsequent aircraft acquired a target on radar and captured short infrared targeting-pod video (later released publicly as 'FLIR1'). The case involved multiple platforms and modalities: shipboard radar, airborne …

**Decision problem.** This is the case where multi-sensor corroboration — the thing you are supposed to demand before escalating — is actually present, and it still does not produce an answer. That is the hard lesson: corroboration raises confidence that *something* was observed without raising confidence about *what*. Skeptical analyses argue the IR video is consistent with a distant conventional aircraft affected by camera tracking and zoom, and that the radar behavior could reflect track-processing artifacts; those analyses address …

**Outcome.** No identification was made. The case became public via 2017 press reporting, was formally acknowledged by the Navy in 2019–2020, and pilots testified about it before the House Oversight Committee in July 2023. It remains officially unresolved.

**Stresses.** multi-sensor corroboration, sensor artifact vs real object, unresolved ≠ anomalous, reporting culture / non-escalation, intercept decision, evidence preservation (tapes, tracks).

### USS Theodore Roosevelt recurring encounters and the 'Gimbal' / 'GoFast' videos (2014–2015)

*Warning areas off the US east coast, Virginia to Florida*

F/A-18 aircrew associated with the Theodore Roosevelt Carrier Strike Group reported recurring unidentified objects in training airspace over an extended period, including at least one reported near-miss. Two short targeting-pod videos, 'Gimbal' and 'GoFast,' were recorded in January 2015 and later officially released by DoD in April 2020. Analysts including NASA-affiliated reviewers, AARO, and independent researchers have argued 'GoFast' shows a comparatively slow object at roughly 13,000 feet whose apparent high speed is a parallax effect of the fast-moving aircraft and the pod's viewing geometry, and that the …

**Decision problem.** The definitive sensor-artifact teaching case. Two videos that look overwhelmingly anomalous to a lay viewer — and to trained aircrew watching a cockpit display in real time — are substantially explained by the geometry and mechanics of the sensor itself. A crisis manager needs a standing habit of asking 'what would this look like if it were the instrument and not the world?' The second half is equally valuable: this is the case that changed institutional behavior. Because there was no reporting channel, recurring …

**Outcome.** DoD officially released the videos in April 2020 and confirmed they were unresolved at the time of release; substantial subsequent analysis has offered prosaic explanations for the apparent motion in both. A UAP Task Force was established in August 2020 and …

**Stresses.** sensor artifact (parallax, gimbal de-rotation, IR glare), operator real-time interpretation error, flight safety / near-miss, absence of a reporting channel, reporting-rate change as a policy artifact, not a phenomenon change, public release and its interpretation.

### Small-UAS incursions over US nuclear facilities (Palo Verde and the NRC record) (2015–2019 (continuing …)

*Palo Verde Nuclear Generating Station, Arizona, and 24+ US nuclear sites*

On the night of 29 September 2019 (and again the following night) security personnel at Palo Verde, the largest US nuclear plant, observed a group of roughly five or six large drones over the site for an extended period, prompting notifications to the county sheriff, FBI, NRC, FAA and DHS; the NRC coordinated with the FBI's WMD Directorate. Neither operators nor intent were ever determined. NRC documents released under FOIA and compiled by researcher Douglas D. Johnson documented at least 57 drone incursions over 24 US nuclear sites between 2015 and 2019, of which roughly 49 (about 85 percent) were closed …

**Decision problem.** Here the object is *identified* — they are drones — and the crisis is undiminished, because identification of the platform gives you nothing about the operator or the intent. Sustained loitering over a reactor by an unattributed operator could be hostile reconnaissance, a foreign service, a domestic enthusiast, a contractor, or an inspection flight nobody deconflicted. The response options are all bad: kinetic engagement over a nuclear site is unacceptable; electronic interference risks the plant's own systems and …

**Outcome.** No perpetrators identified at Palo Verde or in the great majority of NRC-logged incursions. Counter-UAS authority at civil nuclear sites remains a live legislative and policy issue.

**Stresses.** identification vs attribution, operator intent unknown, legal authority to act, response options constrained by the protected asset itself, chronic unresolved rate (~85%), interagency notification latency.

### ODNI Preliminary Assessment and the AARO reporting series (2021–2026)

*Washington DC (ODNI, DoD)*

The 25 June 2021 ODNI 'Preliminary Assessment: Unidentified Aerial Phenomena' examined 144 US-government reports from Nov 2004 to Mar 2021 and resolved exactly one — a large deflating balloon — leaving 143 unresolved, and stated that the limiting factor was insufficient, inconsistent data rather than exotic performance. It offered five explanatory bins: airborne clutter; natural atmospheric phenomena; US government or industry developmental programs; foreign adversary systems; and a residual 'other.' A UAP Task Force (Aug 2020) was superseded by the All-domain Anomaly Resolution Office (July 2022), directed …

**Decision problem.** This is the base-rate engine the whole domain should be balanced against, and it is quietly devastating to intuition. Once a case is actually worked, it resolves to something mundane the overwhelming majority of the time; the residual is dominated by cases with too little data, not by cases with impossible performance. Just as important is the collection-bias finding: reports cluster in restricted military airspace because that is where calibrated sensors and a reporting culture exist. A heat map of UAP reports is …

**Outcome.** Ongoing. AARO continues annual reporting under statute; the FY2025 report was released months past its statutory deadline, itself a recurring point of congressional friction.

**Stresses.** base rate of prosaic resolution, collection bias (sensor coverage ≠ phenomenon distribution), insufficient-data residual vs anomalous residual, reporting policy as a driver of apparent trends, interagency reporting integration, public communication of uncertainty.

### The Chinese high-altitude balloon and the three February 2023 shootdowns (2023)

*Continental US and Canada: South Carolina coast; northern Alaska; Yukon; Lake Huron*

From 28 January to 4 February 2023 a large Chinese-operated high-altitude balloon transited Alaska, Canada and the contiguous US before being shot down over territorial waters off South Carolina on 4 February. NORAD commander Gen. Glen VanHerck subsequently testified that earlier Chinese balloon transits had not been detected at the time, attributing this to 'a domain awareness gap' — radar processing had been rejecting slow, small, high-altitude returns — and that those prior events were learned of after the fact through other collection. After detection parameters were adjusted, NORAD immediately began seeing …

**Decision problem.** The single richest decision scenario in this domain, and it needs no exotic element at all. The player turns up sensor sensitivity in response to a genuine intrusion and is instantly flooded with tracks that were always there. Each new track presents an identical dilemma at low information: engage — spending an expensive weapon, risking a miss and falling debris over populated terrain or water, destroying the object you needed to identify, and sending an escalation signal — or wait, and risk being the official who …

**Outcome.** The Chinese balloon's payload was recovered off South Carolina. The other three objects were never identified or recovered. The episode drove NORAD investment in low-observable domain awareness and reshaped how unidentified high-altitude tracks are handled.

**Stresses.** detection threshold / sensitivity vs specificity, false-positive flood after threshold change, shoot/no-shoot at low confidence, weapon cost and miss probability, debris recovery as the only path to resolution, escalation signaling, domestic political pressure and abundance-of-caution bias, public trust after 'we shot down harmless balloons'.

### Langley AFB drone incursions (2023)

*Joint Base Langley-Eustis, Virginia, and nearby east-coast installations*

Beginning the evening of 6 December 2023 and recurring over roughly 17 nights, groups of unmanned aircraft systems operated over and near Langley AFB. Some F-22 aircraft were relocated to another base. No operators were identified. In the aftermath the Joint Chiefs tasked NORTHCOM to examine drone incursions across the United States. NORAD/NORTHCOM commander Gen. Gregory Guillot publicly described gaps 'in capability, in policy, and in law': NORAD's counter-UAS remit was scoped to an 'attack of national consequence' rather than small drones, NORTHCOM had no authority to act, and installation commanders owned …

**Decision problem.** The authority problem, isolated. The player has detection, has attribution-of-type (they are drones), has capability — and still cannot act, because no one in the chain holds the legal authority for this specific category of intrusion over domestic territory. The best available response was to move the aircraft. That is a genuinely counterintuitive and instructive outcome: the correct move was to reduce the value of the target rather than to engage the threat. It also stresses a coordination failure across NORAD, …

**Outcome.** Activity ceased without attribution. Counter-UAS authorities for domestic installations remained an unresolved legislative and policy gap, repeatedly cited in subsequent hearings and IG reporting.

**Stresses.** legal authority vs operational capability, jurisdictional fragmentation (NORAD / NORTHCOM / service / installation / FAA / FBI), attribution never achieved, target-value reduction as a response option, repeat-incursion pattern, domestic airspace constraints on response.

### AARO Historical Record Report Volume 1 and the 2023–2024 congressional hearings (2023–2024)

*Washington DC*

On 26 July 2023 the House Oversight Committee heard sworn testimony from former Navy pilots Ryan Graves and David Fravor and from former intelligence officer David Grusch, who alleged a concealed multi-decade crash-retrieval and reverse-engineering program and recovery of 'non-human biologics,' while declining to give specifics in an unclassified setting. AARO director Sean Kirkpatrick publicly stated that the central source of those allegations had declined to speak with AARO and that AARO had seen no credible evidence of any such program. AARO's Historical Record Report Volume 1 (released 6 March 2024, …

**Decision problem.** The information-integrity dilemma. Sincere, credentialed people report a secret program; the actual explanation is that they saw fragments of real classified work they were not cleared for and reconstructed a wrong story, and then social media returned that story to them as apparently independent corroboration. For a crisis manager this is the hardest failure mode to detect, because every normal reliability heuristic — clearance, seniority, sincerity, multiple sources — reads as green. The counter-move is to …

**Outcome.** Ongoing. AARO's findings are accepted by many analysts and rejected by advocates who argue AARO lacked access to the relevant compartments. A Historical Record Report Volume 2 has been anticipated. Congressional interest and statutory reporting requirements …

**Stresses.** circular reporting / false independence of sources, firsthand vs secondhand access, compartmentation producing false anomalies, institutional credibility, transparency vs classification tradeoff, whistleblower reliability assessment, public trust dynamics.

### The New Jersey and northeastern US drone flap (2024)

*New Jersey, New York, Pennsylvania and neighboring states*

From mid-November through December 2024, thousands of reports of nighttime drone activity spread from Morris County, New Jersey across neighboring states, including near sensitive sites. On 12 December 2024 the FBI and DHS jointly stated they had 'no evidence at this time that the reported drone sightings pose a national security or public safety threat or have a foreign nexus,' and noted a history of mistaken-identity cases in which reported drones proved to be manned aircraft. A joint DHS/FBI/FAA/DoD statement assessed the sightings as a combination of lawful commercial, hobbyist and law-enforcement drones, …

**Decision problem.** The public-trust collapse scenario, and the mirror image of every other case here. The federal assessment was substantially correct and was disbelieved anyway, in part because the same agencies had spent 2023 shooting down objects they could not identify and in part because 'we looked and found nothing' is structurally unfalsifiable to a worried public. A crisis manager must manage two separate systems simultaneously: the actual airspace picture, and the public's model of it — and actions that improve one can …

**Outcome.** Reports subsided; the federal assessment of mixed lawful drones, manned aircraft and misidentified celestial objects remained the official position and remained widely disputed locally. Counter-UAS authority legislation continued to be debated.

**Stresses.** public trust and its asymmetric recovery rate, observation cascade / social contagion of sightings, misidentification base rate (aircraft, stars, planets), credibility spillover from prior decisions, political pressure from state and local officials, counter-UAS authority gaps in populated areas, reassurance that reads as concealment.

### Mechanics to model

- RESOLUTION BASE RATE (the balancing anchor). Official unclassified figures: ODNI 2021 examined 144 reports (Nov 2004–Mar 2021) and resolved 1 (a deflating balloon). FY2022: 366 new reports, initially characterized as 163 balloon-like, 26 UAS-like, 6 clutter, 171 uncharacterized. FY2023: 291 reports (274 in-period), 290 air / 1 maritime. FY2024: 757 reports (485 in-period + 272 back-reported); 49 resolved and 243 more recommended for closure, ALL to prosaic causes (balloons, birds, UAS, satellites, aircraft); 21 flagged for further analysis. FY2025 (released July 2026): 319 reports, 114 explained, 205 unresolved; 274 air, 44 space, 1 maritime. Design implication: when a case is actually worked, prosaic resolution should be the modal outcome (roughly 35–65% resolved per cycle, trending toward near-total prosaic resolution given enough data), and the residual should be dominated by …

- UNRESOLVED IS NOT ANOMALOUS. Both ODNI (2021) and NASA's independent study team (Sept 2023) state the limiting factor is data quality — sparse, uncalibrated, non-repeatable observations — not exotic physics. Model 'resolution' as a function of (number of independent modalities) x (recording fidelity) x (analyst time spent), and let most unresolved cases be starved of one of those three rather than genuinely strange. A game that lets 'unresolved' silently imply 'extraordinary' is teaching the wrong reflex.

- COLLECTION BIAS IS THE FIRST-ORDER EFFECT. AARO's FY2023 report explicitly notes a strong collection bias toward restricted military airspace, driven by where calibrated sensors and reporting cultures are. A report density map is a sensor-coverage map. Mechanic: give the player a coverage overlay separate from the report overlay, and score them on never inferring absence of activity from absence of reports.

- REPORTING POLICY DRIVES APPARENT TRENDS. Report counts rose from 144 (2021, covering 17 years) to 757 (FY2024, covering ~13 months) because standardized Navy reporting guidance (2019), Air Force guidance, and a statutory reporting mandate (2022) removed stigma and created a channel — not because the sky changed. Mechanic: let the player adjust reporting policy and watch the count move, so they learn to distinguish a signal change from an instrumentation change.

- SENSOR ARTIFACT TAXONOMY (the core teaching content, all publicly documented and non-uplifting). Parallax: apparent target speed generated by the observer's own motion — the leading explanation for 'GoFast.' Gimbal/de-rotation artifact: an apparent rotation of the target produced by the camera mount rotating to keep the target framed — the leading explanation for 'Gimbal.' Infrared glare and defocus: a bloomed, out-of-focus hot source acquires an apparent shape and size unrelated to the object. Celestial returns: the 1960 Thule moonrise. Anomalous propagation and ducting: real radar returns from nothing solid. Track-correlation error: the fusion layer stitching separate contacts into one impossible trajectory. Rolling shutter and bokeh in low-light video: the dominant source in civilian night-sky reports. Give each an in-game 'artifact signature' the player can learn to recognize.

- MULTI-SENSOR CORROBORATION IS THE BEST DISCRIMINATOR AND STILL NOT SUFFICIENT. ODNI 2021 noted roughly 80 of 144 reports involved observation by multiple sensors; 21 reports (18 incidents) described unusual movement; 11 involved documented near misses; 18 reports described apparent radio-frequency energy. Nimitz 2004 had shipboard radar, airborne radar, infrared and four aircrew's eyes — and remains unresolved. Mechanic: cross-modality confirmation should raise confidence that an object exists sharply, and confidence about what it is only slightly. Reward the player for demanding it; do not let it be a win condition.

- ATTRIBUTION IS THE BINDING CONSTRAINT, NOT DETECTION. NRC/FOIA records show ~57 drone incursions over 24 US nuclear sites (2015–2019) with roughly 49 (~85%) closed unresolved as to operator. AARO's FY2024 report received 18 reports from NNSA/NRC concerning incidents near nuclear infrastructure, weapons and launch sites — all categorized as UAS, i.e. identified as to type and still unattributed. Mechanic: separate IDENTIFICATION (what class of thing) from ATTRIBUTION (whose, and why) as two independent confidence tracks. Attribution should almost never reach high confidence within the decision window.

- AUTHORITY IS A SEPARATE RESOURCE FROM CAPABILITY. At Langley (Dec 2023), NORAD's counter-UAS remit covered only an 'attack of national consequence,' NORTHCOM had no authority to act, and the installation commander owned base defense; the DoD IG found no consistent domestic counter-drone policy. Model 'legal authority to engage' as a distinct, slow-to-change resource. The historically correct move at Langley was to relocate the F-22s — reduce target value rather than engage — and the game should make that a scoring-positive option.

- THE THRESHOLD IS A POLICY CHOICE THAT MANUFACTURES DECISIONS. NORAD had been filtering out slow, small, high-altitude returns (Gen. VanHerck's 'domain awareness gap'); loosening that filter after 4 Feb 2023 produced an immediate surge in tracks and three shootdowns in four days. Implement an explicit sensitivity/specificity slider with visible consequences: raise sensitivity and false-positive volume, engagement decisions, munition expenditure and public alarm all rise together; lower it and undetected real intrusions accumulate silently and surface later as scandal.

- SHOOTING COSTS MORE THAN THE MISSILE. February 2023: an AIM-9X was expended and MISSED on the Lake Huron object before a second scored; debris from all three smaller objects was never recovered despite extensive search; the objects were subsequently assessed as most likely benign (commercial, research or hobbyist balloons). Model engagement as: monetary cost + non-trivial miss probability + falling-debris risk + escalation signal + PERMANENT LOSS OF THE IDENTIFICATION OPPORTUNITY. Destroying the unknown converts uncertainty into a different, unrecoverable uncertainty.

- TIME BUDGETS ARE THE REAL DIFFICULTY DIAL. Slow high-altitude object: hours to days (the Chinese balloon transited North America over roughly a week). Fast unidentified air track with alert intercept available: tens of minutes. Missile-warning correlation decision: single-digit to low double-digit minutes (the 1960 Thule case). Nuclear facility loss-of-alert event: the Malmstrom technical estimate was a 10–40 second transient with a diagnosis window of days. Assign each scenario a clock and let the available verification actions scale with it — corroboration is cheap at hours and impossible at minutes.

- NUCLEAR ADJACENCY IS AN EXPLICIT MULTIPLIER. The identical unidentified track is a curiosity over farmland, a flight-safety issue over a training range, and a national incident over a missile field, a reactor, or a carrier. Apply a location-based multiplier to political pressure, escalation risk, reporting priority and required response speed — independent of any change in what the object actually is. This is the mechanically honest way to represent the 1967 Malmstrom, 1975 SAC, 1980 Rendlesham and 2019 Palo Verde pattern without asserting a causal link between UAP and nuclear assets.

- CHANNEL SATURATION AND ADVERSARY EXPLOITATION. The Robertson Panel's 1953 concern — that a flood of reports could clog air-defense communications and that an adversary might deliberately generate that flood to mask a real attack — is the sharpest game-relevant idea in the whole domain and it requires no aliens. Implement a finite analyst/comms capacity; let report volume consume it; let an adversary optionally inject decoys. The player's threshold policy then trades off missed real events against a saturated channel.

- CIRCULAR REPORTING BREAKS SOURCE COUNTING. AARO's 2024 Historical Record Report found that none of its interviewees describing alleged secret UAP programs had firsthand access, that the named programs resolved to nonexistent efforts, misidentified genuine sensitive programs, or the never-approved KONA BLUE proposal, and that social media drove circular reporting. Mechanic: when the player aggregates sources, apply a circularity discount — five sources tracing to one origin should score as slightly more than one, not five. Add a 'firsthand access?' flag to every human source.

- COMPARTMENTATION MANUFACTURES FALSE ANOMALIES (BLUE-ON-BLUE AMBIGUITY). Multiple historical UAP reports resolve to the observer's own government's classified programs that the observer was not cleared to know about. Malmstrom 1967 is the archetype — the reported later explanation is a classified electromagnetic-effects test, itself disputed. Mechanic: give a fixed probability that any given anomaly is your own side, unknowable to you within the decision window, and unverifiable even afterward. This is the strongest de-escalation argument available to a player and the game should let them discover it.

- OFFICIAL DENIAL AND COVER-UP ARE INDISTINGUISHABLE FROM OUTSIDE. December 2024: the FBI/DHS/FAA/DoD assessment (lawful commercial, hobbyist and law-enforcement drones, manned aircraft, and stars misreported as drones) was substantially correct and was publicly rejected by state and local officials. Model PUBLIC TRUST as a resource that falls fast and recovers slowly, that is spent by both action (shooting down harmless balloons) and inaction (declining to explain), and that carries over between scenarios — a credibility debt incurred in one crisis should raise the cost of being believed in the next. The 1953–1969 debunking era and the 2021–2024 disclosure push are the long-horizon example.

- OBSERVATION CASCADE. Once attention is directed at the night sky, the ordinary sky supplies effectively unlimited ambiguous stimuli: aircraft landing lights, helicopters, satellites and satellite constellations, planets, bright stars, and lawful drones. The Nov–Dec 2024 flap produced thousands of reports from a mundane substrate. Mechanic: reported-sighting rate should scale with public attention, not with underlying events — so a reassurance campaign, a news cycle, or deploying visible detection assets all mechanically increase the sighting count the player then has to triage.

- ESTABLISHED NEGATIVE BASELINE (state this in-game). Across ODNI, AARO, NASA and the 1969 Air Force closing findings: no UAP case has been confirmed to represent extraterrestrial technology; no case has been attributed to a foreign adversary's breakthrough capability; no confirmed collision between a UAP and a US aircraft has been recorded; and no sighting has been established as an indication of threat to national security. Documented near misses and flight-safety exposure ARE real and are the concrete harm the reporting reforms were built to address. Anchor the game's fiction to this baseline: the danger being simulated is the decision under uncertainty, not the object.

- CONTESTED-ACCOUNT HANDLING. Several key cases have a documentary record and a witness record that diverge (Malmstrom 1967 Echo Flight; Rendlesham 1980; Nimitz radar behavior; the Grusch allegations). Represent these as cases where the player receives two internally consistent evidence streams that cannot both be fully true, with no mechanism available to reconcile them inside the decision window, and where an authoritative-sounding resolution may arrive years later and still be disputed. Do not resolve them for the player.

- SOURCING CAVEAT FOR THE DESIGN TEAM. Report counts across years overlap because of back-reporting (FY2024's 757 includes 272 events from prior periods), so the series is not a clean time series and should not be plotted as a trend. Several widely-cited details — the Malmstrom UFO correlation, aspects of the Nimitz radar behavior, the Rendlesham sequence, the alleged 'Immaculate Constellation' program — are contested or rest on single-source witness accounts, and should be labeled as such in any in-game codex.

---

## High-altitude EMP and radiological dispersal

*15 incidents.*

### Starfish Prime (ground effects in Hawaii) (1962)

*Johnston Atoll, Central Pacific; effects observed ~1,400-1,450 km away on Oahu, Hawaii*

On 9 July 1962 the United States detonated a ~1.4 megaton device at roughly 400 km altitude above Johnston Atoll as part of Operation Fishbowl. Roughly 1,400 km away on Oahu, the electromagnetic pulse coupled into long conductors and produced streetlight string failures (commonly reported as ~300 lamps, though the figure is poorly documented and disputed in later technical reviews), tripped burglar alarms, and damaged a Hawaiian Telephone microwave repeater link between islands. The pulse was far larger than predicted and drove much of the purpose-built diagnostic instrumentation off scale, so the best-measured …

**Decision problem.** The canonical case of a technically sophisticated actor being surprised by its own weapon. Scientists knew EMP existed and had instrumented for it; the effect exceeded their model by enough that their sensors saturated. The mechanism (gamma-produced Compton electrons turned coherently by the geomagnetic field, radiating as a vast transient loop antenna) was only properly explained afterward by Conrad Longmire at Los Alamos. For a crisis manager this is the 'your model was wrong and your instruments are lying' …

**Outcome.** Test proceeded; effects were catalogued over subsequent months and years and became the empirical foundation of HEMP science. No casualties. The Partial Test Ban Treaty (1963) ended atmospheric and exo-atmospheric testing the following year, which froze the …

**Stresses.** sensor confidence, model error / instrument saturation, distance-to-effect uncertainty, infrastructure coupling (long conductors), irreversibility of a test decision, scientific consensus vs observed data.

### Starfish Prime artificial radiation belt and the satellite die-off (1962-1963)

*Low Earth orbit, globally*

Starfish Prime injected a long-lived population of trapped energetic electrons into Earth's magnetic field, creating an artificial radiation belt that persisted for years. Satellites that were undamaged at the moment of detonation degraded and failed over the following weeks and months as their solar cells and electronics accumulated dose: Transit 4B stopped transmitting 2 August 1962, TRAAC on 14 August, Britain's Ariel 1 was crippled within days and never fully recovered, and Telstar 1's command channel began misbehaving in November 1962 and failed permanently in early 1963. Cosmos V and Injun I suffered …

**Decision problem.** Slow-motion, deniable, indiscriminate damage. The harm is not at the moment of the burst — it accrues silently over weeks, and it falls on third parties who had nothing to do with the dispute. Ariel 1 was British; Cosmos V was Soviet; Telstar was a commercial asset. A player who authorises or suffers a high-altitude burst faces a consequence curve that keeps delivering long after the crisis 'ended,' and an attribution problem in reverse: whose satellite failed, and can you prove why. Modern versions of the same …

**Outcome.** The artificial belt decayed over several years (commonly cited as roughly five). The episode is a direct antecedent of the 1963 Partial Test Ban Treaty and the 1967 Outer Space Treaty's prohibition on placing nuclear weapons in orbit.

**Stresses.** delayed causation / latency between act and effect, collateral harm to neutrals and commercial actors, attribution certainty, cumulative dose as a hidden state variable, irreversibility over multi-year timescales, international legal response.

### Soviet Project K, Test 184 (K-3) over Kazakhstan (1962)

*Sary Shagan range, Kazakh SSR; effects reported across central Kazakhstan (Karaganda, Zhezkazgan, the …*

On 22 October 1962 the USSR detonated a ~300 kt warhead at roughly 290 km altitude over populated Kazakh territory — deliberately over its own long-line infrastructure, which is why it produced the best-documented HEMP infrastructure damage on record. Russian accounts published in the 1990s report E1-induced currents of roughly 1,500-3,400 A in a monitored 570 km overhead telephone line, whose fuses and gas-discharge protectors all failed; a fire that destroyed the Karaganda power plant, attributed to currents induced in a ~1,000 km shallow-buried power cable; damage to diesel generators; and radar disruption …

**Decision problem.** Two distinct dilemmas. First, timing: the shot occurred on the same day Kennedy went on television to announce the Cuban quarantine. A high-altitude nuclear detonation over Soviet territory, during the tensest 48 hours of the Cold War, was a signal that could have been read several ways — and largely was not read at all by the other side in real time. Second, evidence quality: nearly everything known about the infrastructure damage traces to a small number of Russian technical papers presented after 1991, …

**Outcome.** Neither superpower treated the other's 1962 high-altitude tests as an escalatory act during the crisis. Infrastructure was repaired locally; the data was classified for roughly thirty years and entered Western literature only in the 1990s.

**Stresses.** evidence provenance / single-source risk, signal-vs-noise during a concurrent crisis, time pressure, infrastructure coupling length (long lines amplify effect), contested figures, intelligence lag of decades.

### The May 1967 solar storm and the BMEWS 'jamming' scare (1967)

*BMEWS radar sites at Clear (Alaska), Thule (Greenland), Fylingdales (UK); NORAD, Colorado*

On 23 May 1967 an intense solar radio burst and geomagnetic storm degraded all three Ballistic Missile Early Warning System radars simultaneously and disrupted HF communications. Deliberate jamming of these radars was doctrinally treated as an act of war, and with nuclear-armed bombers already on airborne alert, additional aircraft were readied while options were debated. A small Air Force solar-forecasting cell established that all three sites were in sunlight and that the interference was consistent with solar radio emission, and convinced the chain of command that the Sun, not the Soviet Union, was the cause.

**Decision problem.** This is the purest attribution-under-time-pressure scenario in the whole domain, and it maps directly onto HEMP: a technical signature that is genuinely ambiguous between 'natural phenomenon' and 'act of war,' with a doctrinal tripwire attached to one interpretation. The saving move was not better sensors — it was a low-status specialist community whose data existed, was correct, and had to be believed by people with no reason to trust it in the next twenty minutes. A game can model this as: the right answer is …

**Outcome.** Forces returned to normal alert status within hours. The episode remained obscure until published in the peer-reviewed literature in 2016, and is now a standard case in space-weather and nuclear-command-and-control teaching.

**Stresses.** attribution certainty, natural vs hostile cause ambiguity, time pressure (minutes to hours), doctrinal tripwires / automatic escalation rules, expert credibility and organisational trust, alert-level escalation as a reversible vs irreversible step.

### Hydro-Quebec geomagnetic storm blackout (1989)

*Quebec, Canada; secondary effects across North America*

On 13 March 1989 a severe geomagnetic storm drove geomagnetically induced currents into the Hydro-Quebec transmission system; the grid collapsed in about ninety seconds, leaving roughly six million people without power for about nine hours. Transformers saturated and overheated, harmonics propagated, and protective relays cascaded. Hundreds of anomalies were logged across North American utilities, and a generator step-up transformer at the Salem nuclear plant in New Jersey was damaged.

**Decision problem.** The best real-world analogue for the late-time (E3) component of a HEMP, and the only large-scale demonstration of grid collapse from a quasi-DC ground-induced current. The dilemma it generates is a resilience-investment one: Quebec subsequently spent on the order of two billion dollars over six years on mitigation, a decision made after the fact for a hazard that had been theoretically known for decades. In a prevention-framed game this is the 'you could have paid before' card — and it also illustrates how fast a …

**Outcome.** Power restored in about nine hours; long-term hardening programme followed; the event is the anchor case for both space-weather policy and E3 HEMP grid modelling.

**Stresses.** cascade speed vs decision speed, transformer saturation and thermal damage, pre-crisis mitigation investment, public trust / blame after an 'unforeseeable' event, natural hazard as a proxy for a hostile one.

### The EMP Commission reports and the contested-evidence fight (2001-2019)

*United States (Congress, DHS, DOE, the electric utility sector)*

Congress established the Commission to Assess the Threat to the United States from Electromagnetic Pulse Attack in 2001; it issued an executive report in 2004, a Critical National Infrastructures report in 2008, and further reports after being reconstituted through 2017. Its conclusions — that a single high-altitude burst could produce protracted, continent-scale infrastructure failure — became the basis for Executive Order 13865 (26 March 2019) assigning EMP resilience responsibilities across the federal government. The findings have been publicly contested: a 2019 EPRI study of the bulk transmission system …

**Decision problem.** The dilemma here is not operational, it is epistemic and budgetary, which makes it ideal for a prevention-framed game. The widely circulated 'up to 90% of Americans dead within a year' figure originated in a novel; the Commission chairman, asked at a 2008 House Armed Services hearing whether that was realistic, replied that it was 'in the correct range' — and the number then propagated as if it were a finding. Physicist Yousaf Butt's 2010 critique and the Radasky/Pry rebuttal ran the argument in public. Players …

**Outcome.** Unresolved. EO 13865 remains the policy framework; CISA and DOE run programmes; the technical dispute over grid consequence magnitude is ongoing and both bodies of work remain in circulation.

**Stresses.** consequence uncertainty spanning orders of magnitude, expert disagreement and institutional incentive, budget allocation under deep uncertainty, public trust and media amplification, numbers detaching from their source, policy inertia.

### North Korea's declared HEMP capability (2017)

*Democratic People's Republic of Korea; Punggye-ri test site*

Alongside its sixth nuclear test on 3 September 2017, North Korean state media described the tested device as a thermonuclear warhead 'which can be detonated even at high altitudes for super-powerful EMP attack according to strategic goals.' Yield estimates from seismic data varied widely and analysts cautioned that seismic inference has real limits; the EMP claim specifically was widely read as declaratory signalling rather than as evidence of a demonstrated capability. The claim nonetheless drove a US congressional hearing in October 2017 and shaped a policy debate.

**Decision problem.** A state announcing a capability it may or may not have, in language chosen to maximise adversary anxiety at near-zero cost. The crisis manager's problem is that the correct response to a bluff and the correct response to a real capability differ, and that publicly discounting the claim carries political risk while publicly crediting it hands the adversary free coercive leverage. It also demonstrates how a technical term ('EMP') can be deployed as a rhetorical weapon — the announcement did work in the target …

**Outcome.** No high-altitude test followed. The claim remains an assertion; the analytic consensus treats it as signalling with an unverified technical basis behind it.

**Stresses.** declaratory signalling vs demonstrated capability, verification limits (seismic inference), adversary intent modelling, domestic political cost of discounting a threat, information-space effects independent of physical capability.

### Ciudad Juarez cobalt-60 dispersal via the scrap-metal chain (1983-1984)

*Ciudad Juarez, Chihuahua, Mexico; contamination distributed across 17 Mexican states and into the United …*

A disused teletherapy unit bought by a private hospital in 1977 and never commissioned was dismantled for scrap on 6 December 1983, spilling roughly six thousand cobalt-60 pellets into the scrap stream. Foundries melted the material into an estimated 6,000 tonnes of contaminated rebar and cast products that were distributed across 17 Mexican states and exported. The contamination went undetected for six weeks until 16 January 1984, when a truck carrying contaminated rebar took a wrong turn at Los Alamos and set off a portal monitor. Estimates of exposed persons run to around 4,000; 109 houses in Sinaloa were …

**Decision problem.** An accidental radiological dispersal at a scale no deliberate device could achieve, propagated by ordinary commerce rather than by an explosion — and discovered entirely by luck. It reframes the RDD problem correctly: the hard part is not dispersal, it is detection and the recall of a contaminated supply chain across a border. The decision dilemmas are recall scope (how much steel do you pull, at what economic cost, on what evidence), cross-border notification (who tells whom, and when), and the near-total absence …

**Outcome.** Recall and recovery operations ran across both countries; contaminated product was traced, impounded, and buried. The event is a foundational case in the international regulation of disused sources and drove the installation of radiation portal monitors at …

**Stresses.** detection by luck vs by design, supply-chain contamination and recall scope, cross-border notification and jurisdiction, economic cost of a precautionary recall, regulatory orphaning of disused sources, time-to-discovery (six weeks).

### The Goiania caesium-137 accident (1987)

*Goiania, Goias, Brazil*

On 13 September 1987 scavengers removed a caesium-137 teletherapy source (roughly 50.9 TBq, ~1,375 Ci, in the form of caesium chloride powder) from an abandoned radiotherapy clinic and breached the capsule; the glowing blue powder was handled, shared, and distributed among families over the following two weeks. Radiation sickness was initially misattributed to a contagious tropical illness; the cause was identified on 28-29 September when a visiting medical physicist, Walter Mendes Ferreira, took a borrowed survey meter to the site and drove it off scale. Roughly 112,000 people were monitored, 249 were found …

**Decision problem.** The single most instructive RDD-adjacent event, for three separate reasons. (1) Sixteen days elapsed between the release and recognition, because the presenting symptoms looked like something else and no one had a detector — the game-relevant variable is time-to-recognition, not response speed. (2) The 112,000 monitored versus 249 contaminated ratio is the 'worried well' problem quantified: the response capacity is consumed almost entirely by people who are not harmed, and refusing to screen them is not …

**Outcome.** Source recovered and the area remediated over months; waste consigned to a purpose-built repository. The IAEA published a detailed report (STI/PUB/815, 1988) that became the reference case for radiological emergency response and for the international Code of …

**Stresses.** time-to-recognition / diagnostic ambiguity, worried-well surge vs actual contamination (roughly 450:1 here), contamination footprint and waste volume, public trust and stigma, perception-driven economic loss decoupled from physical risk, medical surge capacity, survivor ostracism.

### The Izmailovsky Park caesium container, Moscow (1995)

*Izmailovsky Park, Moscow, Russia*

On 23 November 1995 a Russian television crew, acting on a tip, recovered a container of caesium-137 buried under leaves in a Moscow park. Chechen commander Shamil Basayev had told the network where it was and characterised the disclosure as a gesture; reporting at the time described explosive material buried alongside it, though the specifics are inconsistently sourced. Nothing was detonated and no significant contamination resulted, but the episode produced a wave of public alarm in Moscow and is the most-cited real instance of a radiological device being staged for effect.

**Decision problem.** A weapon used entirely as a communication and never as a device — the terrorist told the media where it was. That inverts the usual crisis structure: there is no detection problem, no casualty problem, and no contamination problem, only a message and a public reaction, and the government's response options all amplify the message. Do you confirm the find publicly (validating the threat, calming rumour, and handing the adversary his headline), or downplay it (and be accused of concealment when it leaks anyway)? It …

**Outcome.** Container recovered and removed; no detonation, no casualties. Follow-up sweeps found no further material. The event became the canonical citation in every subsequent RDD threat assessment — arguably out of proportion to what physically happened, which is …

**Stresses.** public trust and rumour management, threat as communication rather than as effect, media amplification, adversary intent (demonstration vs attack), government credibility in confirming or denying, panic as the actual damage mechanism.

### The Argun railway container, Chechnya (1998)

*Argun, near Grozny, Chechnya*

In December 1998 Chechen security officials announced the discovery of a container of radioactive material attached to an explosive charge, concealed near a railway line at Argun. It was reportedly defused without detonation. Together with the 1995 Moscow case this is one of only two publicly reported instances of an assembled caesium-and-explosive device; both involved Chechnya and neither was detonated. The account rests on a small number of contemporaneous reports and is not independently corroborated.

**Decision problem.** The evidentiary dilemma. A find announced by a party to a conflict, about that conflict, with limited independent verification — the same structure as the 2022 Russia-Ukraine allegation, seen from the other side. A crisis manager receiving this report must decide how much threat-picture revision it justifies when the reporting entity has an obvious interest in the story being true. The scenario rewards players who ask 'who is telling me this and why' before they ask 'how bad is it.'

**Outcome.** Reportedly rendered safe; no detonation, no casualties reported. The case entered the international RDD literature and has been cited ever since with varying degrees of hedging.

**Stresses.** source reliability of the reporting party, independent verification availability, threat-picture inflation from thin reporting, conflict-zone information environment, precedent-setting effect of a contested claim.

### The Lia orphan-source accident, Georgia (2001-2002)

*Village of Lia, Tsalenjikha district, western Georgia*

On 2 December 2001 three men collecting firewood found two metal objects in a forest and, finding them warm, stayed near them overnight. The objects were strontium-90 heat sources from Soviet-era radioisotope thermoelectric generators (each reported at roughly 1,295-1,480 TBq) that had powered a radio-relay system abandoned when a hydroelectric project stopped; of eight sources originally installed, two had never been accounted for. All three men developed acute radiation syndrome with severe local burns — estimated whole-body doses in the range of 2-6 Gy — and were correctly diagnosed only after roughly three …

**Decision problem.** The orphan-source problem in its clearest form: sources that were legally installed, functionally forgotten when the institution that owned them dissolved, and then found by people with no reason to suspect danger. There was never an adversary. The dilemmas are inventory reconstruction (a state must find things whose records were destroyed with the USSR), recovery under a hard exposure budget (25 people, 40 seconds each — an explicit resource-allocation mechanic), and the diagnostic lag that turns a survivable …

**Outcome.** Sources recovered and secured under IAEA auspices in July 2002; the men received prolonged treatment for radiation injuries with lasting disability. The case drove a sustained international programme to locate and secure abandoned RTGs and similar legacy …

**Stresses.** orphan-source inventory uncertainty, diagnostic lag (three weeks), exposure budget as a hard operational constraint, institutional collapse and lost records, international assistance dependence, recovery-team risk allocation.

### The Jose Padilla 'dirty bomb' announcement (2002-2008)

*Chicago O'Hare Airport; Charleston, South Carolina; Miami, Florida, United States*

Jose Padilla, a US citizen, was detained at O'Hare in May 2002; in June the Attorney General announced from Moscow that he had been involved in a plot to detonate a radiological dispersal device in the United States. Padilla was designated an enemy combatant and held in a military brig for roughly three and a half years, largely in solitary confinement and without counsel. When criminal charges were finally filed in November 2005, days before the Supreme Court was to hear his detention challenge, they made no mention of the radiological allegation; the original sources for it were not expected to testify and the …

**Decision problem.** The counterterrorism-decision analogue of every other case here: intelligence of uncertain provenance, a public announcement that cannot be walked back, and a legal architecture improvised in real time. The dilemmas are sequenced and each foreclosed the next — announce early (deterring a plot, reassuring the public, and committing the state to a claim it may not be able to sustain) or hold; detain under war powers (preserving intelligence access, forfeiting prosecutable evidence) or arrest normally. A player who …

**Outcome.** Convicted August 2007; sentenced January 2008 to 17 years 4 months, later increased on resentencing. The radiological allegation was never adjudicated. The case produced significant US constitutional litigation on the detention of citizens.

**Stresses.** intelligence provenance and coercion-tainted sourcing, public announcement as an irreversible commitment, legal-process choice foreclosing later options, civil liberties vs preventive detention, attribution certainty never resolved, institutional credibility cost.

### Russia's 'Ukraine dirty bomb' allegation and the IAEA verification response (2022)

*Ukraine; diplomatic channels in Washington, London, Paris, Ankara; IAEA Vienna*

In late October 2022 Russia's defence minister told his American, British, French and Turkish counterparts that Ukraine was preparing to detonate a radiological dispersal device on its own territory as a provocation, and senior Russian officials repeated the claim publicly. Ukraine denied it, invited the IAEA in, and Western governments assessed the allegation as a possible pretext for Russian escalation. IAEA inspectors visited three Ukrainian nuclear facilities and reported on 3 November 2022 that they had found no indications of undeclared nuclear activities or materials.

**Decision problem.** A radiological threat used as a diplomatic instrument with no device involved anywhere. The dilemma for the accused state is that both responses are costly: refuse inspection and appear to confirm; accept inspection and legitimise an accusation made in bad faith while establishing a precedent that any accuser can trigger a verification burden. The dilemma for third parties is worse — they must decide, within days, whether the claim is intelligence, a warning of a false-flag operation, or an information-operation, …

**Outcome.** No device was used. IAEA reported nothing found; the allegation faded from the diplomatic foreground but persisted in information channels. The episode is now a standard case in nuclear-security information-operations analysis.

**Stresses.** allegation as escalation pretext, verification speed vs allegation speed, cost of accepting inspection under a bad-faith accusation, third-party attribution judgement in days, negative findings failing to close a claim, international institution credibility.

### The lost caesium capsule, Western Australia (2023)

*Great Northern Highway corridor between the Pilbara and Perth, Western Australia (~1,400 km)*

A small caesium-137 capsule from a mining density gauge was lost from a truck somewhere on a 1,400 km transport route between a Rio Tinto iron ore mine and a Perth depot at some point between 10 and 16 January 2023. It was reported missing on 25 January, prompting an urgent public warning covering the entire route. After roughly six days of searching with vehicle-mounted gamma detectors, the 8 mm capsule was located on 1 February a couple of metres from the roadside. Public commentary at the time noted that the applicable penalty regime was trivially small, which triggered a law-reform debate.

**Decision problem.** A modern, well-documented, low-casualty case that stresses exactly the variables a crisis-management game needs: a search problem over an enormous area with a weak signal; a nine-to-fifteen-day reporting gap between loss and notification; and a public-communication decision where warning the population is both necessary and the thing that creates the panic. It also carries the accountability question — a source that could seriously injure someone was lost through a routine logistics failure, and the consequences …

**Outcome.** Capsule recovered intact on 1 February 2023 with no reported exposures. Western Australia moved to substantially increase penalties for radiation-safety breaches; the case is widely cited in transport-security guidance. Some specific figures (capsule …

**Stresses.** search over a large area with weak signal, reporting delay between loss and notification, public warning vs public panic tradeoff, chain-of-custody failure in routine transport, regulatory penalty adequacy, recovery under media scrutiny.

### Mechanics to model

- HEMP pulse framework (IEC 61000-2-9 terminology, safe to model at this level): E1 is the early-time component, rise time on the order of nanoseconds, standardised peak field commonly cited at 50 kV/m — too fast for conventional surge protection, so it attacks electronics and digital protective relays directly. E2 is the intermediate component (roughly 1 microsecond to 1 second), broadly similar to a lightning-induced pulse and individually manageable; its significance is that it arrives after E1 may have destroyed the protection that would otherwise have handled it. E3 is the late-time magnetohydrodynamic component, lasting seconds to minutes, inducing quasi-DC ground currents in long lines — commonly modelled at 25 V/km (existing threat), 50 V/km (potential future threat), with 85 V/km cited as near-maximum. Model these as three sequential, differently-mitigated attacks on the same …

- E1 footprint is a line-of-sight geometry problem: everything within line of sight of the burst point is illuminated. A burst at roughly 300-400 km altitude gives a footprint radius on the order of 2,200 km. Within the footprint the field is not uniform — there is a ground-zero point beneath the burst, a null point where the observer ray parallels the geomagnetic field, and a separate maximum point displaced toward the equator in the northern hemisphere. Game consequence: the worst-affected region is not under the burst, which makes intuitive damage assessment wrong and makes 'where was it aimed' a genuinely hard inference.

- E3 grid mechanics: quasi-DC currents of tens to hundreds of amperes flow in transformer neutrals, driving half-cycle core saturation, harmonic injection, reactive power collapse, and thermal damage. Hydro-Quebec 1989 gives the empirical timescale — grid collapse in about 92 seconds, restoration in about nine hours for six million customers, with a damaged generator step-up transformer at Salem, NJ. Large power transformers are the slow variable: they are custom-built with lead times measured in many months to years, which is what turns a fast event into a slow recovery. Model transformer replacement inventory as a separate, non-purchasable-in-crisis resource.

- Consequence uncertainty is itself the mechanic. EPRI (2019) modelled the bulk transmission system and concluded that E3 alone could cause a multi-state regional blackout but that findings 'do not support the notion of blackouts encompassing the contiguous United States and lasting for many months to years,' estimating 5-15% of digital relays disrupted or damaged — while explicitly excluding generation, distribution, nuclear plants, and other sectors from scope. The EMP Commission's framing is far more severe. A well-designed scenario should present the player with both estimates and no adjudicator.

- Watch for numbers that have detached from their sources. The '90% of Americans dead within a year' figure originated in fiction; it acquired official-seeming status when the EMP Commission chairman told a 2008 House hearing it was 'in the correct range.' The '300 streetlights in Hawaii' figure is repeated everywhere and is weakly documented. Most of the Soviet Test 184 infrastructure damage figures trace to a handful of Russian papers published after 1991. The game can and should model citation drift as a real information-environment hazard.

- HEMP attribution timeline vs decision timeline is the core strategic-ambiguity mechanic. A high-altitude burst produces no blast, no fallout on the ground, no crater, and no bodies — but it is unambiguously a nuclear detonation, detectable by satellite-based nuclear detonation detection and by seismic/optical/EMP signature. What it does not tell you is who. Technical nuclear forensics on debris is estimated at 21-90 days under optimistic conditions, and a high-altitude burst leaves little collectable debris. Meanwhile the historical response tempo for terrorist attacks averaged around 22 days (median 12). Model this as: the demand for an answer arrives days-to-hours after the event; the answer arrives weeks-to-never. Everything the player does in between is done blind.

- The 'no casualties' paradox deserves explicit modelling. A HEMP kills no one directly, which removes the moral clarity that normally licenses retaliation, while simultaneously crossing the nuclear-use threshold, which normally mandates it. Deaths accrue indirectly and slowly (medical systems, water, refrigeration, heat/cold), are contested for years, and cannot be counted in the decision window. A player is asked to price a nuclear response against a casualty figure that does not yet exist and never becomes definitive.

- Delivery-mode ambiguity compounds attribution: a burst originating offshore rather than from national territory was the specific scenario that animated the 'anonymous attack' debate. Butt's 2010 critique argued any state attempting this would have to be 'suicidally optimistic' about remaining anonymous given detection and forensics; the counterargument is that the attacker only needs the defender to be uncertain for a few days. Both positions can be represented to the player as advisers.

- Satellite collateral is a separate, longer-running consequence track. Starfish Prime damaged or destroyed roughly a third of then-existing LEO satellites within about seven months, including British and Soviet spacecraft, and the artificial belt persisted for years. Analyses of modern collateral (e.g. DTRA-sponsored work) suggest a pumped belt could render substantial portions of LEO inhospitable for months. Model this as damage that continues to accrue for the rest of the campaign, falls on neutrals, and generates diplomatic consequences independent of the original dispute.

- IAEA source categorisation (RS-G-1.9) gives a clean, public, five-tier scale for scenario design. Category 1 sources are those that, unshielded and uncontrolled, can deliver deterministic whole-body or extremity doses in the tens to hundreds of Gy and cause death within hours to days of close contact — radiothermal generators, sterilisation and teletherapy sources. Category 3 could cause permanent injury after hours of contact and might be fatal over days to weeks. Category 5 cannot cause permanent injury. Use the category label as the game's threat scalar and never publish activity-to-effect conversions.

- Orphan-source base rates, for scenario plausibility: the IAEA Incident and Trafficking Database has logged roughly 4,390 incidents since 1993, with around 10% confirmed as trafficking or malicious use; over 250 thefts of radioactive sources in the last decade, of which about a third were never recovered; and in the last decade about 65% of reported thefts occurred during authorised transport. The database is voluntary-reporting, so these are floors, not counts. Transport is the weak link — model it that way.

- The RDD consensus, stated plainly and worth building the whole domain around: a radiological dispersal device is a weapon of economic and psychological disruption, not of mass casualties. Levi and Kelly's 2002 work (Scientific American, 'Weapons of Mass Disruption'; Senate Foreign Relations testimony, 6 March 2002) established the framing. Rosoff and von Winterfeldt's 2007 Risk Analysis study of an RDD at the ports of Los Angeles and Long Beach put attack success probability at roughly 10-40%, confined high doses to a relatively small area, estimated health effects at tens to at most hundreds of latent cancers even with a major release — and estimated economic consequences in the tens of billions of dollars, dominated by port shutdown and decontamination rather than by harm to people.

- Decontamination is an unbounded-cost variable because the stopping rule is not defined in advance. EPA Protective Action Guides cover the early and intermediate phases but explicitly do not set cleanup levels; the PAG Manual instead recommends a community involvement process to set them after the fact. That means the 'how clean is clean' negotiation is a live scenario mechanic: every increment of additional cleanliness costs money and delay, no number is legally fixed, and the affected public's number and the responder's number will differ.

- Goiania supplies the empirical ratios for a contamination response: roughly 112,000 people monitored against 249 actually contaminated (about 450:1), 129 with internal contamination, 20 hospitalised, 4 deaths. Cleanup produced about 3,500 cubic metres of waste from a single source, requiring on the order of 3,800 drums, 1,400 metal boxes, 10 shipping containers and 6 concrete packages; 85 houses significantly contaminated, 7 demolished, 41 evacuated. Screening capacity, not medical capacity, is the binding constraint in the first week.

- Stigma is a separate consequence variable from contamination and behaves differently. After Goiania, wholesale agricultural prices across the state of Goias fell around 50% and textiles around 40% — for goods produced outside the contaminated area, which could not have been affected. Model reputational/economic damage as a function of media salience and public trust, decoupled from the physical contamination map, with its own decay curve. A player can reduce contamination to zero and still lose the regional economy.

- Time-to-recognition is the highest-leverage variable in accidental radiological scenarios and it is consistently poor: 16 days at Goiania (misdiagnosed as a contagious tropical illness), roughly 3 weeks at Lia, about 6 weeks at Ciudad Juarez (found only because a truck took a wrong turn past a portal monitor at Los Alamos), and 9-15 days between loss and notification in Western Australia 2023. Detection is almost always incidental. Give players the option to invest in detection infrastructure before the scenario, and make it the highest-return prevention spend.

- Recovery operations run on an explicit dose budget, which converts neatly into a resource-allocation mechanic. At Lia the recovery team of about 25 people worked in rotations of roughly 40 seconds each. Players should have to spend a finite pool of person-exposures to achieve recovery, with the option to accept higher individual doses for speed — the real tradeoff, and one that can be depicted honestly without any technical uplift.

- Absolute content boundary for this domain: nothing in the game should describe how a source is opened, dispersed, concealed, coupled to an explosive, or shielded from detection; nothing should relate activity or isotope to dispersal effectiveness; and nothing should relate nuclear device parameters, burst geometry, or altitude to pulse magnitude. The historically interesting material is entirely on the other side of that line — detection lag, attribution uncertainty, screening surge, stigma economics, cleanup standards, evidence quality, and the politics of acting on contested numbers — and that is also where the actual decision dilemmas live.
