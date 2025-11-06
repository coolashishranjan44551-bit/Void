import { useEffect, useMemo, useState } from 'react';
import { OnboardingDrawer } from './components/OnboardingDrawer';
import { TodayCard } from './components/TodayCard';
import { SessionPlayer } from './components/SessionPlayer';
import { CheckOut } from './components/CheckOut';
import { StreakPill } from './components/StreakPill';
import { HistoryChip } from './components/HistoryChip';
import { PrivacyModal } from './components/PrivacyModal';
import {
  Goal,
  MoodScore,
  SessionLength,
  SessionRecord,
  useAppStore,
} from './hooks/useAppStore';
import { generateSessionContent } from './utils/ai';

const offlineFallbacks: Record<Goal, string> = {
  Relax: 'Take three slow breaths. Roll your shoulders and scan from head to toe. Thank yourself for pausing.',
  Focus: 'Breathe in for four, hold for four, out for six. Choose one task and imagine it already complete.',
  Sleep: 'Dim the lights. Breathe slowly and count each exhale from ten to one. With each number, release more tension.',
};

type ViewState = 'home' | 'session' | 'checkout' | 'complete';

type SevereBanner = 'none' | 'warning';

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function useSpeechSupport() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSupported('speechSynthesis' in window);
  }, []);

  return supported;
}

