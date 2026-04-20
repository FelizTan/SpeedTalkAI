import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./BottomNav";

const TABS_WITH_NAV = new Set([
  "/dashboard",
  "/conversation",
  "/pronunciation",
  "/vocabulary",
  "/progress",
]);

const AppLayout = () => {
  const location = useLocation();
  const showNav = TABS_WITH_NAV.has(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={`flex-1 ${showNav ? "pb-20" : ""}`}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </div>
  );
};

export default AppLayout;
