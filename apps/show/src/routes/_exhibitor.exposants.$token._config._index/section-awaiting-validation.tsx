import { FormLayout } from "#core/layout/form-layout";
import { ShowExhibitorStatus } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";
import {
  TaskItemDescription,
  TaskItemDocument,
  TaskItemDogs,
  TaskItemOnStandAnimations,
  TaskItemPerks,
  TaskItemPublicProfile,
  TaskItemStand,
} from "./task-items";

export function SectionAwaitingValidation() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (exhibitor.documentStatus === ShowExhibitorStatus.AWAITING_VALIDATION) {
    items.push(
      <TaskItemDocument key="documents" status={exhibitor.documentStatus} />,
    );
  }

  if (
    exhibitor.standConfigurationStatus ===
    ShowExhibitorStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemStand key="stand" status={exhibitor.standConfigurationStatus} />,
    );
  }

  if (exhibitor.descriptionStatus === ShowExhibitorStatus.AWAITING_VALIDATION) {
    items.push(
      <TaskItemDescription
        key="description"
        status={exhibitor.descriptionStatus}
      />,
    );
  }

  if (
    exhibitor.dogsConfigurationStatus ===
    ShowExhibitorStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemDogs key="dogs" status={exhibitor.dogsConfigurationStatus} />,
    );
  }

  if (
    exhibitor.publicProfileStatus === ShowExhibitorStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemPublicProfile
        key="public-profile"
        status={exhibitor.publicProfileStatus}
      />,
    );
  }

  if (
    exhibitor.onStandAnimationsStatus ===
    ShowExhibitorStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemOnStandAnimations
        key="on-stand-animations"
        status={exhibitor.onStandAnimationsStatus}
      />,
    );
  }

  if (exhibitor.perksStatus === ShowExhibitorStatus.AWAITING_VALIDATION) {
    items.push(<TaskItemPerks key="perks" status={exhibitor.perksStatus} />);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <FormLayout.Section>
        <FormLayout.Title>Informations en cours de traitement</FormLayout.Title>

        {items}
      </FormLayout.Section>

      <FormLayout.SectionSeparator />
    </>
  );
}
