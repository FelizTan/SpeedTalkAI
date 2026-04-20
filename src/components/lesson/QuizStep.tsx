import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Lesson } from "@/data/lessons";
import { useAppStore } from "@/store/appStore";
import { fireConfetti } from "@/lib/confetti";

interface QuizStepProps {
  lesson: Lesson;
}

export const QuizStep = ({ lesson }: QuizStepProps) => {
  const navigate = useNavigate();
  const completeLesson = useAppStore((s) => s.completeLesson);
  const updateStreak = useAppStore((s) => s.updateStreak);
  const streak = useAppStore((s) => s.streak);

  const questions = lesson.quiz;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) setDone(true);
    else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  // Finalize stats once when complete
  useEffect(() => {
    if (!done) return;
    completeLesson(lesson.id, lesson.xpReward);
    updateStreak();
    fireConfetti();
  }, [done, completeLesson, updateStreak, lesson.id, lesson.xpReward]);

  if (done) {
    let emoji = "💪";
    let msg = "Cố lên, bạn sẽ giỏi hơn ở bài sau!";
    if (score === questions.length) { emoji = "🏆"; msg = "Hoàn hảo! Bạn thật xuất sắc!"; }
    else if (score >= questions.length - 1) { emoji = "😊"; msg = "Tuyệt vời! Sắp hoàn hảo rồi."; }

    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 py-5 flex flex-col gap-4"
      >
        <div className="card-base text-center">
          <div className="text-6xl">{emoji}</div>
          <p className="mt-2 text-3xl font-extrabold text-primary-700">
            {score}/{questions.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{msg}</p>

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mt-4 inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 font-bold"
          >
            +{lesson.xpReward} XP 🌟
          </motion.div>

          <ul className="mt-5 text-left text-sm text-foreground space-y-1.5">
            <li>✅ Hoàn thành bài: <strong>{lesson.title}</strong></li>
            <li>⭐ XP: +{lesson.xpReward}</li>
            <li>🔥 Streak: {streak} ngày</li>
          </ul>
        </div>

        <button onClick={() => navigate("/dashboard")} className="btn-accent w-full">
          Về Trang Chủ 🏠
        </button>
      </motion.section>
    );
  }

  return (
    <section className="px-4 py-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground">📝 Kiểm Tra Nhanh</h2>
        <span className="text-xs text-muted-foreground font-semibold">
          Câu {index + 1}/{questions.length}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">3 câu hỏi • Không giới hạn thời gian</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-base"
        >
          <p className="text-lg font-bold text-foreground">{q.question}</p>

          <div className="mt-4 flex flex-col gap-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isSelected = i === selected;
              const reveal = selected !== null;
              let cls = "border-border bg-muted/40 hover:bg-muted";
              if (reveal && isCorrect) cls = "border-success bg-success/10 text-success";
              else if (reveal && isSelected && !isCorrect) cls = "border-error bg-error/10 text-error";
              else if (reveal) cls = "border-border bg-muted/30 opacity-60";

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`text-left rounded-card border-2 px-4 py-3 font-medium transition ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-card bg-primary/5 border border-primary/20 p-3 text-sm"
            >
              <p className={`font-bold ${selected === q.correct ? "text-success" : "text-error"}`}>
                {selected === q.correct
                  ? "✅ Chính xác!"
                  : `Đáp án đúng: ${q.options[q.correct]}`}
              </p>
              <p className="mt-1 text-foreground">{q.explanation}</p>
            </motion.div>
          )}

          {selected !== null && (
            <button onClick={handleNext} className="mt-4 w-full btn-primary">
              {isLast ? "Xem Kết Quả →" : "Câu Tiếp →"}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
