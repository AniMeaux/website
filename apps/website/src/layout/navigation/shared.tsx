import {
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities/build/animal";
import * as React from "react";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { Link, LinkProps } from "~/core/link";
import { AnimalSpeciesIcon } from "~/dataDisplay/animalSpeciesIcon";
import {
  TagContent,
  TagIcon,
  TagLink,
  TagList,
  TagListItem,
} from "~/dataDisplay/tagList";

export function AdoptionMenu() {
  return (
    <>
      <TagList>
        {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((animalSpecies) => (
          <TagListItem key={animalSpecies}>
            <TagLink href={new AdoptSearchParams({ animalSpecies }).toUrl()}>
              <TagIcon>
                <AnimalSpeciesIcon species={animalSpecies} />
              </TagIcon>
              <TagContent>{AnimalSpeciesLabels[animalSpecies]}</TagContent>
            </TagLink>
          </TagListItem>
        ))}
      </TagList>

      <hr className="separator px-4" />

      <ul>
        <li>
          <SubNavigationLink href={new AdoptSearchParams().toUrl()}>
            Tous les animaux
          </SubNavigationLink>
        </li>

        <li>
          <SubNavigationLink href="/">Adoptés</SubNavigationLink>
        </li>
      </ul>
    </>
  );
}

export function ActMenu() {
  return (
    <ul>
      <li>
        <SubNavigationLink href="/">
          Devenir famille d'accueil
        </SubNavigationLink>
      </li>

      <li>
        <SubNavigationLink href="/">Devenir bénévole</SubNavigationLink>
      </li>

      <li>
        <SubNavigationLink href="/">Faire un don</SubNavigationLink>
      </li>
    </ul>
  );
}

type SubNavigationLinkProps = LinkProps;
function SubNavigationLink(props: SubNavigationLinkProps) {
  return <Link {...props} className="NavigationSubItem" />;
}
