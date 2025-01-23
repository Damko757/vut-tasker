import "./extensions/String.extensions.ts";

export const roundTo = (n: number, precision: number = 2) =>
  Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision);
