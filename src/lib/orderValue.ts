import type { Order } from '@/src/types/order';
import { totalLkrForPieceCount } from '@/src/constants';

/** Total LKR for an order: stored totalValue, or derived from line quantities using current bundle rules. */
export function getOrderTotal(order: Order): number {
  const stored = order.totalValue;
  if (stored != null && stored > 0) {
    return stored;
  }
  const pieces = order.items?.reduce((s, i) => s + i.quantity, 0) || 1;
  return totalLkrForPieceCount(pieces);
}
