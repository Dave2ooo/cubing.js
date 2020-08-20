import {
  permutationTolexicographicIdx,
  lexicographicIdxToPermutation,
  orientationsToMask,
  maskToOrientations,
} from "./orbit-indexing";

describe("orbit indexing", () => {
  it("indexes", () => {
    expect(permutationTolexicographicIdx([0, 1, 2])).toBe(0);
    expect(permutationTolexicographicIdx([0, 2, 1])).toBe(1);
    expect(permutationTolexicographicIdx([2, 0, 1])).toBe(4);
    expect(permutationTolexicographicIdx([0, 1, 2, 3, 4, 5])).toBe(0);
    expect(permutationTolexicographicIdx([5, 4, 3, 2, 1, 0])).toBe(719);
  });

  it("un-indexes", () => {
    expect(lexicographicIdxToPermutation(3, 0)).toEqual([0, 1, 2]);
    expect(lexicographicIdxToPermutation(3, 1)).toEqual([0, 2, 1]);
    expect(lexicographicIdxToPermutation(3, 4)).toEqual([2, 0, 1]);
    expect(lexicographicIdxToPermutation(6, 0)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(lexicographicIdxToPermutation(6, 719)).toEqual([5, 4, 3, 2, 1, 0]);
  });

  it("orients", () => {
    expect(orientationsToMask(2, [1, 0, 0, 1, 0, 1, 1, 0])).toEqual(0b10010110);
  });
});

describe("orientationRangeToMask", () => {
  it("converts to mask correctly", () => {
    expect(orientationsToMask(2, [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1])).toBe(
      1217,
    );
  });
  it("converts from mask correctly", () => {
    expect(maskToOrientations(2, 12, 1217)).toEqual([
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
    ]);
  });
  it("round-trips", () => {
    expect(
      maskToOrientations(3, 4, orientationsToMask(3, [2, 0, 2, 1])),
    ).toEqual([2, 0, 2, 1]);
    expect(
      maskToOrientations(4, 6, orientationsToMask(4, [2, 1, 0, 3, 2, 2])),
    ).toEqual([2, 1, 0, 3, 2, 2]);
  });
});
