import {
  OperationPaginationResult,
  PublicAnimalSearchHit,
} from "@animeaux/shared";
import { PageForm } from "~/controllers/pageForm";
import { ReactNode } from "react";
import styles from "./paginatedList.module.css";

export type AnimalPaginatedListProps = {
  result: OperationPaginationResult<PublicAnimalSearchHit>;
  renderCard: (animal: PublicAnimalSearchHit) => ReactNode;
};

export function AnimalPaginatedList({
  result,
  renderCard,
}: AnimalPaginatedListProps) {
  return (
    <div>
      <ul className={styles.cards}>
        {result.hits.map((animal) => (
          <li key={animal.id}>{renderCard(animal)}</li>
        ))}
      </ul>

      <PageForm pageCount={result.pageCount} className={styles.pages} />
    </div>
  );
}
