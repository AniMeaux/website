import { SPECIES_ICON } from "#i/animals/species";
import {
  LineShapeHorizontal,
  LineShapeVertical,
} from "#i/core/layout/line-shape";
import type { SubNavComponent } from "#i/core/layout/navigation/shared";
import { SubNavItem } from "#i/core/layout/navigation/shared";
import { cn } from "@animeaux/core";
import { Species } from "@animeaux/prisma";

export const SubNavAdopt: SubNavComponent = () => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        "md:flex-row md:items-center md:gap-6",
      )}
    >
      <div className={cn("grid grid-cols-3", "md:flex-1")}>
        <SubNavItem
          isMultiline
          color="red"
          icon={SPECIES_ICON[Species.CAT]}
          to="/adoption/chat"
        >
          Chat
        </SubNavItem>

        <SubNavItem
          isMultiline
          color="blue"
          icon={SPECIES_ICON[Species.DOG]}
          to="/adoption/chien"
        >
          Chien
        </SubNavItem>

        <SubNavItem
          isMultiline
          color="yellow"
          icon={SPECIES_ICON[Species.BIRD]}
          to="/adoption/oiseau"
        >
          Oiseau
        </SubNavItem>

        <SubNavItem
          isMultiline
          color="green"
          icon={SPECIES_ICON[Species.REPTILE]}
          to="/adoption/reptile"
        >
          Reptile
        </SubNavItem>

        <SubNavItem
          isMultiline
          color="cyan"
          icon={SPECIES_ICON[Species.RODENT]}
          to="/adoption/pac"
        >
          PAC
        </SubNavItem>
      </div>

      <div
        className={cn(
          "flex w-full px-2 text-gray-100",
          "md:h-full md:w-auto md:px-0 md:py-2",
        )}
      >
        <LineShapeHorizontal className={cn("h-2 w-full", "md:hidden")} />
        <LineShapeVertical className={cn("hidden", "md:block md:w-2")} />
      </div>

      <div className={cn("flex flex-col", "md:flex-1")}>
        <SubNavItem color="blue" icon="paw" to="/adoption">
          Tous les animaux
        </SubNavItem>

        <SubNavItem color="green" icon="badge-check" to="/sauves">
          Animaux sauvés
        </SubNavItem>

        <SubNavItem
          color="yellow"
          icon="book-heart"
          to="/conditions-d-adoption"
        >
          Conditions d’adoption
        </SubNavItem>

        <SubNavItem color="cyan" icon="tag" to="/nommez-votre-animal">
          Nommer votre animal
        </SubNavItem>
      </div>
    </div>
  );
};

SubNavAdopt.isActive = (location) => {
  const pathname = location.pathname.toLowerCase();

  return [
    "/animal",
    "/adoption",
    "/sauves",
    "/conditions-d-adoption",
    "/nommez-votre-animal",
  ].some((path) => pathname.startsWith(path));
};
