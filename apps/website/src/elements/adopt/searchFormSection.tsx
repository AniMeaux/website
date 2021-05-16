import { SearchForm } from "~/controllers/searchForm";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { PageHeader } from "~/layout/pageHeader";
import styles from "./searchFormSection.module.css";

export type SearchFormSectionProps = {
  searchParams: AdoptSearchParams;
};

export function SearchFormSection({ searchParams }: SearchFormSectionProps) {
  return (
    <PageHeader title="À adopter">
      <div className={styles.form}>
        <SearchForm hasAll searchParams={searchParams} />
      </div>
    </PageHeader>
  );
}
