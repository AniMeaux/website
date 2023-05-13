import { UserGroup } from "@prisma/client";
import { ActionArgs, json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { prisma } from "~/core/db.server";
import { EmailAlreadyUsedError, NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { LockMyselfError, updateUser } from "~/users/db.server";
import { ActionFormData, UserForm } from "~/users/form";
import { GROUP_TRANSLATION } from "~/users/groups";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const user = await prisma.user.findUnique({
    where: { id: result.data },
    select: { displayName: true, email: true, groups: true },
  });

  assertIsDefined(user);

  return json({ user });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const user = data?.user;
  if (user == null) {
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return { title: getPageTitle(`Modifier ${user.displayName}`) };
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true, id: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const idResult = z.string().uuid().safeParse(params["id"]);
  if (!idResult.success) {
    throw new NotFoundResponse();
  }

  const formData = zfd
    .formData(ActionFormData.schema)
    .safeParse(await request.formData());

  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await updateUser(
      idResult.data,
      {
        displayName: formData.data.displayName,
        email: formData.data.email,
        groups: formData.data.groups,
        temporaryPassword: formData.data.temporaryPassword,
      },
      currentUser
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["L’utilisateur est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 }
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
        { status: 400 }
      );
    }

    if (error instanceof LockMyselfError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              groups: [
                `Vous ne pouvez pas vous retirer du groupe ${
                  GROUP_TRANSLATION[UserGroup.ADMIN]
                }.`,
              ],
            },
          },
        },
        { status: 400 }
      );
    }

    throw error;
  }

  return json<ActionData>({ redirectTo: `/users/${idResult.data}` });
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Modifier {user.displayName}</Card.Title>
          </Card.Header>

          <Card.Content>
            <UserForm defaultUser={user} fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}
