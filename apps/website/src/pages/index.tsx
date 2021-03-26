import * as React from "react";
import { Header } from "../core/header";
import { PageTitle } from "../core/pageTitle";
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
          largeImage="/landing-image.jpg"
          smallImage="/landing-image-small.jpg"
        />
      </main>
    </>
  );
}
