import { toBooleanAttribute } from "#core/attributes.ts";
import { cn } from "#core/classNames.ts";
import { Item } from "#core/dataDisplay/item.tsx";
import { HIGHLIGHT_COMPONENTS, Markdown } from "#core/dataDisplay/markdown.tsx";
import { BaseTextInput } from "#core/formElements/baseTextInput.tsx";
import { Card } from "#core/layout/card.tsx";
import { Overlay } from "#core/popovers/overlay.tsx";
import { ScreenSizeValue, useScreenSizeCondition } from "#core/screenSize.tsx";
import { Icon } from "#generated/icon.tsx";
import { theme } from "#generated/theme.ts";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { forwardRef } from "react";

type ResourceInputLayoutProps = {
  isOpened: boolean;
  setIsOpened: React.Dispatch<boolean>;
  inputTrigger: (
    triggerElement: React.ElementType<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >,
  ) => React.ReactNode;
  content: React.ReactNode;
};

export function ResourceInputLayout(props: ResourceInputLayoutProps) {
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= ScreenSizeValue.md,
  );

  const Layout = isMedium ? MediumLayout : SmallLayout;

  return <Layout {...props} />;
}

function MediumLayout({
  isOpened,
  setIsOpened,
  inputTrigger,
  content,
}: ResourceInputLayoutProps) {
  return (
    <Popover.Root open={isOpened} onOpenChange={setIsOpened}>
      {inputTrigger(Popover.Trigger)}

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={theme.spacing[1]}
          collisionPadding={theme.spacing[1]}
          className="z-20 w-[var(--radix-popover-trigger-width)] bg-white shadow-ambient rounded-1 flex flex-col"
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
        <Overlay asChild>
          <Dialog.Overlay />
        </Overlay>

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
    (screenSize) => screenSize >= ScreenSizeValue.md,
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
      <header className="border-b border-gray-100 p-0.5 flex flex-col">
        {label}
        {input(
          <BaseTextInput.Adornment>
            <Icon id="magnifyingGlass" />
          </BaseTextInput.Adornment>,
        )}
      </header>

      <section className="p-0.5 flex flex-col">{list}</section>
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
            <BaseTextInput.ActionAdornment>
              <Icon id="angleLeft" />
            </BaseTextInput.ActionAdornment>
          </Dialog.Close>,
        )}
      </header>

      <Card>
        <Card.Content>{list}</Card.Content>
      </Card>
    </div>
  );
}

export const SuggestionList = forwardRef<
  React.ComponentRef<"ul">,
  React.ComponentPropsWithoutRef<"ul">
>(function ResourceItemList({ className, ...rest }, ref) {
  return <ul {...rest} ref={ref} className={cn(className, "flex flex-col")} />;
});

export type SuggestionItemProps = React.ComponentPropsWithoutRef<
  typeof Item
> & {
  isAdditional?: boolean;
  isValue?: boolean;
  leftAdornment?: React.ReactNode;
  // We can't use `children` here because `forwardRef` automatically adds a
  // `children` prop with `React.ReacNode` type.
  label: string;
  secondaryLabel?: React.ReactNode;
};

export const SuggestionItem = forwardRef<
  React.ComponentRef<typeof Item>,
  SuggestionItemProps
>(function SuggestionItem(
  {
    isAdditional = false,
    isValue = false,
    leftAdornment,
    label,
    secondaryLabel,
    className,
    ...rest
  },
  ref,
) {
  return (
    <Item
      {...rest}
      ref={ref}
      data-is-value={toBooleanAttribute(isValue)}
      data-is-additional={toBooleanAttribute(isAdditional)}
      className={cn(
        className,
        "cursor-pointer aria-selected:bg-gray-100 data-[is-value=true]:bg-gray-100",
      )}
    >
      <Item.Icon className="group-data-[is-additional=true]:text-blue-500">
        {isAdditional ? <Icon id="plus" /> : leftAdornment}
      </Item.Icon>

      <Item.Content asChild>
        <span className="group-data-[is-value=true]:text-body-emphasis group-data-[is-additional=true]:text-blue-500">
          <Markdown components={HIGHLIGHT_COMPONENTS}>{label}</Markdown>
          {secondaryLabel != null ? (
            <span className="text-gray-500"> - {secondaryLabel}</span>
          ) : null}
        </span>
      </Item.Content>

      <Item.Icon className="opacity-0 transition-opacity duration-100 ease-in-out group-data-[is-value=true]:opacity-100">
        <Icon id="check" className="text-green-600 text-[14px]" />
      </Item.Icon>
    </Item>
  );
});

export function NoSuggestion({ children }: { children?: React.ReactNode }) {
  return (
    <li className="h-4 flex flex-col justify-center">
      <p className="text-gray-500 text-center">{children}</p>
    </li>
  );
}
