import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";

const TABS = [
  { to: "/dashboard",     icon: "🏠", label: "Trang Chủ" },
  { to: "/conversation",  icon: "💬", label: "Hội Thoại" },
  { to: "/pronunciation", icon: "🎤", label: "Phát Âm" },
  { to: "/vocabulary",    icon: "📚", label: "Từ Vựng" },
  { to: "/progress",      icon: "📊", label: "Tiến Độ" },
];

const BottomNav = () => {
  const dueCount = useAppStore((s) =>
    s.vocabulary.filter((c) => new Date(c.nextReview).getTime() <= Date.now()).length,
  );

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]
                 bg-surface/95 backdrop-blur border-t border-border z-40"
      aria-label="Bottom navigation"
    >
      <ul className="grid grid-cols-5 px-1 py-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {TABS.map((tab) => {
          const showBadge = tab.to === "/vocabulary" && dueCount > 0;
          return (
            <li key={tab.to} className="flex">
              <NavLink to={tab.to} className="flex-1">
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className={[
                      "relative flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-button transition-colors",
                      isActive ? "text-primary-700" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    <span className={isActive ? "text-2xl scale-110 transition-transform" : "text-xl"}>
                      {tab.icon}
                    </span>
                    {showBadge && (
                      <span className="absolute top-0 right-3 min-w-[16px] h-4 px-1 rounded-full bg-error text-error-foreground text-[10px] font-bold flex items-center justify-center">
                        {dueCount > 9 ? "9+" : dueCount}
                      </span>
                    )}
                    <span className={`text-[11px] font-medium ${isActive ? "text-primary-700" : ""}`}>
                      {tab.label}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
