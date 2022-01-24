import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { Markdown } from "dataDisplay/markdown";
import content from "elements/support/abuse.md";
import { CenteredContent } from "layout/centeredContent";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { PageHeader } from "layout/pageHeader";
import { Section } from "layout/section";

const TITLE = "Informer d'un acte de maltraitance";

const AbusePage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader
        title={TITLE}
        largeImage="/abuse@2x.jpg"
        smallImage="/abuse.jpg"
      />

      <Section>
        <CenteredContent>
          <Markdown preset="article">{content}</Markdown>
        </CenteredContent>
      </Section>
    </main>
  );
};

AbusePage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default AbusePage;
