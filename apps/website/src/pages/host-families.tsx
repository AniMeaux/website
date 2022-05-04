import { FaClipboardCheck, FaFileAlt, FaHome } from "react-icons/fa";
import styled, { css } from "styled-components";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { StaticImage } from "~/dataDisplay/image";
import { CallToActionLink } from "~/layout/callToAction";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";

const TITLE = "Devenir famille d'accueil";

const HostFamiliesPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader
        title={TITLE}
        largeImage="/host-family@2x.jpg"
        smallImage="/host-family.jpg"
      />

      <DescriptionSection>
        <p>
          Aidez-nous à <strong>sauver les animaux</strong> en leur consacrant{" "}
          <strong>temps et attention</strong>, sans aucune contrainte financière
        </p>
      </DescriptionSection>

      <StatsSection>
        <SectionTitle>En 3 étapes</SectionTitle>

        <PresentationList>
          <li>
            <StatsIcon>
              <FaFileAlt />
            </StatsIcon>

            <StatsValue>Formulaire</StatsValue>
            <p>
              Remplir le formulaire de famille d'accueil afin que nous puissions
              mieux vous connaître
            </p>

            <CallToAction
              shouldOpenInNewTab
              href="http://webquest.fr/?m=62649_formulaire-famille-d-accueil"
              color="blue"
            >
              Remplir le formulaire
            </CallToAction>
          </li>

          <li>
            <StatsIcon>
              <FaClipboardCheck />
            </StatsIcon>

            <StatsValue>Pré-visite</StatsValue>
            <p>
              Un bénévole effectuera une pré-visite chez vous afin de préparer
              au mieux l'accueil de votre futur colocataire
            </p>
          </li>

          <li>
            <StatsIcon>
              <FaHome />
            </StatsIcon>

            <StatsValue>Accueil</StatsValue>
            <p>
              Si votre dossier est validé, nous organiserons l'arrivée de
              l'animal chez vous
            </p>
          </li>
        </PresentationList>
      </StatsSection>

      <AsideSection>
        <div>
          <SectionTitle>Matériel et frais vétérinaires</SectionTitle>

          <p>
            Le matériel et l'alimentation pourront vous être fourni sur demande
            et les frais vétérinaires sont à la charge de l'association
          </p>
        </div>

        <div>
          <AsideImage
            largeImage="/equipment@2x.jpg"
            smallImage="/equipment.jpg"
            alt="Matériel et frais vétérinaires"
          />
        </div>
      </AsideSection>

      <AsideSection $alternateBackground>
        <div>
          <AsideImage
            largeImage="/follow-up@2x.jpg"
            smallImage="/follow-up.jpg"
            alt="Suivit"
          />
        </div>

        <div>
          <SectionTitle>Suivi</SectionTitle>

          <p>
            Vous vous engagez à nous donner régulièrement des nouvelles de
            l'animal et à nous fournir des photos récentes tout au long de
            l'accueil
          </p>
        </div>
      </AsideSection>

      <AsideSection>
        <div>
          <SectionTitle>Engagement</SectionTitle>

          <p>
            L'accueil de l'animal est convenu pour une durée déterminée ou
            indeterminée, en cas d'imprévus un delais devra nous être accordé
            pour trouver une solution de secours
          </p>
        </div>

        <div>
          <AsideImage
            largeImage="/engagement@2x.jpg"
            smallImage="/engagement.jpg"
            alt="Engagement"
          />
        </div>
      </AsideSection>
    </main>
  );
};

HostFamiliesPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default HostFamiliesPage;

const sectionPadding = css`
  padding: var(--spacing-7xl) var(--content-margin);
`;

const DescriptionSection = styled.section`
  ${sectionPadding}
  text-align: center;
`;

const StatsSection = styled.section`
  ${sectionPadding};
  background-image: var(--blue-gradient);
  text-align: center;
`;

const StatsIcon = styled.span`
  margin-bottom: var(--spacing-l);
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsValue = styled.h3`
  margin-bottom: var(--spacing-2xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
`;

const CallToAction = styled(CallToActionLink)`
  margin-top: var(--spacing-4xl);
`;

const AsideSection = styled.section<{ $alternateBackground?: boolean }>`
  ${sectionPadding};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-6xl);
  align-items: center;
  text-align: center;
  background-image: ${(props) =>
    props.$alternateBackground ? "var(--blue-gradient)" : "none"};
`;

const SectionTitle = styled.h2`
  margin-bottom: var(--spacing-4xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
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

const PresentationList = styled.ul`
  margin-top: var(--spacing-6xl);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-6xl);
`;
