'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Deck, DeckColor, DECK_COLORS } from '@/lib/types';

const EMOJIS = ['⚡', '⚛️', '🎨', '🧠', '📚', '🔬', '🌍', '🎯', '🚀', '💡', '🎵', '🏛️', '💻', '🌱', '🔥'];

const COLOR_OPTIONS: DeckColor[] = ['violet', 'cyan', 'rose', 'amber', 'emerald', 'sky'];

interface DeckFormProps {
  onSubmit: (data: Omit<Deck, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Deck>;
  isEditing?: boolean;
}

export function DeckForm({ onSubmit, onCancel, initialData, isEditing = false }: DeckFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [emoji, setEmoji] = useState(initialData?.emoji || '📚');
  const [color, setColor] = useState<DeckColor>(initialData?.color || 'violet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      emoji,
      color,
      lastStudied: initialData?.lastStudied,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Emoji picker */}
      <div>
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Icon</label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all duration-150 ${
                emoji === e
                  ? 'bg-violet-600/40 border-2 border-violet-500 scale-110'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="deck-name" className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
          Deck Name *
        </label>
        <input
          id="deck-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. JavaScript Fundamentals"
          maxLength={50}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="deck-desc" className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
          Description
        </label>
        <textarea
          id="deck-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this deck..."
          rows={2}
          maxLength={150}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
        />
      </div>

      {/* Color */}
      <div>
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Color</label>
        <div className="flex gap-2.5">
          {COLOR_OPTIONS.map((c) => {
            const cols = DECK_COLORS[c];
            return (
              <motion.button
                key={c}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${cols.from} ${cols.to} transition-all ${
                  color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a28] scale-110' : 'opacity-60 hover:opacity-90'
                }`}
                title={c}
              />
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={!name.trim()}>
          {isEditing ? 'Save Changes' : 'Create Deck'}
        </Button>
      </div>
    </form>
  );
}
