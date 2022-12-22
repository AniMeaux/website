import { asBooleanAttribute } from "#/core/attributes";
import { cn } from "#/core/classNames";
import { HIGHLIGHT_COMPONENTS, Markdown } from "#/core/dataDisplay/markdown";
import { ActionAdornment, Adornment } from "#/core/formElements/adornment";
import { Card, CardContent } from "#/core/layout/card";
import { ScreenSizeValue, useScreenSizeCondition } from "#/core/screenSize";
import { Icon } from "#/generated/icon";
import { theme } from "#/generated/theme";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { forwardRef } from "react";

type ResourceInputLayoutProps = {
  isOpened: boolean;
  setIsOpened: React.Dispatch<boolean>;
  inputTriggerRef: React.RefObject<HTMLButtonElement>;
  inputTrigger: (
    triggerElement: React.ElementType<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >
  ) => React.ReactNode;
  content: React.ReactNode;
};

export function ResourceInputLayout(props: ResourceInputLayoutProps) {
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= ScreenSizeValue.md
  );

  const Layout = isMedium ? MediumLayout : SmallLayout;

  return <Layout {...props} />;
}

function MediumLayout({
  isOpened,
  setIsOpened,
  inputTriggerRef,
  inputTrigger,
  content,
}: ResourceInputLayoutProps) {
  return (
    <Popover.Root open={isOpened} onOpenChange={setIsOpened}>
      {inputTrigger(Popover.Trigger)}

      <Popover.Portal>
        <Popover.Content
          // Using a Ref callback is the only way to set the content width at
          // the right moment. Effect and layout effect don't run in sync with
          // the component mounting.
          ref={(element) => {
            if (element != null && inputTriggerRef.current != null) {
              element.style.width = `${inputTriggerRef.current.clientWidth}px`;
            }
          }}
          align="start"
          sideOffset={theme.spacing[1]}
          collisionPadding={theme.spacing[1]}
          className="z-10 bg-white shadow-ambient rounded-1 border border-gray-200 flex flex-col"
        >
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function SmallLayout({
  isOpened,
  setIsOpened,
  inputTrigger,
  content,
}: ResourceInputLayoutProps) {
  return (
    <Dialog.Root open={isOpened} onOpenChange={setIsOpened}>
      {inputTrigger(Dialog.Trigger)}

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20"
          )}
        />

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col">
          <VisuallyHidden.Root>
            <Dialog.Title>Rechercher une couleur</Dialog.Title>
          </VisuallyHidden.Root>

          {content}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type ResourceComboboxLayoutProps = {
  label: React.ReactNode;
  input: (leftAdornment: React.ReactNode) => React.ReactNode;
  list: React.ReactNode;
};

export function ResourceComboboxLayout(props: ResourceComboboxLayoutProps) {
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= ScreenSizeValue.md
  );

  const Layout = isMedium ? MediumComboboxLayout : SmallComboboxLayout;

  return <Layout {...props} />;
}

function MediumComboboxLayout({
  label,
  input,
  list,
}: ResourceComboboxLayoutProps) {
  return (
    <div className="flex flex-col">
      <header className="border-b border-gray-100 p-1 flex flex-col">
        {label}
        {input(
          <Adornment>
            <Icon id="magnifyingGlass" />
          </Adornment>
        )}
      </header>

      <section className="p-1 flex flex-col">{list}</section>
    </div>
  );
}

function SmallComboboxLayout({
  label,
  input,
  list,
}: ResourceComboboxLayoutProps) {
  return (
    <div className="flex flex-col gap-1">
      <header className="sticky top-0 z-20 px-safe-1 pt-safe-0.5 pb-0.5 flex-none bg-white flex flex-col">
        {label}
        {input(
          <Dialog.Close asChild>
            <ActionAdornment>
              <Icon id="angleLeft" />
            </ActionAdornment>
          </Dialog.Close>
        )}
      </header>

      <Card>
        <CardContent>{list}</CardContent>
      </Card>
    </div>
  );
}

export const SuggestionList = forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(function ResourceItemList({ className, ...rest }, ref) {
  return <ul {...rest} ref={ref} className={cn(className, "flex flex-col")} />;
});

export const SuggestionItem = forwardRef<
  HTMLLIElement,
  Omit<React.LiHTMLAttributes<HTMLLIElement>, "children"> & {
    isValue?: boolean;
    leftAdornment: React.ReactNode;

    // We can't use `children` here because `forwardRef` automatically adds a
    // `children` prop with `React.ReacNode` type.
    label: string;
    secondaryLabel?: React.ReactNode;
  }
>(function SuggestionItem(
  { isValue = false, leftAdornment, label, secondaryLabel, className, ...rest },
  ref
) {
  return (
    <li
      {...rest}
      ref={ref}
      data-is-value={asBooleanAttribute(isValue)}
      className={cn(
        className,
        "group relative z-0 rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)_auto] items-start cursor-pointer aria-selected:bg-gray-100 data-[is-value=true]:bg-gray-100"
      )}
    >
      <span className="h-4 w-4 flex items-center justify-center text-gray-600 text-[20px]">
        {leftAdornment}
      </span>

      <span className="py-1 text-body-default group-data-[is-value=true]:text-body-emphasis">
        <Markdown components={HIGHLIGHT_COMPONENTS}>{label}</Markdown>
        {secondaryLabel != null && (
          <span className="text-gray-500"> - {secondaryLabel}</span>
        )}
      </span>

      <span className="opacity-0 h-4 w-4 flex items-center justify-center text-green-600 transition-opacity duration-100 ease-in-out group-data-[is-value=true]:opacity-100">
        <Icon id="check" />
      </span>
    </li>
  );
});

export function NoSuggestion({ children }: { children?: React.ReactNode }) {
  return (
    <li className="h-4 flex flex-col justify-center">
      <p className="text-gray-500 text-center">{children}</p>
    </li>
  );
}
