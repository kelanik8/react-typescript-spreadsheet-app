export function calculateValueOf(
  content: undefined | string,
  grid: string[][],
): undefined | string {
  if (content && content.charAt(0) === "=") {
    return calculateFormula(content.substr(1), grid);
  }

  return content;
}

function calculateFormula(content: string, grid: string[][]): string {
  return String(interpret(parse(tokenize(content)), grid));
}

const numbers = /^\d+(\.\d+)?$/;
const strings = /^'[^']*'|"[^"]*"$/;
const identifiers = /^[A-Z][1-9][0-9]*$/;
const operators = /^[+\-*/&]$/;
const rest = /^[^\s]+$/;

export function tokenize(content: string): string[] {
  const allTokens = [numbers, strings, identifiers, operators, rest];
  const allTokensCombined = allTokens
    .map((regex) => removeFirstAndLastCharacter(regex.source))
    .join("|");
  const token = new RegExp(allTokensCombined, "g");

  return content.match(token) ?? [];
}

function removeFirstAndLastCharacter(value: string): string {
  return value.slice(1, -1);
}

type ParseTree = ValueNode | OperatorNode | ReferenceNode;

type ValueNode =
  | { type: "value"; kind: "number"; value: number }
  | { type: "value"; kind: "string"; value: string };

type OperatorNode = {
  type: "operator";
  kind: string;
  left: ParseTree;
  right: ParseTree;
};

type ReferenceNode = {
  type: "reference";
  column: string;
  row: number;
};

export function parse(tokens: string[]): ParseTree {
  if (tokens.length === 0) {
    throw new Error("Formula has no content");
  }

  const parseTree = readTerm(tokens);

  if (tokens.length > 0) {
    throw new Error(`Unexpected token: ${peek(tokens)}`);
  }

  return parseTree;
}

function readTerm(tokens: string[]): ParseTree {
  let left = readFactor(tokens);

  while (peek(tokens) === "+" || peek(tokens) === "-" || peek(tokens) === "&") {
    const operator = readOperator(tokens);
    const right = readFactor(tokens);

    left = {
      type: "operator",
      kind: operator,
      left,
      right,
    };
  }

  return left;
}

function readOperand(tokens: string[]): ParseTree {
  const nextToken = peek(tokens);
  let sign = 1;

  if (nextToken === "-") {
    next(tokens);
    sign = -1;
  }

  const token = next(tokens);

  if (!token) {
    throw new Error("Expected operand, but found nothing");
  }

  if (numbers.test(token)) {
    return {
      type: "value",
      kind: "number",
      value: sign * parseFloat(token),
    };
  }

  if (strings.test(token)) {
    return {
      type: "value",
      kind: "string",
      value: removeFirstAndLastCharacter(token),
    };
  }

  if (identifiers.test(token)) {
    return {
      type: "reference",
      column: token.charAt(0),
      row: parseInt(token.substring(1), 10),
    };
  }

  throw new Error(`Expected operand, but found ${token}`);
}

function readFactor(tokens: string[]): ParseTree {
  let left = readOperand(tokens);

  while (peek(tokens) === "*" || peek(tokens) === "/") {
    const operator = readOperator(tokens);
    const right = readOperand(tokens);

    left = {
      type: "operator",
      kind: operator,
      left,
      right,
    };
  }

  return left;
}

function readOperator(tokens: string[]): string {
  const token = next(tokens);

  if (!token || !operators.test(token)) {
    throw new Error(`Expected operator, but found ${token ?? "nothing"}`);
  }

  return token;
}

function next(tokens: string[]): string | undefined {
  return tokens.shift();
}

function peek(tokens: string[]): string | undefined {
  return tokens[0];
}

export function interpret(
  node: ParseTree,
  grid: string[][] = [],
): number | string {
  if (node.type === "value") {
    return interpretValue(node);
  }

  if (node.type === "operator") {
    return interpretOperator(node, grid);
  }

  return interpretReference(node, grid);
}

function interpretValue(node: ValueNode): number | string {
  return node.value;
}

function interpretOperator(
  node: OperatorNode,
  grid: string[][],
): number | string {
  const left = interpret(node.left, grid);
  const right = interpret(node.right, grid);

  if (typeof left === "number" && typeof right === "number") {
    if (node.kind === "+") {
      return left + right;
    }

    if (node.kind === "-") {
      return left - right;
    }

    if (node.kind === "*") {
      return left * right;
    }

    return left / right;
  }

  if (typeof left === "string" && typeof right === "string") {
    return left.concat(right);
  }

  throw new Error(
    `Unable to evaluate ${typeof left} ${node.kind} ${typeof right}`,
  );
}

function interpretReference(
  node: ReferenceNode,
  grid: string[][],
): number | string {
  const rowIndex = node.row - 1;
  const columnIndex = node.column.charCodeAt(0) - "A".charCodeAt(0);
  const maybeCellValue = grid[rowIndex]?.[columnIndex];
  const numberValue = parseFloat(maybeCellValue ?? "0");
  const stringValue = String(maybeCellValue ?? "");

  if (stringValue === String(numberValue)) {
    return numberValue;
  }

  if (stringValue.charAt(0) === "=") {
    try {
      return interpret(parse(tokenize(stringValue.substring(1))), grid);
    } catch (error) {
      if (error.message.includes("call stack size")) {
        throw new Error("Formula contains a circular reference");
      }

      throw error;
    }
  }

  return stringValue;
}
