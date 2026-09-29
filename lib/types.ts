export interface Deck {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: DeckColor;
  createdAt: string;
  lastStudied?: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  mastered: boolean;
  reviewCount: number;
  createdAt: string;
}

export interface StudySession {
  deckId: string;
  total: number;
  correct: number;
  incorrect: number;
  startedAt: string;
}

export type DeckColor =
  | 'violet'
  | 'cyan'
  | 'rose'
  | 'amber'
  | 'emerald'
  | 'sky';

export const DECK_COLORS: Record<DeckColor, { from: string; to: string; border: string; text: string }> = {
  violet: { from: 'from-violet-600', to: 'to-purple-700', border: 'border-violet-500/30', text: 'text-violet-300' },
  cyan:   { from: 'from-cyan-500',   to: 'to-blue-600',   border: 'border-cyan-500/30',   text: 'text-cyan-300' },
  rose:   { from: 'from-rose-500',   to: 'to-pink-600',   border: 'border-rose-500/30',   text: 'text-rose-300' },
  amber:  { from: 'from-amber-500',  to: 'to-orange-600', border: 'border-amber-500/30',  text: 'text-amber-300' },
  emerald:{ from: 'from-emerald-500',to: 'to-teal-600',   border: 'border-emerald-500/30',text: 'text-emerald-300' },
  sky:    { from: 'from-sky-500',    to: 'to-indigo-600', border: 'border-sky-500/30',    text: 'text-sky-300' },
};

export type FlashcardAction =
  | { type: 'ADD_DECK'; payload: Deck }
  | { type: 'UPDATE_DECK'; payload: Deck }
  | { type: 'DELETE_DECK'; payload: string }
  | { type: 'ADD_CARD'; payload: Flashcard }
  | { type: 'UPDATE_CARD'; payload: Flashcard }
  | { type: 'DELETE_CARD'; payload: { cardId: string; deckId: string } }
  | { type: 'TOGGLE_MASTERED'; payload: { cardId: string; deckId: string } }
  | { type: 'UPDATE_LAST_STUDIED'; payload: { deckId: string; date: string } }
  | { type: 'LOAD_DATA'; payload: FlashcardState };

export interface FlashcardState {
  decks: Deck[];
  cards: Flashcard[];
}
