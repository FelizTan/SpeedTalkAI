import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserLevel = "starter" | "elementary" | "pre_intermediate";

export interface VocabCard {
  id: string;
  word: string;
  phonetic?: string;
  meaning: string;
  type?: string;
  example?: string;
  exampleVi?: string;
  // SM-2
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: string; // ISO date
  addedAt: string;
}

interface AppState {
  // User
  userName: string;
  userLevel: UserLevel;
  avatar: string;

  // Progress
  completedLessons: number[];
  totalXP: number;
  streak: number;
  bestStreak: number;
  lastStudyDate: string | null; // toDateString()
  studyHistory: Record<string, boolean>; // { "Mon Apr 20 2026": true }

  // Settings
  geminiApiKey: string;
  openrouterApiKey: string;
  hasOnboarded: boolean;

  // Vocabulary
  vocabulary: VocabCard[];

  // Actions
  setUserName: (name: string) => void;
  setUserLevel: (level: UserLevel) => void;
  setAvatar: (a: string) => void;
  setOnboarded: (v: boolean) => void;
  completeLesson: (lessonId: number, xp: number) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  setApiKey: (provider: "gemini" | "openrouter", key: string) => void;
  addVocabCard: (card: Omit<VocabCard, "repetitions" | "easeFactor" | "interval" | "nextReview" | "addedAt">) => void;
  updateVocabCard: (wordId: string, quality: 1 | 2 | 3) => void;
  resetAllData: () => void;
}

const todayStr = () => new Date().toDateString();
const yesterdayStr = () => new Date(Date.now() - 86_400_000).toDateString();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: "",
      userLevel: "starter",
      avatar: "🧑‍🎓",

      completedLessons: [],
      totalXP: 0,
      streak: 0,
      bestStreak: 0,
      lastStudyDate: null,
      studyHistory: {},

      geminiApiKey: "",
      openrouterApiKey: "",
      hasOnboarded: false,

      vocabulary: [],

      setUserName: (name) => set({ userName: name }),
      setUserLevel: (level) => set({ userLevel: level }),
      setAvatar: (a) => set({ avatar: a }),
      setOnboarded: (v) => set({ hasOnboarded: v }),

      completeLesson: (lessonId, xp) => {
        const { completedLessons, totalXP } = get();
        if (completedLessons.includes(lessonId)) {
          set({ totalXP: totalXP + xp });
        } else {
          set({
            completedLessons: [...completedLessons, lessonId],
            totalXP: totalXP + xp,
          });
        }
      },

      addXP: (amount) => set({ totalXP: get().totalXP + amount }),

      updateStreak: () => {
        const today = todayStr();
        const { lastStudyDate, streak, bestStreak, studyHistory } = get();
        let newStreak = streak;
        if (lastStudyDate === today) {
          // already counted today
        } else if (lastStudyDate === yesterdayStr()) {
          newStreak = streak + 1;
        } else {
          newStreak = 1;
        }
        set({
          streak: newStreak,
          bestStreak: Math.max(bestStreak, newStreak),
          lastStudyDate: today,
          studyHistory: { ...studyHistory, [today]: true },
        });
      },

      setApiKey: (provider, key) =>
        set(provider === "gemini" ? { geminiApiKey: key } : { openrouterApiKey: key }),

      addVocabCard: (card) => {
        const exists = get().vocabulary.some((v) => v.word.toLowerCase() === card.word.toLowerCase());
        if (exists) return;
        set({
          vocabulary: [
            ...get().vocabulary,
            {
              ...card,
              repetitions: 0,
              easeFactor: 2.5,
              interval: 1,
              nextReview: new Date().toISOString(),
              addedAt: new Date().toISOString(),
            },
          ],
        });
      },

      updateVocabCard: (wordId, quality) => {
        set({
          vocabulary: get().vocabulary.map((c) => {
            if (c.id !== wordId) return c;
            let { repetitions, easeFactor, interval } = c;
            if (quality >= 2) {
              if (repetitions === 0) interval = 1;
              else if (repetitions === 1) interval = 6;
              else interval = Math.round(interval * easeFactor);
              repetitions += 1;
            } else {
              repetitions = 0;
              interval = 1;
            }
            easeFactor = Math.max(
              1.3,
              easeFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02),
            );
            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + interval);
            return { ...c, repetitions, easeFactor, interval, nextReview: nextReview.toISOString() };
          }),
        });
      },

      resetAllData: () =>
        set({
          userName: "",
          userLevel: "starter",
          avatar: "🧑‍🎓",
          completedLessons: [],
          totalXP: 0,
          streak: 0,
          bestStreak: 0,
          lastStudyDate: null,
          studyHistory: {},
          vocabulary: [],
          hasOnboarded: false,
        }),
    }),
    { name: "speedtalk-ai-store" },
  ),
);

export const hasStudiedToday = (lastStudyDate: string | null) =>
  lastStudyDate === new Date().toDateString();
