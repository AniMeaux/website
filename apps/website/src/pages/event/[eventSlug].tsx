import { formatDateRange } from "@animeaux/shared";
import invariant from "invariant";
import { GetServerSideProps } from "next";
import { OperationResponse, runOperation } from "~/core/operations";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { Markdown } from "~/dataDisplay/markdown";
import { CenteredContent } from "~/layout/centeredContent";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { SecondaryHeader } from "~/layout/secondaryHeader";
import { Section } from "~/layout/section";
import ErrorPage from "~/pages/_error";

const UUID_LENGTH = 36;

export const getServerSideProps: GetServerSideProps<
  OperationResponse<"getEvent">
> = async ({ query, res }) => {
  invariant(
    typeof query.eventSlug === "string",
    `The eventSlug path should be a string. Got '${typeof query.eventSlug}'`
  );

  const id = query.eventSlug.substring(query.eventSlug.length - UUID_LENGTH);

  const getEvent = await runOperation({
    name: "getEvent",
    params: { id },
  });

  if (getEvent.state === "error") {
    res.statusCode = getEvent.status;
  }

  return { props: getEvent };
};

const EventPage: PageComponent<OperationResponse<"getEvent">> = (props) => {
  if (props.state === "error") {
    return <ErrorPage type="serverError" />;
  }

  return (
    <main>
      <PageTitle title={props.result.title} />
      <SecondaryHeader
        image={props.result.image}
        title={props.result.title}
        subTitle={[
          props.result.location,
          formatDateRange(props.result.startDate, props.result.endDate, {
            showTime: !props.result.isFullDay,
          }),
        ].join(" • ")}
      />

      <Section>
        <CenteredContent>
          <Markdown preset="article">{props.result.description}</Markdown>
        </CenteredContent>
      </Section>
    </main>
  );
};

EventPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default EventPage;
