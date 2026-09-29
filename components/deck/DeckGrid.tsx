'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { Deck } from '@/lib/types';
import { DeckCard } from './DeckCard';
import { useFlashcards } from '@/hooks/useFlashcards';

interface DeckGridProps {
  decks: Deck[];
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
}

export function DeckGrid({ decks, onEdit, onDelete }: DeckGridProps) {
  const { getDeckStats } = useFlashcards();

  if (decks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5">
          <Layers size={32} className="text-violet-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No decks yet</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Create your first flashcard deck to start studying. Click the &quot;New Deck&quot; button above.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck, i) => {
        const stats = getDeckStats(deck.id);
        return (
          <DeckCard
            key={deck.id}
            deck={deck}
            cardCount={stats.total}
            masteryPercent={stats.masteryPercent}
            masteredCount={stats.mastered}
            onEdit={onEdit}
            onDelete={onDelete}
            index={i}
          />
        );
      })}
    </div>
  );
}
