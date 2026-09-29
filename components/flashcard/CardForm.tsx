'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Flashcard } from '@/lib/types';

interface CardFormProps {
  onSubmit: (data: { front: string; back: string }) => void;
  onCancel: () => void;
  initialData?: Partial<Flashcard>;
  isEditing?: boolean;
}

export function CardForm({ onSubmit, onCancel, initialData, isEditing = false }: CardFormProps) {
  const [front, setFront] = useState(initialData?.front || '');
  const [back, setBack] = useState(initialData?.back || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onSubmit({ front: front.trim(), back: back.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="card-front" className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
          Front (Question) *
        </label>
        <textarea
          id="card-front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Enter the question or term..."
          rows={3}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
        />
        <p className="text-xs text-slate-600 mt-1">{front.length}/300 characters</p>
      </div>

      <div>
        <label htmlFor="card-back" className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
          Back (Answer) *
        </label>
        <textarea
          id="card-back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Enter the answer or definition..."
          rows={4}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
        />
        <p className="text-xs text-slate-600 mt-1">{back.length}/500 characters</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={!front.trim() || !back.trim()}
        >
          {isEditing ? 'Save Card' : 'Add Card'}
        </Button>
      </div>
    </form>
  );
}
