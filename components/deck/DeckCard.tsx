'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, MoreVertical, Edit2, Trash2, Play } from 'lucide-react';
import { useState } from 'react';
import { Deck, DECK_COLORS } from '@/lib/types';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { formatDate } from '@/lib/utils';

interface DeckCardProps {
  deck: Deck;
  cardCount: number;
  masteryPercent: number;
  masteredCount: number;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
  index: number;
}

const RING_COLORS: Record<string, string> = {
  violet: '#7c3aed',
  cyan: '#06b6d4',
  rose: '#f43f5e',
  amber: '#f59e0b',
  emerald: '#10b981',
  sky: '#0ea5e9',
};

export function DeckCard({ deck, cardCount, masteryPercent, masteredCount, onEdit, onDelete, index }: DeckCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const colors = DECK_COLORS[deck.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`relative group bg-[#1a1a28] border ${colors.border} rounded-2xl overflow-hidden hover:border-opacity-60 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}
    >
      {/* Color accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${colors.from} ${colors.to}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center text-xl shadow-lg`}>
              {deck.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1">{deck.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {cardCount} {cardCount === 1 ? 'card' : 'cards'}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Deck options"
            >
              <MoreVertical size={15} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-36 bg-[#12121a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(deck); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(deck.id); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{deck.description}</p>

        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Mastery</p>
            <p className={`text-sm font-semibold ${colors.text}`}>
              {masteredCount}/{cardCount} cards
            </p>
          </div>
          <ProgressRing
            percent={masteryPercent}
            size={52}
            strokeWidth={5}
            color={RING_COLORS[deck.color]}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-xs text-slate-600">
            {deck.lastStudied ? `Studied ${formatDate(deck.lastStudied)}` : 'Not studied yet'}
          </span>
          <Link href={`/deck/${deck.id}/study`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${colors.from} ${colors.to} text-white text-xs font-medium shadow-md hover:shadow-lg transition-shadow`}
              disabled={cardCount === 0}
            >
              <Play size={11} fill="currentColor" />
              Study
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
