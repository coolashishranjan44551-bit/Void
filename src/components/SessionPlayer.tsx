import { BreathingTimer } from './BreathingTimer';

interface SessionPlayerProps {
  script: string;
  reflection: string;
  microTip: string;
  onFinish: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
  speechSupported: boolean;
}

export function SessionPlayer({
  script,
  reflection,
  microTip,
  onFinish,
  onTogglePlay,
  isPlaying,
  speechSupported,
}: SessionPlayerProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-surface/90 p-8 shadow-lg">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your guided session</h2>
        <button
          onClick={onTogglePlay}
          disabled={!speechSupported}
          className={`rounded-full border border-accent px-4 py-2 text-sm font-medium transition ${
            speechSupported
              ? 'text-accent hover:bg-accent/20'
              : 'cursor-not-allowed text-accent/40'
          }`}
        >
          {isPlaying ? 'Pause voice' : 'Play guidance'}
        </button>
      </header>
      {!speechSupported && (
        <p className="rounded-lg border border-accent/40 bg-background/40 p-3 text-sm text-accentSoft">
          Voice playback isn&apos;t supported in this browser. Read the script below to guide yourself.
        </p>
      )}
      <BreathingTimer />
      <article className="space-y-4 rounded-2xl bg-background/50 p-6 text-accentSoft">
        {script.split('. ').map((sentence, index) => (
          <p key={index} className="leading-relaxed text-base">
            {sentence.trim()}
            {sentence.trim().endsWith('.') ? '' : '.'}
          </p>
        ))}
      </article>
      <div className="rounded-2xl border border-accent/30 bg-background/40 p-4 text-sm text-accentSoft">
        <p className="font-semibold text-white">Reflection</p>
        <p className="mt-1">{reflection}</p>
        <p className="mt-3 text-xs uppercase tracking-wide text-accent">Micro-tip: {microTip}</p>
      </div>
      <button
        onClick={onFinish}
        className="self-start rounded-full bg-accent px-6 py-3 text-base font-medium text-background transition hover:bg-accentSoft"
      >
        I&apos;m done
      </button>
    </section>
  );
}
