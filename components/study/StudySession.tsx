'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Flashcard, Deck, DECK_COLORS } from '@/lib/types';
import { FlashCard } from '@/components/flashcard/FlashCard';
import { StudyProgress } from './StudyProgress';
import { ResultsSummary } from './ResultsSummary';
import { Button } from '@/components/ui/Button';
import { useFlashcards } from '@/hooks/useFlashcards';

interface StudySessionProps {
  deck: Deck;
  cards: Flashcard[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function StudySession({ deck, cards }: StudySessionProps) {
  const router = useRouter();
  const { updateLastStudied } = useFlashcards();
  const colors = DECK_COLORS[deck.color];

  const [queue, setQueue] = useState<Flashcard[]>(() => shuffle(cards));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const total = queue.length;
  const currentCard = queue[currentIdx];

  useEffect(() => {
    updateLastStudied(deck.id);
  }, [deck.id, updateLastStudied]);

  const advance = useCallback(
    (wasCorrect: boolean, dir: 'left' | 'right') => {
      if (wasCorrect) setCorrect((c) => c + 1);
      else setIncorrect((c) => c + 1);
      setDirection(dir);
      setIsFlipped(false);

      setTimeout(() => {
        if (currentIdx + 1 >= total) {
          setIsFinished(true);
        } else {
          setCurrentIdx((i) => i + 1);
        }
      }, 150);
    },
    [currentIdx, total]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
      if (e.key === 'ArrowRight' && isFlipped) advance(true, 'right');
      if (e.key === 'ArrowLeft' && isFlipped) advance(false, 'left');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFlipped, isFinished, advance]);

  const restartSession = () => {
    setQueue(shuffle(cards));
    setCurrentIdx(0);
    setIsFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setIsFinished(false);
  };

  const retryWeak = () => {
    const weak = queue.slice(0, currentIdx + 1).filter((_, i) => {
      // Simple heuristic: retry all incorrect cards
      return true;
    });
    setQueue(shuffle(cards));
    setCurrentIdx(0);
    setIsFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <ResultsSummary
        deck={deck}
        total={total}
        correct={correct}
        incorrect={incorrect}
        onRestart={restartSession}
        onRetryWeak={retryWeak}
        onExit={() => router.push(`/deck/${deck.id}`)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">{deck.emoji} {deck.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Click card to flip • Arrow keys to rate</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push(`/deck/${deck.id}`)}>
          <X size={15} /> Exit
        </Button>
      </div>

      {/* Progress */}
      <StudyProgress current={currentIdx} total={total} correct={correct} incorrect={incorrect} />

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: direction === 'right' ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'right' ? -60 : 60 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            <FlashCard
              front={currentCard.front}
              back={currentCard.back}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped((f) => !f)}
              accentFrom={colors.from}
              accentTo={colors.to}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => advance(false, 'left')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-400 hover:bg-rose-500/25 transition-colors font-medium text-sm"
            >
              <ThumbsDown size={16} />
              <span>Needs Review</span>
              <kbd className="text-xs opacity-50">←</kbd>
            </motion.button>

            <button
              onClick={() => setIsFlipped(false)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
              title="Flip back"
            >
              <RotateCcw size={15} />
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => advance(true, 'right')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 transition-colors font-medium text-sm"
            >
              <kbd className="text-xs opacity-50">→</kbd>
              <span>Got It!</span>
              <ThumbsUp size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint when not flipped */}
      {!isFlipped && (
        <p className="text-center text-xs text-slate-600">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">Space</kbd> or tap the card to reveal the answer
        </p>
      )}
    </div>
  );
}
