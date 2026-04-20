import { motion } from "framer-motion";

interface MicButtonProps {
  listening: boolean;
  onClick: () => void;
  size?: "md" | "lg";
  disabled?: boolean;
  ariaLabel?: string;
}

const SIZE_MAP = {
  md: "w-12 h-12 text-xl",
  lg: "w-20 h-20 text-3xl",
};

export const MicButton = ({
  listening,
  onClick,
  size = "lg",
  disabled,
  ariaLabel = "Nhấn để nói",
}: MicButtonProps) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-pressed={listening}
    className={[
      SIZE_MAP[size],
      "rounded-full flex items-center justify-center shadow-soft transition",
      listening
        ? "bg-error text-error-foreground animate-pulse"
        : "bg-primary text-primary-foreground hover:bg-primary-light",
      disabled && "opacity-40 cursor-not-allowed",
    ].filter(Boolean).join(" ")}
  >
    🎤
  </motion.button>
);
