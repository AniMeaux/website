import { AnimalStatus } from "@animeaux/shared";

export const ANIMAL_STATUS_LABELS: Record<AnimalStatus, string> = {
  [AnimalStatus.ADOPTED]: "Adopté",
  [AnimalStatus.DECEASED]: "Décédé",
  [AnimalStatus.FREE]: "Libre",
  [AnimalStatus.OPEN_TO_ADOPTION]: "Adoptable",
  [AnimalStatus.OPEN_TO_RESERVATION]: "Réservable",
  [AnimalStatus.RESERVED]: "Réservé",
  [AnimalStatus.UNAVAILABLE]: "Indisponible",
};
