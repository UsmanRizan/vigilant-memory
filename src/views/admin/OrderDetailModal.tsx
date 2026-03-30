import { motion, AnimatePresence } from 'motion/react';
import { Printer, X } from 'lucide-react';
import type { Order, OrderStatus } from '@/src/types/order';
import { getOrderTotal } from '@/src/lib/orderValue';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  onLocalStatusChange: (order: Order, status: OrderStatus) => void;
}

export function OrderDetailModal({ order, onClose, updateOrderStatus, onLocalStatusChange }: OrderDetailModalProps) {
  return (
    <AnimatePresence>
      {order && (
        <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-2xl border-brutal overflow-hidden"
          >
            <div className="p-4 border-b border-black flex justify-between items-center bg-black text-white">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-black font-mono tracking-widest">ORDER DETAILS</h2>
                <span className="text-[10px] opacity-50 font-mono">#{order.id?.toUpperCase() || ''}</span>
              </div>
              <button type="button" onClick={onClose} className="p-1 hover:bg-white/20">
                <X size={16} />
              </button>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black font-mono opacity-30 tracking-widest border-b border-black pb-2">CUSTOMER INFORMATION</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[9px] font-bold font-mono opacity-40">NAME</div>
                      <div className="text-lg font-black tracking-tight">{order.customerName?.toUpperCase() || ''}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold font-mono opacity-40">PHONE</div>
                      <div className="text-lg font-black tracking-tight">{order.phone}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold font-mono opacity-40">ADDRESS</div>
                      <div className="text-xs font-bold font-mono leading-relaxed">{order.address?.toUpperCase() || ''}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black font-mono opacity-30 tracking-widest border-b border-black pb-2">ORDER STATUS</h3>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 text-xs font-black font-mono border-brutal shadow-[3px_3px_0px_rgba(0,0,0,1)] ${
                        order.status === 'pending'
                          ? 'bg-white text-black'
                          : order.status === 'confirmed'
                            ? 'bg-blue-500 text-white'
                            : order.status === 'shipped'
                              ? 'bg-indigo-500 text-white'
                              : order.status === 'delivered'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-red-500 text-white'
                      }`}
                    >
                      {order.status?.toUpperCase() || ''}
                    </span>
                    <div className="text-[9px] font-bold font-mono opacity-40">PLACED ON {new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black font-mono opacity-30 tracking-widest border-b border-black pb-2">ITEMS & VALUE</h3>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      {order.items ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 border border-black bg-stone-50">
                            <div className="font-mono text-xs font-bold">SIZE: {item.size}</div>
                            <div className="font-mono text-xs font-bold">x{item.quantity}</div>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between items-center p-3 border border-black bg-stone-50">
                          <div className="font-mono text-xs font-bold">SIZE: {order.size}</div>
                          <div className="font-mono text-xs font-bold">x1</div>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-black flex justify-between items-end">
                      <div className="text-[9px] font-black font-mono opacity-40">TOTAL VALUE</div>
                      <div className="text-3xl font-black tracking-tighter">
                        {getOrderTotal(order)} LKR
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black font-mono opacity-30 tracking-widest border-b border-black pb-2">ACTIONS</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => {
                          void updateOrderStatus(order.id, 'confirmed');
                          onLocalStatusChange(order, 'confirmed');
                        }}
                        className="py-3 border border-black text-[10px] font-black font-mono hover:bg-black hover:text-white transition-all"
                      >
                        CONFIRM
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => {
                          void updateOrderStatus(order.id, 'shipped');
                          onLocalStatusChange(order, 'shipped');
                        }}
                        className="py-3 border border-black text-[10px] font-black font-mono hover:bg-black hover:text-white transition-all"
                      >
                        SHIP
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        type="button"
                        onClick={() => {
                          void updateOrderStatus(order.id, 'delivered');
                          onLocalStatusChange(order, 'delivered');
                        }}
                        className="py-3 border border-black text-[10px] font-black font-mono hover:bg-black hover:text-white transition-all"
                      >
                        DELIVER
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void updateOrderStatus(order.id, 'cancelled');
                        onLocalStatusChange(order, 'cancelled');
                      }}
                      className="py-3 border border-red-500 text-red-500 text-[10px] font-black font-mono hover:bg-red-500 hover:text-white transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-stone-50 border-t border-black flex justify-between items-center">
              <button type="button" onClick={() => window.print()} className="flex items-center gap-2 text-[10px] font-black font-mono hover:opacity-50">
                <Printer size={14} /> PRINT INVOICE
              </button>
              <button type="button" onClick={onClose} className="btn-brutal-black px-8 py-3 text-[10px]">
                CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
