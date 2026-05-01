import { cn } from "@animeaux/core"
import * as Dialog from "@radix-ui/react-dialog"

import { Action } from "#i/core/actions.js"
import { Card } from "#i/core/layout/card.js"
import { Icon } from "#i/generated/icon.js"

export function SortAndFiltersFloatingAction({
  totalCount,
  hasSort = false,
  children,
}: {
  totalCount: number
  hasSort?: boolean
  children?: React.ReactNode
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="fixed right-safe-1.5 bottom-safe-6.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-popover-sm transition-[background-color,scale] ease-in-out focus-ring-spaced hover:bg-blue-400 focus-visible:focus-ring active:scale-95 md:hidden">
        <Icon href="icon-filter-solid" className="text-[25px] text-white" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20",
          )}
        />

        <Dialog.Content className="fixed top-0 right-0 bottom-0 left-0 z-30 flex flex-col gap-1 overflow-y-auto bg-gray-50">
          <header className="sticky top-0 z-20 flex min-h-5 flex-none items-center gap-1 bg-white pt-safe-0.5 px-safe-1.5 pb-0.5">
            <Dialog.Title className="flex-1 text-title-section-large">
              {hasSort ? "Trier et filtrer" : "Filtrer"}
            </Dialog.Title>

            <Dialog.Close asChild>
              <Action variant="text" className="flex-none">
                Fermer
              </Action>
            </Dialog.Close>
          </header>

          <Card>
            <Card.Content>{children}</Card.Content>
          </Card>

          <footer className="sticky bottom-0 z-20 flex flex-none bg-white pt-1 px-safe-1.5 pb-safe-1">
            <Dialog.Close asChild>
              <Action className="w-full">
                Voir les résultats ({totalCount})
              </Action>
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
