import { DateTime } from "luxon";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { focusRingClassNames } from "~/core/focusRing";
import { DynamicImage } from "~/dataDisplay/image";

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
        className={cn(
          "w-full rounded-bubble-md flex flex-col gap-3",
          focusRingClassNames()
        )}
      >
        <DynamicImage
          imageId={article.image}
          alt={article.title}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-md"
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
