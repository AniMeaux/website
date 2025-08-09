import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services.server.js";
import { PreviousEdition } from "#previous-editions/previous-edition";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { SectionPictures } from "./section-pictures";
import { SectionTitle } from "./section-title";

const ParamsSchema = zu.object({
  edition: zu.nativeEnum(PreviousEdition),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(ParamsSchema, params);

  return defer({
    edition: routeParams.edition,
    pictures: services.image.getAllImages(routeParams.edition),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? `Édition de ${data.edition}` : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionPictures />
    </>
  );
}
