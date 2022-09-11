import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { Article, articles } from "~/blog/data";
import { ArticleItem } from "~/blog/item";
import { cn } from "~/core/classNames";
import { getConfig } from "~/core/config";
import { MapDateToString } from "~/core/dates";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage, getErrorTitle } from "~/dataDisplay/errorPage";
import { createCloudinaryUrl, DynamicImage } from "~/dataDisplay/image";
import { ARTICLE_COMPONENTS, Markdown } from "~/dataDisplay/markdown";
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "~/layout/relatedSection";

type LoaderDataServer = {
  article: Article;
  otherArticles: Article[];
};

const OTHER_ARTICLE_COUNT = 3;

export const loader: LoaderFunction = async ({ params }) => {
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

  return json<LoaderDataServer>({ article, otherArticles });
};

export const meta: MetaFunction = ({ data, parentsData }) => {
  const article = (data as LoaderDataServer | null)?.article;
  if (article == null) {
    return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
  }

  const config = getConfig(parentsData);
  return createSocialMeta({
    title: getPageTitle(article.title),
    description: article.description,
    imageUrl: createCloudinaryUrl(config.cloudinaryName, article.image, {
      shouldFill: true,
      size: "1024",
      aspectRatio: "16:9",
    }),
  });
};

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function BlogPage() {
  const { article, otherArticles } = useLoaderData<LoaderDataClient>();

  return (
    <>
      <main className="w-full px-article flex flex-col gap-12">
        <header className={cn("px-4 flex flex-col gap-6", "md:px-0")}>
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
          shouldFill
          imageId={article.image}
          alt={article.title}
          sizes={{ lg: "1024px", default: "100vw" }}
          fallbackSize="1024"
          className="w-full aspect-4/3 flex-none rounded-bubble-ratio"
        />

        <article>
          <Markdown components={ARTICLE_COMPONENTS}>{article.content}</Markdown>
        </article>
      </main>

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
