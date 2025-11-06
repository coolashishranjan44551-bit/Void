interface StreakPillProps {
  streak: number;
}

export function StreakPill({ streak }: StreakPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface/70 px-4 py-2 text-sm text-accentSoft">
      <span role="img" aria-label="fire">🔥</span>
      <span>{streak} day streak</span>
    </div>
  );
}
