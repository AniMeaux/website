import { Action } from "#core/actions.tsx";
import { cn } from "#core/classNames.ts";
import { Card } from "#core/layout/card.tsx";
import { Icon } from "#generated/icon.tsx";
import * as Dialog from "@radix-ui/react-dialog";

export function SortAndFiltersFloatingAction({
  totalCount,
  hasSort = false,
  children,
}: {
  totalCount: number;
  hasSort?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Action
          variant="floating"
          className="fixed bottom-safe-6 right-safe-1 z-20 md:hidden"
        >
          <Icon id="filter" />
        </Action>
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

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col gap-1">
          <header className="sticky top-0 z-20 min-h-[50px] px-safe-1 pt-safe-0.5 pb-0.5 flex-none bg-white flex items-center gap-1">
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

          <footer className="sticky bottom-0 z-20 px-safe-1 pt-1 pb-safe-1 flex-none bg-white flex">
            <Dialog.Close asChild>
              <Action className="w-full">
                Voir les résultats ({totalCount})
              </Action>
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
