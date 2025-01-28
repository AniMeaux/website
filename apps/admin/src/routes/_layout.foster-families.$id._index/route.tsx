import { AnimalItem } from "#animals/item";
import { AnimalSearchParams } from "#animals/search-params";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Empty } from "#core/data-display/empty";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { ErrorsInlineHelper } from "#core/data-display/errors";
import { InlineHelper } from "#core/data-display/helper";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { db } from "#core/db.server";
import { NotFoundError, ReferencedError } from "#core/errors.server";
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
import {
  AVATAR_COLOR_BY_AVAILABILITY,
  FosterFamilyAvatar,
} from "#foster-families/avatar";
import { ActionFormData } from "#foster-families/form";
import { zu } from "@animeaux/zod-utils";
import { FosterFamilyAvailability, UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useState } from "react";
import { promiseHash } from "remix-utils/promise";
import { ContactCard } from "./contact-card";
import { SituationCard } from "./situation-card";

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export type loader = typeof loader;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  const { fosterFamily, fosterAnimalCount, fosterAnimals } = await promiseHash({
    fosterFamily: prisma.fosterFamily.findUnique({
      where: { id: paramsResult.data.id },
      select: {
        address: true,
        availability: true,
        availabilityExpirationDate: true,
        city: true,
        comments: true,
        displayName: true,
        email: true,
        garden: true,
        housing: true,
        id: true,
        phone: true,
        speciesAlreadyPresent: true,
        speciesToHost: true,
        zipCode: true,
      },
    }),

    fosterAnimalCount: prisma.animal.count({
      where: { fosterFamilyId: paramsResult.data.id },
    }),

    fosterAnimals: prisma.animal.findMany({
      where: { fosterFamilyId: paramsResult.data.id },
      take: 5,
      orderBy: { pickUpDate: "desc" },
      select: {
        alias: true,
        avatar: true,
        birthdate: true,
        gender: true,
        id: true,
        isSterilizationMandatory: true,
        isSterilized: true,
        manager: { select: { displayName: true } },
        name: true,
        nextVaccinationDate: true,
        species: true,
        status: true,
      },
    }),
  });

  assertIsDefined(fosterFamily);

  return json({ fosterFamily, fosterAnimalCount, fosterAnimals });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily;
  if (fosterFamily == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(fosterFamily.displayName) }];
};

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "DELETE") {
    throw notFound();
  }

  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  try {
    await db.fosterFamily.delete(paramsResult.data.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    if (error instanceof ReferencedError) {
      return json(
        {
          errors: [
            "La famille d’accueil ne peut être supprimée tant qu’elle a des animaux accueillis.",
          ],
        },
        { status: 400 },
      );
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing foster family.
  throw redirect(Routes.fosterFamilies.toString());
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:hidden">
          <ContactCard />
          <SituationCard />
          <CommentsCard />
          <FosterAnimalsCard />
          <ActionCard />
        </section>

        <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="md:flex md:flex-col md:gap-2">
            <ContactCard />
            <FosterAnimalsCard />
          </section>

          <section className="md:flex md:flex-col md:gap-2">
            <SituationCard />
            <CommentsCard />
            <ActionCard />
          </section>
        </section>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

function HeaderCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <AvatarCard>
      <AvatarCard.BackgroundColor
        color={AVATAR_COLOR_BY_AVAILABILITY[fosterFamily.availability]}
      />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <FosterFamilyAvatar
            size="lg"
            availability={fosterFamily.availability}
          />
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <h1>{fosterFamily.displayName}</h1>
          </AvatarCard.FirstLine>
        </AvatarCard.Lines>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </AvatarCard.Content>
    </AvatarCard>
  );
}

function CommentsCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  if (fosterFamily.comments == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Commentaires privés</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={{
              pathname: Routes.fosterFamilies
                .id(fosterFamily.id)
                .edit.toString(),
              hash: ActionFormData.keys.comments,
            }}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <Markdown components={ARTICLE_COMPONENTS}>
          {fosterFamily.comments}
        </Markdown>
      </Card.Content>
    </Card>
  );
}

function FosterAnimalsCard() {
  const { fosterFamily, fosterAnimalCount, fosterAnimals } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {fosterAnimalCount === 0
            ? "Animaux accueillis"
            : fosterAnimalCount > 1
              ? `${fosterAnimalCount} animaux accueillis`
              : "1 animal accueillis"}
        </Card.Title>

        {fosterAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: AnimalSearchParams.format({
                  fosterFamiliesId: new Set([fosterFamily.id]),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={fosterAnimalCount > 0}>
        {fosterAnimalCount === 0 ? (
          <Empty
            isCompact
            icon="🏡"
            iconAlt="Maison avec jardin"
            title="Aucun animal accueilli"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <>
            {fosterFamily.availability === FosterFamilyAvailability.AVAILABLE &&
            fosterFamily.availabilityExpirationDate != null ? (
              <span className="grid grid-cols-1 px-1.5 md:px-2">
                <InlineHelper variant="warning" icon="icon-clock-solid">
                  {fosterFamily.displayName} ne sera plus disponible à partir du{" "}
                  {DateTime.fromISO(fosterFamily.availabilityExpirationDate)
                    .plus({ days: 1 })
                    .toLocaleString(DateTime.DATE_FULL)}
                  .
                </InlineHelper>
              </span>
            ) : null}

            <ul className="flex">
              {fosterAnimals.map((animal) => (
                <li
                  key={animal.id}
                  className="flex flex-none flex-col first:pl-1 last:pr-1 md:first:pl-1 md:last:pr-1"
                >
                  <AnimalItem
                    animal={animal}
                    imageSizeMapping={{ default: "150px" }}
                    className="w-[160px] md:w-[170px]"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </Card.Content>
    </Card>
  );
}

function ActionCard() {
  const { fosterFamily, fosterAnimalCount } = useLoaderData<typeof loader>();
  const canDelete = fosterAnimalCount === 0;
  const fetcher = useFetcher<typeof action>();
  const [isHelperVisible, setIsHelperVisible] = useState(false);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Actions</Card.Title>
      </Card.Header>

      <Card.Content>
        {isHelperVisible ? (
          <InlineHelper
            variant="info"
            action={
              <button onClick={() => setIsHelperVisible(false)}>Fermer</button>
            }
          >
            La famille d’accueil ne peut être supprimée tant qu’elle a des
            animaux accueillis.
          </InlineHelper>
        ) : null}

        <Dialog>
          <Dialog.Trigger
            asChild
            onClick={
              canDelete
                ? undefined
                : (event) => {
                    // Don't open de dialog.
                    event.preventDefault();

                    setIsHelperVisible(true);
                  }
            }
          >
            <Action variant="secondary" color="red">
              <Action.Icon href="icon-trash-solid" />
              Supprimer
            </Action>
          </Dialog.Trigger>

          <Dialog.Content variant="alert">
            <Dialog.Header>Supprimer {fosterFamily.displayName}</Dialog.Header>

            <Dialog.Message>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong className="text-body-emphasis">
                {fosterFamily.displayName}
              </strong>
              {" "}?
              <br />
              L’action est irréversible.
            </Dialog.Message>

            <ErrorsInlineHelper errors={fetcher.data?.errors} />

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
