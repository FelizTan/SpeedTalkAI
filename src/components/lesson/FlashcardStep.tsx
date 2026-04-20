import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lesson } from "@/data/lessons";
import { useAppStore } from "@/store/appStore";
import { SpeakerButton } from "@/components/common/SpeakerButton";

interface FlashcardStepProps {
  lesson: Lesson;
  onNext: () => void;
}

export const FlashcardStep = ({ lesson, onNext }: FlashcardStepProps) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const cards = lesson.vocabulary;
  const card = cards[index];
  const addVocabCard = useAppStore((s) => s.addVocabCard);

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, i + 1));
  };
  const handleAdd = () => {
    addVocabCard({
      id: card.id,
      word: card.word,
      phonetic: card.phonetic,
      meaning: card.meaning,
      type: card.type,
      example: card.example,
      exampleVi: card.exampleVi,
    });
    setAddedIds((prev) => new Set(prev).add(card.id));
  };

  const isLast = index === cards.length - 1;
  const added = addedIds.has(card.id);

  return (
    <section className="px-4 py-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground">📚 Từ Vựng Quan Trọng</h2>
        <span className="text-xs text-muted-foreground font-semibold">
          Thẻ {index + 1}/{cards.length}
        </span>
      </div>

      <div
        className="relative h-72 [perspective:1200px] cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        aria-label="Lật thẻ"
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] card-base flex flex-col
                       items-center justify-center text-center"
          >
            <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
              {card.type}
            </span>
            <p className="mt-3 text-3xl font-extrabold text-primary-700">{card.word}</p>
            <p className="mt-2 text-base text-muted-foreground">{card.phonetic}</p>
            <p className="mt-6 text-xs text-muted-foreground">Nhấn để xem nghĩa 👆</p>
          </div>
          {/* BACK */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]
                       card-base flex flex-col text-center justify-center"
          >
            <p className="text-2xl font-bold text-foreground">{card.meaning}</p>
            <p className="mt-4 text-sm italic text-primary-700">"{card.example}"</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.exampleVi}</p>
            <div className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
              <SpeakerButton text={card.example} rate={0.9} size="md" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-1.5">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition ${i === index ? "bg-primary w-5" : "bg-muted"}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={goPrev} disabled={index === 0} className="btn-ghost disabled:opacity-40">
          ← Trước
        </button>
        <button onClick={isLast ? onNext : goNext} className="btn-primary">
          {isLast ? "Tiếp Theo →" : "Tiếp →"}
        </button>
      </div>

      <button onClick={handleAdd} disabled={added} className="btn-accent w-full disabled:opacity-60">
        <AnimatePresence mode="wait">
          <motion.span
            key={added ? "added" : "add"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {added ? "✓ Đã thêm vào từ điển" : "➕ Thêm vào từ điển"}
          </motion.span>
        </AnimatePresence>
      </button>
    </section>
  );
};
