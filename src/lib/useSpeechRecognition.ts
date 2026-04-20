/**
 * Web Speech Recognition (ASR) hook + helpers.
 * Returns a stable interface that no-ops when SpeechRecognition is unavailable.
 */
import { useCallback, useEffect, useRef, useState } from "react";

// SpeechRecognition is non-standard; declare a minimal type.
type SR = any;

const getSpeechRecognition = (): SR | null => {
  if (typeof window === "undefined") return null;
  // @ts-expect-error vendor prefix
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const isSpeechRecognitionSupported = (): boolean => !!getSpeechRecognition();

export interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  supported: boolean;
  listening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionReturn => {
  const {
    lang = "en-US",
    continuous = false,
    interimResults = false,
    onResult,
    onError,
  } = options;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const supported = isSpeechRecognitionSupported();
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  useEffect(() => {
    if (!supported) return;
    const SR = getSpeechRecognition();
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = interimResults;

    rec.onresult = (event: any) => {
      let finalTranscript = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const txt = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += txt;
        else interim += txt;
      }
      const merged = (finalTranscript || interim).trim();
      setTranscript(merged);
      onResultRef.current?.(merged, !!finalTranscript);
    };

    rec.onerror = (event: any) => {
      onErrorRef.current?.(event.error || "speech-error");
      setListening(false);
    };
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {/* noop */}
      recognitionRef.current = null;
    };
  }, [supported, lang, continuous, interimResults]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript("");
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      // Calling start while already running throws — ignore
      console.warn("recognition.start failed", e);
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {/* noop */}
    setListening(false);
  }, []);

  const reset = useCallback(() => setTranscript(""), []);

  return { supported, listening, transcript, start, stop, reset };
};
