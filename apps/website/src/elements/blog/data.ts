import { Article } from "@animeaux/shared-entities/build/article";
import commentChoisirLesBonnesCroquettesPourNosAmisA4Pattes from "./articles/commentChoisirLesBonnesCroquettesPourNosAmisA4Pattes.md";
import lesParasites from "./articles/lesParasites.md";
import nosPerlesNoires from "./articles/nosPerlesNoires.md";
import pourquoiAdopterAnAssociation from "./articles/pourquoiAdopterAnAssociation.md";
import uneGrandeMenacePlaneSurLesAbeilles from "./articles/uneGrandeMenacePlaneSurLesAbeilles.md";

export const articles: Article[] = [
  {
    id: "1",
    title: "Les parasites",
    authorName: "Sara",
    publicationDate: "2019-04-30",
    image: "/articles/tique.jpg",
    slug: "les-parasites",
    description:
      "Nos animaux de compagnie peuvent être la cible de différents parasites qu’il est important de connaître afin de mieux les combattre.",
    content: lesParasites,
  },
  {
    id: "2",
    title: "Une grande menace plane sur les abeilles !",
    authorName: "Sara",
    publicationDate: "2019-04-05",
    image: "/articles/abeilles.jpg",
    slug: "une-grande-menace-plane-sur-les-abeilles",
    description:
      "Depuis quelques années, la population d'abeilles est en très forte diminution, avec une disparition totale sur certaines zones. On vous explique comment ne pas aggraver la situation...",
    content: uneGrandeMenacePlaneSurLesAbeilles,
  },
  {
    id: "3",
    title: "Pourquoi adopter en association ?",
    authorName: "Sara",
    publicationDate: "2019-03-20",
    image: "/articles/dog.jpg",
    slug: "pourquoi-adopter-en-association",
    description:
      "Vous souhaitez agrandir votre famille ? Privilégiez l’adoption en association ! On vous explique pourquoi...",
    content: pourquoiAdopterAnAssociation,
  },
  {
    id: "4",
    title: "Comment choisir les bonnes croquettes pour nos amis à 4 pattes ?",
    authorName: "Sara",
    publicationDate: "2019-03-09",
    image: "/articles/chat-croquettes.jpg",
    slug: "comment-choisir-les-bonnes-croquettes-pour-nos-amis-a-4-pattes",
    description:
      "Choisir les bonnes croquettes pour votre protégé est très important.",
    content: commentChoisirLesBonnesCroquettesPourNosAmisA4Pattes,
  },
  {
    id: "5",
    title: "Nos perles noires",
    authorName: "Sara",
    publicationDate: "2019-02-09",
    image: "/articles/black-cat.jpg",
    slug: "nos-perles-noires",
    description:
      "Les chats noirs sont de véritables perles au sein d'une famille.",
    content: nosPerlesNoires,
  },
];
