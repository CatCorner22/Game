/**
 * The first watch, explained.
 *
 * These six steps replace three that were written before decision cards, the
 * advisor conference, the wall clock, command posts and mandates existed — a
 * tutorial that taught a third of the game.
 *
 * They also replace a tutorial that most players never saw. The gate used to
 * require `!world.scenarioId`, so **picking any scenario turned the tutorial off
 * entirely** — and scenarios are the front door: the briefs are written to make
 * you want one, and the Archive rewards finishing them. The sandbox, which
 * nobody picks first, was the only path that taught anything at all.
 *
 * Data and predicate live here rather than in the component so the integrity
 * suite can assert the gate without rendering React.
 */
export interface TutorialStep {
  title: string;
  body: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "This is an evening, not a menu",
    body: "Something has happened and nobody in the room knows yet what it is. Your brief separates what is confirmed from what is not. Reading that difference is the whole game.",
  },
  {
    title: "Pick who, then pick what",
    body: "Choose an actor on the globe or in the file list — the event's actor is already selected. Then choose a kind of action. HOLD is one of them, and it is a decision rather than a skip.",
  },
  {
    title: "The forecast is a dry run",
    body: "It runs the same simulation twice at two different luck values and shows you the spread. It is not a promise. A wide spread means the outcome is not yours to control.",
  },
  {
    title: "Convene the room",
    body: "Advisors opens the conference. Climbing its rungs adds people and buys you confidence, and it costs you clock and signature — which the other side can see. That trade is the mechanic, not decoration.",
  },
  {
    title: "The clock is real",
    body: "During a close call a countdown runs in wall time. Inside a conference it binds: let it lapse and the decision resolves to the doctrinal pass, holding for a second sensor. That costs you initiative, never the game outright.",
  },
  {
    title: "You have a mandate",
    body: "Every watch names one thing that wins it and one that loses it, up front, under Objectives. There is no turn limit. A watch ends when a mandate resolves, or when a catastrophe resolves it for you.",
  },
];

/** Whether the first-watch tutorial should be on screen. Pure. */
export function shouldShowTutorial(
  world: { turn: number } | null | undefined,
  tutorialDone: boolean,
  step: number,
): boolean {
  if (!world) return false;
  if (world.turn !== 1) return false;
  if (tutorialDone) return false;
  return step >= 0 && step < TUTORIAL_STEPS.length;
}
