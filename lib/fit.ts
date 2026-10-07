/**
 * Em advances of Science Gothic at wght 800 for each fitted word, measured at
 * the font's three width masters (wdth 50, 100 and 200). The axis interpolates
 * linearly between masters, so these three numbers give a word's width at any
 * wdth exactly. That lets a line be solved to fill its box on the server, with
 * no measuring pass on the client and nothing to reflow once the font lands.
 *
 * A word set anywhere else, or at another weight, needs its own row — remeasure
 * with a span at 100px and `getBoundingClientRect().width / 100`.
 */
const ADVANCE = {
  Jack: [2.3053, 3.1884, 4.8856],
  Knoell: [2.9384, 3.9623, 5.9255],
  'Jack Knoell': [5.512, 7.4655, 11.2759],
  Work: [2.5403, 3.4186, 5.0822],
  About: [2.685, 3.7086, 5.682],
  Contact: [3.5586, 4.8811, 7.3961],
} as const;

export type FitWord = keyof typeof ADVANCE;

/**
 * The wdth at which `word` fills a box exactly `ems` of its own font-size wide.
 * Clamped to the axis, so a box the word cannot reach leaves it short rather
 * than asking the font for a width it does not have.
 */
export function fitWidth(word: FitWord, ems: number) {
  const [a50, a100, a200] = ADVANCE[word];
  const wdth =
    ems <= a100
      ? 50 + ((ems - a50) / (a100 - a50)) * 50
      : 100 + ((ems - a100) / (a200 - a100)) * 100;
  return Math.round(Math.min(200, Math.max(50, wdth)) * 10) / 10;
}
