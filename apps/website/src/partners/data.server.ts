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
      id: "09d72a39-a7f7-4635-a816-8125a0daeaea",
      image: "partners/00c8e356-ed74-46a3-9d67-22d68f8cf407",
      name: "HugoDogs",
      description:
        "Educateur canin comportementaliste, HugoDogs vous accompagne dans l’éducation ou la ré-éducation de votre chien. Il est également artisan fabriquant de sellerie canine.",
      url: "https://www.hugodogs.fr",
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
      id: "e747aa03-fd3d-4703-8e54-7e79525b69f3",
      image: "partners/d0601d2b-260b-4d9f-95dc-0d8230e95f29",
      name: "Le Muso Français",
      description:
        "Des accessoires chien et chat tendances et solides ! Une fabrication Française & à la main !",
      url: "https://lemusofrancais.fr",
    },
    {
      id: "9b6e3cba-aa89-4452-a806-d8f0e36e74e9",
      image: "partners/38bc33a0-3037-4a13-8029-ab23935dfe3b",
      name: "MedaillesChien",
      description:
        "Médailles Gravées et Accessoires pour Animaux (Chiens, Chats, Chevaux, ânes, Lapins, etc…). Choix de matières, de formes, de tailles et de couleurs. Entreprise et Atelier en France. Envoi et Livraison Rapide.",
      url: "https://medailleschien.com",
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
      id: "393f0531-f2cf-4db2-a3f6-50a5c28317b7",
      image: "partners/0bc4ccc9-587e-4ade-b75a-9c260565efaf",
      name: "Pixie and Friends",
      description:
        "Sélection de friandises et alimentation naturelle pour votre chien. Accessoires fait main et jouets eco-responsables.",
      url: "https://pixieandfriends.com",
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
      id: "d712924a-007f-42fd-bfc8-a9312c0bcff1",
      image: "partners/a58690ad-984b-4e91-b9bb-ea103ab2894b",
      name: "Zolux",
      description:
        "Professionnel de l’animalerie, Zolux est une entreprise française qui conçoit, fabrique et commercialise des produits pour l’habitat, le confort et l’hygiène des animaux domestiques : chat, chien, poisson, rongeur, oiseau, reptile !",
      url: "https://www.zolux.com",
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
