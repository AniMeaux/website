import { Partner } from "@animeaux/shared-entities/build/partner";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { partners } from "elements/partners/data";
import { PartnerList } from "elements/partners/partnerList";
import { CenteredContent } from "layout/centeredContent";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { PageHeader } from "layout/pageHeader";
import { Section } from "layout/section";
import { GetServerSideProps } from "next";
import { ErrorPage } from "pages/_error";

type PartnersPageProps =
  | { type: "success"; partners: Partner[] }
  | { type: "error" };

export const getServerSideProps: GetServerSideProps<PartnersPageProps> =
  async () => {
    return { props: { type: "success", partners } };
  };

const TITLE = "Partenaires";

const PartnersPage: PageComponent<PartnersPageProps> = (props) => {
  if (props.type === "error") {
    return <ErrorPage type="serverError" title={TITLE} />;
  }

  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader title={TITLE} />

      <Section>
        <CenteredContent>
          <section>
            <PartnerList partners={props.partners} />
          </section>
        </CenteredContent>
      </Section>
    </main>
  );
};

PartnersPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default PartnersPage;
