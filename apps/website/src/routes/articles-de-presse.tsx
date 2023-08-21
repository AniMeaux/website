import { BaseLink } from "#core/baseLink.tsx";
import { cn } from "#core/classNames.ts";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { prisma } from "#core/db.server.ts";
import { createSocialMeta } from "#core/meta.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { PressArticle } from "@prisma/client";
import { json, SerializeFrom } from "@remix-run/node";
import { useLoaderData, V2_MetaFunction } from "@remix-run/react";
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

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Articles de presse") });
};

export default function Route() {
  const { pressArticles } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex">
        <h1
          className={cn(
            "text-title-hero-small text-center",
            "md:text-title-hero-large md:text-left"
          )}
        >
          Articles de presse
        </h1>
      </header>

      {pressArticles.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 gap-12 items-start",
              "xs:grid-cols-2",
              "md:grid-cols-3"
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
        className="group w-full rounded-bubble-md flex flex-col gap-3"
      >
        {pressArticle.image == null ? (
          <DynamicImage
            imageId="press-articles/fallback"
            alt={pressArticle.title}
            sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
            fallbackSize="512"
            loading="lazy"
            className="w-full aspect-4/3 flex-none rounded-bubble-md"
          />
        ) : (
          <img
            alt={pressArticle.title}
            src={pressArticle.image}
            loading="lazy"
            className="w-full aspect-4/3 flex-none rounded-bubble-md bg-gray-100 object-cover"
          />
        )}

        <div className="flex flex-col">
          <p className="text-caption-default text-gray-500">
            {DateTime.fromISO(pressArticle.publicationDate).toLocaleString(
              DateTime.DATE_MED
            )}
            {" • "}
            {pressArticle.publisherName}
          </p>

          <p className="text-title-item transition-colors duration-100 ease-in-out group-hover:text-brandBlue">
            {pressArticle.title}
          </p>
        </div>
      </BaseLink>
    </li>
  );
}
