/** Thobe size chart: combined size code, length (in), chest (in). */
export const SIZE_GUIDE_ROWS: { size: string; lengthIn: number; chestIn: number }[] = [
  { size: '54S', lengthIn: 54, chestIn: 21 },
  { size: '54M', lengthIn: 54, chestIn: 22 },
  { size: '54L', lengthIn: 54, chestIn: 23 },
  { size: '54XL', lengthIn: 54, chestIn: 26 },
  { size: '56S', lengthIn: 56, chestIn: 21 },
  { size: '56M', lengthIn: 56, chestIn: 22 },
  { size: '56L', lengthIn: 56, chestIn: 23 },
  { size: '56XL', lengthIn: 56, chestIn: 26 },
  { size: '58S', lengthIn: 58, chestIn: 21 },
  { size: '58M', lengthIn: 58, chestIn: 22 },
  { size: '58L', lengthIn: 58, chestIn: 23 },
  { size: '58XL', lengthIn: 58, chestIn: 26 },
];

export const CHEST_WIDTH_OPTIONS = ['S', 'M', 'L', 'XL'] as const;
export const LENGTH_OPTIONS = ['54', '56', '58'] as const;

/** Rows grouped by length for the order picker (54 / 56 / 58). */
export const SIZE_ROWS_BY_LENGTH = LENGTH_OPTIONS.map((len) => ({
  lengthLabel: len,
  sizes: SIZE_GUIDE_ROWS.filter((r) => r.lengthIn === Number(len)),
}));
