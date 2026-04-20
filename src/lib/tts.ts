/**
 * Web Speech Synthesis (TTS) helpers.
 * Safe wrappers that no-op when API isn't available (SSR / unsupported browsers).
 */

let cachedVoices: SpeechSynthesisVoice[] | null = null;

const loadVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (cachedVoices && cachedVoices.length) return cachedVoices;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return voices;
};

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

export const speak = (text: string, opts: SpeakOptions = {}): void => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (!text?.trim()) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = opts.lang ?? "en-US";
    utterance.rate = opts.rate ?? 0.9;
    utterance.pitch = opts.pitch ?? 1;
    const voices = loadVoices();
    const englishVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("speak failed", e);
  }
};

export const stopSpeaking = (): void => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
};

export const isSpeechSynthesisSupported = (): boolean =>
  typeof window !== "undefined" && "speechSynthesis" in window;
