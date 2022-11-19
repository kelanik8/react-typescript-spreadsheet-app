import * as React from "react";

const NUMBER_OF_ROWS = 5;
const COLUMNS = ["A", "B", "C", "D"];

interface SpreadsheetProps {
  data?: string[][];
}

export function Spreadsheet({
  data = [
    ["content in A1", ""],
    ["", "content in B2"],
  ],
}: SpreadsheetProps): React.ReactElement {
  return (
    <table className="spreadsheet">
      <thead>
        <tr>
          <th aria-label="empty header" />
          {COLUMNS.map((letter) => (
            <th key={letter}>{letter}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[...Array(NUMBER_OF_ROWS)].map((_, rowIndex) => (
          <tr key={rowIndex.toString()}>
            <th scope="row">{rowIndex + 1}</th>
            {COLUMNS.map((columnLetter, columnIndex) => (
              <td
                key={columnLetter}
                data-testid={`${columnLetter}${rowIndex + 1}`}
                className={`${data[rowIndex]?.[columnIndex]}`}
                tabIndex={0}
              >
                {data[rowIndex]?.[columnIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
