import { Action } from "#core/actions";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
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
          className="fixed z-20 bottom-safe-6 right-safe-1 md:hidden"
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
            "bottom-0 left-0 right-0 top-0 z-30 overscroll-none bg-black/20",
          )}
        />

        <Dialog.Content className="fixed bottom-0 left-0 right-0 top-0 z-30 flex flex-col gap-1 overflow-y-auto bg-gray-50">
          <header className="sticky top-0 z-20 flex min-h-[50px] flex-none items-center gap-1 bg-white pb-0.5 bg-var-white pt-safe-0.5 px-safe-1">
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

          <footer className="sticky bottom-0 z-20 flex flex-none bg-white pt-1 bg-var-white pb-safe-1 px-safe-1">
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
