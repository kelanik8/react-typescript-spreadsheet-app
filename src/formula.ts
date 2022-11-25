const numbers = /^\d+(\.\d+)?$/;
const operators = /^[+\-*/]$/;
const rest = /^[^\s]+$/;

export function calculateValueOf<T>(content: T): T {
  return content;
}

export function tokenize(content: string): string[] {
  const allTokens = [numbers, operators, rest];
  const allTokensCombined = allTokens
    .map((regex) => removeFirstAndLastCharacter(regex.source))
    .join("|");

  const token = new RegExp(allTokensCombined, "g");

  return content.match(token) ?? [];
}

// console.log(tokenize("unexpected #!@"));

type ParseTree =
  | { type: "value"; value: number }
  | { type: "operator"; kind: string; left: ParseTree; right: ParseTree };

export function parse(tokens: string[]): ParseTree {
  if (tokens.length === 0) {
    throw new Error("Formula has no content");
  }

  return readOperation(tokens);
}

function readOperand(tokens: string[]): ParseTree {
  const nextToken = peek(tokens);
  let sign = 1;

  if (nextToken === "-") {
    next(tokens);
    sign = -1;
  }

  const token = next(tokens);

  if (!token || !numbers.test(token)) {
    throw new Error(`Expected operand, but found ${token ?? "nothing"}`);
  }

  return {
    type: "value",
    value: sign * parseFloat(token),
  };
}

function next(tokens: string[]): string | undefined {
  return tokens.shift();
}

function peek(tokens: string[]): string | undefined {
  return tokens[0];
}

function readOperation(tokens: string[]): ParseTree {
  let left = readOperand(tokens);

  while (peek(tokens)) {
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

function removeFirstAndLastCharacter(value: string): string {
  return value.slice(1, -1);
}

function readOperator(tokens: string[]): string {
  const token = next(tokens);

  if (!token || !operators.test(token)) {
    throw new Error(`Expected operator, but found ${token ?? "nothing"}`);
  }

  return token;
}
