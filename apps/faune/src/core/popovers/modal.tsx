import { Button } from "core/actions/button";
import { ButtonSection } from "core/layouts/section";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { ChildrenProp, StyleProps } from "core/types";
import { useFocusTrap } from "core/useFocusTrap";
import { useLatestDefinedValue } from "core/useLatestDefinedValue";
import { useScrollLock } from "core/useScrollLock";
import invariant from "invariant";
import type { Modifiers, Placement } from "popper.js";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePopper, UsePopperOptions } from "react-behave";
import * as ReactDOM from "react-dom";
import styled, { css } from "styled-components/macro";
import { theme } from "styles/theme";

type ModalContextType = {
  onDismiss: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  invariant(context != null, "useModal should not be used outside of a Modal.");
  return context;
}

type ModalHeaderProps = StyleProps &
  ChildrenProp & {
    dense?: boolean;
  };

export function ModalHeader({ dense = false, ...rest }: ModalHeaderProps) {
  return <ModalHeaderElement {...rest} $isDense={dense} />;
}

const ModalHeaderElement = styled.header<{ $isDense: boolean }>`
  width: 100%;
  border-bottom: 1px solid ${theme.colors.dark[50]};
  padding: ${(props) =>
    props.$isDense
      ? theme.spacing.x2
      : `${theme.spacing.x2} ${theme.spacing.x4}`};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.x4};
`;

export const ModalHeaderTitle = styled.h2`
  flex: 1;
  min-width: 0;
  padding-left: ${theme.spacing.x4};
  font-size: 18px;
  font-weight: 700;
  font-family: ${theme.typography.fontFamily.title};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

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
  const moutingPoint = useMemo<HTMLElement>(
    () => document.createElement("div"),
    []
  );
  const modalElement = useRef<HTMLDivElement | null>(null);
  const elementToReturnFocus = useRef<HTMLElement | null>(null);

  const [visible, setVisible] = useState(false);
  useScrollLock(modalElement, { disabled: !visible });
  useFocusTrap(modalElement, { disabled: !visible });

  useLayoutEffect(() => {
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

  useEffect(() => {
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

  const handleDismiss = useRef(onDismiss);
  useLayoutEffect(() => {
    handleDismiss.current = onDismiss;
  });

  const contextValue = useMemo<ModalContextType>(
    () => ({ onDismiss: () => handleDismiss.current() }),
    []
  );

  const { screenSize } = useScreenSize();
  const isBottomSheet = screenSize <= ScreenSize.SMALL;

  const isPopperEnabled = visible && !isBottomSheet;

  useEffect(() => {
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
      <Overlay
        // Allow click
        data-focus-trap-ignore="true"
        onClick={handleOverlayClick}
        $isBottomSheet={isBottomSheet}
        $isOpened={open}
      />

      <ModalElement
        tabIndex={0}
        ref={modalElement}
        onAnimationEnd={handleAnimationEnd}
        onKeyDown={handleKeyDown}
        $isBottomSheet={isBottomSheet}
        $placement={popper.placement}
        $isOpened={open}
        style={style}
      >
        {childElement}
        {isBottomSheet && <ModalCloseButton dismissLabel={dismissLabel} />}
      </ModalElement>
    </ModalContext.Provider>,
    moutingPoint
  );
}

type IsOpenedProp = { $isOpened: boolean };
type IsBottomSheetProp = { $isBottomSheet: boolean };
type PlacementProp = { $placement: UsePopperOptions["placement"] | null };

const BOTTOM_SHEET_OVERLAY = css<IsOpenedProp>`
  animation-name: ${(props) =>
    props.$isOpened ? theme.animation.fadeIn : theme.animation.fadeOut};
  animation-timing-function: ${(props) =>
    props.$isOpened ? theme.animation.ease.enter : theme.animation.ease.exit};
  animation-timing-function: ${theme.animation.ease.enter};
  animation-fill-mode: forwards;
  animation-duration: ${theme.animation.duration.slow};
  background: ${theme.colors.dark[200]};
`;

const Overlay = styled.div<IsOpenedProp & IsBottomSheetProp>`
  z-index: ${theme.zIndex.modal};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overscroll-behavior: none;
  cursor: pointer;

  ${(props) => (props.$isBottomSheet ? BOTTOM_SHEET_OVERLAY : null)};
`;

const PLACEMENT_TRANSFORM_ORIGIN: Partial<
  Record<NonNullable<UsePopperOptions["placement"]>, string>
> = {
  "top-start": "bottom left",
  top: "bottom center",
  "top-end": "bottom right",
  "bottom-start": "top left",
  bottom: "top center",
  "bottom-end": "top right",
};

const DROPDOWN_MODAL = css<IsOpenedProp & PlacementProp>`
  border-radius: ${theme.borderRadius.m};
  min-width: 350px;
  animation-duration: ${theme.animation.duration.fast};
  transform-origin: ${(props) =>
    props.$placement == null
      ? null
      : PLACEMENT_TRANSFORM_ORIGIN[props.$placement]};

  /*
   * Don't start the animation if there are no data-placement, because it means
   * the dropdown is not yet positioned.
   */

  animation-timing-function: ${(props) =>
    props.$placement == null
      ? null
      : props.$isOpened
      ? theme.animation.ease.enter
      : theme.animation.ease.exit};

  animation-name: ${(props) =>
      props.$placement == null
        ? null
        : props.$isOpened
        ? theme.animation.fadeIn
        : theme.animation.fadeOut},
    ${(props) =>
      props.$placement == null
        ? null
        : props.$placement === "bottom" || props.$placement === "top"
        ? props.$isOpened
          ? theme.animation.scaleInY
          : theme.animation.scaleOutY
        : props.$isOpened
        ? theme.animation.scaleIn
        : theme.animation.scaleOut};
`;

const BOTTOM_SHEET_MODAL = css<IsOpenedProp>`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  max-height: 100vh;
  overflow: auto;
  animation-name: ${(props) =>
    props.$isOpened
      ? theme.animation.bottomSlideIn
      : theme.animation.bottomSlideOut};
  animation-timing-function: ${(props) =>
    props.$isOpened ? theme.animation.ease.enter : theme.animation.ease.exit};
  animation-duration: ${theme.animation.duration.slow};
  border-top-left-radius: ${theme.borderRadius.l};
  border-top-right-radius: ${theme.borderRadius.l};
  padding-top: 0;
  padding-top: env(safe-area-inset-top, 0);
  padding-right: 0;
  padding-right: env(safe-area-inset-right, 0);
  padding-bottom: 0;
  padding-bottom: env(safe-area-inset-bottom, 0);
  padding-left: 0;
  padding-left: env(safe-area-inset-left, 0);
`;

const ModalElement = styled.div<
  IsBottomSheetProp & IsOpenedProp & PlacementProp
>`
  z-index: ${theme.zIndex.modal};
  overscroll-behavior: none;
  box-shadow: ${theme.shadow.m};
  background: ${theme.colors.background.primary};
  animation-fill-mode: forwards;
  ${(props) => (props.$isBottomSheet ? BOTTOM_SHEET_MODAL : DROPDOWN_MODAL)};
`;
