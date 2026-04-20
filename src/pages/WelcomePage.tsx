import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FEATURE_PILLS = [
  "🤖 AI Tutor 24/7",
  "🎯 Tình huống thực",
  "🎤 Luyện phát âm",
  "📈 Theo dõi tiến độ",
];

const STATS = [
  { value: "50,000+", label: "Học viên" },
  { value: "4.9★",     label: "Đánh giá" },
  { value: "30 ngày", label: "Hoàn thành" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: "easeOut" as const },
});

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero text-white flex flex-col px-6 pt-12 pb-8">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.05 }}
        className="text-center"
      >
        <div className="text-[80px] leading-none select-none" role="img" aria-label="logo">🗣️</div>
      </motion.div>

      {/* Titles */}
      <motion.h1 {...fadeUp(0.15)} className="mt-3 text-center text-[36px] font-extrabold tracking-tight">
        SpeedTalk AI
      </motion.h1>
      <motion.p {...fadeUp(0.25)} className="mt-1 text-center text-base text-primary-200">
        Học tiếng Anh giao tiếp cấp tốc
      </motion.p>
      <motion.p {...fadeUp(0.35)} className="mt-1 text-center text-[13px] text-primary-300">
        Chỉ 15 phút/ngày • Giao tiếp sau 30 ngày
      </motion.p>

      {/* Feature pills */}
      <motion.div {...fadeUp(0.45)} className="mt-6 flex flex-wrap justify-center gap-2">
        {FEATURE_PILLS.map((pill) => (
          <span
            key={pill}
            className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm"
          >
            {pill}
          </span>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.55)} className="mt-6 grid grid-cols-3 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white/15 rounded-card p-3 text-center backdrop-blur-sm"
          >
            <div className="text-lg font-bold whitespace-pre-line">{s.value}</div>
            <div className="text-xs text-primary-200">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="flex-1" />

      {/* CTAs */}
      <motion.button
        {...fadeUp(0.65)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/test")}
        className="w-full bg-accent hover:bg-accent-light text-accent-foreground
                   font-bold text-lg py-4 rounded-modal shadow-lg"
      >
        Bắt Đầu Miễn Phí 🚀
      </motion.button>

      <motion.button
        {...fadeUp(0.75)}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/dashboard")}
        className="mt-3 w-full bg-white/15 border border-white/30 text-white
                   font-semibold py-4 rounded-modal"
      >
        Đã có tài khoản? Đăng nhập
      </motion.button>

      <motion.p {...fadeUp(0.85)} className="mt-4 text-center text-xs text-primary-300">
        Không cần thẻ tín dụng • Miễn phí mãi mãi
      </motion.p>
    </div>
  );
};

export default WelcomePage;
