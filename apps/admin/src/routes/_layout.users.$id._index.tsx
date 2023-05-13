import { Prisma, User, UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { promiseHash } from "remix-utils";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import {
  ACTIVE_ANIMAL_STATUS,
  NON_ACTIVE_ANIMAL_STATUS,
} from "~/animals/status";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Empty } from "~/core/dataDisplay/empty";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { ErrorsInlineHelper } from "~/core/dataDisplay/errors";
import { BlockHelper, InlineHelper } from "~/core/dataDisplay/helper";
import { inferInstanceColor } from "~/core/dataDisplay/instanceColor";
import { ItemList, SimpleItem } from "~/core/dataDisplay/item";
import { toRoundedRelative } from "~/core/dates";
import { prisma } from "~/core/db.server";
import { NotFoundError, ReferencedError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { AvatarCard } from "~/core/layout/avatarCard";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { Dialog } from "~/core/popovers/dialog";
import { BadRequestResponse, NotFoundResponse } from "~/core/response.server";
import { createActionData, ensureBoolean } from "~/core/schemas";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import {
  DeleteMyselfError,
  deleteUser,
  DisableMyselfError,
  setUserIsDisabled,
} from "~/users/db.server";
import { GROUP_ICON, GROUP_TRANSLATION, hasGroups } from "~/users/groups";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const managedAnimalsWhere: Prisma.AnimalWhereInput = {
    managerId: result.data,
    status: { in: ACTIVE_ANIMAL_STATUS },
  };

  const nonActiveManagedAnimalsWhere: Prisma.AnimalWhereInput = {
    managerId: result.data,
    status: { in: NON_ACTIVE_ANIMAL_STATUS },
  };

  const {
    user,
    managedAnimalCount,
    managedAnimals,
    nonActiveManagedAnimalCount,
    nonActiveManagedAnimals,
  } = await promiseHash({
    user: prisma.user.findUnique({
      where: { id: result.data },
      select: {
        id: true,
        displayName: true,
        email: true,
        groups: true,
        isDisabled: true,
        lastActivityAt: true,
      },
    }),

    managedAnimalCount: prisma.animal.count({ where: managedAnimalsWhere }),

    managedAnimals: prisma.animal.findMany({
      where: managedAnimalsWhere,
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
        name: true,
        nextVaccinationDate: true,
        species: true,
        status: true,
      },
    }),

    nonActiveManagedAnimalCount: prisma.animal.count({
      where: nonActiveManagedAnimalsWhere,
    }),

    nonActiveManagedAnimals: prisma.animal.findMany({
      where: nonActiveManagedAnimalsWhere,
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
        name: true,
        nextVaccinationDate: true,
        species: true,
        status: true,
      },
    }),
  });

  assertIsDefined(user);

  return json({
    currentUser,
    user,
    managedAnimalCount,
    managedAnimals,
    nonActiveManagedAnimalCount,
    nonActiveManagedAnimals,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const user = data?.user;
  if (user == null) {
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return { title: getPageTitle(user.displayName) };
};

const DisableActionFormData = createActionData(
  z.object({ isDisabled: z.preprocess(ensureBoolean, z.boolean()) })
);

export async function action({ request, params }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  if (request.method.toUpperCase() === "DELETE") {
    return await actionDelete({ currentUser, userId: result.data });
  }

  return await actionDisable({ currentUser, request, userId: result.data });
}

type ActionData = {
  errors?: string[];
};

async function actionDelete({
  currentUser,
  userId,
}: {
  currentUser: Pick<User, "id">;
  userId: User["id"];
}) {
  try {
    await deleteUser(userId, currentUser);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundResponse();
    }

    if (error instanceof DeleteMyselfError) {
      throw new BadRequestResponse();
    }

    if (error instanceof ReferencedError) {
      return json<ActionData>(
        {
          errors: [
            "L’utilisateur ne peut être supprimé tant qu’il a des animaux gérés ou à sa charge.",
          ],
        },
        { status: 400 }
      );
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing user.
  throw redirect("/users");
}

async function actionDisable({
  request,
  currentUser,
  userId,
}: Pick<ActionArgs, "request"> & {
  currentUser: Pick<User, "id">;
  userId: User["id"];
}) {
  const formData = zfd
    .formData(DisableActionFormData.schema)
    .safeParse(await request.formData());

  if (!formData.success) {
    throw new BadRequestResponse();
  }

  try {
    await setUserIsDisabled(userId, currentUser, formData.data.isDisabled);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundResponse();
    }

    if (error instanceof DisableMyselfError) {
      throw new BadRequestResponse();
    }

    throw error;
  }

  return json<ActionData>({});
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        {user.isDisabled ? (
          <BlockHelper variant="warning" icon="ban">
            {user.displayName} est actuellement bloqué.
          </BlockHelper>
        ) : null}

        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:hidden">
          <ActivityCard />
          <GroupsCard />
          <ManagedAnimalsCard />
          <NonActiveManagedAnimalsCard />
          <ActionsCard />
        </section>

        <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="md:flex md:flex-col md:gap-2">
            <ManagedAnimalsCard />
            <NonActiveManagedAnimalsCard />
          </section>

          <section className="md:flex md:flex-col md:gap-2">
            <ActivityCard />
            <GroupsCard />
            <ActionsCard />
          </section>
        </section>
      </PageLayout.Content>
    </PageLayout>
  );
}

function HeaderCard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <AvatarCard>
      <AvatarCard.BackgroundColor color={inferInstanceColor(user.id)} />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <UserAvatar user={user} size="xl" />
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <h1>{user.displayName}</h1>
          </AvatarCard.FirstLine>
          <AvatarCard.SecondLine>
            <p>{user.email}</p>
          </AvatarCard.SecondLine>
        </AvatarCard.Lines>

        <Action asChild variant="text">
          <BaseLink to="./edit">Modifier</BaseLink>
        </Action>
      </AvatarCard.Content>
    </AvatarCard>
  );
}

