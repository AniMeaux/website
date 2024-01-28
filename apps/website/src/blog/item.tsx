import { BaseLink } from "#core/baseLink";
import { DynamicImage } from "#core/dataDisplay/image";
import { DateTime } from "luxon";

export function ArticleItem({
  article,
}: {
  article: {
    slug: string;
    image: string;
    title: string;
    publicationDate: string;
    authorName: string;
    description: string;
  };
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
          <p className="text-gray-500 text-caption-default">
            {DateTime.fromISO(article.publicationDate).toLocaleString(
              DateTime.DATE_MED,
            )}{" "}
            par {article.authorName}
          </p>

          <p className="transition-colors duration-100 ease-in-out text-title-item group-hover:text-brandBlue">
            {article.title}
          </p>
          <p>{article.description}</p>
        </div>
      </BaseLink>
    </li>
  );
}
