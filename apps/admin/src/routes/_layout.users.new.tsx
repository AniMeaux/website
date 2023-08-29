import { ErrorPage } from "#core/dataDisplay/errorPage.tsx";
import { db } from "#core/db.server.ts";
import { EmailAlreadyUsedError } from "#core/errors.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { MissingPasswordError } from "#users/db.server.ts";
import { ActionFormData, UserForm } from "#users/form.tsx";
import { UserGroup } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import type { z } from "zod";
import { zfd } from "zod-form-data";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  return new Response("Ok");
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Nouvel utilisateur") }];
};

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const formData = zfd
    .formData(ActionFormData.schema)
    .safeParse(await request.formData());

  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const userId = await db.user.create({
      displayName: formData.data.displayName,
      email: formData.data.email,
      groups: formData.data.groups,
      temporaryPassword: formData.data.temporaryPassword,
    });

    throw redirect(Routes.users.id(userId).toString());
  } catch (error) {
    if (error instanceof MissingPasswordError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              temporaryPassword: ["Veuillez entrer un mot de passe"],
            },
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof EmailAlreadyUsedError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: { email: ["L’email est déjà utilisé"] },
          },
        },
        { status: 400 },
      );
    }

    throw error;
  }
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const fetcher = useFetcher<typeof action>();

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Nouvel utilisateur</Card.Title>
          </Card.Header>

          <Card.Content>
            <UserForm fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}
