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

export function SectionToComplete() {
  const { profile, standConfiguration, documents, dogsConfiguration } =
    useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (
    [
      ShowExhibitorDocumentsStatus.TO_BE_FILLED,
      ShowExhibitorDocumentsStatus.TO_MODIFY,
    ].includes(documents.status)
  ) {
    items.push(<TaskItemDocument key="documents" status={documents.status} />);
  }

  if (
    [
      ShowExhibitorStandConfigurationStatus.TO_BE_FILLED,
      ShowExhibitorStandConfigurationStatus.TO_MODIFY,
    ].includes(standConfiguration.status)
  ) {
    items.push(
      <TaskItemStand key="stand" status={standConfiguration.status} />,
    );
  }

  if (
    [
      ShowExhibitorProfileStatus.NOT_TOUCHED,
      ShowExhibitorProfileStatus.TO_MODIFY,
    ].includes(profile.descriptionStatus)
  ) {
    items.push(
      <TaskItemDescription
        key="description"
        status={profile.descriptionStatus}
      />,
    );
  }

  if (
    dogsConfiguration.status === ShowExhibitorDogsConfigurationStatus.TO_MODIFY
  ) {
    items.push(<TaskItemDogs key="dogs" status={dogsConfiguration.status} />);
  }

  if (profile.publicProfileStatus === ShowExhibitorProfileStatus.TO_MODIFY) {
    items.push(
      <TaskItemPublicProfile
        key="public-profile"
        status={profile.publicProfileStatus}
      />,
    );
  }

  if (
    profile.onStandAnimationsStatus === ShowExhibitorProfileStatus.TO_MODIFY
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
        <FormLayout.Title>Informations à completer</FormLayout.Title>

        {items}
      </FormLayout.Section>

      <FormLayout.SectionSeparator />
    </>
  );
}
