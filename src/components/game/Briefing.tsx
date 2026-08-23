import { BRIEFING_PAGES, GLOSSARY } from "@/lib/game/copy";
import { useGame } from "@/lib/game/store";

export function Briefing() {
  const page = useGame((s) => s.briefingPage);
  const setPage = useGame((s) => s.setBriefingPage);
  const setScreen = useGame((s) => s.setScreen);
  const glossaryOpen = useGame((s) => s.glossaryOpen);
  const toggleGlossary = useGame((s) => s.toggleGlossary);
  const p = BRIEFING_PAGES[page]!;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 py-8 sm:py-12">
      <button
        onClick={() => setScreen("title")}
        className="self-start font-display text-sm tracking-[0.2em] text-muted uppercase"
      >
        Back
      </button>
      <p className="mt-8 font-mono text-xs tracking-[0.28em] text-accent uppercase">{p.kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-wide text-fg sm:text-5xl">
        {p.title}
      </h1>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted">
        {p.body.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
      <div className="mt-10 flex items-center gap-3">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="min-h-11 rounded-sm px-4 font-display tracking-[0.16em] text-fg uppercase shadow-[var(--shadow-border)] disabled:opacity-30"
        >
          Prev
        </button>
        <button
          disabled={page === BRIEFING_PAGES.length - 1}
          onClick={() => setPage(page + 1)}
          className="min-h-11 rounded-sm bg-accent px-4 font-display tracking-[0.16em] text-accent-fg uppercase disabled:opacity-30"
        >
          Next
        </button>
        <button
          onClick={toggleGlossary}
          className="min-h-11 px-3 font-display tracking-[0.16em] text-muted uppercase"
        >
          Glossary
        </button>
      </div>
      {glossaryOpen ? (
        <dl className="mt-10 space-y-5 border-t border-border pt-8">
          {GLOSSARY.map((g) => (
            <div key={g.term}>
              <dt className="font-display tracking-[0.12em] text-fg uppercase">{g.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{g.def}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
