import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Article, articles } from "~/blog/data";
import { ArticleItem } from "~/blog/item";
import { cn } from "~/core/classNames";
import { MapDateToString } from "~/core/dates";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";

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
            "text-title-hero-small text-center",
            "md:text-title-hero-large md:text-left"
          )}
        >
          Blog
        </h1>
      </header>

      {articles.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 grid-rows-[auto] gap-12 items-start",
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
        <p
          className={cn("py-12 text-center text-gray-500", "md:px-30 md:py-40")}
        >
          Aucun article pour l’instant.
        </p>
      )}
    </main>
  );
}
