export enum ExhibitorCategory {
  ACCESSOIRES = "ACCESSOIRES",
  ALIMENTATION_CHAT_ET_CHIEN = "ALIMENTATION_CHAT_ET_CHIEN",
  ALIMENTATION_CHIEN = "ALIMENTATION_CHIEN",
  ALIMENTATION_ET_ACCESSOIRES = "ALIMENTATION_ET_ACCESSOIRES",
  ALIMENTATION_ET_HYGIENE = "ALIMENTATION_ET_HYGIENE",
  ASSOCIATION = "ASSOCIATION",
  ASSOCIATION_ANIMAUX_DE_COMPAGNIE = "ASSOCIATION_ANIMAUX_DE_COMPAGNIE",
  ASSOCIATION_FAUNE_SAUVAGE = "ASSOCIATION_FAUNE_SAUVAGE",
  ASSURANCE = "ASSURANCE",
  COMPORTEMENT_FELIN = "COMPORTEMENT_FELIN",
  EDUCATION_CANINE = "EDUCATION_CANINE",
  FORMATION = "FORMATION",
  FRIANDISES_CHIENS = "FRIANDISES_CHIENS",
  HYGIENE = "HYGIENE",
  JEUX_CHATS = "JEUX_CHATS",
  JEUX_CHIENS_ET_CHATS = "JEUX_CHIENS_ET_CHATS",
  MEDECINE_DOUCE = "MEDECINE_DOUCE",
  NUTRITION_CHAT_ET_CHIEN = "NUTRITION_CHAT_ET_CHIEN",
  PLATEFORME_EN_LIGNE = "PLATEFORME_EN_LIGNE",
  PRESTATION_DE_SERVICES = "PRESTATION_DE_SERVICES",
  SENSIBILISATION = "SENSIBILISATION",
}

export type Exhibitor = {
  id: string;
  name: string;
  url: string;
  category: ExhibitorCategory;
  image: string;
};

