import { ExhibitorCategory } from "~/exhibitors/data";

export const EXHIBITOR_CATEGORY_TRANSLATIONS: Record<
  ExhibitorCategory,
  string
> = {
  [ExhibitorCategory.ACCESSOIRES]: "Accessoires",
  [ExhibitorCategory.ALIMENTATION_CHIEN]: "Alimentation chien",
  [ExhibitorCategory.ALIMENTATION_ET_ACCESSOIRES]:
    "Alimentation et accessoires",
  [ExhibitorCategory.ALIMENTATION_ET_HYGIENE]: "Alimentation et hygiene",
  [ExhibitorCategory.ASSOCIATION_ANIMAUX_DE_COMPAGNIE]:
    "Association animaux de compagnie",
  [ExhibitorCategory.ASSOCIATION_FAUNE_SAUVAGE]: "Association faune sauvage",
  [ExhibitorCategory.COMPORTEMENT_FELIN]: "Comportement félin",
  [ExhibitorCategory.EDUCATION_CANINE]: "Éducation canine",
  [ExhibitorCategory.HYGIENE]: "Hygiène",
  [ExhibitorCategory.JEUX_CHATS]: "Jeux chats",
  [ExhibitorCategory.MEDECINE_DOUCE]: "Médecine douce",
  [ExhibitorCategory.PLATEFORME_EN_LIGNE]: "Plateforme en ligne",
  [ExhibitorCategory.PRESTATION_DE_SERVICES]: "Prestation de services",
  [ExhibitorCategory.SENSIBILISATION]: "Sensibilisation",
};
