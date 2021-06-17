import { Article } from "@animeaux/shared-entities/build/article";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { ArticleList } from "elements/blog/articleList";
import { articles } from "elements/blog/data";
import { CenteredContent } from "layout/centeredContent";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { PageHeader } from "layout/pageHeader";
import { Section } from "layout/section";
import { GetServerSideProps } from "next";
import { ErrorPage } from "pages/_error";

type BlogPageProps =
  | { type: "success"; articles: Article[] }
  | { type: "error" };

export const getServerSideProps: GetServerSideProps<BlogPageProps> =
  async () => {
    return { props: { type: "success", articles } };
  };

const TITLE = "Blog";

const BlogPage: PageComponent<BlogPageProps> = (props) => {
  if (props.type === "error") {
    return <ErrorPage type="serverError" title={TITLE} />;
  }

  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader title={TITLE} variant="blue" />

      <Section>
        <CenteredContent>
          <section>
            <ArticleList articles={props.articles} />
          </section>
        </CenteredContent>
      </Section>
    </main>
  );
};

BlogPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default BlogPage;
