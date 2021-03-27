import * as React from "react";
import { Footer } from "../core/footer";
import { Header } from "../core/header";
import { PageTitle } from "../core/pageTitle";
import { SearchForm } from "../core/searchForm";
import { HeroSection } from "../ui/heroSection";

export default function HomePage() {
  return (
    <>
      <PageTitle />
      <Header />

      <main>
        <HeroSection
          title="Adoptez-moi"
          subTitle="Trouvez le compagnon de vos rêves et donnez-lui une seconde chance."
          largeImage="/landing-image-eFwc8.jpg"
          smallImage="/landing-image-small-eFwc8.jpg"
          searchForm={<SearchForm />}
        />
      </main>

      <Footer />
    </>
  );
}
