import { ChildrenProp } from "~/core/types";
import { CenteredContent } from "../centeredContent";
import styles from "./pageHeader.module.css";

type PageHeaderProps = ChildrenProp & {
  title: string;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className={styles.section}>
      <CenteredContent>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          {children}
        </div>
      </CenteredContent>
    </header>
  );
}
