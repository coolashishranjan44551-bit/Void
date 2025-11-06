import { useEffect, useState } from 'react';

const phases = [
  { label: 'Inhale', duration: 4000 },
  { label: 'Hold', duration: 4000 },
  { label: 'Exhale', duration: 6000 },
];

export function BreathingTimer() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsed((current) => current + 200);
    }, 200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentPhase = phases[phaseIndex];
    if (elapsed >= currentPhase.duration) {
      setPhaseIndex((index) => (index + 1) % phases.length);
      setElapsed(0);
    }
  }, [elapsed, phaseIndex]);

  const currentPhase = phases[phaseIndex];
  const progress = Math.min(1, elapsed / currentPhase.duration);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border-4 border-accent/30"
          aria-hidden
        />
        <div
          className="absolute inset-4 rounded-full border-2 border-accent/80"
          style={{
            transform: `scale(${0.9 + progress * 0.1})`,
            transition: 'transform 0.2s ease-out',
          }}
        />
        <span className="text-lg font-medium text-accentSoft">{currentPhase.label}</span>
      </div>
      <p className="text-sm text-accentSoft">Breathe 4–4–6 to match the flow.</p>
    </div>
  );
}
