import { formatAge } from "@animeaux/shared";
import { AdoptionOption, Gender, Status, UserGroup } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { z } from "zod";
import { ADOPTION_OPTION_TRANSLATION } from "~/animals/adoption";
import { AgreementItem } from "~/animals/agreements";
import { AnimalAvatar } from "~/animals/avatar";
import { deleteAnimal } from "~/animals/db.server";
import { GENDER_ICON } from "~/animals/gender";
import { PICK_UP_REASON_TRANSLATION } from "~/animals/pickUp";
import { ActionFormData as ProfileActionFormData } from "~/animals/profile/form";
import { getAnimalDisplayName } from "~/animals/profile/name";
import { ActionFormData as SituationActionFormData } from "~/animals/situation/form";
import {
  formatNextVaccinationDate,
  hasPastVaccination,
  hasUpCommingSterilisation,
  hasUpCommingVaccination,
} from "~/animals/situation/health";
import { getSpeciesLabels, SPECIES_ICON } from "~/animals/species";
import { StatusBadge, StatusIcon, STATUS_TRANSLATION } from "~/animals/status";
import { Action, ProseInlineAction } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { Empty } from "~/core/dataDisplay/empty";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { InlineHelper } from "~/core/dataDisplay/helper";
import { DynamicImage } from "~/core/dataDisplay/image";
import { ItemList, SimpleItem } from "~/core/dataDisplay/item";
import { ARTICLE_COMPONENTS, Markdown } from "~/core/dataDisplay/markdown";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { AvatarCard } from "~/core/layout/avatarCard";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { Dialog } from "~/core/popovers/dialog";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { getLongLocation } from "~/fosterFamilies/location";
import { Icon } from "~/generated/icon";
import { theme } from "~/generated/theme";
import { UserAvatar } from "~/users/avatar";
import { hasGroups } from "~/users/groups";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const isCurrentUserAnimalAdmin = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
  ]);

  const animal = await prisma.animal.findUnique({
    where: { id: result.data },
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
      species: true,
      status: true,

      ...(isCurrentUserAnimalAdmin
        ? {
            comments: true,
            fosterFamily: {
              select: {
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
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return { title: getPageTitle(getAnimalDisplayName(animal)) };
};

export async function action({ request, params }: ActionArgs) {
  if (request.method.toLowerCase() !== "delete") {
    throw new NotFoundResponse();
  }

  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  try {
    await deleteAnimal(result.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundResponse();
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing aniaml.
  throw redirect("/animals/search");
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function Route() {
  const { canEdit } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
      <HeaderCard />

      <section className="grid grid-cols-1 gap-1 md:hidden">
        <aside className="flex flex-col gap-1">
          <SituationCard />
          <CommentsCard />
        </aside>

        <section className="flex flex-col gap-1">
          <ProfileCard />
          <PicturesCard />
          <DescriptionCard />
        </section>

        {canEdit ? (
          <aside className="flex flex-col">
            <ActionCard />
          </aside>
        ) : null}
      </section>

      <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <section className="md:flex md:flex-col md:gap-2">
          <ProfileCard />
          <PicturesCard />
          <DescriptionCard />
        </section>

        <aside className="md:flex md:flex-col md:gap-2">
          <SituationCard />
          <CommentsCard />
          {canEdit ? <ActionCard /> : null}
        </aside>
      </section>
    </PageLayout.Content>
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
            to={`./pictures/${animal.avatar}`}
            className="rounded-1 flex focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <AnimalAvatar animal={animal} loading="eager" size="xl" />
          </BaseLink>
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <Icon
                  id={GENDER_ICON[animal.gender]}
                  className={
                    animal.gender === Gender.FEMALE
                      ? "text-pink-500"
                      : "text-blue-500"
                  }
                />

                <h1>{animal.name}</h1>
              </div>

              <StatusBadge status={animal.status} />
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
            <BaseLink to="./edit/profile">Modifier</BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon id={SPECIES_ICON[animal.species]} />}>
            {getSpeciesLabels(animal)}
          </SimpleItem>

          <SimpleItem icon={<Icon id="cakeCandles" />}>
            {DateTime.fromISO(animal.birthdate).toLocaleString(
              DateTime.DATE_FULL
            )}{" "}
            ({formatAge(animal.birthdate)})
          </SimpleItem>

          {animal.iCadNumber != null ? (
            <SimpleItem icon={<Icon id="fingerprint" />}>
              I-CAD : {animal.iCadNumber}
            </SimpleItem>
          ) : null}
        </ItemList>

        <ul className="grid grid-cols-3 gap-1">
          <AgreementItem entity="cats" value={animal.isOkCats} />
          <AgreementItem entity="dogs" value={animal.isOkDogs} />
          <AgreementItem entity="babies" value={animal.isOkChildren} />
        </ul>
      </Card.Content>
    </Card>
  );
}

function SituationCard() {
  const { canEdit, animal, canSeeFosterFamilyDetails, canSeeManagerDetails } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>

        {canEdit ? (
          <Action asChild variant="text">
            <BaseLink to="./edit/situation">Modifier</BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        {hasUpCommingVaccination(animal) ? (
          <InlineHelper variant="warning" icon="syringe">
            Prochaine vaccination {formatNextVaccinationDate(animal)}.
          </InlineHelper>
        ) : null}

        {hasPastVaccination(animal) ? (
          <InlineHelper variant="error" icon="syringe">
            Une vaccination était prévue {formatNextVaccinationDate(animal)}.
            <br />
            Pensez à mettre à jour la prochaine date.
          </InlineHelper>
        ) : null}

        {hasUpCommingSterilisation(animal) ? (
          <InlineHelper variant="warning" icon="scissors">
            Stérilisation à prévoir.
          </InlineHelper>
        ) : null}

        <ItemList>
          {animal.manager != null ? (
            <SimpleItem icon={<UserAvatar user={animal.manager} />}>
              Est géré par{" "}
              {canSeeManagerDetails ? (
                <ProseInlineAction asChild>
                  <BaseLink to={`/users/${animal.manager.id}`}>
                    {animal.manager.displayName}
                  </BaseLink>
                </ProseInlineAction>
              ) : (
                <strong className="text-body-emphasis">
                  {animal.manager.displayName}
                </strong>
              )}
            </SimpleItem>
          ) : null}

          <SimpleItem icon={<StatusIcon status={animal.status} />}>
            Est{" "}
            <strong className="text-body-emphasis">
              {STATUS_TRANSLATION[animal.status]}
            </strong>
            {animal.status === Status.ADOPTED && animal.adoptionDate != null ? (
              <>
                {" "}
                depuis le{" "}
                <strong className="text-body-emphasis">
                  {DateTime.fromISO(animal.adoptionDate).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                </strong>
              </>
            ) : null}
            {animal.status === Status.ADOPTED &&
            animal.adoptionOption != null &&
            animal.adoptionOption !== AdoptionOption.UNKNOWN ? (
              <>
                {" "}
                (
                {ADOPTION_OPTION_TRANSLATION[
                  animal.adoptionOption
                ].toLowerCase()}
                )
              </>
            ) : null}
          </SimpleItem>

          {animal.fosterFamily != null ? (
            <DropdownMenu.Root>
              <SimpleItem
                icon={<FosterFamilyAvatar fosterFamily={animal.fosterFamily} />}
              >
                En FA chez{" "}
                <DropdownMenu.Trigger asChild>
                  <ProseInlineAction>
                    {animal.fosterFamily.displayName}
                  </ProseInlineAction>
                </DropdownMenu.Trigger>
              </SimpleItem>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  side="bottom"
                  sideOffset={theme.spacing[1]}
                  collisionPadding={theme.spacing[1]}
                  className="z-20 shadow-ambient rounded-1 w-[300px] bg-white p-1 flex flex-col gap-1"
                >
                  <div className="grid grid-cols-[auto,minmax(0px,1fr)] items-center gap-1">
                    <FosterFamilyAvatar
                      size="lg"
                      fosterFamily={animal.fosterFamily}
                    />
                    <div className="flex flex-col">
                      <span>{animal.fosterFamily.displayName}</span>
                    </div>
                  </div>

                  <DropdownMenu.Separator className="border-t border-gray-100" />

                  <ul className="flex flex-col">
                    <SimpleItem icon={<Icon id="phone" />}>
                      {animal.fosterFamily.phone}
                    </SimpleItem>
                    <SimpleItem icon={<Icon id="envelope" />}>
                      {animal.fosterFamily.email}
                    </SimpleItem>
                    <SimpleItem icon={<Icon id="locationDot" />}>
                      {getLongLocation(animal.fosterFamily)}
                    </SimpleItem>
                  </ul>

                  {canSeeFosterFamilyDetails ? (
                    <>
                      <DropdownMenu.Separator className="border-t border-gray-100" />
                      <DropdownMenu.Item asChild>
                        <BaseLink
                          to={`/foster-families/${animal.fosterFamily.id}`}
                          className="rounded-0.5 pr-1 grid grid-cols-[auto,minmax(0px,1fr)] items-center text-gray-500 text-left cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
                        >
                          <span className="w-4 h-4 flex items-center justify-center text-[20px]">
                            <Icon id="ellipsis" />
                          </span>

                          <span className="text-body-emphasis">
                            Voir plus d’informations
                          </span>
                        </BaseLink>
                      </DropdownMenu.Item>
                    </>
                  ) : null}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : null}

          {animal.isSterilized != null &&
          animal.isSterilizationMandatory != null ? (
            <SimpleItem icon={<Icon id="scissors" />}>
              {animal.isSterilized ? (
                <>
                  Est{" "}
                  <strong className="text-body-emphasis">
                    {animal.gender === Gender.FEMALE
                      ? "stérilisée"
                      : "stérilisé"}
                  </strong>
                </>
              ) : animal.isSterilizationMandatory ? (
                <>
                  N’est{" "}
                  <strong className="text-body-emphasis">
                    pas{" "}
                    {animal.gender === Gender.FEMALE
                      ? "stérilisée"
                      : "stérilisé"}
                  </strong>
                </>
              ) : (
                <>
                  Ne sera{" "}
                  <strong className="text-body-emphasis">
                    pas{" "}
                    {animal.gender === Gender.FEMALE
                      ? "stérilisée"
                      : "stérilisé"}
                  </strong>
                </>
              )}
            </SimpleItem>
          ) : null}

          {animal.nextVaccinationDate != null ? (
            <SimpleItem icon={<Icon id="syringe" />}>
              Prochaine vaccination le{" "}
              <strong className="text-body-emphasis">
                {DateTime.fromISO(animal.nextVaccinationDate).toLocaleString(
                  DateTime.DATE_FULL
                )}
              </strong>
            </SimpleItem>
          ) : null}

          <SimpleItem icon={<Icon id="handHoldingHeart" />}>
            {animal.gender === Gender.FEMALE
              ? "Prise en charge le"
              : "Pris en charge le"}{" "}
            <strong className="text-body-emphasis">
              {DateTime.fromISO(animal.pickUpDate).toLocaleString(
                DateTime.DATE_FULL
              )}
            </strong>
            {animal.pickUpLocation != null ? (
              <>
                <br />à{" "}
                <strong className="text-body-emphasis">
                  {animal.pickUpLocation}
                </strong>
              </>
            ) : null}
            <br />
            suite à{" "}
            <strong className="text-body-emphasis">
              {PICK_UP_REASON_TRANSLATION[animal.pickUpReason]}
            </strong>
          </SimpleItem>
        </ItemList>
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
                pathname: "./edit/situation",
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
              <Icon id="trash" />
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

              <fetcher.Form method="delete" className="flex">
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
    pathname: "./edit/profile",
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
          <Empty
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
            <BaseLink to="./edit/pictures">Modifier</BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1 justify-center md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:gap-2">
          {allPictures.map((pictureId, index) => (
            <BaseLink
              key={pictureId}
              to={`./pictures/${pictureId}`}
              className="aspect-4/3 rounded-0.5 flex transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <DynamicImage
                imageId={pictureId}
                alt={`Photo ${index + 1} de ${getAnimalDisplayName(animal)}`}
                sizes={{ md: "200px", default: "160px" }}
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
