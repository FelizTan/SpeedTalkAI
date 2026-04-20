import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore, type UserLevel } from "@/store/appStore";

type Phase = "intro" | "testing" | "result";

interface Question {
  q: string;
  options: string[];
  correct: number;
  level: "zero" | "elementary" | "pre_intermediate";
}

const QUESTIONS: Question[] = [
  {
    q: "Câu nào đúng để chào buổi sáng?",
    options: ["Good night!", "Good morning!", "Good afternoon!", "See you!"],
    correct: 1, level: "zero",
  },
  {
    q: "Bạn gọi 1 ly cà phê, nói thế nào lịch sự nhất?",
    options: ["Coffee!", "Give me coffee.", "Can I have a coffee please?", "I want coffee!"],
    correct: 2, level: "zero",
  },
  {
    q: "'Where is the restroom?' nghĩa là gì?",
    options: ["Phòng nghỉ ở đâu?", "Nhà vệ sinh ở đâu?", "Nhà hàng ở đâu?", "Phòng ngủ ở đâu?"],
    correct: 1, level: "elementary",
  },
  {
    q: "Điền vào chỗ trống: 'I ___ studying English for 2 years.'",
    options: ["am", "have been", "was", "will be"],
    correct: 1, level: "elementary",
  },
  {
    q: "Câu nào đúng ngữ pháp?",
    options: ["She don't like it.", "She doesn't likes it.", "She doesn't like it.", "She not like it."],
    correct: 2, level: "pre_intermediate",
  },
];

interface LevelInfo {
  level: UserLevel;
  label: string;
  emoji: string;
  badgeClasses: string;
  description: string;
}

const computeLevel = (score: number): LevelInfo => {
  if (score <= 1) {
    return {
      level: "starter",
      label: "Người Mới Bắt Đầu",
      emoji: "🌱",
      badgeClasses: "bg-success/10 text-success",
      description:
        "Tuyệt vời, mọi chuyên gia đều bắt đầu từ đây! Lộ trình của bạn sẽ tập trung vào chào hỏi và những tình huống đơn giản nhất.",
    };
  }
  if (score <= 3) {
    return {
      level: "elementary",
      label: "Cơ Bản",
      emoji: "📚",
      badgeClasses: "bg-primary/10 text-primary-700",
      description:
        "Bạn đã có nền tảng tốt rồi! Chúng ta sẽ luyện thêm các tình huống đời thực để bạn nói trôi chảy hơn.",
    };
  }
  return {
    level: "pre_intermediate",
    label: "Trên Cơ Bản",
    emoji: "🚀",
    badgeClasses: "bg-purple-100 text-purple-700",
    description:
      "Trình độ rất ấn tượng! Bài học sẽ thử thách bạn với các đoạn hội thoại tự nhiên và phức tạp hơn.",
  };
};

const PlacementTestPage = () => {
  const navigate = useNavigate();
  const setUserName = useAppStore((s) => s.setUserName);
  const setUserLevel = useAppStore((s) => s.setUserLevel);
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const storedName = useAppStore((s) => s.userName);

  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState(storedName);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleStart = () => {
    if (!name.trim()) return;
    setUserName(name.trim());
    setPhase("testing");
  };

  const handleSelect = (optionIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion + 1 >= QUESTIONS.length) {
        const score = newAnswers.reduce((acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0), 0);
        const info = computeLevel(score);
        setUserLevel(info.level);
        setOnboarded(true);
        setPhase("result");
      } else {
        setCurrentQuestion((c) => c + 1);
        setSelectedAnswer(null);
      }
    }, 800);
  };

  const score = answers.reduce((acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0), 0);
  const info = computeLevel(score);
  const progress = phase === "testing" ? ((currentQuestion) / QUESTIONS.length) * 100 : 0;
  const q = QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-10 pb-8">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-base mt-8"
          >
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 12 }}
              className="text-6xl text-center"
              aria-hidden
            >
              📝
            </motion.div>
            <h1 className="mt-3 text-2xl font-bold text-center">Kiểm Tra Trình Độ</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              5 câu hỏi • 3 phút
            </p>
            <p className="mt-3 text-center text-[15px] text-muted-foreground">
              Để chúng tôi hiểu trình độ của bạn và tạo lộ trình học phù hợp nhất!
            </p>

            <label className="block mt-6">
              <span className="text-sm font-medium text-foreground">Tên của bạn</span>
              <input
                type="text"
                placeholder="Tên của bạn là gì?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-button border border-border bg-surface px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!name.trim()}
              onClick={handleStart}
              className="mt-5 w-full btn-accent disabled:opacity-50"
            >
              Bắt Đầu Kiểm Tra →
            </motion.button>
          </motion.section>
        )}

        {phase === "testing" && q && (
          <motion.section
            key={`q-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Tiến độ
              </span>
              <span className="text-sm font-semibold text-primary-700">
                Câu {currentQuestion + 1}/{QUESTIONS.length}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress + (100 / QUESTIONS.length)}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="bg-surface rounded-modal shadow-pop p-5 mt-2">
              <p className="text-xl font-bold text-center text-foreground">{q.q}</p>

              <div className="mt-5 flex flex-col gap-3">
                {q.options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = q.correct === i;
                  const showState = selectedAnswer !== null;
                  let cls = "border-border bg-muted/40 hover:bg-muted";
                  if (showState && isCorrect) cls = "border-success bg-success/10 text-success";
                  else if (showState && isSelected && !isCorrect) cls = "border-error bg-error/10 text-error";
                  else if (showState) cls = "border-border bg-muted/30 opacity-60";
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={selectedAnswer !== null}
                      className={`text-left rounded-card border-2 px-4 py-3 font-medium transition ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {phase === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="card-base mt-8 text-center"
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Kết quả của bạn
            </p>
            <div className="mt-2 text-5xl font-extrabold text-primary-700">
              {score}/{QUESTIONS.length}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15 }}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${info.badgeClasses}`}
            >
              <span className="text-2xl">{info.emoji}</span>
              <span>{info.label}</span>
            </motion.div>

            <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
              {info.description}
            </p>

            <div className="mt-5 flex justify-center gap-2">
              {answers.map((a, i) => {
                const ok = a === QUESTIONS[i].correct;
                return (
                  <span
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                                ${ok ? "bg-success text-success-foreground" : "bg-error text-error-foreground"}`}
                    title={`Câu ${i + 1}: ${ok ? "đúng" : "sai"}`}
                  >
                    {ok ? "✓" : "✗"}
                  </span>
                );
              })}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard")}
              className="mt-7 w-full btn-accent"
            >
              Bắt Đầu Học Thôi! 🎯
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlacementTestPage;
