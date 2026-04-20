import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import PhoneFrame from "@/components/layout/PhoneFrame";
import AppLayout from "@/components/layout/AppLayout";
import { SplashScreen } from "@/components/common/SplashScreen";
import { OfflineBanner } from "@/components/common/OfflineBanner";

import Index from "./pages/Index";
import WelcomePage from "./pages/WelcomePage";
import PlacementTestPage from "./pages/PlacementTestPage";
import DashboardPage from "./pages/DashboardPage";
import LessonPage from "./pages/LessonPage";
import ConversationPage from "./pages/ConversationPage";
import PronunciationPage from "./pages/PronunciationPage";
import VocabularyPage from "./pages/VocabularyPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PhoneFrame>
          <SplashScreen />
          <OfflineBanner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<AppLayout />}>
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/test" element={<PlacementTestPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/conversation" element={<ConversationPage />} />
              <Route path="/pronunciation" element={<PronunciationPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PhoneFrame>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
