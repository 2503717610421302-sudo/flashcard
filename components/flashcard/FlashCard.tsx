'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashCardProps {
  front: string;
  back: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  accentColor?: string;
  accentFrom?: string;
  accentTo?: string;
  disabled?: boolean;
}

export function FlashCard({
  front,
  back,
  isFlipped = false,
  onFlip,
  accentFrom = 'from-violet-600',
  accentTo = 'to-purple-700',
  disabled = false,
}: FlashCardProps) {
  const [localFlipped, setLocalFlipped] = useState(false);
  const flipped = onFlip ? isFlipped : localFlipped;
  const handleFlip = onFlip || (() => setLocalFlipped((f) => !f));

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={disabled ? undefined : handleFlip}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d', position: 'relative' }}
        className="w-full aspect-[3/2]"
      >
        {/* Front */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl bg-[#1a1a28] border border-white/10 flex flex-col items-center justify-center p-8 text-center overflow-hidden',
            'shadow-2xl shadow-black/40'
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Gradient glow */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentFrom} ${accentTo}`} />
          <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${accentFrom} ${accentTo} opacity-5 rounded-full blur-3xl`} />

          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-4">Question</span>
          <p className="text-white text-lg sm:text-xl font-medium leading-relaxed">{front}</p>

          <div className="absolute bottom-4 right-4 flex items-center gap-1 text-slate-600">
            <RotateCcw size={11} />
            <span className="text-xs">Tap to reveal</span>
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl border flex flex-col items-center justify-center p-8 text-center overflow-hidden',
            `bg-gradient-to-br ${accentFrom} ${accentTo} border-white/20`
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <span className="text-xs font-medium text-white/60 uppercase tracking-widest mb-4 block">Answer</span>
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">{back}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
