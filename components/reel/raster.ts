/**
 * Rasterising helpers for the reel's particle beats. Everything here samples a
 * shape onto a coarse lattice once, before it is needed on screen, so the frame
 * loop only ever interpolates numbers.
 */

/** 4x4 ordered dither. Thinning on a Bayer threshold keeps coverage even when a
    shape has more cells than there are particles, instead of eating one edge. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function scratch(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  return canvas.getContext('2d', { willReadFrequently: true });
}

/**
 * Draws with `paint` onto a `cols` x `rows` lattice and returns the filled
 * cells as x, y pairs in row-major order, thinned to at most `cap`.
 */
export function cellsOf(
  cols: number,
  rows: number,
  paint: (ctx: CanvasRenderingContext2D) => void,
  cap: number
): Int16Array {
  const ctx = scratch(cols, rows);
  if (!ctx) return new Int16Array(0);
  ctx.fillStyle = '#000';
  paint(ctx);

  const { data } = ctx.getImageData(0, 0, cols, rows);
  const cells: number[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (data[(y * cols + x) * 4 + 3] > 110) cells.push(x, y);
    }
  }

  const count = cells.length / 2;
  if (count <= cap) return Int16Array.from(cells);

  const keep = cap / count;
  const thinned: number[] = [];
  for (let i = 0; i < count; i++) {
    const x = cells[i * 2];
    const y = cells[i * 2 + 1];
    if (BAYER[(y % 4) * 4 + (x % 4)] / 16 < keep) thinned.push(x, y);
  }
  return Int16Array.from(thinned.slice(0, cap * 2));
}

/** Fraction of a `cols` x `rows` lattice that `paint` covers. */
export function coverage(
  cols: number,
  rows: number,
  paint: (ctx: CanvasRenderingContext2D) => void
) {
  const ctx = scratch(cols, rows);
  if (!ctx) return 0;
  ctx.fillStyle = '#000';
  paint(ctx);
  const { data } = ctx.getImageData(0, 0, cols, rows);
  let filled = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 110) filled++;
  return filled / (cols * rows);
}

/**
 * The colour of every cell of an image laid out like `object-fit: cover;
 * object-position: top`, downsampled to `cols` x `rows` — what the box was
 * showing, one colour per mosaic tile.
 */
export function tilesOf(
  image: CanvasImageSource & { naturalWidth: number; naturalHeight: number },
  boxAspect: number,
  cols: number,
  rows: number
): Uint8ClampedArray | null {
  const ctx = scratch(cols, rows);
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  if (!ctx || !iw || !ih) return null;

  let sw = iw;
  let sh = iw / boxAspect;
  let sx = 0;
  if (sh > ih) {
    sh = ih;
    sw = ih * boxAspect;
    sx = (iw - sw) / 2;
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, sx, 0, sw, sh, 0, 0, cols, rows);
  try {
    return ctx.getImageData(0, 0, cols, rows).data;
  } catch {
    return null;
  }
}
