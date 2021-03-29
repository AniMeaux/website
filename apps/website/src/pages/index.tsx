import * as React from "react";
import { Footer } from "../core/footer";
import { Header } from "../core/header";
import { PageTitle } from "../core/pageTitle";
import { SearchForm } from "../core/searchForm";
import { HeroSection } from "../ui/heroSection";
import {
  StatisticImage,
  StatisticItem,
  StatisticsSection,
} from "../ui/statisticsSection";

export default function HomePage() {
  return (
    <>
      <PageTitle />
      <Header />

      <main>
        <HeroSection
          title="Adoptez-moi"
          subTitle="Trouvez le compagnon de vos rêves et donnez-lui une seconde chance"
          smallImage="/landing-image.jpg"
          largeImage="/landing-image@2x.jpg"
          searchForm={<SearchForm />}
        />

        <StatisticsSection>
          <StatisticItem
            value="2 ans"
            title="D'existences"
            image={
              <StatisticImage
                alt="Anniversaire"
                smallImage="/birthday.jpg"
                largeImage="/birthday@2x.jpg"
              />
            }
          />

          <StatisticItem
            value="3 450"
            title="Prises en charge"
            image={
              <StatisticImage
                alt="Prise en charge"
                smallImage="/pick-up.jpg"
                largeImage="/pick-up.jpg"
              />
            }
          />

          <StatisticItem
            value="46"
            title="Bénévoles"
            image={
              <StatisticImage
                alt="Bénévoles"
                smallImage="/volunteers.jpg"
                largeImage="/volunteers.jpg"
              />
            }
          />
        </StatisticsSection>
      </main>

      <Footer />
    </>
  );
}
