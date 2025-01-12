import { cloudinary } from "#core/cloudinary/cloudinary.server";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { PreviousEdition } from "#previous-editions/previous-edition";
import { zu } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { SectionPictures } from "./section-pictures";
import { SectionTitle } from "./section-title";

const ParamsSchema = zu.object({
  edition: zu.nativeEnum(PreviousEdition),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const result = ParamsSchema.safeParse(params);
  if (!result.success) {
    throw notFound();
  }

  return defer({
    edition: result.data.edition,
    pictures: cloudinary.previousEdition.findAllPictures(result.data.edition),
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
