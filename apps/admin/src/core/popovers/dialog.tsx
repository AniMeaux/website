import * as RadixDialog from "@radix-ui/react-dialog";
import { createContext, useContext, useMemo } from "react";
import { actionClassName, ActionColor } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

export const DialogRoot = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

type DialogVariant = "alert";

type DialogContextValue = { variant: DialogVariant };
const DialogContext = createContext<DialogContextValue>({ variant: "alert" });

export function Dialog({
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
        <RadixDialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues
            // when mobile browser's height change due to scroll.
            "absolute",
            "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20 cursor-pointer"
          )}
        />

        <RadixDialog.Content className="fixed top-[10vh] left-1 right-1 z-30 shadow-ambient bg-white rounded-1 p-2 flex flex-col gap-2 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[550px]">
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </DialogContext.Provider>
  );
}

export function DialogHeader({ children }: { children?: React.ReactNode }) {
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
}

const VARIANT_ICON: Record<DialogVariant, IconProps["id"]> = {
  alert: "circleExclamation",
};

const VARIANT_ICON_CLASS_NAME: Record<DialogVariant, string> = {
  alert: "text-red-400",
};

export function DialogMessage({ children }: { children?: React.ReactNode }) {
  return <p>{children}</p>;
}

export function DialogActions({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="flex items-center justify-between gap-2">
      {children}
    </footer>
  );
}

export function DialogCloseAction({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <RadixDialog.Close
      className={actionClassName.standalone({ variant: "text", color: "gray" })}
    >
      {children}
    </RadixDialog.Close>
  );
}

type DialogConfirmActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
>;

export function DialogConfirmAction(props: DialogConfirmActionProps) {
  const { variant } = useContext(DialogContext);

  return (
    <button
      {...props}
      className={actionClassName.standalone({
        variant: "secondary",
        color: VARIANT_CONFIRM_ACTION_COLOR[variant],
      })}
    />
  );
}

const VARIANT_CONFIRM_ACTION_COLOR: Record<DialogVariant, ActionColor> = {
  alert: "red",
};
