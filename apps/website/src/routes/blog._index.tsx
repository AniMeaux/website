import { articles } from "#i/blog/data.server";
import { ArticleItem } from "#i/blog/item";
import { createSocialMeta } from "#i/core/meta";
import { getPageTitle } from "#i/core/page-title";
import { cn } from "@animeaux/core";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ articles });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Blog") });
};

export default function Route() {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <main className="flex w-full flex-col gap-12 px-page">
      <header className="flex">
        <h1
          className={cn(
            "text-center text-title-hero-small",
            "md:text-left md:text-title-hero-large",
          )}
        >
          Blog
        </h1>
      </header>

      {articles.length > 0 ? (
        <section className="flex flex-col">
          <ul
            className={cn(
              "grid grid-cols-1 items-start gap-12",
              "xs:grid-cols-2",
              "md:grid-cols-3",
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
