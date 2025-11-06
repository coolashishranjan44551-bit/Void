import { FormEvent, useState } from 'react';
import { MoodScore } from '../hooks/useAppStore';

interface CheckOutProps {
  initialMood: MoodScore;
  onSubmit: (payload: { moodAfter: MoodScore; notes: string }) => void;
  onBack: () => void;
}

export function CheckOut({ initialMood, onSubmit, onBack }: CheckOutProps) {
  const [moodAfter, setMoodAfter] = useState<MoodScore>(initialMood);
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ moodAfter, notes: notes.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-3xl bg-surface/90 p-8 shadow-lg"
    >
      <h2 className="text-2xl font-semibold">How do you feel now?</h2>
      <input
        type="range"
        min={1}
        max={5}
        value={moodAfter}
        onChange={(event) => setMoodAfter(Number(event.target.value) as MoodScore)}
        className="w-full"
      />
      <p className="text-sm text-accentSoft">Mood after session: {moodAfter}/5</p>
      <label className="text-sm">
        <span className="mb-2 block uppercase tracking-wide text-accentSoft">Journal (optional)</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="What changed for you?"
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
        />
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-accent px-5 py-2 text-sm font-medium text-accent transition hover:bg-accent/10"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background transition hover:bg-accentSoft"
        >
          Save check-in
        </button>
      </div>
    </form>
  );
}
