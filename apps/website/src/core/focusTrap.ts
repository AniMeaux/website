import { usePreviousValue } from "#core/hooks";
import { createFocusTrap } from "focus-trap";
import { useEffect, useRef } from "react";

const FOCUS_TRAP_IGNORE_ATTRIBUTE = "data-focus-trap-ignore";

export function getFocusTrapIgnoreAttribute() {
  return { [FOCUS_TRAP_IGNORE_ATTRIBUTE]: true };
}

export function useFocusTrap(
  targetRef: React.RefObject<HTMLElement>,
  {
    disabled,
    shouldFocusFirstChild = false,
  }: { disabled: boolean; shouldFocusFirstChild?: boolean },
) {
  const elementToReturnFocus = useRef<HTMLElement | null>(null);

  // We can't get the active element in an effect because it can change between
  // the render and the effect.
  // So we get it during the render phase.
  const previousDisabled = usePreviousValue(disabled) ?? false;
  if (previousDisabled && !disabled) {
    elementToReturnFocus.current = document.activeElement as HTMLElement;
  }

  useEffect(() => {
    if (!disabled && targetRef.current != null) {
      const trap = createFocusTrap(targetRef.current, {
        // The target must be focusable.
        fallbackFocus: targetRef.current,

        // Don't give focus to a child element right away to avoid scrolling
        // issues when the keyboard is openned on touch screens during a
        // potential openning animation.
        // Components using this hooks should manage it.
        initialFocus: shouldFocusFirstChild ? undefined : targetRef.current,

        // We might not want to deactivate the trap directly after an escape,
        // so we let the caller handle it.
        escapeDeactivates: false,

        // Because the focus trap is created in a effect, it cannot return the
        // focus to the correct element, so we handle it ourself.
        returnFocusOnDeactivate: false,

        allowOutsideClick: (event) => {
          const ancestor = (event.target as HTMLElement).closest(
            `[${FOCUS_TRAP_IGNORE_ATTRIBUTE}]`,
          );
          return (
            ancestor != null &&
            ancestor.getAttribute(FOCUS_TRAP_IGNORE_ATTRIBUTE) !== "false"
          );
        },
      });

      trap.activate();

      return () => {
        trap.deactivate();

        if (elementToReturnFocus.current != null) {
          elementToReturnFocus.current.focus();
        }
      };
    }

    return undefined;
  }, [disabled, shouldFocusFirstChild, targetRef]);
}
