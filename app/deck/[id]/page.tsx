'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Play, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useFlashcards } from '@/hooks/useFlashcards';
import { CardList } from '@/components/flashcard/CardList';
import { CardForm } from '@/components/flashcard/CardForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Flashcard, DECK_COLORS } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const RING_COLORS: Record<string, string> = {
  violet: '#7c3aed', cyan: '#06b6d4', rose: '#f43f5e',
  amber: '#f59e0b', emerald: '#10b981', sky: '#0ea5e9',
};

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const { getDeckById, getCardsByDeck, addCard, updateCard, deleteCard, toggleMastered, getDeckStats } = useFlashcards();

  const deck = getDeckById(deckId);
  const cards = getCardsByDeck(deckId);
  const stats = getDeckStats(deckId);

  const [isAddOpen, setAddOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  if (!deck) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Deck not found.</p>
        <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const colors = DECK_COLORS[deck.color];

  const handleAddCard = (data: { front: string; back: string }) => {
    addCard({ deckId, front: data.front, back: data.back });
    setAddOpen(false);
  };

  const handleUpdateCard = (data: { front: string; back: string }) => {
    if (!editingCard) return;
    updateCard({ ...editingCard, front: data.front, back: data.back });
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Delete this card?')) deleteCard(cardId, deckId);
  };

  return (
    <div className="min-h-screen">
      {/* Deck header banner */}
      <div className={`relative bg-gradient-to-r ${colors.from} ${colors.to} border-b border-white/10`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> All Decks
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{deck.emoji}</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{deck.name}</h1>
                <p className="text-white/70 text-sm mt-1">{deck.description}</p>
                {deck.lastStudied && (
                  <p className="text-white/50 text-xs mt-1.5">
                    Last studied {formatDate(deck.lastStudied)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ProgressRing
                percent={stats.masteryPercent}
                size={60}
                strokeWidth={6}
                color="rgba(255,255,255,0.9)"
                trackColor="rgba(255,255,255,0.2)"
              />
              <div className="text-white">
                <p className="text-2xl font-bold">{stats.mastered}/{stats.total}</p>
                <p className="text-xs text-white/60">Mastered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-slate-500" />
            <span className="text-slate-400 text-sm font-medium">
              {cards.length} {cards.length === 1 ? 'Card' : 'Cards'}
            </span>
            {stats.masteryPercent > 0 && (
              <Badge variant="success">{stats.masteryPercent}% mastered</Badge>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={() => setAddOpen(true)}>
              <Plus size={15} />
              Add Card
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(`/deck/${deckId}/study`)}
              disabled={cards.length === 0}
            >
              <Play size={14} fill="currentColor" />
              Study Now
            </Button>
          </div>
        </div>

        {/* Card list */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <CardList
            cards={cards}
            deck={deck}
            onEdit={(card) => setEditingCard(card)}
            onDelete={handleDeleteCard}
            onToggleMastered={(cardId) => toggleMastered(cardId, deckId)}
          />
        </motion.div>
      </main>

      {/* Add Card Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)} title="Add New Card">
        <CardForm onSubmit={handleAddCard} onCancel={() => setAddOpen(false)} />
      </Modal>

      {/* Edit Card Modal */}
      <Modal isOpen={!!editingCard} onClose={() => setEditingCard(null)} title="Edit Card">
        {editingCard && (
          <CardForm
            initialData={editingCard}
            onSubmit={handleUpdateCard}
            onCancel={() => setEditingCard(null)}
            isEditing
          />
        )}
      </Modal>
    </div>
  );
}
