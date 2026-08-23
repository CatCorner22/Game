import { Component, type ErrorInfo, type ReactNode } from "react";
import { resetToTitle } from "@/lib/game/store";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[THRESHOLD]", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
        <p className="font-mono text-xs tracking-wider text-danger uppercase">Watch fault</p>
        <h1 className="mt-3 font-display text-4xl text-fg">Command room exception</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{this.state.error.message}</p>
        <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-elevated p-3 font-mono text-[10px] text-subtle">
          {this.state.error.stack?.split("\n").slice(0, 8).join("\n")}
        </pre>
        <button
          type="button"
          onClick={() => {
            this.setState({ error: null });
            resetToTitle();
          }}
          className="mt-8 min-h-12 rounded-md bg-accent font-display tracking-wider text-accent-fg uppercase"
        >
          Return to title
        </button>
      </div>
    );
  }
}
