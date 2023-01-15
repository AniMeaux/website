import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import { SPECIES_TRANSLATION } from "~/animals/species";
import { actionClassName } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { AvatarColor, inferAvatarColor } from "~/core/dataDisplay/avatar";
import { Empty } from "~/core/dataDisplay/empty";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { Helper } from "~/core/dataDisplay/helper";
import { Item } from "~/core/dataDisplay/item";
import { ARTICLE_COMPONENTS, Markdown } from "~/core/dataDisplay/markdown";
import { prisma } from "~/core/db.server";
import { NotFoundError, ReferencedError } from "~/core/errors.server";
import { FormErrors } from "~/core/formElements/formErrors";
import { assertIsDefined } from "~/core/isDefined.server";
import { joinReactNodes } from "~/core/joinReactNodes";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { PageContent, PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import {
  Dialog,
  DialogActions,
  DialogCloseAction,
  DialogConfirmAction,
  DialogHeader,
  DialogMessage,
  DialogRoot,
  DialogTrigger,
} from "~/core/popovers/dialog";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { deleteFosterFamily } from "~/fosterFamilies/db.server";
import { ActionFormData } from "~/fosterFamilies/form";
import { getLongLocation } from "~/fosterFamilies/location";
import { Icon } from "~/generated/icon";

export async function loader({ request, params }: LoaderArgs) {
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

  const [fosterFamily, fosterAnimalCount, fosterAnimals] = await Promise.all([
    prisma.fosterFamily.findUnique({
      where: { id: result.data },
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

    prisma.animal.count({ where: { fosterFamilyId: result.data } }),

    prisma.animal.findMany({
      where: { fosterFamilyId: result.data },
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
        species: true,
        status: true,
      },
    }),
  ]);

  assertIsDefined(fosterFamily);

  return json({ fosterFamily, fosterAnimalCount, fosterAnimals });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily;
  if (fosterFamily == null) {
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return { title: getPageTitle(fosterFamily.displayName) };
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
    await deleteFosterFamily(result.data);
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
        { status: 400 }
      );
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing foster family.
  throw redirect("/foster-families");
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function FosterFamilyProfilePage() {
  return (
    <PageLayout>
      <PageContent className="flex flex-col gap-1 md:gap-2">
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
      </PageContent>
    </PageLayout>
  );
}

function HeaderCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <div
        className={cn(
          "h-6 flex md:h-10",
          FOSTER_FAMILY_BG_COLOR[inferAvatarColor(fosterFamily.id)]
        )}
      />

      <CardContent>
        <div className="relative pt-1 pl-9 grid grid-cols-1 grid-flow-col gap-1 md:pt-2 md:pl-10 md:gap-2">
          <FosterFamilyAvatar
            fosterFamily={fosterFamily}
            size="xl"
            className="absolute bottom-0 left-0 ring-5 ring-white"
          />

          <div className="flex flex-col gap-0.5">
            <h1 className="text-title-section-small md:text-title-section-large">
              {fosterFamily.displayName}
            </h1>

            {/* To make sure we have the right height. */}
            <div> </div>
          </div>

          <BaseLink
            to="./edit"
            className={actionClassName.standalone({ variant: "text" })}
          >
            Modifier
          </BaseLink>
        </div>
      </CardContent>
    </Card>
  );
}

const FOSTER_FAMILY_BG_COLOR: Record<AvatarColor, string> = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  red: "bg-red-50",
  yellow: "bg-yellow-50",
};

function ProfileCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>

        <BaseLink
          to="./edit"
          className={actionClassName.standalone({ variant: "text" })}
        >
          Modifier
        </BaseLink>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          <Item icon={<Icon id="phone" />}>{fosterFamily.phone}</Item>
          <Item icon={<Icon id="envelope" />}>{fosterFamily.email}</Item>
          <Item icon={<Icon id="locationDot" />}>
            {getLongLocation(fosterFamily)}
          </Item>
        </ul>
      </CardContent>
    </Card>
  );
}

function SituationCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Situation</CardTitle>

        <BaseLink
          to="./edit"
          className={actionClassName.standalone({ variant: "text" })}
        >
          Modifier
        </BaseLink>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          <Item icon={<Icon id="handHoldingHeart" />}>
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
                ", "
              )
            )}
          </Item>

          <Item icon={<Icon id="houseChimneyPaw" />}>
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
                  ", "
                )}
              </>
            )}
          </Item>
        </ul>
      </CardContent>
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
      <CardHeader>
        <CardTitle>Commentaires privés</CardTitle>

        <BaseLink
          to={{ pathname: "./edit", hash: ActionFormData.keys.comments }}
          className={actionClassName.standalone({ variant: "text" })}
        >
          Modifier
        </BaseLink>
      </CardHeader>

      <CardContent>
        <Markdown components={ARTICLE_COMPONENTS}>
          {fosterFamily.comments}
        </Markdown>
      </CardContent>
    </Card>
  );
}

function FosterAnimalsCard() {
  const { fosterFamily, fosterAnimalCount, fosterAnimals } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {fosterAnimalCount === 0
            ? "Animaux accueillis"
            : fosterAnimalCount > 1
            ? `${fosterAnimalCount} animaux accueillis`
            : "1 animal accueillis"}
        </CardTitle>

        {fosterAnimalCount > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals/search",
              search: new AnimalSearchParams()
                .setFosterFamiliesId([fosterFamily.id])
                .toString(),
            }}
            className={actionClassName.standalone({ variant: "text" })}
          >
            Tout voir
          </BaseLink>
        ) : null}
      </CardHeader>

      <CardContent hasHorizontalScroll={fosterAnimalCount > 0}>
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
                  imageSizes={{ default: "300px" }}
                  className="w-[150px]"
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
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
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>

      <CardContent>
        {isHelperVisible ? (
          <Helper
            isCompact
            variant="info"
            action={
              <button onClick={() => setIsHelperVisible(false)}>Fermer</button>
            }
          >
            La famille d’accueil ne peut être supprimée tant qu’elle a des
            animaux accueillis.
          </Helper>
        ) : null}

        <DialogRoot>
          <DialogTrigger
            onClick={
              canDelete
                ? undefined
                : (event) => {
                    // Don't open de dialog.
                    event.preventDefault();

                    setIsHelperVisible(true);
                  }
            }
            className={actionClassName.standalone({
              variant: "secondary",
              color: "red",
            })}
          >
            <Icon id="trash" />
            Supprimer
          </DialogTrigger>

          <Dialog variant="alert">
            <DialogHeader>Supprimer {fosterFamily.displayName}</DialogHeader>

            <DialogMessage>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong className="text-body-emphasis">
                {fosterFamily.displayName}
              </strong>
              {" "}?
              <br />
              L’action est irréversible.
            </DialogMessage>

            <FormErrors errors={fetcher.data?.errors ?? []} />

            <DialogActions>
              <DialogCloseAction>Annuler</DialogCloseAction>

              <fetcher.Form method="delete" className="flex">
                <DialogConfirmAction type="submit">
                  Oui, supprimer
                </DialogConfirmAction>
              </fetcher.Form>
            </DialogActions>
          </Dialog>
        </DialogRoot>
      </CardContent>
    </Card>
  );
}
