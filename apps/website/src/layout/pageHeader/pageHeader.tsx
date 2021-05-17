import cn from "classnames";
import { ChildrenProp } from "~/core/types";
import { CenteredContent } from "../centeredContent";
import styles from "./pageHeader.module.css";

type PageHeaderVariant = "adopt" | "blue" | "green";

const VariantClassName: Record<PageHeaderVariant, string> = {
  adopt: styles.adopt,
  blue: styles.blue,
  green: styles.green,
};

type PageHeaderProps = ChildrenProp & {
  variant: PageHeaderVariant;
  title: string;
};

export function PageHeader({ title, variant, children }: PageHeaderProps) {
  return (
    <header className={cn(styles.section, VariantClassName[variant])}>
      <CenteredContent>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          {children}
        </div>
      </CenteredContent>
    </header>
  );
}
