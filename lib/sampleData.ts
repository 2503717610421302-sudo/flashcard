import { Deck, Flashcard } from './types';
import { generateId } from './utils';

const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();

export const sampleDecks: Deck[] = [
  {
    id: 'deck-js',
    name: 'JavaScript Fundamentals',
    description: 'Core JS concepts every developer should know',
    emoji: '⚡',
    color: 'amber',
    createdAt: yesterday,
    lastStudied: now,
  },
  {
    id: 'deck-react',
    name: 'React Essentials',
    description: 'Hooks, components, and React patterns',
    emoji: '⚛️',
    color: 'cyan',
    createdAt: yesterday,
    lastStudied: yesterday,
  },
  {
    id: 'deck-css',
    name: 'CSS Mastery',
    description: 'Flexbox, Grid, animations and modern CSS',
    emoji: '🎨',
    color: 'rose',
    createdAt: yesterday,
  },
];

export const sampleCards: Flashcard[] = [
  // JavaScript deck
  {
    id: generateId(), deckId: 'deck-js',
    front: 'What is a closure in JavaScript?',
    back: 'A closure is a function that retains access to its lexical scope even when the function is executed outside that scope.',
    mastered: true, reviewCount: 3, createdAt: yesterday,
  },
  {
    id: generateId(), deckId: 'deck-js',
    front: 'What does `typeof null` return?',
    back: '`"object"` — this is a well-known quirk/bug in JavaScript that has been kept for backward compatibility.',
    mastered: false, reviewCount: 1, createdAt: yesterday,
  },
  {
    id: generateId(), deckId: 'deck-js',
    front: 'What is the difference between `==` and `===`?',
    back: '`==` checks for value equality with type coercion. `===` checks for strict equality (both value AND type must match).',
    mastered: true, reviewCount: 5, createdAt: yesterday,
  },
  {
    id: generateId(), deckId: 'deck-js',
    front: 'What is event delegation?',
    back: 'A technique where a single event listener is added to a parent element to handle events from its children, using event bubbling.',
    mastered: false, reviewCount: 2, createdAt: yesterday,
  },
  {
    id: generateId(), deckId: 'deck-js',
    front: 'Explain the JavaScript event loop.',
    back: 'The event loop continuously checks the call stack. If empty, it dequeues from the callback queue and pushes tasks onto the stack, enabling async operations.',
    mastered: false, reviewCount: 0, createdAt: yesterday,
  },
  // React deck
  {
    id: generateId(), deckId: 'deck-react',
    front: 'What is the purpose of `useEffect`?',
    back: 'It lets you perform side effects (data fetching, subscriptions, DOM mutations) in functional components, replacing lifecycle methods.',
    mastered: true, reviewCount: 4, createdAt: yesterday,
  },
  {
    id: generateId(), deckId: 'deck-react',
    front: 'When does `useMemo` re-compute its value?',
    back: 'Only when one of its dependencies changes. It memoizes the result of an expensive calculation to avoid redundant re-computation on every render.',
    mastered: false, reviewCount: 2, createdAt: yesterday,
  },
  {
    id: generateId(), deckId: 'deck-react',
    front: 'What is the key prop used for in lists?',
    back: 'React uses `key` to identify which list items have changed, been added, or removed, enabling efficient DOM reconciliation.',
    mastered: true, reviewCount: 6, createdAt: yesterday,
  },
  // CSS deck
  {
    id: generateId(), deckId: 'deck-css',
    front: 'What is the difference between `flex` and `grid`?',
    back: 'Flexbox is one-dimensional (row OR column). CSS Grid is two-dimensional (rows AND columns simultaneously).',
    mastered: false, reviewCount: 1, createdAt: yesterday,
  },
  {
    id: generateId(), deckId: 'deck-css',
    front: 'What does `position: sticky` do?',
    back: 'The element scrolls with the page until it reaches a defined threshold, then sticks in place (combination of relative and fixed positioning).',
    mastered: false, reviewCount: 0, createdAt: yesterday,
  },
];
