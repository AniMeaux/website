import { BaseLink } from "#core/base-link";
import { DynamicImage } from "#core/data-display/image";
import { prisma } from "#core/db.server";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { cn } from "@animeaux/core";
import type { PressArticle } from "@animeaux/prisma/client";
import type { MetaFunction, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

export async function loader() {
  const pressArticles = await prisma.pressArticle.findMany({
    orderBy: { publicationDate: "desc" },
    select: {
      id: true,
      image: true,
      publicationDate: true,
      publisherName: true,
      title: true,
      url: true,
    },
  });

  return json({ pressArticles });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Articles de presse") });
};

export default function Route() {
  const { pressArticles } = useLoaderData<typeof loader>();

  return (
    <main className="flex w-full flex-col gap-12 px-page">
      <header className="flex">
        <h1
          className={cn(
            "text-center text-title-hero-small",
            "md:text-left md:text-title-hero-large",
          )}
        >
          Articles de presse
        </h1>
      </header>

      {pressArticles.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 items-start gap-12",
              "xs:grid-cols-2",
              "md:grid-cols-3",
            )}
          >
            {pressArticles.map((pressArticle) => (
              <PressArticleItem
                key={pressArticle.id}
                pressArticle={pressArticle}
              />
            ))}
          </ul>
        </section>
      ) : (
        <p
          className={cn("py-12 text-center text-gray-500", "md:px-30 md:py-40")}
        >
          Aucun article de presse pour l’instant.
        </p>
      )}
    </main>
  );
}

function PressArticleItem({
  pressArticle,
}: {
  pressArticle: SerializeFrom<
    Pick<
      PressArticle,
      "id" | "image" | "publicationDate" | "publisherName" | "title" | "url"
    >
  >;
}) {
  return (
    <li className="flex">
      <BaseLink
        to={pressArticle.url}
        className="group flex w-full flex-col gap-3 rounded-bubble-md"
      >
        {pressArticle.image == null ? (
          <DynamicImage
            imageId="press-articles/fallback_bwzzbv"
            alt={pressArticle.title}
            sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
            fallbackSize="512"
            loading="lazy"
            className="aspect-4/3 w-full flex-none rounded-bubble-md"
          />
        ) : (
          <img
            alt={pressArticle.title}
            src={pressArticle.image}
            loading="lazy"
            className="aspect-4/3 w-full flex-none bg-gray-100 object-cover rounded-bubble-md"
          />
        )}

        <div className="flex flex-col">
          <p className="text-gray-500 text-caption-default">
            {DateTime.fromISO(pressArticle.publicationDate).toLocaleString(
              DateTime.DATE_MED,
            )}
            {" • "}
            {pressArticle.publisherName}
          </p>

          <p className="transition-colors duration-100 ease-in-out text-title-item group-hover:text-brandBlue">
            {pressArticle.title}
          </p>
        </div>
      </BaseLink>
    </li>
  );
}
