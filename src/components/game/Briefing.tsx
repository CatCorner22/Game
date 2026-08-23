import { BRIEFING_PAGES, GLOSSARY } from "@/lib/game/copy";
import { useGame } from "@/lib/game/store";
import { GlassPanel, HudButton, HudChip, HudLabel } from "./ui/Hud";

export function Briefing() {
  const page = useGame((s) => s.briefingPage);
  const setPage = useGame((s) => s.setBriefingPage);
  const setScreen = useGame((s) => s.setScreen);
  const glossaryOpen = useGame((s) => s.glossaryOpen);
  const toggleGlossary = useGame((s) => s.toggleGlossary);
  const p = BRIEFING_PAGES[page]!;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 py-8 sm:py-12">
      <HudButton variant="ghost" className="self-start text-sm uppercase" onClick={() => setScreen("title")}>
        Back
      </HudButton>
      <HudChip active className="mt-8">
        {p.kicker}
      </HudChip>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-wide text-glow-accent text-fg sm:text-5xl">
        {p.title}
      </h1>
      <GlassPanel glow="accent" className="mt-8 rounded-xl p-6">
        <div className="space-y-4 text-base leading-relaxed text-muted">
          {p.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </GlassPanel>
      <div className="mt-10 flex items-center gap-3">
        <HudButton variant="default" disabled={page === 0} className="min-h-11 px-4 uppercase" onClick={() => setPage(page - 1)}>
          Prev
        </HudButton>
        <HudButton
          variant="active"
          disabled={page === BRIEFING_PAGES.length - 1}
          className="min-h-11 px-4 uppercase"
          onClick={() => setPage(page + 1)}
        >
          Next
        </HudButton>
        <HudButton variant="ghost" className="min-h-11 px-3 uppercase" onClick={toggleGlossary}>
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
