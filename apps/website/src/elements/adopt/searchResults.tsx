import { AdoptSearchParams } from "core/adoptSearchParams";
import {
  ANIMAL_AGES_LABELS,
  ANIMAL_SPECIES_LABELS,
  ANIMAL_SPECIES_LABELS_PLURAL,
} from "core/labels";
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

export function SearchResults({ result, searchParams }: SearchResultsProps) {
  const isPlural = result.hitsTotalCount > 1;

  let title = "";
  if (searchParams.animalAge != null) {
    title = ANIMAL_AGES_LABELS[searchParams.animalAge].toLowerCase();
  }

  if (searchParams.animalSpecies == null) {
    title = isPlural ? "animaux" : "animal";
  } else {
    const speciesTitle = isPlural
      ? ANIMAL_SPECIES_LABELS_PLURAL[searchParams.animalSpecies]
      : ANIMAL_SPECIES_LABELS[searchParams.animalSpecies];

    title = `${speciesTitle.toLowerCase()} ${title}`;
  }

  let content: React.ReactNode = null;
  if (result.hitsTotalCount === 0) {
    content = (
      <p className={styles.empty}>Aucun {title} à l'adoption pour l'instant</p>
    );
  } else {
    content = (
      <>
        <header>
          <h2 className={styles.title}>
            {result.hitsTotalCount} {title}
          </h2>
        </header>

        <AnimalPaginatedList
          result={result}
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
