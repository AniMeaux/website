import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Config, useConfig } from "~/core/config";
import { Icon, IconProps } from "~/generated/icon";
import { questionsImages } from "~/images/questions";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export default function FaqPage() {
  const config = useConfig();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={questionsImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Foire aux questions</HeroSectionTitle>

          <HeroSectionParagraph>
            Retrouvez ici les réponses aux questions fréquemment posées
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <section className="flex">
        <ul
          className={cn(
            "w-full grid grid-cols-1 grid-rows-[auto] gap-6",
            "sm:grid-cols-2",
            "md:grid-cols-3"
          )}
        >
          {FAQ.map((faq) => (
            <li
              key={faq.question}
              className="px-4 py-3 flex flex-col items-start gap-6"
            >
              <span
                className={cn(
                  "rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg p-3 bg-opacity-5 flex items-center justify-center text-[40px]",
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
  blue: "bg-blue-base text-blue-base",
  cyan: "bg-cyan-base text-cyan-base",
  green: "bg-green-base text-green-base",
  red: "bg-red-base text-red-base",
  yellow: "bg-yellow-base text-yellow-darker",
};

const FAQ: Faq[] = [
  {
    icon: "handHoldingEuro",
    color: "yellow",
    question: "L'entrée est-elle payante ?",
    answer: ({ ticketingUrl }) => (
      <>
        Montant de l'entrée : don libre d'un minimum de 2€, gratuit pour les
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
        Les bénéfices générés par les billets d'entrée seront reversés aux
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
        le carnet de santé et les papiers d'identification à l'entrée du salon.
        Ces derniers doivent à jour.
        <br />
        Ceci permettra d'assurer la sécurité de tous les animaux présents durant
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
        L'espace restauration du FoodTruck se trouve à l'extérieur du bâtiment,
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
        Bien sûr, l'implantation du salon a été conçue afin qu'il soit
        accessible à tous.
      </>
    ),
  },
  {
    icon: "houseChimneyPaw",
    color: "cyan",
    question: "Y aura-t-il des animaux à l'adoption ?",
    answer: () => (
      <>
        Les associations présentes durant le salon auront la possibilité d'être
        accompagnées de chiens à l'adoption.
      </>
    ),
  },
];
