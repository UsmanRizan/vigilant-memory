import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { CheckoutFormState } from '@/src/types/order';

interface ConfirmationViewProps {
  formData: CheckoutFormState;
  cartTotal: number;
  onBackHome: () => void;
}

export function ConfirmationView({ formData, cartTotal, onBackHome }: ConfirmationViewProps) {
  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto text-center space-y-6 py-12 border border-black p-8"
    >
      <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto">
        <Check size={32} />
      </div>
      <h2 className="text-2xl font-bold">ORDER RECEIVED!</h2>
      <p className="text-xs leading-relaxed opacity-70">
        THANK YOU, <span className="font-bold">{formData.name?.toUpperCase() || ''}</span>. <br />
        WE WILL CALL YOU SHORTLY AT <span className="font-bold">{formData.phone}</span> TO CONFIRM YOUR ORDER DETAILS AND SHIPPING.
      </p>

      <div className="border border-black p-4 space-y-2 bg-stone-50">
        <p className="text-[10px] font-bold border-b border-black pb-1">ORDER SUMMARY</p>
        {formData.cart.map((item, idx) => (
          <div key={idx} className="flex justify-between text-[10px]">
            <span>SIZE: {item.size}</span>
            <span className="font-bold">x{item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between text-[10px] pt-2 border-t border-black/10 font-bold">
          <span>TOTAL VALUE</span>
          <span>{cartTotal} LKR</span>
        </div>
      </div>
      <button type="button" onClick={onBackHome} className="px-8 py-3 border border-black text-xs font-bold hover-invert transition-all">
        BACK TO HOME
      </button>
    </motion.div>
  );
}
