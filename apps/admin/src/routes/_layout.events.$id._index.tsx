import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { BlockHelper } from "#core/data-display/helper";
import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { db } from "#core/db.server";
import { NotFoundError } from "#core/errors.server";
import { assertIsDefined } from "#core/is-defined.server";
import { AvatarCard } from "#core/layout/avatar-card";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { Dialog } from "#core/popovers/dialog";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { EventAvatar } from "#events/avatar";
import { Icon } from "#generated/icon";
import { formatDateRange } from "@animeaux/core";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id: paramsResult.data.id },
    select: {
      description: true,
      endDate: true,
      id: true,
      image: true,
      isFullDay: true,
      isVisible: true,
      location: true,
      startDate: true,
      title: true,
      url: true,
    },
  });

  assertIsDefined(event);

  return json({ event });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const event = data?.event;
  if (event == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(event.title) }];
};

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "DELETE") {
    throw notFound();
  }

  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  try {
    await db.event.delete(paramsResult.data.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing foster family.
  throw redirect(Routes.events.toString());
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        {!event.isVisible ? (
          <BlockHelper variant="warning" icon="icon-eye-slash-solid">
            L’évènement n’est pas visible.
          </BlockHelper>
        ) : null}

        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="flex flex-col gap-1 md:gap-2">
            <DetailsCard />
            <DescriptionCard />
          </section>

          <section className="flex flex-col gap-1 md:gap-2">
            <ImageCard />
            <ActionCard />
          </section>
        </section>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

function HeaderCard() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <AvatarCard>
      <AvatarCard.BackgroundImage
        imageId={event.image}
        imageAlt={event.title}
      />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <EventAvatar event={event} />
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <h1>{event.title}</h1>
          </AvatarCard.FirstLine>
        </AvatarCard.Lines>

        <Action asChild variant="text">
          <BaseLink to={Routes.events.id(event.id).edit.toString()}>
            Modifier
          </BaseLink>
        </Action>
      </AvatarCard.Content>
    </AvatarCard>
  );
}

function DetailsCard() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Détails</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon href="icon-calendar-days-solid" />}>
            {formatDateRange(event.startDate, event.endDate, {
              showTime: !event.isFullDay,
            })}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-location-dot-solid" />}>
            {event.location}
          </SimpleItem>

          {event.url != null ? (
            <SimpleItem icon={<Icon href="icon-globe-solid" />}>
              {event.url}
            </SimpleItem>
          ) : null}
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function DescriptionCard() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Description</Card.Title>
      </Card.Header>

      <Card.Content>
        <p>{event.description}</p>
      </Card.Content>
    </Card>
  );
}

function ImageCard() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Affiche</Card.Title>
      </Card.Header>

      <Card.Content>
        <DynamicImage
          imageId={event.image}
          alt={event.title}
          fallbackSize="512"
          sizeMapping={{ default: "100vw", md: "30vw" }}
          className="w-full rounded-1"
        />
      </Card.Content>
    </Card>
  );
}

function ActionCard() {
  const { event } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Actions</Card.Title>
      </Card.Header>

      <Card.Content>
        <Dialog>
          <Dialog.Trigger asChild>
            <Action variant="secondary" color="red">
              <Action.Icon href="icon-trash-solid" />
              Supprimer
            </Action>
          </Dialog.Trigger>

          <Dialog.Content variant="alert">
            <Dialog.Header>Supprimer {event.title}</Dialog.Header>

            <Dialog.Message>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong className="text-body-emphasis">{event.title}</strong>
              {" "}?
              <br />
              L’action est irréversible.
            </Dialog.Message>

            <Dialog.Actions>
              <Dialog.CloseAction>Annuler</Dialog.CloseAction>

              <fetcher.Form method="DELETE" className="flex">
                <Dialog.ConfirmAction type="submit">
                  Oui, supprimer
                </Dialog.ConfirmAction>
              </fetcher.Form>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </Card.Content>
    </Card>
  );
}
