import { articles } from "#blog/data.server.ts";
import { ArticleItem } from "#blog/item.tsx";
import { cn } from "#core/classNames.ts";
import { getConfigFromMetaMatches } from "#core/config.ts";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { DynamicImage, createCloudinaryUrl } from "#core/dataDisplay/image.tsx";
import { ARTICLE_COMPONENTS, Markdown } from "#core/dataDisplay/markdown.tsx";
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "#core/layout/relatedSection.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { DonationSection } from "#donation/section.tsx";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

const OTHER_ARTICLE_COUNT = 3;

export async function loader({ params }: LoaderArgs) {
  const article = articles.find((article) => article.slug === params["slug"]);
  if (article == null) {
    throw new Response("Not found", { status: 404 });
  }

  let otherArticles = articles.filter(
    (article) => article.slug !== params["slug"]
  );

  if (otherArticles.length > OTHER_ARTICLE_COUNT) {
    const startIndex = Math.floor(
      Math.random() * (otherArticles.length - OTHER_ARTICLE_COUNT + 1)
    );

    otherArticles = otherArticles.slice(
      startIndex,
      startIndex + OTHER_ARTICLE_COUNT
    );
  }

  return json({ article, otherArticles });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, matches }) => {
  const article = data?.article;
  if (article == null) {
    return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
  }

  const config = getConfigFromMetaMatches(matches);
  return createSocialMeta({
    type: "article",
    title: getPageTitle(article.title),
    description: article.description,
    imageUrl: createCloudinaryUrl(config.cloudinaryName, article.image, {
      size: "1024",
      aspectRatio: "16:9",
    }),
    publishedTime: article.publicationDate,
    author: article.authorName,
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { article, otherArticles } = useLoaderData<typeof loader>();

  return (
    <>
      <main className="w-full px-article flex flex-col gap-12">
        <header className="flex flex-col gap-6">
          <h1
            className={cn("text-title-hero-small", "md:text-title-hero-large")}
          >
            {article.title}
          </h1>

          <p className="text-gray-500">
            {DateTime.fromISO(article.publicationDate).toLocaleString(
              DateTime.DATE_MED
            )}{" "}
            par {article.authorName}
          </p>
        </header>

        <DynamicImage
          imageId={article.image}
          alt={article.title}
          sizes={{ lg: "1024px", default: "100vw" }}
          fallbackSize="1024"
          className={cn(
            "w-full aspect-4/3 flex-none rounded-bubble-md",
            "sm:rounded-bubble-lg",
            "md:rounded-bubble-xl"
          )}
        />

        <article>
          <Markdown components={ARTICLE_COMPONENTS}>{article.content}</Markdown>
        </article>
      </main>

      <aside className="w-full px-page pt-18 md:pt-12 flex flex-col">
        <DonationSection />
      </aside>

      <RelatedSection>
        <RelatedSectionTitle>Continuer à lire</RelatedSectionTitle>

        <RelatedSectionList>
          {otherArticles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </RelatedSectionList>
      </RelatedSection>
    </>
  );
}
