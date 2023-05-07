import { AnimalStatus } from "@animeaux/shared";

export const ANIMAL_STATUS_LABELS: Record<AnimalStatus, string> = {
  [AnimalStatus.ADOPTED]: "Adopté",
  [AnimalStatus.DECEASED]: "Décédé",
  [AnimalStatus.FREE]: "Libre",
  [AnimalStatus.LOST]: "Perdu",
  [AnimalStatus.OPEN_TO_ADOPTION]: "Adoptable",
  [AnimalStatus.OPEN_TO_RESERVATION]: "Réservable",
  [AnimalStatus.RESERVED]: "Réservé",
  [AnimalStatus.RETIRED]: "Retraité",
  [AnimalStatus.RETURNED]: "Restitué",
  [AnimalStatus.UNAVAILABLE]: "Indisponible",
};