function ActivityCard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Activité</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon id="wavePulse" />}>
            {user.lastActivityAt == null ? (
              "Aucune activité"
            ) : (
              <>
                Actif{" "}
                <strong className="text-body-emphasis">
                  {toRoundedRelative(user.lastActivityAt)}
                </strong>
              </>
            )}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function GroupsCard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Groupes</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          {user.groups.map((group) => (
            <SimpleItem key={group} icon={<Icon id={GROUP_ICON[group]} />}>
              {GROUP_TRANSLATION[group]}
            </SimpleItem>
          ))}
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ManagedAnimalsCard() {
  const { user, managedAnimalCount, managedAnimals } =
    useLoaderData<typeof loader>();
  const isManager = hasGroups(user, [UserGroup.ANIMAL_MANAGER]);

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {managedAnimalCount === 0
            ? "À sa charge"
            : managedAnimalCount > 1
            ? `${managedAnimalCount} animaux à sa charge`
            : "1 animal à sa charge"}
        </Card.Title>

        {managedAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: "/animals/search",
                search: new AnimalSearchParams()
                  .setStatuses(ACTIVE_ANIMAL_STATUS)
                  .setManagersId([user.id])
                  .toString(),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={managedAnimalCount > 0}>
        {managedAnimalCount === 0 ? (
          <Empty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal à sa charge"
            titleElementType="h3"
            message={
              isManager ? (
                "Pour l’instant ;)"
              ) : (
                <>
                  Seuls les membres du groupe{" "}
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
      </Card.Content>
    </Card>
  );
}

function NonActiveManagedAnimalsCard() {
  const { user, nonActiveManagedAnimalCount, nonActiveManagedAnimals } =
    useLoaderData<typeof loader>();
  const isManager = hasGroups(user, [UserGroup.ANIMAL_MANAGER]);

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {nonActiveManagedAnimalCount === 0
            ? "Animaux gérés et sortis"
            : nonActiveManagedAnimalCount > 1
            ? `${nonActiveManagedAnimalCount} animaux gérés et sortis`
            : "1 animal géré et sorti"}
        </Card.Title>

        {nonActiveManagedAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: "/animals/search",
                search: new AnimalSearchParams()
                  .setStatuses(NON_ACTIVE_ANIMAL_STATUS)
                  .setManagersId([user.id])
                  .toString(),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={nonActiveManagedAnimalCount > 0}>
        {nonActiveManagedAnimalCount === 0 ? (
          <Empty
            isCompact
            icon="📭"
            iconAlt="Boîte aux lettres ouverte avec drapeau abaissé"
            title="Aucun animal géré et sorti"
            titleElementType="h3"
            message={
              isManager ? (
                "Pour l’instant ;)"
              ) : (
                <>
                  Seuls les membres du groupe{" "}
                  <strong className="text-body-emphasis">
                    {GROUP_TRANSLATION[UserGroup.ANIMAL_MANAGER]}
                  </strong>{" "}
                  peuvent gérer des animaux.
                </>
              )
            }
          />
        ) : (
          <ul className="flex gap-1">
            {nonActiveManagedAnimals.map((animal) => (
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
      </Card.Content>
    </Card>
  );
}

function ActionsCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Actions</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-1">
          <ActionDisable />
          <ActionDelete />
        </div>
      </Card.Content>
    </Card>
  );
}

function ActionDisable() {
  const { currentUser, user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const done = fetcher.state === "idle" && fetcher.type === "done";
  useEffect(() => {
    if (done) {
      setIsDialogOpened(false);
    }
  }, [done]);

  const [isHelperVisible, setIsHelperVisible] = useState(false);
  const canDisable = user.id !== currentUser.id;

  return (
    <>
      {isHelperVisible ? (
        <InlineHelper
          variant="info"
          action={
            <button onClick={() => setIsHelperVisible(false)}>Fermer</button>
          }
        >
          Vous ne pouvez pas vous bloquer.
        </InlineHelper>
      ) : null}

      <Dialog open={isDialogOpened} onOpenChange={setIsDialogOpened}>
        <Dialog.Trigger
          asChild
          onClick={
            canDisable
              ? undefined
              : (event) => {
                  // Don't open de dialog.
                  event.preventDefault();

                  setIsHelperVisible(true);
                }
          }
        >
          <Action variant="secondary" color="orange">
            <Icon id="ban" />
            {user.isDisabled ? "Débloquer" : "Bloquer"}
          </Action>
        </Dialog.Trigger>

        <Dialog.Content variant="warning">
          <Dialog.Header>
            {user.isDisabled ? "Débloquer" : "Bloquer"} {user.displayName}
          </Dialog.Header>

          <Dialog.Message>
            Êtes-vous sûr de vouloir {user.isDisabled ? "débloquer" : "bloquer"}{" "}
            <strong className="text-body-emphasis">{user.displayName}</strong>
            {" "}?
          </Dialog.Message>

          <Dialog.Actions>
            <Dialog.CloseAction>Annuler</Dialog.CloseAction>

            <fetcher.Form method="POST" className="flex">
              <Dialog.ConfirmAction
                type="submit"
                name={DisableActionFormData.keys.isDisabled}
                value={String(!user.isDisabled)}
              >
                Oui, {user.isDisabled ? "débloquer" : "bloquer"}
              </Dialog.ConfirmAction>
            </fetcher.Form>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

function ActionDelete() {
  const { currentUser, user, managedAnimalCount, nonActiveManagedAnimalCount } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [isHelperVisible, setIsHelperVisible] = useState(false);
  const isCurrentUser = user.id === currentUser.id;
  const hasManagedAnimals =
    managedAnimalCount > 0 || nonActiveManagedAnimalCount > 0;
  const canDelete = !isCurrentUser && !hasManagedAnimals;

  return (
    <>
      {isHelperVisible ? (
        <InlineHelper
          variant="info"
          action={
            <button onClick={() => setIsHelperVisible(false)}>Fermer</button>
          }
        >
          {isCurrentUser
            ? "Vous ne pouvez pas vous supprimer."
            : hasManagedAnimals
            ? "L’utilisateur ne peut être supprimé tant qu’il a des animaux gérés ou à sa charge."
            : null}
        </InlineHelper>
      ) : null}

      <Dialog>
        <Dialog.Trigger
          asChild
          onClick={
            canDelete
              ? undefined
              : (event) => {
                  // Don't open de dialog.
                  event.preventDefault();

                  setIsHelperVisible(true);
                }
          }
        >
          <Action variant="secondary" color="red">
            <Icon id="trash" />
            Supprimer
          </Action>
        </Dialog.Trigger>

        <Dialog.Content variant="alert">
          <Dialog.Header>Supprimer {user.displayName}</Dialog.Header>

          <Dialog.Message>
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong className="text-body-emphasis">{user.displayName}</strong>
            {" "}?
            <br />
            L’action est irréversible.
          </Dialog.Message>

          <ErrorsInlineHelper errors={fetcher.data?.errors} />

          <Dialog.Actions>
            <Dialog.CloseAction>Annuler</Dialog.CloseAction>

            <fetcher.Form method="DELETE" className="flex">
              <Dialog.ConfirmAction type="submit">
                Oui, supprimer
              </Dialog.ConfirmAction>
            </fetcher.Form>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
