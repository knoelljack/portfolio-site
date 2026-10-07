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
  Northern: [4.3639, 5.8278, 8.8117],
  Trust: [2.5298, 3.3838, 5.1489],
  CareDx: [3.4413, 4.8283, 7.2439],
  Vanguard: [4.5052, 6.1197, 9.2302],
  Renewables: [5.6828, 7.5694, 11.4095],
  Edenspiekermann: [8.3891, 11.3431, 17.0647],
  EyePromise: [5.5581, 7.517, 11.4266],
  Selby: [2.525, 3.477, 5.2216],
  Lane: [2.1527, 3.0183, 4.6936],
  Drive: [2.5634, 3.5292, 5.1063],
  Stories: [3.4325, 4.6594, 6.9772],
} as const;

export type FitWord = keyof typeof ADVANCE;

const isFitWord = (word: string): word is FitWord => word in ADVANCE;

function advance(word: FitWord, wdth: number) {
  const [a50, a100, a200] = ADVANCE[word];
  return wdth <= 100
    ? a50 + ((a100 - a50) * (wdth - 50)) / 50
    : a100 + ((a200 - a100) * (wdth - 100)) / 100;
}

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

/**
 * A title set one word per line, every line filling the same box at one
 * shared size. The size comes from the longest word at a moderate width; a
 * short title is held to `minEms` so it reads as a headline, not a shout.
 * A word missing from the table still renders, at the default width.
 */
export function fitLines(title: string, minEms = 5, longestWdth = 72) {
  const words = title.split(' ');
  const measured = words.filter(isFitWord);
  const ems = Math.max(minEms, ...measured.map((w) => advance(w, longestWdth)));
  return {
    ems: Math.round(ems * 1000) / 1000,
    lines: words.map((word) => ({ word, wdth: isFitWord(word) ? fitWidth(word, ems) : 100 })),
  };
}
