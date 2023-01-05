import * as Dialog from "@radix-ui/react-dialog";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Card, CardContent } from "~/core/layout/card";
import { Icon } from "~/generated/icon";

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
      <Dialog.Trigger
        className={cn(
          "fixed bottom-safe-6 right-safe-1 z-20 md:hidden",
          actionClassName.standalone({ variant: "floating" })
        )}
      >
        <Icon id="filter" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20"
          )}
        />

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col gap-1">
          <header className="sticky top-0 z-20 min-h-[50px] px-safe-1 pt-safe-0.5 pb-0.5 flex-none bg-white flex items-center gap-1">
            <Dialog.Title className="flex-1 text-title-section-large">
              {hasSort ? "Trier et filtrer" : "Filtrer"}
            </Dialog.Title>

            <Dialog.Close
              className={cn(
                "flex-none",
                actionClassName.standalone({ variant: "text" })
              )}
            >
              Fermer
            </Dialog.Close>
          </header>

          <Card>
            <CardContent>{children}</CardContent>
          </Card>

          <footer className="sticky bottom-0 z-20 px-safe-1 pt-1 pb-safe-1 flex-none bg-white flex">
            <Dialog.Close
              className={cn(actionClassName.standalone(), "w-full")}
            >
              Voir les résultats ({totalCount})
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
