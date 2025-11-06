import { Goal, SessionLength } from '../hooks/useAppStore';

interface TodayCardProps {
  name: string;
  goal: Goal;
  length: SessionLength;
  mood: number;
  microTip?: string;
  onStart: () => void;
}

export function TodayCard({ name, goal, length, mood, microTip, onStart }: TodayCardProps) {
  return (
    <section className="rounded-3xl bg-surface/80 p-8 shadow-lg backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Hi, {name} 👋</h1>
          <p className="mt-2 text-accentSoft">
            Today&apos;s {goal.toLowerCase()} session is {length} minutes. Mood check: {mood}/5.
          </p>
          {microTip && <p className="mt-2 text-sm text-accentSoft">Tip: {microTip}</p>}
        </div>
        <button
          onClick={onStart}
          className="rounded-full bg-accent px-6 py-3 text-base font-medium text-background transition hover:bg-accentSoft"
        >
          Start my {length}-min {goal}
        </button>
      </div>
    </section>
  );
}
