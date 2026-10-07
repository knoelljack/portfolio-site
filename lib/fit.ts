/**
 * Em advances of Science Gothic at wght 800 for each fitted line, measured at
 * the font's three width masters (wdth 50, 100 and 200). The axis interpolates
 * linearly between masters, so these three numbers give a line's width at any
 * wdth exactly. That lets a line be solved to fill its box on the server, with
 * no measuring pass on the client and nothing to reflow once the font lands.
 *
 * A line set anywhere else, or at another weight, needs its own row — remeasure
 * with a span at 100px and `getBoundingClientRect().width / 100`. Setting the
 * letters as inline blocks drops the face's kerning, which moves a line's
 * width by under half a percent: close enough to fill the same box.
 */
const ADVANCE = {
  Jack: [2.3053, 3.1884, 4.8856],
  Knoell: [2.9384, 3.9623, 5.9255],
  'Jack Knoell': [5.512, 7.4655, 11.2759],
  Interfaces: [4.9381, 6.5194, 9.713],
  Systems: [3.9405, 5.3191, 8.0281],
  'Open to new': [5.7325, 7.653, 11.5352],
  'projects.': [4.2645, 5.6956, 8.373],
  Work: [2.5403, 3.4186, 5.0822],
  About: [2.685, 3.7086, 5.682],
  Contact: [3.5586, 4.8811, 7.3961],
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

const isFitWord = (line: string): line is FitWord => line in ADVANCE;

function advance(line: FitWord, wdth: number) {
  const [a50, a100, a200] = ADVANCE[line];
  return wdth <= 100
    ? a50 + ((a100 - a50) * (wdth - 50)) / 50
    : a100 + ((a200 - a100) * (wdth - 100)) / 100;
}

/**
 * The wdth at which `line` fills a box exactly `ems` of its own font-size wide.
 * Clamped to the axis, so a box the line cannot reach leaves it short rather
 * than asking the font for a width it does not have.
 */
export function fitWidth(line: FitWord, ems: number) {
  const [a50, a100, a200] = ADVANCE[line];
  const wdth =
    ems <= a100
      ? 50 + ((ems - a50) / (a100 - a50)) * 50
      : 100 + ((ems - a100) / (a200 - a100)) * 100;
  return Math.round(Math.min(200, Math.max(50, wdth)) * 10) / 10;
}

export type Fit = { ems: number; lines: { text: string; wdth: number }[] };

/**
 * Lines set one above another, every line filling the same box at one shared
 * size. The size comes from the longest line at `longestWdth`; a short set is
 * held to `minEms` so it reads as a headline, not a shout. A line missing from
 * the table still renders, at the default width.
 */
export function fitLines(lines: string[], minEms = 5, longestWdth = 72): Fit {
  const measured = lines.filter(isFitWord);
  const ems = Math.max(minEms, ...measured.map((l) => advance(l, longestWdth)));
  return {
    ems: Math.round(ems * 1000) / 1000,
    lines: lines.map((text) => ({ text, wdth: isFitWord(text) ? fitWidth(text, ems) : 100 })),
  };
}
