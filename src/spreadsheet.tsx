import * as React from "react";

const NUMBER_OF_ROWS = 5;
const COLUMNS = ["A", "B", "C", "D"];

export function Spreadsheet(): React.ReactElement {
  return (
    <table>
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
            {COLUMNS.map((columnLetter) => (
              <td
                key={columnLetter}
                data-testid={`${columnLetter}${rowIndex + 1}`}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
