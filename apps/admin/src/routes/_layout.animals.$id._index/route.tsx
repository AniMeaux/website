import { AgreementItem } from "#animals/agreements";
import { AnimalAvatar } from "#animals/avatar";
import { GENDER_ICON } from "#animals/gender";
import { ActionFormData as ProfileActionFormData } from "#animals/profile/form";
import { getAnimalDisplayName } from "#animals/profile/name";
import { ActionFormData as SituationActionFormData } from "#animals/situation/form";
import { SPECIES_ICON, getSpeciesLabels } from "#animals/species";
import { StatusBadge } from "#animals/status";
import { Action } from "#core/actions";
import type { BaseLinkProps } from "#core/base-link";
import { BaseLink } from "#core/base-link";
import { SimpleEmpty } from "#core/data-display/empty";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
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
import { Icon } from "#generated/icon";
import { hasGroups } from "#users/groups";
import { cn, formatAge } from "@animeaux/core";
import { Gender, UserGroup } from "@animeaux/prisma/client";
import { zu } from "@animeaux/zod-utils";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
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
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const result = ParamsSchema.safeParse(params);
  if (!result.success) {
    throw notFound();
  }

  const isCurrentUserAnimalAdmin = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
  ]);

  const canSeeComments = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const animal = await prisma.animal.findUnique({
    where: { id: result.data.id },
    select: {
      adoptionDate: true,
      adoptionOption: true,
      alias: true,
      avatar: true,
      birthdate: true,
      breed: { select: { name: true } },
      color: { select: { name: true } },
      description: true,
      gender: true,
      id: true,
      isOkCats: true,
      isOkChildren: true,
      isOkDogs: true,
      manager: { select: { id: true, displayName: true } },
      name: true,
      pickUpDate: true,
      pickUpLocation: true,
      pickUpReason: true,
      pictures: true,
      screeningFiv: true,
      screeningFelv: true,
      species: true,
      status: true,

      ...(isCurrentUserAnimalAdmin
        ? {
            comments: canSeeComments,
            diagnosis: true,
            fosterFamily: {
              select: {
                availability: true,
                address: true,
                city: true,
                displayName: true,
                email: true,
                id: true,
                phone: true,
                zipCode: true,
              },
            },
            iCadNumber: true,
            isSterilizationMandatory: true,
            isSterilized: true,
            isVaccinationMandatory: true,
            nextVaccinationDate: true,
          }
        : {}),
    },
  });

  assertIsDefined(animal);

  const canEdit = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const canSeeFosterFamilyDetails = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const canSeeManagerDetails = hasGroups(currentUser, [UserGroup.ADMIN]);

  return json({
    animal,
    canEdit,
    canSeeFosterFamilyDetails,
    canSeeManagerDetails,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const animal = data?.animal;
  if (animal == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(getAnimalDisplayName(animal)) }];
};

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "DELETE") {
    throw notFound();
  }

  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const result = zu.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw notFound();
  }

  try {
    await db.animal.delete(result.data, currentUser);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing aniaml.
  throw redirect(Routes.animals.toString());
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { canEdit } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:hidden">
          <ProfileCard />
          <AgreementsCard />
          <SituationCard />
          <CommentsCard />
          <DescriptionCard />
          <PicturesCard />
          {canEdit ? <ActionCard /> : null}
        </section>

        <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="md:flex md:flex-col md:gap-2">
            <ProfileCard />
            <AgreementsCard />
            <DescriptionCard />
            <PicturesCard />
          </section>

          <aside className="md:flex md:flex-col md:gap-2">
            <SituationCard />
            <CommentsCard />
            {canEdit ? <ActionCard /> : null}
          </aside>
        </section>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

function HeaderCard() {
  const { animal } = useLoaderData<typeof loader>();

  return (
    <AvatarCard>
      <AvatarCard.BackgroundImage
        imageId={animal.avatar}
        imageAlt={animal.name}
      />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <BaseLink
            to={Routes.animals
              .id(animal.id)
              .pictures.pictureId(animal.avatar)
              .toString()}
            className="flex rounded-1 focus-visible:focus-spaced-blue-400"
          >
            <AnimalAvatar animal={animal} loading="eager" size="lg" />
          </BaseLink>
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <div className="grid grid-cols-[auto_minmax(0px,auto)_auto] items-start justify-start gap-0.5">
              <div
                className={cn(
                  "flex h-2 items-center",
                  animal.gender === Gender.FEMALE
                    ? "text-pink-500"
                    : "text-blue-500",
                )}
              >
                <Icon href={GENDER_ICON[animal.gender].solid} />
              </div>

              <h1>{animal.name}</h1>

              <StatusBadge status={animal.status} className="ml-0.5" />
            </div>
          </AvatarCard.FirstLine>

          {animal.alias != null ? (
            <AvatarCard.SecondLine>
              <p>{animal.alias}</p>
            </AvatarCard.SecondLine>
          ) : null}
        </AvatarCard.Lines>
      </AvatarCard.Content>
    </AvatarCard>
  );
}

function ProfileCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Profile</Card.Title>

        {canEdit ? (
          <Action asChild variant="text">
            <BaseLink to={Routes.animals.id(animal.id).edit.profile.toString()}>
              Modifier
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon href={SPECIES_ICON[animal.species]} />}>
            {getSpeciesLabels(animal)}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-cake-candles-solid" />}>
            {DateTime.fromISO(animal.birthdate).toLocaleString(
              DateTime.DATE_FULL,
            )}{" "}
            ({formatAge(animal.birthdate)})
          </SimpleItem>

          {animal.iCadNumber != null ? (
            <SimpleItem icon={<Icon href="icon-fingerprint-solid" />}>
              I-CAD : {animal.iCadNumber}
            </SimpleItem>
          ) : null}
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function AgreementsCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Ententes</Card.Title>

        {canEdit ? (
          <Action asChild variant="text">
            <BaseLink to={Routes.animals.id(animal.id).edit.profile.toString()}>
              Modifier
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        <ul className="grid grid-cols-3 gap-1">
          <AgreementItem entity="cats" value={animal.isOkCats} />
          <AgreementItem entity="dogs" value={animal.isOkDogs} />
          <AgreementItem entity="babies" value={animal.isOkChildren} />
        </ul>
      </Card.Content>
    </Card>
  );
}

function CommentsCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  if (animal.comments == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Commentaires privés</Card.Title>

        {canEdit ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals
                  .id(animal.id)
                  .edit.situation.toString(),
                hash: SituationActionFormData.keys.comments,
              }}
            >
              Modifier
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        <Markdown components={ARTICLE_COMPONENTS}>{animal.comments}</Markdown>
      </Card.Content>
    </Card>
  );
}

