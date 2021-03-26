import * as React from "react";
import { Header } from "../core/header";
import { PageTitle } from "../core/pageTitle";

export default function HomePage() {
  return (
    <>
      <PageTitle />
      <Header />

      <main>
        <section className="headSection">
          <picture>
            <source srcSet="/landing-image.jpg" media="(min-width: 800px)" />
            <img
              src="/landing-image-small.jpg"
              alt="Adopter"
              className="headSection__image"
            />
          </picture>

          <header className="headSection__text">
            <h1 className="headSection__text__title">Adoptez-moi</h1>
            <p className="headSection__text__subTitle">
              Trouvez le compagnon de vos rêves et donnez-lui une seconde
              chance.
            </p>
          </header>
        </section>
      </main>
    </>
  );
}
