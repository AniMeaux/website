import { orderBy } from "es-toolkit/array"

export type Partner = {
  id: string
  name: string
  url: string
  description: string
  image: string
}

export const partners: Partner[] = orderBy(
  [
    {
      id: "f2f1be4f-884e-4ece-9590-4a1250620bd8",
      image: "partners/beb4fe14-0258-40f9-9fbb-659db8746759",
      name: "Anidéo",
      description:
        "Anidéo est l’entreprise de services au animaux de compagnie sur le secteur de Marne-la-Vallée ! Elle vous propose trois types de prestations sur un large secteur, 7 jours/7, de 8h à 20h : transport de votre animal (avec ou sans vous), visites et/ou gardes à votre domicile pendant votre absence et promenades canines.",
      url: "https://www.anideo.fr",
    },
    {
      id: "13003230-b043-410d-9a8d-2973b8ca3f95",
      image: "partners/f1074c24-b9d7-4d26-aead-239d558cce1f",
      name: "Cou d'éclat",
      description:
        "Cou d’éclat propose des médailles en laiton personnalisées et des accessoires sur-mesure pour animaux et leurs dogparents, fabriqués en France. **1 € est reversé à notre association pour chaque commande !**",
      url: "https://coudeclatmedailles.com/",
    },
    {
      id: "fa9bb889-09ea-49d9-adbf-229576355d44",
      image: "partners/aee9044c-93b1-4597-9c0e-17097b26ef23",
      name: "Jérémy Dog Coach",
      description:
        "Jérémy est un éducateur et comportementaliste canin en méthodes positives, engagé dans le bien-être du chien et l’accompagnement bienveillant des familles.",
      url: "https://jeremydogcoach.com/",
    },
    {
      id: "92a23125-5520-46ae-97f6-6108df513977",
      image: "partners/9fa78dca-24d1-4734-80b6-56bf0c5b1075",
      name: "MaxiZoo",
      description:
        "Maxi Zoo, votre destination préférée pour les besoins de vos animaux de compagnie. En plus de proposer une large gamme de produits de qualité, Maxi Zoo nous soutient en nous accueillant pour des collectes pour nos protégés.",
      url: "https://www.maxizoo.fr/stores/maxi-zoo-mareuil-les-meaux",
    },
    {
      id: "50568b9a-a8b1-4fcc-a5e6-d1b7632a6ee5",
      image: "partners/3005dd4b-92c9-471b-8951-97a2dfdccc61",
      name: "JF Animalerie",
      description:
        "Boutique en ligne de friandises naturelles et d’articles de mastication pour chiens et chats, à nos côtés toute l’année et au Salon des Ani’Meaux. Avec **PRANIMEAUX** : 10 € offerts dès 40 € d’achat sur votre première commande et 10 € reversés à l’association. Avec **ANIMEAUX15** : 15 % de réduction sur chaque commande et 5 % reversés à Ani’Meaux.",
      url: "https://jfanimalerie.fr",
    },
    {
      id: "2fdf721d-af4a-43f7-b470-ed861c89716a",
      image: "partners/90d92c5f-4902-4bd5-a4a4-9cd9c107ada1",
      name: "Noirpink",
      description:
        "Salon de tatouage et maquillage permanent privé à Isles-lès-Villenoy. Un soutien fidèle qui nous accompagne toute l’année par des dons réguliers et répond présent à chaque Salon des Ani’Meaux.",
      url: "https://www.instagram.com/noirpink.tattoo",
    },
    {
      id: "78ec944b-93fe-4540-aac3-e431b924c70c",
      image: "partners/ce3deb79-c494-400c-9a63-3d18cad27591",
      name: "Hôtel L'Elysée",
      description:
        "Près de Disneyland Paris, l’Hôtel l’Elysée Val d’Europe accueille ses hôtes dans une ambiance chaleureuse, avec son restaurant Le George et son bar Le Diplomate où l’on aime se poser autour d’un verre. Chaque année, pendant un mois, une partie des ventes d’un cocktail signature est reversée à Ani’Meaux.",
      url: "https://www.hotelelysee.com/fr/",
    },
  ],
  [(partner) => partner.name.toLowerCase()],
  ["asc"],
)
