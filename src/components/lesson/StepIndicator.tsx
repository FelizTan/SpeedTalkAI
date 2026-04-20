import { motion } from "framer-motion";

const STEP_NAMES = ["Hội Thoại", "Shadowing", "Từ Vựng", "Luyện AI", "Kiểm Tra"];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onClose: () => void;
}

export const StepIndicator = ({
  currentStep,
  totalSteps = STEP_NAMES.length,
  onBack,
  onClose,
}: StepIndicatorProps) => (
  <header className="px-4 pt-4 pb-3 bg-surface border-b border-border sticky top-0 z-30">
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        aria-label="Quay lại"
        className="w-9 h-9 rounded-full bg-muted hover:bg-muted/70 active:scale-95 transition"
      >
        ←
      </button>
      <p className="text-sm font-semibold text-foreground">
        {STEP_NAMES[currentStep] ?? `Bước ${currentStep + 1}`}
      </p>
      <button
        onClick={onClose}
        aria-label="Đóng bài học"
        className="w-9 h-9 rounded-full bg-muted hover:bg-muted/70 active:scale-95 transition"
      >
        ✕
      </button>
    </div>

    <div className="mt-3 flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <motion.div
            key={i}
            layout
            className={[
              "flex-1 h-1.5 rounded-full",
              done ? "bg-success" : active ? "bg-primary" : "bg-muted",
            ].join(" ")}
          />
        );
      })}
    </div>
  </header>
);
