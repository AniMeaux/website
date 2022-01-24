import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { Markdown } from "dataDisplay/markdown";
import content from "elements/support/abandon.md";
import { CenteredContent } from "layout/centeredContent";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { PageHeader } from "layout/pageHeader";
import { Section } from "layout/section";

const TITLE = "Abandonner votre animal";

const AbandonPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader
        title={TITLE}
        largeImage="/abandon@2x.jpg"
        smallImage="/abandon.jpg"
      />

      <Section>
        <CenteredContent>
          <Markdown preset="article">{content}</Markdown>
        </CenteredContent>
      </Section>
    </main>
  );
};

AbandonPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default AbandonPage;
