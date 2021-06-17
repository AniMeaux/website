import { SearchForm } from "controllers/searchForm";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { StaticImage } from "dataDisplay/image";
import { HeroSection } from "elements/home/heroSection";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { PrimarySectionAction } from "layout/primarySection";
import styled from "styled-components/macro";

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

      <PresentationSection>
        <SectionTitle>Qui nous sommes</SectionTitle>

        <SectionParagraph>
          Ani'Meaux est une <strong>association</strong> loi 1901 de protection
          animale, reconnue d'intérêt général, qui a pour but de{" "}
          <strong>sauver des animaux</strong> domestiques et sensibiliser à la
          cause animale en général
        </SectionParagraph>

        <PresentationList>
          <li>
            <PresentationImage
              alt="Prise en charge"
              smallImage="/pick-up.jpg"
              largeImage="/pick-up.jpg"
            />

            <p>
              Nous recueillons les animaux abandonnés, maltraités ou errants
            </p>
          </li>

          <li>
            <PresentationImage
              alt="Famille d'accueil"
              largeImage="/host-family@2x.jpg"
              smallImage="/host-family.jpg"
            />

            <p>
              Nous les plaçons dans une famille d’accueil adaptée à l’animal
              afin de lui prodiguer tous les soins nécessaires à son
              rétablissement
            </p>
          </li>

          <li>
            <PresentationImage
              alt="Adoption"
              smallImage="/adoption.jpg"
              largeImage="/adoption@2x.jpg"
            />

            <p>Nous leur trouvons une nouvelle famille pour la vie</p>
          </li>
        </PresentationList>
      </PresentationSection>

      <StatsSection>
        <SectionTitle>En chiffres</SectionTitle>

        <PresentationList>
          <li>
            <StatsValue>3 ans</StatsValue>
            <StatsLabel>D'existences</StatsLabel>
          </li>

          <li>
            <StatsValue>400</StatsValue>
            <StatsLabel>Prises en charge</StatsLabel>
          </li>

          <li>
            <StatsValue>28</StatsValue>
            <StatsLabel>Bénévoles</StatsLabel>
          </li>
        </PresentationList>
      </StatsSection>

      <AsideSection>
        <div>
          <SectionTitle>Devenez famille d'accueil</SectionTitle>

          <SectionParagraph>
            Adez-nous à les sauver en leur consacrant temps et attention, sans
            aucune contrainte financière
          </SectionParagraph>

          <CallToAction href="/">En savoir plus</CallToAction>
        </div>

        <div>
          <AsideImage
            largeImage="/host-family@2x.jpg"
            smallImage="/host-family.jpg"
            alt="Famille d'accueil"
          />
        </div>
      </AsideSection>

      <DonationSection>
        <SectionTitle>Faîtes un don !</SectionTitle>

        <SectionParagraph>
          Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter?
          Vous pouvez nous faire un don ! Ce don servira à financer les{" "}
          <strong>soins vétérinaires</strong>, effectuer plus de{" "}
          <strong>sauvetages et acheter du matériel</strong> pour les animaux.
        </SectionParagraph>

        <CallToAction href="/">Faire un don</CallToAction>
      </DonationSection>

      <AsideSection>
        <div>
          <AsideImage
            largeImage="/volunteers.jpg"
            smallImage="/volunteers.jpg"
            alt="Bénévoles"
          />
        </div>

        <div>
          <SectionTitle>Devenez bénévole</SectionTitle>

          <SectionParagraph>
            Contribuez aux sauvetages des animaux en difficultés que nous sommes
            amenés à prendre sous notre aile
          </SectionParagraph>

          <CallToAction href="/">Postuler</CallToAction>
        </div>
      </AsideSection>
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

const PresentationSection = styled.section`
  padding: var(--spacing-6xl) var(--content-margin);
  text-align: center;
`;

const SectionTitle = styled.h2`
  margin-bottom: var(--spacing-4xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
`;

const SectionParagraph = styled.p`
  margin-bottom: var(--spacing-4xl);
`;

const PresentationList = styled.ul`
  margin-top: var(--spacing-6xl);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-4xl);
`;

const PresentationImage = styled(StaticImage)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius-m);
  margin-bottom: var(--spacing-xl);
`;

const StatsSection = styled.section`
  padding: var(--spacing-6xl) var(--content-margin);
  background-image: linear-gradient(
    to bottom right,
    hsl(34, 14%, 90%),
    hsl(240, 7%, 91%)
  );
  text-align: center;
`;

const StatsValue = styled.p`
  margin-bottom: var(--spacing-s);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
`;

const StatsLabel = styled.p``;

const AsideSection = styled.section`
  padding: var(--spacing-6xl) var(--content-margin);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-4xl);
  align-items: center;
  text-align: center;
`;

const AsideImage = styled(StaticImage)`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--border-radius-m);
`;

const CallToAction = styled(PrimarySectionAction)`
  margin: 0;
`;

const DonationSection = styled.section`
  padding: var(--spacing-6xl) var(--content-margin);
  background-image: linear-gradient(
    to bottom right,
    rgb(243, 232, 205),
    rgb(255, 245, 221)
  );
  text-align: center;
`;
