import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-7xl"
            aria-hidden
          >
            🗣️
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-xl font-extrabold text-primary-700"
          >
            SpeedTalk AI
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
