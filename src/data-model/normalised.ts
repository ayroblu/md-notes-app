import stringify from "fast-json-stable-stringify";
import React from "react";
import type { SerializableParam } from "recoil";
import {
  waitForAll,
  DefaultValue,
  selectorFamily,
  selector,
  useRecoilValue,
  useResetRecoilState,
  atom,
  atomFamily,
  useSetRecoilState,
} from "recoil";

import { syncIdbEffect } from "./idb-effect";

export function normalisedState<K extends SerializableParam, V>(
  name: string,
  { isPersisted }: { isPersisted?: boolean } = {},
) {
  const normState = atomFamily<V | undefined, K>({
    key: `${name}State`,
    default: undefined,
    effects: isPersisted
      ? (key) => [syncIdbEffect(`${name}/${stringify(key)}`)]
      : undefined,
  });
  const keyListState = atom<K[]>({
    key: `${name}KeyListState`,
    default: [],
    effects: isPersisted ? [syncIdbEffect(`${name}List`)] : undefined,
  });
  const keySetState = atom<Set<K>>({
    key: `${name}KeySetState`,
    default: new Set(),
    effects: isPersisted ? [syncIdbEffect(`${name}Set`)] : undefined,
  });
  const clearState = selector({
    key: `${name}ClearState`,
    get: () => {},
    set: ({ get, reset, set }) => {
      const keyList = get(keyListState);
      set(keyListState, []);
      set(keySetState, new Set());
      for (const key of keyList) {
        reset(normState(key));
      }
    },
  });
  const setState = selectorFamily<V, K>({
    key: `${name}SetState`,
    get: (_key) => () => null as V,
    set:
      (key) =>
      ({ get, set }, value) => {
        const keySet = get(keySetState);
        if (!keySet.has(key)) {
          set(keyListState, (prev) => prev.concat(key));
          set(keySetState, (prev) => new Set([...prev, key]));
        }
        set(normState(key), value);
      },
  });
  const multiSetState = selector<[K, V][]>({
    key: `${name}MultiSetState`,
    get: () => null as any,
    set: ({ set }, value) => {
      if (value instanceof DefaultValue) {
        return;
      }
      for (const [key, val] of value) {
        set(setState(key), val);
      }
    },
  });

  return {
    useMultiSet: () => useSetRecoilState(multiSetState),
    useSet: (key: K) => useSetRecoilState(setState(key)),
    useDelete: (key: K) => {
      const reset = useResetRecoilState(normState(key));
      const setKeyList = useSetRecoilState(keyListState);
      return React.useCallback(() => {
        reset();
        setKeyList((keyList) => keyList.filter((k) => k !== key));
      }, [key, reset, setKeyList]);
    },
    useClear: () => useSetRecoilState(clearState),
    useGet: (key: K): V | undefined => {
      const [norm] = useRecoilValue(
        waitForAll([normState(key), keyListState, keySetState]),
      );
      return norm;
    },
    normState,
  };
}
