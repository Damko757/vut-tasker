export type date = string;

export function permutations<T>(arr: T[]): T[][] {
  if (arr.length == 0) return [[]];
  const out: T[][] = [];
  arr.forEach((el, i) => {
    const permsWithoutEl = permutations(arr.filter((x, ii) => ii != i));
    const permsWithEl = permsWithoutEl.map((x) => [el, ...x]);
    permsWithEl.forEach((perm) => out.push(perm));
  });
  return out;
}

export function smallerFirstSort<T>(a: T, b: T): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
