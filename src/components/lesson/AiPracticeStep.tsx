import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Lesson } from "@/data/lessons";
import { useAppStore } from "@/store/appStore";
import { callGemini, friendlyErrorMessage, splitAiHint, type GeminiContent } from "@/lib/gemini";
import { SpeakerButton } from "@/components/common/SpeakerButton";
import { MicButton } from "@/components/common/MicButton";
import { LoadingDots } from "@/components/common/LoadingDots";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

interface AiPracticeStepProps {
  lesson: Lesson;
  onNext: () => void;
  onError: (msg: string) => void;
}

interface ChatMsg {
  role: "user" | "model";
  text: string;
  hint?: string | null;
}

const characterFromLesson = (lesson: Lesson): { name: string; role: string } => {
  const firstNonUser = lesson.dialogue.lines.find((l) => !l.isUser);
  return {
    name: firstNonUser?.speaker ?? "Tutor",
    role: lesson.title,
  };
};

export const AiPracticeStep = ({ lesson, onNext, onError }: AiPracticeStepProps) => {
  const navigate = useNavigate();
  const apiKey = useAppStore((s) => s.geminiApiKey);
  const character = characterFromLesson(lesson);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemPrompt =
    `You are ${character.name}, a ${character.role}. ` +
    `Scenario: ${lesson.dialogue.situation}. ` +
    "Have a natural English conversation. Keep responses to 2-3 sentences. " +
    "After each response, if the user made English mistakes, add on a new line: " +
    "'💡 Gợi ý: [brief correction in Vietnamese]'. Be encouraging and friendly.";

  // Mic
  const { supported: micSupported, listening, start, stop } = useSpeechRecognition({
    lang: "en-US",
    onResult: (text, isFinal) => {
      if (isFinal) setInput(text);
    },
  });

  // Auto greeting once when key exists
  useEffect(() => {
    if (!apiKey || messages.length > 0) return;
    let cancelled = false;
    setLoading(true);
    callGemini({
      apiKey,
      systemPrompt,
      contents: [{ role: "user", parts: [{ text: "Greet the user in English to start." }] }],
    })
      .then((reply) => {
        if (cancelled) return;
        const { main, hint } = splitAiHint(reply);
        setMessages([{ role: "model", text: main, hint }]);
      })
      .catch((e) => onError(friendlyErrorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading || !apiKey) return;
    const next: ChatMsg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const contents: GeminiContent[] = next.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    try {
      const reply = await callGemini({
        apiKey,
        systemPrompt,
        contents,
        maxOutputTokens: 220,
        temperature: 0.8,
      });
      const { main, hint } = splitAiHint(reply);
      setMessages((prev) => [...prev, { role: "model", text: main, hint }]);
    } catch (e) {
      onError(friendlyErrorMessage(e));
      setMessages((prev) => prev.slice(0, -1)); // remove the user message we just added on failure
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-5 flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-foreground">🤖 Luyện Với AI</h2>
        <p className="text-sm text-muted-foreground">Trò chuyện với {character.name} ({character.role}).</p>
      </div>

      <div className="card-base !p-3 flex items-center gap-3">
        <div className="text-3xl">{lesson.icon}</div>
        <div className="text-sm">
          <p className="font-bold">{character.name}</p>
          <p className="text-muted-foreground text-xs">Tình huống: {lesson.dialogue.situation}</p>
        </div>
      </div>

      {!apiKey ? (
        <div className="rounded-card border border-warning/40 bg-warning/10 p-4 text-sm">
          <p className="font-bold text-warning">⚠️ Bạn chưa nhập API Key</p>
          <p className="mt-1 text-foreground">
            Thêm Gemini API Key miễn phí để luyện với AI.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => navigate("/settings")} className="btn-primary !py-2 text-sm">
              Thêm API Key →
            </button>
            <button onClick={onNext} className="btn-ghost !py-2 text-sm">
              Bỏ Qua →
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="bg-muted/30 rounded-card p-3 max-h-[350px] overflow-y-auto flex flex-col gap-3"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] flex flex-col gap-1">
                  <div
                    className={[
                      "rounded-card px-3 py-2 text-[15px] shadow-soft",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-surface text-foreground rounded-bl-sm",
                    ].join(" ")}
                  >
                    {m.text}
                    {m.role === "model" && (
                      <SpeakerButton text={m.text} className="ml-2 align-middle" />
                    )}
                  </div>
                  {m.hint && (
                    <div className="rounded-card bg-warning/10 border border-warning/30 text-warning text-xs px-3 py-2">
                      💡 {m.hint}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface text-muted-foreground rounded-card px-3 py-2 shadow-soft">
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Nhập tiếng Anh..."
              className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <MicButton
              size="md"
              listening={listening}
              onClick={listening ? stop : start}
              disabled={!micSupported}
              ariaLabel="Ghi âm"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              aria-label="Gửi"
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 active:scale-95"
            >
              ➤
            </button>
          </div>

          <button onClick={onNext} className="btn-accent w-full mt-1">
            Tiếp Theo →
          </button>
        </>
      )}
    </section>
  );
};
