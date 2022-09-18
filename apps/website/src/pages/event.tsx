import { GetServerSideProps } from "next";
import styled from "styled-components";
import { OperationResponse, runOperation } from "~/core/operations";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { EventCardLink } from "~/elements/event/card";
import { CallToActionLink } from "~/layout/callToAction";
import { CenteredContent } from "~/layout/centeredContent";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";
import { Section } from "~/layout/section";
import { ErrorPage } from "~/pages/_error";

type EventListPageProps = OperationResponse<"getVisibleUpCommingEvents">;

export const getServerSideProps: GetServerSideProps<
  EventListPageProps
> = async ({ res }) => {
  const getVisibleUpCommingEvents = await runOperation({
    name: "getVisibleUpCommingEvents",
  });

  if (getVisibleUpCommingEvents.state === "error") {
    res.statusCode = getVisibleUpCommingEvents.status;
  }

  return { props: getVisibleUpCommingEvents };
};

const TITLE = "Événements";

const EventListPage: PageComponent<EventListPageProps> = (props) => {
  if (props.state === "error") {
    return <ErrorPage type="serverError" title={TITLE} />;
  }

  let content: React.ReactNode;

  if (props.result.length === 0) {
    content = <Empty>Aucun événement prévu pour l'instant</Empty>;
  } else {
    content = (
      <>
        <List>
          {props.result.map((event) => (
            <li key={event.id}>
              <EventCardLink event={event} />
            </li>
          ))}
        </List>
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

            <CallToActionLink href="/past-events" color="blue">
              Voir les événements passés
            </CallToActionLink>
          </Content>
        </CenteredContent>
      </Section>
    </main>
  );
};

EventListPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default EventListPage;

const Content = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-7xl);
`;

const Empty = styled.p`
  padding: var(--spacing-5xl) 0;
  color: var(--text-secondary);
  text-align: center;
`;

const List = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-4xl);
`;
