import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { Markdown } from "dataDisplay/markdown";
import content from "elements/support/found.md";
import { CenteredContent } from "layout/centeredContent";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { PageHeader } from "layout/pageHeader";
import { Section } from "layout/section";

const TITLE = "Signaler un animal errant";

const FoundPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader
        title={TITLE}
        largeImage="/found@2x.jpg"
        smallImage="/found.jpg"
      />

      <Section>
        <CenteredContent>
          <Markdown preset="article">{content}</Markdown>
        </CenteredContent>
      </Section>
    </main>
  );
};

FoundPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default FoundPage;
