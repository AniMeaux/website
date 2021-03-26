import { AnimalSpeciesIcon } from "@animeaux/app-core/build/animal/animalSpeciesIcon";
import {
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities/build/animal";
import { Link } from "@animeaux/ui-library/build/core/link";
import { ChildrenProp } from "@animeaux/ui-library/build/core/types";
import * as React from "react";
import {
  TagContent,
  TagIcon,
  TagLink,
  TagList,
  TagListItem,
} from "../../ui/tagList";

export function AdoptionMenu() {
  return (
    <>
      <TagList>
        {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => (
          <TagListItem key={species}>
            <TagLink href="/">
              <TagIcon>
                <AnimalSpeciesIcon species={species} />
              </TagIcon>

              <TagContent>{AnimalSpeciesLabels[species]}</TagContent>
            </TagLink>
          </TagListItem>
        ))}
      </TagList>

      <hr className="separator px-4" />

      <ul>
        <li>
          <SubNavigationLink>Tous les animaux</SubNavigationLink>
        </li>

        <li>
          <SubNavigationLink>Adoptés</SubNavigationLink>
        </li>
      </ul>
    </>
  );
}

export function ActMenu() {
  return (
    <ul>
      <li>
        <SubNavigationLink>Devenir famille d'accueil</SubNavigationLink>
      </li>

      <li>
        <SubNavigationLink>Devenir bénévole</SubNavigationLink>
      </li>

      <li>
        <SubNavigationLink>Faire un don</SubNavigationLink>
      </li>
    </ul>
  );
}

function SubNavigationLink(props: ChildrenProp) {
  return <Link {...props} href="/" className="NavigationSubItem" />;
}
