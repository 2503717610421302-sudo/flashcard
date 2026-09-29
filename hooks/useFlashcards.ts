'use client';

import { useFlashcardContext } from '@/context/FlashcardContext';
import { Deck, Flashcard, DeckColor } from '@/lib/types';
import { getMasteryPercent } from '@/lib/utils';
import {
  insertDeck, updateDeck as dbUpdateDeck, deleteDeck as dbDeleteDeck,
  insertCard, updateCard as dbUpdateCard, deleteCard as dbDeleteCard,
  toggleCardMastered, updateDeckLastStudied,
  insertStudySession,
} from '@/lib/supabase-helpers';
import type { StudySession } from '@/lib/types';

export function useFlashcards() {
  const { state, dispatch, user, getCardsByDeck, getDeckById } = useFlashcardContext();

  // ─── Decks ──────────────────────────────────────────────────────────────────

  const addDeck = async (data: Omit<Deck, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) throw new Error('Not authenticated');
    const deck = await insertDeck(user.id, data);
    dispatch({ type: 'ADD_DECK', payload: deck });
    return deck;
  };

  const updateDeck = async (deck: Deck) => {
    const updated = await dbUpdateDeck(deck);
    dispatch({ type: 'UPDATE_DECK', payload: updated });
  };

  const deleteDeck = async (deckId: string) => {
    if (!user) throw new Error('Not authenticated');
    await dbDeleteDeck(deckId, user.id);
    dispatch({ type: 'DELETE_DECK', payload: deckId });
  };

  // ─── Flashcards ─────────────────────────────────────────────────────────────

  const addCard = async (data: { deckId: string; front: string; back: string }) => {
    if (!user) throw new Error('Not authenticated');
    const card = await insertCard(user.id, data);
    dispatch({ type: 'ADD_CARD', payload: card });
    return card;
  };

  const updateCard = async (card: Flashcard) => {
    const updated = await dbUpdateCard(card);
    dispatch({ type: 'UPDATE_CARD', payload: updated });
  };

  const deleteCard = async (cardId: string, deckId: string) => {
    if (!user) throw new Error('Not authenticated');
    await dbDeleteCard(cardId, user.id);
    dispatch({ type: 'DELETE_CARD', payload: { cardId, deckId } });
  };

  const toggleMastered = async (cardId: string, deckId: string) => {
    if (!user) throw new Error('Not authenticated');
    const updated = await toggleCardMastered(cardId, user.id);
    dispatch({ type: 'UPDATE_CARD', payload: updated });
  };

  const updateLastStudied = async (deckId: string) => {
    if (!user) throw new Error('Not authenticated');
    await updateDeckLastStudied(deckId, user.id);
    dispatch({
      type: 'UPDATE_LAST_STUDIED',
      payload: { deckId, date: new Date().toISOString() },
    });
  };

  const saveStudySession = async (session: Omit<StudySession, 'id' | 'userId'>) => {
    if (!user) throw new Error('Not authenticated');
    return insertStudySession({ ...session, userId: user.id });
  };

  // ─── Stats ──────────────────────────────────────────────────────────────────

  const getDeckStats = (deckId: string) => {
    const cards = getCardsByDeck(deckId);
    return {
      total: cards.length,
      mastered: cards.filter((c) => c.mastered).length,
      masteryPercent: getMasteryPercent(cards),
    };
  };

  return {
    decks: state.decks,
    cards: state.cards,
    loading: state.loading,
    error: state.error,
    user,
    getCardsByDeck,
    getDeckById,
    getDeckStats,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    toggleMastered,
    updateLastStudied,
    saveStudySession,
  };
}

export type { Deck, Flashcard, DeckColor };

