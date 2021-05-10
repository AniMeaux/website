import { SearchForm } from "~/controllers/searchForm";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { CenteredContent } from "~/layout/centeredContent";
import styles from "./searchFormSection.module.css";

export type SearchFormSectionProps = {
  searchParams: AdoptSearchParams;
};

export function SearchFormSection({ searchParams }: SearchFormSectionProps) {
  return (
    <section className={styles.section}>
      <CenteredContent>
        <div className={styles.content}>
          <h1 className={styles.title}>À adopter</h1>
          <div className={styles.form}>
            <SearchForm hasAll searchParams={searchParams} />
          </div>
        </div>
      </CenteredContent>
    </section>
  );
}
