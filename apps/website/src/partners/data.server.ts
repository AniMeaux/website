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
      id: "0be42a59-4d05-4e09-ba5a-a7e5550be7a6",
      image: "partners/7d3c7741-48a9-4659-b49a-3b901aec3a2a",
      name: "NeoVoice",
      description:
        "NeoVoice est l’application 100 % gratuite, construite avec un vétérinaire, qui vous aide à mieux comprendre la santé et le comportement de votre chien.",
      url: "https://www.neovoice.fr",
    },
    {
      id: "f0d3b7bd-722d-489d-8b7a-7224feb96c50",
      image: "partners/b4c93e5e-0421-40a2-bb1a-b08f4ef9d317",
      name: "Roses Confettis",
      description:
        "Des accessoires colorés et amusants en Biothane® pour chiens, conçus à la main à Montpellier. Chaque commande contribue à soutenir l’association Ani’Meaux avec 1€ de don.",
      url: "https://rosesetconfettis.store",
    },
    {
      id: "ce96c1c2-687b-4725-8ea7-4b50b6e76cd5",
      image: "partners/b12bb2c3-fcef-4197-981b-55c98d61b99a",
      name: "Super Logo",
      description:
        "En tant que graphiste professionnelle spécialisée dans la **création de logo d’entreprise**, Super Logo vous propose ses services pour la réalisation de votre identité visuelle. Passionnée par le monde du graphisme et à l’écoute de ses clients, Super Logo met ses compétences à profit pour les particuliers, les petites et les grandes entreprises.",
      url: "https://www.super-logo.com",
    },
    {
      id: "01c5f92b-c600-4d25-8697-0f92c7a9d841",
      image: "partners/48dd1169-443a-4cc5-a42f-4ae832d6c88e",
      name: "Zooplus",
      description:
        "Zooplus Animalerie en ligne N°1 en France. Large Choix : +9000 articles pour animaux, prix choc, livraison rapide. 4 % du montant de votre commande reversé à l’association en passant par **ce lien**.",
      url: "https://marketing.net.zooplus.fr/ts/i3971185/tsc?typ=r&amc=con.zooplus.391263.404652.CRTD9sCr3t7",
    },
  ],
  (partner) => partner.name.toLowerCase(),
);
