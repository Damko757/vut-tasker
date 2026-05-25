import stc from "string-to-color";

/** Predefined subject colors for `subjectToColor` */
const subjectColors: Record<string, string> = {
  "3BIT": "#FF69B4",
};
export interface RGB {
  r: number;
  g: number;
  b: number;
}
interface HSV {
  hue: number;
  saturation: number;
  value: number;
}
export type normalizedNumber = number;
export interface RGBA extends RGB {
  alpha: normalizedNumber;
}

export type Colors = RGB | RGBA | HSV;

export class Color {
  /**
   * Mixes two RGB colors with specified ratio
   * @param a First color
   * @param b Second color
   * @param ratio Amount to pick (0 - only A, 1 - only B)
   */
  static mixColors<ColorT extends Colors>(
    a: ColorT,
    b: ColorT,
    ratio: normalizedNumber,
  ) {
    const mix = { ...a };
    for (const key in a) {
      const diff = <number>b[key] - <number>a[key];
      mix[key] = Math.round(
        <number>mix[key] + diff * ratio,
      ) as (typeof mix)[typeof key];
    }

    return mix;
  }

  /**
   * Converts RGB(A) to HEX color
   * @param rgb Color to convert
   * @returns HEX color string
   */
  static rgbToHex(rgb: RGB | RGBA) {
    let out = "#";
    for (const key in rgb) {
      out += (rgb[key as keyof typeof rgb] as number)
        .toString(16)
        .padStart(2, "0");
    }
    return out;
  }

  /**
   * Converts subject name into its respective color.
   * @param subjectName Name of the subject to convert
   * @returns HEX color
   */
  static subjectToColor(subjectName: string): string {
    if (subjectName in subjectColors) return subjectColors[subjectName]; // Lookup in predefined colors

    return stc(subjectName);
  }
}
