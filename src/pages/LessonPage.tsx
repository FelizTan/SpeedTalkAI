import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getLessonById } from "@/data/lessons";
import { StepIndicator } from "@/components/lesson/StepIndicator";
import { DialogueStep } from "@/components/lesson/DialogueStep";
import { ShadowingStep } from "@/components/lesson/ShadowingStep";
import { FlashcardStep } from "@/components/lesson/FlashcardStep";
import { AiPracticeStep } from "@/components/lesson/AiPracticeStep";
import { QuizStep } from "@/components/lesson/QuizStep";
import { ErrorToast } from "@/components/common/ErrorToast";

const TOTAL_STEPS = 5;

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = getLessonById(Number(id));

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-5xl">🤔</p>
        <h1 className="mt-3 text-xl font-bold">Không tìm thấy bài học</h1>
        <button onClick={() => navigate("/dashboard")} className="mt-4 btn-primary">
          Về Trang Chủ
        </button>
      </div>
    );
  }

  const handleBack = () => {
    if (step === 0) navigate("/dashboard");
    else setStep((s) => s - 1);
  };
  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StepIndicator
        currentStep={step}
        onBack={handleBack}
        onClose={() => navigate("/dashboard")}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {step === 0 && <DialogueStep lesson={lesson} onNext={handleNext} />}
          {step === 1 && <ShadowingStep lesson={lesson} onNext={handleNext} />}
          {step === 2 && <FlashcardStep lesson={lesson} onNext={handleNext} />}
          {step === 3 && <AiPracticeStep lesson={lesson} onNext={handleNext} onError={setError} />}
          {step === 4 && <QuizStep lesson={lesson} />}
        </motion.div>
      </AnimatePresence>

      <ErrorToast message={error} onDismiss={() => setError(null)} />
    </div>
  );
};

export default LessonPage;
