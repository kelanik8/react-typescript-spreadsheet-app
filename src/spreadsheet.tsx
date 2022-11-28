import * as React from "react";
import {
  useLayoutEffect,
  useRef,
  useState,
  KeyboardEvent,
  useEffect,
} from "react";
import { calculateValueOf } from "./formula";

const NUMBER_OF_ROWS = 100;
const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

interface SpreadsheetProps {
  data?: string[][];
}

export function Spreadsheet({
  data = [
    ["A1", "", "=1+50"],
    ["", "B2", ""],
  ],
}: SpreadsheetProps): React.ReactElement {
  const [grid, setGrid] = useState(data);

  const updateGrid = (column: string, row: number, value: string) => {
    const gridCopy = [...grid] as typeof grid;
    const columnIdx = COLUMNS.indexOf(column);
    const rowIndex = row - 1;

    const rowToUpdate = gridCopy[rowIndex] || [];

    rowToUpdate[columnIdx] = value;
    gridCopy[rowIndex] = rowToUpdate;

    setGrid(gridCopy);
  };

  const calculateValue = (content: string) => calculateValueOf(content, grid);

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
              <td key={columnLetter}>
                <Cell
                  column={columnLetter}
                  row={rowIndex + 1}
                  valueUpdated={updateGrid}
                  calculateValue={calculateValue}
                >
                  {grid[rowIndex]?.[columnIndex]}
                </Cell>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface CellProps {
  column: string;
  row: number;
  children: string | undefined;
  valueUpdated: (column: string, row: number, value: string) => void;
  calculateValue: (content: string) => string | undefined;
}

type EditAction = "confirm" | "cancel";

function Cell({
  column,
  row,
  children = "",
  valueUpdated,
  calculateValue,
}: CellProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(children);
  const [value, setValue] = useState(content);
  const [error, setError] = useState<undefined | string>(undefined);

  const editActionRef = useRef<EditAction>("confirm");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const startEditing = () => setIsEditing(true);

  const confirmEditing = () => {
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    editActionRef.current = "cancel";
  };

  const updateContent = (changeEvent: React.ChangeEvent<HTMLInputElement>) =>
    setContent(changeEvent.currentTarget.value);

  const focusCall = () => inputRef.current?.parentElement?.focus();

  const keyPress = (keyPressEvent: KeyboardEvent<HTMLInputElement>) => {
    if (keyPressEvent.key === "Enter") {
      confirmEditing();

      focusCall();
    }
  };

  const keyDown = (keyDownEvent: KeyboardEvent<HTMLInputElement>) => {
    if (keyDownEvent.key === "Escape") {
      cancelEditing();
      focusCall();
    }
  };

  const blur = () => {
    confirmEditing();

    if (editActionRef.current === "confirm") {
      valueUpdated(column, row, content);
    } else {
      setContent(children);
    }
  };

  useLayoutEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      editActionRef.current = "confirm";
    }
  }, [isEditing]);

  useEffect(() => {
    try {
      setValue(calculateValue(children) ?? "");
      setError(undefined);
    } catch (e) {
      setValue("#ERROR");
      setError(e.message);
    }
  }, [children, calculateValue]);

  return (
    <div
      className="cell"
      data-testid={`${column}${row}`}
      tabIndex={0}
      onDoubleClick={startEditing}
      data-error={error}
    >
      {isEditing ? (
        <input
          type="text"
          defaultValue={content}
          ref={inputRef}
          onBlur={blur}
          onChange={updateContent}
          onKeyPress={keyPress}
          onKeyDown={keyDown}
        />
      ) : (
        value
      )}
    </div>
  );
}

/* function renderValueOf(content: undefined | string): string | undefined {
  try {
    return calculateValueOf(content);
  } catch {
    return "#ERROR";
  }
} */
