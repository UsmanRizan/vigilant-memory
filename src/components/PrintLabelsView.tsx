import type { Order } from '@/src/types/order';
import { getOrderTotal } from '@/src/lib/orderValue';

interface PrintLabelsViewProps {
  orders: Order[];
  selectedOrderIds: Set<string>;
  onClose: () => void;
}

export function PrintLabelsView({ orders, selectedOrderIds, onClose }: PrintLabelsViewProps) {
  const ordersToPrint = orders.filter((o) => selectedOrderIds.has(o.id));

  return (
    <div className="p-4 bg-white min-h-screen text-black font-mono uppercase">
      <div className="flex justify-between items-center mb-4 print:hidden border-b border-black pb-2">
        <h1 className="text-sm font-bold">PRINT LABELS ({ordersToPrint.length})</h1>
        <div className="flex gap-2">
          <button type="button" onClick={() => window.print()} className="px-3 py-1 bg-black text-white text-xs font-bold">
            PRINT
          </button>
          <button type="button" onClick={onClose} className="px-3 py-1 border border-black text-xs font-bold">
            CLOSE
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ordersToPrint.map((o) => {
          const codAmount = getOrderTotal(o);
          return (
            <div key={o.id} className="border border-black p-4 space-y-2">
              <div className="text-[9px] border-b border-black pb-1 mb-1 font-bold">PURE WHITE THOBES - COD PARCEL</div>
              <div className="font-bold text-lg">{o.customerName}</div>
              <div className="text-md">{o.phone}</div>
              <div className="text-[10px] whitespace-pre-wrap">{o.address}</div>
              <div className="pt-2 flex justify-between items-end">
                <div>
                  <div className="text-[8px] font-bold opacity-50">SIZE</div>
                  <div className="font-bold">{o.size}</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-bold opacity-50">COD AMOUNT</div>
                  <div className="font-bold text-xl">Rs. {codAmount.toLocaleString()} LKR</div>
                </div>
              </div>
              <div className="text-[7px] pt-2 opacity-30">ORDER ID: {o.id}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
