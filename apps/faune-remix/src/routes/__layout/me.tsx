import { Prisma, UserGroup } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { actionClassName } from "~/core/action";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { getCurrentUser } from "~/core/currentUser.server";
import { AvatarColor, inferAvatarColor } from "~/core/dataDisplay/avatar";
import { Empty } from "~/core/dataDisplay/empty";
import { Helper } from "~/core/dataDisplay/helper";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { ActionConfirmationType, useActionConfirmation } from "~/core/params";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { GROUP_ICON, GROUP_TRANSLATION, hasGroups } from "~/users/groups";

const currentUserSelect = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    displayName: true,
    email: true,
    groups: true,
  },
});

type LoaderData = {
  currentUser: Prisma.UserGetPayload<typeof currentUserSelect>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const currentUser = await getCurrentUser(request, {
    select: currentUserSelect.select,
  });

  return json<LoaderData>({ currentUser });
};

export default function CurrentUserPage() {
  const { currentUser } = useLoaderData<LoaderData>();
  const isManager = hasGroups(currentUser, [UserGroup.ANIMAL_MANAGER]);

  return (
    <main className="w-full flex flex-col gap-1 md:max-w-[920px] md:gap-2">
      <EditSuccessHelper />
      <EditPasswordSuccessHelper />

      <Card className="sticky top-0">
        <div
          className={cn(
            "h-6 flex md:h-10",
            USER_BG_COLOR[inferAvatarColor(currentUser.id)]
          )}
        />

        <CardContent>
          <div className="relative pt-1 pl-9 grid grid-cols-[minmax(0px,1fr)_auto] items-start gap-1 md:pt-2 md:pl-10 md:gap-2">
            <UserAvatar
              user={currentUser}
              size="xl"
              className="absolute bottom-0 left-0 ring-5 ring-white"
            />

            <div className="grid grid-cols-1 gap-0.5">
              <h1 className="text-title-section-small md:text-title-section-large">
                {currentUser.displayName}
              </h1>
              <p className="text-body-emphasis text-gray-500">
                {currentUser.email}
              </p>
            </div>

            <BaseLink
              to="/me/edit-profile"
              className={actionClassName({ variant: "text" })}
            >
              Modifier
            </BaseLink>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(250px,1fr)_2fr] md:items-start md:gap-2">
        <section className="flex flex-col gap-1 md:gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Groupes</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="flex flex-col">
                {currentUser.groups.map((group) => (
                  <li
                    key={group}
                    className="p-0.5 grid grid-cols-[auto_minmax(0px,1fr)] items-start gap-1"
                  >
                    <span className="w-2 h-2 flex items-center justify-center text-gray-600">
                      <Icon id={GROUP_ICON[group]} />
                    </span>

                    <span>{GROUP_TRANSLATION[group]}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>

            <CardContent>
              <BaseLink
                to="/me/change-password"
                className={actionClassName({
                  variant: "secondary",
                  color: "gray",
                })}
              >
                Changer de mot de passe
              </BaseLink>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-1 md:gap-2">
          <Card>
            <CardHeader>
              <CardTitle>À votre charge</CardTitle>

              {isManager && (
                <BaseLink
                  to="/animals"
                  className={actionClassName({ variant: "text" })}
                >
                  Tout voir
                </BaseLink>
              )}
            </CardHeader>

            <CardContent>
              <Empty
                isCompact
                icon="🦤"
                iconAlt="Dodo bird"
                title="Aucun animal à votre charge"
                titleElementType="h3"
                message={
                  isManager ? (
                    "Pour l’instant ;)"
                  ) : (
                    <>
                      Seuls les membres du group{" "}
                      <strong className="text-body-emphasis">
                        {GROUP_TRANSLATION[UserGroup.ANIMAL_MANAGER]}
                      </strong>{" "}
                      peuvent avoir des animaux à leur charge.
                    </>
                  )
                }
              />
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}

const USER_BG_COLOR: Record<AvatarColor, string> = {
  blue: "bg-blue-50",
  gray: "bg-gray-50",
  green: "bg-green-50",
  red: "bg-red-50",
  yellow: "bg-yellow-50",
};

function EditSuccessHelper() {
  const { isVisible, clear } = useActionConfirmation(
    ActionConfirmationType.EDIT
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Helper variant="success" action={<button onClick={clear}>Fermer</button>}>
      Votre profile à bien été mis à jour.
    </Helper>
  );
}

function EditPasswordSuccessHelper() {
  const { isVisible, clear } = useActionConfirmation(
    ActionConfirmationType.EDIT_PASSWORD
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Helper variant="success" action={<button onClick={clear}>Fermer</button>}>
      Votre mot de passe à bien été changé.
    </Helper>
  );
}
