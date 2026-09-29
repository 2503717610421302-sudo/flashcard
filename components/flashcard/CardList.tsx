'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Flashcard, Deck, DECK_COLORS } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CardListProps {
  cards: Flashcard[];
  deck: Deck;
  onEdit: (card: Flashcard) => void;
  onDelete: (cardId: string) => void;
  onToggleMastered: (cardId: string) => void;
}

function CardItem({
  card,
  deck,
  onEdit,
  onDelete,
  onToggleMastered,
}: {
  card: Flashcard;
  deck: Deck;
  onEdit: (c: Flashcard) => void;
  onDelete: (id: string) => void;
  onToggleMastered: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = DECK_COLORS[deck.color];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-[#1a1a28] border ${card.mastered ? 'border-emerald-500/20' : 'border-white/8'} rounded-xl overflow-hidden transition-colors`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Mastered toggle */}
        <button
          onClick={() => onToggleMastered(card.id)}
          className={`flex-shrink-0 transition-colors ${card.mastered ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-400'}`}
          title={card.mastered ? 'Mark as needs review' : 'Mark as mastered'}
        >
          {card.mastered ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>

        {/* Content preview */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
          <p className="text-sm text-white truncate">{card.front}</p>
          {!expanded && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{card.back}</p>
          )}
        </div>

        {/* Right: badges + actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {card.mastered && <Badge variant="success">Mastered</Badge>}
          {card.reviewCount > 0 && (
            <span className="text-xs text-slate-600">{card.reviewCount}×</span>
          )}
          <button
            onClick={() => onEdit(card)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            title="Edit card"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete card"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/10 transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 pb-4 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className={`text-xs font-medium ${colors.text} uppercase tracking-wider mb-1.5`}>Front</p>
                <p className="text-sm text-slate-200 leading-relaxed">{card.front}</p>
              </div>
              <div>
                <p className={`text-xs font-medium ${colors.text} uppercase tracking-wider mb-1.5`}>Back</p>
                <p className="text-sm text-slate-200 leading-relaxed">{card.back}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CardList({ cards, deck, onEdit, onDelete, onToggleMastered }: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">No cards yet. Add your first card above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            deck={deck}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleMastered={onToggleMastered}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
