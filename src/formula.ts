export function calculateValueOf(
  content: undefined | string,
): undefined | string {
  if (content && content.charAt(0) === "=") {
    return calculateFormula(content.substr(1));
  }

  return content;
}

function calculateFormula(content: string): string {
  return String(interpret(parse(tokenize(content))));
}

const numbers = /^\d+(\.\d+)?$/;
const strings = /^'[^']*'|"[^"]*"$/;
const operators = /^[+\-*/&]$/;
const rest = /^[^\s]+$/;

export function tokenize(content: string): string[] {
  const allTokens = [numbers, strings, operators, rest];
  const allTokensCombined = allTokens
    .map((regex) => removeFirstAndLastCharacter(regex.source))
    .join("|");
  const token = new RegExp(allTokensCombined, "g");

  return content.match(token) ?? [];
}

function removeFirstAndLastCharacter(value: string): string {
  return value.slice(1, -1);
}

type ParseTree = ValueNode | OperatorNode;
type ValueNode =
  | { type: "value"; kind: "number"; value: number }
  | { type: "value"; kind: "string"; value: string };
type OperatorNode = {
  type: "operator";
  kind: string;
  left: ParseTree;
  right: ParseTree;
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

export function interpret(node: ParseTree): number | string {
  if (node.type === "value") {
    return interpretValue(node);
  }

  return interpretOperator(node);
}

function interpretValue(node: ValueNode): number | string {
  return node.value;
}

function interpretOperator(node: OperatorNode): number | string {
  const left = interpret(node.left);
  const right = interpret(node.right);

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
