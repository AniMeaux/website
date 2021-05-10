import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { Error, ErrorType, ErrorTypeTitle } from "~/dataDisplay/error/error";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";

export type ErrorPageProps = {
  type: ErrorType;
};

const ErrorPage: PageComponent<ErrorPageProps> = ({ type }) => {
  return (
    <main>
      <PageTitle title={ErrorTypeTitle[type]} />
      <Error type={type} />
    </main>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { type: statusCode === 404 ? "notFound" : "serverError" };
};

ErrorPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default ErrorPage;
