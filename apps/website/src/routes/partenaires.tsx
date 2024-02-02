import { BaseLink } from "#core/base-link";
import { DynamicImage } from "#core/data-display/image";
import type { MarkdownProps } from "#core/data-display/markdown";
import { Markdown } from "#core/data-display/markdown";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { partners } from "#partners/data.server";
import { cn } from "@animeaux/core";
import type { MetaFunction, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ partners });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Partenaires") });
};

export default function Route() {
  const { partners } = useLoaderData<typeof loader>();

  return (
    <main className="flex w-full flex-col gap-12 px-page">
      <header className="flex">
        <h1
          className={cn(
            "text-center text-title-hero-small",
            "md:text-left md:text-title-hero-large",
          )}
        >
          Partenaires
        </h1>
      </header>

      {partners.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 items-start gap-12",
              "xs:grid-cols-2",
              "md:grid-cols-3",
            )}
          >
            {partners.map((partner) => (
              <PartnerItem key={partner.id} partner={partner} />
            ))}
          </ul>
        </section>
      ) : (
        <p
          className={cn("py-12 text-center text-gray-500", "md:px-30 md:py-40")}
        >
          Aucun partenaire pour l’instant.
        </p>
      )}
    </main>
  );
}

export const COMPONENTS: MarkdownProps["components"] = {
  strong: ({ children }) => (
    <strong className="text-body-emphasis">{children}</strong>
  ),
};

function PartnerItem({
  partner,
}: {
  partner: SerializeFrom<typeof loader>["partners"][number];
}) {
  return (
    <li className="flex">
      <BaseLink
        to={partner.url}
        className="group flex w-full flex-col gap-3 rounded-bubble-md"
      >
        <DynamicImage
          imageId={partner.image}
          alt={partner.name}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="aspect-4/3 w-full flex-none border border-gray-200 bg-white rounded-bubble-md"
        />

        <div className="flex flex-col">
          <p className="transition-colors duration-100 ease-in-out text-title-item group-hover:text-brandBlue">
            {partner.name}
          </p>
          <p>
            <Markdown components={COMPONENTS}>{partner.description}</Markdown>
          </p>
        </div>
      </BaseLink>
    </li>
  );
}
