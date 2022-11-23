import { calculateValueOf, tokenize } from "../src/formula";

describe("formulas", () => {
  it("does not calculate anything for empty cells", () => {
    expect(calculateValueOf(undefined)).toEqual(undefined);
  });

  it("does not calculate anything for fixed values", () => {
    expect(calculateValueOf("some content")).toEqual("some content");
  });

  xit("calculates simple arithmetic", () => {
    expect(calculateValueOf("=1+2")).toEqual("3");
  });

  describe("tokenize", () => {
    it("has nothing to do for an empty string", () => {
      expect(tokenize("")).toEqual([]);
    });

    it("tokenizes numbers", () => {
      expect(tokenize("1")).toEqual(["1"]);
      expect(tokenize("12.34")).toEqual(["12.34"]);
      expect(tokenize("-1.23")).toEqual(["-", "1.23"]);
    });

    it("tokenizes operators", () => {
      expect(tokenize("+-*/")).toEqual(["+", "-", "*", "/"]);
    });

    it("tokenizes thing that are unexpected", () => {
      expect(tokenize("unexpected #!@")).toEqual(["unexpected", "#!@"]);
    });
  });
});
