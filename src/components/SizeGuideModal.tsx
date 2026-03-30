import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { SIZE_GUIDE_ROWS } from '@/src/data/sizeGuide';

interface SizeGuideModalProps {
  onClose: () => void;
}

export function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-2xl border-brutal overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-4 border-b border-black flex justify-between items-center bg-black text-white flex-shrink-0">
          <h2 className="text-sm font-bold font-mono">SIZE GUIDE</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
          <p className="text-[10px] font-mono font-bold opacity-60 leading-relaxed">
            CHOOSE LENGTH (INCHES), THEN CHEST WIDTH. YOUR ORDER SIZE WILL MATCH THE CHART, E.G.{' '}
            <span className="text-black">56M</span> OR <span className="text-black">54XL</span>.
          </p>

          <div className="overflow-x-auto border border-black">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[320px]">
              <thead>
                <tr className="bg-stone-100 border-b border-black">
                  <th className="p-3 font-black tracking-tight border-r border-black/20">SIZE</th>
                  <th className="p-3 font-black tracking-tight border-r border-black/20">LENGTH (IN.)</th>
                  <th className="p-3 font-black tracking-tight">CHEST (IN.)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE_ROWS.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/80'}>
                    <td className="p-3 font-bold border-t border-black/10 border-r border-black/10">{row.size}</td>
                    <td className="p-3 border-t border-black/10 border-r border-black/10">{row.lengthIn}</td>
                    <td className="p-3 border-t border-black/10">{row.chestIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-[10px] font-mono leading-relaxed">
            <div className="p-4 bg-stone-50 border border-black space-y-2">
              <p className="font-black">CHEST (WIDTH)</p>
              <p className="opacity-70">S = 21&quot; · M = 22&quot; · L = 23&quot; · XL = 26&quot;</p>
            </div>
            <div className="p-4 bg-stone-50 border border-black space-y-2">
              <p className="font-black">LENGTH</p>
              <p className="opacity-70">54, 56, AND 58 REFER TO GARMENT LENGTH IN INCHES.</p>
            </div>
          </div>

          <div className="p-4 bg-stone-50 border border-black text-[10px] leading-relaxed">
            <p className="font-bold mb-1">PRO TIP</p>
            <p>
              FOR THE BEST FIT, MEASURE A THOBE YOU ALREADY OWN. IF YOU ARE BETWEEN SIZES, WE RECOMMEND SIZING UP FOR A MORE
              COMFORTABLE, TRADITIONAL FIT.
            </p>
          </div>

          <button type="button" onClick={onClose} className="btn-brutal-black w-full">
            GOT IT
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
