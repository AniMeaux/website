import { FormLayout } from "#core/layout/form-layout";
import {
  ShowExhibitorDocumentsStatus,
  ShowExhibitorDogsConfigurationStatus,
  ShowExhibitorProfileStatus,
  ShowExhibitorStandConfigurationStatus,
} from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";
import {
  TaskItemDescription,
  TaskItemDocument,
  TaskItemDogs,
  TaskItemOnStandAnimations,
  TaskItemPublicProfile,
  TaskItemStand,
} from "./task-items";

export function SectionAwaitingValidation() {
  const { standConfiguration, profile, documents, dogsConfiguration } =
    useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (documents.status === ShowExhibitorDocumentsStatus.AWAITING_VALIDATION) {
    items.push(<TaskItemDocument key="documents" status={documents.status} />);
  }

  if (
    standConfiguration.status ===
    ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemStand key="stand" status={standConfiguration.status} />,
    );
  }

  if (
    profile.descriptionStatus === ShowExhibitorProfileStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemDescription
        key="description"
        status={profile.descriptionStatus}
      />,
    );
  }

  if (
    dogsConfiguration.status ===
    ShowExhibitorDogsConfigurationStatus.AWAITING_VALIDATION
  ) {
    items.push(<TaskItemDogs key="dogs" status={dogsConfiguration.status} />);
  }

  if (
    profile.publicProfileStatus ===
    ShowExhibitorProfileStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemPublicProfile
        key="public-profile"
        status={profile.publicProfileStatus}
      />,
    );
  }

  if (
    profile.onStandAnimationsStatus ===
    ShowExhibitorProfileStatus.AWAITING_VALIDATION
  ) {
    items.push(
      <TaskItemOnStandAnimations
        key="on-stand-animations"
        status={profile.onStandAnimationsStatus}
      />,
    );
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
