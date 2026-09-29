'use client';

import { useFlashcardContext } from '@/context/FlashcardContext';
import { Deck, Flashcard, DeckColor } from '@/lib/types';
import { generateId, getMasteryPercent } from '@/lib/utils';

export function useFlashcards() {
  const { state, dispatch, getCardsByDeck, getDeckById } = useFlashcardContext();

  const addDeck = (data: Omit<Deck, 'id' | 'createdAt'>) => {
    const deck: Deck = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    dispatch({ type: 'ADD_DECK', payload: deck });
    return deck;
  };

  const updateDeck = (deck: Deck) => dispatch({ type: 'UPDATE_DECK', payload: deck });

  const deleteDeck = (deckId: string) => dispatch({ type: 'DELETE_DECK', payload: deckId });

  const addCard = (data: Omit<Flashcard, 'id' | 'createdAt' | 'mastered' | 'reviewCount'>) => {
    const card: Flashcard = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      mastered: false,
      reviewCount: 0,
    };
    dispatch({ type: 'ADD_CARD', payload: card });
    return card;
  };

  const updateCard = (card: Flashcard) => dispatch({ type: 'UPDATE_CARD', payload: card });

  const deleteCard = (cardId: string, deckId: string) =>
    dispatch({ type: 'DELETE_CARD', payload: { cardId, deckId } });

  const toggleMastered = (cardId: string, deckId: string) =>
    dispatch({ type: 'TOGGLE_MASTERED', payload: { cardId, deckId } });

  const updateLastStudied = (deckId: string) =>
    dispatch({ type: 'UPDATE_LAST_STUDIED', payload: { deckId, date: new Date().toISOString() } });

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
  };
}

export type { Deck, Flashcard, DeckColor };
