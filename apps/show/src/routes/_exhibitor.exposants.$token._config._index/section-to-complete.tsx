import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { TaskItem } from "#core/data-display/task-item";
import { FormLayout } from "#core/layout/form-layout";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import {
  ShowExhibitorDocumentsStatus,
  ShowExhibitorStandConfigurationStatus,
} from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionToComplete() {
  const { profile, standConfiguration, documents, token } =
    useLoaderData<typeof loader>();

  const items: React.ReactNode[] = [];

  if (
    [
      ShowExhibitorDocumentsStatus.TO_BE_FILLED,
      ShowExhibitorDocumentsStatus.TO_MODIFY,
    ].includes(documents.status)
  ) {
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
            {documents.statusMessage == null ? (
              <>Des documents justificatifs sont à joindre.</>
            ) : (
              <Markdown
                content={documents.statusMessage}
                components={SENTENCE_COMPONENTS}
              />
            )}
          </TaskItem.Description>
        </TaskItem.Content>

        <TaskItem.ChevronIcon />
      </TaskItem.Root>,
    );
  }

  if (
    [
      ShowExhibitorStandConfigurationStatus.TO_BE_FILLED,
      ShowExhibitorStandConfigurationStatus.TO_MODIFY,
    ].includes(standConfiguration.status)
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
            {standConfiguration.statusMessage == null ? (
              <>Des éléments de stand sont à compléter ou modifier.</>
            ) : (
              <Markdown
                content={standConfiguration.statusMessage}
                components={SENTENCE_COMPONENTS}
              />
            )}
          </TaskItem.Description>
        </TaskItem.Content>

        <TaskItem.ChevronIcon />
      </TaskItem.Root>,
    );
  }

  if (profile.description == null) {
    items.push(
      <TaskItem.Root
        key="description"
        to={Routes.exhibitors.token(token).profile.toString()}
      >
        <TaskItem.Icon asChild>
          <Icon id="subtitles-light" />
        </TaskItem.Icon>

        <TaskItem.Content>
          <TaskItem.Title>Description</TaskItem.Title>

          <TaskItem.Description>
            Votre description est à compléter.
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
        <FormLayout.Title>Informations à completer</FormLayout.Title>

        {items}
      </FormLayout.Section>

      <FormLayout.SectionSeparator />
    </>
  );
}
