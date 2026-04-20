import { speak } from "@/lib/tts";

interface SpeakerButtonProps {
  text: string;
  rate?: number;
  className?: string;
  ariaLabel?: string;
  size?: "sm" | "md";
}

export const SpeakerButton = ({
  text,
  rate = 0.9,
  className = "",
  ariaLabel = "Phát âm thanh",
  size = "sm",
}: SpeakerButtonProps) => (
  <button
    type="button"
    onClick={() => speak(text, { rate })}
    aria-label={ariaLabel}
    className={[
      "inline-flex items-center justify-center rounded-full bg-primary/10 text-primary-700 hover:bg-primary/20 transition active:scale-95",
      size === "sm" ? "w-7 h-7 text-sm" : "w-9 h-9 text-base",
      className,
    ].join(" ")}
  >
    🔊
  </button>
);
