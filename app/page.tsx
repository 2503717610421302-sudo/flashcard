'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Zap, Star } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { DeckGrid } from '@/components/deck/DeckGrid';
import { DeckForm } from '@/components/deck/DeckForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Deck } from '@/lib/types';

export default function DashboardPage() {
  const { decks, cards, addDeck, updateDeck, deleteDeck } = useFlashcards();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const filteredDecks = useMemo(
    () => decks.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
    [decks, search]
  );

  const totalCards = cards.length;
  const masteredCards = cards.filter((c) => c.mastered).length;

  const handleCreate = (data: Omit<Deck, 'id' | 'createdAt'>) => {
    addDeck(data);
    setCreateOpen(false);
  };

  const handleUpdate = (data: Omit<Deck, 'id' | 'createdAt'>) => {
    if (!editingDeck) return;
    updateDeck({ ...editingDeck, ...data });
    setEditingDeck(null);
  };

  const handleDelete = (deckId: string) => {
    if (confirm('Delete this deck and all its cards? This cannot be undone.')) {
      deleteDeck(deckId);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0f0f1a] to-[#0a0a0f]">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-violet-400">Your Study Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Ready to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                learn something?
              </span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-xl">
              Create flashcard decks, study at your own pace, and track your mastery over time.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: BookOpen, label: 'Decks', value: decks.length, color: 'text-violet-400' },
                { icon: Star, label: 'Total Cards', value: totalCards, color: 'text-amber-400' },
                { icon: Zap, label: 'Mastered', value: masteredCards, color: 'text-emerald-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/8"
                >
                  <Icon size={18} className={color} />
                  <div>
                    <p className="text-white font-bold text-lg leading-none">{value}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search decks..."
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={16} />
            New Deck
          </Button>
        </div>

        {/* Deck Grid */}
        <DeckGrid
          decks={filteredDecks}
          onEdit={(deck) => setEditingDeck(deck)}
          onDelete={handleDelete}
        />
      </main>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} title="Create New Deck">
        <DeckForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingDeck} onClose={() => setEditingDeck(null)} title="Edit Deck">
        {editingDeck && (
          <DeckForm
            initialData={editingDeck}
            onSubmit={handleUpdate}
            onCancel={() => setEditingDeck(null)}
            isEditing
          />
        )}
      </Modal>
    </div>
  );
}
