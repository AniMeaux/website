import cn from "classnames";
import invariant from "invariant";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AnimateHeight,
  useFocusTrap,
  useLatestDefinedValue,
  useScrollLock,
} from "../core";
import { PageScrollProvider, useIsScrollAtTheTop } from "../layouts";

type ModalContextValue = {
  onDismiss: () => void;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const context = React.useContext(ModalContext);

  invariant(
    context != null,
    "useModalContext should not be used outside of a Modal"
  );

  return context;
}

export function ModalHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  const { isAtTheTop } = useIsScrollAtTheTop();

  return (
    <header
      {...rest}
      className={cn(
        "transition-shadow duration-200 ease-in-out sticky top-0 ring-1 w-full h-12 flex-none px-4 flex items-center space-x-2",
        {
          "ring-transparent": isAtTheTop,
          "ring-gray-100 bg-white": !isAtTheTop,
        },
        className
      )}
    />
  );
}

type ModalProps = React.HTMLAttributes<HTMLElement> & {
  open: boolean;
  isFullScreen?: boolean;
  onDismiss: () => void;
};

export function Modal({
  open,
  onDismiss,
  isFullScreen = false,
  className,
  children,
  ...rest
}: ModalProps) {
  const moutingPoint = React.useMemo<HTMLElement>(
    () => document.createElement("div"),
    []
  );
  const modalElement = React.useRef<HTMLDivElement | null>(null);
  const scrollElement = React.useRef<HTMLDivElement>(null!);
  const elementToReturnFocus = React.useRef<HTMLElement | null>(null);

  const [visible, setVisible] = React.useState(false);
  useScrollLock(scrollElement, { disabled: !visible });
  useFocusTrap(modalElement, {
    disabled: !visible,
    fallbackFocus: modalElement,
  });

  React.useLayoutEffect(() => {
    if (open) {
      // The modal must be visible immediately.
      setVisible(true);

      elementToReturnFocus.current = document.activeElement as HTMLElement;

      // We need to append the mounting point before the render triggered by
      // `setVisible(true)` because the content might contain a component with
      // an `autoFocus` prop.
      // This prop will only work for element in the DOM.
      document.body.appendChild(moutingPoint);
    }
  }, [open, moutingPoint]);

  React.useEffect(() => {
    if (visible) {
      return () => {
        if (elementToReturnFocus.current != null) {
          elementToReturnFocus.current.focus();
        }

        // Remove the mounting point after the modal is completely hidden.
        document.body.removeChild(moutingPoint);
      };
    }
  }, [visible, moutingPoint]);

  // Render a "frozen" version of the children during the closing animation.
  const childElement = useLatestDefinedValue<React.ReactNode>(
    open ? children : null
  );

  // Make sure the update the height of the window for full screen.
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);
  React.useLayoutEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDismiss = React.useRef(onDismiss);
  React.useLayoutEffect(() => {
    handleDismiss.current = onDismiss;
  });
  const contextValue = React.useMemo<ModalContextValue>(
    () => ({ onDismiss: () => handleDismiss.current() }),
    []
  );

  if (!visible) {
    return null;
  }

  // The modal must be hidden after the end of the animation.
  function handleAnimationEnd() {
    if (!open) {
      setVisible(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
    }
  }

  function handleOverlayClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (open) {
      event.preventDefault();
      event.stopPropagation();
      onDismiss();
    }
  }

  return ReactDOM.createPortal(
    <>
      <div
        // Allow click
        data-focus-trap-ignore="true"
        onClick={handleOverlayClick}
        className={cn(
          "z-20 transition-colors ease-in-out duration-200 fixed inset-0 overscroll-none cursor-pointer bg-black bg-opacity-20",
          {
            // "bg-opacity-80": isFullScreen,
            // "bg-opacity-20": !isFullScreen,
            "animate-fade-in": open,
            "animate-fade-out": !open,
          }
        )}
      />

      <div
        {...rest}
        tabIndex={0}
        ref={modalElement}
        onAnimationEnd={handleAnimationEnd}
        onKeyDown={handleKeyDown}
        className={cn(
          "z-20 focus:outline-none transition-spacing ease-in-out duration-200 fixed left-0 bottom-0 right-0 overscroll-none max-h-screen",
          {
            "p-0": isFullScreen,
            "modal-padding": !isFullScreen,
            "animate-bottom-slide-in": open,
            "animate-bottom-slide-out": !open,
          },
          className
        )}
      >
        <div
          className={cn("bg-white transition-all ease-in-out duration-200", {
            "shadow-none rounded-none": isFullScreen,
            "shadow-md rounded-3xl": !isFullScreen,
          })}
        >
          <AnimateHeight
            refProp={scrollElement}
            style={{ height: isFullScreen ? windowHeight : undefined }}
          >
            <div
              className={cn({
                // We don't animate the padding to avoid `AnimateHeight` to go
                // crazy.
                "modal-content-padding": isFullScreen,
              })}
            >
              <PageScrollProvider containerRef={scrollElement}>
                <ModalContext.Provider value={contextValue}>
                  {childElement}
                </ModalContext.Provider>
              </PageScrollProvider>
            </div>
          </AnimateHeight>
        </div>
      </div>
    </>,
    moutingPoint
  );
}
