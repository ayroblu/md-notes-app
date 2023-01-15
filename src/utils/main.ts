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

export function readContentsOfBlob(blob: Blob): Promise<string | null> {
  const reader = new FileReader();
  return new Promise<string | null>((resolve) => {
    reader.addEventListener(
      "loadend",
      () =>
        resolve(
          reader.result instanceof ArrayBuffer
            ? decodeArrayBuffer(reader.result)
            : reader.result,
        ),
      { once: true },
    );
    reader.readAsText(blob);
  });
}
export function decodeArrayBuffer(buf: ArrayBuffer): string {
  const enc = new TextDecoder("utf-8");
  return enc.decode(buf);
}
