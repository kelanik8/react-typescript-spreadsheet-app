const numbers = /^\d+(\.\d+)?$/;
const operators = /^[+\-*/&]$/;
const rest = /^[^\s]+$/;
const strings = /^'[^']*'|"[^"]*"$/;

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

export function calculateValueOf(
  content: undefined | string,
): undefined | string {
  if (content && content.charAt(0) === "=") {
    return calculateFormula(content.substring(1));
  }

  return content;
}

function calculateFormula(content: string): string {
  return String(interpret(parse(tokenize(content))));
}

export function tokenize(content: string): string[] {
  const allTokens = [numbers, strings, operators, rest];
  const allTokensCombined = allTokens
    .map((regex) => removeFirstAndLastCharacter(regex.source))
    .join("|");

  const token = new RegExp(allTokensCombined, "g");

  return content.match(token) ?? [];
}

export function parse(tokens: string[]): ParseTree {
  if (tokens.length === 0) {
    throw new Error("Formula has no content");
  }

  return readFactor(tokens);
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

function next(tokens: string[]): string | undefined {
  return tokens.shift();
}

function peek(tokens: string[]): string | undefined {
  return tokens[0];
}

function readFactor(tokens: string[]): ParseTree {
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

export function interpret(node: ParseTree): number {
  if (node.type === "value") {
    return interpretValue(node);
  }

  return interpretOperator(node);
}

function interpretValue(node: ValueNode): number {
  if (node.kind === "number") {
    return node.value;
  }
  return 0;
}

function interpretOperator(node: OperatorNode): number {
  const left = interpret(node.left);
  const right = interpret(node.right);

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
