import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { StaticImage } from "~/dataDisplay/image";
import { CallToActionLink } from "~/layout/callToAction";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";
import styled, { css } from "styled-components";

const TITLE = "Devenir bénévole";

const VolunteersPage: PageComponent = () => {
  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader
        title={TITLE}
        largeImage="/volunteers.jpg"
        smallImage="/volunteers.jpg"
      />

      <DescriptionSection>
        <p>
          Devenir bénévole vous permettra de contribuer aux{" "}
          <strong>sauvetages des animaux</strong> en difficulté que nous sommes
          amenés à prendre sous notre aile
        </p>
      </DescriptionSection>

      <TypesSection>
        <TypeList>
          <TypeItem>
            <TypeTitle>Adhérent simple</TypeTitle>

            <TypePrice>
              <span>30 €</span>
              <TypeRecurrence>/ par an</TypeRecurrence>
            </TypePrice>

            <p>
              Pour les personnes n'ayant pas la possibilité de beaucoup
              participer mais souhaitant nous soutenir.
            </p>
          </TypeItem>

          <TypeItem>
            <TypeTitle>Adhérent actif</TypeTitle>

            <TypePrice>
              <span>15 €</span>
              <TypeRecurrence>/ par an</TypeRecurrence>
            </TypePrice>

            <p>
              Pour les personnes souhaitant s'investir et participer à au moins
              une mission par mois.
            </p>
          </TypeItem>
        </TypeList>

        <CallToAction
          href="https://www.helloasso.com/associations/ani-meaux/adhesions/devenir-benevole-de-l-association-ani-meaux"
          color="blue"
        >
          Postuler sur HelloAsso
        </CallToAction>
      </TypesSection>

      <MissionsSection>
        <MissionsSectionTitle>Missions des bénévoles</MissionsSectionTitle>

        <MissionList>
          <MissionItem>
            <MissionImage
              alt="Collecte alimentaire"
              largeImage="/food-collection.jpg"
              smallImage="/food-collection.jpg"
            />

            <MissionDescription>
              <MissionTitle>Collecte alimentaire</MissionTitle>
              <p>
                Nous réalisons plusieurs fois par an des collectes alimentaires
                dans les animaleries proches de Meaux. Il s’agit également de
                collecter de la litière ou tout autre matériel utile pour nos
                protégés en famille d’accueil.
              </p>
            </MissionDescription>
          </MissionItem>

          <MissionItem>
            <MissionImage
              alt="Covoiturage"
              largeImage="/carpool@2x.jpg"
              smallImage="/carpool.jpg"
            />

            <MissionDescription>
              <MissionTitle>Covoiturage</MissionTitle>
              <p>
                Nous avons régulièrement besoin de covoiturages pour aller
                récupérer des animaux dans le besoin et les emmener dans leur
                famille d’accueil. Ponctuellement, nos familles d’accueil ont
                besoin qu’on leur dépose du matériel ou de la nourriture
                (fournis par l’association).
              </p>
              <p>
                Certaines familles n’étant pas véhiculées, elles auront besoin
                qu’on emmène leurs petits protégés chez nos vétérinaires
                partenaires pour leur mise en règle ou pour des soins.
              </p>
            </MissionDescription>
          </MissionItem>

          <MissionItem>
            <MissionImage
              alt="Sensibilisation"
              largeImage="/intervention@2x.jpg"
              smallImage="/intervention.jpg"
            />

            <MissionDescription>
              <MissionTitle>Sensibilisation</MissionTitle>
              <p>
                Nous réalisons régulièrement des interventions au sein des
                écoles et les centres aérés afin de sensibiliser les plus jeunes
                à notre cause.
              </p>
              <p>
                Des interventions dans les lieux publics comme les centres
                commerciaux ou encore dans les lieux privés sont également
                réalisables toujours en vue de sensibiliser autour de la cause
                animale.
              </p>
            </MissionDescription>
          </MissionItem>

          <MissionItem>
            <MissionImage
              alt="Organisation d'événements"
              largeImage="/event@2x.jpg"
              smallImage="/event.jpg"
            />

            <MissionDescription>
              <MissionTitle>Organisation d'événements</MissionTitle>
              <p>
                Dès que la situation nous le permettra, nous organiserons à
                nouveau des évènements comme les salons, forums... Un support
                pour l’organisation de ces événements est toujours utile.
              </p>
            </MissionDescription>
          </MissionItem>

          <MissionItem>
            <MissionImage
              alt="Missions de terrain"
              largeImage="/field-mission.jpg"
              smallImage="/field-mission.jpg"
            />

            <MissionDescription>
              <MissionTitle>Missions de terrain</MissionTitle>
              <p>
                Des missions de trappage pour les chats errants sont organisées
                afin de les mettre en règle et de les stériliser, que ce soit
                sur la commune de Meaux ou dans les communes alentours avec
                lesquelles nous avons des conventions. Sur le terrain, il est
                également possible de mener des enquêtes pour maltraitance, ou
                bien d’agir en urgence pour un animal en détresse.
              </p>
            </MissionDescription>
          </MissionItem>

          <MissionItem>
            <MissionImage
              alt="Communication"
              largeImage="/communication@2x.jpg"
              smallImage="/communication.jpg"
            />

            <MissionDescription>
              <MissionTitle>Communication</MissionTitle>
              <p>
                Nous recherchons des bénévoles pouvant rédiger des articles sur
                différents sujets autour du bien-être animal.
              </p>
              <p>
                Les designers et photographes bénévoles sont également les
                bienvenus pour nous aider à développer notre communication et
                apporter toujours plus de visibilité à nos protégés.
              </p>
            </MissionDescription>
          </MissionItem>

          <MissionItem>
            <MissionImage
              alt="Administratif"
              largeImage="/accounting@2x.jpg"
              smallImage="/accounting.jpg"
            />

            <MissionDescription>
              <MissionTitle>Administratif</MissionTitle>
              <p>
                Les bénévoles les plus éloignés peuvent aider à distance
                notamment avec la partie administrative autour de la gestion des
                adoptions par exemple, le classement de documents, la mise à
                jour du site internet, le suivi des dossiers avec les
                administrations...
              </p>
            </MissionDescription>
          </MissionItem>
        </MissionList>
      </MissionsSection>
    </main>
  );
};

VolunteersPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default VolunteersPage;

const sectionPadding = css`
  padding: var(--spacing-7xl) var(--content-margin);
`;

const DescriptionSection = styled.section`
  ${sectionPadding};
  text-align: center;
`;

const TypesSection = styled.section`
  ${sectionPadding};
  background-image: var(--blue-gradient);
  text-align: center;
`;

const TypeList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  gap: var(--spacing-6xl);
  align-items: stretch;
`;

const TypeItem = styled.li`
  background: white;
  padding: var(--spacing-3xl);
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-l);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TypeTitle = styled.h3`
  margin-bottom: var(--spacing-xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
`;

const TypePrice = styled.p`
  margin-bottom: var(--spacing-4xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
  display: inline-flex;
  align-items: flex-end;
  justify-content: flex-start;
`;

const TypeRecurrence = styled.span`
  font-size: var(--font-size-m);
  line-height: var(--line-height-m);
  font-weight: var(--font-weight-medium);
`;

const CallToAction = styled(CallToActionLink)`
  margin-top: var(--spacing-6xl);
`;

const MissionsSection = styled.section`
  ${sectionPadding};
`;

const MissionsSectionTitle = styled.h2`
  margin-bottom: var(--spacing-4xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-xl);
`;

const MissionList = styled.ul`
  & > *:not(:first-child) {
    margin-top: var(--spacing-4xl);
  }
`;

const MissionItem = styled.li`
  @media (min-width: 800px) {
    display: flex;
    align-items: flex-start;
  }
`;

const MissionImage = styled(StaticImage)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius-m);

  @media (min-width: 800px) {
    flex: none;
    width: 200px;
  }
`;

const MissionDescription = styled.div`
  @media (max-width: 799px) {
    margin-top: var(--spacing-xl);
  }

  @media (min-width: 800px) {
    flex: 1;
    margin-left: var(--spacing-4xl);
  }
`;

const MissionTitle = styled.h3`
  margin-bottom: var(--spacing-xl);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
`;
