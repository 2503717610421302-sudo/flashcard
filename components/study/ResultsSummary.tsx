'use client';

import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, RefreshCw } from 'lucide-react';
import { Deck, DECK_COLORS } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';

interface ResultsSummaryProps {
  deck: Deck;
  total: number;
  correct: number;
  incorrect: number;
  onRestart: () => void;
  onRetryWeak: () => void;
  onExit: () => void;
}

const RING_COLORS: Record<string, string> = {
  violet: '#7c3aed', cyan: '#06b6d4', rose: '#f43f5e',
  amber: '#f59e0b', emerald: '#10b981', sky: '#0ea5e9',
};

export function ResultsSummary({ deck, total, correct, incorrect, onRestart, onRetryWeak, onExit }: ResultsSummaryProps) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const colors = DECK_COLORS[deck.color];

  const getGrade = () => {
    if (percent === 100) return { label: 'Perfect! 🎉', sub: "You nailed every card!" };
    if (percent >= 80) return { label: 'Great Job! ⭐', sub: "Almost there — keep it up!" };
    if (percent >= 60) return { label: 'Good Effort 💪', sub: "Review the tricky ones again." };
    return { label: 'Keep Practicing 📚', sub: "More repetition will help you master this!" };
  };

  const { label, sub } = getGrade();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8 max-w-lg mx-auto"
    >
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center shadow-2xl`}
      >
        <Trophy size={36} className="text-white" />
      </motion.div>

      {/* Score */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">{label}</h2>
        <p className="text-slate-400 text-sm">{sub}</p>
      </div>

      {/* Progress ring + stats */}
      <div className="flex items-center gap-8">
        <ProgressRing percent={percent} size={90} strokeWidth={8} color={RING_COLORS[deck.color]} />

        <div className="space-y-3 text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-lg font-bold text-emerald-400">{correct}</p>
              <p className="text-xs text-slate-500">Got it</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-lg font-bold text-rose-400">{incorrect}</p>
              <p className="text-xs text-slate-500">Needs review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button variant="ghost" className="flex-1" onClick={onExit}>
          <Home size={15} /> Back to Deck
        </Button>
        {incorrect > 0 && (
          <Button variant="secondary" className="flex-1" onClick={onRetryWeak}>
            <RefreshCw size={15} /> Retry All
          </Button>
        )}
        <Button variant="primary" className="flex-1" onClick={onRestart}>
          <RotateCcw size={15} /> Study Again
        </Button>
      </div>
    </motion.div>
  );
}
