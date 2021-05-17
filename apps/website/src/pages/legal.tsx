import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { Markdown } from "~/dataDisplay/markdown";
import content from "~/elements/legalNotice.md";
import { CenteredContent } from "~/layout/centeredContent";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";
import { Section } from "~/layout/section";

const TITLE = "Mentions légales";

const LegalPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader title={TITLE} variant="blue" />

      <Section>
        <CenteredContent>
          <div>
            <Markdown preset="article">{content}</Markdown>
          </div>
        </CenteredContent>
      </Section>
    </main>
  );
};

LegalPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default LegalPage;
