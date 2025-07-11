import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ChipList } from "#core/data-display/chip-list";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { AvailabilityChip } from "#foster-families/availability-chip";
import { BannedChip } from "#foster-families/banned-chip";
import { theme } from "#generated/theme.js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardHeader() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root className="grid grid-cols-fr-auto items-center gap-2 md:gap-4">
      <div className="grid grid-cols-1 justify-items-start gap-1 md:gap-2">
        <PageLayout.Header.Title>
          {fosterFamily.displayName}
        </PageLayout.Header.Title>

        <ChipList>
          <AvailabilityChip
            availability={fosterFamily.availability}
            expirationDate={fosterFamily.availabilityExpirationDate}
          />

          {fosterFamily.isBanned ? <BannedChip /> : null}
        </ChipList>
      </div>

      <div className="grid grid-flow-col gap-1">
        <Action variant="primary" isIconOnly className="md:hidden" asChild>
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            <Action.Icon href="icon-pen-solid" />
          </BaseLink>
        </Action>

        <Action variant="primary" className="hidden md:flex" asChild>
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            <Action.Icon href="icon-pen-solid" />
            Modifier
          </BaseLink>
        </Action>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Action isIconOnly variant="secondary" color="gray">
              <Action.Icon href="icon-ellipsis-solid" />
            </Action>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="bottom"
              align="end"
              sideOffset={theme.spacing[1]}
              collisionPadding={theme.spacing[1]}
              className="z-20 flex w-[200px] flex-col gap-1 rounded-1 bg-white p-1 shadow-popover-sm animation-opacity-0 animation-duration-100 -animation-translate-y-2 data-[state=open]:animation-enter data-[state=closed]:animation-exit"
            >
              <DropdownMenu.Item>Coucou</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </PageLayout.Header.Root>
  );
}
