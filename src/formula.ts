export function calculateValueOf<T>(content: T): T {
  return content;
}

export function tokenize(content: string): string[] {
  return content.match(/\d+(\.\d+)?|[+\-*/]|[^\s]+/g) ?? [];
}
