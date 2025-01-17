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

export function SectionValidated() {
  const { profile, standConfiguration, documents, dogsConfiguration } =
    useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (documents.status === ShowExhibitorDocumentsStatus.VALIDATED) {
    items.push(<TaskItemDocument key="documents" status={documents.status} />);
  }

  if (
    standConfiguration.status ===
    ShowExhibitorStandConfigurationStatus.VALIDATED
  ) {
    items.push(
      <TaskItemStand key="stand" status={standConfiguration.status} />,
    );
  }

  if (profile.descriptionStatus === ShowExhibitorProfileStatus.VALIDATED) {
    items.push(
      <TaskItemDescription
        key="description"
        status={profile.descriptionStatus}
      />,
    );
  }

  if (
    dogsConfiguration.status === ShowExhibitorDogsConfigurationStatus.VALIDATED
  ) {
    items.push(<TaskItemDogs key="dogs" status={dogsConfiguration.status} />);
  }

  if (profile.publicProfileStatus === ShowExhibitorProfileStatus.VALIDATED) {
    items.push(
      <TaskItemPublicProfile
        key="public-profile"
        status={profile.publicProfileStatus}
      />,
    );
  }

  if (
    profile.onStandAnimationsStatus === ShowExhibitorProfileStatus.VALIDATED
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
        <FormLayout.Title>Informations validées</FormLayout.Title>

        {items}
      </FormLayout.Section>

      <FormLayout.SectionSeparator />
    </>
  );
}
