'use client';

import React, {
  createContext, useContext, useReducer,
  useEffect, useCallback, useState,
} from 'react';
import { createClient } from '@/lib/supabase';
import {
  FlashcardState, FlashcardAction, Deck, Flashcard,
} from '@/lib/types';
import { fetchDecks, fetchAllCards } from '@/lib/supabase-helpers';
import type { User } from '@supabase/supabase-js';

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: FlashcardState = {
  decks: [],
  cards: [],
  loading: true,
  error: null,
};

function reducer(state: FlashcardState, action: FlashcardAction): FlashcardState {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...action.payload, loading: false, error: null };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

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
          c.id === action.payload.cardId
            ? { ...c, mastered: !c.mastered, reviewCount: c.reviewCount + 1 }
            : c
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

// ─── Context ──────────────────────────────────────────────────────────────────

interface FlashcardContextValue {
  state: FlashcardState;
  dispatch: React.Dispatch<FlashcardAction>;
  user: User | null;
  getCardsByDeck: (deckId: string) => Flashcard[];
  getDeckById: (deckId: string) => Deck | undefined;
}

const FlashcardContext = createContext<FlashcardContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // 1. Resolve the current user, then load their data
  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!mounted) return;

      setUser(currentUser);

      if (!currentUser) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const [decks, cards] = await Promise.all([
          fetchDecks(currentUser.id),
          fetchAllCards(currentUser.id),
        ]);
        if (mounted) {
          dispatch({ type: 'LOAD_DATA', payload: { decks, cards, loading: false, error: null } });
        }
      } catch (err) {
        if (mounted) {
          dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
        }
      }
    }

    init();

    // 2. Listen for auth changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const [decks, cards] = await Promise.all([
            fetchDecks(newUser.id),
            fetchAllCards(newUser.id),
          ]);
          dispatch({ type: 'LOAD_DATA', payload: { decks, cards, loading: false, error: null } });
        } catch (err) {
          dispatch({ type: 'SET_ERROR', payload: (err as Error).message });
        }
      } else {
        // Logged out — clear state
        dispatch({ type: 'LOAD_DATA', payload: { decks: [], cards: [], loading: false, error: null } });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCardsByDeck = useCallback(
    (deckId: string) => state.cards.filter((c) => c.deckId === deckId),
    [state.cards]
  );

  const getDeckById = useCallback(
    (deckId: string) => state.decks.find((d) => d.id === deckId),
    [state.decks]
  );

  return (
    <FlashcardContext.Provider value={{ state, dispatch, user, getCardsByDeck, getDeckById }}>
      {children}
    </FlashcardContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFlashcardContext() {
  const ctx = useContext(FlashcardContext);
  if (!ctx) throw new Error('useFlashcardContext must be used within FlashcardProvider');
  return ctx;
}
