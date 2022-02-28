import cn from "classnames";
import { Link } from "~/core/link";
import { PageQueryParam } from "~/core/pageQueryParam";
import { useRouter } from "~/core/router";
import { StyleProps } from "~/core/types";
import { ReactNode } from "react";
import styles from "./pageForm.module.css";

export type PageFormProps = StyleProps & {
  pageCount: number;
};

export function PageForm({ pageCount, className, ...rest }: PageFormProps) {
  const { query } = useRouter();
  const pageQueryParam = PageQueryParam.fromQuery(query);

  if (pageCount < 2) {
    return null;
  }

  const items: ReactNode[] = [];

  for (let index = 0; index < pageCount; index++) {
    items.push(
      <li key={index}>
        <Link
          disabled={pageQueryParam.page === index}
          href={new PageQueryParam(index).toUrl()}
          className={cn(styles.link, {
            [styles.active]: pageQueryParam.page === index,
          })}
        >
          {index + 1}
        </Link>
      </li>
    );
  }

  if (pageCount - pageQueryParam.page >= 5) {
    items.splice(
      pageQueryParam.page + 2,
      pageCount - pageQueryParam.page - 3,
      <li key={pageCount - 2}>
        <span aria-disabled className={styles.link}>
          ...
        </span>
      </li>
    );
  }

  if (pageQueryParam.page >= 4) {
    items.splice(
      1,
      pageQueryParam.page - 2,
      <li key={1}>
        <span aria-disabled className={styles.link}>
          ...
        </span>
      </li>
    );
  }

  return (
    <ul {...rest} className={cn(styles.list, className)}>
      {items}
    </ul>
  );
}