export default function App() {
  const {
    profile,
    onboardingComplete,
    setProfile,
    setOnboardingComplete,
    currentMood,
    setCurrentMood,
    sessions,
    streak,
    todaySession,
    setTodaySession,
    logSession,
    severeMoodCount,
    setSevereMoodCount,
  } = useAppStore();

  const [view, setView] = useState<ViewState>('home');
  const [showOnboarding, setShowOnboarding] = useState(!onboardingComplete);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [banner, setBanner] = useState<SevereBanner>('none');
  const [lastResult, setLastResult] = useState(todaySession);
  const [lastNotes, setLastNotes] = useState('');

  const speechSupported = useSpeechSupport();

  useEffect(() => {
    setShowOnboarding(!onboardingComplete);
  }, [onboardingComplete]);

  useEffect(() => {
    if (!isPlaying) {
      window.speechSynthesis?.cancel();
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [isPlaying]);

  useEffect(() => {
    setLastResult(todaySession);
  }, [todaySession]);

  const recentNotes = useMemo(
    () =>
      sessions
        .filter((session) => Boolean(session.notes))
        .slice(0, 3)
        .map((session) => session.notes as string),
    [sessions]
  );

  const handleOnboardingComplete = (
    profilePayload: { name: string; goal: Goal; length: SessionLength; reminder: string },
    mood: MoodScore
  ) => {
    setProfile(profilePayload);
    setCurrentMood(mood);
    setOnboardingComplete(true);
    setView('home');
  };

  const handleStartSession = () => {
    if (!profile) {
      setShowOnboarding(true);
      return;
    }

    setLastNotes('');
    setIsPlaying(false);
    window.speechSynthesis?.cancel();
    const newSevereCount = currentMood === 1 ? severeMoodCount + 1 : 0;
    setSevereMoodCount(newSevereCount);
    setBanner(newSevereCount >= 3 ? 'warning' : 'none');

    try {
      setIsGenerating(true);
      const content = generateSessionContent({
        name: profile.name,
        goal: profile.goal,
        mood: currentMood,
        length: profile.length,
        recentNotes,
      });
      setTodaySession(content);
      setLastResult(content);
    } catch (error) {
      console.warn('AI generation failed, using fallback', error);
      const fallbackScript = offlineFallbacks[profile.goal];
      const fallback = {
        script: fallbackScript,
        reflection: 'What is one kind thing you can offer yourself right now?',
        microTip: 'Place a hand on your chest to feel your breath rise.',
        audioText: fallbackScript,
      };
      setTodaySession(fallback);
      setLastResult(fallback);
    } finally {
      setIsGenerating(false);
      setView('session');
    }
  };

  const handleTogglePlay = () => {
    if (!speechSupported || !lastResult) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(lastResult.audioText);
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleFinishSession = () => {
    setIsPlaying(false);
    window.speechSynthesis?.cancel();
    setView('checkout');
  };

  const handleCheckout = ({ moodAfter, notes }: { moodAfter: MoodScore; notes: string }) => {
    if (!profile || !lastResult) return;
    const record: SessionRecord = {
      id: createSessionId(),
      date: new Date().toISOString().slice(0, 10),
      goal: profile.goal,
      length: profile.length,
      moodBefore: currentMood,
      moodAfter,
      notes: notes || undefined,
      script: lastResult.script,
      reflection: lastResult.reflection,
      microTip: lastResult.microTip,
    };
    logSession(record);
    setCurrentMood(moodAfter);
    setLastNotes(notes);
    setView('complete');
  };

  const handleDoAnother = () => {
    setView('home');
  };

  const severeWarning =
    banner === 'warning' ? (
      <div className="rounded-2xl border border-red-400/50 bg-red-500/10 p-4 text-sm text-red-100">
        We&apos;ve noticed a few very low moods. If you&apos;re in crisis, please reach out to a local helpline or trusted person.
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-[#111c3b] to-[#0b1224] pb-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StreakPill streak={streak} />
            {profile?.reminder && (
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/70 px-4 py-2 text-sm text-accentSoft">
                <span role="img" aria-label="bell">
                  ⏰
                </span>
                <span>{profile.reminder} reminder</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowPrivacy(true)}
            className="rounded-full border border-accent/40 px-4 py-2 text-sm text-accentSoft hover:bg-accent/20"
          >
            Privacy &amp; contact
          </button>
        </header>

        {severeWarning}

        {view === 'home' && profile && (
          <TodayCard
            name={profile.name}
            goal={profile.goal}
            length={profile.length}
            mood={currentMood}
            microTip={lastResult?.microTip}
            onStart={handleStartSession}
          />
        )}

        {view === 'home' && sessions[0]?.notes && (
          <details className="overflow-hidden rounded-3xl bg-surface/60 text-accentSoft">
            <summary className="cursor-pointer list-none px-6 py-4 text-sm font-medium text-white/80">
              Last journal note
            </summary>
            <div className="border-t border-white/5 px-6 py-4 text-sm leading-relaxed">
              {sessions[0]?.notes}
            </div>
          </details>
        )}

        {view === 'home' && !profile && (
          <section className="rounded-3xl bg-surface/80 p-8 text-accentSoft">
            <h2 className="text-2xl font-semibold text-white">Welcome to Void</h2>
            <p className="mt-3 text-sm">
              A calm one-page mindfulness companion. Tap the button below to set it up for you.
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="mt-6 rounded-full bg-accent px-6 py-3 text-base font-medium text-background transition hover:bg-accentSoft"
            >
              Personalize my calm
            </button>
          </section>
        )}

        {isGenerating && (
          <div className="rounded-3xl bg-surface/70 p-6 text-accentSoft">
            <p>Preparing your guidance...</p>
          </div>
        )}

        {view === 'session' && lastResult && (
          <SessionPlayer
            script={lastResult.script}
            reflection={lastResult.reflection}
            microTip={lastResult.microTip}
            onFinish={handleFinishSession}
            onTogglePlay={handleTogglePlay}
            isPlaying={isPlaying}
            speechSupported={speechSupported}
          />
        )}

        {view === 'checkout' && (
          <CheckOut
            initialMood={currentMood}
            onSubmit={handleCheckout}
            onBack={() => setView('session')}
          />
        )}

        {view === 'complete' && profile && (
          <section className="rounded-3xl bg-surface/80 p-8 text-accentSoft">
            <h2 className="text-2xl font-semibold text-white">Nice work, {profile.name}!</h2>
            <p className="mt-2 text-sm">Your streak is now {streak} days.</p>
            <p className="mt-2 text-sm text-accentSoft">
              Reflection saved. {lastNotes ? 'Come back later to review it in history.' : 'Want to add more? Start another session or journal more.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleDoAnother}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background transition hover:bg-accentSoft"
              >
                Do another session
              </button>
              <button
                onClick={() => setView('home')}
                className="rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
              >
                Back home
              </button>
            </div>
          </section>
        )}

        <HistoryChip sessions={sessions} />

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-accentSoft/70">
          <p>This app is wellness guidance, not medical advice.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowPrivacy(true)} className="underline">
              Privacy
            </button>
            <a href="mailto:hello@voidmindful.app" className="underline">
              Contact
            </a>
          </div>
        </footer>
      </div>

      <OnboardingDrawer
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSubmit={handleOnboardingComplete}
      />

      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}
