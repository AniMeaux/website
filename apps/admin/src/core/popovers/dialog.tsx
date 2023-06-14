import * as RadixDialog from "@radix-ui/react-dialog";
import { createContext, useContext, useMemo } from "react";
import { Action, ActionColor } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Overlay } from "~/core/popovers/overlay";
import { Icon, IconProps } from "~/generated/icon";

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
        <Overlay asChild>
          <RadixDialog.Overlay />
        </Overlay>

        <RadixDialog.Content className="fixed bottom-safe-1 left-safe-1 right-safe-1 z-30 shadow-2xl bg-white rounded-1 p-2 flex flex-col gap-2 md:bottom-auto md:top-[10vh] md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[550px]">
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
  props: DialogConfirmActionProps
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
