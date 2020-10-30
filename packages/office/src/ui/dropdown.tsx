import cn from "classnames";
import * as React from "react";
import { usePopper } from "react-behave";
import * as ReactDOM from "react-dom";
import { ScreenSize, useScreenSize } from "../core/screenSize";

type DropdownOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  transparent?: boolean;
};

function DropdownOverlay({
  transparent = false,
  className,
  ...rest
}: DropdownOverlayProps) {
  return (
    <div
      {...rest}
      aria-hidden
      className={cn(
        "z-50 fixed inset-0 bg-opacity-25",
        { "bg-black": !transparent },
        className
      )}
    />
  );
}

type DropdownContentProps = React.HTMLAttributes<HTMLDivElement> & {
  refProp: React.RefObject<HTMLDivElement>;
};

function DropdownContent({
  refProp,
  className,
  ...rest
}: DropdownContentProps) {
  return (
    <>
      <div
        {...rest}
        tabIndex={-1}
        className={cn("a11y-focus", className)}
        ref={refProp}
      />

      {/* Tab receiver to make sure the focus doesn't leave the browser's tab. */}
      <div tabIndex={0} aria-hidden className="outline-none" />
    </>
  );
}

type DeviceDropdownProps = {
  actionElement: React.MutableRefObject<HTMLButtonElement>;
  dropdownElement: React.MutableRefObject<HTMLDivElement>;
  children?: React.ReactNode;
};

function SmallDeviceDropdown({
  dropdownElement,
  children,
}: DeviceDropdownProps) {
  return (
    <>
      <DropdownOverlay />

      <DropdownContent
        refProp={dropdownElement}
        className="z-50 fixed bottom-0 left-0 w-full max-h-1/2 overflow-hidden rounded-t-md bg-white pt-4 pb-8"
      >
        {children}
      </DropdownContent>
    </>
  );
}

function LargeDeviceDropdown({
  actionElement,
  dropdownElement,
  children,
}: DeviceDropdownProps) {
  const { style } = usePopper(actionElement, dropdownElement);

  return (
    <>
      <DropdownOverlay transparent />

      <DropdownContent
        refProp={dropdownElement}
        className="z-50 shadow-md my-2 rounded-md border bg-white py-4"
        style={style as React.CSSProperties}
      >
        {children}
      </DropdownContent>
    </>
  );
}

type DropdownProps = {
  actionElement: React.MutableRefObject<HTMLButtonElement>;
  onClose: () => void;
  children?: React.ReactNode;
};

export function Dropdown({ actionElement, onClose, children }: DropdownProps) {
  const { screenSize } = useScreenSize();
  const mountingPoint = React.useMemo(() => document.createElement("div"), []);

  React.useEffect(() => {
    document.body.appendChild(mountingPoint);
    return () => {
      document.body.removeChild(mountingPoint);
    };
  }, [mountingPoint]);

  const dropdownElement = React.useRef<HTMLDivElement>(null!);

  React.useEffect(() => {
    dropdownElement.current.focus();
    const elementToReturnFocus = actionElement.current!;
    return () => {
      elementToReturnFocus.focus();
    };
  }, [actionElement]);

  function onBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (
      event.relatedTarget == null ||
      !dropdownElement.current.contains(event.relatedTarget as Node)
    ) {
      onClose();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  const props: DeviceDropdownProps = {
    children,
    actionElement,
    dropdownElement,
  };

  const content =
    screenSize === ScreenSize.SMALL ? (
      <SmallDeviceDropdown {...props} />
    ) : (
      <LargeDeviceDropdown {...props} />
    );

  return ReactDOM.createPortal(
    <div onBlur={onBlur} onKeyDown={onKeyDown}>
      {content}
    </div>,
    mountingPoint
  );
}
