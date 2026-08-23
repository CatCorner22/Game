import { BRIEFING_PAGES, GLOSSARY } from "@/lib/game/copy";
import { useGame } from "@/lib/game/store";

export function Briefing() {
  const page = useGame((state) => state.briefingPage);
  const setPage = useGame((state) => state.setBriefingPage);
  const setScreen = useGame((state) => state.setScreen);
  const glossaryOpen = useGame((state) => state.glossaryOpen);
  const toggleGlossary = useGame((state) => state.toggleGlossary);
  const current = BRIEFING_PAGES[page]!;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
      <button
        type="button"
        onClick={() => setScreen("title")}
        className="min-h-12 self-start rounded-md bg-elevated px-4 font-display text-sm tracking-[0.2em] text-muted uppercase"
      >
        Back
      </button>

      {page === 0 ? (
        <aside className="mt-6 rounded-lg border border-accent/25 bg-surface p-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">Content and safety note</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            THRESHOLD explores mass-harm crises, institutional failure, and humanitarian consequences through abstract, non-graphic mechanics. It does not model real operational weapon, agent, targeting, or trigger procedures. Recommended audience: 16+.
          </p>
        </aside>
      ) : null}

      <p className="mt-8 font-mono text-xs tracking-[0.28em] text-accent uppercase">{current.kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-wide text-fg sm:text-5xl">{current.title}</h1>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted">
        {current.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="min-h-12 rounded-md px-4 font-display tracking-[0.16em] text-fg uppercase shadow-[var(--shadow-border)] disabled:opacity-30"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={page === BRIEFING_PAGES.length - 1}
          onClick={() => setPage(page + 1)}
          className="min-h-12 rounded-md bg-accent px-4 font-display tracking-[0.16em] text-accent-fg uppercase disabled:opacity-30"
        >
          Next
        </button>
        <button
          type="button"
          onClick={toggleGlossary}
          className="min-h-12 rounded-md bg-elevated px-4 font-display tracking-[0.16em] text-muted uppercase"
        >
          Glossary
        </button>
      </div>
      {glossaryOpen ? (
        <dl className="mt-10 space-y-5 border-t border-border pt-8">
          {GLOSSARY.map((item) => (
            <div key={item.term}>
              <dt className="font-display tracking-[0.12em] text-fg uppercase">{item.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{item.def}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
