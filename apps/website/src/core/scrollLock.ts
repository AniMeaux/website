import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useEffect } from "react";

const IGNORE_SCROLL_LOCK_ATTRIBUTE = "data-body-scroll-lock-ignore";

/**
 * Block all HTML elements from scrolling exept for the targeted ref.
 *
 * @param targetRef Only HTML elements to allow scroll on.
 * @param options
 * @param options.disabled Whether the scroll lock is enabled or not.
 */
export function useScrollLock(
  targetRef: React.RefObject<HTMLElement | null>,
  { disabled }: { disabled: boolean }
) {
  useEffect(() => {
    const initialScrollY = window.scrollY;

    if (!disabled && targetRef.current != null) {
      const target = targetRef.current;
      disableBodyScroll(target, {
        reserveScrollBarGap: true,

        // Allow scroll on any descendent of an element with the attibute
        // SCROLL_LOCK_IGNORE_ATTRIBUTE.
        // https://github.com/willmcpo/body-scroll-lock#allowtouchmove
        allowTouchMove: (element) => {
          const ancestor = element.closest(`[${IGNORE_SCROLL_LOCK_ATTRIBUTE}]`);

          return (
            ancestor != null &&
            ancestor.getAttribute(IGNORE_SCROLL_LOCK_ATTRIBUTE) !== "false"
          );
        },
      });

      return () => {
        enableBodyScroll(target);

        // Make sure the scroll gets back to its position.
        // Scrolls can happen on iOS when the keyboard is openned, the scroll
        // lock only block touch events.
        window.scrollTo({ top: initialScrollY });
      };
    }

    return undefined;
  }, [disabled, targetRef]);
}
