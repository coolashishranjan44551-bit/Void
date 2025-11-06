import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeneratedSession, Goal } from '../utils/ai';

type MoodScore = 1 | 2 | 3 | 4 | 5;

type SessionLength = 3 | 5 | 10;

export interface Profile {
  name: string;
  goal: Goal;
  length: SessionLength;
  reminder: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  goal: Goal;
  length: SessionLength;
  moodBefore: MoodScore;
  moodAfter: MoodScore;
  notes?: string;
  script: string;
  reflection: string;
  microTip: string;
}

interface AppState {
  profile: Profile | null;
  onboardingComplete: boolean;
  currentMood: MoodScore;
  streak: number;
  sessions: SessionRecord[];
  todaySession?: GeneratedSession;
  lastReminder?: string;
  severeMoodCount: number;
  setProfile: (profile: Profile) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setCurrentMood: (mood: MoodScore) => void;
  setTodaySession: (session: GeneratedSession | undefined) => void;
  logSession: (record: SessionRecord) => void;
  setSevereMoodCount: (count: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      onboardingComplete: false,
      currentMood: 3,
      streak: 0,
      sessions: [],
      todaySession: undefined,
      severeMoodCount: 0,
      setProfile: (profile) => set({ profile }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      setCurrentMood: (mood) => set({ currentMood: mood }),
      setTodaySession: (todaySession) => set({ todaySession }),
      logSession: (record) =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          const lastSessionDate = state.sessions[0]?.date;
          const newStreak = lastSessionDate === today ? state.streak : state.streak + 1;
          const sessions = [record, ...state.sessions].slice(0, 10);
          return {
            sessions,
            streak: newStreak,
            currentMood: record.moodAfter,
          };
        }),
      setSevereMoodCount: (count) => set({ severeMoodCount: count }),
    }),
    {
      name: 'void-mindfulness-store',
      partialize: (state) => ({
        profile: state.profile,
        onboardingComplete: state.onboardingComplete,
        currentMood: state.currentMood,
        streak: state.streak,
        sessions: state.sessions,
        todaySession: state.todaySession,
        severeMoodCount: state.severeMoodCount,
      }),
    }
  )
);

export type { Goal, MoodScore, SessionLength };
