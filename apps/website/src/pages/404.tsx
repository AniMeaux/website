import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { Error, ErrorTypeTitle } from "dataDisplay/error/error";
import { Footer } from "layout/footer";
import { Header } from "layout/header";

export const NotFoundPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={ErrorTypeTitle.notFound} />
      <Error type="notFound" />
    </main>
  );
};

NotFoundPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default NotFoundPage;