function ActionCard() {
  const { animal } = useLoaderData<typeof loader>();
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
            <Dialog.Header>
              Supprimer {getAnimalDisplayName(animal)}
            </Dialog.Header>

            <Dialog.Message>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong className="text-body-emphasis">
                {getAnimalDisplayName(animal)}
              </strong>
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

function DescriptionCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  const editLink: BaseLinkProps["to"] = {
    pathname: Routes.animals.id(animal.id).edit.profile.toString(),
    hash: ProfileActionFormData.keys.description,
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Description</Card.Title>

        {canEdit && animal.description != null ? (
          <Action asChild variant="text">
            <BaseLink to={editLink}>Modifier</BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        {animal.description == null ? (
          <SimpleEmpty
            isCompact
            titleElementType="h3"
            icon="📝"
            iconAlt="Memo"
            title="Aucune description"
            message="Ajoutez une description pour faciliter l’adoption de l’animal."
            action={
              canEdit ? (
                <Action asChild variant="secondary">
                  <BaseLink to={editLink}>Ajouter</BaseLink>
                </Action>
              ) : null
            }
          />
        ) : (
          <article>
            <Markdown components={ARTICLE_COMPONENTS}>
              {animal.description}
            </Markdown>
          </article>
        )}
      </Card.Content>
    </Card>
  );
}

function PicturesCard() {
  const { animal, canEdit } = useLoaderData<typeof loader>();
  const allPictures = [animal.avatar].concat(animal.pictures);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Photos</Card.Title>

        {canEdit ? (
          <Action asChild variant="text">
            <BaseLink
              to={Routes.animals.id(animal.id).edit.pictures.toString()}
            >
              Modifier
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] justify-center gap-1 md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:gap-2">
          {allPictures.map((pictureId, index) => (
            <BaseLink
              key={pictureId}
              to={Routes.animals
                .id(animal.id)
                .pictures.pictureId(pictureId)
                .toString()}
              className="flex aspect-4/3 rounded-0.5 transition-transform duration-100 ease-in-out active:scale-95 focus-visible:focus-spaced-blue-400"
            >
              <DynamicImage
                imageId={pictureId}
                alt={`Photo ${index + 1} de ${getAnimalDisplayName(animal)}`}
                sizeMapping={{ md: "200px", default: "160px" }}
                fallbackSize="512"
                className="w-full rounded-0.5"
              />
            </BaseLink>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
