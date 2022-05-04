import {
  FaCheck,
  FaClipboardCheck,
  FaFileAlt,
  FaHeart,
  FaHome,
  FaReceipt,
  FaTimes,
} from "react-icons/fa";
import styled, { css } from "styled-components";
import { Link } from "~/core/link";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { ChildrenProp } from "~/core/types";
import { StaticImage } from "~/dataDisplay/image";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";

const TITLE = "Conditions d'adoption";

const AdoptionConditionsPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader title={TITLE} />

      <DescriptionSection>
        <p>
          L'adoption est un <strong>acte responsable</strong> et un{" "}
          <strong>engagement</strong> pour toute la vie de l'animal
        </p>
      </DescriptionSection>

      <Section $alternateBackground>
        <SectionTitle>Les étapes d'une adoption</SectionTitle>

        <StepList>
          <StepItem>
            <StepIcon>
              <FaFileAlt />
            </StepIcon>

            <StepContent>
              <StepName>Formulaire</StepName>

              <p>
                Un formulaire d'adoption sera à remplir afin que nous puissions
                mieux vous connaître.
              </p>
            </StepContent>
          </StepItem>

          <StepItem>
            <StepIcon>
              <FaHeart />
            </StepIcon>

            <StepContent>
              <StepName>Rencontre avec l'animal</StepName>

              <p>
                Si votre dossier est retenu, nous organiserons une visite avec
                la famille d’accueil où se trouve l'élu de votre cœur.
              </p>
            </StepContent>
          </StepItem>

          <StepItem>
            <StepIcon>
              <FaClipboardCheck />
            </StepIcon>

            <StepContent>
              <StepName>Pré-visite</StepName>

              <p>
                Un bénévole effectuera une pré-visite chez vous afin de vous
                conseiller au mieux pour l'arrivée de votre futur compagnon et
                de nous assurer de son futur bien-être et de sa sécurité.
              </p>
            </StepContent>
          </StepItem>

          <StepItem>
            <StepIcon>
              <FaHome />
            </StepIcon>

            <StepContent>
              <StepName>Arrivée de l'animal</StepName>
              <p>
                Si votre dossier est validé, nous organiserons l'arrivée de
                l'animal chez vous.
              </p>
            </StepContent>
          </StepItem>
        </StepList>
      </Section>

      <Section>
        <SectionTitle>Les étapes d'une réservation</SectionTitle>

        <SectionParagraph>
          Si un animal est à la réservation c’est qu'il{" "}
          <strong>n’est pas encore en mesure d'être adopté</strong> mais que
          vous pouvez le réserver
        </SectionParagraph>

        <StepList>
          <StepItem>
            <StepIcon>
              <FaFileAlt />
            </StepIcon>

            <StepContent>
              <StepName>Formulaire</StepName>

              <p>
                Un formulaire d'adoption sera à remplir afin que nous puissions
                mieux vous connaître.
              </p>
            </StepContent>
          </StepItem>

          <StepItem>
            <StepIcon>
              <FaHeart />
            </StepIcon>

            <StepContent>
              <StepName>Rencontre avec l'animal</StepName>

              <p>
                Si votre dossier est retenu, nous organiserons une visite avec
                la famille d’accueil où se trouve l'élu de votre cœur.
              </p>
            </StepContent>
          </StepItem>

          <StepItem>
            <StepIcon>
              <FaClipboardCheck />
            </StepIcon>

            <StepContent>
              <StepName>Pré-visite</StepName>

              <p>
                Un bénévole effectuera une pré-visite chez vous afin de vous
                conseiller au mieux pour l'arrivée de votre futur compagnon et
                de nous assurer de son futur bien-être et de sa sécurité.
              </p>
            </StepContent>
          </StepItem>

          <StepItem>
            <StepIcon>
              <FaReceipt />
            </StepIcon>

            <StepContent>
              <StepName>Réservation</StepName>

              <p>
                Pour officialiser la réservation il vous faudra verser la moitié
                des frais d'adoption demandés pour l'animal.
              </p>
            </StepContent>
          </StepItem>

          <StepItem>
            <StepIcon>
              <FaHome />
            </StepIcon>

            <StepContent>
              <StepName>Arrivée de l'animal</StepName>
              <p>
                Si votre dossier est validé, nous organiserons l'arrivée de
                l'animal chez vous lorsqu'il sera en mesure d'être adopté après
                le versement du solde restant dû pour l'adoption.
              </p>
            </StepContent>
          </StepItem>
        </StepList>
      </Section>

      <Section $alternateBackground $large>
        <SectionTitle>Frais pour un chat</SectionTitle>

        <OptionsList>
          <OptionItem>
            <OptionTitle>Sans stérilisation / castration</OptionTitle>
            <OptionPrice>180 €</OptionPrice>

            <p>
              La stérilisation / castration est obligatoire à l'âge de 6 mois,
              un chèque de caution de 150 € vous sera demandé et rendu ou
              détruit, une fois la stérilisation / castration faite
            </p>

            <OptionIncludeList>
              <OptionIncludeItem>Identifié</OptionIncludeItem>
              <OptionIncludeItem>Vacciné (Typhus et Coryza)</OptionIncludeItem>
              <OptionIncludeItem>Déparasité</OptionIncludeItem>
              <OptionIncludeItem exclude>
                Dépistage FIV/FELV à vos frais
              </OptionIncludeItem>

              <OptionIncludeItem exclude>
                Stérilisation / castration à vos frais
              </OptionIncludeItem>
            </OptionIncludeList>
          </OptionItem>

          <OptionItem>
            <OptionTitle>Avec stérilisation / castration</OptionTitle>
            <OptionPrice>250 €</OptionPrice>

            <p>
              Stérilisation / castration comprise en passant par l'un de nos
              vétérinaires partenaires, à faire à l'âge de 6 mois pour les
              chatons ou déjà faite pour les adultes.
            </p>

            <OptionIncludeList>
              <OptionIncludeItem>Identifié</OptionIncludeItem>
              <OptionIncludeItem>Vacciné (Typhus et Coryza)</OptionIncludeItem>
              <OptionIncludeItem>Déparasité</OptionIncludeItem>
              <OptionIncludeItem>Dépisté FIV/FELV</OptionIncludeItem>
              <OptionIncludeItem>Stérilisée / Castré</OptionIncludeItem>
            </OptionIncludeList>
          </OptionItem>

          <OptionItem>
            <OptionTitle>Don libre</OptionTitle>
            <OptionPrice>≥ 50 €</OptionPrice>

            <p>
              <strong>Exclusivement pour un chat de plus de 9 ans</strong>, un
              don libre d'un minimum de 50 € sera demandé
            </p>

            <OptionIncludeList>
              <OptionIncludeItem>Identifié</OptionIncludeItem>
              <OptionIncludeItem>Vacciné (Typhus et Coryza)</OptionIncludeItem>
              <OptionIncludeItem>Déparasité</OptionIncludeItem>
              <OptionIncludeItem>Dépisté FIV/FELV</OptionIncludeItem>
              <OptionIncludeItem>Stérilisée / Castré</OptionIncludeItem>
            </OptionIncludeList>
          </OptionItem>
        </OptionsList>
      </Section>

      <Section $alternateBackground $large>
        <SectionTitle>Frais pour un chien</SectionTitle>

        <OptionsList>
          <OptionItem>
            <OptionTitle>Sans stérilisation / castration</OptionTitle>
            <OptionPrice>200 €</OptionPrice>

            <p>
              La stérilisation / castration est obligatoire à l'âge de 6 mois,
              un chèque de caution de 150 € vous sera demandé et rendu ou
              détruit, une fois la stérilisation / castration faite
            </p>

            <OptionIncludeList>
              <OptionIncludeItem>Identifié</OptionIncludeItem>
              <OptionIncludeItem>Vacciné</OptionIncludeItem>
              <OptionIncludeItem>Déparasité</OptionIncludeItem>

              <OptionIncludeItem exclude>
                Stérilisation / castration à vos frais
              </OptionIncludeItem>
            </OptionIncludeList>
          </OptionItem>

          <OptionItem>
            <OptionTitle>Avec castration</OptionTitle>
            <OptionPrice>300 €</OptionPrice>

            <p>
              <strong>Pour un mâle</strong>, la castration est comprise en
              passant par l'un de nos vétérinaires partenaires, à faire à l'âge
              de 6 mois pour les chiots ou déjà faite pour les adultes.
            </p>

            <OptionIncludeList>
              <OptionIncludeItem>Identifié</OptionIncludeItem>
              <OptionIncludeItem>Vacciné</OptionIncludeItem>
              <OptionIncludeItem>Déparasité</OptionIncludeItem>
              <OptionIncludeItem>Castré</OptionIncludeItem>
            </OptionIncludeList>
          </OptionItem>

          <OptionItem>
            <OptionTitle>Avec stérilisation</OptionTitle>
            <OptionPrice>350 €</OptionPrice>

            <p>
              <strong>Pour une femelle</strong>, la stérilisation est comprise
              en passant par l'un de nos vétérinaires partenaires, à faire à
              l'âge de 6 mois pour les chiots ou déjà faite pour les adultes.
            </p>

            <OptionIncludeList>
              <OptionIncludeItem>Identifié</OptionIncludeItem>
              <OptionIncludeItem>Vacciné</OptionIncludeItem>
              <OptionIncludeItem>Déparasité</OptionIncludeItem>
              <OptionIncludeItem>Stérilisée</OptionIncludeItem>
            </OptionIncludeList>
          </OptionItem>

          <OptionItem>
            <OptionTitle>Don libre</OptionTitle>
            <OptionPrice>≥ 50 €</OptionPrice>

            <p>
              <strong>Exclusivement pour un chien de plus de 9 ans</strong>, un
              don libre d'un minimum de 50 € sera demandé
            </p>

            <OptionIncludeList>
              <OptionIncludeItem>Identifié</OptionIncludeItem>
              <OptionIncludeItem>Vacciné</OptionIncludeItem>
              <OptionIncludeItem>Déparasité</OptionIncludeItem>
              <OptionIncludeItem>Stérilisée / Castré</OptionIncludeItem>
            </OptionIncludeList>
          </OptionItem>
        </OptionsList>
      </Section>

      <AsideSection>
        <div>
          <SectionTitle>Encore des questions ?</SectionTitle>

          <p>
            Pour toutes questions relatives à une adoption ou une réservation,
            vous pouvez nous contacter via email à l'adresse{" "}
            <ContactLink href="mailto:adoption@animeaux.org">
              adoption@animeaux.org
            </ContactLink>
            .
          </p>
        </div>

        <div>
          <AsideImage
            largeImage="/question@2x.jpg"
            smallImage="/question.jpg"
            alt="Question ?"
          />
        </div>
      </AsideSection>
    </main>
  );
};

AdoptionConditionsPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default AdoptionConditionsPage;

const sectionPadding = css<{ $large?: boolean }>`
  padding: var(--spacing-7xl)
    ${(props) =>
      props.$large ? "var(--large-content-margin)" : "var(--content-margin)"};
`;

const DescriptionSection = styled.section`
  ${sectionPadding}
  text-align: center;
`;

const Section = styled.section<{
  $alternateBackground?: boolean;
  $large?: boolean;
}>`
  ${sectionPadding};
  background-image: ${(props) =>
    props.$alternateBackground ? "var(--blue-gradient)" : "none"};
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

const AsideImage = styled(StaticImage)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius-m);

  @media (min-width: 800px) {
    height: 400px;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: var(--spacing-4xl);
  text-align: center;
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
`;

const SectionParagraph = styled.p`
  margin-bottom: var(--spacing-4xl);
`;

const StepList = styled.ul`
  margin-top: var(--spacing-6xl);
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  gap: var(--spacing-4xl);
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
`;

const StepIcon = styled.span`
  flex: none;
  margin-right: var(--spacing-l);
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepContent = styled.div``;

const StepName = styled.h3`
  margin-bottom: var(--spacing-m);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
`;

const OptionsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-6xl);
  align-items: stretch;
`;

const OptionItem = styled.li`
  background: white;
  padding: var(--spacing-3xl);
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-l);
  display: flex;
  flex-direction: column;
`;

const OptionTitle = styled.h3`
  margin-bottom: var(--spacing-xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
  text-align: center;
`;

const OptionPrice = styled.p`
  margin-bottom: var(--spacing-4xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
  text-align: center;
`;

const OptionIncludeList = styled.ul`
  margin-top: var(--spacing-3xl);
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  gap: var(--spacing-s);
`;

const OptionIncludeListItem = styled.li`
  display: flex;
  align-items: flex-start;
`;

const OptionIncludeItemIcon = styled.span<{ $exclude: boolean }>`
  margin-right: var(--spacing-m);
  flex: none;
  color: ${(props) => (props.$exclude ? "var(--red)" : "var(--green-medium)")};
  height: calc(var(--line-height-m) * 1em);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function OptionIncludeItem({
  exclude = false,
  children,
}: ChildrenProp & { exclude?: boolean }) {
  return (
    <OptionIncludeListItem>
      <OptionIncludeItemIcon $exclude={exclude}>
        {exclude ? <FaTimes /> : <FaCheck />}
      </OptionIncludeItemIcon>

      <span>{children}</span>
    </OptionIncludeListItem>
  );
}

const ContactLink = styled(Link)`
  color: var(--blue-medium);

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
`;
