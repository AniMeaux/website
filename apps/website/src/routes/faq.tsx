import { actionClassNames } from "#core/actions";
import { BaseLink } from "#core/baseLink";
import { getConfigFromMetaMatches } from "#core/config";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "#core/layout/heroSection";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/pageTitle";
import type { IconProps } from "#generated/icon";
import { Icon } from "#generated/icon";
import { questionsImages } from "#images/questions";
import { socialImages } from "#images/social";
import { cn } from "@animeaux/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const config = getConfigFromMetaMatches(matches);
  return createSocialMeta({
    title: getPageTitle("Foire aux questions"),
    imageUrl: `${config.publicHost}${socialImages.faq.imagesBySize[1024]}`,
  });
};

export default function Route() {
  return (
    <main className="flex w-full flex-col gap-24 px-page">
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={questionsImages} loading="eager" />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Foire aux questions</HeroSectionTitle>

          <HeroSectionParagraph>
            Retrouvez ici les réponses aux questions fréquemment posées.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <section className="flex">
        <ul
          className={cn(
            "grid w-full grid-cols-1 gap-12",
            "sm:grid-cols-2",
            "md:grid-cols-3",
          )}
        >
          {FAQ.map((faq) => (
            <li key={faq.question} className="flex flex-col items-start gap-6">
              <span
                className={cn(
                  "flex items-center justify-center p-3 text-[40px] rounded-bubble-sm",
                  ICON_COLOR_CLASS_NAME[faq.color],
                )}
              >
                <Icon id={faq.icon} />
              </span>

              <h2 className="text-title-item">{faq.question}</h2>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

type Faq = {
  icon: IconProps["id"];
  color: "blue" | "green" | "yellow" | "red" | "cyan";
  question: string;
  answer: React.ReactNode;
};

const ICON_COLOR_CLASS_NAME: Record<Faq["color"], string> = {
  blue: "bg-brandBlue-lightest text-brandBlue",
  cyan: "bg-brandCyan-lightest text-brandCyan",
  green: "bg-brandGreen-lightest text-brandGreen",
  red: "bg-brandRed-lightest text-brandRed",
  yellow: "bg-brandYellow-lightest text-brandYellow-darker",
};

const FAQ: Faq[] = [
  {
    icon: "shieldPaw",
    color: "yellow",
    question: "Quelle est votre mission ?",
    answer: (
      <>
        L’association Ani’Meaux a pour but de prendre en charge les animaux
        errants, abandonnés ou maltraités pour les soigner et leur offrir une
        nouvelle chance dans la vie en leur trouvant une famille d’adoption.
      </>
    ),
  },
  {
    icon: "locationDot",
    color: "red",
    question: "Quelle est votre zone d’intervention ?",
    answer: (
      <>
        Nous intervenons majoritairement en Seine-et-Marne, et plus précisément
        au sein de la Communauté d’Agglomération du Pays de Meaux.
      </>
    ),
  },
  {
    icon: "commentsQuestion",
    color: "blue",
    question: "Où peut-on venir vous rencontrer ?",
    answer: (
      <>
        Notre association ne disposant pas de locaux ou de bureaux, vous pourrez
        nous retrouver lors de{" "}
        <BaseLink to="/evenements" className={actionClassNames.proseInline()}>
          nos évènements
        </BaseLink>
        .
      </>
    ),
  },
  {
    icon: "houseChimneyPaw",
    color: "green",
    question: "Où vont les animaux lorsque vous les prenez en charge ?",
    answer: (
      <>
        Notre association ne dispose pas de refuge ni de locaux ou bureaux.
        <br />
        <br />
        Nos protégés sont placés au sein de familles d’accueil bénévoles
        adaptées à leurs besoins jusqu’à ce qu’ils trouvent une famille
        d’adoption.
      </>
    ),
  },
  {
    icon: "bookHeart",
    color: "cyan",
    question: "Quelles sont les conditions et les frais d’adoption ?",
    answer: (
      <>
        Vous pouvez consulter nos{" "}
        <BaseLink
          to="/conditions-d-adoption"
          className={actionClassNames.proseInline()}
        >
          conditions d’adoption
        </BaseLink>
        .
        <br />
        <br />
        Étant tous en familles d’accueil, vous pourrez rencontrer l’élu de votre
        cœur sur rendez-vous si votre profil semble compatible d’après le
        formulaire que vous aurez rempli au préalable.
      </>
    ),
  },
  {
    icon: "boxHeart",
    color: "green",
    question:
      "J’ai du matériel ou de l’alimentation à vous donner, où vous les déposer ?",
    answer: (
      <>
        Nous disposons d’un espace de dons au sein de la{" "}
        <BaseLink
          to="https://jardineriepoullain.fr"
          className={actionClassNames.proseInline()}
        >
          Jardinerie Poullain
        </BaseLink>{" "}
        de Mareuil-lès-Meaux ainsi qu’au sein de l’animalerie{" "}
        <BaseLink
          to="https://www.maxizoo.fr/stores/maxi-zoo-mareuil-les-meaux"
          className={actionClassNames.proseInline()}
        >
          MaxiZoo
        </BaseLink>{" "}
        de Mareuil-lès-Meaux.
        <br />
        <br />
        Vous pouvez aussi nous retrouver lors de{" "}
        <BaseLink to="/evenements" className={actionClassNames.proseInline()}>
          nos évènements
        </BaseLink>{" "}
        comme nos collectes.
      </>
    ),
  },
  {
    icon: "handHoldingHeart",
    color: "yellow",
    question: "Comment vous aider dans votre action ?",
    answer: (
      <>
        Les dons financiers et matériels sont cruciaux pour le bon
        fonctionnement de notre association.
        <br />
        <br />
        Néanmoins, vous pouvez également faire don de votre temps pour nous
        accompagner dans notre mission au quotidien.
        <br />
        <br />
        Attention cependant, le contact avec les animaux n’est pas quotidien
        dans la mesure où nous n’avons pas de locaux ni de refuge.
      </>
    ),
  },
  {
    icon: "commentsQuestion",
    color: "blue",
    question: "Comment vous contacter ?",
    answer: (
      <>
        Pour toute question relative à un souhait de devenir famille d’accueil
        ou d’adopter, vous pouvez écrire à{" "}
        <BaseLink
          to="mailto:adoption@animeaux.org"
          className={actionClassNames.proseInline()}
        >
          adoption@animeaux.org
        </BaseLink>
        .
        <br />
        <br />
        Pour tout signalement de maltraitance, vous pouvez écrire à{" "}
        <BaseLink
          to="mailto:enquetes@animeaux.org"
          className={actionClassNames.proseInline()}
        >
          enquetes@animeaux.org
        </BaseLink>
        .
        <br />
        <br />
        Pour toute autre interrogation, retrouvez-nous sur les réseaux sociaux
        ou bien écrivez-nous à{" "}
        <BaseLink
          to="mailto:contact@animeaux.org"
          className={actionClassNames.proseInline()}
        >
          contact@animeaux.org
        </BaseLink>
        .
        <br />
        <br />
        Attention : la ligne téléphonique étant régulièrement saturée,
        privilégiez les contacts écrits pour garantir plus de rapidité dans le
        traitement de votre demande.
      </>
    ),
  },
];
