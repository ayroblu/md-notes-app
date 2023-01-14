import { get, set } from "idb-keyval";
import type { AtomEffect } from "recoil";
import { DefaultValue } from "recoil";

import { isNonNullable } from "@/utils/main";

export const syncIdbEffect =
  <T>(dbKey: string): AtomEffect<T> =>
  ({ onSet, setSelf }) => {
    const { broadcastUpdate, listenToUpdates } = getBroadcastHelper(dbKey);
    setSelf(
      get(dbKey).then((savedVal: T | null) =>
        isNonNullable(savedVal) ? savedVal : new DefaultValue(),
      ),
    );
    onSet(async (newVal, oldVal) => {
      if (newVal === oldVal) return;

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
