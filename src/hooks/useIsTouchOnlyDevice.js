import { useEffect, useState } from "react";

export function useTouchOnlyDevice() {
  const [touchOnly, setTouchOnly] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const fineAny = window.matchMedia("(any-pointer: fine)");

    const update = () =>
      setTouchOnly(coarse.matches && !fineAny.matches);

    update();

    coarse.addEventListener("change", update);
    fineAny.addEventListener("change", update);

    return () => {
      coarse.removeEventListener("change", update);
      fineAny.removeEventListener("change", update);
    };
  }, []);

  return touchOnly;
}
