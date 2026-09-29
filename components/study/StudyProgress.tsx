interface StudyProgressProps {
  current: number;
  total: number;
  correct: number;
  incorrect: number;
}

export function StudyProgress({ current, total, correct, incorrect }: StudyProgressProps) {
  const progressPercent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full space-y-3">
      {/* Stats row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-medium">✅ {correct} Got it</span>
          <span className="text-rose-400 font-medium">🔄 {incorrect} Review</span>
        </div>
        <span className="text-slate-400 font-medium">
          {current} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
