'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { FlashcardState, FlashcardAction, Deck, Flashcard } from '@/lib/types';
import { sampleDecks, sampleCards } from '@/lib/sampleData';

const STORAGE_KEY = 'flashcard-study-data';

const initialState: FlashcardState = {
  decks: [],
  cards: [],
};

function reducer(state: FlashcardState, action: FlashcardAction): FlashcardState {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;

    case 'ADD_DECK':
      return { ...state, decks: [...state.decks, action.payload] };

    case 'UPDATE_DECK':
      return {
        ...state,
        decks: state.decks.map((d) => (d.id === action.payload.id ? action.payload : d)),
      };

    case 'DELETE_DECK':
      return {
        ...state,
        decks: state.decks.filter((d) => d.id !== action.payload),
        cards: state.cards.filter((c) => c.deckId !== action.payload),
      };

    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };

    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };

    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter((c) => c.id !== action.payload.cardId),
      };

    case 'TOGGLE_MASTERED':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.payload.cardId ? { ...c, mastered: !c.mastered, reviewCount: c.reviewCount + 1 } : c
        ),
      };

    case 'UPDATE_LAST_STUDIED':
      return {
        ...state,
        decks: state.decks.map((d) =>
          d.id === action.payload.deckId ? { ...d, lastStudied: action.payload.date } : d
        ),
      };

    default:
      return state;
  }
}

interface FlashcardContextValue {
  state: FlashcardState;
  dispatch: React.Dispatch<FlashcardAction>;
  getCardsByDeck: (deckId: string) => Flashcard[];
  getDeckById: (deckId: string) => Deck | undefined;
}

const FlashcardContext = createContext<FlashcardContextValue | null>(null);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FlashcardState;
        if (parsed.decks && parsed.cards) {
          dispatch({ type: 'LOAD_DATA', payload: parsed });
          return;
        }
      }
      // First-time: seed with sample data
      dispatch({ type: 'LOAD_DATA', payload: { decks: sampleDecks, cards: sampleCards } });
    } catch {
      dispatch({ type: 'LOAD_DATA', payload: { decks: sampleDecks, cards: sampleCards } });
    }
  }, []);

  // Persist to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (state.decks.length > 0 || state.cards.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const getCardsByDeck = useCallback(
    (deckId: string) => state.cards.filter((c) => c.deckId === deckId),
    [state.cards]
  );

  const getDeckById = useCallback(
    (deckId: string) => state.decks.find((d) => d.id === deckId),
    [state.decks]
  );

  return (
    <FlashcardContext.Provider value={{ state, dispatch, getCardsByDeck, getDeckById }}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcardContext() {
  const ctx = useContext(FlashcardContext);
  if (!ctx) throw new Error('useFlashcardContext must be used within FlashcardProvider');
  return ctx;
}
