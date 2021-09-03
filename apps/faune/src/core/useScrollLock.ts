import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useEffect } from "react";

type UseScrollLockOptions = {
  disabled?: boolean;
};

export function useScrollLock(
  targetRef: React.RefObject<HTMLElement | null>,
  { disabled = false }: UseScrollLockOptions
) {
  useEffect(() => {
    if (!disabled && targetRef.current != null) {
      const target = targetRef.current;
      disableBodyScroll(target, {
        allowTouchMove: (element) => {
          const ancestor = element.closest("[data-body-scroll-lock-ignore]");

          return (
            ancestor != null &&
            ancestor.getAttribute("data-body-scroll-lock-ignore") !== "false"
          );
        },
      });

      return () => {
        enableBodyScroll(target);
      };
    }
  }, [disabled, targetRef]);
}
