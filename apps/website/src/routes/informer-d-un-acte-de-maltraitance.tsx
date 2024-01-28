import { getConfigFromMetaMatches } from "#core/config";
import { createCloudinaryUrl, DynamicImage } from "#core/dataDisplay/image";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  MarkdownLink,
} from "#core/dataDisplay/markdown";
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "#core/layout/relatedSection";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/pageTitle";
import { WarnItem } from "#warn/item";
import { cn } from "@animeaux/core";
import type { MetaFunction } from "@remix-run/node";

const IMAGE_ID = "blog/bd9dec91-45da-4064-9053-536b5a9b61c3";

export const meta: MetaFunction = ({ matches }) => {
  const config = getConfigFromMetaMatches(matches);
  return createSocialMeta({
    title: getPageTitle("Informer d’un acte de maltraitance"),
    imageUrl: createCloudinaryUrl(config.cloudinaryName, IMAGE_ID, {
      size: "1024",
      aspectRatio: "16:9",
    }),
  });
};

export default function Route() {
  return (
    <>
      <main className="flex w-full flex-col gap-12 px-article">
        <header className="flex flex-col">
          <h1
            className={cn("text-title-hero-small", "md:text-title-hero-large")}
          >
            Informer d’un acte de maltraitance
          </h1>
        </header>

        <DynamicImage
          imageId={IMAGE_ID}
          alt="Informer d’un acte de maltraitance"
          sizes={{ lg: "1024px", default: "100vw" }}
          fallbackSize="1024"
          className={cn(
            "aspect-4/3 w-full flex-none rounded-bubble-md",
            "sm:rounded-bubble-lg",
            "md:rounded-bubble-xl",
          )}
        />

        <article>
          <Markdown components={ARTICLE_COMPONENTS}>{CONTENT}</Markdown>
        </article>
      </main>

      <RelatedSection>
        <RelatedSectionTitle>Voir aussi</RelatedSectionTitle>

        <RelatedSectionList>
          <WarnItem
            to="/signaler-un-animal-errant"
            image="blog/a2bf3ad2-a475-4c63-8f30-fd29928c8fa3"
            title="Signaler un animal errant"
            description="Vous avez trouvé un animal dans la rue et vous ne savez pas comment agir ?"
          />

          <WarnItem
            to="/abandonner-votre-animal"
            image="blog/2bf99fd0-da8b-4326-b7fa-d2a0eaa8ecc6"
            title="Abandonner votre animal"
            description="En êtes-vous certain ? Pour se faire, il nous faut toutes les informations le concernant, et ce, de façon la plus précise possible."
          />
        </RelatedSectionList>
      </RelatedSection>
    </>
  );
}

const CONTENT = `Si vous êtes témoin d’un acte de mauvais traitement ou de cruauté envers un animal, **il vous faut agir**.

- Appelez les forces de l’ordre en priorité.
- Prenez des photos / vidéos / enregistrements pour preuve
- Notez toutes les informations utiles (apparence de l’animal, comportement de l’animal, nom des propriétaires ou des personnes en cause, adresse des faits…)

**Un animal maltraité est un animal en danger**. Ne fermez pas les yeux, c’est peut-être la dernière fois qu’un humain s’inquiètera pour lui.

Dans tous les cas, vous pouvez remplir [ce formulaire](${MarkdownLink.PICK_UP_FORM}) en étant le plus précis possible, sans oublier de joindre des photos.

Notre équipe prendra contact avec vous dans les meilleurs délais, en fonction de l’urgence de la situation.
N’hésitez pas également à nous contacter par mail à [enquetes@animeaux.org](mailto:enquetes@animeaux.org) ou sur les [réseaux sociaux](${MarkdownLink.FACEBOOK}).`;
