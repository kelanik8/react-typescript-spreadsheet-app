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

    it("updates the cell with the typed value when clicking anywhere else", () => {
      render(<Spreadsheet data={[["old value"]]} />);

      const cellToEdit = screen.getByTestId("A1");
      const otherCell = screen.getByTestId("B1");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");

      userEvent.type(inputElement, "updated value");
      userEvent.click(otherCell);

      expect(cellToEdit).toHaveTextContent("updated value");
    });

    it("hides the input element again when hitting enter", () => {
      render(<Spreadsheet data={[]} />);
      const cellToEdit = screen.getByTestId("B2");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "update value{enter}");

      expect(inputElement).not.toBeInTheDocument();
    });

    it("updates the cell with the typed value when hitting enter", () => {
      render(<Spreadsheet data={[["old value"]]} />);
      const cellToEdit = screen.getByTestId("A1");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "update value{enter}");

      expect(cellToEdit).toHaveTextContent("update value");
    });

    it("refocuses itself again after hitting enter", () => {
      render(<Spreadsheet />);
      const cellToEdit = screen.getByTestId("B2");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "updated value{enter}");

      expect(cellToEdit).toHaveFocus();
    });

    it("hides the input element again when hitting escape", () => {
      render(<Spreadsheet />);
      const cellToEdit = screen.getByTestId("B2");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "updated value{esc}");

      expect(inputElement).not.toBeInTheDocument();
    });

    it("does not update the cell with the typed value when hitting escape", () => {
      render(<Spreadsheet data={[["old value"]]} />);
      const cellToEdit = screen.getByTestId("A1");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "updated value{esc}");

      expect(screen.getByTestId("A1")).not.toHaveTextContent("updated value");
    });

    it("refocuses itself again after hitting escape", () => {
      render(<Spreadsheet />);
      const cellToEdit = screen.getByTestId("B2");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "updated value{esc}");

      expect(cellToEdit).toHaveFocus();
    });

    it("resets previously cancelled edits when editing again", () => {
      render(<Spreadsheet data={[["cell data"]]} />);
      const cellToEdit = screen.getByTestId("A1");
      const otherCell = screen.getByTestId("B1");

      userEvent.dblClick(cellToEdit);
      let inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "updated{esc}");
      userEvent.dblClick(cellToEdit);
      inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "last edit");
      userEvent.click(otherCell);

      expect(cellToEdit).toHaveTextContent("last edit");
    });

    it("resets it value again after cancelling the edit", () => {
      render(<Spreadsheet data={[["cell data"]]} />);
      const cellToEdit = screen.getByTestId("A1");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "updated{esc}");
      userEvent.dblClick(cellToEdit);

      expect(screen.getByRole("textbox")).toHaveValue("cell data");
    });
  });

  describe("formulas", () => {
    it("updates the cell with the calculated value", () => {
      render(<Spreadsheet />);
      const cellToEdit = screen.getByTestId("A2");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "=1+2{enter}");

      expect(cellToEdit).toHaveTextContent("3");
    });

    it("indicates an error in a cell when something went wrong", () => {
      render(<Spreadsheet />);
      const cellToEdit = screen.getByTestId("A2");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "=1+unexpected{enter}");

      expect(cellToEdit).toHaveTextContent("#ERROR");
    });

    it("shows full error message when erroneous cell is focused", () => {
      render(<Spreadsheet />);
      const cellToEdit = screen.getByTestId("A2");

      userEvent.dblClick(cellToEdit);
      const inputElement = screen.getByRole("textbox");
      userEvent.type(inputElement, "={enter}");
      userEvent.click(cellToEdit);

      const errorAttribute = document.activeElement?.getAttribute("data-error");

      expect(errorAttribute).toEqual("Formula has no content");
    });
  });
});
