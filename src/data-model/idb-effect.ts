import { get, set } from "idb-keyval";
import type { AtomEffect, RecoilValue } from "recoil";
import { DefaultValue } from "recoil";

import { isNonNullable } from "@/utils/main";

export type EffectParams = {
  getPromise: <S>(recoilValue: RecoilValue<S>) => Promise<S>;
};
export const syncIdbEffect =
  <T>(
    dbKey: string,
    defaultFunc?: (params: EffectParams) => Promise<T>,
  ): AtomEffect<T> =>
  ({ getPromise, onSet, setSelf }) => {
    const { broadcastUpdate, listenToUpdates } = getBroadcastHelper(dbKey);
    setSelf(
      get(dbKey).then((savedVal: T | null) =>
        isNonNullable(savedVal)
          ? savedVal
          : defaultFunc
          ? defaultFunc({ getPromise }).then((value) => {
              set(dbKey, value);
              return value;
            })
          : new DefaultValue(),
      ),
    );
    onSet(async (newVal, oldVal) => {
      if (newVal === oldVal) return;
      if (newVal instanceof DefaultValue) return;

      await set(dbKey, newVal);
      broadcastUpdate();
    });
    const dispose = listenToUpdates(async ({ message }) => {
      if (message === SyncIdbMessagesEnum.update) {
        const result: T | undefined = await get(dbKey);
        result !== undefined && setSelf(result);
      }
    });
    return () => {
      dispose();
    };
  };

function getBroadcastHelper(dbKey: string) {
  const bc = "BroadcastChannel" in self ? new BroadcastChannel(dbKey) : null;
  function broadcastUpdate() {
    if (bc) {
      const message: SyncIdbBroadcast = {
        message: SyncIdbMessagesEnum.update,
      };
      bc.postMessage(message);
    }
  }
  function listenToUpdates(func: (message: SyncIdbBroadcast) => void) {
    if (bc) {
      bc.onmessage = (ev) => {
        const { data } = ev;
        func(data);
      };
    }
    return () => {
      if (bc) {
        bc.onmessage = null;
      }
    };
  }
  return {
    broadcastUpdate,
    listenToUpdates,
  };
}
enum SyncIdbMessagesEnum {
  update = "update",
}
type SyncIdbBroadcast = {
  message: SyncIdbMessagesEnum;
};
