import { TaskItem } from "#core/data-display/task-item";
import { FormLayout } from "#core/layout/form-layout";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import {
  ShowExhibitorDocumentsStatus,
  ShowExhibitorDogsConfigurationStatus,
  ShowExhibitorStandConfigurationStatus,
} from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionValidated() {
  const { standConfiguration, documents, dogsConfiguration, token } =
    useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (documents.status === ShowExhibitorDocumentsStatus.VALIDATED) {
    items.push(
      <TaskItem.Root
        key="documents"
        to={Routes.exhibitors.token(token).documents.toString()}
      >
        <TaskItem.Icon asChild>
          <Icon id="file-light" />
        </TaskItem.Icon>

        <TaskItem.Content>
          <TaskItem.Title>Documents</TaskItem.Title>

          <TaskItem.Description>
            Vos documents justificatifs ont été validés.
          </TaskItem.Description>
        </TaskItem.Content>

        <TaskItem.ChevronIcon />
      </TaskItem.Root>,
    );
  }

  if (
    standConfiguration.status ===
    ShowExhibitorStandConfigurationStatus.VALIDATED
  ) {
    items.push(
      <TaskItem.Root
        key="stand"
        to={Routes.exhibitors.token(token).stand.toString()}
      >
        <TaskItem.Icon asChild>
          <Icon id="store-light" />
        </TaskItem.Icon>

        <TaskItem.Content>
          <TaskItem.Title>Stand</TaskItem.Title>

          <TaskItem.Description>
            Les éléments de votre stand ont été validés.
          </TaskItem.Description>
        </TaskItem.Content>

        <TaskItem.ChevronIcon />
      </TaskItem.Root>,
    );
  }

  if (
    dogsConfiguration.status === ShowExhibitorDogsConfigurationStatus.VALIDATED
  ) {
    items.push(
      <TaskItem.Root
        key="dogs"
        to={{
          pathname: Routes.exhibitors.token(token).stand.toString(),
          hash: "dogs",
        }}
      >
        <TaskItem.Icon asChild>
          <Icon id="dog-light" />
        </TaskItem.Icon>

        <TaskItem.Content>
          <TaskItem.Title>Chiens sur stand</TaskItem.Title>

          <TaskItem.Description>
            Le profil des chiens sur votre stand a été validé.
          </TaskItem.Description>
        </TaskItem.Content>

        <TaskItem.ChevronIcon />
      </TaskItem.Root>,
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
