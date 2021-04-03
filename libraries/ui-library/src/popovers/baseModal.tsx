import * as React from "react";
import * as ReactDOM from "react-dom";
import invariant from "invariant";
import {
  ChildrenProp,
  useFocusTrap,
  useLatestDefinedValue,
  useScrollLock,
} from "../core";

type ModalContextType = {
  onDismiss: () => void;
};

const ModalContext = React.createContext<ModalContextType | null>(null);

export function useModal(): ModalContextType {
  const context = React.useContext(ModalContext);
  invariant(context != null, "useModal should not be used outside of a Modal.");
  return context;
}

export type BaseModalProps = ChildrenProp & {
  open: boolean;
  onDismiss: () => void;
  getOverlayClassName: (isOpen: boolean) => string;
  getModalClassName: (isOpen: boolean) => string;
};

export function BaseModal({
  open,
  onDismiss,
  getModalClassName,
  getOverlayClassName,
  children,
}: BaseModalProps) {
  const moutingPoint = React.useMemo<HTMLElement>(
    () => document.createElement("div"),
    []
  );
  const modalElement = React.useRef<HTMLDivElement | null>(null);
  const elementToReturnFocus = React.useRef<HTMLElement | null>(null);

  const [visible, setVisible] = React.useState(false);
  useScrollLock(modalElement, { disabled: !visible });
  useFocusTrap(modalElement, { disabled: !visible });

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

  const contextValue = React.useMemo<ModalContextType>(
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
    <ModalContext.Provider value={contextValue}>
      <div
        // Allow click
        data-focus-trap-ignore="true"
        onClick={handleOverlayClick}
        className={getOverlayClassName(open)}
      />

      <div
        tabIndex={0}
        ref={modalElement}
        onAnimationEnd={handleAnimationEnd}
        onKeyDown={handleKeyDown}
        className={getModalClassName(open)}
      >
        {childElement}
      </div>
    </ModalContext.Provider>,
    moutingPoint
  );
}
