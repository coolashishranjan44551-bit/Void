import { SessionRecord } from '../hooks/useAppStore';

interface HistoryChipProps {
  sessions: SessionRecord[];
}

export function HistoryChip({ sessions }: HistoryChipProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-full bg-surface/60 px-4 py-2 text-sm text-accentSoft">
        No sessions yet. Your streak begins today.
      </div>
    );
  }

  const streak = sessions.slice(0, 7);
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = streak.some((session) => session.date === today);

  return (
    <div className="rounded-full bg-surface/60 px-4 py-2 text-sm text-accentSoft">
      Last {streak.length} days • {completedToday ? 'You checked in today' : 'Tap start to check in'}
    </div>
  );
}
