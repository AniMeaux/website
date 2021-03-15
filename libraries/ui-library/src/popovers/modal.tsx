import cn from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "../actions";
import { useFocusTrap, useLatestDefinedValue, useScrollLock } from "../core";
import { ButtonSection } from "../layouts";

export function ModalHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...rest}
      className={cn(
        "sticky top-0 w-full border-b border-gray-100 flex-none px-4 py-2 flex items-center",
        className
      )}
    />
  );
}

type ModalProps = React.HTMLAttributes<HTMLElement> & {
  open: boolean;
  onDismiss: () => void;
  dismissLabel?: string;
};

export function Modal({
  open,
  onDismiss,
  dismissLabel = "Annuler",
  className,
  children,
  ...rest
}: ModalProps) {
  const moutingPoint = React.useMemo<HTMLElement>(
    () => document.createElement("div"),
    []
  );
  const modalElement = React.useRef<HTMLDivElement | null>(null);
  const elementToReturnFocus = React.useRef<HTMLElement | null>(null);

  const [visible, setVisible] = React.useState(false);
  useScrollLock(modalElement, { disabled: !visible });
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

  const handleDismiss = React.useRef(onDismiss);
  React.useLayoutEffect(() => {
    handleDismiss.current = onDismiss;
  });

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
          "z-20 fixed inset-0 overscroll-none cursor-pointer bg-black bg-opacity-20",
          {
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
          "z-20 focus:outline-none fixed left-0 bottom-0 right-0 overscroll-none shadow-md rounded-t-3xl max-h-screen bg-white modal-padding",
          {
            "animate-bottom-slide-in": open,
            "animate-bottom-slide-out": !open,
          },
          className
        )}
      >
        {childElement}

        <ButtonSection>
          <Button
            variant="outlined"
            color="default"
            onClick={() => onDismiss()}
          >
            {dismissLabel}
          </Button>
        </ButtonSection>
      </div>
    </>,
    moutingPoint
  );
}
