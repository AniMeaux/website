import { Species } from "@prisma/client";
import { SPECIES_ICON } from "~/animals/species";
import { cn } from "~/core/classNames";
import { LineShapeHorizontal, LineShapeVertical } from "~/layout/lineShape";
import { SubNavComponent, SubNavItem } from "~/layout/navigation/shared";

export const SubNavAdopt: SubNavComponent = () => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        "md:flex-row md:items-center md:gap-6"
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
          to="/adoption/rongeur"
        >
          Rongeur
        </SubNavItem>
      </div>

      <div
        className={cn(
          "w-full px-2 flex stroke-gray-100",
          "md:w-auto md:h-full md:px-0 md:py-2"
        )}
      >
        <LineShapeHorizontal className={cn("w-full h-2", "md:hidden")} />
        <LineShapeVertical className={cn("hidden", "md:block md:w-2")} />
      </div>

      <div className={cn("flex flex-col", "md:flex-1")}>
        <SubNavItem color="blue" icon="paw" to="/adoption">
          Tous les animaux
        </SubNavItem>

        <SubNavItem color="green" icon="badgeCheck" to="/sauves">
          Animaux sauvés
        </SubNavItem>

        <SubNavItem color="yellow" icon="bookHeart" to="/conditions-d-adoption">
          Conditions d'adoption
        </SubNavItem>
      </div>
    </div>
  );
};

SubNavAdopt.isActive = (location) => {
  const pathname = location.pathname.toLowerCase();

  return ["/animal", "/adoption", "/sauves", "/conditions-d-adoption"].some(
    (path) => pathname.startsWith(path)
  );
};
