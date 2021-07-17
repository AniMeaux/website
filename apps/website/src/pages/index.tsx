import { SearchForm } from "controllers/searchForm";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { StaticImage } from "dataDisplay/image";
import { CallToActionLink } from "layout/callToAction";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { HeroSection } from "layout/heroSection";
import { FaBirthdayCake, FaHandHoldingHeart, FaUsers } from "react-icons/fa";
import styled, { css } from "styled-components/macro";

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
        <SectionTitle>Qui sommes-nous ?</SectionTitle>

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
            <StatsIcon>
              <FaBirthdayCake />
            </StatsIcon>

            <StatsValue>3 ans</StatsValue>
            <p>D'existence</p>
          </li>

          <li>
            <StatsIcon>
              <FaHandHoldingHeart />
            </StatsIcon>

            <StatsValue>400</StatsValue>
            <p>Prises en charge</p>
          </li>

          <li>
            <StatsIcon>
              <FaUsers />
            </StatsIcon>

            <StatsValue>28</StatsValue>
            <p>Bénévoles</p>
          </li>
        </PresentationList>
      </StatsSection>

      <AsideSection>
        <div>
          <SectionTitle>Devenez famille d'accueil</SectionTitle>

          <SectionParagraph>
            Aidez-nous à les sauver en leur consacrant temps et attention, sans
            aucune contrainte financière
          </SectionParagraph>

          <CallToActionLink href="/host-families" color="blue">
            En savoir plus
          </CallToActionLink>
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
          Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter ?
          Vous pouvez nous faire un don ! Ce don servira à financer les{" "}
          <strong>soins vétérinaires</strong>, effectuer plus de{" "}
          <strong>sauvetages et acheter du matériel</strong> pour les animaux.
        </SectionParagraph>

        <CallToActionLink href="/donation" color="white">
          Faire un don
        </CallToActionLink>
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

          <CallToActionLink href="/volunteers" color="blue">
            En savoir plus
          </CallToActionLink>
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

const sectionPadding = css`
  padding: var(--spacing-7xl) var(--content-margin);
`;

const PresentationSection = styled.section`
  ${sectionPadding};
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
  ${sectionPadding};
  background-image: var(--blue-gradient);
  text-align: center;
`;

const StatsIcon = styled.span`
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsValue = styled.h3`
  margin-bottom: var(--spacing-s);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
`;

const AsideSection = styled.section`
  ${sectionPadding};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-6xl);
  align-items: center;
  text-align: center;
`;

const AsideImage = styled(StaticImage)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius-m);

  @media (min-width: 800px) {
    height: 400px;
  }
`;

const DonationSection = styled.section`
  ${sectionPadding}
  background-image: var(--yellow-gradient);
  text-align: center;
`;
