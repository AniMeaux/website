import { GetServerSideProps } from "next";
import styled from "styled-components";
import { PageForm } from "~/controllers/pageForm";
import { OperationResponse, runOperation } from "~/core/operations";
import { PageComponent } from "~/core/pageComponent";
import { PageQueryParam } from "~/core/pageQueryParam";
import { PageTitle } from "~/core/pageTitle";
import { EventCardLink } from "~/elements/event/card";
import { CallToActionLink } from "~/layout/callToAction";
import { CenteredContent } from "~/layout/centeredContent";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";
import { Section } from "~/layout/section";
import { ErrorPage } from "~/pages/_error";

type PastEventListPageProps = OperationResponse<"getVisiblePastEvents">;

export const getServerSideProps: GetServerSideProps<
  PastEventListPageProps
> = async ({ query, res }) => {
  const queryParams = PageQueryParam.fromQuery(query);

  const getVisiblePastEvents = await runOperation({
    name: "getVisiblePastEvents",
    params: { page: queryParams.page },
  });

  if (getVisiblePastEvents.state === "error") {
    res.statusCode = getVisiblePastEvents.status;
  }

  return { props: getVisiblePastEvents };
};

const TITLE = "Événements passés";

const PastEventListPage: PageComponent<PastEventListPageProps> = (props) => {
  if (props.state === "error") {
    return <ErrorPage type="serverError" title={TITLE} />;
  }

  let content: React.ReactNode;

  if (props.result.hitsTotalCount === 0) {
    content = <Empty>Aucun événement passé</Empty>;
  } else {
    content = (
      <>
        <List>
          {props.result.hits.map((event) => (
            <li key={event.id}>
              <EventCardLink event={event} />
            </li>
          ))}
        </List>

        <EventPageForm pageCount={props.result.pageCount} />
      </>
    );
  }

  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader title={TITLE} />

      <Section>
        <CenteredContent>
          <Content>
            {content}

            <CallToActionLink href="/event" color="blue">
              Voir les événements à venir
            </CallToActionLink>
          </Content>
        </CenteredContent>
      </Section>
    </main>
  );
};

PastEventListPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default PastEventListPage;

const Content = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-7xl);
`;

const List = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-4xl);
`;

const EventPageForm = styled(PageForm)`
  margin: var(--spacing-5xl) auto 0;
`;

const Empty = styled.p`
  padding: var(--spacing-5xl) 0;
  color: var(--text-secondary);
  text-align: center;
`;
