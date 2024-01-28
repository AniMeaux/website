import { getAllAnimalPictures } from "#animals/pictures/allPictures";
import { getAnimalDisplayName } from "#animals/profile/name";
import { Action } from "#core/actions";
import { BaseLink } from "#core/baseLink";
import { getErrorTitle } from "#core/dataDisplay/errorPage";
import { DynamicImage } from "#core/dataDisplay/image";
import { db } from "#core/db.server";
import type { RouteHandle } from "#core/handles";
import { assertIsDefined } from "#core/isDefined.server";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/pageTitle";
import { prisma } from "#core/prisma.server";
import { NotFoundResponse } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server";
import { Icon } from "#generated/icon";
import { DownloadPictureLink } from "#routes/downloads.picture.$id/link";
import { cn } from "@animeaux/core";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const handle: RouteHandle = {
  htmlBackgroundColor: cn("bg-white bg-var-white"),
  isFullHeight: true,
};

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
  pictureId: zu.string().uuid(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw new NotFoundResponse();
  }

  const animal = await prisma.animal.findUnique({
    where: { id: paramsResult.data.id },
    select: {
      alias: true,
      avatar: true,
      id: true,
      name: true,
      pictures: true,
    },
  });

  assertIsDefined(animal);
  const allPictures = getAllAnimalPictures(animal);

  if (!allPictures.includes(paramsResult.data.pictureId)) {
    throw new NotFoundResponse();
  }

  return json({ animal, visiblePictureId: paramsResult.data.pictureId });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const animal = data?.animal;
  if (animal == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(`Photos de ${getAnimalDisplayName(animal)}`) }];
};

export default function Route() {
  const { animal, visiblePictureId } = useLoaderData<typeof loader>();
  const allPictures = getAllAnimalPictures(animal);
  const visiblePictureIndex = allPictures.indexOf(visiblePictureId);

  return (
    <main className="grid h-full w-full grid-cols-1 grid-rows-[auto_minmax(0px,1fr)_auto]">
      <header className="flex min-h-[50px] items-center justify-end pb-0.5 pt-safe-0.5 px-safe-1 md:min-h-[60px] md:pb-1 md:pt-safe-1 md:px-safe-2">
        <Action asChild variant="text">
          <DownloadPictureLink
            pictureId={visiblePictureId}
            fileName={`${getAnimalDisplayName(animal)} (${
              visiblePictureIndex + 1
            })`}
          >
            <Icon id="download" />
            Télécharger
          </DownloadPictureLink>
        </Action>
      </header>

      <div className="flex flex-col items-center justify-center">
        <DynamicImage
          imageId={visiblePictureId}
          alt={`Photo ${visiblePictureIndex + 1} de ${getAnimalDisplayName(
            animal,
          )}`}
          sizeMapping={{ default: "100vw" }}
          fallbackSize="2048"
          aspectRatio="none"
          background="none"
          className="max-h-full min-h-0 min-w-0 max-w-full"
        />
      </div>

      <footer className="flex justify-center pt-0.5 pb-safe-0.5 md:pt-1 md:pb-safe-1">
        <div className="grid max-w-full auto-cols-[60px] grid-flow-col justify-start gap-1 overflow-x-auto px-safe-1 scrollbars-none md:auto-cols-[80px] md:gap-2">
          {allPictures.map((pictureId, index) => (
            <BaseLink
              key={pictureId}
              to={Routes.animals
                .id(animal.id)
                .pictures.pictureId(pictureId)
                .toString()}
              replace
              className="flex aspect-4/3 rounded-0.5 transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
            >
              <DynamicImage
                imageId={pictureId}
                alt={`Photo ${index + 1} de ${getAnimalDisplayName(animal)}`}
                sizeMapping={{ md: "80px", default: "60px" }}
                fallbackSize="512"
                className={cn(
                  "w-full rounded-0.5 transition-opacity duration-100 ease-in-out",
                  pictureId === visiblePictureId ? "opacity-100" : "opacity-50",
                )}
              />
            </BaseLink>
          ))}
        </div>
      </footer>
    </main>
  );
}
