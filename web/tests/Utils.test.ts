import { describe, expect, test } from "bun:test";
import { permutations } from "../src/Utils";

describe("Permutations", () => {
  test("Single element", () => {
    expect(permutations([1])).toEqual([[1]]);
  });
  test("Two elements", () => {
    expect(permutations([1, 2])).toEqual([
      [1, 2],
      [2, 1],
    ]);
  });
  test("Three elements", () => {
    expect(permutations([1, 2, 3])).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ]);
  });
  test("10 elements", () => {
    const factorialOf10 = Array.from(Array(10))
      .map((_, i) => i + 1)
      .reduce((a, b) => a * b, 1);
    expect(permutations(Array.from(Array(10)).map((_, i) => i)).length).toBe(
      factorialOf10
    );
  });
});
