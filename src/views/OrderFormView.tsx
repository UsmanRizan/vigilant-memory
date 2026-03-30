import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Trash2 } from 'lucide-react';
import type { CheckoutFormState } from '@/src/types/order';
import { CHEST_WIDTH_OPTIONS, SIZE_ROWS_BY_LENGTH } from '@/src/data/sizeGuide';

interface OrderFormViewProps {
  formData: CheckoutFormState;
  setFormData: Dispatch<SetStateAction<CheckoutFormState>>;
  cartTotal: number;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
  onOpenSizeGuide: () => void;
  onBackToStore: () => void;
  addSizeToCart: (sizeCode: string) => void;
  updateCartQuantity: (index: number, delta: number) => void;
}

function qtyForSize(cart: CheckoutFormState['cart'], sizeCode: string): number {
  return cart.find((i) => i.size === sizeCode)?.quantity ?? 0;
}

export function OrderFormView({
  formData,
  setFormData,
  cartTotal,
  submitting,
  error,
  onSubmit,
  onOpenSizeGuide,
  onBackToStore,
  addSizeToCart,
  updateCartQuantity,
}: OrderFormViewProps) {
  return (
    <motion.div
      key="order-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="card-brutal p-8 md:p-12 space-y-12 bg-white">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black tracking-tighter">ORDER FORM</h2>
          <p className="font-mono text-[10px] font-bold opacity-50">PLEASE PROVIDE ACCURATE DETAILS FOR DELIVERY.</p>
        </div>

        {error && <p className="text-center text-sm text-red-600 font-mono font-bold">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-mono text-[10px] font-bold border-b border-black pb-2">01. CUSTOMER INFO</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono opacity-50">FULL NAME</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                    placeholder="MOHAMED AMEEN"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono opacity-50">PHONE NUMBER</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full"
                    placeholder="+974 5555 0000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono opacity-50">DELIVERY ADDRESS</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full resize-none"
                    placeholder="STREET, AREA, CITY, SRI LANKA"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-black pb-2">
                <h3 className="font-mono text-[10px] font-bold">02. SIZE SELECTION</h3>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-[9px] font-bold font-mono underline hover:opacity-50"
                >
                  VIEW SIZE GUIDE
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-mono font-bold opacity-60 leading-relaxed">
                  TAP A CELL TO ADD THAT SIZE (LENGTH + CHEST IN ONE STEP). TAP AGAIN TO ADD ANOTHER OF THE SAME SIZE.
                </p>

                {/* Column labels: chest */}
                <div className="grid grid-cols-[3rem_1fr] gap-2 items-end">
                  <div />
                  <div className="grid grid-cols-4 gap-1">
                    {CHEST_WIDTH_OPTIONS.map((w) => (
                      <div
                        key={w}
                        className="text-center text-[9px] font-black font-mono opacity-40 pb-1 border-b border-black/10"
                      >
                        CHEST {w}
                      </div>
                    ))}
                  </div>
                </div>

                {SIZE_ROWS_BY_LENGTH.map(({ lengthLabel, sizes }) => (
                  <div key={lengthLabel} className="grid grid-cols-[3rem_1fr] gap-2 items-stretch">
                    <div className="flex items-center pt-1">
                      <span className="text-[10px] font-black font-mono opacity-50" title="Garment length (inches)">
                        {lengthLabel}&quot;
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {sizes.map((row) => {
                        const q = qtyForSize(formData.cart, row.size);
                        return (
                          <button
                            key={row.size}
                            type="button"
                            onClick={() => addSizeToCart(row.size)}
                            className="relative flex flex-col items-center justify-center py-2.5 px-1 border border-black/20 hover:border-black hover:bg-stone-50 transition-all text-center min-h-[3.25rem]"
                          >
                            <span className="text-[11px] font-black font-mono leading-none">{row.size}</span>
                            <span className="text-[8px] font-mono opacity-40 mt-0.5">{row.chestIn}&quot; chest</span>
                            {q > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 min-w-[1.125rem] h-[1.125rem] px-0.5 rounded-full bg-black text-white text-[10px] font-black font-mono flex items-center justify-center">
                                {q}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {formData.cart.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-black">
              <div className="flex justify-between items-end">
                <h3 className="font-mono text-[10px] font-bold">03. ORDER SUMMARY</h3>
                <div className="text-right">
                  <div className="font-mono text-[9px] font-bold opacity-40">TOTAL</div>
                  <div className="text-xl font-bold">{cartTotal} LKR</div>
                </div>
              </div>
              <div className="grid gap-2">
                {formData.cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-black p-3 bg-stone-50">
                    <div className="font-mono text-xs font-bold">SIZE: {item.size}</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-black">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(idx, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(idx, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(idx, -item.quantity)}
                        className="text-red-500 hover:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 space-y-4">
            <button
              disabled={submitting || formData.cart.length === 0}
              type="submit"
              className="btn-brutal-black w-full py-4 text-sm flex items-center justify-center gap-3 disabled:opacity-30"
            >
              {submitting ? 'PROCESSING...' : 'CONFIRM ORDER'} <CheckCircle size={18} />
            </button>
            <button
              type="button"
              onClick={onBackToStore}
              className="w-full text-[10px] font-bold font-mono opacity-40 hover:opacity-100 transition-opacity"
            >
              BACK TO STORE
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
