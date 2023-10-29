import { ExhibitorCategory } from "@prisma/client";

export const EXHIBITOR_CATEGORY_TRANSLATIONS: Record<
  ExhibitorCategory,
  string
> = {
  [ExhibitorCategory.ACCESSORIES]: "Accessoires",
  [ExhibitorCategory.ALTERNATIVE_MEDICINE]: "Médecine douce",
  [ExhibitorCategory.ARTIST]: "Artiste",
  [ExhibitorCategory.ASSOCIATION_PETS]: "Association animaux de compagnie",
  [ExhibitorCategory.ASSOCIATION_WILDLIFE]: "Association faune sauvage",
  [ExhibitorCategory.ASSOCIATION]: "Association",
  [ExhibitorCategory.CANINE_EDUCATION]: "Éducation canine",
  [ExhibitorCategory.FELINE_BEHAVIOR]: "Comportement félin",
  [ExhibitorCategory.FOOD_AND_ACCESSORIES]: "Alimentation et accessoires",
  [ExhibitorCategory.FOOD_AND_HYGIENE]: "Alimentation et hygiène",
  [ExhibitorCategory.FOOD_CAT_AND_DOG]: "Alimentation chat et chien",
  [ExhibitorCategory.FOOD_DOG]: "Alimentation chien",
  [ExhibitorCategory.HYGIENE]: "Hygiène",
  [ExhibitorCategory.INSURANCE]: "Assurance",
  [ExhibitorCategory.ONLINE_PLATFORM]: "Plateforme en ligne",
  [ExhibitorCategory.PHOTO_STUDIO]: "Studio photo",
  [ExhibitorCategory.PROVISION_OF_SERVICES]: "Prestation de services",
  [ExhibitorCategory.PUBLISHER]: "Editeur",
  [ExhibitorCategory.SENSITIZATION]: "Sensibilisation",
  [ExhibitorCategory.TOYS_CAT_AND_DOG]: "Jeux chiens et chats",
  [ExhibitorCategory.TOYS_CAT]: "Jeux chats",
  [ExhibitorCategory.TRAINING]: "Formation",
  [ExhibitorCategory.TREATS_DOGS]: "Friandises chiens",
};
