import { AnimalAge } from "@animeaux/shared";
import { Species } from "@prisma/client";
import { LoaderArgs, MetaFunction, redirect } from "@remix-run/node";
import { getPath } from "~/controllers/searchForm";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage, getErrorTitle } from "~/dataDisplay/errorPage";

export async function loader({ params }: LoaderArgs) {
  const redirectTo = REDIRECTIONS[`/${params["*"]}`];
  if (redirectTo != null) {
    throw redirect(redirectTo, 301);
  }

  throw new Response("Not found", { status: 404 });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
};

/**
 * By using a splat route we can still use the root's loader data in a 404 page.
 * Other error pages (500) will be displayed by a degraded error page.
 *
 * @see https://remix.run/docs/en/v1/guides/routing#splats
 */
export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return null;
}

const REDIRECTIONS: Record<string, string> = {
  "/adopt": "/adoption",
  "/adopt/bird": getPath({ species: Species.BIRD }),
  "/adopt/cat": getPath({ species: Species.CAT }),
  "/adopt/cat/adult": getPath({ species: Species.CAT, age: AnimalAge.ADULT }),
  "/adopt/cat/junior": getPath({ species: Species.CAT, age: AnimalAge.JUNIOR }),
  "/adopt/cat/senior": getPath({ species: Species.CAT, age: AnimalAge.SENIOR }),
  "/adopt/dog": getPath({ species: Species.DOG }),
  "/adopt/dog/adult": getPath({ species: Species.DOG, age: AnimalAge.ADULT }),
  "/adopt/dog/junior": getPath({ species: Species.DOG, age: AnimalAge.JUNIOR }),
  "/adopt/dog/senior": getPath({ species: Species.DOG, age: AnimalAge.SENIOR }),
  "/adopt/reptile": getPath({ species: Species.REPTILE }),
  "/adopt/rodent": getPath({ species: Species.RODENT }),
  "/adopt/rodent/adult": getPath({
    species: Species.RODENT,
    age: AnimalAge.ADULT,
  }),
  "/adopt/rodent/senior": getPath({
    species: Species.RODENT,
    age: AnimalAge.SENIOR,
  }),
  "/saved": "/sauves",
  "/adoption-conditions": "/conditions-d-adoption",
  "/foster-families": "/devenir-famille-d-accueil",
  "/volunteers": "/devenir-benevole",
  "/donation": "/faire-un-don",
  "/support/found": "/signaler-un-animal-errant",
  "/support/abuse": "/informer-d-un-acte-de-maltraitance",
  "/support/abandon": "/abandonner-votre-animal",
  "/event": "/evenements",
  "/past-events": "/evenements/passes",
  "/partners": "/partenaires",
};
