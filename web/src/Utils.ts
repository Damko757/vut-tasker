import moment from "moment";
import "./extensions/String.extensions.ts";

export const roundTo = (n: number, precision: number = 2) =>
  Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision);

/**
 * Returns First two letters of day (Mo, Tu, We, Th, Fr, Sa, Su)
 * @param date
 */
export function getDayByDate(date: string) {
  return ["Su", "Mo", "Tu", "Th", "Fr", "Sa", "Su"][
    moment(date.split(" ")[0]).day()
  ];
}
