import { DateTime } from "luxon"

import { BaseLink } from "#i/core/base-link.js"
import { DynamicImage } from "#i/core/data-display/image.js"

export function ArticleItem({
  article,
}: {
  article: {
    slug: string
    image: string
    title: string
    publicationDate: string
    authorName: string
    description: string
  }
}) {
  return (
    <li className="flex">
      <BaseLink
        to={`/blog/${article.slug}`}
        className="group flex w-full flex-col gap-3 rounded-bubble-md"
      >
        <DynamicImage
          imageId={article.image}
          alt={article.title}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="aspect-4/3 w-full flex-none rounded-bubble-md"
        />

        <div className="flex flex-col">
          <p className="text-caption text-gray-500">
            {DateTime.fromISO(article.publicationDate).toLocaleString(
              DateTime.DATE_MED,
            )}{" "}
            par {article.authorName}
          </p>

          <p className="text-item-title transition-colors group-hover:text-brand-blue">
            {article.title}
          </p>
          <p>{article.description}</p>
        </div>
      </BaseLink>
    </li>
  )
}
