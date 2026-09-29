'use client';

import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/40"
          >
            <BookOpen size={16} className="text-white" />
          </motion.div>
          <span className="font-bold text-white text-lg tracking-tight">
            Flash<span className="text-violet-400">Card</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Sparkles size={13} className="text-violet-400" />
            <span className="text-xs font-medium text-violet-300">Study Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
}
