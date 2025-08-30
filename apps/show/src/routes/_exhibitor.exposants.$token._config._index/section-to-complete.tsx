import { FormLayout } from "#core/layout/form-layout";
import { ShowExhibitorStatus } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";
import {
  TaskItemDescription,
  TaskItemDocument,
  TaskItemDogs,
  TaskItemOnStandAnimations,
  TaskItemPublicProfile,
  TaskItemStand,
} from "./task-items";

export function SectionToComplete() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (
    [ShowExhibitorStatus.TO_BE_FILLED, ShowExhibitorStatus.TO_MODIFY].includes(
      exhibitor.documentStatus,
    )
  ) {
    items.push(
      <TaskItemDocument key="documents" status={exhibitor.documentStatus} />,
    );
  }

  if (
    [ShowExhibitorStatus.TO_BE_FILLED, ShowExhibitorStatus.TO_MODIFY].includes(
      exhibitor.standConfigurationStatus,
    )
  ) {
    items.push(
      <TaskItemStand key="stand" status={exhibitor.standConfigurationStatus} />,
    );
  }

  if (
    [ShowExhibitorStatus.TO_BE_FILLED, ShowExhibitorStatus.TO_MODIFY].includes(
      exhibitor.descriptionStatus,
    )
  ) {
    items.push(
      <TaskItemDescription
        key="description"
        status={exhibitor.descriptionStatus}
      />,
    );
  }

  if (exhibitor.dogsConfigurationStatus === ShowExhibitorStatus.TO_MODIFY) {
    items.push(
      <TaskItemDogs key="dogs" status={exhibitor.dogsConfigurationStatus} />,
    );
  }

  if (exhibitor.publicProfileStatus === ShowExhibitorStatus.TO_MODIFY) {
    items.push(
      <TaskItemPublicProfile
        key="public-profile"
        status={exhibitor.publicProfileStatus}
      />,
    );
  }

  if (exhibitor.onStandAnimationsStatus === ShowExhibitorStatus.TO_MODIFY) {
    items.push(
      <TaskItemOnStandAnimations
        key="on-stand-animations"
        status={exhibitor.onStandAnimationsStatus}
      />,
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <FormLayout.Section>
        <FormLayout.Title>Informations à completer</FormLayout.Title>

        {items}
      </FormLayout.Section>

      <FormLayout.SectionSeparator />
    </>
  );
}
