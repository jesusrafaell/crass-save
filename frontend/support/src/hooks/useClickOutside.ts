import { useEffect, RefObject } from "react";

type Props<T extends Element> = {
  ref: RefObject<T>;
  handler: (event: MouseEvent | TouchEvent) => void;
};

function useClickOutside<T extends Element>({ ref, handler }: Props<T>): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;
