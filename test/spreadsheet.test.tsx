import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Spreadsheet } from "../src/spreadsheet";

describe("spreadsheet", () => {
  it("consists of columns labelled with a letter", () => {
    render(<Spreadsheet />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("consists of five numbered rows", () => {
    render(<Spreadsheet />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("consists of cells", () => {
    render(<Spreadsheet />);

    expect(screen.getByTestId("A1")).toBeInTheDocument();
    expect(screen.getByTestId("D5")).toBeInTheDocument();
  });
});
