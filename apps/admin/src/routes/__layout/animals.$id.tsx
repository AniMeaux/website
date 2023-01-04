import { formatAge } from "@animeaux/shared";
import { AdoptionOption, Gender, Status, UserGroup } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import { createPath } from "history";
import { DateTime } from "luxon";
import { z } from "zod";
import { ADOPTION_OPTION_TRANSLATION } from "~/animals/adoption";
import { AgreementItem } from "~/animals/agreements";
import { AnimalAvatar } from "~/animals/avatar";
import { deleteAnimal } from "~/animals/db.server";
import { GENDER_ICON } from "~/animals/gender";
import { PICK_UP_REASON_TRANSLATION } from "~/animals/pickUp";
import { ActionFormData } from "~/animals/profile/form";
import { getAnimalDisplayName } from "~/animals/profile/name";
import { getSpeciesLabels, SPECIES_ICON } from "~/animals/species";
import { StatusBadge, StatusIcon, STATUS_TRANSLATION } from "~/animals/status";
import { actionClassName } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { ActionConfirmationHelper } from "~/core/dataDisplay/actionConfirmationHelper";
import { Empty } from "~/core/dataDisplay/empty";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { createCloudinaryUrl, DynamicImage } from "~/core/dataDisplay/image";
import { ARTICLE_COMPONENTS, Markdown } from "~/core/dataDisplay/markdown";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import {
  ActionConfirmationSearchParams,
  ActionConfirmationType,
} from "~/core/searchParams";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { hasGroups } from "~/users/groups";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
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

  const showAllInfo = hasGroups(currentUser, [
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
      comments: showAllInfo,
      description: true,
      fosterFamily: showAllInfo
        ? { select: { id: true, displayName: true } }
        : false,
      gender: true,
      iCadNumber: showAllInfo,
      id: true,
      isOkCats: true,
      isOkChildren: true,
      isOkDogs: true,
      isSterilized: true,
      manager: { select: { id: true, displayName: true } },
      name: true,
      pickUpDate: true,
      pickUpLocation: true,
      pickUpReason: true,
      pictures: true,
      species: true,
      status: true,
    },
  });

  assertIsDefined(animal);

  const canEdit = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return json({ canEdit, animal });
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
    select: { id: true, groups: true },
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

  throw redirect(
    createPath({
      pathname: "/animals",
      search: new ActionConfirmationSearchParams()
        .setConfirmation(ActionConfirmationType.DELETE)
        .toString(),
    })
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function AnimalProfilePage() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  return (
    <section className="w-full flex flex-col gap-1 md:gap-2">
      <ActionConfirmationHelper type={ActionConfirmationType.EDIT}>
        {animal.name} a bien été modifié.
      </ActionConfirmationHelper>

      <ActionConfirmationHelper type={ActionConfirmationType.CREATE}>
        {animal.name} a bien été créé.
      </ActionConfirmationHelper>

      <HeaderCard />

      <section className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <aside className="flex flex-col gap-1 md:hidden">
          <SituationCard />
        </aside>

        <main className="flex flex-col gap-1 md:gap-2">
          <ProfileCard />
          <PicturesCard />
          <DescriptionCard />
        </main>

        <aside className="hidden md:flex-col md:gap-2 md:flex">
          <SituationCard />
          {canEdit && <ActionCard />}
        </aside>

        {canEdit && (
          <aside className="flex flex-col md:hidden">
            <ActionCard />
          </aside>
        )}
      </section>
    </section>
  );
}

