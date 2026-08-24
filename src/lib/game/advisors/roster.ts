import type { PlayableId, World } from "../types";
import { COMMAND } from "../command";

/**
 * The people on the call.
 *
 * Every advisor here is fictional. Real officeholders are not put in the room
 * and not given words, which is the whole reason the names are invented: the
 * roles, the ranks and the institutional positions are real, the individuals
 * are not.
 *
 * Two things about ages. They are stored directly rather than as birth years,
 * because eight scenarios reset `world.year` as far back as 1962 and a modern
 * birth year would make every advisor unborn in the Cuban missile crisis. Age
 * drifts off elapsed turns instead, which is correct in any era. And they are
 * bounded 45-67 by an integrity check, because that is the band serving flag
 * officers and cabinet-level civilians actually occupy -- US statutory
 * retirement for flag officers is 64, and a serving four-star service chief is
 * typically 55 to 60.
 *
 * Personality is only half-authored. Each advisor carries a `hawkBase` for
 * their branch -- an intelligence chief hedges, a strategic forces commander
 * does not -- and `hawkishness()` then shifts it by the seat's own doctrinal
 * temperament, which already exists in `CommandProfile.eager` and `.refusal`.
 * A North Korean roster comes out hawkish and a British one restrained without
 * anyone hand-tuning eighty characters.
 */
export type AdvisorBranch =
  | "ground"
  | "air"
  | "sea"
  | "strategic"
  | "intel"
  | "civilian"
  | "diplomatic"
  | "legal"
  | "watch";

/** Which rung of the warning conference ladder brings this person onto the call. */
export type ConferenceRung = 1 | 2 | 3;

export interface Advisor {
  id: string;
  seat: PlayableId;
  name: string;
  /** Rank or honorific, e.g. "General, USMC". */
  rank: string;
  /** The chair they occupy. */
  role: string;
  branch: AdvisorBranch;
  /** Age at the opening turn. Bounded 45-67. */
  age: number;
  /** Branch disposition toward force, before the seat's temperament is applied. */
  hawkBase: number;
  /** 0-100. Willingness to tell the principal something unwelcome. */
  candor: number;
  /** 0-100. How much they speak for their institution rather than for you. */
  institutional: number;
  rung: ConferenceRung;
  /** One line of voice, used for scripted tone and as LLM character guidance. */
  voice: string;
}

