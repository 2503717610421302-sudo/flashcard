'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFlashcards } from '@/hooks/useFlashcards';
import { StudySession } from '@/components/study/StudySession';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const { getDeckById, getCardsByDeck } = useFlashcards();
  const deck = getDeckById(deckId);
  const cards = getCardsByDeck(deckId);

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

  if (cards.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <BookOpen size={40} className="text-violet-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No cards to study</h2>
        <p className="text-slate-400 text-sm">Add some cards to this deck before studying.</p>
        <Button variant="primary" onClick={() => router.push(`/deck/${deckId}`)}>
          <ArrowLeft size={15} /> Go Add Cards
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col">
      <StudySession deck={deck} cards={cards} />
    </div>
  );
}
