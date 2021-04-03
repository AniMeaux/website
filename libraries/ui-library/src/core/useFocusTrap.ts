import { createFocusTrap } from "focus-trap";
import * as React from "react";

type UseFocusTrapOptions = {
  disabled?: boolean;
};

export function useFocusTrap(
  targetRef: React.RefObject<HTMLElement>,
  { disabled = false }: UseFocusTrapOptions
) {
  React.useEffect(() => {
    if (!disabled && targetRef.current != null) {
      const trap = createFocusTrap(targetRef.current, {
        fallbackFocus: targetRef.current,
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
  }, [disabled, targetRef]);
}
