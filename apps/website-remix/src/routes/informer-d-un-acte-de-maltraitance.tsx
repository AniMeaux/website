import { cn } from "~/core/classNames";
import { DynamicImage } from "~/dataDisplay/image";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  MarkdownLink,
} from "~/dataDisplay/markdown";

export default function AbusePage() {
  return (
    <main className="w-full px-article flex flex-col gap-12">
      <header className={cn("px-4 flex flex-col", "md:px-0")}>
        <h1 className={cn("text-title-hero-small", "md:text-title-hero-large")}>
          Informer d’un acte de maltraitance
        </h1>
      </header>

      <DynamicImage
        shouldFill
        imageId="blog/bd9dec91-45da-4064-9053-536b5a9b61c3"
        alt="Informer d’un acte de maltraitance"
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

const CONTENT = `Si vous êtes témoin d’un acte de mauvais traitement ou de cruauté envers un animal, **il vous faut agir**.

- Appelez les forces de l’ordre en priorité.
- Prenez des photos / vidéos / enregistrements pour preuve
- Notez toutes les informations utiles (apparence de l’animal, comportement de l’animal, nom des propriétaires ou des personnes en cause, adresse des faits…)

**Un animal maltraité est un animal en danger**. Ne fermez pas les yeux, c’est peut-être la dernière fois qu’un humain s’inquiètera pour lui.

Dans tous les cas, vous pouvez remplir [ce formulaire](${MarkdownLink.PICK_UP_FORM}) en étant le plus précis possible, sans oublier de joindre des photos.

Notre équipe prendra contact avec vous dans les meilleurs délais, en fonction de l’urgence de la situation.
N’hésitez pas également à nous contacter par mail à [enquetes@animeaux.org](mailto:enquetes@animeaux.org) ou sur les [réseaux sociaux](${MarkdownLink.FACEBOOK}).`;
