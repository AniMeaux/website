import {
  AnimalSpecies,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
  isAnimalSpeciesFertile,
} from "./animal";
import { sortByLabels } from "./enumUtils";
import { PaginatedRequest } from "./pagination";
import { Trilean } from "./trilean";

export enum HousingType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
}

export const HousingTypeLabels: {
  [key in HousingType]: string;
} = {
  [HousingType.HOUSE]: "Maison",
  [HousingType.APARTMENT]: "Appartement",
};

export const HOUSING_TYPES_ALPHABETICAL_ORDER = sortByLabels(
  Object.values(HousingType),
  HousingTypeLabels
);

export type HostFamilyOwnAnimalCount = {
  count: number;
};

export type HostFamilyOwnFertileAnimalCount = HostFamilyOwnAnimalCount & {
  areAllSterilized: boolean;
};

export type HostFamilyOwnAnimals = {
  [AnimalSpecies.CAT]?: HostFamilyOwnFertileAnimalCount;
  [AnimalSpecies.RODENT]?: HostFamilyOwnFertileAnimalCount;
  [AnimalSpecies.DOG]?: HostFamilyOwnFertileAnimalCount;

  [AnimalSpecies.BIRD]?: HostFamilyOwnAnimalCount;
  [AnimalSpecies.REPTILE]?: HostFamilyOwnAnimalCount;
};

export function minimiseHostFamilyOwnAnimals(
  ownAnimals: HostFamilyOwnAnimals
): HostFamilyOwnAnimals {
  const minialOwnAnimals: HostFamilyOwnAnimals = {};

  ANIMAL_SPECIES_ALPHABETICAL_ORDER.forEach((species) => {
    const count = ownAnimals[species]?.count ?? 0;

    if (count > 0) {
      if (isAnimalSpeciesFertile(species)) {
        minialOwnAnimals[species] = {
          count,
          areAllSterilized: ownAnimals[species]!.areAllSterilized,
        };
      } else {
        minialOwnAnimals[species] = { count };
      }
    }
  });

  return minialOwnAnimals;
}

export const VehicleTypeLabels: {
  [key in Trilean]: string;
} = {
  [Trilean.UNKNOWN]: "Inconnu",
  [Trilean.TRUE]: "Véhiculé",
  [Trilean.FALSE]: "Piéton",
};

export type HostFamilyPublicProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export type HostFamily = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  housing: HousingType;
  hasChild: boolean;
  hasGarden: boolean;
  hasVehicle: Trilean;
  linkToDrive?: string;
  linkToFacebook?: string;
  ownAnimals: HostFamilyOwnAnimals;
};

export type SearchableHostFamily = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  housing: HousingType;
  hasChild: boolean;
  hasGarden: boolean;
  hasVehicle: Trilean;
};

export function toSearchableHostFamily({
  // Spread out properties to remove.
  linkToDrive,
  linkToFacebook,
  ownAnimals,

  ...searchableHostFamily
}: HostFamily): SearchableHostFamily {
  return searchableHostFamily;
}

export type HostFamilyFormPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  housing: HousingType | null;
  hasChild: boolean;
  hasGarden: boolean;
  hasVehicle: Trilean;
  linkToDrive: string;
  linkToFacebook: string;
  ownAnimals: HostFamilyOwnAnimals;
};

export type CreateHostFamilyPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  housing: HousingType;
  hasChild: boolean;
  hasGarden: boolean;
  hasVehicle: Trilean;
  linkToDrive?: string;
  linkToFacebook?: string;
  ownAnimals: HostFamilyOwnAnimals;
};

export type UpdateHostFamilyPayload = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  housing?: HousingType;
  hasChild?: boolean;
  hasGarden?: boolean;
  hasVehicle?: Trilean;
  linkToDrive?: string;
  linkToFacebook?: string;
  ownAnimals?: HostFamilyOwnAnimals;
};

export type HostFamilyFilters = PaginatedRequest & {
  housing?: HousingType | null;
  hasChild?: boolean | null;
  hasGarden?: boolean | null;
  hasVehicle?: Trilean | null;
};
