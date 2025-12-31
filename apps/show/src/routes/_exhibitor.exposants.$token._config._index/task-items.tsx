import { Markdown, PARAGRAPH_COMPONENTS } from "#i/core/data-display/markdown";
import { TaskItem } from "#i/core/data-display/task-item";
import { Routes } from "#i/core/navigation";
import { Icon } from "#i/generated/icon";
import { SectionId } from "#i/routes/_exhibitor.exposants.$token._config.participation._index/section-id.js";
import type { Extends } from "@animeaux/core";
import { ShowExhibitorStatus } from "@animeaux/prisma";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function TaskItemDocument({ status }: { status: ShowExhibitorStatus }) {
  const { exhibitor } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStatus.TO_BE_FILLED]:
        "Vos documents justificatifs sont à joindre.",
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Vos documents justificatifs sont en cours de traitement par notre équipe.",
      [ShowExhibitorStatus.TO_MODIFY]:
        "Vos documents justificatifs sont à modifier.",
      [ShowExhibitorStatus.VALIDATED]:
        "Vos documents justificatifs ont été validés.",
    } satisfies Record<ShowExhibitorStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={Routes.exhibitors.token(exhibitor.token).documents.toString()}
    >
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

export function TaskItemStand({ status }: { status: ShowExhibitorStatus }) {
  const { exhibitor } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStatus.TO_BE_FILLED]:
        "Les éléments de votre stand sont à compléter.",
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Les éléments de votre stand sont en cours de traitement par notre équipe.",
      [ShowExhibitorStatus.TO_MODIFY]:
        "Des éléments de votre stand sont à modifier.",
      [ShowExhibitorStatus.VALIDATED]:
        "Les éléments de votre stand ont été validés.",
    } satisfies Record<ShowExhibitorStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={Routes.exhibitors
        .token(exhibitor.token)
        .participation.toString(SectionId.STAND)}
    >
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
  status: ShowExhibitorStatus;
}) {
  const { exhibitor } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStatus.TO_BE_FILLED]: "Votre description est à compléter.",
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Votre description est en cours de traitement par notre équipe.",
      [ShowExhibitorStatus.TO_MODIFY]: "Votre description est à modifier.",
      [ShowExhibitorStatus.VALIDATED]: "Votre description a été validée.",
    } satisfies Record<ShowExhibitorStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={{
        pathname: Routes.exhibitors.token(exhibitor.token).profile.toString(),
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
  ShowExhibitorStatus,
  "TO_MODIFY" | "AWAITING_VALIDATION" | "VALIDATED"
>;

export function TaskItemDogs({ status }: { status: TaskItemDogsStatus }) {
  const { exhibitor } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Le profil des chiens sur votre stand est en cours de traitement par notre équipe.",
      [ShowExhibitorStatus.TO_MODIFY]:
        "Le profil des chiens sur votre stand est à modifier.",
      [ShowExhibitorStatus.VALIDATED]:
        "Le profil des chiens sur votre stand a été validé.",
    } satisfies Record<TaskItemDogsStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={Routes.exhibitors
        .token(exhibitor.token)
        .participation.toString(SectionId.DOGS)}
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

export function TaskItemPerks({ status }: { status: ShowExhibitorStatus }) {
  const { exhibitor } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStatus.TO_BE_FILLED]: "Vos avantages sont à compléter.",
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Vos avantages sont en cours de traitement par notre équipe.",
      [ShowExhibitorStatus.TO_MODIFY]: "Vos avantages sont à modifier.",
      [ShowExhibitorStatus.VALIDATED]: "Vos avantages ont été validés.",
    } satisfies Record<ShowExhibitorStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={Routes.exhibitors
        .token(exhibitor.token)
        .participation.toString(SectionId.PERKS)}
    >
      <TaskItem.Icon asChild>
        <Icon id="sparkles-light" />
      </TaskItem.Icon>

      <TaskItem.Content>
        <TaskItem.Title>Avantages</TaskItem.Title>

        <TaskItem.Description>
          <Markdown content={description} components={PARAGRAPH_COMPONENTS} />
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}

type TaskItemPublicProfileStatus = Extends<
  ShowExhibitorStatus,
  "TO_MODIFY" | "AWAITING_VALIDATION" | "VALIDATED"
>;

export function TaskItemPublicProfile({
  status,
}: {
  status: TaskItemPublicProfileStatus;
}) {
  const { exhibitor } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Votre profil public est en cours de traitement par notre équipe.",
      [ShowExhibitorStatus.TO_MODIFY]: "Votre profil public est à modifier.",
      [ShowExhibitorStatus.VALIDATED]: "Votre profil public a été validé.",
    } satisfies Record<TaskItemDogsStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={Routes.exhibitors.token(exhibitor.token).profile.toString()}
    >
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
  const { exhibitor } = useLoaderData<typeof loader>();

  const description = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "La description des animations sur stand est en cours de traitement par notre équipe.",
      [ShowExhibitorStatus.TO_MODIFY]:
        "La description des animations sur stand est à modifier.",
      [ShowExhibitorStatus.VALIDATED]:
        "La description des animations sur stand a été validée.",
    } satisfies Record<TaskItemDogsStatus, string>
  )[status];

  return (
    <TaskItem.Root
      to={Routes.exhibitors
        .token(exhibitor.token)
        .participation.toString(SectionId.ON_STAND_ANIMATIONS)}
    >
      <TaskItem.Icon asChild>
        <Icon id="comments-light" />
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
