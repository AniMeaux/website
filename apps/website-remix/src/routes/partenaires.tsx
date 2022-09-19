import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { focusRingClassNames } from "~/core/focusRing";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { DynamicImage } from "~/dataDisplay/image";
import { Markdown, MarkdownProps } from "~/dataDisplay/markdown";
import { Partner, partners } from "~/partners/data";

type LoaderData = {
  partners: Partner[];
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ partners });
};

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Partenaires") });
};

export default function PartnersPage() {
  const { partners } = useLoaderData<LoaderData>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex">
        <h1
          className={cn(
            "text-title-hero-small text-center",
            "md:text-title-hero-large md:text-left"
          )}
        >
          Partenaires
        </h1>
      </header>

      {partners.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 grid-rows-[auto] gap-12 items-start",
              "xs:grid-cols-2",
              "md:grid-cols-3"
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

function PartnerItem({ partner }: { partner: LoaderData["partners"][number] }) {
  return (
    <li className="flex">
      <BaseLink
        to={partner.url}
        className={cn(
          "w-full rounded-bubble-md flex flex-col gap-3",
          focusRingClassNames()
        )}
      >
        <DynamicImage
          imageId={partner.image}
          alt={partner.name}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-md border border-gray-200 bg-white"
        />

        <div className="flex flex-col">
          <p className="text-title-item">{partner.name}</p>
          <p>
            <Markdown components={COMPONENTS}>{partner.description}</Markdown>
          </p>
        </div>
      </BaseLink>
    </li>
  );
}
