import * as React from "react";
import {
  useLayoutEffect,
  useRef,
  useState,
  KeyboardEvent,
  useEffect,
} from "react";

const NUMBER_OF_ROWS = 100;
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
}

type EditAction = "confirm" | "cancel";

function Cell({
  column,
  row,
  children = "",
  valueUpdated,
}: CellProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(children);
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

  return (
    <div
      className="cell"
      data-testid={`${column}${row}`}
      tabIndex={0}
      onDoubleClick={startEditing}
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
        children
      )}
    </div>
  );
}
