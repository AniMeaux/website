import { MetaFunction } from "@remix-run/node";
import { cn } from "~/core/classNames";
import { Config, useConfig } from "~/core/config";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { ARTICLE_COMPONENTS, Markdown } from "~/dataDisplay/markdown";

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Mentions légales") });
};

export default function LegalNoticePage() {
  const config = useConfig();

  return (
    <main className="w-full px-article flex flex-col gap-12">
      <header className="flex flex-col gap-6">
        <h1 className={cn("text-title-hero-small", "md:text-title-hero-large")}>
          Mentions légales
        </h1>

        <p className="text-gray-500">En vigueur au 19/09/2023</p>
      </header>

      <article>
        <Markdown components={ARTICLE_COMPONENTS}>
          {getContent(config)}
        </Markdown>
      </article>
    </main>
  );
}

function getContent({ publicHost }: Config) {
  return `Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs, ci-après l’**"Utilisateur"**, du site ${publicHost}, ci-après le **"Site"**, les présentes mentions légales.

La connexion et la navigation sur le Site par l’Utilisateur implique acceptation intégrale et sans réserve des présentes mentions légales.

## Article 1 - L’Editeur

L’édition et la direction de la publication du Site est assurée par Relet Simon, domiciliée 30 Rue Pierre Brasseur, 77100 Meaux, dont le numéro de téléphone est 0612194392, et l’adresse e-mail website@animeaux.org.

Ci-après l’**"Editeur"**.

## Article 2 - L’Hebergeur

L’hébergeur du Site est la société Fly.io, dont le siège social est situé au 321 N Clark St Suite 2550, Chicago, IL 60654, United States, avec le numéro de téléphone : 13126264490.

## Article 3 - Acces Au Site

Le Site est accessible en tout endroit, 7j/7, 24h/24 sauf cas de force majeure, interruption programmée ou non et pouvant découlant d’une nécessité de maintenance.

En cas de modification, interruption ou suspension du Site, l’Editeur ne saurait être tenu responsable.

## Article 4 - Collecte Des Donnees

Le site est exempté de déclaration à la Commission Nationale Informatique et Libertés (CNIL) dans la mesure où il ne collecte aucune donnée concernant les utilisateurs.

Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie du Site, sans autorisation de l’Editeur est prohibée et pourra entraînée des actions et poursuites judiciaires telles que notamment prévues par le Code de la propriété intellectuelle et le Code civil.`;
}
