import { BaseLink } from "#core/baseLink.tsx";
import { cn } from "#core/classNames.ts";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import type { MarkdownProps } from "#core/dataDisplay/markdown.tsx";
import { Markdown } from "#core/dataDisplay/markdown.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { partners } from "#partners/data.server.ts";
import type { SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ partners });
}

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Partenaires") });
};

export default function Route() {
  const { partners } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex">
        <h1
          className={cn(
            "text-title-hero-small text-center",
            "md:text-title-hero-large md:text-left",
          )}
        >
          Partenaires
        </h1>
      </header>

      {partners.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 gap-12 items-start",
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
        className="group w-full rounded-bubble-md flex flex-col gap-3"
      >
        <DynamicImage
          imageId={partner.image}
          alt={partner.name}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-md border border-gray-200 bg-white"
        />

        <div className="flex flex-col">
          <p className="text-title-item transition-colors duration-100 ease-in-out group-hover:text-brandBlue">
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
