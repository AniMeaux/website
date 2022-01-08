import { Article } from "@animeaux/shared";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { Markdown } from "dataDisplay/markdown";
import { articles } from "elements/blog/data";
import { ArticleHeader } from "layout/articleHeader";
import { CenteredContent } from "layout/centeredContent";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { Section } from "layout/section";
import { GetServerSideProps } from "next";
import { ErrorPage } from "pages/_error";

type ArticlePageProps =
  | { type: "success"; article: Article }
  | { type: "error" };

export const getServerSideProps: GetServerSideProps<ArticlePageProps> = async ({
  query,
}) => {
  const articleSlug = query.articleSlug as string;
  const article = articles.find((article) => article.slug === articleSlug);

  if (article == null) {
    return { notFound: true };
  }

  return { props: { type: "success", article } };
};

const ArticlePage: PageComponent<ArticlePageProps> = (props) => {
  if (props.type === "error") {
    return <ErrorPage type="serverError" />;
  }

  return (
    <main>
      <PageTitle title={props.article.title} />
      <ArticleHeader article={props.article} />

      <Section>
        <CenteredContent>
          <Markdown preset="article">{props.article.content}</Markdown>
        </CenteredContent>
      </Section>
    </main>
  );
};

ArticlePage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default ArticlePage;
