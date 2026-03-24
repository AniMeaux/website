import { cn } from "@animeaux/core"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { DateTime } from "luxon"

import { articles } from "#i/blog/data.server.js"
import { ArticleItem } from "#i/blog/item.js"
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import {
  createCloudinaryUrl,
  DynamicImage,
} from "#i/core/data-display/image.js"
import { ARTICLE_COMPONENTS, Markdown } from "#i/core/data-display/markdown.js"
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "#i/core/layout/related-section.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"
import { DonationSection } from "#i/donation/section.js"

const OTHER_ARTICLE_COUNT = 3

export async function loader({ params }: LoaderFunctionArgs) {
  const article = articles.find((article) => article.slug === params["slug"])
  if (article == null) {
    throw new Response("Not found", { status: 404 })
  }

  let otherArticles = articles.filter(
    (article) => article.slug !== params["slug"],
  )

  if (otherArticles.length > OTHER_ARTICLE_COUNT) {
    const startIndex = Math.floor(
      Math.random() * (otherArticles.length - OTHER_ARTICLE_COUNT + 1),
    )

    otherArticles = otherArticles.slice(
      startIndex,
      startIndex + OTHER_ARTICLE_COUNT,
    )
  }

  return json({ article, otherArticles })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const article = data?.article
  if (article == null) {
    return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) })
  }

  return createSocialMeta({
    type: "article",
    title: getPageTitle(article.title),
    description: article.description,
    imageUrl: createCloudinaryUrl(
      CLIENT_ENV.CLOUDINARY_CLOUD_NAME,
      article.image,
      {
        size: "1024",
        aspectRatio: "16:9",
      },
    ),
    publishedTime: article.publicationDate,
    author: article.authorName,
  })
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  const { article, otherArticles } = useLoaderData<typeof loader>()

  return (
    <>
      <main className="flex w-full flex-col gap-12 px-article">
        <header className="flex flex-col gap-6">
          <h1
            className={cn("text-title-hero-small", "md:text-title-hero-large")}
          >
            {article.title}
          </h1>

          <p className="text-gray-500">
            {DateTime.fromISO(article.publicationDate).toLocaleString(
              DateTime.DATE_MED,
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
            "aspect-4/3 w-full flex-none rounded-bubble-md",
            "sm:rounded-bubble-lg",
            "md:rounded-bubble-xl",
          )}
        />

        <article>
          <Markdown components={ARTICLE_COMPONENTS}>{article.content}</Markdown>
        </article>
      </main>

      <aside className="flex w-full flex-col px-page pt-18 md:pt-12">
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
  )
}
