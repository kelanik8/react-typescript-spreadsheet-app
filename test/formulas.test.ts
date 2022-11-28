import { calculateValueOf, parse, tokenize, interpret } from "../src/formula";

describe("formulas", () => {
  it("does not calculate anything for empty cells", () => {
    expect(calculateValueOf(undefined, [])).toEqual(undefined);
  });

  it("does not calculate anything for fixed values", () => {
    expect(calculateValueOf("some content", [])).toEqual("some content");
  });

  it("calculates simple arithmetic", () => {
    expect(calculateValueOf("=1+2", [])).toEqual("3");
  });

  it("evaluates cell references", () => {
    expect(calculateValueOf("=A1+2", [["1"]])).toEqual("3");
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
      expect(tokenize("+-*/&")).toEqual(["+", "-", "*", "/", "&"]);
    });

    it("tokenizes thing that are unexpected", () => {
      expect(tokenize("unexpected #!@")).toEqual(["unexpected", "#!@"]);
    });

    it("tokenizes strings", () => {
      expect(tokenize("'single quoted value'")).toEqual([
        "'single quoted value'",
      ]);

      expect(tokenize('"double quoted value"')).toEqual([
        '"double quoted value"',
      ]);
    });

    it("tokenizes cell identifiers", () => {
      expect(tokenize("A1")).toEqual(["A1"]);
    });
  });

  describe("parsing", () => {
    it("throws an error when trying to parse empty formulas", () => {
      expect(() => parse(tokenize(""))).toThrow("Formula has no content");
    });

    it("parses single number values", () => {
      expect(parse(tokenize("1.23"))).toEqual({
        type: "value",
        kind: "number",
        value: 1.23,
      });
    });

    it("parses negative number values", () => {
      expect(parse(tokenize("-1"))).toEqual({
        type: "value",
        kind: "number",
        value: -1,
      });
    });

    it("parses addittion", () => {
      expect(parse(tokenize("1+2"))).toEqual({
        type: "operator",
        kind: "+",
        left: { type: "value", kind: "number", value: 1 },
        right: { type: "value", kind: "number", value: 2 },
      });
    });

    it("parses string values", () => {
      expect(parse(tokenize("'string value'"))).toEqual({
        type: "value",
        kind: "string",
        value: "string value",
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
        "Unexpected token: this-is-unexpected",
      );
    });

    it("parses multiple operations", () => {
      expect(parse(tokenize("1+2+3"))).toEqual({
        type: "operator",
        kind: "+",
        left: {
          type: "operator",
          kind: "+",
          left: { type: "value", kind: "number", value: 1 },
          right: { type: "value", kind: "number", value: 2 },
        },
        right: { type: "value", kind: "number", value: 3 },
      });
    });

    it("parses string concatenation", () => {
      expect(parse(tokenize("'a'&'b'"))).toEqual({
        type: "operator",
        kind: "&",
        left: { type: "value", kind: "string", value: "a" },
        right: { type: "value", kind: "string", value: "b" },
      });
    });

    it("parses cell references", () => {
      expect(parse(tokenize("A1"))).toEqual({
        type: "reference",
        column: "A",
        row: 1,
      });
    });
  });

  describe("interpreting", () => {
    it("interprets single numbers", () => {
      expect(interpret(parse(tokenize("1")))).toEqual(1);
    });

    it("interprets addition", () => {
      expect(interpret(parse(tokenize("1+2")))).toEqual(3);
    });

    it("interprets subtraction", () => {
      expect(interpret(parse(tokenize("3-2")))).toEqual(1);
    });

    it("interprets division", () => {
      expect(interpret(parse(tokenize("8/2")))).toEqual(4);
    });

    it("concatenates strings", () => {
      expect(interpret(parse(tokenize("'a'&'b'")))).toEqual("ab");
    });

    it("throws an error when incompatible types are used", () => {
      expect(() => interpret(parse(tokenize("1+'a'")))).toThrow(
        "Unable to evaluate number + string",
      );
    });

    it("interprets references to empty cells as empty strings", () => {
      expect(interpret(parse(tokenize("A1")), [])).toEqual("");
    });

    it("interprets cell references to strings", () => {
      expect(interpret(parse(tokenize("A1")), [["some string"]])).toEqual(
        "some string",
      );
    });

    it("interprets cell references to numbers", () => {
      expect(interpret(parse(tokenize("A1")), [["1"]])).toEqual(1);
    });

    it("interprets operations with cell references", () => {
      expect(interpret(parse(tokenize("A1+2")), [["1"]])).toEqual(3);
    });

    it("interprets to interupt formulas from cell references", () => {
      expect(interpret(parse(tokenize("A1")), [["=1+2"]])).toEqual(3);
    });

    it("throws an error when interpreting circular references", () => {
      expect(() => interpret(parse(tokenize("A1")), [["=B1", "=A1"]])).toThrow(
        "Formula contains a circular reference",
      );
    });
  });
});
