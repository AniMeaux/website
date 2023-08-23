import { articles } from "#blog/data.server.ts";
import { ArticleItem } from "#blog/item.tsx";
import { cn } from "#core/classNames.ts";
import { createSocialMeta } from "#core/meta.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { json } from "@remix-run/node";
import { useLoaderData, V2_MetaFunction } from "@remix-run/react";

export async function loader() {
  return json({ articles });
}

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Blog") });
};

export default function Route() {
  const { articles } = useLoaderData<typeof loader>();

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
              "grid grid-cols-1 gap-12 items-start",
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
