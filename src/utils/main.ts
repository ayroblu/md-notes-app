export function exhaustiveCheck(param: never) {
  throw new Error(`Should have been exhaustive, param is: ${param}`);
}
export const isNonNullable = <T>(item: T | null | undefined): item is T =>
  item !== null && item !== undefined;
