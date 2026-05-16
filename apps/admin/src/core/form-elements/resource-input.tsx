import { cn, toBooleanAttribute } from "@animeaux/core"
import * as Dialog from "@radix-ui/react-dialog"
import * as Popover from "@radix-ui/react-popover"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { forwardRef } from "react"

import { Item } from "#i/core/data-display/item.js"
import {
  HIGHLIGHT_COMPONENTS,
  Markdown,
} from "#i/core/data-display/markdown.js"
import { BaseTextInput } from "#i/core/form-elements/base-text-input.js"
import { Card } from "#i/core/layout/card.js"
import { useScreenSizeCondition } from "#i/core/screen-size.js"
import { Icon } from "#i/generated/icon.js"
import { Breakpoint, Spacing } from "#i/generated/theme.js"

type ResourceInputLayoutProps = {
  isOpened: boolean
  setIsOpened: React.Dispatch<boolean>
  inputTrigger: (
    triggerElement: React.ElementType<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >,
  ) => React.ReactNode
  content: React.ReactNode
}

export function ResourceInputLayout(props: ResourceInputLayoutProps) {
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= Breakpoint.value.md,
  )

  const Layout = isMedium ? MediumLayout : SmallLayout

  return <Layout {...props} />
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
          side="bottom"
          sideOffset={Spacing.unitPx}
          collisionPadding={Spacing.unitPx}
          className="z-20 flex w-(--radix-popover-trigger-width) flex-col rounded-1 bg-white shadow-popover-sm out-opacity-0 data-opened:animate-enter data-closed:animate-exit data-top:out-translate-y-2 data-bottom:-out-translate-y-2"
        >
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
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
        <Dialog.Overlay />

        <Dialog.Content className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-gray-50">
          <VisuallyHidden.Root>
            <Dialog.Title>Rechercher une couleur</Dialog.Title>
          </VisuallyHidden.Root>

          {content}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type ResourceComboboxLayoutProps = {
  label: React.ReactNode
  input: (leftAdornment: React.ReactNode) => React.ReactNode
  list: React.ReactNode
}

export function ResourceComboboxLayout(props: ResourceComboboxLayoutProps) {
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= Breakpoint.value.md,
  )

  const Layout = isMedium ? MediumComboboxLayout : SmallComboboxLayout

  return <Layout {...props} />
}

function MediumComboboxLayout({
  label,
  input,
  list,
}: ResourceComboboxLayoutProps) {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col border-b border-gray-100 p-0.5">
        {label}
        {input(
          <BaseTextInput.Adornment>
            <Icon href="icon-magnifying-glass-solid" />
          </BaseTextInput.Adornment>,
        )}
      </header>

      <section className="flex flex-col p-0.5">{list}</section>
    </div>
  )
}

function SmallComboboxLayout({
  label,
  input,
  list,
}: ResourceComboboxLayoutProps) {
  return (
    <div className="flex flex-col gap-1">
      <header className="sticky top-0 z-20 flex flex-none flex-col bg-white pt-safe-0.5 px-safe-1 pb-0.5">
        {label}
        {input(
          <Dialog.Close asChild>
            <BaseTextInput.ActionAdornment>
              <Icon href="icon-angle-left-solid" />
            </BaseTextInput.ActionAdornment>
          </Dialog.Close>,
        )}
      </header>

      <Card>
        <Card.Content>{list}</Card.Content>
      </Card>
    </div>
  )
}

export const SuggestionList = forwardRef<
  React.ComponentRef<"ul">,
  React.ComponentPropsWithoutRef<"ul">
>(function ResourceItemList({ className, ...rest }, ref) {
  return <ul {...rest} ref={ref} className={cn(className, "flex flex-col")} />
})

export type SuggestionItemProps = React.ComponentPropsWithoutRef<
  typeof Item.Root
> & {
  isAdditional?: boolean
  isValue?: boolean
  leftAdornment?: React.ReactNode
  // We can't use `children` here because `forwardRef` automatically adds a
  // `children` prop with `React.ReacNode` type.
  label: string
  secondaryLabel?: React.ReactNode
}

export const SuggestionItem = forwardRef<
  React.ComponentRef<typeof Item.Root>,
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
    <Item.Root
      {...rest}
      ref={ref}
      data-is-value={toBooleanAttribute(isValue)}
      data-is-additional={toBooleanAttribute(isAdditional)}
      className={cn(
        className,
        "cursor-pointer aria-selected:bg-gray-100 data-[is-value=true]:bg-gray-100",
      )}
    >
      <Item.Icon className="text-gray-600 group-data-[is-additional=true]:text-blue-500">
        {isAdditional ? <Icon href="icon-plus-solid" /> : leftAdornment}
      </Item.Icon>

      <Item.Content asChild>
        <span className="group-data-[is-additional=true]:text-blue-500 group-data-[is-value=true]:text-body-emphasis">
          <Markdown components={HIGHLIGHT_COMPONENTS}>{label}</Markdown>
          {secondaryLabel != null ? (
            <span className="text-gray-500"> - {secondaryLabel}</span>
          ) : null}
        </span>
      </Item.Content>

      <Item.Icon className="opacity-0 transition-opacity ease-in-out group-data-[is-value=true]:opacity-100">
        <Icon href="icon-check-solid" className="text-[14px] text-green-600" />
      </Item.Icon>
    </Item.Root>
  )
})

export function NoSuggestion({ children }: { children?: React.ReactNode }) {
  return (
    <li className="flex h-4 flex-col justify-center">
      <p className="text-center text-gray-500">{children}</p>
    </li>
  )
}
