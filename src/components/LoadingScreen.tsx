import { motion } from 'motion/react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-mono">
      <div className="text-xs font-bold animate-pulse tracking-widest mb-4">LOADING...</div>
      <div className="w-32 h-[1px] bg-black/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-black w-1/3"
          animate={{ left: ['-33%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
