import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { CHARACTERS, type ChatCharacter } from "@/data/characters";
import { callGemini, friendlyErrorMessage, splitAiHint, type GeminiContent } from "@/lib/gemini";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { SpeakerButton } from "@/components/common/SpeakerButton";
import { MicButton } from "@/components/common/MicButton";
import { LoadingDots } from "@/components/common/LoadingDots";
import { ErrorToast } from "@/components/common/ErrorToast";

interface ChatMsg {
  id: string;
  role: "user" | "model";
  text: string;
  hint?: string | null;
  ts: number;
}

const HISTORY_LIMIT = 10;

const ConversationPage = () => {
  const navigate = useNavigate();
  const apiKey = useAppStore((s) => s.geminiApiKey);
  const [character, setCharacter] = useState<ChatCharacter | null>(null);

  if (!character) {
    return <CharacterSelect onPick={setCharacter} />;
  }
  return (
    <ActiveChat
      character={character}
      apiKey={apiKey}
      onBack={() => setCharacter(null)}
      onSettings={() => navigate("/settings")}
    />
  );
};

const CharacterSelect = ({ onPick }: { onPick: (c: ChatCharacter) => void }) => {
  const navigate = useNavigate();
  return (
    <div className="px-4 pt-6 pb-6 min-h-screen">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">💬 Luyện Hội Thoại AI</h1>
        <button
          onClick={() => navigate("/settings")}
          className="w-9 h-9 rounded-full bg-muted hover:bg-muted/70"
          aria-label="Cài đặt"
        >
          ⚙️
        </button>
      </header>

      <p className="mt-4 text-sm text-muted-foreground">Chọn nhân vật để luyện nói:</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {CHARACTERS.map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            onClick={() => onPick(c)}
            className={`text-left rounded-card border ${c.bgClass} p-3 shadow-soft`}
          >
            <div className="text-4xl">{c.emoji}</div>
            <p className="mt-2 font-bold text-foreground">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.role}</p>
            <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider
                             bg-white/70 rounded-full px-2 py-0.5 text-foreground">
              {c.scenarioVi}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 rounded-card bg-primary/5 border border-primary/20 p-3 text-sm">
        💡 <strong>Mẹo:</strong> Hãy cố gắng nói tiếng Anh hoàn toàn! AI sẽ tự động sửa lỗi cho bạn bằng tiếng Việt.
      </div>
    </div>
  );
};

const ActiveChat = ({
  character, apiKey, onBack, onSettings,
}: {
  character: ChatCharacter;
  apiKey: string;
  onBack: () => void;
  onSettings: () => void;
}) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemPrompt =
    `You are ${character.name}, a ${character.role}. ` +
    `Have a natural English conversation about ${character.scenario}. ` +
    "Keep responses to 2-3 sentences maximum. " +
    "If the user makes grammar mistakes, add after your response: " +
    "'💡 Gợi ý: [correction in Vietnamese, max 20 words]'. " +
    "Start with a friendly greeting in English.";

  // Mic
  const { supported: micSupported, listening, start, stop } = useSpeechRecognition({
    lang: "en-US",
    onResult: (t, isFinal) => isFinal && setInput(t),
  });

  // Auto greeting once when api key is set
  useEffect(() => {
    if (!apiKey || messages.length > 0) return;
    let cancelled = false;
    setLoading(true);
    callGemini({
      apiKey,
      systemPrompt,
      contents: [{ role: "user", parts: [{ text: "Greet me and start the conversation." }] }],
    })
      .then((reply) => {
        if (cancelled) return;
        const { main, hint } = splitAiHint(reply);
        setMessages([{ id: crypto.randomUUID(), role: "model", text: main, hint, ts: Date.now() }]);
      })
      .catch((e) => setError(friendlyErrorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, character.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading || !apiKey) return;
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", text, ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const recent = next.slice(-HISTORY_LIMIT);
    const contents: GeminiContent[] = recent.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    try {
      const reply = await callGemini({
        apiKey,
        systemPrompt,
        contents,
        maxOutputTokens: 220,
      });
      const { main, hint } = splitAiHint(reply);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "model", text: main, hint, ts: Date.now() },
      ]);
    } catch (e) {
      setError(friendlyErrorMessage(e));
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 py-3 bg-surface border-b border-border flex items-center gap-3 sticky top-0 z-30">
        <button onClick={onBack} aria-label="Quay lại" className="w-9 h-9 rounded-full bg-muted">←</button>
        <div className="text-2xl">{character.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground truncate">{character.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">
            {character.role} • <span className="text-success">🟢 Đang hoạt động</span>
          </p>
        </div>
        <button onClick={onSettings} aria-label="Cài đặt" className="w-9 h-9 rounded-full bg-muted">⚙️</button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-muted/20">
        {!apiKey && <NoApiKeyState onSettings={onSettings} />}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
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
              </div>
              {m.role === "model" && (
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <SpeakerButton text={m.text} />
                  <span>{new Date(m.ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              )}
              {m.hint && (
                <div className="rounded-card bg-warning/10 border border-warning/30 text-warning text-xs px-3 py-2">
                  💡 <strong>Gợi ý:</strong> {m.hint}
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

      {apiKey && (
        <div className="bg-surface border-t border-border p-3 sticky bottom-0">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Nhập tiếng Anh..."
              className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <MicButton size="md" listening={listening} onClick={listening ? stop : start} disabled={!micSupported} />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              aria-label="Gửi"
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 active:scale-95"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <ErrorToast message={error} onDismiss={() => setError(null)} />
    </div>
  );
};

const NoApiKeyState = ({ onSettings }: { onSettings: () => void }) => (
  <div className="m-auto text-center py-10">
    <div className="text-5xl text-muted-foreground">🔒</div>
    <p className="mt-3 font-bold">Cần API Key để dùng tính năng này</p>
    <ol className="mt-3 text-sm text-muted-foreground text-left max-w-xs mx-auto space-y-1">
      <li>1. Vào Cài Đặt</li>
      <li>2. Dán Gemini API Key miễn phí</li>
      <li>3. Quay lại và chat!</li>
    </ol>
    <button onClick={onSettings} className="mt-4 btn-primary">⚙️ Vào Cài Đặt</button>
  </div>
);

export default ConversationPage;
