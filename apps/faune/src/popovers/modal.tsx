import { Button } from "actions/button";
import cn from "classnames";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { ChildrenProp, StyleProps } from "core/types";
import { useFocusTrap } from "core/useFocusTrap";
import { useLatestDefinedValue } from "core/useLatestDefinedValue";
import { useScrollLock } from "core/useScrollLock";
import invariant from "invariant";
import { HeaderTitle, HeaderTitleProps } from "layouts/header";
import { ButtonSection } from "layouts/section";
import type { Modifiers, Placement } from "popper.js";
import * as React from "react";
import { usePopper } from "react-behave";
import * as ReactDOM from "react-dom";

type ModalContextType = {
  onDismiss: () => void;
};

const ModalContext = React.createContext<ModalContextType | null>(null);

export function useModal(): ModalContextType {
  const context = React.useContext(ModalContext);
  invariant(context != null, "useModal should not be used outside of a Modal.");
  return context;
}

export type ModalHeaderProps = StyleProps &
  ChildrenProp & {
    dense?: boolean;
  };

export function ModalHeader({
  className,
  dense = false,
  ...rest
}: ModalHeaderProps) {
  return (
    <header
      {...rest}
      className={cn("ModalHeader", { "ModalHeader--dense": dense }, className)}
    />
  );
}

export type ModalHeaderTitleProps = HeaderTitleProps;

export function ModalHeaderTitle({
  className,
  ...rest
}: ModalHeaderTitleProps) {
  return (
    <HeaderTitle {...rest} className={cn("ModalHeaderTitle", className)} />
  );
}

type ModalCloseButtonProps = {
  dismissLabel?: string;
};

function ModalCloseButton({ dismissLabel = "Annuler" }: ModalCloseButtonProps) {
  const { onDismiss } = useModal();

  return (
    <ButtonSection>
      <Button onClick={() => onDismiss()}>{dismissLabel}</Button>
    </ButtonSection>
  );
}

const modifiers: Modifiers = {
  offset: { offset: "0, 8px" },
  computeStyle: {
    // Don't use `transform: translate3d()` because we need it for animation
    // and we can't merge both.
    gpuAcceleration: false,
  },
};

export type ModalProps = ChildrenProp &
  ModalCloseButtonProps & {
    open: boolean;
    referenceElement: React.MutableRefObject<HTMLElement>;
    onDismiss: () => void;
    placement?: Placement;
    matchReferenceWidth?: boolean;
  };

export function Modal({
  open,
  referenceElement,
  placement = "bottom",
  matchReferenceWidth = false,
  onDismiss,
  dismissLabel,
  children,
}: ModalProps) {
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

  const { screenSize } = useScreenSize();
  const isBottomSheet = screenSize <= ScreenSize.SMALL;

  const isPopperEnabled = visible && !isBottomSheet;

  React.useEffect(() => {
    // Make sure the modal has the same width as the reference.
    if (isPopperEnabled && matchReferenceWidth) {
      // `modalElement.current` cannot be null because `isPopperEnabled` is
      // true only if `visible` is true, and the `modalElement.current` is
      // always defined when `visible` is true.
      modalElement.current!.style.width = `${referenceElement.current.clientWidth}px`;
    }
  });

  const popper = usePopper(referenceElement, modalElement, {
    disabled: !isPopperEnabled,
    placement,
    modifiers,
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

  let style: React.CSSProperties = {};
  if (!isBottomSheet) {
    style = popper.style as React.CSSProperties;
  }

  return ReactDOM.createPortal(
    <ModalContext.Provider value={contextValue}>
      <div
        // Allow click
        data-focus-trap-ignore="true"
        onClick={handleOverlayClick}
        className={cn(
          "ModalOverlay",
          { "ModalOverlay--bottomSheet": isBottomSheet },
          {
            "ModalOverlay--isOpened": open,
            "ModalOverlay--isClosed": !open,
          }
        )}
      />

      <div
        tabIndex={0}
        ref={modalElement}
        onAnimationEnd={handleAnimationEnd}
        onKeyDown={handleKeyDown}
        className={cn(
          "Modal",
          {
            "Modal--dropdown": !isBottomSheet,
            "Modal--bottomSheet": isBottomSheet,
          },
          {
            "Modal--isOpened": open,
            "Modal--isClosed": !open,
          }
        )}
        data-placement={popper.placement}
        style={style}
      >
        {childElement}
        {isBottomSheet && <ModalCloseButton dismissLabel={dismissLabel} />}
      </div>
    </ModalContext.Provider>,
    moutingPoint
  );
}
