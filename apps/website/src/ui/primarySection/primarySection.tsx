import * as React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link, LinkProps } from "../../core/link";
import { CenteredContent } from "../centeredContent";
import { Image, ImageProps } from "../image";
import { Section } from "../section";

type PrimarySectionProps = {
  title: string;
  message: string;
  image: React.ReactNode;
  action: React.ReactNode;
};

export function PrimarySection({
  title,
  message,
  image,
  action,
}: PrimarySectionProps) {
  return (
    <Section>
      <CenteredContent>
        <section className="PrimarySection">
          <header className="PrimarySectionHeader">
            <h2 className="PrimarySectionTitle">{title}</h2>
            <p className="PrimarySectionMessage">{message}</p>
            {action}
          </header>

          {image}
        </section>
      </CenteredContent>
    </Section>
  );
}

export function PrimarySectionImage(props: ImageProps) {
  return <Image {...props} className="PrimarySectionImage" />;
}

export function PrimarySectionAction({ children, ...props }: LinkProps) {
  return (
    <Link {...props} className="PrimarySectionAction">
      <span>{children}</span>
      <FaArrowRight className="PrimarySectionActionIcon" />
    </Link>
  );
}
