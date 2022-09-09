import { cn } from "~/core/classNames";
import { DynamicImage } from "~/dataDisplay/image";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  MarkdownLink,
} from "~/dataDisplay/markdown";

export default function AbandonPage() {
  return (
    <main className="w-full px-article flex flex-col gap-12">
      <header className={cn("px-4 flex flex-col", "md:px-0")}>
        <h1 className={cn("text-title-hero-small", "md:text-title-hero-large")}>
          Abandonner votre animal
        </h1>
      </header>

      <DynamicImage
        shouldFill
        imageId="blog/2bf99fd0-da8b-4326-b7fa-d2a0eaa8ecc6"
        alt="Abandonner votre animal"
        sizes={{ lg: "1024px", default: "100vw" }}
        fallbackSize="1024"
        className="w-full aspect-4/3 flex-none rounded-bubble-ratio"
      />

      <article>
        <Markdown components={ARTICLE_COMPONENTS}>{CONTENT}</Markdown>
      </article>
    </main>
  );
}

const CONTENT = `**En êtes-vous certain ?**

Les problèmes de comportement et/ou de propreté sont souvent à l’origine d’un mal-être de votre animal et peuvent souvent être corrigés avec des solutions adéquates mises en place pour les aider à aller mieux.

En cas de déménagement, une adaptation est toujours nécessaire car celui-ci est source de stress pour vous, mais aussi pour lui. Là encore, des **solutions peuvent être trouvées** pour l’accompagner au mieux dans ce changement de vie.

Et bien sûr, des **systèmes de garde** durant vos vacances sont possibles ! Ces gardes peuvent même être effectuées par l’équipe Ani’Meaux en fonction des disponibilités des bénévoles.

**Vous souhaitez poursuivre votre démarche ?** Bien que ni lui ni nous sommes enjoués par la nouvelle, là encore, nous vous proposons une solution.

Il est idéal de **passer par une association** pour que votre petit compagnon puisse être placée dans une famille qui lui convient le mieux et afin qu’il soit suivi tout au long de sa vie.

Pour se faire, il nous faut toutes les informations le concernant, et ce, de façon la plus précise possible.

Nous vous invitons à remplir [ce formulaire](${MarkdownLink.PICK_UP_FORM}) détaillé pour faciliter notre recherche de famille.

**N’oubliez pas les photos !** Celles-ci sont importantes.

Notre équipe prendra contact avec vous dans les meilleurs délais, en fonction de l’urgence de la situation.
N’hésitez pas également à nous contacter par mail à [contact@animeaux.org](mailto:contact@animeaux.org) ou sur les [réseaux sociaux](${MarkdownLink.FACEBOOK}).`;
