import { PublicSearchableAnimal } from "@animeaux/shared-entities/build/animal";
import { PaginatedResponse } from "@animeaux/shared-entities/build/pagination";
import { PageForm } from "controllers/pageForm";
import { ReactNode } from "react";
import styles from "./paginatedList.module.css";

export type AnimalPaginatedListProps = {
  response: PaginatedResponse<PublicSearchableAnimal>;
  renderCard: (animal: PublicSearchableAnimal) => ReactNode;
};

export function AnimalPaginatedList({
  response,
  renderCard,
}: AnimalPaginatedListProps) {
  return (
    <div>
      <ul className={styles.cards}>
        {response.hits.map((animal) => (
          <li key={animal.id}>{renderCard(animal)}</li>
        ))}
      </ul>

      <PageForm pageCount={response.pageCount} className={styles.pages} />
    </div>
  );
}
