export function exhaustiveCheck(param: never) {
  throw new Error(`Should have been exhaustive, param is: ${param}`);
}
export const isNonNullable = <T>(item: T | null | undefined): item is T =>
  item !== null && item !== undefined;

export function cn(
  ...args: (string | "" | 0 | false | null | undefined)[]
): string {
  return args.filter((a) => a).join(" ");
}

export function entries<V extends object>(value: V): [keyof V, V[keyof V]][] {
  return Object.entries(value) as any;
}
