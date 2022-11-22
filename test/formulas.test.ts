import { calculateValueOf } from "../src/formula";

describe("Formulas", () => {
  it("does not calculate anything for empty cells", () => {
    expect(calculateValueOf(undefined)).toEqual(undefined);
  });

  it("does not calculate anything for fixed values", () => {
    expect(calculateValueOf("some content")).toEqual("some content");
  });
});
