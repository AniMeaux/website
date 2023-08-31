import type { ActionColor } from "#core/actions.tsx";
import { Action } from "#core/actions.tsx";
import { Overlay } from "#core/popovers/overlay.tsx";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";
import * as RadixDialog from "@radix-ui/react-dialog";
import { createContext, useContext, useMemo } from "react";

type DialogVariant = "alert" | "warning";

type DialogContextValue = { variant: DialogVariant };
const DialogContext = createContext<DialogContextValue>({ variant: "alert" });

export function Dialog(props: RadixDialog.DialogProps) {
  return <RadixDialog.Root {...props} />;
}

Dialog.Trigger = RadixDialog.Trigger;

Dialog.Content = function DialogContent({
  variant,
  children,
}: {
  variant: DialogVariant;
  children?: React.ReactNode;
}) {
  return (
    <DialogContext.Provider
      value={useMemo<DialogContextValue>(() => ({ variant }), [variant])}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay asChild>
          <Overlay />
        </RadixDialog.Overlay>

        <RadixDialog.Content className="z-30 fixed md:top-[10vh] bottom-safe-1 md:bottom-auto left-safe-1 md:left-1/2 right-safe-1 md:right-auto md:-translate-x-1/2 shadow-ambient md:w-[550px] bg-white rounded-1 p-2 flex flex-col gap-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=closed]:slide-out-to-bottom-1/2 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=open]:slide-in-from-left-1/2 md:data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:ease-out data-[state=closed]:ease-in data-[state=open]:duration-75 data-[state=closed]:duration-75">
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </DialogContext.Provider>
  );
};

Dialog.Header = function DialogHeader({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { variant } = useContext(DialogContext);

  return (
    <header className="grid grid-cols-[auto_minmax(0px,1fr)] gap-1">
      <Icon
        id={VARIANT_ICON[variant]}
        className={cn("text-[20px]", VARIANT_ICON_CLASS_NAME[variant])}
      />

      <RadixDialog.Title className="text-title-section-small md:text-title-section-large">
        {children}
      </RadixDialog.Title>
    </header>
  );
};

const VARIANT_ICON: Record<DialogVariant, IconProps["id"]> = {
  alert: "circleExclamation",
  warning: "triangleExclamation",
};

const VARIANT_ICON_CLASS_NAME: Record<DialogVariant, string> = {
  alert: "text-red-400",
  warning: "text-orange-400",
};

Dialog.Message = function DialogMessage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <p>{children}</p>;
};

Dialog.Actions = function DialogActions({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <footer className="flex items-center justify-between gap-2">
      {children}
    </footer>
  );
};

Dialog.CloseAction = function DialogCloseAction({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <RadixDialog.Close asChild>
      <Action variant="text" color="gray">
        {children}
      </Action>
    </RadixDialog.Close>
  );
};

type DialogConfirmActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
>;

Dialog.ConfirmAction = function DialogConfirmAction(
  props: DialogConfirmActionProps,
) {
  const { variant } = useContext(DialogContext);

  return (
    <Action
      {...props}
      variant="secondary"
      color={VARIANT_CONFIRM_ACTION_COLOR[variant]}
    />
  );
};

const VARIANT_CONFIRM_ACTION_COLOR: Record<DialogVariant, ActionColor> = {
  alert: "red",
  warning: "orange",
};
