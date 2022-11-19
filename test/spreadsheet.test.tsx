import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("displays data in cells", () => {
    render(
      <Spreadsheet
        data={[
          ["content in A1", ""],
          ["", "content in B2"],
        ]}
      />,
    );

    expect(screen.getByTestId("A1")).toHaveTextContent("content in A1");
    expect(screen.getByTestId("B2")).toHaveTextContent("content in B2");
  });

  describe("cell", () => {
    it("is focused when clicked", () => {
      render(<Spreadsheet />);
      const cell = screen.getByTestId("B2");

      userEvent.click(cell);

      expect(cell).toHaveFocus();
    });

    it("switches to an input element when double clicked", () => {
      render(<Spreadsheet />);

      const cell = screen.getByTestId("B2");

      userEvent.dblClick(cell);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("automatically focuses the input element", () => {
      render(<Spreadsheet />);

      const cell = screen.getByTestId("B2");

      userEvent.dblClick(cell);

      expect(screen.getByRole("textbox")).toHaveFocus();
    });

    it("hides the input element again when clicking anywhere else", () => {
      render(<Spreadsheet />);

      const cellToEdit = screen.getByTestId("B2");
      const otherCell = screen.getByTestId("A1");

      userEvent.dblClick(cellToEdit);
      userEvent.click(otherCell);

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });
});
