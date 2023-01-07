import React from "react";

type Function2 = (...args: any[]) => any;
export const useStable = <T extends Function2>(func: T): T => {
  const ref = React.useRef(func);
  ref.current = func;

  return React.useCallback(
    (...args: Parameters<T>) => ref.current(...args) as ReturnType<T>,
    [],
  ) as T;
};
