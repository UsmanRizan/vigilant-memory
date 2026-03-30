import { motion } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface BatchingModalProps {
  batchingSummary: Record<string, number>;
  onClose: () => void;
}

export function BatchingModal({ batchingSummary, onClose }: BatchingModalProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-lg border border-black"
      >
        <div className="p-4 border-b border-black flex justify-between items-center bg-black text-white">
          <h2 className="text-sm font-bold">PRODUCTION BATCH</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20">
            <X size={16} />
          </button>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-0 border-t border-l border-black">
            {Object.entries(batchingSummary).map(([size, count]) => (
              <div
                key={size}
                className="p-6 border-r border-b border-black flex justify-between items-center hover:bg-stone-50 transition-colors"
              >
                <div>
                  <div className="text-[10px] font-black font-mono opacity-30 tracking-widest">SIZE</div>
                  <div className="text-2xl font-black tracking-tighter">{size}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black font-mono opacity-30 tracking-widest">QUANTITY</div>
                  <div className="text-3xl font-black tracking-tighter">{count}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-brutal bg-stone-50 space-y-2">
            <div className="flex items-center gap-2 font-black text-[10px] font-mono">
              <AlertCircle size={14} /> PRODUCTION NOTICE
            </div>
            <p className="text-[11px] font-bold font-mono leading-relaxed opacity-60">
              THIS LIST INCLUDES ALL <span className="text-black">CONFIRMED</span> ORDERS. GENERATE THIS LIST BEFORE VISITING YOUR TAILOR. ENSURE ALL FABRIC REQUIREMENTS ARE CALCULATED BASED ON THESE TOTALS.
            </p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => window.print()} className="btn-brutal-black flex-grow py-4 text-xs">
              PRINT PRODUCTION SHEET
            </button>
            <button type="button" onClick={onClose} className="btn-brutal px-8 py-4 text-xs">
              CLOSE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
