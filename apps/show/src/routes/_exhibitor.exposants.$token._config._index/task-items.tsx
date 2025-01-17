import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { TaskItem } from "#core/data-display/task-item";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import type { Extends } from "@animeaux/core";
import {
  ShowExhibitorDocumentsStatus,
  ShowExhibitorDogsConfigurationStatus,
  ShowExhibitorProfileStatus,
  ShowExhibitorStandConfigurationStatus,
} from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function TaskItemDocument({
  status,
}: {
  status: ShowExhibitorDocumentsStatus;
}) {
  const { token } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorDocumentsStatus.TO_BE_FILLED]:
        "Vos documents justificatifs sont à joindre.",
      [ShowExhibitorDocumentsStatus.AWAITING_VALIDATION]:
        "Vos documents justificatifs sont en cours de traitement par notre équipe.",
      [ShowExhibitorDocumentsStatus.TO_MODIFY]:
        "Vos documents justificatifs sont à modifier.",
      [ShowExhibitorDocumentsStatus.VALIDATED]:
        "Vos documents justificatifs ont été validés.",
    } satisfies Record<ShowExhibitorDocumentsStatus, string>
  )[status];

  return (
    <TaskItem.Root to={Routes.exhibitors.token(token).documents.toString()}>
      <TaskItem.Icon asChild>
        <Icon id="file-light" />
      </TaskItem.Icon>

      <TaskItem.Content>
        <TaskItem.Title>Documents</TaskItem.Title>

        <TaskItem.Description>
          <Markdown content={description} components={PARAGRAPH_COMPONENTS} />
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}

export function TaskItemStand({
  status,
}: {
  status: ShowExhibitorStandConfigurationStatus;
}) {
  const { token } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStandConfigurationStatus.TO_BE_FILLED]:
        "Les éléments de votre stand sont à compléter.",
      [ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION]:
        "Les éléments de votre stand sont en cours de traitement par notre équipe.",
      [ShowExhibitorStandConfigurationStatus.TO_MODIFY]:
        "Des éléments de votre stand sont à modifier.",
      [ShowExhibitorStandConfigurationStatus.VALIDATED]:
        "Les éléments de votre stand ont été validés.",
    } satisfies Record<ShowExhibitorStandConfigurationStatus, string>
  )[status];

  return (
    <TaskItem.Root to={Routes.exhibitors.token(token).stand.toString()}>
      <TaskItem.Icon asChild>
        <Icon id="store-light" />
      </TaskItem.Icon>

      <TaskItem.Content>
        <TaskItem.Title>Stand</TaskItem.Title>

        <TaskItem.Description>
          <Markdown content={description} components={PARAGRAPH_COMPONENTS} />
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}

export function TaskItemDescription({
  status,
}: {
  status: ShowExhibitorProfileStatus;
}) {
  const { token } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorProfileStatus.NOT_TOUCHED]:
        "Votre description est à compléter.",
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "Votre description est en cours de traitement par notre équipe.",
      [ShowExhibitorProfileStatus.TO_MODIFY]:
        "Votre description est à modifier.",
      [ShowExhibitorProfileStatus.VALIDATED]:
        "Votre description a été validée.",
    } satisfies Record<ShowExhibitorProfileStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={{
        pathname: Routes.exhibitors.token(token).profile.toString(),
        hash: "description",
      }}
    >
      <TaskItem.Icon asChild>
        <Icon id="subtitles-light" />
      </TaskItem.Icon>

      <TaskItem.Content>
        <TaskItem.Title>Description</TaskItem.Title>

        <TaskItem.Description>
          <Markdown content={description} components={PARAGRAPH_COMPONENTS} />
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}

type TaskItemDogsStatus = Extends<
  ShowExhibitorDogsConfigurationStatus,
  "TO_MODIFY" | "AWAITING_VALIDATION" | "VALIDATED"
>;

export function TaskItemDogs({ status }: { status: TaskItemDogsStatus }) {
  const { token } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorDogsConfigurationStatus.AWAITING_VALIDATION]:
        "Le profil des chiens sur votre stand est en cours de traitement par notre équipe.",
      [ShowExhibitorDogsConfigurationStatus.TO_MODIFY]:
        "Le profil des chiens sur votre stand est à modifier.",
      [ShowExhibitorDogsConfigurationStatus.VALIDATED]:
        "Le profil des chiens sur votre stand a été validé.",
    } satisfies Record<TaskItemDogsStatus, string>
  )[status];

  return (
    <TaskItem.Root
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
          <Markdown content={description} components={PARAGRAPH_COMPONENTS} />
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}

type TaskItemPublicProfileStatus = Extends<
  ShowExhibitorProfileStatus,
  "TO_MODIFY" | "AWAITING_VALIDATION" | "VALIDATED"
>;

export function TaskItemPublicProfile({
  status,
}: {
  status: TaskItemPublicProfileStatus;
}) {
  const { token } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "Votre profil public est en cours de traitement par notre équipe.",
      [ShowExhibitorProfileStatus.TO_MODIFY]:
        "Votre profil public est à modifier.",
      [ShowExhibitorProfileStatus.VALIDATED]:
        "Votre profil public a été validé.",
    } satisfies Record<TaskItemDogsStatus, string>
  )[status];

  return (
    <TaskItem.Root to={Routes.exhibitors.token(token).profile.toString()}>
      <TaskItem.Icon asChild>
        <Icon id="image-card-light" />
      </TaskItem.Icon>

      <TaskItem.Content>
        <TaskItem.Title>Profil public</TaskItem.Title>

        <TaskItem.Description>
          <Markdown content={description} components={PARAGRAPH_COMPONENTS} />
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}

export function TaskItemOnStandAnimations({
  status,
}: {
  status: TaskItemPublicProfileStatus;
}) {
  const { token } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "La description des animations sur stand est en cours de traitement par notre équipe.",
      [ShowExhibitorProfileStatus.TO_MODIFY]:
        "La description des animations sur stand est à modifier.",
      [ShowExhibitorProfileStatus.VALIDATED]:
        "La description des animations sur stand a été validée.",
    } satisfies Record<TaskItemDogsStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={{
        pathname: Routes.exhibitors.token(token).animations.toString(),
        hash: "on-stand-animations",
      }}
    >
      <TaskItem.Icon asChild>
        <Icon id="calendar-day-light" />
      </TaskItem.Icon>

      <TaskItem.Content>
        <TaskItem.Title>Animations sur stand</TaskItem.Title>

        <TaskItem.Description>
          <Markdown content={description} components={PARAGRAPH_COMPONENTS} />
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}
