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
import {
  ActionFormData,
  AnimalProfileForm,
  animalSelect,
} from "~/animals/profileForm";
import { prisma } from "~/core/db.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import {
  ActionConfirmationSearchParams,
  ActionConfirmationType,
} from "~/core/searchParams";
import {
  assertCurrentUserHasGroups,
  getCurrentUser,
} from "~/currentUser/currentUser.server";

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
    throw new Response("Not found", { status: 404 });
  }

  const animal = await prisma.animal.findFirst({
    where: { id: result.data },
    select: animalSelect.select,
  });

  if (animal == null) {
    throw new Response("Not found", { status: 404 });
  }

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

  await prisma.animal.update({
    where: { id: formData.data.id },
    data: {
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
    },
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
