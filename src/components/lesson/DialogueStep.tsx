import { motion } from "framer-motion";
import type { Lesson } from "@/data/lessons";
import { SpeakerButton } from "@/components/common/SpeakerButton";

interface DialogueStepProps {
  lesson: Lesson;
  onNext: () => void;
}

export const DialogueStep = ({ lesson, onNext }: DialogueStepProps) => (
  <section className="px-4 py-5 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="text-3xl">{lesson.icon}</div>
      <div>
        <h2 className="font-bold text-foreground">{lesson.title}</h2>
        <p className="text-xs text-muted-foreground">{lesson.titleVi}</p>
      </div>
    </div>

    <div className="rounded-card bg-primary/5 border border-primary/20 p-3">
      <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Tình huống</p>
      <p className="mt-1 text-sm italic text-foreground">{lesson.dialogue.situation}</p>
    </div>

    <ul className="flex flex-col gap-3">
      {lesson.dialogue.lines.map((line, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex ${line.isUser ? "justify-end" : "justify-start"}`}
        >
          <div
            className={[
              "max-w-[85%] rounded-card p-3 shadow-soft",
              line.isUser
                ? "bg-primary-100 text-primary-900 rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                {line.speaker}
              </span>
              <SpeakerButton text={line.en} rate={0.85} ariaLabel="Phát câu tiếng Anh" />
            </div>
            <p className="mt-1 text-[15px] leading-snug">{line.en}</p>
            <p className="mt-1 text-[13px] italic text-muted-foreground">{line.vi}</p>
          </div>
        </motion.li>
      ))}
    </ul>

    <button onClick={onNext} className="mt-2 w-full btn-accent">
      Tiếp Theo →
    </button>
  </section>
);
