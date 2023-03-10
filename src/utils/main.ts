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

export function wait(numMillis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, numMillis));
}
export function orderBy<T>(
  funcs: ((t: T) => Date | boolean | number | string)[],
  order: ("asc" | "desc")[],
) {
  return (a: T, b: T) => {
    for (let i = 0; i < funcs.length; ++i) {
      const func = funcs[i]!;
      if (func(a) > func(b)) {
        return order[i] === "desc" ? -1 : 1;
      } else if (func(b) > func(a)) {
        return order[i] === "desc" ? 1 : -1;
      }
    }
    return 0;
  };
}
