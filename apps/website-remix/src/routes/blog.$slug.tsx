import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";
import { Article, articles } from "~/blog/data";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { getConfig } from "~/core/config";
import { MapDateToString } from "~/core/dates";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage, getErrorTitle } from "~/dataDisplay/errorPage";
import { createCloudinaryUrl, DynamicImage } from "~/dataDisplay/image";
import { Markdown, MarkdownProps } from "~/dataDisplay/markdown";
import { LineShapeVertical } from "~/layout/lineShape";

type LoaderDataServer = {
  article: Article;
};

export const loader: LoaderFunction = async ({ params }) => {
  const article = articles.find((article) => article.slug === params["slug"]);
  if (article == null) {
    throw new Response("Not found", { status: 404 });
  }

  return json<LoaderDataServer>({ article });
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
  const { article } = useLoaderData<LoaderDataClient>();

  return (
    <main className="w-full px-article flex flex-col gap-12">
      <header className={cn("px-4 flex flex-col gap-6", "md:px-0")}>
        <h1 className={cn("text-title-hero-small", "md:text-title-hero-large")}>
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
        <Markdown components={CONTENT_COMPONENTS}>{article.content}</Markdown>
      </article>
    </main>
  );
}

const CONTENT_COMPONENTS: MarkdownProps["components"] = {
  br: () => <br />,
  em: ({ children }) => <em>{children}</em>,
  strong: ({ children }) => (
    <strong className="text-body-emphasis">{children}</strong>
  ),
  p: ({ children }) => (
    <p className={cn("my-6 px-4 first:mt-0 last:mb-0", "md:px-0")}>
      {children}
    </p>
  ),
  img: ({ src, alt }) => {
    invariant(src != null, "src should be defined");
    invariant(alt != null, "alt should be defined");

    return (
      <DynamicImage
        shouldFill
        imageId={src}
        alt={alt}
        sizes={{ lg: "1024px", default: "100vw" }}
        fallbackSize="1024"
        className="my-12 w-full aspect-4/3 flex-none rounded-bubble-ratio"
      />
    );
  },
  blockquote: ({ children }) => (
    <blockquote className={cn("my-6 flex italic", "md:gap-6")}>
      <LineShapeVertical className="w-2 flex-none text-brandBlue" />
      <div className="flex-1">{children}</div>
    </blockquote>
  ),
  a: ({ children, href }) => (
    <BaseLink to={href} className={actionClassNames.proseInline()}>
      {children}
    </BaseLink>
  ),
  h2: ({ children }) => (
    <h2
      className={cn(
        "mt-12 mb-6 px-4 text-title-section-small",
        "md:px-0 md:text-title-section-large"
      )}
    >
      {children}
    </h2>
  ),
  ul: ({ children }) => (
    <ul className={cn("my-6 pl-8 list-disc", "md:pl-4")}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className={cn("my-6 pl-8 list-decimal", "md:pl-4")}>{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  table: ({ children }) => (
    <table className="block w-full my-6 overflow-auto">{children}</table>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children, style }) => (
    <th
      className="border border-gray-200 px-6 py-3 text-body-emphasis"
      style={style}
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td className="border border-gray-200 px-6 py-3" style={style}>
      {children}
    </td>
  ),
};