export const exhibitors: Exhibitor[] = [
  {
    id: "7713940d-1575-43d7-910b-6f4f3a389559",
    name: "2 mains pour 4 pattes",
    category: ExhibitorCategory.MEDECINE_DOUCE,
    image: "show-exhibitors/e6cecd31-ff07-4d05-b3fe-8b35f7b40b4b",
    url: "https://www.facebook.com/2mainspour4pattes",
  },
  {
    id: "17739195-3328-47ac-ab56-b4d292e65616",
    name: "Action Protection Animale",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/18339723-c004-4f4c-bc63-31c4beb240eb",
    url: "https://www.actionprotectionanimale.com",
  },
  {
    id: "8cfa1614-d0fd-4602-ae06-2aa799b2b621",
    name: "Alliance hérissons",
    category: ExhibitorCategory.ASSOCIATION_FAUNE_SAUVAGE,
    image: "show-exhibitors/c1f9cf91-c0c2-4156-bcda-a07dc7d4f117",
    url: "https://www.facebook.com/profile.php?id=100064320027110",
  },
  {
    id: "96c1f509-e06e-4686-b8d8-fc6d5c747219",
    name: "Ani’Meaux",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/6bb20ff0-77cb-49a6-9125-1c2bd997679f",
    url: "https://animeaux.org",
  },
  {
    id: "f258b52b-f536-4c6d-9b3e-502b5707c59a",
    name: "Anidéo",
    category: ExhibitorCategory.PRESTATION_DE_SERVICES,
    image: "show-exhibitors/0a787843-b02a-4b6d-8827-5572302be2d9",
    url: "https://www.anideo.fr",
  },
  {
    id: "1ca4475d-e7c9-4614-b328-fe46095f5cf6",
    name: "Anima Aurae",
    category: ExhibitorCategory.MEDECINE_DOUCE,
    image: "show-exhibitors/67b4b6f0-18a4-4acf-bf1e-39110f4280fa",
    url: "https://www.facebook.com/people/Alexandra-Bernard/100087571103292",
  },
  {
    id: "f7a9d341-8601-4912-8035-08eed8917b9b",
    name: "Anizoo",
    category: ExhibitorCategory.ALIMENTATION_ET_ACCESSOIRES,
    image: "show-exhibitors/9ce6ec11-c3e7-4f05-97dc-3ef45772baed",
    url: "https://anizoo.fr",
  },
  {
    id: "abdc98c8-dc09-44b9-91a8-c03cb6dfc016",
    name: "ASPAS",
    category: ExhibitorCategory.ASSOCIATION_FAUNE_SAUVAGE,
    image: "show-exhibitors/4762db03-f308-4d68-a9d2-109a31547e20",
    url: "https://www.aspas-nature.org",
  },
  {
    id: "02a8ea99-1358-438a-a065-eab67b111d44",
    name: "Association Bamanach",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/39bbae84-91e0-4937-8def-9d3c1864219e",
    url: "https://www.facebook.com/Bamanach",
  },
  {
    id: "a20f4da4-f6ed-4104-b9cb-6496bed0cdcd",
    name: "Association Cat & Co",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/db0af837-4a1a-4f27-9a11-cff708d549f1",
    url: "https://www.facebook.com/catandco77",
  },
  {
    id: "10412294-571a-42ed-ac07-9751d3d530d0",
    name: "Association Chihuahua en Détresse",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/eb61ec9f-2938-4da5-ac3e-fc4a5877bca4",
    url: "https://www.chihuahuaendetresse.fr",
  },
  {
    id: "42306e93-738d-4070-a5f4-00554b502264",
    name: "Association Happyculteurs 77",
    category: ExhibitorCategory.ASSOCIATION_FAUNE_SAUVAGE,
    image: "show-exhibitors/910474e0-d01d-411c-be25-647d067888b8",
    url: "https://www.facebook.com/profile.php?id=100079462512363",
  },
  {
    id: "0bd1b512-a53f-495a-b287-a64236fd5e1f",
    name: "Association Hop hop hop, on adopte",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/e2d9fc93-49b2-4338-a367-69ff18e4c05f",
    url: "https://www.facebook.com/Hop-hop-hop-on-adopte-103402841170712",
  },
  {
    id: "2798a7fc-6a08-48e7-b2f0-5cb99d40451f",
    name: "Association Marguerite & Cie",
    category: ExhibitorCategory.ASSOCIATION,
    image: "show-exhibitors/25a8d22f-9910-49e9-be37-ba55776b3c96",
    url: "https://margueritecie.org",
  },
  {
    id: "fd45e87f-a139-4d57-b382-cae29f545fe0",
    name: "Association Oups And Co",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/a45641f7-5a54-44d0-9939-d8c83525c12c",
    url: "https://www.instagram.com/association_oupsnco",
  },
  {
    id: "1bfb93b6-afc8-454f-a2c7-246c594b501f",
    name: "B Wild Shop",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/3e6854b4-3dfd-4fab-a6b9-5d2e98e094e7",
    url: "http://bwildshop.fr",
  },
  {
    id: "00cc792a-e1ae-4ffd-86c2-9d6d866b7799",
    name: "Bandanas By Stella",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/4b9fcbda-4e20-4003-bbfc-158424abda70",
    url: "https://bandanasbystella.fr",
  },
  {
    id: "40976021-ad91-4f97-a82c-48c5a42cf8b9",
    name: "Boule de poils educ’",
    category: ExhibitorCategory.EDUCATION_CANINE,
    image: "show-exhibitors/ef867f55-e020-4826-a1f9-1b47a005636b",
    url: "https://www.bouledepoilseduc.com",
  },
  {
    id: "76ee6dd7-118c-4aba-92f8-2a02fa2b60d8",
    name: "Brigade Animale Bénévole",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/2c94ae7b-44f1-4dd5-98af-6011e431555d",
    url: "https://www.assobab.fr",
  },
  {
    id: "601f7dbb-42df-4a01-b317-66197f41cb8c",
    name: "Cat’n’Dogster",
    category: ExhibitorCategory.PLATEFORME_EN_LIGNE,
    image: "show-exhibitors/d633a8d5-c0fd-4d3f-a4d4-bb1199fc76ee",
    url: "https://catndogster.fr",
  },
  {
    id: "c9523081-c3e3-4688-a5bf-ba8877a203cd",
    name: "Chat’rcours muraux",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/e2f0a63d-b6e3-4473-97b2-f748ad40e7ca",
    url: "https://www.chatrcoursmuraux.com",
  },
  {
    id: "ccd9eb83-9183-49e6-bb26-d90178c87fde",
    name: "Chijiwi",
    category: ExhibitorCategory.ALIMENTATION_ET_ACCESSOIRES,
    image: "show-exhibitors/7bb844cb-3d8e-4ac3-8844-3c968578b1c8",
    url: "https://www.chijiwi.fr",
  },
  {
    id: "9a31904b-e0ae-4c0f-b94f-5f9c6c4f15aa",
    name: "CIE Chiens Guides du coeur",
    category: ExhibitorCategory.ASSOCIATION,
    image: "show-exhibitors/ab8ef7fc-031f-463b-9969-4cd910ce721c",
    url: "https://www.chienguide-cie.fr",
  },
  {
    id: "b3aa543b-373c-4d39-b962-f09a2449a18d",
    name: "Créanimaux",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/b566d194-4eac-4c4d-a475-74f472e06bf9",
    url: "https://www.instagram.com/_creanimaux_",
  },
  {
    id: "1cb1bd44-1e38-4f31-86d8-c2ee75bef84f",
    name: "ESRAA",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/08eb6d8d-2714-4515-a209-87d0352f1049",
    url: "https://esraa.fr",
  },
  {
    id: "10bcaff5-118d-4cee-b08d-090db6abcf9b",
    name: "Gamelle au poil",
    category: ExhibitorCategory.NUTRITION_CHAT_ET_CHIEN,
    image: "show-exhibitors/5a3833f3-1549-43a9-bd01-2f7909b6ec2a",
    url: "https://gamelleaupoil.fr",
  },
  {
    id: "ad88296d-77f3-43f1-ac7e-c9657ff4fcd0",
    name: "Generali",
    category: ExhibitorCategory.ASSURANCE,
    image: "show-exhibitors/d5e4a781-1c6c-4afa-843e-9a763907e129",
    url: "https://www.generali.fr/assurance-chien-chat",
  },
  {
    id: "89de9e8b-8d94-4cbc-9ceb-82520f722d84",
    name: "Goya et Dali",
    category: ExhibitorCategory.SENSIBILISATION,
    image: "show-exhibitors/60c33747-4baf-47ec-8ac0-68f1d37b9dbd",
    url: "https://www.instagram.com/goya_et_dali",
  },
  {
    id: "38a15b37-ce51-4f57-b9e4-e92962ef8745",
    name: "Harmonichat",
    category: ExhibitorCategory.COMPORTEMENT_FELIN,
    image: "show-exhibitors/eb6c43f3-4825-4a55-8921-94209cb4257f",
    url: "https://harmonichat.fr",
  },
  {
    id: "7a5e1bde-533a-470c-bc10-358bd7e30f44",
    name: "Humanimal",
    category: ExhibitorCategory.PRESTATION_DE_SERVICES,
    image: "show-exhibitors/33d0b845-f534-4007-8671-9f39f4b99cd2",
    url: "https://www.premiers-secours-canin-felin-humanimal.com",
  },
  {
    id: "1f3dfeee-37c5-44c6-8bfe-933a73cbab49",
    name: "Ice-Crime the Amstaff - Changeons les regards",
    category: ExhibitorCategory.SENSIBILISATION,
    image: "show-exhibitors/51a42704-a6e5-40ef-8c69-27a5b7fc75db",
    url: "https://www.facebook.com/icecrimetheamstaff",
  },
  {
    id: "7d543144-16f1-42e1-a015-3b803a88be58",
    name: "ISTAV",
    category: ExhibitorCategory.FORMATION,
    image: "show-exhibitors/98a12361-afd6-4083-a092-05cb0f6d40c4",
    url: "https://www.istav.fr",
  },
  {
    id: "77c6fa36-64c1-4ea8-b947-c3c9b3f77a5c",
    name: "Jardinerie Poullain",
    category: ExhibitorCategory.ALIMENTATION_ET_ACCESSOIRES,
    image: "show-exhibitors/047ed88e-4f13-4300-821e-667a932a862b",
    url: "https://jardineriepoullain.fr",
  },
  {
    id: "0d117036-a840-48b1-9f9e-a309073abf75",
    name: "La Main et la Patte",
    category: ExhibitorCategory.MEDECINE_DOUCE,
    image: "show-exhibitors/8f54955a-6a41-45d3-834b-fc013d802bc5",
    url: "https://www.lamainetlapatte.com",
  },
  {
    id: "3a01f001-1374-4b31-9ee1-90df57b4b488",
    name: "Kaliska Shop",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/ad50f081-c914-46bf-b915-bb793037da4e",
    url: "https://www.kaliska-shop.com",
  },
  {
    id: "636a8ef7-5913-4276-a8cf-dd30fe304e44",
    name: "KiKazh®",
    category: ExhibitorCategory.ALIMENTATION_ET_HYGIENE,
    image: "show-exhibitors/f3f77934-09ba-40e0-a82e-bc4a13ac9aa4",
    url: "https://www.lhv-bonapp.com",
  },
  {
    id: "1ad8e49b-c242-4be7-a791-32ea2055b9e5",
    name: "L’atelier du Coon",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/9a93e557-9bbc-4124-8deb-791d4d8c22ba",
    url: "https://latelierducoon.com",
  },
  {
    id: "efd8089d-e06e-4ab6-9872-939bb17366ce",
    name: "L’univers de Djuna",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/10ebc75d-7de9-4210-aa4f-e2fab131fd5b",
    url: "https://luniversdedjuna.com",
  },
  {
    id: "90d3fbee-b5d1-480d-9b99-e9fb8ef2b370",
    name: "L&A Médiation Animale",
    category: ExhibitorCategory.SENSIBILISATION,
    image: "show-exhibitors/b8686336-c499-4550-b66c-a81ac3f8e71e",
    url: "https://la-mediationanimale.com",
  },
  {
    id: "bd20ea22-e2d0-4d3c-840a-5ba2a8531f79",
    name: "La Boutique Phéline",
    category: ExhibitorCategory.JEUX_CHATS,
    image: "show-exhibitors/8ca886fa-94a2-4e4b-921c-0cb85a0014ea",
    url: "https://www.laboutiquepheline.com",
  },
  {
    id: "090daccc-e918-4590-a443-36191c0ed61a",
    name: "Les Nonuches",
    category: ExhibitorCategory.JEUX_CHIENS_ET_CHATS,
    image: "show-exhibitors/b31a14ea-9c41-43ce-a696-203b003b354d",
    url: "https://www.lesnonuches.fr",
  },
  {
    id: "6bf921c5-199f-4481-9308-6035b044f44b",
    name: "Madnesis",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/c390d4b9-b89b-42e2-9961-ae537bb2a919",
    url: "https://madnesis.com",
  },
  {
    id: "85ee717c-4932-4bb1-aa96-446b9eddcf9e",
    name: "Matoo & Patoo",
    category: ExhibitorCategory.ALIMENTATION_ET_ACCESSOIRES,
    image: "show-exhibitors/f01bf6cb-b501-4a97-aaa1-5ddaa4bea958",
    url: "https://matooetpatoo.fr",
  },
  {
    id: "9d02417e-ad26-4730-8c11-637dda2c2e97",
    name: "Mistigris Croissy Beaubourg",
    category: ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE,
    image: "show-exhibitors/9d2d7dd4-9b5f-4c39-998a-b8df7042ff85",
    url: "https://www.facebook.com/mistigriscroissybeaubourg",
  },
  {
    id: "e1fa8dd1-88bc-4207-b4dd-f902123eb180",
    name: "Mon animal au naturel",
    category: ExhibitorCategory.ALIMENTATION_ET_ACCESSOIRES,
    image: "show-exhibitors/83d4a46d-6f57-4ffd-8544-9d478d855162",
    url: "https://monanimalaunaturel.com",
  },
  {
    id: "d0cd6090-060b-4b98-9058-32056acf8553",
    name: "NeoVoice",
    category: ExhibitorCategory.SENSIBILISATION,
    image: "show-exhibitors/a7a87861-0df4-40f8-933c-e362e5cced3c",
    url: "https://www.neovoice.fr",
  },
  // TODO: Find a better image.
  // {
  //   id: "f26eb8cf-1cee-4ef9-a436-9eb518d47198",
  //   name: "Mousse Toutou",
  //   category: ExhibitorCategory.HYGIENE,
  //   image: "show-exhibitors/05af128d-f1e6-4259-96d4-d38d92607888",
  //   url: "https://www.facebook.com/people/mousse-toutou/100038918307131",
  // },
  {
    id: "c62f20a4-dc65-4f27-b88a-340eef1aedd5",
    name: "Paaw",
    category: ExhibitorCategory.PLATEFORME_EN_LIGNE,
    image: "show-exhibitors/b70653bd-56f3-408f-b6f0-f07b57284950",
    url: "https://www.paaw.co",
  },
  {
    id: "3dae41b3-b606-435c-88e3-e9ed5ce21981",
    name: "Paradis Animalier",
    category: ExhibitorCategory.PLATEFORME_EN_LIGNE,
    image: "show-exhibitors/9fb5830f-11c0-474d-bebe-4e4bc305b3f9",
    url: "https://paradis-animalier.fr",
  },
  {
    id: "78e7db71-fdd3-4a19-9d60-1a0c8df7b276",
    name: "Petits Fripons",
    category: ExhibitorCategory.JEUX_CHATS,
    image: "show-exhibitors/c5630308-cad9-4751-b96a-56f544241e19",
    url: "https://www.petitsfripons.fr",
  },
  {
    id: "3c734c5a-b7da-41aa-9825-2b40f26ddc52",
    name: "Pet’s Alliance",
    category: ExhibitorCategory.MEDECINE_DOUCE,
    image: "show-exhibitors/ac80d8bc-95d2-486e-86b0-afd6c4449a57",
    url: "https://www.facebook.com/profile.php?id=100077582495761",
  },
  {
    id: "08b727fe-dd31-4c0f-bf0b-8e59ce489095",
    name: "Phyto-Flore-Nature",
    category: ExhibitorCategory.ALIMENTATION_ET_ACCESSOIRES,
    image: "show-exhibitors/3a5bf3c0-46d8-4400-af23-dfc20c5d7c21",
    url: "https://www.phyto-flore-nature.com",
  },
  {
    id: "9f1ae94e-7a55-4cbb-b6d3-43c96aaa49f4",
    name: "Refuge de L’Écureuil Roux",
    category: ExhibitorCategory.ASSOCIATION_FAUNE_SAUVAGE,
    image: "show-exhibitors/ffd3914e-1dc2-4c12-8439-cda1846e2bb4",
    url: "https://www.refugeecureuilroux.fr",
  },
  {
    id: "e4b8c7cf-3762-46d9-91bb-26bb41e4cc60",
    name: "RubyShop",
    category: ExhibitorCategory.ALIMENTATION_CHIEN,
    image: "show-exhibitors/5c2f53f3-007c-4723-b1aa-620ebf5e9b7e",
    url: "https://www.rubyshop.fr",
  },
  {
    id: "7be51d28-33db-4284-ac01-495823892c00",
    name: "WOOF Éducation",
    category: ExhibitorCategory.EDUCATION_CANINE,
    image: "show-exhibitors/3101f4c2-69a1-48bf-a846-1a940ccec2fb",
    url: "https://www.woof-education.fr",
  },
  {
    id: "979b0024-49a3-42d5-bf6d-fa0c636cf5f6",
    name: "YULI",
    category: ExhibitorCategory.ACCESSOIRES,
    image: "show-exhibitors/cd10d5df-4cf3-4468-be20-ad7eea1fb815",
    url: "https://www.yulisolutions.fr/pages/friends",
  },
];
