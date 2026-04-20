import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";

const AVATAR_OPTIONS = ["🧑‍🎓", "👩‍💻", "👨‍🏫", "🧑‍🚀", "🦊"];
const LEVEL_LABELS: Record<string, string> = {
  starter: "Người Mới Bắt Đầu 🌱",
  elementary: "Cơ Bản 📚",
  pre_intermediate: "Trên Cơ Bản 🚀",
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const userName = useAppStore((s) => s.userName);
  const setUserName = useAppStore((s) => s.setUserName);
  const avatar = useAppStore((s) => s.avatar);
  const setAvatar = useAppStore((s) => s.setAvatar);
  const userLevel = useAppStore((s) => s.userLevel);
  const geminiApiKey = useAppStore((s) => s.geminiApiKey);
  const openrouterApiKey = useAppStore((s) => s.openrouterApiKey);
  const setApiKey = useAppStore((s) => s.setApiKey);
  const resetAllData = useAppStore((s) => s.resetAllData);

  const [name, setName] = useState(userName);
  const [confirmReset, setConfirmReset] = useState(false);

  const exportData = () => {
    const data = JSON.stringify(useAppStore.getState(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speedtalk-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 pt-4 pb-8 gap-5">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
          className="w-9 h-9 rounded-full bg-muted hover:bg-muted/70"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-foreground">⚙️ Cài Đặt</h1>
      </header>

      {/* Profile */}
      <section className="card-base">
        <h2 className="font-bold">Hồ Sơ</h2>
        <div className="mt-3 flex items-center gap-4">
          <div className="text-5xl">{avatar}</div>
          <div className="flex-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setUserName(name.trim())}
              placeholder="Tên của bạn"
              className="w-full rounded-button border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Cấp độ: <strong>{LEVEL_LABELS[userLevel]}</strong>
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {AVATAR_OPTIONS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={[
                "text-2xl w-11 h-11 rounded-full flex items-center justify-center border-2 transition",
                avatar === a ? "border-primary bg-primary/10" : "border-border bg-muted hover:bg-muted/70",
              ].join(" ")}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* API Keys */}
      <section className="card-base">
        <h2 className="font-bold">🔑 Cài Đặt AI</h2>
        <div className="mt-2 rounded-card bg-warning/10 border border-warning/30 p-3 text-xs">
          API Key được lưu trên thiết bị của bạn, không gửi lên server. An toàn 100%.
        </div>

        <ApiKeyField
          label="Gemini API Key (Miễn phí)"
          placeholder="AIzaSy..."
          value={geminiApiKey}
          onSave={(v) => setApiKey("gemini", v)}
          helpUrl="https://aistudio.google.com/app/apikey"
          helpText="Lấy key miễn phí tại aistudio.google.com →"
          guide={[
            "Vào aistudio.google.com",
            "Đăng nhập bằng Google",
            "Nhấn 'Get API Key'",
            "Nhấn 'Create API Key'",
            "Copy và paste vào đây",
          ]}
        />

        <div className="mt-4">
          <ApiKeyField
            label="OpenRouter API Key (Dự phòng)"
            placeholder="sk-or-..."
            value={openrouterApiKey}
            onSave={(v) => setApiKey("openrouter", v)}
            helpUrl="https://openrouter.ai/keys"
            helpText="Lấy key tại openrouter.ai → Models → Free"
          />
        </div>
      </section>

      {/* Data */}
      <section className="card-base">
        <h2 className="font-bold">Dữ Liệu</h2>
        <button onClick={exportData} className="mt-3 btn-ghost w-full">📤 Xuất Dữ Liệu (JSON)</button>
        <button
          onClick={() => setConfirmReset(true)}
          className="mt-2 w-full rounded-button bg-error text-error-foreground font-semibold py-3 active:scale-[0.97]"
        >
          🗑 Xoá Dữ Liệu Học Tập
        </button>
      </section>

      {/* About */}
      <section className="card-base">
        <h2 className="font-bold">Về SpeedTalk AI</h2>
        <p className="mt-1 text-sm text-muted-foreground">Phiên bản 1.0.0</p>
        <p className="text-sm text-muted-foreground">SpeedTalk AI — Học tiếng Anh giao tiếp cấp tốc.</p>
        <p className="text-xs text-muted-foreground mt-2">Powered by Google Gemini AI</p>
      </section>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmReset && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-surface rounded-modal p-5 max-w-sm w-full"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            >
              <p className="text-lg font-bold">Xoá toàn bộ dữ liệu?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Hành động này không thể hoàn tác. Bạn sẽ mất XP, streak, từ vựng và cài đặt.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setConfirmReset(false)} className="btn-ghost">Huỷ</button>
                <button
                  onClick={() => { resetAllData(); setConfirmReset(false); navigate("/welcome"); }}
                  className="rounded-button bg-error text-error-foreground font-semibold py-3 active:scale-[0.97]"
                >
                  Xoá hết
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ApiKeyField = ({
  label, placeholder, value, onSave, helpUrl, helpText, guide,
}: {
  label: string;
  placeholder: string;
  value: string;
  onSave: (v: string) => void;
  helpUrl: string;
  helpText: string;
  guide?: string[];
}) => {
  const [draft, setDraft] = useState(value);
  const [show, setShow] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const connected = !!value;

  return (
    <div>
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="mt-1 flex gap-2">
        <div className="flex-1 relative">
          <input
            type={show ? "text" : "password"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-button border border-border bg-surface px-3 py-2 pr-9 text-sm
                       focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Ẩn key" : "Hiện key"}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-muted text-muted-foreground"
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>
        <button onClick={() => onSave(draft.trim())} className="btn-primary !py-2 !px-3 text-sm">
          Lưu
        </button>
      </div>
      <p className={`mt-1 text-xs font-semibold ${connected ? "text-success" : "text-error"}`}>
        {connected ? "✅ Đã kết nối" : "❌ Chưa có key"}
      </p>
      <a href={helpUrl} target="_blank" rel="noopener noreferrer" className="block mt-1 text-xs text-primary-700 underline">
        {helpText}
      </a>
      {guide && (
        <div className="mt-2">
          <button onClick={() => setOpenGuide((o) => !o)} className="text-xs text-muted-foreground underline">
            {openGuide ? "Ẩn" : "Xem"} hướng dẫn từng bước
          </button>
          {openGuide && (
            <ol className="mt-2 list-decimal list-inside text-xs text-muted-foreground space-y-0.5">
              {guide.map((g, i) => <li key={i}>{g}</li>)}
            </ol>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
