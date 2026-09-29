import { createClient } from '@/lib/supabase';
import {
  Deck, Flashcard, StudySession,
  DeckRow, FlashcardRow, StudySessionRow,
  DeckColor,
  deckFromRow, flashcardFromRow, studySessionFromRow,
} from '@/lib/types';

// ─── Decks ────────────────────────────────────────────────────────────────────

export async function fetchDecks(userId: string): Promise<Deck[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DeckRow[]).map(deckFromRow);
}

export async function insertDeck(
  userId: string,
  input: { name: string; description: string; emoji: string; color: DeckColor }
): Promise<Deck> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('decks')
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return deckFromRow(data as DeckRow);
}

export async function updateDeck(deck: Deck): Promise<Deck> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('decks')
    .update({
      name: deck.name,
      description: deck.description,
      emoji: deck.emoji,
      color: deck.color,
      last_studied: deck.lastStudied ?? null,
    })
    .eq('id', deck.id)
    .eq('user_id', deck.userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return deckFromRow(data as DeckRow);
}

export async function deleteDeck(deckId: string, userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('decks')
    .delete()
    .eq('id', deckId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

export async function fetchCardsByDeck(deckId: string, userId: string): Promise<Flashcard[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as FlashcardRow[]).map(flashcardFromRow);
}

export async function fetchAllCards(userId: string): Promise<Flashcard[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as FlashcardRow[]).map(flashcardFromRow);
}

export async function insertCard(
  userId: string,
  input: { deckId: string; front: string; back: string }
): Promise<Flashcard> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('flashcards')
    .insert({ deck_id: input.deckId, front: input.front, back: input.back, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return flashcardFromRow(data as FlashcardRow);
}

export async function updateCard(card: Flashcard): Promise<Flashcard> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('flashcards')
    .update({
      front: card.front,
      back: card.back,
      mastered: card.mastered,
      review_count: card.reviewCount,
    })
    .eq('id', card.id)
    .eq('user_id', card.userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return flashcardFromRow(data as FlashcardRow);
}

export async function toggleCardMastered(cardId: string, userId: string): Promise<Flashcard> {
  const supabase = createClient();

  // Fetch current state first
  const { data: current, error: fetchErr } = await supabase
    .from('flashcards')
    .select('mastered, review_count')
    .eq('id', cardId)
    .eq('user_id', userId)
    .single();

  if (fetchErr) throw new Error(fetchErr.message);

  const { data, error } = await supabase
    .from('flashcards')
    .update({
      mastered: !(current as FlashcardRow).mastered,
      review_count: (current as FlashcardRow).review_count + 1,
    })
    .eq('id', cardId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return flashcardFromRow(data as FlashcardRow);
}

export async function deleteCard(cardId: string, userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

// ─── Study Sessions ───────────────────────────────────────────────────────────

export async function insertStudySession(session: Omit<StudySession, 'id'>): Promise<StudySession> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      deck_id: session.deckId,
      user_id: session.userId,
      total: session.total,
      correct: session.correct,
      incorrect: session.incorrect,
      started_at: session.startedAt,
      completed_at: session.completedAt ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return studySessionFromRow(data as StudySessionRow);
}

export async function updateDeckLastStudied(deckId: string, userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('decks')
    .update({ last_studied: new Date().toISOString() })
    .eq('id', deckId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}
