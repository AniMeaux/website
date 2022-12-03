import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { createPath } from "history";
import { z } from "zod";
import { updateAnimalProfile } from "~/animals/profile/db.server";
import { ActionFormData, AnimalProfileForm } from "~/animals/profile/form";
import { prisma } from "~/core/db.server";
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

  const animal = await prisma.animal.findUnique({
    where: { id: result.data },
    select: {
      alias: true,
      birthdate: true,
      breed: { select: { id: true, name: true } },
      color: { select: { id: true, name: true } },
      description: true,
      gender: true,
      iCadNumber: true,
      id: true,
      isOkCats: true,
      isOkChildren: true,
      isOkDogs: true,
      isSterilized: true,
      name: true,
      species: true,
      status: true,
    },
  });

  assertIsDefined(animal);

  return json({ animal });
}

export const meta: MetaFunction<typeof loader> = ({ data: { animal } }) => {
  let displayName = animal.name;
  if (animal.alias != null) {
    displayName += ` (${animal.alias})`;
  }

  return { title: getPageTitle(displayName) };
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const rawFormData = await request.formData();
  const formData = ActionFormData.schema.safeParse(
    Object.fromEntries(rawFormData.entries())
  );

  if (!formData.success) {
    return json({ errors: formData.error.flatten() }, { status: 400 });
  }

  await updateAnimalProfile(formData.data.id, {
    species: formData.data.species,
    name: formData.data.name,
    alias: formData.data.alias || null,
    birthdate: formData.data.birthdate,
    description: formData.data.description || null,
    gender: formData.data.gender,
    iCadNumber: formData.data.iCadNumber || null,
    isOkCats: formData.data.isOkCats,
    isOkChildren: formData.data.isOkChildren,
    isOkDogs: formData.data.isOkDogs,
    isSterilized: formData.data.isSterilized,
  });

  throw redirect(
    createPath({
      pathname: `/animals/${formData.data.id}`,
      search: new ActionConfirmationSearchParams()
        .setConfirmation(ActionConfirmationType.EDIT)
        .toString(),
    })
  );
}

export default function AnimalEditProfilePage() {
  const { animal } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="w-full flex flex-col md:max-w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Modifier {animal.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <AnimalProfileForm animal={animal} errors={actionData?.errors} />
        </CardContent>
      </Card>
    </main>
  );
}
