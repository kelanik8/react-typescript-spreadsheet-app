describe("spreadsheet", () => {
  it("consists of columns labelled with a letter", () => {
    render(<Spreadsheet />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });
});
