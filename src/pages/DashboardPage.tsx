import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore, hasStudiedToday } from "@/store/appStore";
import { LESSONS, getNextLesson } from "@/data/lessons";

const QUOTES = [
  "Mỗi ngày một chút, giỏi tiếng Anh là chuyện nhỏ.",
  "Đừng sợ sai, sai là cách nhanh nhất để giỏi.",
  "Người giỏi tiếng Anh không thông minh hơn — họ chỉ luyện đều hơn.",
  "Hôm nay khó, ngày mai dễ, ngày kia thật tuyệt vời.",
  "15 phút mỗi ngày = 91 giờ mỗi năm. Hãy bắt đầu!",
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35, ease: "easeOut" as const },
});

const DashboardPage = () => {
  const navigate = useNavigate();
  const userName = useAppStore((s) => s.userName);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const totalXP = useAppStore((s) => s.totalXP);
  const streak = useAppStore((s) => s.streak);
  const lastStudyDate = useAppStore((s) => s.lastStudyDate);

  const studiedToday = hasStudiedToday(lastStudyDate);
  const nextLesson = getNextLesson(completedLessons);
  const completionPct = Math.round((completedLessons.length / LESSONS.length) * 100);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        {...fadeUp(0)}
        className="bg-gradient-header text-white px-5 pt-10 pb-12 rounded-b-modal"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold leading-tight">
              Xin chào, {userName || "Bạn"}! 👋
            </h1>
            <p className="text-sm text-primary-200 mt-1">
              Hãy tiếp tục học hôm nay!
            </p>
          </div>

          <button
            onClick={() => navigate("/progress")}
            className="bg-white/20 hover:bg-white/30 transition rounded-full px-3 py-1.5
                       text-sm font-bold flex items-center gap-1"
            aria-label="Streak"
          >
            🔥 <span>{streak}</span>
          </button>
        </div>

        {/* Daily goal */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-primary-200">
            <span>Mục tiêu hôm nay</span>
            <span className="font-semibold text-white">
              {studiedToday ? "✅ Hoàn thành!" : "0/1 bài"}
            </span>
          </div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: studiedToday ? "100%" : "0%" }}
              transition={{ duration: 0.6 }}
              className="h-full bg-accent-400"
            />
          </div>
        </div>
      </motion.header>

      {/* Today's lesson card (overlapping) */}
      <motion.section
        {...fadeUp(0.05)}
        className="mx-4 -mt-6 bg-surface rounded-modal shadow-pop p-5 relative z-10"
      >
        {nextLesson ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary-700 uppercase tracking-wider">
                Bài hôm nay
              </span>
              <span className="text-[11px] text-muted-foreground">
                ⏱ {nextLesson.estimatedTime} phút
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className={`text-4xl w-14 h-14 rounded-card bg-gradient-to-br ${nextLesson.color}
                              flex items-center justify-center shadow-soft`}>
                <span>{nextLesson.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{nextLesson.title}</p>
                <p className="text-sm text-muted-foreground truncate">{nextLesson.titleVi}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              className="mt-4 w-full btn-primary bg-primary-700 hover:bg-primary-600"
            >
              Học Ngay 🚀
            </button>
          </>
        ) : (
          <div className="text-center py-3">
            <div className="text-4xl">🎉</div>
            <p className="mt-2 font-bold text-foreground">
              Bạn đã hoàn thành tất cả bài học!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Hãy ôn luyện hoặc luyện hội thoại với AI nhé.
            </p>
          </div>
        )}
      </motion.section>

      {/* Stats grid */}
      <motion.section {...fadeUp(0.1)} className="mx-4 mt-5 grid grid-cols-2 gap-3">
        <StatCard icon="🔥" value={streak} label="Ngày Liên Tiếp" tone="bg-orange-50 text-orange-700" />
        <StatCard icon="⭐" value={totalXP} label="Điểm XP" tone="bg-yellow-50 text-yellow-700" />
        <StatCard icon="📖" value={completedLessons.length} label="Bài Đã Học" tone="bg-blue-50 text-blue-700" />
        <StatCard icon="🎯" value={`${completionPct}%`} label="Hoàn Thành" tone="bg-purple-50 text-purple-700" />
      </motion.section>

      {/* Lesson map */}
      <motion.section {...fadeUp(0.15)} className="mt-6">
        <h2 className="px-4 font-bold text-foreground">Lộ Trình 30 Ngày</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {LESSONS.map((l, idx) => {
            const done = completedLessons.includes(l.id);
            const available = !done && (idx === 0 || completedLessons.includes(LESSONS[idx - 1].id));
            const locked = !done && !available;

            return (
              <button
                key={l.id}
                onClick={() => !locked && navigate(`/lesson/${l.id}`)}
                disabled={locked}
                className={[
                  "shrink-0 w-20 rounded-card p-2.5 border text-center transition",
                  done && "bg-success/10 border-success/30",
                  available && "bg-accent/10 border-accent/40 hover:scale-105",
                  locked && "bg-muted border-border opacity-60",
                ].filter(Boolean).join(" ")}
              >
                <div className="text-[11px] font-bold text-muted-foreground">Day {l.day}</div>
                <div className="mt-1 text-2xl">{l.icon}</div>
                <div className="mt-1 text-xs font-semibold">
                  {done ? "✅" : locked ? "🔒" : "▶"}
                </div>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Quick actions */}
      <motion.section {...fadeUp(0.2)} className="mx-4 mt-6">
        <h2 className="font-bold text-foreground">Luyện Tập Nhanh</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <QuickAction emoji="🤖" label="Chat AI" onClick={() => navigate("/conversation")} />
          <QuickAction emoji="🎤" label="Phát Âm" onClick={() => navigate("/pronunciation")} />
          <QuickAction emoji="📚" label="Từ Vựng" onClick={() => navigate("/vocabulary")} />
        </div>
      </motion.section>

      {/* Quote */}
      <motion.p {...fadeUp(0.25)} className="mt-7 mb-2 px-6 italic text-center text-sm text-muted-foreground">
        “{quote}”
      </motion.p>
    </div>
  );
};

const StatCard = ({
  icon, value, label, tone,
}: { icon: string; value: number | string; label: string; tone: string }) => (
  <div className={`rounded-card p-4 ${tone}`}>
    <div className="text-2xl">{icon}</div>
    <div className="mt-1 text-2xl font-extrabold leading-none">{value}</div>
    <div className="mt-1 text-xs font-medium opacity-80">{label}</div>
  </div>
);

const QuickAction = ({
  emoji, label, onClick,
}: { emoji: string; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-surface border border-border rounded-card py-3 flex flex-col items-center
               gap-1 shadow-soft hover:bg-muted/40 active:scale-95 transition"
  >
    <span className="text-2xl">{emoji}</span>
    <span className="text-xs font-semibold text-foreground">{label}</span>
  </button>
);

export default DashboardPage;
