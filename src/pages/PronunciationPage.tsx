import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { speak } from "@/lib/tts";
import { scorePronunciation } from "@/lib/scoring";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { MicButton } from "@/components/common/MicButton";
import {
  PRONUNCIATION_CATEGORIES,
  type PronunciationCategoryKey,
  type PronunciationWord,
} from "@/data/pronunciationWords";

interface ScoreInfo {
  emoji: string;
  label: string;
  toneClass: string;
}

const scoreInfo = (score: number): ScoreInfo => {
  if (score >= 90) return { emoji: "🏆", label: "Xuất Sắc!", toneClass: "text-success" };
  if (score >= 70) return { emoji: "😊", label: "Khá Tốt!",  toneClass: "text-primary" };
  if (score >= 50) return { emoji: "💪", label: "Cần Luyện Thêm!", toneClass: "text-warning" };
  return { emoji: "🔄", label: "Thử Lại Nhé!", toneClass: "text-error" };
};

const ScoreCircle = ({ score }: { score: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 90 ? "hsl(var(--success))"
      : score >= 70 ? "hsl(var(--primary))"
        : score >= 50 ? "hsl(var(--warning))"
          : "hsl(var(--error))";
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={radius} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
      <motion.circle
        cx="50" cy="50" r={radius}
        stroke={color}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <text x="50" y="55" textAnchor="middle" className="rotate-90 origin-center fill-foreground font-bold text-lg">
        {score}
      </text>
    </svg>
  );
};

const PronunciationPage = () => {
  const [category, setCategory] = useState<PronunciationCategoryKey>("hard");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [said, setSaid] = useState("");
  const [todayMastered, setTodayMastered] = useState<Set<string>>(new Set());

  const words: readonly PronunciationWord[] = PRONUNCIATION_CATEGORIES[category].words;
  const word = words[index];

  // Reset on category change
  useEffect(() => {
    setIndex(0);
    setScore(null);
    setSaid("");
  }, [category]);

  const { supported, listening, start, stop } = useSpeechRecognition({
    lang: "en-US",
    onResult: (text, isFinal) => {
      if (!isFinal) return;
      setSaid(text);
      const s = scorePronunciation(word.word, text);
      setScore(s);
      if (s >= 90) {
        setTodayMastered((prev) => new Set(prev).add(`${category}:${word.word}`));
      }
    },
    onError: () => {
      setSaid("");
      setScore(30);
    },
  });

  const goPrev = () => { setIndex((i) => Math.max(0, i - 1)); setScore(null); setSaid(""); };
  const goNext = () => { setIndex((i) => Math.min(words.length - 1, i + 1)); setScore(null); setSaid(""); };

  const info = score !== null ? scoreInfo(score) : null;
  const masteredToday = useMemo(() => todayMastered.size, [todayMastered]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">🎤 Luyện Phát Âm</h1>
          <span className="text-xs text-muted-foreground">
            ⭐ {masteredToday} từ giỏi hôm nay
          </span>
        </div>
      </header>

      {/* Word display */}
      <section className="mx-4 rounded-modal bg-primary-800 text-white p-5 shadow-pop">
        <div className="flex items-center justify-between">
          <button onClick={goPrev} disabled={index === 0} className="w-9 h-9 rounded-full bg-white/20 disabled:opacity-30">←</button>
          <span className="text-xs font-semibold text-primary-200">
            {index + 1} / {words.length}
          </span>
          <button onClick={goNext} disabled={index === words.length - 1} className="w-9 h-9 rounded-full bg-white/20 disabled:opacity-30">→</button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[40px] font-extrabold leading-none">{word.word}</p>
          <p className="mt-2 text-xl text-primary-200">{word.phonetic}</p>
          <p className="mt-1 text-sm text-primary-300">{word.type} • {word.meaning}</p>
        </div>

        <button
          onClick={() => speak(word.word, { rate: 0.7 })}
          className="mt-5 w-full bg-accent hover:bg-accent-light text-accent-foreground font-bold rounded-button py-3"
        >
          🔊 Nghe Phát Âm Chuẩn
        </button>
      </section>

      {/* Practice section */}
      <section className="mx-4 mt-4 card-base flex flex-col items-center gap-3">
        <p className="font-bold text-foreground">Bây Giờ Bạn Thử Nói</p>

        <MicButton
          listening={listening}
          onClick={listening ? stop : start}
          disabled={!supported}
          ariaLabel={listening ? "Dừng" : "Nhấn để nói"}
        />
        <p className="text-sm text-muted-foreground">
          {!supported ? "Trình duyệt không hỗ trợ ghi âm" : listening ? "Đang nghe..." : "Nhấn để nói"}
        </p>

        <AnimatePresence>
          {score !== null && info && (
            <motion.div
              key={`${index}-${score}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full mt-2 flex flex-col items-center gap-3"
            >
              {said && (
                <p className="text-sm text-foreground">
                  Bạn nói: <span className="italic text-muted-foreground">"{said}"</span>
                </p>
              )}
              <ScoreCircle score={score} />
              <p className={`text-2xl font-extrabold ${info.toneClass}`}>
                {info.emoji} {info.label}
              </p>

              {score < 70 && (
                <div className="w-full rounded-card bg-warning/10 border border-warning/30 p-3 text-sm text-foreground">
                  💡 <strong>Mẹo:</strong> {word.tip}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={() => speak(word.word, { rate: 0.65 })} className="btn-ghost">
                  Nghe Lại 🔊
                </button>
                <button onClick={() => { setScore(null); setSaid(""); start(); }} className="btn-primary">
                  Thử Lại 🎤
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Categories */}
      <section className="mx-4 mt-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(Object.keys(PRONUNCIATION_CATEGORIES) as PronunciationCategoryKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={[
                "shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition",
                category === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/70",
              ].join(" ")}
            >
              {PRONUNCIATION_CATEGORIES[key].label}
            </button>
          ))}
        </div>
      </section>

      <div className="h-6" />
    </div>
  );
};

export default PronunciationPage;
