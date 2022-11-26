import { formatAge } from "@animeaux/shared";
import { AdoptionOption, Gender, Status, UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { AgreementItem } from "~/animals/agreements";
import { GENDER_ICON } from "~/animals/gender";
import { PICK_UP_REASON_TRANSLATION } from "~/animals/pickUp";
import { ActionFormData } from "~/animals/profileForm";
import { SPECIES_ICON, SPECIES_TRANSLATION } from "~/animals/species";
import {
  ADOPTION_OPTION_TRANSLATION,
  StatusBadge,
  StatusIcon,
  STATUS_TRANSLATION,
} from "~/animals/status";
import { actionClassName } from "~/core/action";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { Empty } from "~/core/dataDisplay/empty";
import { Helper } from "~/core/dataDisplay/helper";
import { createCloudinaryUrl, DynamicImage } from "~/core/dataDisplay/image";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  PARAGRAPH_COMPONENTS,
} from "~/core/dataDisplay/markdown";
import { prisma } from "~/core/db.server";
import { isDefined } from "~/core/isDefined";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import {
  ActionConfirmationType,
  useActionConfirmation,
} from "~/core/searchParams";
import {
  assertCurrentUserHasGroups,
  getCurrentUser,
} from "~/currentUser/currentUser.server";
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
  ]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new Response("Not found", { status: 404 });
  }

  const animal = await prisma.animal.findFirst({
    where: { id: result.data },
    select: {
      adoptionDate: true,
      adoptionOption: true,
      alias: true,
      avatar: true,
      birthdate: true,
      breed: { select: { name: true } },
      color: { select: { name: true } },
      comments: true,
      description: true,
      fosterFamily: { select: { id: true, displayName: true } },
      gender: true,
      iCadNumber: true,
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

  if (animal == null) {
    throw new Response("Not found", { status: 404 });
  }

  const canEdit = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return json({ canEdit, animal });
}

export const meta: MetaFunction<typeof loader> = ({ data: { animal } }) => {
  let displayName = animal.name;
  if (animal.alias != null) {
    displayName += ` (${animal.alias})`;
  }

  return { title: getPageTitle(displayName) };
};

export default function AnimalProfilePage() {
  const { canEdit } = useLoaderData<typeof loader>();

  return (
    <section className="w-full flex flex-col gap-1 md:gap-2">
      <EditSuccessHelper />

      <HeaderCard />

      <section className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(250px,1fr)_minmax(0px,2fr)] md:items-start md:gap-2">
        <aside className="flex flex-col gap-1 md:gap-2">
          <ProfileCard />
          <SituationCard />

          {canEdit && (
            <div className="hidden md:flex md:flex-col">
              <ActionCard />
            </div>
          )}
        </aside>

        <main className="flex flex-col gap-1 md:gap-2">
          <DescriptionCard />
          <PicturesCard />
        </main>

        {canEdit && (
          <aside className="flex flex-col md:hidden">
            <ActionCard />
          </aside>
        )}
      </section>
    </section>
  );
}

function EditSuccessHelper() {
  const { animal } = useLoaderData<typeof loader>();
  const { isVisible, clear } = useActionConfirmation(
    ActionConfirmationType.EDIT
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Helper variant="success" action={<button onClick={clear}>Fermer</button>}>
      {animal.name} à bien été modifié.
    </Helper>
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
          <DynamicImage
            loading="eager"
            imageId={animal.avatar}
            alt={animal.name}
            fallbackSize="512"
            sizes={{ default: "80px" }}
            aspectRatio="1:1"
            className="absolute bottom-0 left-0 w-8 aspect-square rounded-1 ring-5 ring-white"
          />

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
              className={actionClassName({ variant: "text" })}
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

  const speciesLabels = [
    SPECIES_TRANSLATION[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ].filter(isDefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>

        {canEdit && (
          <BaseLink
            to="./edit-profile"
            className={actionClassName({ variant: "text" })}
          >
            Modifier
          </BaseLink>
        )}
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          <Item icon={<Icon id={SPECIES_ICON[animal.species]} />}>
            {speciesLabels.join(" • ")}
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
            to="./edit"
            className={actionClassName({ variant: "text" })}
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
            {animal.status === Status.ADOPTED && animal.adoptionDate != null && (
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
              <Markdown components={PARAGRAPH_COMPONENTS}>
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>

      <CardContent>
        <button
          className={actionClassName({ variant: "secondary", color: "red" })}
        >
          <Icon id="trash" />
          Supprimer
        </button>
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
            className={actionClassName({ variant: "text" })}
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
                  className={actionClassName({ variant: "secondary" })}
                >
                  Ajouter
                </BaseLink>
              ) : null
            }
          />
        ) : (
          <Markdown components={ARTICLE_COMPONENTS}>
            {animal.description}
          </Markdown>
        )}
      </CardContent>
    </Card>
  );
}

function PicturesCard() {
  const { canEdit, animal } = useLoaderData<typeof loader>();
  const allPictures = [animal.avatar].concat(animal.pictures);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos</CardTitle>

        {canEdit && (
          <BaseLink
            to="./edit"
            className={actionClassName({ variant: "text" })}
          >
            Modifier
          </BaseLink>
        )}
      </CardHeader>

      <CardContent>
        <div
          ref={scrollContainerRef}
          onScroll={(event) => {
            setVisibleIndex(
              Math.round(
                event.currentTarget.scrollLeft / event.currentTarget.clientWidth
              )
            );
          }}
          className="overflow-auto snap-x snap-mandatory scrollbars-none scroll-smooth min-w-0 rounded-1 flex"
        >
          {allPictures.map((pictureId, index) => (
            <DynamicImage
              key={pictureId}
              imageId={pictureId}
              alt={`Photo ${index + 1} de ${animal.name}`}
              sizes={{ md: "66vw", default: "100vw" }}
              fallbackSize="2048"
              className="snap-center w-full min-w-0 h-full min-h-0 aspect-4/3 flex-none"
            />
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1 justify-center md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:gap-2">
          {allPictures.map((pictureId, index) => (
            <button
              key={pictureId}
              onClick={() => {
                invariant(
                  scrollContainerRef.current != null,
                  "scrollContainerRef should be set"
                );

                scrollContainerRef.current.scrollTo(
                  index * scrollContainerRef.current.clientWidth,
                  0
                );
              }}
              className="aspect-4/3 rounded-0.5 flex transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <DynamicImage
                imageId={pictureId}
                alt={`Photo ${index + 1} de ${animal.name}`}
                sizes={{ md: "200px", default: "160px" }}
                fallbackSize="512"
                className={cn(
                  "w-full aspect-4/3 rounded-0.5 transition-opacity duration-100 ease-in-out",
                  {
                    "opacity-50": visibleIndex !== index,
                    "opacity-100": visibleIndex === index,
                  }
                )}
              />
            </button>
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