const R: Record<PlayableId, Advisor[]> = {
  US: [
    {
      id: "US:nmcc",
      seat: "US",
      name: "Colonel Dana Reyes",
      rank: "Colonel, USAF",
      role: "Senior duty officer, National Military Command Center",
      branch: "watch",
      age: 47,
      hawkBase: 40,
      candor: 82,
      institutional: 60,
      rung: 1,
      voice: "Reads the board and nothing else. Will not characterise what she cannot source.",
    },
    {
      id: "US:norad",
      seat: "US",
      name: "Brigadier General Sam Okonkwo",
      rank: "Brigadier General, USSF",
      role: "Deputy director of operations, missile warning",
      branch: "watch",
      age: 51,
      hawkBase: 44,
      candor: 78,
      institutional: 65,
      rung: 1,
      voice: "Talks in phenomenology and confidence intervals. Hates the word 'probably'.",
    },
    {
      id: "US:stratcom",
      seat: "US",
      name: "Admiral Ruth Vance",
      rank: "Admiral, USN",
      role: "Commander, Strategic Command",
      branch: "strategic",
      age: 59,
      hawkBase: 66,
      candor: 74,
      institutional: 80,
      rung: 2,
      voice: "Will state exactly how much time you have left and what it buys. Does not editorialise.",
    },
    {
      id: "US:cjcs",
      seat: "US",
      name: "General Marcus Hale",
      rank: "General, USA",
      role: "Chairman of the Joint Chiefs of Staff",
      branch: "ground",
      age: 61,
      hawkBase: 55,
      candor: 80,
      institutional: 78,
      rung: 2,
      voice: "Adviser, not commander, and says so when someone forgets it.",
    },
    {
      id: "US:usmc",
      seat: "US",
      name: "General Alicia Bourne",
      rank: "General, USMC",
      role: "Commandant of the Marine Corps",
      branch: "ground",
      age: 56,
      hawkBase: 60,
      candor: 86,
      institutional: 72,
      rung: 2,
      voice: "Blunt, forces-first, and the person most likely to say the quiet objection out loud.",
    },
    {
      id: "US:dni",
      seat: "US",
      name: "Eleanor Whitcomb",
      rank: "Director of National Intelligence",
      role: "Director of National Intelligence",
      branch: "intel",
      age: 63,
      hawkBase: 30,
      candor: 88,
      institutional: 58,
      rung: 2,
      voice: "Distinguishes what is collected from what is assessed, every time, even under a clock.",
    },
    {
      id: "US:secdef",
      seat: "US",
      name: "Secretary Owen Marsh",
      rank: "Secretary of Defense",
      role: "Secretary of Defense",
      branch: "civilian",
      age: 60,
      hawkBase: 48,
      candor: 76,
      institutional: 70,
      rung: 3,
      voice: "Authenticates that the order is yours. Will remind the room that this is not consent.",
    },
    {
      id: "US:secstate",
      seat: "US",
      name: "Secretary Priya Raghavan",
      rank: "Secretary of State",
      role: "Secretary of State",
      branch: "diplomatic",
      age: 57,
      hawkBase: 22,
      candor: 80,
      institutional: 62,
      rung: 3,
      voice: "Wants a channel open before anything else happens, and will name what closing it costs.",
    },
    {
      id: "US:counsel",
      seat: "US",
      name: "Judge Advocate General Tomas Bright",
      rank: "Vice Admiral, USN (JAG)",
      role: "Legal adviser to the National Command Authority",
      branch: "legal",
      age: 54,
      hawkBase: 18,
      candor: 84,
      institutional: 66,
      rung: 3,
      voice: "Cares about distinction, proportionality and whether the order is lawful. Says it in one sentence.",
    },
  ],

  RU: [
    { id: "RU:ew", seat: "RU", name: "Colonel Ivan Terekhin", rank: "Colonel", role: "Duty officer, early-warning centre", branch: "watch", age: 48, hawkBase: 42, candor: 70, institutional: 62, rung: 1, voice: "Reports the satellite picture flatly, including when it disagrees with the radar." },
    { id: "RU:radar", seat: "RU", name: "Colonel Yelena Baranova", rank: "Colonel", role: "Voronezh radar network watch", branch: "watch", age: 50, hawkBase: 40, candor: 76, institutional: 60, rung: 1, voice: "Ground radar first. Distrusts anything infrared has not been corroborated by." },
    { id: "RU:rvsn", seat: "RU", name: "Colonel General Pyotr Sorokin", rank: "Colonel General", role: "Commander, Strategic Rocket Forces", branch: "strategic", age: 60, hawkBase: 70, candor: 62, institutional: 84, rung: 2, voice: "Speaks in readiness states and windows. Believes hesitation is the actual risk." },
    { id: "RU:gs", seat: "RU", name: "General Arkady Voloshin", rank: "General of the Army", role: "Chief of the General Staff", branch: "ground", age: 62, hawkBase: 58, candor: 66, institutional: 82, rung: 2, voice: "Institutional to the bone. Frames everything as what the General Staff can and cannot answer for." },
    { id: "RU:svr", seat: "RU", name: "Nadezhda Kuznetsova", rank: "Director", role: "Foreign intelligence service director", branch: "intel", age: 58, hawkBase: 34, candor: 64, institutional: 56, rung: 2, voice: "Hedges deliberately, and is the only person here who will say the source is thin." },
    { id: "RU:mod", seat: "RU", name: "Minister Sergey Ilyin", rank: "Minister of Defense", role: "Minister of Defense", branch: "civilian", age: 61, hawkBase: 56, candor: 58, institutional: 74, rung: 3, voice: "Holds the second briefcase. Will say whether the chain is with you." },
    { id: "RU:mfa", seat: "RU", name: "Minister Galina Rozhkova", rank: "Foreign Minister", role: "Foreign Minister", branch: "diplomatic", age: 59, hawkBase: 26, candor: 68, institutional: 60, rung: 3, voice: "Thinks about what the other capital believes right now, not what is true." },
  ],

  CN: [
    { id: "CN:ew", seat: "CN", name: "Senior Colonel Lin Zhaoyu", rank: "Senior Colonel", role: "Early-warning duty officer", branch: "watch", age: 47, hawkBase: 38, candor: 68, institutional: 66, rung: 1, voice: "Careful, procedural, unwilling to characterise a return beyond what it is." },
    { id: "CN:radar", seat: "CN", name: "Senior Colonel Xu Meilin", rank: "Senior Colonel", role: "Phased-array radar watch", branch: "watch", age: 49, hawkBase: 40, candor: 72, institutional: 64, rung: 1, voice: "Ground truth first. Says plainly when the satellite picture is alone." },
    { id: "CN:rocket", seat: "CN", name: "General Zhou Hanwen", rank: "General", role: "Commander, PLA Rocket Force", branch: "strategic", age: 58, hawkBase: 62, candor: 66, institutional: 82, rung: 2, voice: "Frames everything as survivability of the force under no-first-use." },
    { id: "CN:joint", seat: "CN", name: "General Fang Ruilan", rank: "General", role: "Joint Staff Department, operations", branch: "air", age: 57, hawkBase: 54, candor: 70, institutional: 80, rung: 2, voice: "Runs the joint picture. Impatient with anyone who confuses an indicator with a decision." },
    { id: "CN:msu", seat: "CN", name: "Director Cheng Yuwei", rank: "Director", role: "Strategic intelligence directorate", branch: "intel", age: 55, hawkBase: 32, candor: 74, institutional: 60, rung: 2, voice: "Separates collection from assessment and refuses to be hurried past the gap." },
    { id: "CN:cmc", seat: "CN", name: "Vice Chairman Guo Weimin", rank: "Vice Chairman, CMC", role: "Vice Chairman, Central Military Commission", branch: "civilian", age: 64, hawkBase: 50, candor: 60, institutional: 78, rung: 3, voice: "Speaks for the Commission. Nothing is decided until the Commission has decided it." },
    { id: "CN:mfa", seat: "CN", name: "Minister Han Xiuying", rank: "Foreign Minister", role: "Foreign Minister", branch: "diplomatic", age: 60, hawkBase: 24, candor: 66, institutional: 62, rung: 3, voice: "Guards the no-first-use position as a strategic asset, not a slogan." },
  ],

  UK: [
    { id: "UK:fylingdales", seat: "UK", name: "Wing Commander Hazel Pryce", rank: "Wing Commander, RAF", role: "Fylingdales duty officer", branch: "watch", age: 46, hawkBase: 36, candor: 84, institutional: 58, rung: 1, voice: "Understated to a fault. Will not inflate a return to be helpful." },
    { id: "UK:pjhq", seat: "UK", name: "Commodore Alan Ferris", rank: "Commodore, RN", role: "Duty commodore, Permanent Joint Headquarters", branch: "sea", age: 52, hawkBase: 44, candor: 80, institutional: 66, rung: 1, voice: "Runs the operational picture and keeps the deterrent chain separate from it." },
    { id: "UK:cds", seat: "UK", name: "Air Chief Marshal Rosalind Kerr", rank: "Air Chief Marshal, RAF", role: "Chief of the Defence Staff", branch: "air", age: 60, hawkBase: 50, candor: 82, institutional: 74, rung: 2, voice: "Professionally sceptical. Asks what changed since the last assessment." },
    { id: "UK:casd", seat: "UK", name: "Rear Admiral Gordon Blayne", rank: "Rear Admiral, RN", role: "Continuous at-sea deterrent, operational authority", branch: "strategic", age: 55, hawkBase: 58, candor: 76, institutional: 82, rung: 2, voice: "The boat is already where it needs to be. That is his entire point, repeatedly." },
    { id: "UK:jic", seat: "UK", name: "Dame Freya Lockhart", rank: "Chair, Joint Intelligence Committee", role: "Chair, Joint Intelligence Committee", branch: "intel", age: 62, hawkBase: 26, candor: 88, institutional: 56, rung: 2, voice: "Assesses with explicit confidence language and refuses to drop it under pressure." },
    { id: "UK:defsec", seat: "UK", name: "Secretary of State Nadia Okoro", rank: "Secretary of State for Defence", role: "Secretary of State for Defence", branch: "civilian", age: 54, hawkBase: 44, candor: 74, institutional: 66, rung: 3, voice: "Politically literate, and the person who will raise Cabinet and the Commons." },
    { id: "UK:fco", seat: "UK", name: "Foreign Secretary Hugh Amarant", rank: "Foreign Secretary", role: "Foreign Secretary", branch: "diplomatic", age: 58, hawkBase: 22, candor: 72, institutional: 60, rung: 3, voice: "Thinks in alliances. Will ask what Washington and Paris are seeing before anything else." },
  ],

  FR: [
    { id: "FR:graves", seat: "FR", name: "Colonel Émile Rousset", rank: "Colonel, Armée de l'air", role: "Space surveillance duty officer", branch: "watch", age: 47, hawkBase: 38, candor: 76, institutional: 58, rung: 1, voice: "Precise about what French sensors hold versus what the alliance feed provides." },
    { id: "FR:cnoa", seat: "FR", name: "Général de brigade Claire Vasseur", rank: "Général de brigade", role: "Air operations centre, Mont Verdun", branch: "air", age: 51, hawkBase: 46, candor: 78, institutional: 64, rung: 1, voice: "Air picture first. Will not let a fused track pass as an independent one." },
    { id: "FR:cema", seat: "FR", name: "Général Bertrand Lacaze", rank: "Général d'armée", role: "Chief of the Defence Staff", branch: "ground", age: 61, hawkBase: 52, candor: 74, institutional: 76, rung: 2, voice: "Strategic autonomy is his frame for everything, including who to believe." },
    { id: "FR:fost", seat: "FR", name: "Vice-amiral Sylvie Marchand", rank: "Vice-amiral d'escadre", role: "Strategic oceanic force commander", branch: "strategic", age: 56, hawkBase: 60, candor: 72, institutional: 80, rung: 2, voice: "Speaks only about the deterrent posture and only when it is relevant." },
    { id: "FR:dgse", seat: "FR", name: "Directeur Yann Perreau", rank: "Director General", role: "External intelligence director", branch: "intel", age: 58, hawkBase: 30, candor: 76, institutional: 58, rung: 2, voice: "Sceptical of allied product he has not independently corroborated." },
    { id: "FR:armees", seat: "FR", name: "Ministre Isabelle Fournier", rank: "Minister for the Armed Forces", role: "Minister for the Armed Forces", branch: "civilian", age: 55, hawkBase: 42, candor: 72, institutional: 66, rung: 3, voice: "Reminds the room that the decision is the President's alone, and means it as a caution." },
  ],

  IN: [
    { id: "IN:radar", seat: "IN", name: "Air Commodore Vikram Sethi", rank: "Air Commodore, IAF", role: "Integrated air defence watch", branch: "watch", age: 48, hawkBase: 42, candor: 76, institutional: 60, rung: 1, voice: "Short flight times are his first sentence, every time." },
    { id: "IN:sfc-duty", seat: "IN", name: "Brigadier Anjali Rao", rank: "Brigadier", role: "Strategic Forces Command duty officer", branch: "watch", age: 49, hawkBase: 46, candor: 74, institutional: 68, rung: 1, voice: "Custody and readiness. Precise about what is and is not mated." },
    { id: "IN:cds", seat: "IN", name: "General Harpreet Singh Bal", rank: "General", role: "Chief of Defence Staff", branch: "ground", age: 61, hawkBase: 54, candor: 76, institutional: 78, rung: 2, voice: "Holds the no-first-use line as doctrine and asks what would break it." },
    { id: "IN:sfc", seat: "IN", name: "Air Marshal Devika Menon", rank: "Air Marshal, IAF", role: "Commander-in-Chief, Strategic Forces Command", branch: "strategic", age: 57, hawkBase: 62, candor: 70, institutional: 80, rung: 2, voice: "Second-strike survivability is the only metric she argues from." },
    { id: "IN:raw", seat: "IN", name: "Secretary Nikhil Bose", rank: "Secretary (R)", role: "External intelligence secretary", branch: "intel", age: 59, hawkBase: 34, candor: 74, institutional: 56, rung: 2, voice: "Careful about attribution across a border where deniability is the point." },
    { id: "IN:nsa", seat: "IN", name: "National Security Adviser Latika Varma", rank: "National Security Adviser", role: "National Security Adviser", branch: "civilian", age: 63, hawkBase: 44, candor: 78, institutional: 62, rung: 3, voice: "Runs the room. Will state the political consequence before the military one." },
  ],

  PK: [
    { id: "PK:paf", seat: "PK", name: "Air Commodore Faraz Siddiqui", rank: "Air Commodore, PAF", role: "Air defence sector watch", branch: "watch", age: 47, hawkBase: 46, candor: 70, institutional: 62, rung: 1, voice: "Counts minutes out loud. There are very few of them on this border." },
    { id: "PK:spd-duty", seat: "PK", name: "Brigadier Sana Qureshi", rank: "Brigadier", role: "Strategic Plans Division, duty", branch: "watch", age: 50, hawkBase: 52, candor: 68, institutional: 74, rung: 1, voice: "Custody, dispersal, and who currently holds what. Nothing else." },
    { id: "PK:corps", seat: "PK", name: "Lieutenant General Asif Durrani", rank: "Lieutenant General", role: "Corps commander, forward sector", branch: "ground", age: 58, hawkBase: 66, candor: 62, institutional: 80, rung: 2, voice: "Use-it-or-lose-it is not a phrase he uses, but it is the shape of his argument." },
    { id: "PK:spd", seat: "PK", name: "Lieutenant General Mahnoor Abbasi", rank: "Lieutenant General", role: "Director General, Strategic Plans Division", branch: "strategic", age: 59, hawkBase: 60, candor: 66, institutional: 84, rung: 2, voice: "Owns the whole chain and knows exactly how thin the two-man rule gets under dispersal." },
    { id: "PK:isi", seat: "PK", name: "Director General Kamran Shah", rank: "Director General", role: "Inter-services intelligence director", branch: "intel", age: 56, hawkBase: 44, candor: 58, institutional: 70, rung: 2, voice: "Speaks in deniability. Rarely says everything he knows." },
    { id: "PK:nca", seat: "PK", name: "Foreign Minister Rukhsana Malik", rank: "Foreign Minister", role: "Foreign Minister, National Command Authority", branch: "diplomatic", age: 57, hawkBase: 30, candor: 72, institutional: 60, rung: 3, voice: "The DGMO hotline is her first instrument and she reaches for it early." },
  ],

  IL: [
    { id: "IL:greenpine", seat: "IL", name: "Colonel Noa Ben-Ari", rank: "Colonel, IAF", role: "Air and missile defence watch", branch: "watch", age: 46, hawkBase: 48, candor: 80, institutional: 60, rung: 1, voice: "Interceptor inventory and time-to-intercept. Numbers, not adjectives." },
    { id: "IL:aman-duty", seat: "IL", name: "Colonel Eitan Halevi", rank: "Colonel", role: "Military intelligence duty officer", branch: "watch", age: 49, hawkBase: 42, candor: 82, institutional: 58, rung: 1, voice: "Trained on the failure of assessment, not the failure of collection." },
    { id: "IL:chief", seat: "IL", name: "Lieutenant General Yael Stern", rank: "Lieutenant General", role: "Chief of the General Staff", branch: "ground", age: 57, hawkBase: 62, candor: 80, institutional: 76, rung: 2, voice: "Direct to the point of abrasive. Would rather be wrong out loud than late." },
    { id: "IL:aman", seat: "IL", name: "Major General Dov Reznik", rank: "Major General", role: "Director of Military Intelligence", branch: "intel", age: 55, hawkBase: 40, candor: 86, institutional: 62, rung: 2, voice: "Names the alternative explanation before he names his own assessment." },
    { id: "IL:mod", seat: "IL", name: "Minister Tamar Golani", rank: "Minister of Defense", role: "Minister of Defense", branch: "civilian", age: 60, hawkBase: 54, candor: 72, institutional: 68, rung: 3, voice: "Weighs opacity against the value of saying something out loud, and usually keeps quiet." },
  ],

  KP: [
    { id: "KP:ew", seat: "KP", name: "Colonel Ri Chol-min", rank: "Colonel", role: "Early-warning desk", branch: "watch", age: 46, hawkBase: 52, candor: 44, institutional: 66, rung: 1, voice: "Reports what he believes is expected, and only then what he sees." },
    { id: "KP:battery", seat: "KP", name: "Colonel Kim Yong-hui", rank: "Colonel", role: "Missile brigade duty officer", branch: "watch", age: 48, hawkBase: 64, candor: 40, institutional: 72, rung: 1, voice: "Readiness posture, immediately and enthusiastically." },
    { id: "KP:strategic", seat: "KP", name: "General Pak Song-il", rank: "General", role: "Commander, strategic force", branch: "strategic", age: 58, hawkBase: 78, candor: 38, institutional: 80, rung: 2, voice: "Believes a strike against command is the only thing worth pre-empting." },
    { id: "KP:gs", seat: "KP", name: "Vice Marshal Choe Un-ryong", rank: "Vice Marshal", role: "Chief of the General Staff", branch: "ground", age: 63, hawkBase: 70, candor: 36, institutional: 84, rung: 2, voice: "Agrees with the Supreme Commander first and reasons backwards from there." },
    { id: "KP:rgb", seat: "KP", name: "Director Han Su-jin", rank: "Director", role: "Reconnaissance bureau director", branch: "intel", age: 54, hawkBase: 56, candor: 48, institutional: 68, rung: 2, voice: "The only person in the room who occasionally reports an inconvenient fact." },
    { id: "KP:party", seat: "KP", name: "Secretary O Kwang-chol", rank: "Party Secretary", role: "Party secretary for defence industry", branch: "civilian", age: 61, hawkBase: 60, candor: 34, institutional: 78, rung: 3, voice: "Speaks in loyalty and legacy. Never contradicts." },
  ],

  IR: [
    { id: "IR:air", seat: "IR", name: "Brigadier General Reza Mostafavi", rank: "Brigadier General, IRIADF", role: "Air defence sector watch", branch: "watch", age: 47, hawkBase: 50, candor: 62, institutional: 64, rung: 1, voice: "Assumes hostile intent until the geometry says otherwise." },
    { id: "IR:aero", seat: "IR", name: "Colonel Sepideh Naderi", rank: "Colonel, IRGC Aerospace", role: "Aerospace force duty officer", branch: "watch", age: 49, hawkBase: 58, candor: 58, institutional: 70, rung: 1, voice: "Dispersal status, launch readiness, and how long either takes." },
    { id: "IR:irgc", seat: "IR", name: "Major General Bahram Shirazi", rank: "Major General", role: "IRGC commander", branch: "strategic", age: 59, hawkBase: 72, candor: 54, institutional: 82, rung: 2, voice: "Frames restraint as an invitation. The Guard's prerogatives are never far from his argument." },
    { id: "IR:artesh", seat: "IR", name: "Major General Firouz Ansari", rank: "Major General, Artesh", role: "Chief of the armed forces general staff", branch: "ground", age: 62, hawkBase: 50, candor: 66, institutional: 74, rung: 2, voice: "Regular army, and quietly resentful of how little of this he controls." },
    { id: "IR:intel", seat: "IR", name: "Deputy Minister Shirin Kazemi", rank: "Deputy Minister", role: "Intelligence ministry, assessments", branch: "intel", age: 55, hawkBase: 36, candor: 70, institutional: 58, rung: 2, voice: "Will say the words 'we do not know', which almost nobody else here will." },
    { id: "IR:council", seat: "IR", name: "Secretary Javad Amini", rank: "Secretary", role: "Supreme National Security Council secretary", branch: "civilian", age: 64, hawkBase: 44, candor: 60, institutional: 70, rung: 3, voice: "Manages the Council's consensus and the Leader's deniability at the same time." },
  ],

  SU: [
    { id: "SU:ew", seat: "SU", name: "Colonel Vadim Ostrovsky", rank: "Colonel", role: "Claimed early-warning watch", branch: "watch", age: 50, hawkBase: 46, candor: 66, institutional: 58, rung: 1, voice: "Reports feeds he is not certain still answer to him." },
    { id: "SU:minsk", seat: "SU", name: "Colonel Alina Zhurova", rank: "Colonel", role: "Minsk duty officer", branch: "watch", age: 47, hawkBase: 48, candor: 70, institutional: 56, rung: 1, voice: "Keeps an inventory of which garrisons have actually acknowledged." },
    { id: "SU:rvsn", seat: "SU", name: "Lieutenant General Yuri Pavlenko", rank: "Lieutenant General", role: "Claimant commander, rocket forces", branch: "strategic", age: 58, hawkBase: 68, candor: 58, institutional: 76, rung: 2, voice: "Insists the silos are his. He has not been able to prove it to anyone." },
    { id: "SU:gs", seat: "SU", name: "General Konstantin Belov", rank: "General", role: "General Staff (restorationist)", branch: "ground", age: 63, hawkBase: 60, candor: 54, institutional: 80, rung: 2, voice: "Legitimacy first, and every argument routes back through it." },
    { id: "SU:mod", seat: "SU", name: "Minister Larisa Dobrynina", rank: "Minister of Defense (USSR)", role: "Minister of Defense", branch: "civilian", age: 59, hawkBase: 56, candor: 56, institutional: 72, rung: 3, voice: "Holds a briefcase that may or may not open anything." },
  ],

  CU: [
    { id: "CU:airdef", seat: "CU", name: "Colonel Marisol Espinosa", rank: "Colonel, FAR", role: "Air defence watch", branch: "watch", age: 48, hawkBase: 44, candor: 74, institutional: 60, rung: 1, voice: "Has no strategic depth to offer and says so plainly." },
    { id: "CU:mariel", seat: "CU", name: "Captain Ignacio Vega", rank: "Captain, FAR", role: "Port and coastal watch", branch: "watch", age: 46, hawkBase: 40, candor: 76, institutional: 56, rung: 1, voice: "Watches hulls and hatches. Knows what a foreign warhead in a friendly port looks like." },
    { id: "CU:far", seat: "CU", name: "Division General Rafael Cordero", rank: "Division General, FAR", role: "Chief of the armed forces", branch: "ground", age: 62, hawkBase: 52, candor: 70, institutional: 76, rung: 2, voice: "Remembers 1962 as a lesson about being someone else's forward position." },
    { id: "CU:intel", seat: "CU", name: "Director Yolanda Prieto", rank: "Director", role: "Intelligence directorate", branch: "intel", age: 55, hawkBase: 34, candor: 72, institutional: 58, rung: 2, voice: "Tracks what Moscow and Washington are each telling the other about Havana." },
    { id: "CU:council", seat: "CU", name: "Vice President Osmany Ferrer", rank: "Vice President", role: "Council of State", branch: "civilian", age: 60, hawkBase: 38, candor: 66, institutional: 68, rung: 3, voice: "Survival of the state is the argument. Everything else is instrumental." },
  ],

  CR: [
    { id: "CR:corridor", seat: "CR", name: "Tobías Arellano", rank: "Corridor boss", role: "Northern corridor", branch: "watch", age: 45, hawkBase: 58, candor: 60, institutional: 30, rung: 1, voice: "Talks about routes and payments. Does not pretend this is a government." },
    { id: "CR:port", seat: "CR", name: "Beatriz Salcedo", rank: "Port fixer", role: "Port and customs", branch: "watch", age: 47, hawkBase: 46, candor: 66, institutional: 28, rung: 1, voice: "Knows exactly which container is which and what it cost to move it." },
    { id: "CR:colonel", seat: "CR", name: "Colonel Nestor Ibarra", rank: "Colonel (on the ledger)", role: "Bought military liaison", branch: "ground", age: 54, hawkBase: 64, candor: 44, institutional: 40, rung: 2, voice: "Wears a uniform and answers to the payroll. Both facts matter." },
    { id: "CR:broker", seat: "CR", name: "Amadeo Rincón", rank: "Broker", role: "Weapons and finance broker", branch: "intel", age: 56, hawkBase: 52, candor: 54, institutional: 26, rung: 2, voice: "Prices everything, including the consequence of being caught holding a warhead." },
    { id: "CR:plaza", seat: "CR", name: "Doña Alba Quintero", rank: "Plaza boss", role: "Plaza leadership", branch: "civilian", age: 58, hawkBase: 56, candor: 58, institutional: 34, rung: 3, voice: "Understands leverage better than anyone here and deterrence not at all." },
  ],

  NS: [
    { id: "NS:courier", seat: "NS", name: "Idris Nabhan", rank: "Courier", role: "Movement and custody", branch: "watch", age: 45, hawkBase: 54, candor: 58, institutional: 24, rung: 1, voice: "Knows where the device is right now, which is more than anyone else can say." },
    { id: "NS:engineer", seat: "NS", name: "Sabiha Rahmani", rank: "Engineer", role: "Device engineering", branch: "watch", age: 49, hawkBase: 40, candor: 74, institutional: 22, rung: 1, voice: "Technically honest about yield, reliability and what is still missing." },
    { id: "NS:facilitator", seat: "NS", name: "Waleed Al-Khoury", rank: "Facilitator", role: "Finance and procurement", branch: "intel", age: 53, hawkBase: 46, candor: 60, institutional: 26, rung: 2, voice: "Thinks in supply chains and which of them are currently being watched." },
    { id: "NS:military", seat: "NS", name: "Commander Yusuf Barzan", rank: "Commander", role: "Armed wing", branch: "ground", age: 51, hawkBase: 74, candor: 48, institutional: 34, rung: 2, voice: "Wants the device used while it still exists. That is his entire position." },
    { id: "NS:emir", seat: "NS", name: "Emir Hakim Al-Rashad", rank: "Emir", role: "Movement leadership", branch: "civilian", age: 57, hawkBase: 66, candor: 50, institutional: 30, rung: 3, voice: "Speaks in destiny and grievance. There is nobody above him to refuse the order." },
  ],
};

