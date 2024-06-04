import type { ActionColor } from "#core/actions";
import { Action } from "#core/actions";
import { Overlay } from "#core/popovers/overlay";
import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
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

        <RadixDialog.Content className="fixed inset-x-0 bottom-0 z-30 grid animation-duration-150 animation-translate-y-full pb-safe-1 px-safe-1.5 data-[state=open]:animation-enter data-[state=closed]:animation-exit md:bottom-auto md:left-1/2 md:right-auto md:top-[10vh] md:w-[550px] md:-translate-x-1/2 md:p-0 md:animation-opacity-0 md:animation-duration-100 md:animation-translate-y-0">
          {/*
           * Because links can't be focused by default, we might focus an
           * element out of order.
           * This div wrapper will receive the focus everytime, the user can
           * then tab in content.
           * https://github.com/radix-ui/primitives/issues/2373
           */}
          <div
            tabIndex={0}
            className="flex w-full flex-col gap-2 rounded-1 bg-white p-2 shadow-popover-md focus-visible:focus-compact-blue-400"
          >
            {children}
          </div>
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
        href={VARIANT_ICON[variant]}
        className={cn("text-[20px]", VARIANT_ICON_CLASS_NAME[variant])}
      />

      <RadixDialog.Title className="text-title-section-small md:text-title-section-large">
        {children}
      </RadixDialog.Title>
    </header>
  );
};

const VARIANT_ICON: Record<DialogVariant, IconName> = {
  alert: "icon-circle-exclamation",
  warning: "icon-triangle-exclamation",
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
