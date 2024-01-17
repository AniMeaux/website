import { AnimalItem } from "#animals/item.tsx";
import { AnimalSearchParams } from "#animals/searchParams.ts";
import { SPECIES_TRANSLATION } from "#animals/species.tsx";
import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { ErrorsInlineHelper } from "#core/dataDisplay/errors.tsx";
import { InlineHelper } from "#core/dataDisplay/helper.tsx";
import { inferInstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { ItemList, SimpleItem } from "#core/dataDisplay/item.tsx";
import { ARTICLE_COMPONENTS, Markdown } from "#core/dataDisplay/markdown.tsx";
import { db } from "#core/db.server.ts";
import { NotFoundError, ReferencedError } from "#core/errors.server.ts";
import { assertIsDefined } from "#core/isDefined.server.ts";
import { joinReactNodes } from "#core/joinReactNodes.tsx";
import { AvatarCard } from "#core/layout/avatarCard.tsx";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { Dialog } from "#core/popovers/dialog.tsx";
import { prisma } from "#core/prisma.server.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { FosterFamilyAvatar } from "#fosterFamilies/avatar.tsx";
import { ActionFormData } from "#fosterFamilies/form.tsx";
import { getLongLocation } from "#fosterFamilies/location.tsx";
import { Icon } from "#generated/icon.tsx";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { promiseHash } from "remix-utils";

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw new NotFoundResponse();
  }

  const { fosterFamily, fosterAnimalCount, fosterAnimals } = await promiseHash({
    fosterFamily: prisma.fosterFamily.findUnique({
      where: { id: paramsResult.data.id },
      select: {
        address: true,
        city: true,
        comments: true,
        displayName: true,
        email: true,
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

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily;
  if (fosterFamily == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(fosterFamily.displayName) }];
};

export async function action({ request, params }: ActionArgs) {
  if (request.method.toUpperCase() !== "DELETE") {
    throw new NotFoundResponse();
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
    throw new NotFoundResponse();
  }

  try {
    await db.fosterFamily.delete(paramsResult.data.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundResponse();
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
    <PageLayout>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:hidden">
          <ProfileCard />
          <SituationCard />
          <CommentsCard />
          <FosterAnimalsCard />
          <ActionCard />
        </section>

        <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="md:flex md:flex-col md:gap-2">
            <ProfileCard />
            <FosterAnimalsCard />
          </section>

          <section className="md:flex md:flex-col md:gap-2">
            <SituationCard />
            <CommentsCard />
            <ActionCard />
          </section>
        </section>
      </PageLayout.Content>
    </PageLayout>
  );
}

function HeaderCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <AvatarCard>
      <AvatarCard.BackgroundColor color={inferInstanceColor(fosterFamily.id)} />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <FosterFamilyAvatar fosterFamily={fosterFamily} size="lg" />
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

function ProfileCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Profile</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon id="phone" />}>
            {fosterFamily.phone}
          </SimpleItem>
          <SimpleItem icon={<Icon id="envelope" />}>
            {fosterFamily.email}
          </SimpleItem>
          <SimpleItem icon={<Icon id="locationDot" />}>
            {getLongLocation(fosterFamily)}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function SituationCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon id="handHoldingHeart" />}>
            Peut accueillir :{" "}
            {fosterFamily.speciesToHost.length === 0 ? (
              <strong className="text-body-emphasis">Inconnu</strong>
            ) : (
              joinReactNodes(
                fosterFamily.speciesToHost.map((species) => (
                  <strong key={species} className="text-body-emphasis">
                    {SPECIES_TRANSLATION[species]}
                  </strong>
                )),
                ", ",
              )
            )}
          </SimpleItem>

          <SimpleItem icon={<Icon id="houseChimneyPaw" />}>
            {fosterFamily.speciesAlreadyPresent.length === 0 ? (
              "Aucun animal déjà présents"
            ) : (
              <>
                Sont déjà présents :{" "}
                {joinReactNodes(
                  fosterFamily.speciesAlreadyPresent.map((species) => (
                    <strong key={species} className="text-body-emphasis">
                      {SPECIES_TRANSLATION[species]}
                    </strong>
                  )),
                  ", ",
                )}
              </>
            )}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
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
                pathname: Routes.animals.search.toString(),
                search: AnimalSearchParams.stringify({
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
          <ul className="flex gap-1">
            {fosterAnimals.map((animal) => (
              <li
                key={animal.id}
                className="flex-none flex flex-col first:pl-1 last:pr-1 md:first:pl-2 md:last:pr-2"
              >
                <AnimalItem
                  animal={animal}
                  imageSizeMapping={{ default: "300px" }}
                  className="w-[150px]"
                />
              </li>
            ))}
          </ul>
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
              <Icon id="trash" />
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
