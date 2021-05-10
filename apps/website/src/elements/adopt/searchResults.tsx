import {
  AnimalAgesLabels,
  AnimalSpeciesLabels,
  AnimalSpeciesLabelsPlural,
  PublicAnimal,
} from "@animeaux/shared-entities/build/animal";
import { PaginatedResponse } from "@animeaux/shared-entities/build/pagination";
import cn from "classnames";
import { formatAge } from "~/../../../libraries/shared-entities/build/date";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { Link } from "~/core/link";
import { AnimalGenderIcon } from "~/dataDisplay/animalGenderIcon";
import { CloudinaryImage } from "~/dataDisplay/image";
import { CenteredContent } from "~/layout/centeredContent";
import { Section } from "~/layout/section";
import styles from "./searchResults.module.css";

export type SearchResultsProps = {
  response: PaginatedResponse<PublicAnimal>;
  searchParams: AdoptSearchParams;
};

export function SearchResults({ response, searchParams }: SearchResultsProps) {
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

        <ul className={styles.cards}>
          {response.hits.map((animal) => (
            <li key={animal.id}>
              <AnimalCard animal={animal} />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <Section>
      <CenteredContent>
        <section className={styles.searchResult}>{content}</section>
      </CenteredContent>
    </Section>
  );
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

type AnimalCardProps = {
  animal: PublicAnimal;
};

function AnimalCard({ animal }: AnimalCardProps) {
  const speciesLabels = [animal.breed?.name, animal.color?.name].filter(
    isDefined
  );

  return (
    <Link href={`/adopt/${animal.id}`} className={styles.animalCard}>
      <CloudinaryImage
        imageId={animal.avatarId}
        alt={animal.officialName}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <h2 className={styles.name}>{animal.officialName}</h2>
          <p className={styles.age}>{formatAge(animal.birthdate)}</p>
        </div>

        <div className={cn(styles.infoRow, styles.details)}>
          <p>{speciesLabels.join(" • ")}</p>
          <span className={styles.genderIcon}>
            <AnimalGenderIcon gender={animal.gender} />
          </span>
        </div>
      </div>
    </Link>
  );
}
