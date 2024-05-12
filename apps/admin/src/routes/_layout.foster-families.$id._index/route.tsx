import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { NotFoundError, ReferencedError } from "#core/errors.server";
import { assertIsDefined } from "#core/is-defined.server";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { NotFoundResponse } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { CommentsCard } from "./comments-card";
import { ContactCard } from "./contact-card";
import { HeaderCard } from "./header-card";
import { HouseholdCard } from "./household-card";
import { SituationCard } from "./situation-card";
import { SpeciesToHostCard } from "./species-to-host-card";

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
    throw new NotFoundResponse();
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

export type action = typeof action;

export async function action({ request, params }: ActionFunctionArgs) {
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
      <HeaderCard />

      <PageLayout.Content className="grid grid-cols-1 items-start gap-1 md:grid-cols-[minmax(250px,1fr)_minmax(0px,2fr)] md:gap-2">
        <aside className="grid grid-cols-1 gap-1 md:gap-2">
          <SituationCard />
          <ContactCard />
        </aside>

        <section className="grid grid-cols-1 gap-1 md:gap-2">
          <CommentsCard />
          <SpeciesToHostCard />
          <HouseholdCard />
        </section>
      </PageLayout.Content>
    </PageLayout>
  );
}
