import orderBy from "lodash.orderby";

export type Partner = {
  id: string;
  name: string;
  url: string;
  description: string;
  image: string;
};

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
      name: "Jeremy Dog Coach",
      description:
        "Jérémy est un éducateur et comportementaliste canin en méthodes positives, engagé dans le bien-être du chien et l’accompagnement bienveillant des familles.",
      url: "https://jeremydogcoach.com/",
    },
    {
      id: "6042efa7-8dbe-4216-a79e-de3e5f12090b",
      image: "partners/570514db-e012-436a-8e8e-ea40a4299567",
      name: "La vie de nos animaux",
      description:
        "La 1 ère boutique engagée à 200 % dans la protection des animaux ! Découvrez tous ce dont vous avez besoin pour vos chiens et rejoignez une communauté de plus de 2000 maîtres de chiens. Bénéficiez de 10 % de réduction avec le code **animeaux**.",
      url: "http://www.la-vie-de-nos-animaux.fr",
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
      id: "ce96c1c2-687b-4725-8ea7-4b50b6e76cd5",
      image: "partners/b12bb2c3-fcef-4197-981b-55c98d61b99a",
      name: "Super Logo",
      description:
        "En tant que graphiste professionnelle spécialisée dans la **création de logo d’entreprise**, Super Logo vous propose ses services pour la réalisation de votre identité visuelle. Passionnée par le monde du graphisme et à l’écoute de ses clients, Super Logo met ses compétences à profit pour les particuliers, les petites et les grandes entreprises.",
      url: "https://www.super-logo.com",
    },
  ],
  (partner) => partner.name.toLowerCase(),
);
