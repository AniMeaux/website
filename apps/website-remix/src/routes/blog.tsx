import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { Article, articles } from "~/blog/data";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { MapDateToString } from "~/core/dates";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { DynamicImage } from "~/dataDisplay/image";

type LoaderDataServer = {
  articles: Article[];
};

export const loader: LoaderFunction = async () => {
  return json<LoaderDataServer>({ articles });
};

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Blog") });
};

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function BlogPage() {
  const { articles } = useLoaderData<LoaderDataClient>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex">
        <h1
          className={cn(
            "px-4 text-title-hero-small text-center",
            "md:px-0 md:text-title-hero-large md:text-left"
          )}
        >
          Blog
        </h1>
      </header>

      {articles.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 grid-rows-[auto] gap-6 items-start",
              "xs:grid-cols-2",
              "md:grid-cols-3"
            )}
          >
            {articles.map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))}
          </ul>
        </section>
      ) : (
        <p className={cn("px-4 py-12 text-center text-gray-500", "md:py-40")}>
          Aucun article pour l’instant.
        </p>
      )}
    </main>
  );
}

function ArticleItem({
  article,
}: {
  article: LoaderDataClient["articles"][number];
}) {
  return (
    <li className="flex">
      <BaseLink
        to={`./${article.slug}`}
        className={cn(
          "w-full px-4 py-3 shadow-none rounded-bubble-lg bg-transparent flex flex-col gap-3 transition-[background-color,transform] duration-100 ease-in-out hover:bg-white hover:shadow-base",
          "md:p-6"
        )}
      >
        <DynamicImage
          shouldFill
          imageId={article.image}
          alt={article.title}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-ratio"
        />

        <div className="flex flex-col">
          <p className="text-caption-default text-gray-500">
            {DateTime.fromISO(article.publicationDate).toLocaleString(
              DateTime.DATE_MED
            )}{" "}
            par {article.authorName}
          </p>

          <p className="text-title-item">{article.title}</p>
          <p>{article.description}</p>
        </div>
      </BaseLink>
    </li>
  );
}
