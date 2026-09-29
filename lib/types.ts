// ─── App-level types (camelCase) ──────────────────────────────────────────────

export interface Deck {
  id: string;
  userId: string;
  name: string;
  description: string;
  emoji: string;
  color: DeckColor;
  createdAt: string;
  lastStudied?: string | null;
}

export interface Flashcard {
  id: string;
  deckId: string;
  userId: string;
  front: string;
  back: string;
  mastered: boolean;
  reviewCount: number;
  createdAt: string;
}

export interface StudySession {
  id?: string;
  deckId: string;
  userId: string;
  total: number;
  correct: number;
  incorrect: number;
  startedAt: string;
  completedAt?: string | null;
}

// ─── DB Row types (snake_case — mirrors Supabase table columns) ───────────────

export interface DeckRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  emoji: string;
  color: DeckColor;
  created_at: string;
  last_studied: string | null;
}

export interface FlashcardRow {
  id: string;
  deck_id: string;
  user_id: string;
  front: string;
  back: string;
  mastered: boolean;
  review_count: number;
  created_at: string;
}

export interface StudySessionRow {
  id: string;
  deck_id: string;
  user_id: string;
  total: number;
  correct: number;
  incorrect: number;
  started_at: string;
  completed_at: string | null;
}

// ─── Mappers (DB row → App type) ─────────────────────────────────────────────

export function deckFromRow(row: DeckRow): Deck {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    emoji: row.emoji,
    color: row.color,
    createdAt: row.created_at,
    lastStudied: row.last_studied ?? undefined,
  };
}

export function flashcardFromRow(row: FlashcardRow): Flashcard {
  return {
    id: row.id,
    deckId: row.deck_id,
    userId: row.user_id,
    front: row.front,
    back: row.back,
    mastered: row.mastered,
    reviewCount: row.review_count,
    createdAt: row.created_at,
  };
}

export function studySessionFromRow(row: StudySessionRow): StudySession {
  return {
    id: row.id,
    deckId: row.deck_id,
    userId: row.user_id,
    total: row.total,
    correct: row.correct,
    incorrect: row.incorrect,
    startedAt: row.started_at,
    completedAt: row.completed_at ?? undefined,
  };
}

// ─── Colors ───────────────────────────────────────────────────────────────────

export type DeckColor =
  | 'violet'
  | 'cyan'
  | 'rose'
  | 'amber'
  | 'emerald'
  | 'sky';

export const DECK_COLORS: Record<DeckColor, { from: string; to: string; border: string; text: string }> = {
  violet:  { from: 'from-violet-600',  to: 'to-purple-700',  border: 'border-violet-500/30',  text: 'text-violet-300' },
  cyan:    { from: 'from-cyan-500',    to: 'to-blue-600',    border: 'border-cyan-500/30',    text: 'text-cyan-300' },
  rose:    { from: 'from-rose-500',    to: 'to-pink-600',    border: 'border-rose-500/30',    text: 'text-rose-300' },
  amber:   { from: 'from-amber-500',   to: 'to-orange-600',  border: 'border-amber-500/30',   text: 'text-amber-300' },
  emerald: { from: 'from-emerald-500', to: 'to-teal-600',    border: 'border-emerald-500/30', text: 'text-emerald-300' },
  sky:     { from: 'from-sky-500',     to: 'to-indigo-600',  border: 'border-sky-500/30',     text: 'text-sky-300' },
};

// ─── Context / Reducer types ──────────────────────────────────────────────────

export type FlashcardAction =
  | { type: 'ADD_DECK'; payload: Deck }
  | { type: 'UPDATE_DECK'; payload: Deck }
  | { type: 'DELETE_DECK'; payload: string }
  | { type: 'ADD_CARD'; payload: Flashcard }
  | { type: 'UPDATE_CARD'; payload: Flashcard }
  | { type: 'DELETE_CARD'; payload: { cardId: string; deckId: string } }
  | { type: 'TOGGLE_MASTERED'; payload: { cardId: string; deckId: string } }
  | { type: 'UPDATE_LAST_STUDIED'; payload: { deckId: string; date: string } }
  | { type: 'LOAD_DATA'; payload: FlashcardState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface FlashcardState {
  decks: Deck[];
  cards: Flashcard[];
  loading: boolean;
  error: string | null;
}
