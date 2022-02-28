import { AnimalSpecies } from "@animeaux/shared";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { ANIMAL_SPECIES_LABELS } from "~/core/labels";
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
        {Object.values(AnimalSpecies).map((animalSpecies) => (
          <TagListItem key={animalSpecies}>
            <TagLink href={new AdoptSearchParams({ animalSpecies }).toUrl()}>
              <TagIcon>
                <AnimalSpeciesIcon species={animalSpecies} />
              </TagIcon>
              <TagContent>{ANIMAL_SPECIES_LABELS[animalSpecies]}</TagContent>
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
          <SubNavigationLink href="/saved">Animaux sauvés</SubNavigationLink>
        </li>

        <li>
          <SubNavigationLink href="/adoption-conditions">
            Conditions d'adoption
          </SubNavigationLink>
        </li>
      </ul>
    </>
  );
}

export function ActMenu() {
  return (
    <>
      <ul>
        <li>
          <SubNavigationLink href="/host-families">
            Devenir famille d'accueil
          </SubNavigationLink>
        </li>

        <li>
          <SubNavigationLink href="/volunteers">
            Devenir bénévole
          </SubNavigationLink>
        </li>

        <li>
          <SubNavigationLink href="/donation">Faire un don</SubNavigationLink>
        </li>
      </ul>

      <hr className="separator px-4" />

      <ul>
        <li>
          <SubNavigationLink href="/support/found">
            Signaler un animal errant
          </SubNavigationLink>
        </li>

        <li>
          <SubNavigationLink href="/support/abuse">
            Informer d'un acte de maltraitance
          </SubNavigationLink>
        </li>

        <li>
          <SubNavigationLink href="/support/abandon">
            Abandonner votre animal
          </SubNavigationLink>
        </li>
      </ul>
    </>
  );
}

type SubNavigationLinkProps = LinkProps;
function SubNavigationLink(props: SubNavigationLinkProps) {
  return <Link {...props} className="NavigationSubItem" />;
}
