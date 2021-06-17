import {
  AnimalAgesLabels,
  AnimalSpeciesLabels,
  AnimalSpeciesLabelsPlural,
} from "@animeaux/shared-entities/build/animal";
import { AdoptSearchParams } from "core/adoptSearchParams";
import { AnimalLinkCard } from "dataDisplay/animal/card";
import {
  AnimalPaginatedList,
  AnimalPaginatedListProps,
} from "dataDisplay/animal/paginatedList";
import { CenteredContent } from "layout/centeredContent";
import { Section } from "layout/section";
import styles from "./searchResults.module.css";

export type SearchResultsProps = Omit<
  AnimalPaginatedListProps,
  "renderCard"
> & {
  searchParams: AdoptSearchParams;
};

export function SearchResults({
  response,
  searchParams,
  ...rest
}: SearchResultsProps) {
  const isPlural = response.hitsTotalCount > 1;

  let title = "";
  if (searchParams.animalAge != null) {
    title = AnimalAgesLabels[searchParams.animalAge].toLowerCase();
  }

  if (searchParams.animalSpecies == null) {
    title = isPlural ? "animeaux" : "animal";
  } else {
    const speciesTitle = isPlural
      ? AnimalSpeciesLabelsPlural[searchParams.animalSpecies]
      : AnimalSpeciesLabels[searchParams.animalSpecies];

    title = `${speciesTitle.toLowerCase()} ${title}`;
  }

  let content: React.ReactNode = null;
  if (response.hitsTotalCount === 0) {
    content = (
      <p className={styles.empty}>Aucun {title} à l'adoption pour l'instant</p>
    );
  } else {
    content = (
      <>
        <header>
          <h2 className={styles.title}>
            {response.hitsTotalCount} {title}
          </h2>
        </header>

        <AnimalPaginatedList
          {...rest}
          response={response}
          renderCard={(animal) => (
            <AnimalLinkCard href={`/adopt/${animal.id}`} animal={animal} />
          )}
        />
      </>
    );
  }

  return (
    <Section>
      <CenteredContent>
        <section>{content}</section>
      </CenteredContent>
    </Section>
  );
}
