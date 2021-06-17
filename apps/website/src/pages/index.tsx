import { SearchForm } from "controllers/searchForm";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { HeroSection } from "elements/home/heroSection";
import {
  StatisticImage,
  StatisticItem,
  StatisticsSection,
} from "elements/home/statisticsSection";
import { Footer } from "layout/footer";
import {
  FullWidthSection,
  FullWidthSectionAction,
} from "layout/fullWidthSection";
import { Header } from "layout/header";
import {
  PrimarySection,
  PrimarySectionAction,
  PrimarySectionImage,
} from "layout/primarySection";

const HomePage: PageComponent = () => {
  return (
    <main>
      <PageTitle />
      <HeroSection
        title="Adoptez-moi"
        subTitle="Trouvez le compagnon de vos rêves et donnez-lui une seconde chance"
        smallImage="/landing-image.jpg"
        largeImage="/landing-image@2x.jpg"
        searchForm={<SearchForm />}
      />

      <StatisticsSection>
        <StatisticItem
          value="3 ans"
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
          value="400"
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
          value="28"
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

      <PrimarySection
        title="Devenez famille d'accueil"
        message="Adez-nous à les sauver en leur consacrant temps et attention, sans aucune contrainte financière"
        image={
          <PrimarySectionImage
            largeImage="/host-family@2x.jpg"
            smallImage="/host-family.jpg"
            alt="Famille d'accueil"
          />
        }
        backgroundImage="var(--host-family-color)"
        action={
          <PrimarySectionAction href="/">En savoir plus</PrimarySectionAction>
        }
      />

      <FullWidthSection
        title="Faîtes un don !"
        message={
          <>
            Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter?
            Vous pouvez nous faire un don ! Ce don servira à financer les{" "}
            <strong>soins vétérinaires</strong>, effectuer plus de{" "}
            <strong>sauvetages et acheter du matériel</strong> pour les animaux.
          </>
        }
        action={
          <FullWidthSectionAction href="/">Faire un don</FullWidthSectionAction>
        }
      />

      <PrimarySection
        reversed
        title="Devenez bénévole"
        message="Adez-nous à les sauver en leur consacrant temps et attention, sans aucune contrainte financière"
        image={
          <PrimarySectionImage
            largeImage="/volunteers.jpg"
            smallImage="/volunteers.jpg"
            alt="Bénévoles"
          />
        }
        backgroundImage="var(--volunteers-color)"
        action={<PrimarySectionAction href="/">Postuler</PrimarySectionAction>}
      />
    </main>
  );
};

HomePage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default HomePage;
