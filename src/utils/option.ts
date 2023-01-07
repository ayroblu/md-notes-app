export type OptionType<T> = None<T> | Some<T>;

export const Option = <T>(value: T | null | undefined): None<T> | Some<T> => {
  if (isNotNullOrUndefined(value)) {
    return new Some<T>(value);
  } else {
    return new None<T>();
  }
};

export class Some<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }

  map<B>(f: (a: NonNullable<T>) => B | null | undefined): OptionType<B> {
    return Option(f(this.value as NonNullable<T>));
  }

  flatMap<B>(f: (a: NonNullable<T>) => OptionType<B>): OptionType<B> {
    return f(this.value as NonNullable<T>);
  }

  getOrElse<K>(_a: K): K | T {
    return this.value;
  }

  getOrElseL<K>(_f: () => K): K | T {
    return this.value;
  }

  getOrThrow(_err?: () => Error): T {
    return this.value;
  }

  toNullable(): T | null {
    return this.value;
  }

  isNone(): boolean {
    return false;
  }

  isSome(): boolean {
    return true;
  }

  toString(): string {
    return `Some(${toString(this.value)})`;
  }
}

export class None<T> {
  map<B>(_f: (a: NonNullable<T>) => B | null | undefined): OptionType<B> {
    return new None<B>();
  }

  flatMap<B>(_f: (a: NonNullable<T>) => OptionType<B>): OptionType<B> {
    return new None();
  }

  getOrElse<K>(a: K): K | T {
    return a;
  }

  getOrElseL<K>(f: () => K): K | T {
    return f();
  }

  getOrThrow(err?: () => Error): T {
    const error = err || (() => new Error("Expected value to not be null"));
    throw error();
  }

  toNullable(): T | null {
    return null;
  }

  isNone(): boolean {
    return true;
  }

  isSome(): boolean {
    return false;
  }

  toString(): string {
    return "None";
  }
}

const toString = (x: unknown): string => {
  if (typeof x === "string") {
    return JSON.stringify(x);
  }
  if (x instanceof Date) {
    return `new Date('${x.toISOString()}')`;
  }
  if (Array.isArray(x)) {
    return `[${x.map(toString).join(", ")}]`;
  }
  try {
    return JSON.stringify(x, null, 2) || "undefined";
  } catch (e) {
    return String(x);
  }
};
const isNotNullOrUndefined = <T>(item: T | null | undefined): item is T =>
  item !== null && item !== undefined;
