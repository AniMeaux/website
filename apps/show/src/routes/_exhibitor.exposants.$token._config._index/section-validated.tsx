import { FormLayout } from "#core/layout/form-layout";
import { ShowExhibitorStatus } from "@animeaux/prisma/client";
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

export function SectionValidated() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (exhibitor.documentStatus === ShowExhibitorStatus.VALIDATED) {
    items.push(
      <TaskItemDocument key="documents" status={exhibitor.documentStatus} />,
    );
  }

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    items.push(
      <TaskItemStand key="stand" status={exhibitor.standConfigurationStatus} />,
    );
  }

  if (exhibitor.descriptionStatus === ShowExhibitorStatus.VALIDATED) {
    items.push(
      <TaskItemDescription
        key="description"
        status={exhibitor.descriptionStatus}
      />,
    );
  }

  if (exhibitor.dogsConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    items.push(
      <TaskItemDogs key="dogs" status={exhibitor.dogsConfigurationStatus} />,
    );
  }

  if (exhibitor.publicProfileStatus === ShowExhibitorStatus.VALIDATED) {
    items.push(
      <TaskItemPublicProfile
        key="public-profile"
        status={exhibitor.publicProfileStatus}
      />,
    );
  }

  if (exhibitor.onStandAnimationsStatus === ShowExhibitorStatus.VALIDATED) {
    items.push(
      <TaskItemOnStandAnimations
        key="on-stand-animations"
        status={exhibitor.onStandAnimationsStatus}
      />,
    );
  }

  if (exhibitor.perksStatus === ShowExhibitorStatus.VALIDATED) {
    items.push(<TaskItemPerks key="perks" status={exhibitor.perksStatus} />);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <FormLayout.Section>
        <FormLayout.Title>Informations validées</FormLayout.Title>

        {items}
      </FormLayout.Section>

      <FormLayout.SectionSeparator />
    </>
  );
}
