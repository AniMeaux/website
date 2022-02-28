import { Link } from "~/core/link";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { StaticImage } from "~/dataDisplay/image";
import { CallToActionLink } from "~/layout/callToAction";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";
import { FaEnvelope } from "react-icons/fa";
import styled, { css } from "styled-components";

const TITLE = "Faire un don";

const DonationPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader
        title={TITLE}
        largeImage="/donation@2x.jpg"
        smallImage="/donation.jpg"
      />

      <DescriptionSection>
        <p>
          Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter ?
          Vous pouvez nous faire un don ! Ce don servira à financer les{" "}
          <strong>soins vétérinaires</strong>, effectuer plus de{" "}
          <strong>sauvetages et acheter du matériel</strong> pour les animaux.
        </p>
      </DescriptionSection>

      <AsideSection $alternateBackground>
        <div>
          <AsideImage
            $contain
            largeImage="/helloasso.svg"
            smallImage="/helloasso.svg"
            alt="HelloAsso"
          />
        </div>

        <div>
          <SectionTitle>Plus simple</SectionTitle>

          <p>
            En passant par HelloAsso vous recevrez automatiquement votre reçu
            fiscal
          </p>

          <CallToAction
            href="https://www.helloasso.com/associations/ani-meaux/formulaires/1/widget"
            color="blue"
          >
            Faire un don
          </CallToAction>
        </div>
      </AsideSection>

      <Section>
        <List>
          <li>
            <AsideSmallImage
              largeImage="/paypal.png"
              smallImage="/paypal.png"
              alt="Paypal"
            />

            <p>En quelques clics</p>

            <CallToAction
              href="https://www.paypal.com/paypalme/animeaux"
              color="blue"
            >
              Faire un don
            </CallToAction>
          </li>

          <li>
            <AsideSmallImage
              largeImage="/teaming.png"
              smallImage="/teaming.png"
              alt="Teaming"
            />

            <p>Faire don d'1 € par mois</p>

            <CallToAction href="https://www.teaming.net/ani-meaux" color="blue">
              Faire un don
            </CallToAction>
          </li>

          <li>
            <AsideSmallIcon>
              <FaEnvelope />
            </AsideSmallIcon>

            <p>
              Envoyez un chèque à l'ordre d'<em>Ani'Meaux</em> au{" "}
              <em>30 Rue Pierre Brasseur 77100 Meaux</em>
            </p>
          </li>
        </List>
      </Section>

      <Section $alternateBackground>
        <SectionTitle>Réduction fiscale</SectionTitle>

        <SectionParagraph>
          Le don à Ani'Meaux ouvre droit à une{" "}
          <strong>réduction fiscale</strong> car il remplit les conditions
          générales prévues aux articles 200 et 238 bis du code général des
          impôts
        </SectionParagraph>

        <List>
          <li>
            <ItemValue>Automatique</ItemValue>

            <p>
              En passant par HelloAsso vous recevrez automatiquement votre reçu
              fiscal par mail
            </p>
          </li>

          <li>
            <ItemValue>Manuel</ItemValue>

            <p>
              En passant par les autres options vous devrez envoyer par email à{" "}
              <ContactLink href="mailto:contact@animeaux.org">
                contact@animeaux.org
              </ContactLink>{" "}
              vos coordonnées, montant et date du don
            </p>
          </li>
        </List>
      </Section>
    </main>
  );
};

DonationPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default DonationPage;

const sectionPadding = css`
  padding: var(--spacing-7xl) var(--content-margin);
`;

const DescriptionSection = styled.section`
  ${sectionPadding}
  text-align: center;
`;

const Section = styled.section<{
  $alternateBackground?: boolean;
}>`
  ${sectionPadding};
  text-align: center;
  background-image: ${(props) =>
    props.$alternateBackground ? "var(--blue-gradient)" : "none"};
`;

const SectionParagraph = styled.p`
  text-align: center;
  margin-bottom: var(--spacing-4xl);
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: var(--spacing-4xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
`;

const CallToAction = styled(CallToActionLink)`
  margin-top: var(--spacing-4xl);
`;

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-6xl);
  align-items: flex-start;
`;

const ItemValue = styled.h3`
  margin-bottom: var(--spacing-2xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
`;

const AsideSection = styled.section<{ $alternateBackground?: boolean }>`
  ${sectionPadding};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-4xl);
  align-items: center;
  text-align: center;
  background-image: ${(props) =>
    props.$alternateBackground ? "var(--blue-gradient)" : "none"};
`;

const AsideImage = styled(StaticImage)<{ $contain?: boolean }>`
  width: 100%;
  height: 200px;
  object-fit: ${(props) => (props.$contain ? "contain" : "cover")};
  border-radius: var(--border-radius-m);

  @media (min-width: 800px) {
    height: 400px;
  }
`;

const AsideSmallImage = styled(StaticImage)`
  margin-bottom: var(--spacing-xl);
  width: 100%;
  height: 100px;
  object-fit: contain;
  border-radius: var(--border-radius-m);
`;

const AsideSmallIcon = styled.span`
  margin-bottom: var(--spacing-xl);
  height: 100px;
  font-size: var(--font-size-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactLink = styled(Link)`
  color: var(--blue-medium);

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
`;
