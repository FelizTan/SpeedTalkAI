import { useOnlineStatus } from "@/lib/useOnlineStatus";
import { AnimatePresence, motion } from "framer-motion";

export const OfflineBanner = () => {
  const online = useOnlineStatus();
  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50
                     bg-warning/15 text-warning text-xs font-semibold text-center py-1.5"
          role="status"
        >
          📡 Không có mạng — Một số tính năng bị giới hạn
        </motion.div>
      )}
    </AnimatePresence>
  );
};
