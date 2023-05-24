// @flow
import type { Enableable, UIControl } from "config/flowtypes";
import { useEffect } from "react";

export const getValue = <T: UIControl> (item: T, state: State) => {
  const value = state[item.topic];
  if (value == null) {
    if (item.topic === "") {
      throw new Error(
        `Missing topic in ${item.type} "${item.text}"`
      );
    }
    throw new Error(
      `Unknown topic "${item.topic}" in ${item.type} "${item.text}"`
    );
  }
  return value;
};

export const isEnabled = <T: Enableable> (item: T, state: State) => {
  if (item.enableCondition != null) {
    return item.enableCondition(state);
  }
  return true;
};

export const isDisabled = <T: Enableable> (item: T, state: State) =>
  !isEnabled(item, state);

  // Improved version of https://usehooks.com/useOnClickOutside/
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return;

      handler(event);
    };

    const validateEventStart = (event) => {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};
