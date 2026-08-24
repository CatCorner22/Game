import { BRIEFING_PAGES, GLOSSARY } from "@/lib/game/copy";
import { useGame } from "@/lib/game/store";
import { GlassPanel, HudButton, HudChip, HudLabel } from "./ui/Hud";

export function Briefing() {
  const page = useGame((state) => state.briefingPage);
  const setPage = useGame((state) => state.setBriefingPage);
  const setScreen = useGame((state) => state.setScreen);
  const glossaryOpen = useGame((state) => state.glossaryOpen);
  const toggleGlossary = useGame((state) => state.toggleGlossary);
  const current = BRIEFING_PAGES[page]!;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
      <HudButton variant="ghost" className="min-h-12 self-start text-sm uppercase" onClick={() => setScreen("title")}>
        Back
      </HudButton>

      {page === 0 ? (
        <aside className="mt-6 rounded-lg border border-accent/25 bg-surface p-4">
          <p className="font-mono text-micro tracking-[0.22em] text-accent uppercase">Content and safety note</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            THRESHOLD explores mass-harm crises, institutional failure, and humanitarian consequences through abstract,
            non-graphic mechanics. It does not model real operational weapon, agent, targeting, or trigger procedures.
            Recommended audience: 16+.
          </p>
        </aside>
      ) : null}

      <HudChip active className="mt-8">
        {current.kicker}
      </HudChip>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-wide text-glow-accent text-fg sm:text-5xl">
        {current.title}
      </h1>
      <GlassPanel glow="accent" className="mt-8 rounded-xl p-6">
        <div className="space-y-4 text-base leading-relaxed text-muted">
          {current.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </GlassPanel>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <HudButton variant="default" disabled={page === 0} className="min-h-12 px-4 uppercase" onClick={() => setPage(page - 1)}>
          Prev
        </HudButton>
        <HudButton
          variant="active"
          disabled={page === BRIEFING_PAGES.length - 1}
          className="min-h-12 px-4 uppercase"
          onClick={() => setPage(page + 1)}
        >
          Next
        </HudButton>
        <HudButton variant="ghost" className="min-h-12 px-3 uppercase" onClick={toggleGlossary}>
          Glossary
        </HudButton>
      </div>
      {glossaryOpen ? (
        <GlassPanel className="mt-10 rounded-xl p-6">
          <HudLabel>Glossary</HudLabel>
          <dl className="mt-4 space-y-5">
            {GLOSSARY.map((g) => (
              <div key={g.term}>
                <dt className="font-display tracking-[0.12em] text-accent uppercase">{g.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{g.def}</dd>
              </div>
            ))}
          </dl>
        </GlassPanel>
      ) : null}
    </div>
  );
}
