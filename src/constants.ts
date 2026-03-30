/** Single piece in LKR */
export const PRICE_SINGLE_LKR = 14199;

/** Bundle: total LKR for exactly 2 pieces */
export const PRICE_PAIR_LKR = 23699;

/**
 * Best total LKR for `quantity` pieces (pairs priced at bundle rate, remainder at single).
 * Example: 1 → 14199, 2 → 23699, 3 → 23699 + 14199, 4 → 2 × 23699
 */
export function totalLkrForPieceCount(quantity: number): number {
  if (quantity <= 0) return 0;
  const pairs = Math.floor(quantity / 2);
  const remainder = quantity % 2;
  return pairs * PRICE_PAIR_LKR + remainder * PRICE_SINGLE_LKR;
}
