import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore, type VocabCard } from "@/store/appStore";
import { LESSONS } from "@/data/lessons";
import { SpeakerButton } from "@/components/common/SpeakerButton";

type Tab = "due" | "all" | "mastered";

const isDue = (c: VocabCard) => new Date(c.nextReview).getTime() <= Date.now();
const isMastered = (c: VocabCard) => c.repetitions >= 4 && c.interval >= 21;

const VocabularyPage = () => {
  const navigate = useNavigate();
  const vocabulary = useAppStore((s) => s.vocabulary);
  const updateVocabCard = useAppStore((s) => s.updateVocabCard);
  const addVocabCard = useAppStore((s) => s.addVocabCard);
  const addXP = useAppStore((s) => s.addXP);

  const [tab, setTab] = useState<Tab>("due");
  const [search, setSearch] = useState("");

  const dueCards = useMemo(() => vocabulary.filter(isDue), [vocabulary]);
  const masteredCards = useMemo(() => vocabulary.filter(isMastered), [vocabulary]);
  const stats = {
    total: vocabulary.length,
    due: dueCards.length,
    mastered: masteredCards.length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-foreground">📚 Ngân Hàng Từ Vựng</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {stats.total} từ • {stats.due} cần ôn hôm nay • {stats.mastered} đã thuộc
        </p>
      </header>

      <div className="px-4 mt-2 flex gap-2">
        {([
          ["due", "Ôn Hôm Nay"],
          ["all", "Tất Cả"],
          ["mastered", "Đã Thuộc"],
        ] as [Tab, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={[
              "flex-1 py-2 rounded-button text-sm font-semibold transition",
              tab === k ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 mt-3">
        {vocabulary.length === 0 ? (
          <EmptyState onStart={() => navigate("/lesson/1")} />
        ) : tab === "due" ? (
          dueCards.length === 0
            ? <NoDueState />
            : <ReviewMode cards={dueCards} onRate={updateVocabCard} onComplete={(xp) => addXP(xp)} />
        ) : tab === "all" ? (
          <AllWordsTab
            search={search}
            onSearchChange={setSearch}
            cards={vocabulary}
            onAddSuggested={addVocabCard}
          />
        ) : (
          <MasteredTab cards={masteredCards} />
        )}
      </div>
    </div>
  );
};

// ───────────────────────── REVIEW ─────────────────────────

const ReviewMode = ({
  cards, onRate, onComplete,
}: {
  cards: VocabCard[];
  onRate: (id: string, q: 1 | 2 | 3) => void;
  onComplete: (xp: number) => void;
}) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const card = cards[index];
  const total = cards.length;

  const handleRate = (q: 1 | 2 | 3) => {
    onRate(card.id, q);
    setFlipped(false);
    if (index + 1 >= total) {
      const xp = total * 5;
      onComplete(xp);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="px-4 mt-6">
        <div className="card-base text-center">
          <div className="text-5xl">🎉</div>
          <p className="mt-2 text-xl font-bold">Ôn tập xong!</p>
          <p className="mt-1 text-sm text-muted-foreground">+{total * 5} XP cho công sức của bạn.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 flex flex-col gap-4">
      <p className="text-sm text-center text-muted-foreground">
        {index + 1} / {total} thẻ cần ôn
      </p>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div
        className="relative h-72 [perspective:1200px] cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden] card-base flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-extrabold text-primary-700">{card.word}</p>
            {card.phonetic && <p className="mt-2 text-base text-muted-foreground">{card.phonetic}</p>}
            <p className="mt-6 text-xs text-muted-foreground">Nhấn để xem nghĩa 👆</p>
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] card-base flex flex-col text-center justify-center">
            <p className="text-2xl font-bold">{card.meaning}</p>
            {card.example && <p className="mt-3 text-sm italic text-primary-700">"{card.example}"</p>}
            {card.exampleVi && <p className="mt-1 text-sm text-muted-foreground">{card.exampleVi}</p>}
            <div className="mt-3 flex justify-center" onClick={(e) => e.stopPropagation()}>
              <SpeakerButton text={card.example || card.word} size="md" />
            </div>
          </div>
        </motion.div>
      </div>

      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2"
        >
          <button onClick={() => handleRate(1)} className="rounded-card py-3 bg-error/15 text-error font-bold active:scale-[0.97]">😰 Khó</button>
          <button onClick={() => handleRate(2)} className="rounded-card py-3 bg-warning/15 text-warning font-bold active:scale-[0.97]">😊 Ổn</button>
          <button onClick={() => handleRate(3)} className="rounded-card py-3 bg-success/15 text-success font-bold active:scale-[0.97]">😎 Dễ</button>
        </motion.div>
      )}
    </div>
  );
};

const NoDueState = () => (
  <div className="px-6 mt-8 text-center">
    <div className="text-5xl">✨</div>
    <p className="mt-3 font-bold">Hôm nay không có thẻ nào cần ôn!</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Quay lại vào ngày mai hoặc xem tất cả từ vựng của bạn ở tab "Tất Cả".
    </p>
  </div>
);

// ───────────────────────── ALL ─────────────────────────

const AllWordsTab = ({
  search, onSearchChange, cards, onAddSuggested,
}: {
  search: string;
  onSearchChange: (s: string) => void;
  cards: VocabCard[];
  onAddSuggested: ReturnType<typeof useAppStore.getState>["addVocabCard"];
}) => {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) => c.word.toLowerCase().includes(q) || c.meaning.toLowerCase().includes(q),
    );
  }, [cards, search]);

  const completedLessons = useAppStore((s) => s.completedLessons);
  const ownedWords = useMemo(() => new Set(cards.map((c) => c.word.toLowerCase())), [cards]);
  const suggestions = useMemo(() => {
    const out: { id: string; word: string; phonetic?: string; meaning: string; type?: string; example?: string; exampleVi?: string }[] = [];
    LESSONS
      .filter((l) => completedLessons.includes(l.id))
      .forEach((l) => l.vocabulary.forEach((v) => {
        if (!ownedWords.has(v.word.toLowerCase())) out.push(v);
      }));
    return out.slice(0, 5);
  }, [completedLessons, ownedWords]);

  return (
    <div className="px-4 flex flex-col gap-3">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm từ hoặc nghĩa..."
        className="w-full rounded-button border border-border bg-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <ul className="flex flex-col gap-2">
        {filtered.map((c) => <WordRow key={c.id} card={c} />)}
        {filtered.length === 0 && (
          <li className="text-center text-sm text-muted-foreground py-8">Không tìm thấy từ.</li>
        )}
      </ul>

      {suggestions.length > 0 && (
        <section className="mt-3">
          <h2 className="font-bold text-foreground">Học Thêm Từ Mới</h2>
          <p className="text-xs text-muted-foreground">Gợi ý từ các bài bạn đã hoàn thành.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {suggestions.map((s) => (
              <li key={s.id} className="card-base !p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{s.word}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.meaning}</p>
                </div>
                <button
                  onClick={() => onAddSuggested({
                    id: s.id, word: s.word, phonetic: s.phonetic, meaning: s.meaning,
                    type: s.type, example: s.example, exampleVi: s.exampleVi,
                  })}
                  className="btn-accent !py-1.5 !px-3 text-xs"
                >
                  ➕ Thêm
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const WordRow = ({ card }: { card: VocabCard }) => {
  const [open, setOpen] = useState(false);
  const dueLabel = (() => {
    const ms = new Date(card.nextReview).getTime() - Date.now();
    if (ms <= 0) return "Hôm nay";
    const days = Math.ceil(ms / 86_400_000);
    return `${days} ngày`;
  })();

  return (
    <li className="card-base !p-3">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 text-left">
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{card.word}</p>
          <p className="text-xs text-muted-foreground truncate">
            {card.phonetic && <span className="mr-1">{card.phonetic}</span>} • {card.meaning}
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary-700 rounded-full px-2 py-0.5">
          {card.interval}d
        </span>
        <span className="text-[10px] text-muted-foreground">{dueLabel}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-border text-sm">
              {card.example && <p className="italic text-primary-700">"{card.example}"</p>}
              {card.exampleVi && <p className="text-muted-foreground">{card.exampleVi}</p>}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Lặp: {card.repetitions} • EF: {card.easeFactor.toFixed(2)}
                </span>
                <SpeakerButton text={card.example || card.word} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

// ───────────────────────── MASTERED ─────────────────────────

const MasteredTab = ({ cards }: { cards: VocabCard[] }) => (
  <div className="px-4">
    {cards.length === 0 ? (
      <p className="text-center text-sm text-muted-foreground py-10">
        Chưa có từ nào "đã thuộc". Hãy ôn tập đều đặn nhé!
      </p>
    ) : (
      <ul className="flex flex-col gap-2">
        {cards.map((c) => <WordRow key={c.id} card={c} />)}
      </ul>
    )}
  </div>
);

const EmptyState = ({ onStart }: { onStart: () => void }) => (
  <div className="px-6 mt-10 text-center">
    <div className="text-6xl">📭</div>
    <p className="mt-3 text-lg font-bold">Chưa có từ vựng nào</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Hoàn thành bài học để tự động thêm từ vựng vào ngân hàng!
    </p>
    <button onClick={onStart} className="mt-5 btn-accent w-full">
      Học Bài Đầu Tiên →
    </button>
  </div>
);

export default VocabularyPage;
