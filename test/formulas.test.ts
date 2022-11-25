import { calculateValueOf, parse, tokenize } from "../src/formula";

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

  describe("parsing", () => {
    it("throws an error when trying to parse empty formulas", () => {
      expect(() => parse(tokenize(""))).toThrow("Formula has no content");
    });

    it("parses single number values", () => {
      expect(parse(tokenize("1.23"))).toEqual({
        type: "value",
        value: 1.23,
      });
    });

    it("parses negative number values", () => {
      expect(parse(tokenize("-1"))).toEqual({
        type: "value",
        value: -1,
      });
    });

    it("parses addittion", () => {
      expect(parse(tokenize("1+2"))).toEqual({
        type: "operator",
        kind: "+",
        left: { type: "value", value: 1 },
        right: { type: "value", value: 2 },
      });
    });

    it("throws an error when an operand is missing", () => {
      expect(() => parse(tokenize("1+"))).toThrow(
        "Expected operand, but found nothing",
      );

      expect(() => parse(tokenize("+2"))).toThrow(
        "Expected operand, but found +",
      );
    });

    it("throws an error an unexpected tokens appear", () => {
      expect(() => parse(tokenize("1this-is-unexpected"))).toThrow(
        "Expected operator, but found this-is-unexpected",
      );
    });

    it("parses multiple operations", () => {
      expect(parse(tokenize("1+2+3"))).toEqual({
        type: "operator",
        kind: "+",
        left: {
          type: "operator",
          kind: "+",
          left: { type: "value", value: 1 },
          right: { type: "value", value: 2 },
        },
        right: { type: "value", value: 3 },
      });
    });
  });
});
