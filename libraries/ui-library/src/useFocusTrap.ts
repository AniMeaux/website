import { createFocusTrap } from "focus-trap";
import * as React from "react";

type UseFocusTrapOptions = {
  disabled?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
};

export function useFocusTrap(
  targetRef: React.RefObject<HTMLElement>,
  { disabled = false, initialFocusRef }: UseFocusTrapOptions
) {
  React.useEffect(() => {
    if (!disabled && targetRef.current != null) {
      const trap = createFocusTrap(targetRef.current, {
        initialFocus: initialFocusRef?.current ?? undefined,
        escapeDeactivates: false,
        returnFocusOnDeactivate: false,
        allowOutsideClick: (event) => {
          const ancestor = (event.target as HTMLElement).closest(
            "[data-focus-trap-ignore]"
          );

          return (
            ancestor != null &&
            ancestor.getAttribute("data-focus-trap-ignore") !== "false"
          );
        },
      });

      trap.activate();

      return () => {
        trap.deactivate();
      };
    }
  }, [disabled, targetRef, initialFocusRef]);
}
