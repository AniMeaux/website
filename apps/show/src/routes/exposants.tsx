import { BaseLink } from "#/core/baseLink";
import { cn } from "#/core/classNames";
import { createSocialMeta } from "#/core/meta";
import { getPageTitle } from "#/core/pageTitle";
import { DynamicImage } from "#/dataDisplay/image";
import { exhibitors } from "#/exhibitors/data";
import { EXHIBITOR_CATEGORY_TRANSLATIONS } from "#/exhibitors/translations";
import { json, MetaFunction, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ exhibitors });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Exposants") });
};

export default function ExhibitorsPage() {
  const { exhibitors } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex flex-col">
        <h1
          className={cn(
            "text-title-hero-small text-center",
            "md:flex-1 md:text-title-hero-large md:text-left"
          )}
        >
          Exposants
        </h1>
      </header>

      {exhibitors.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 gap-12 items-start",
              "xs:grid-cols-2",
              "md:grid-cols-3"
            )}
          >
            {exhibitors.map((exhibitor) => (
              <ExhibitorItem key={exhibitor.id} exhibitor={exhibitor} />
            ))}
          </ul>
        </section>
      ) : (
        <p
          className={cn("py-12 text-center text-gray-500", "md:px-30 md:py-40")}
        >
          La liste des exposants sera transmise ultérieurement.
        </p>
      )}
    </main>
  );
}

function ExhibitorItem({
  exhibitor,
}: {
  exhibitor: SerializeFrom<typeof loader>["exhibitors"][number];
}) {
  return (
    <li className="flex">
      <BaseLink
        to={exhibitor.url}
        className="group w-full rounded-bubble-md flex flex-col gap-3"
      >
        <DynamicImage
          imageId={exhibitor.image}
          alt={exhibitor.name}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-md border border-gray-200 bg-white"
        />

        <div className="flex flex-col">
          <p className="text-caption-default text-gray-500">
            {EXHIBITOR_CATEGORY_TRANSLATIONS[exhibitor.category]}
          </p>

          <p className="text-title-item transition-colors duration-100 ease-in-out group-hover:text-brandBlue">
            {exhibitor.name}
          </p>
        </div>
      </BaseLink>
    </li>
  );
}