function HeaderCard() {
  const { cloudinaryName } = useConfig();
  const { canEdit, animal } = useLoaderData<typeof loader>();

  return (
    <Card>
      <div className="relative h-6 flex md:h-10">
        <span className="absolute top-0 left-0 w-full h-full backdrop-blur-3xl" />

        <img
          src={createCloudinaryUrl(cloudinaryName, animal.avatar, {
            size: "128",
            aspectRatio: "1:1",
          })}
          alt={animal.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      <CardContent>
        <div className="relative pt-1 pl-9 grid grid-cols-1 grid-flow-col gap-1 md:pt-2 md:pl-10 md:gap-2">
          <BaseLink
            to={`./pictures/${animal.avatar}`}
            className="absolute bottom-0 left-0 rounded-1 flex ring-5 ring-white focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <AnimalAvatar animal={animal} loading="eager" size="xl" />
          </BaseLink>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 text-title-section-small md:text-title-section-large">
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

            <p className="text-body-emphasis text-gray-500">
              {animal.alias ?? " "}
            </p>
          </div>

          {canEdit && (
            <BaseLink
              to="./edit-profile"
              className={actionClassName.standalone({ variant: "text" })}
            >
              Modifier
            </BaseLink>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>

        {canEdit && (
          <BaseLink
            to="./edit-profile"
            className={actionClassName.standalone({ variant: "text" })}
          >
            Modifier
          </BaseLink>
        )}
      </CardHeader>

      <CardContent>
        <ul className="flex-grow flex flex-col">
          <Item icon={<Icon id={SPECIES_ICON[animal.species]} />}>
            {getSpeciesLabels(animal)}
          </Item>

          <Item icon={<Icon id="cakeCandles" />}>
            {DateTime.fromISO(animal.birthdate).toLocaleString(
              DateTime.DATE_FULL
            )}{" "}
            ({formatAge(animal.birthdate)})
          </Item>

          <Item icon={<Icon id="scissors" />}>
            {animal.isSterilized ? "Est" : "N'est"}{" "}
            <strong className="text-body-emphasis">
              {animal.isSterilized ? "" : "pas "}
              {animal.gender === Gender.FEMALE ? "stérilisée" : "stérilisé"}
            </strong>
          </Item>

          {animal.iCadNumber != null && (
            <Item icon={<Icon id="fingerprint" />}>
              I-CAD : {animal.iCadNumber}
            </Item>
          )}
        </ul>

        <ul className="grid grid-cols-3 gap-1">
          <AgreementItem entity="cats" value={animal.isOkCats} />
          <AgreementItem entity="dogs" value={animal.isOkDogs} />
          <AgreementItem entity="babies" value={animal.isOkChildren} />
        </ul>
      </CardContent>
    </Card>
  );
}

function SituationCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Situation</CardTitle>

        {canEdit && (
          <BaseLink
            to="./edit-situation"
            className={actionClassName.standalone({ variant: "text" })}
          >
            Modifier
          </BaseLink>
        )}
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          {animal.manager != null && (
            <Item icon={<UserAvatar user={animal.manager} />}>
              Est géré par{" "}
              <strong className="text-body-emphasis">
                {animal.manager.displayName}
              </strong>
            </Item>
          )}

          <Item icon={<StatusIcon status={animal.status} />}>
            Est{" "}
            <strong className="text-body-emphasis">
              {STATUS_TRANSLATION[animal.status]}
            </strong>
            {animal.status === Status.ADOPTED &&
              animal.adoptionDate != null && (
                <>
                  {" "}
                  depuis le{" "}
                  <strong className="text-body-emphasis">
                    {DateTime.fromISO(animal.adoptionDate).toLocaleString(
                      DateTime.DATE_FULL
                    )}
                  </strong>
                </>
              )}
            {animal.status === Status.ADOPTED &&
              animal.adoptionOption != null &&
              animal.adoptionOption !== AdoptionOption.UNKNOWN && (
                <>
                  {" "}
                  (
                  {ADOPTION_OPTION_TRANSLATION[
                    animal.adoptionOption
                  ].toLowerCase()}
                  )
                </>
              )}
          </Item>

          {animal.fosterFamily != null && (
            <Item
              icon={<FosterFamilyAvatar fosterFamily={animal.fosterFamily} />}
            >
              En FA chez{" "}
              <strong className="text-body-emphasis">
                {animal.fosterFamily.displayName}
              </strong>
            </Item>
          )}

          <Item icon={<Icon id="handHoldingHeart" />}>
            {animal.gender === Gender.FEMALE
              ? "Prise en charge le"
              : "Pris en charge le"}{" "}
            <strong className="text-body-emphasis">
              {DateTime.fromISO(animal.pickUpDate).toLocaleString(
                DateTime.DATE_FULL
              )}
            </strong>
            {animal.pickUpLocation != null && (
              <>
                <br />à{" "}
                <strong className="text-body-emphasis">
                  {animal.pickUpLocation}
                </strong>
              </>
            )}
            <br />
            suite à{" "}
            <strong className="text-body-emphasis">
              {PICK_UP_REASON_TRANSLATION[animal.pickUpReason]}
            </strong>
          </Item>

          {animal.comments != null && (
            <Item icon={<Icon id="comment" />}>
              <Markdown components={ARTICLE_COMPONENTS}>
                {animal.comments}
              </Markdown>
            </Item>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

function ActionCard() {
  const { animal } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>

      <CardContent>
        <Dialog.Root>
          <Dialog.Trigger
            className={actionClassName.standalone({
              variant: "secondary",
              color: "red",
            })}
          >
            <Icon id="trash" />
            Supprimer
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay
              className={cn(
                // Use absolute instead of fixed to avoid performances issues
                // when mobile browser's height change due to scroll.
                "absolute",
                "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20"
              )}
            />

            <Dialog.Content className="fixed top-[10vh] left-1 right-1 z-30 shadow-ambient bg-white rounded-1 p-2 flex flex-col gap-2 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[550px]">
              <header className="grid grid-cols-[auto_minmax(0px,1fr)] gap-1">
                <Icon
                  id="circleExclamation"
                  className="text-[20px] text-red-400"
                />

                <Dialog.Title className="text-title-section-small md:text-title-section-large">
                  Supprimer {getAnimalDisplayName(animal)}
                </Dialog.Title>
              </header>

              <p>
                Êtes-vous sûr de vouloir supprimer{" "}
                <strong className="text-body-emphasis">
                  {getAnimalDisplayName(animal)}
                </strong>
                 ?
                <br />
                L’action est irréversible.
              </p>

              <footer className="flex items-center justify-between gap-2">
                <Dialog.Close
                  className={actionClassName.standalone({
                    variant: "text",
                    color: "gray",
                  })}
                >
                  Annuler
                </Dialog.Close>

                <Form method="delete" className="flex">
                  <button
                    type="submit"
                    className={actionClassName.standalone({
                      variant: "secondary",
                      color: "red",
                    })}
                  >
                    Oui, supprimer
                  </button>
                </Form>
              </footer>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </CardContent>
    </Card>
  );
}

function DescriptionCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();

  const editLink: BaseLinkProps["to"] = {
    pathname: "./edit-profile",
    hash: ActionFormData.keys.description,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>

        {canEdit && animal.description != null && (
          <BaseLink
            to={editLink}
            className={actionClassName.standalone({ variant: "text" })}
          >
            Modifier
          </BaseLink>
        )}
      </CardHeader>

      <CardContent>
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
                <BaseLink
                  to={editLink}
                  className={actionClassName.standalone({
                    variant: "secondary",
                  })}
                >
                  Ajouter
                </BaseLink>
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
      </CardContent>
    </Card>
  );
}

function PicturesCard() {
  const { animal, canEdit } = useLoaderData<typeof loader>();
  const allPictures = [animal.avatar].concat(animal.pictures);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos</CardTitle>

        {canEdit && (
          <BaseLink
            to="./edit-pictures"
            className={actionClassName.standalone({ variant: "text" })}
          >
            Modifier
          </BaseLink>
        )}
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  );
}

function Item({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="w-full rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col">
      <span className="w-4 h-4 flex items-center justify-center text-gray-600 text-[20px]">
        {icon}
      </span>

      <div className="py-1">{children}</div>
    </li>
  );
}
