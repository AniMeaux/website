import { GetServerSideProps } from "next";
import styled, { css } from "styled-components";
import { OperationResponse, runOperation } from "~/core/operations";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";
import { ErrorPage } from "~/pages/_error";

const TITLE = "Trouvez un nom pour votre 🐶🐭🐹🐰🐱🦁";

type FindANamePageProps = OperationResponse<"listAvailableNames">;

export const getServerSideProps: GetServerSideProps<
  FindANamePageProps
> = async ({ res }) => {
  const names = await runOperation({
    name: "listAvailableNames",
    params: {},
  });

  if (names.state === "error") {
    res.statusCode = names.status;
  }

  return { props: names };
};

const FindANamePage: PageComponent<FindANamePageProps> = (props) => {
  if (props.state === "error") {
    return <ErrorPage type="serverError" title={TITLE} />;
  }

  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader
        title={TITLE}
        largeImage="/foster-family@2x.jpg"
        smallImage="/foster-family.jpg"
      />

      <DescriptionSection>
        <p>
          Tu cherches un nom qu'il est trop cool mais t'as pas d'idée ? Ba
          viens, ça va bien se passer
        </p>
      </DescriptionSection>

      <NameSection>
        <SectionTitle>🤬</SectionTitle>
        <input
          style={{ background: "grey" }}
          type="text"
          onChange={(event) => {
            event.preventDefault();
            runOperation({
              name: "listAvailableNames",
              params: { firstLetter: event.target.value },
            });
          }}
        />
        {props.result.map((name, i) => (
          <li key={i}>{name}</li>
        ))}
      </NameSection>
    </main>
  );
};

FindANamePage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default FindANamePage;

const sectionPadding = css`
  padding: var(--spacing-7xl) var(--content-margin);
`;

const DescriptionSection = styled.section`
  ${sectionPadding}
  text-align: center;
`;

const NameSection = styled.section`
  ${sectionPadding};
  background-image: var(--blue-gradient);
  text-align: center;
`;

const SectionTitle = styled.h2`
  margin-bottom: var(--spacing-4xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
`;
