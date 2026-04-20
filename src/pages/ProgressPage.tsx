import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useAppStore } from "@/store/appStore";
import { LESSONS } from "@/data/lessons";

interface LevelInfo {
  key: "starter" | "elementary" | "pre_intermediate";
  label: string;
  emoji: string;
  min: number;
  next: number;
}

const LEVELS: LevelInfo[] = [
  { key: "starter",          label: "Người Mới Bắt Đầu", emoji: "🌱", min: 0,    next: 500 },
  { key: "elementary",       label: "Cơ Bản",            emoji: "📚", min: 500,  next: 1500 },
  { key: "pre_intermediate", label: "Trên Cơ Bản",       emoji: "🚀", min: 1500, next: 3000 },
];

const computeLevel = (xp: number): LevelInfo => {
  if (xp >= 1500) return LEVELS[2];
  if (xp >= 500)  return LEVELS[1];
  return LEVELS[0];
};

const TIPS = [
  "Học mỗi ngày 15 phút tốt hơn 2 tiếng mỗi tuần.",
  "Nói to tiếng Anh khi luyện — não bạn ghi nhớ nhanh hơn.",
  "Đừng dịch từng từ — hãy hiểu cả câu.",
  "Sai nhiều = giỏi nhanh. Đừng sợ phát âm sai!",
];

const ProgressPage = () => {
  const userName = useAppStore((s) => s.userName);
  const totalXP = useAppStore((s) => s.totalXP);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const streak = useAppStore((s) => s.streak);
  const bestStreak = useAppStore((s) => s.bestStreak);
  const studyHistory = useAppStore((s) => s.studyHistory);
  const vocabulary = useAppStore((s) => s.vocabulary);

  const level = computeLevel(totalXP);
  const xpInLevel = totalXP - level.min;
  const xpForLevel = level.next - level.min;
  const levelProgress = Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));
  const studyDays = Object.keys(studyHistory).length;
  const tip = TIPS[new Date().getDay() % TIPS.length];

  // Last 30 days dot grid
  const last30 = useMemo(() => {
    const days: { key: string; date: Date; studied: boolean; isToday: boolean }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      days.push({ key, date: d, studied: !!studyHistory[key], isToday: i === 0 });
    }
    return days;
  }, [studyHistory]);

  // Last 7 days bar chart
  const weeklyData = useMemo(() => {
    const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const result: { day: string; lessons: number; key: string }[] = [];
    const today = new Date();
    // Build Mon..Sun for last 7 days ending today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      result.push({
        day: labels[d.getDay()],
        lessons: studyHistory[key] ? 1 : 0,
        key,
      });
    }
    return result;
  }, [studyHistory]);

  const badges = useMemo(() => [
    { key: "first",   emoji: "🌱", name: "Bước Đầu Tiên",     desc: "Hoàn thành bài học đầu tiên",  unlocked: completedLessons.length >= 1 },
    { key: "streak7", emoji: "🔥", name: "7 Ngày Liên Tiếp",  desc: "Học 7 ngày không nghỉ",        unlocked: streak >= 7 || bestStreak >= 7 },
    { key: "vocab50", emoji: "📚", name: "Học Giả Từ Vựng",    desc: "Thu thập 50 từ vựng",         unlocked: vocabulary.length >= 50 },
    { key: "lesson5", emoji: "💬", name: "Chuyên Gia Giao Tiếp", desc: "Hoàn thành 5 bài học",     unlocked: completedLessons.length >= 5 },
    { key: "all10",   emoji: "🏆", name: "Hoàn Thành Xuất Sắc", desc: "Hoàn thành toàn bộ 10 bài", unlocked: completedLessons.length >= 10 },
    { key: "xp1000",  emoji: "⭐", name: "Điểm Cao",           desc: "Đạt 1000 điểm XP",            unlocked: totalXP >= 1000 },
  ], [completedLessons.length, streak, bestStreak, vocabulary.length, totalXP]);

  const handleShare = async () => {
    const text =
`🎉 SpeedTalk AI — Tiến độ của ${userName || "tôi"}
🔥 Streak: ${streak} ngày (kỷ lục ${bestStreak})
⭐ XP: ${totalXP}
📖 ${completedLessons.length}/${LESSONS.length} bài
📚 ${vocabulary.length} từ vựng`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
    } catch {/* noop */}
  };

  return (
    <div className="min-h-screen flex flex-col px-4 pt-6 pb-6 gap-5">
      <h1 className="text-xl font-bold text-foreground">📊 Tiến Độ Của Bạn</h1>

      {/* Level card */}
      <section className="rounded-modal bg-gradient-hero text-white p-5 shadow-pop">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-200 font-semibold uppercase tracking-wider">Cấp độ</p>
            <p className="text-xl font-bold">{level.label}</p>
          </div>
          <div className="text-4xl">{level.emoji}</div>
        </div>
        <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.7 }}
          />
        </div>
        <p className="mt-2 text-xs text-primary-200">
          {xpInLevel} / {xpForLevel} XP đến cấp tiếp theo
        </p>
      </section>

      {/* Streak calendar */}
      <section className="card-base">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">🔥 Chuỗi Học Liên Tiếp</h2>
          <span className="text-sm font-semibold">{streak} ngày</span>
        </div>
        <div className="mt-3 grid grid-cols-10 gap-1.5">
          {last30.map((d) => (
            <span
              key={d.key}
              title={d.date.toLocaleDateString("vi-VN")}
              className={[
                "w-full aspect-square rounded-md",
                d.isToday ? "bg-accent ring-2 ring-accent/40"
                  : d.studied ? "bg-primary"
                    : "bg-muted",
              ].join(" ")}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Streak hiện tại: <strong>{streak}</strong> • Kỷ lục: <strong>{bestStreak}</strong>
        </p>
      </section>

      {/* Weekly chart */}
      <section className="card-base">
        <h2 className="font-bold">Bài Học Trong 7 Ngày Qua</h2>
        <div className="mt-3 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`${v} bài`, "Đã học"]}
              />
              <Bar dataKey="lessons" radius={[8, 8, 0, 0]}>
                {weeklyData.map((d, i) => (
                  <Cell key={i} fill={d.lessons > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Stats summary */}
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard label="Bài đã học"  value={`${completedLessons.length}/${LESSONS.length}`} />
        <SummaryCard label="Tổng XP"     value={totalXP} />
        <SummaryCard label="Từ vựng"     value={vocabulary.length} />
        <SummaryCard label="Ngày học"    value={studyDays} />
      </section>

      {/* Badges */}
      <section>
        <h2 className="font-bold">🏆 Thành Tích</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.key}
              title={b.desc}
              className={[
                "card-base !p-3 text-center transition",
                b.unlocked ? "" : "opacity-40 grayscale",
              ].join(" ")}
            >
              <div className="text-3xl">{b.emoji}</div>
              <p className="mt-1 text-xs font-bold">{b.name}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                {b.unlocked ? "Đã mở!" : `🔒 ${b.desc}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-base">
        <p className="text-sm italic text-muted-foreground">💡 {tip}</p>
        <button onClick={handleShare} className="mt-3 btn-primary w-full">
          📤 Chia Sẻ Tiến Độ
        </button>
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="card-base !p-3 text-center">
    <p className="text-2xl font-extrabold text-primary-700">{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
  </div>
);

export default ProgressPage;
