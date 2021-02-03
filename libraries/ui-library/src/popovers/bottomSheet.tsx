import cn from "classnames";
import invariant from "invariant";
import * as React from "react";
import {
  BottomSheet as BaseBottomSheet,
  BottomSheetProps,
  BottomSheetRef,
} from "react-spring-bottom-sheet";

export type { BottomSheetProps, BottomSheetRef };

function getRootElement() {
  const rootElement = document.getElementById("__next");
  invariant(rootElement, 'Could not find the root element with id="__next"');
  return rootElement;
}

const POINTER_EVENTS_NONE = "pointer-events-none";

// On iOS a click/touch on the backdrop close the sheet but is also dispatched
// to the element beneath it.
// To prevent that we temporarily block all pointer events on the app root
// element.
function useBlockedPointer(open: boolean) {
  const rootElement = React.useRef(getRootElement());

  React.useEffect(() => {
    if (open) {
      rootElement.current.classList.add(POINTER_EVENTS_NONE);

      return () => {
        setTimeout(
          () => {
            // > The ref value 'rootElement.current' will likely have changed
            // > by the time this effect cleanup function runs"
            // The root element won't change.
            // eslint-disable-next-line react-hooks/exhaustive-deps
            rootElement.current.classList.remove(POINTER_EVENTS_NONE);
          },
          // Sould be long enough for the click/touch event to be blocked.
          250
        );
      };
    }
  }, [open]);
}

export const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
  function BottomSheet(props, ref) {
    useBlockedPointer(props.open);
    return <BaseBottomSheet ref={ref} {...props} />;
  }
);

export function BottomSheetHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...rest}
      className={cn("w-full h-12 flex-none flex items-center", className)}
    />
  );
}
