import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";

/**
 * Routes the user based on onboarding state:
 * - Not onboarded → /welcome
 * - Onboarded     → /dashboard
 */
const Index = () => {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  return <Navigate to={hasOnboarded ? "/dashboard" : "/welcome"} replace />;
};

export default Index;