export function rosterFor(seat: PlayableId): Advisor[] {
  return R[seat] ?? R.US;
}

export function advisorById(id: string): Advisor | null {
  for (const list of Object.values(R)) {
    const found = list.find((a) => a.id === id);
    if (found) return found;
  }
  return null;
}

/**
 * Effective hawkishness: the branch's disposition, shifted by the seat's own
 * doctrinal temperament. `CommandProfile.eager` and `.refusal` already encode
 * how readily a given command culture reaches for force, so this is derived
 * rather than authored eighty times.
 */
export function hawkishness(advisor: Advisor): number {
  const c = COMMAND[advisor.seat];
  if (!c) return advisor.hawkBase;
  const temper = (c.eager - c.refusal) * 40;
  return Math.max(0, Math.min(100, Math.round(advisor.hawkBase + temper)));
}

/**
 * Age at the current turn. Deliberately derived from elapsed turns rather than
 * `world.year`: eight scenarios reset the year as far back as 1962, and a
 * birth-year model would have every advisor unborn in half the campaign.
 */
export function ageOf(advisor: Advisor, world: World): number {
  return advisor.age + Math.floor(Math.max(0, world.turn - 1) / 12);
}

/** Initials for the participant tile. */
export function initialsOf(advisor: Advisor): string {
  const parts = advisor.name.split(/\s+/).filter((w) => !/^(Mr\.|Ms\.|Dame|Doña)$/i.test(w));
  const last = parts[parts.length - 1] ?? advisor.name;
  const first = parts.find((w) => /^[A-ZÀ-Ý]/.test(w) && w !== last) ?? last;
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}
