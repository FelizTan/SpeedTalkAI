import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Lesson } from "@/data/lessons";
import { speak } from "@/lib/tts";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { MicButton } from "@/components/common/MicButton";

interface ShadowingStepProps {
  lesson: Lesson;
  onNext: () => void;
}

const cleanWords = (s: string) =>
  s.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);

export const ShadowingStep = ({ lesson, onNext }: ShadowingStepProps) => {
  const sentences = lesson.dialogue.lines;
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"good" | "retry" | null>(null);

  const current = sentences[index];

  const { supported, listening, transcript, start, stop, reset } = useSpeechRecognition({
    lang: "en-US",
    onResult: (text, isFinal) => {
      if (!isFinal) return;
      const targetWords = cleanWords(current.en);
      const saidWords = new Set(cleanWords(text));
      const matched = targetWords.filter((w) => saidWords.has(w)).length;
      const ratio = matched / Math.max(1, targetWords.length);
      setFeedback(ratio >= 0.6 ? "good" : "retry");
    },
  });

  const goNextSentence = () => {
    reset();
    setFeedback(null);
    setIndex((i) => Math.min(i + 1, sentences.length - 1));
  };

  const isLast = index === sentences.length - 1;
  const progress = useMemo(() => ((index + 1) / sentences.length) * 100, [index, sentences.length]);

  return (
    <section className="px-4 py-5 flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-foreground">🎤 Luyện Nói Theo</h2>
        <p className="text-sm text-muted-foreground">Nghe câu mẫu, rồi nói lại theo.</p>
      </div>

      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base text-center"
      >
        <p className="text-[11px] font-bold text-muted-foreground uppercase">
          {current.speaker} • {index + 1} / {sentences.length}
        </p>
        <p className="mt-3 text-xl font-bold text-primary-700 leading-snug">{current.en}</p>
        <p className="mt-2 text-[15px] text-muted-foreground italic">{current.vi}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => speak(current.en, { rate: 0.85 })} className="btn-ghost">
            🔊 Nghe Mẫu
          </button>
          <button
            onClick={isLast ? onNext : goNextSentence}
            className="btn-primary"
          >
            {isLast ? "Tiếp Theo →" : "⏭ Câu Tiếp"}
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col items-center gap-3 mt-2">
        <MicButton
          listening={listening}
          onClick={listening ? stop : start}
          disabled={!supported}
          ariaLabel={listening ? "Dừng ghi âm" : "Bắt đầu nói"}
        />
        <p className="text-sm font-medium text-muted-foreground">
          {!supported
            ? "Trình duyệt không hỗ trợ ghi âm"
            : listening
              ? "Đang nghe..."
              : "Nhấn để nói theo"}
        </p>

        {transcript && (
          <p className="text-sm text-success font-medium">
            🗣 Bạn nói: <span className="italic">"{transcript}"</span>
          </p>
        )}
        {feedback === "good" && (
          <p className="text-success font-bold">✅ Tốt lắm!</p>
        )}
        {feedback === "retry" && (
          <p className="text-warning font-bold">💪 Thử lại nhé!</p>
        )}
      </div>
    </section>
  );
};
