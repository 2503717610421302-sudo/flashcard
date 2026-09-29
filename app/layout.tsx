import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { FlashcardProvider } from '@/context/FlashcardContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FlashCard — Smart Study App',
  description: 'Create flashcard decks, study with 3D card flip animations, and track your mastery over time. A modern, premium flashcard study experience.',
  keywords: ['flashcards', 'study', 'learning', 'spaced repetition', 'education'],
  openGraph: {
    title: 'FlashCard — Smart Study App',
    description: 'Master any subject with beautiful, interactive flashcards.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-[#0a0a0f] text-white antialiased font-sans">
        <FlashcardProvider>
          <Header />
          {children}
        </FlashcardProvider>
      </body>
    </html>
  );
}
