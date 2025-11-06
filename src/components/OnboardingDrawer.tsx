import { FormEvent, useState } from 'react';
import { Goal, MoodScore, SessionLength } from '../hooks/useAppStore';

interface OnboardingDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    profile: { name: string; goal: Goal; length: SessionLength; reminder: string },
    mood: MoodScore
  ) => void;
}

const goals: Goal[] = ['Relax', 'Focus', 'Sleep'];
const lengths: SessionLength[] = [3, 5, 10];

export function OnboardingDrawer({ open, onClose, onSubmit }: OnboardingDrawerProps) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal>('Relax');
  const [mood, setMood] = useState<MoodScore>(3);
  const [length, setLength] = useState<SessionLength>(5);
  const [reminder, setReminder] = useState('08:00');

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(
      {
        name: name.trim() || 'Friend',
        goal,
        length,
        reminder,
      },
      mood
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/60">
      <form
        className="h-full w-full max-w-md overflow-y-auto bg-surface p-8 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Let&apos;s personalize your calm.</h2>
          <button
            type="button"
            className="text-accent hover:text-accentSoft"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm uppercase tracking-wide text-accentSoft">Name</span>
          <input
            className="w-full rounded-md border border-white/10 bg-background px-4 py-3 text-white focus:border-accent focus:outline-none"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="How should we greet you?"
            aria-label="Name"
          />
        </label>

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm uppercase tracking-wide text-accentSoft">Goal</legend>
          <div className="grid grid-cols-3 gap-2">
            {goals.map((option) => (
              <button
                type="button"
                key={option}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  goal === option ? 'border-accent bg-accent/20 text-white' : 'border-white/10 text-white/70'
                }`}
                onClick={() => setGoal(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm uppercase tracking-wide text-accentSoft">How are you feeling?</legend>
          <input
            type="range"
            min={1}
            max={5}
            value={mood}
            onChange={(event) => setMood(Number(event.target.value) as MoodScore)}
            className="w-full"
          />
          <p className="mt-2 text-sm text-accentSoft">Mood: {mood}/5</p>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm uppercase tracking-wide text-accentSoft">Session length</legend>
          <div className="flex gap-2">
            {lengths.map((value) => (
              <button
                type="button"
                key={value}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                  length === value ? 'border-accent bg-accent/20 text-white' : 'border-white/10 text-white/70'
                }`}
                onClick={() => setLength(value)}
              >
                {value} min
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mb-8 block">
          <span className="mb-2 block text-sm uppercase tracking-wide text-accentSoft">Preferred reminder time</span>
          <input
            type="time"
            value={reminder}
            onChange={(event) => setReminder(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-4 py-3 text-white focus:border-accent focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-accent px-4 py-3 text-base font-medium text-background transition hover:bg-accentSoft"
        >
          Save &amp; continue
        </button>
      </form>
    </div>
  );
}
