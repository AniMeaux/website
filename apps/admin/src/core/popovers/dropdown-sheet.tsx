import { cn } from "@animeaux/core"
import * as Dialog from "@radix-ui/react-dialog"
import * as Popover from "@radix-ui/react-popover"
import { createContext, forwardRef, useContext } from "react"
import invariant from "tiny-invariant"

import { Overlay } from "#i/core/popovers/overlay.js"
import { useScreenSizeCondition } from "#i/core/screen-size.js"
import { Breakpoint } from "#i/generated/theme.js"

type Component = "popover" | "dialog"
const DropdownSheetContext = createContext<undefined | Component>(undefined)

export function DropdownSheet(
  props: React.ComponentProps<typeof Dialog.Root> &
    React.ComponentProps<typeof Popover.Root>,
) {
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= Breakpoint.value.md,
  )

  const component = isMedium ? "popover" : "dialog"
  const Root = component === "dialog" ? Dialog.Root : Popover.Root

  return (
    // Use a context instead of computing the value in each component to avoid
    // missmatch during rendering.
    <DropdownSheetContext.Provider value={component}>
      <Root {...props} />
    </DropdownSheetContext.Provider>
  )
}

DropdownSheet.Trigger = forwardRef<
  React.ComponentRef<typeof Dialog.Trigger>,
  React.ComponentPropsWithoutRef<typeof Dialog.Trigger> &
    React.ComponentPropsWithoutRef<typeof Popover.Trigger>
>(function DropdownSheetTrigger(props, ref) {
  const component = useDropdownSheetContext("DropdownSheet.Trigger")
  const Trigger = component === "dialog" ? Dialog.Trigger : Popover.Trigger
  return <Trigger {...props} ref={ref} />
})

DropdownSheet.Portal = function DropdownSheetPortal({
  children,
  ...rest
}: React.ComponentProps<typeof Dialog.Portal> &
  React.ComponentProps<typeof Popover.Portal>) {
  const component = useDropdownSheetContext("DropdownSheet.Portal")

  if (component === "dialog") {
    return (
      <Dialog.Portal {...rest}>
        <Dialog.Overlay asChild>
          <Overlay />
        </Dialog.Overlay>

        {children}
      </Dialog.Portal>
    )
  }

  return <Popover.Portal {...rest}>{children}</Popover.Portal>
}

DropdownSheet.Content = forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content> &
    React.ComponentPropsWithoutRef<typeof Popover.Content>
>(function DropdownSheetContent(
  {
    align,
    alignOffset,
    arrowPadding,
    avoidCollisions,
    collisionBoundary,
    collisionPadding,
    hideWhenDetached,
    onFocusOutside,
    side,
    sideOffset,
    sticky,
    children,
    className,
    ...rest
  },
  ref,
) {
  const component = useDropdownSheetContext("DropdownSheet.Content")

  if (component === "dialog") {
    return (
      <Dialog.Content
        {...rest}
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 grid px-safe-1.5 pb-safe-1 animation-duration-slow out-translate-y-full data-opened:animate-enter data-closed:animate-exit",
          className,
        )}
      >
        {/*
         * Because links can't be focused by default, we might focus an element
         * out of order.
         * This div wrapper will receive the focus everytime, the user can then
         * tab in content.
         * https://github.com/radix-ui/primitives/issues/2373
         */}
        <div
          // Explained just above.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className="flex w-full flex-col gap-1 rounded-1 bg-white p-1 shadow-popover-md focus-visible:focus-ring"
        >
          {children}
        </div>
      </Dialog.Content>
    )
  }

  return (
    <Popover.Content
      {...rest}
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      arrowPadding={arrowPadding}
      avoidCollisions={avoidCollisions}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      hideWhenDetached={hideWhenDetached}
      onFocusOutside={onFocusOutside}
      side={side}
      sideOffset={sideOffset}
      sticky={sticky}
      className={cn(
        "z-30 grid w-30 out-opacity-0 data-opened:animate-enter data-closed:animate-exit data-top:out-translate-y-2 data-bottom:-out-translate-y-2",
        className,
      )}
    >
      {/*
       * Because links can't be focused by default, we might focus an element
       * out of order.
       * This div wrapper will receive the focus everytime, the user can then
       * tab in content.
       * https://github.com/radix-ui/primitives/issues/2373
       */}
      <div
        // Explained just above.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="flex w-full flex-col gap-1 rounded-1 bg-white p-1 shadow-popover-sm focus-visible:focus-ring"
      >
        {children}
      </div>
    </Popover.Content>
  )
})

function useDropdownSheetContext(functionCallerName: string) {
  const context = useContext(DropdownSheetContext)

  invariant(
    context != null,
    `${functionCallerName} can only be used inside a DropdownSheet.`,
  )

  return context
}
