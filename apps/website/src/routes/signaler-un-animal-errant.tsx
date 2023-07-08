import { V2_MetaFunction } from "@remix-run/react";
import { cn } from "~/core/classNames";
import { getConfigFromMetaMatches } from "~/core/config";
import { createCloudinaryUrl, DynamicImage } from "~/core/dataDisplay/image";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  MarkdownLink,
} from "~/core/dataDisplay/markdown";
import {
  RelatedSection,
  RelatedSectionList,
  RelatedSectionTitle,
} from "~/core/layout/relatedSection";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { WarnItem } from "~/warn/item";

const IMAGE_ID = "blog/a2bf3ad2-a475-4c63-8f30-fd29928c8fa3";

export const meta: V2_MetaFunction = ({ matches }) => {
  const config = getConfigFromMetaMatches(matches);
  return createSocialMeta({
    title: getPageTitle("Signaler un animal errant"),
    imageUrl: createCloudinaryUrl(config.cloudinaryName, IMAGE_ID, {
      size: "1024",
      aspectRatio: "16:9",
    }),
  });
};

export default function Route() {
  return (
    <>
      <main className="w-full px-article flex flex-col gap-12">
        <header className="flex flex-col">
          <h1
            className={cn("text-title-hero-small", "md:text-title-hero-large")}
          >
            Signaler un animal errant
          </h1>
        </header>

        <DynamicImage
          imageId={IMAGE_ID}
          alt="Signaler un animal errant"
          sizes={{ lg: "1024px", default: "100vw" }}
          fallbackSize="1024"
          className={cn(
            "w-full aspect-4/3 flex-none rounded-bubble-md",
            "sm:rounded-bubble-lg",
            "md:rounded-bubble-xl"
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
            to="/informer-d-un-acte-de-maltraitance"
            image="blog/bd9dec91-45da-4064-9053-536b5a9b61c3"
            title="Informer d’un acte de maltraitance"
            description="Si vous êtes témoin d'un acte de mauvais traitement ou de cruauté envers un animal, il vous faut agir."
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

const CONTENT = `Vous avez trouvé un animal dans la rue et vous ne savez pas comment agir ?
**Ne vous précipitez pas !**

Il se peut que l’animal appartienne à un riverain, et soit simplement en balade pour un chat, ou égaré pour un chien.
Prenez le temps de l’observer :

A-t-il un collier ?
Est-il tatoué ?
Si ce n’est pas le cas, l’idéal est de vous rendre chez un vétérinaire avec l’animal afin de vérifier s’il est identifié par puce électronique, c’est gratuit.

S’il s’agit d’un chaton, il se peut que sa fratrie et sa maman ne soient pas loin. Nous vous invitons à patienter en discrétion afin de vous assurer de sa situation.
Si la maman est présente, ainsi que le reste de la fratrie, nous préférons mettre toute la petite famille à l’abri !

Dans le cas où l’animal semble mal en point ou blessé, n’attendez pas et conduisez-le directement chez le vétérinaire le plus proche. **Sa vie peut en dépendre**.

Dans tous les cas, vous pouvez remplir [ce formulaire](${MarkdownLink.PICK_UP_FORM}) en étant le plus précis possible.

Notre équipe prendra contact avec vous dans les meilleurs délais, en fonction de l’urgence de la situation.
N’hésitez pas également à nous contacter par mail à [contact@animeaux.org](mailto:contact@animeaux.org) ou sur les [réseaux sociaux](${MarkdownLink.FACEBOOK}).`;
