import { MetaFunction } from "@remix-run/node";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Config, useConfig } from "~/core/config";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { Icon, IconProps } from "~/generated/icon";
import { questionsImages } from "~/images/questions";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Foire aux questions") });
};

export default function FaqPage() {
  const config = useConfig();

  return (
    <main className="w-full px-page flex flex-col gap-24">
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
            "w-full grid grid-cols-1 grid-rows-[auto] gap-12",
            "sm:grid-cols-2",
            "md:grid-cols-3"
          )}
        >
          {FAQ.map((faq) => (
            <li key={faq.question} className="flex flex-col items-start gap-6">
              <span
                className={cn(
                  "rounded-bubble-sm p-3 flex items-center justify-center text-[40px]",
                  ICON_COLOR_CLASS_NAME[faq.color]
                )}
              >
                <Icon id={faq.icon} />
              </span>

              <h2 className="text-title-item">{faq.question}</h2>
              <p>{faq.answer(config)}</p>
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
  answer: (config: Config) => React.ReactNode;
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
    icon: "handHoldingEuro",
    color: "yellow",
    question: "L’entrée est-elle payante ?",
    answer: ({ ticketingUrl }) => (
      <>
        Montant de l’entrée : don libre d’un minimum de 2 €, gratuit pour les
        moins de 12 ans.
        <br />
        <br />
        Une billetterie en ligne est{" "}
        <BaseLink to={ticketingUrl} className={actionClassNames.proseInline()}>
          accessible ici
        </BaseLink>
        .
        <br />
        <br />
        Les bénéfices générés par les billets d’entrée seront reversés aux
        associations exposantes du salon.
      </>
    ),
  },
  {
    icon: "paw",
    color: "blue",
    question: "Puis-je amener mon animal ?",
    answer: () => (
      <>
        Seuls les chiens sont les bienvenus. Cependant il vous faudra présenter
        le carnet de santé et les papiers d’identification à l’entrée du salon.
        Ces derniers doivent être à jour.
        <br />
        Ceci permettra d’assurer la sécurité de tous les animaux présents durant
        le salon.
      </>
    ),
  },
  {
    icon: "utensils",
    color: "green",
    question: "Est-il possible de se restaurer sur place ?",
    answer: () => (
      <>
        L’espace restauration du FoodTruck se trouve à l’extérieur du bâtiment,
        sur le parvis.
      </>
    ),
  },
  {
    icon: "car",
    color: "red",
    question: "Puis-je me garer facilement ?",
    answer: () => (
      <>
        Vous trouverez un parking gratuit en arrivant devant le Colisée de
        Meaux.
        <br />
        <br />
        <strong className="text-body-emphasis">Attention</strong>, il est
        interdit de laisser vos animaux dans votre véhicule durant le salon.
      </>
    ),
  },
  {
    icon: "accessibleIcon",
    color: "green",
    question: "Le salon est-il accessible aux personnes à mobilité réduite ?",
    answer: () => (
      <>
        Bien sûr, l’implantation du salon a été conçue afin qu’il soit
        accessible à tous.
      </>
    ),
  },
  {
    icon: "houseChimneyPaw",
    color: "cyan",
    question: "Y aura-t-il des animaux à l’adoption ?",
    answer: () => (
      <>
        Les associations présentes durant le salon auront la possibilité d’être
        accompagnées de chiens à l’adoption.
        <br />
        Attention néanmoins, aucune adoption ne sera possible durant le salon.
        La finalisation de l’adoption se fera avec l’association que vous avez
        choisi, en dehors du salon.
      </>
    ),
  },
  {
    icon: "personWalking",
    color: "yellow",
    question: "Puis-je entrer et sortir comme je le souhaite ?",
    answer: () => <>Non, toute sortie est définitive.</>,
  },
  {
    icon: "restroom",
    color: "blue",
    question: "Y a-t-il des toilettes ?",
    answer: () => <>Oui, des toilettes sont mises à disposition du public.</>,
  },
  {
    icon: "clothesHanger",
    color: "green",
    question: "Y a-t-il des vestiaires ?",
    answer: () => <>Aucun vestiaire n’est présent sur place.</>,
  },
  {
    icon: "bagShopping",
    color: "red",
    question: "Pourrais-je acheter des produits sur place ?",
    answer: () => (
      <>
        Oui, les produits présentés sur les stands des professionnels et
        association peuvent être achetés.
        <br />
        Certains exposants sont équipés d’un terminal de paiement, mais nous
        vous conseillons de prévoir des espèces !
      </>
    ),
  },
  {
    icon: "moneyBills",
    color: "yellow",
    question: "Puis-je retirer de l’argent ?",
    answer: () => (
      <>
        Il n’y a pas de distributeur de billets au sein de la salle. Néanmoins,
        de nombreuses banques sont à votre disposition en centre ville de Meaux.
      </>
    ),
  },
  {
    icon: "magnifyingGlass",
    color: "cyan",
    question: "Comment trouver l’exposant qui m’intéresse ?",
    answer: () => (
      <>
        La liste des exposants est disponible dans la page{" "}
        <BaseLink to="/exposants" className={actionClassNames.proseInline()}>
          Exposants
        </BaseLink>
        .
      </>
    ),
  },
  {
    icon: "shieldPaw",
    color: "blue",
    question: "Y a-t-il une garderie animale ?",
    answer: () => (
      <>
        Non, aucune garderie n’est prévue sur le salon. Merci d’anticiper votre
        visite et de ne surtout pas laisser votre compagnon dans votre voiture !
      </>
    ),
  },
  {
    icon: "personChalkboard",
    color: "green",
    question: "Y a-t-il des animations sur le salon ?",
    answer: () => (
      <>
        Oui, le programme des animations est disponible dans la page{" "}
        <BaseLink to="/programme" className={actionClassNames.proseInline()}>
          Programme
        </BaseLink>
        . Nous vous réservons des animations variées et ludiques destinées aux
        familles.
      </>
    ),
  },
];
