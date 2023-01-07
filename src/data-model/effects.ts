import { get, set } from "idb-keyval";
import type { AtomEffect } from "recoil";
import { DefaultValue } from "recoil";

import { isNonNullable } from "../utils/main";

export const syncIdbEffect =
  <T>(dbKey: string): AtomEffect<T> =>
  ({ onSet, setSelf }) => {
    setSelf(
      get(dbKey).then((savedVal: T | null) =>
        isNonNullable(savedVal) ? savedVal : new DefaultValue(),
      ),
    );
    onSet((newVal, oldVal) => {
      if (newVal === oldVal) return;

      set(dbKey, newVal);
    });
  };
