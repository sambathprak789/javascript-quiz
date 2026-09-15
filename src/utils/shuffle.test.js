import { describe, it, expect } from "vitest";
import { shuffle } from "./shuffle.js";

describe("shuffle", () => {
  it("does not mutate the original array", () => {
    const original = [1, 2, 3, 4, 5];
    shuffle(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns an array with the same elements", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original);
    expect(result.slice().sort()).toEqual(original.slice().sort());
  });

  it("returns an array of the same length", () => {
    const original = [1, 2, 3, 4, 5, 6, 7];
    expect(shuffle(original)).toHaveLength(original.length);
  });
});
