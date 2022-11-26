import { UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AnimalItem } from "~/animals/item";
import { actionClassName } from "~/core/action";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { getCurrentUser } from "~/core/currentUser.server";
import { AvatarColor, inferAvatarColor } from "~/core/dataDisplay/avatar";
import { Empty } from "~/core/dataDisplay/empty";
import { Helper } from "~/core/dataDisplay/helper";
import { prisma } from "~/core/db.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import {
  ActionConfirmationType,
  useActionConfirmation,
} from "~/core/searchParams";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { GROUP_ICON, GROUP_TRANSLATION, hasGroups } from "~/users/groups";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: {
      id: true,
      displayName: true,
      email: true,
      groups: true,
    },
  });

  const managedAnimals = await prisma.animal.findMany({
    take: 5,
    orderBy: { pickUpDate: "desc" },
    where: { managerId: currentUser.id },
    select: {
      id: true,
      avatar: true,
      name: true,
      alias: true,
      gender: true,
      status: true,
    },
  });

  return json({ currentUser, managedAnimals });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Mon profil") };
};

export default function CurrentUserPage() {
  const { currentUser, managedAnimals } = useLoaderData<typeof loader>();
  const isManager = hasGroups(currentUser, [UserGroup.ANIMAL_MANAGER]);

  return (
    <section className="w-full flex flex-col gap-1 md:gap-2">
      <EditSuccessHelper />
      <EditPasswordSuccessHelper />

      <Card>
        <div
          className={cn(
            "h-6 flex md:h-10",
            USER_BG_COLOR[inferAvatarColor(currentUser.id)]
          )}
        />

        <CardContent>
          <div className="relative pt-1 pl-9 grid grid-cols-1 grid-flow-col gap-1 md:pt-2 md:pl-10 md:gap-2">
            <UserAvatar
              user={currentUser}
              size="xl"
              className="absolute bottom-0 left-0 ring-5 ring-white"
            />

            <div className="flex flex-col gap-0.5">
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

      <section className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(250px,1fr)_minmax(0px,2fr)] md:items-start md:gap-2">
        <aside className="flex flex-col gap-1 md:gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Groupes</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="flex flex-col">
                {currentUser.groups.map((group) => (
                  <li
                    key={group}
                    className="grid grid-cols-[auto_minmax(0px,1fr)] items-start"
                  >
                    <span className="w-4 h-4 flex items-center justify-center text-gray-600">
                      <Icon id={GROUP_ICON[group]} />
                    </span>

                    <span className="py-1">{GROUP_TRANSLATION[group]}</span>
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
        </aside>

        <main className="flex flex-col gap-1 md:gap-2">
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

            <CardContent hasHorizontalScroll={managedAnimals.length > 0}>
              {managedAnimals.length === 0 ? (
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
              ) : (
                <ul className="flex gap-1">
                  {managedAnimals.map((animal) => (
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
        </main>
      </section>
    </section>
  );
}

const USER_BG_COLOR: Record<AvatarColor, string> = {
  blue: "bg-blue-50",
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
      Votre profil à bien été mis à jour.
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
