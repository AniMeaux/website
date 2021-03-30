import { ChildrenProp } from "@animeaux/ui-library/build/core/types";
import * as React from "react";
import { CenteredContent } from "../centeredContent";
import { Image, ImageProps } from "../image";
import { Section } from "../section";

export function StatisticsSection({ children }: ChildrenProp) {
  return (
    <Section>
      <CenteredContent>
        <section>
          <h2 className="StatisticsTitle">Ani'Meaux c'est...</h2>
          <ul className="StatisticsList">{children}</ul>
        </section>
      </CenteredContent>
    </Section>
  );
}

export function StatisticImage(props: ImageProps) {
  return <Image {...props} className="StatisticImage" />;
}

type StatisticItemProps = {
  value: string;
  title: string;
  image?: React.ReactNode;
};

export function StatisticItem({ title, value, image }: StatisticItemProps) {
  return (
    <li className="StatisticItem">
      {image}
      <div className="StatisticItemContent">
        <p className="StatisticItemValue">{value}</p>
        <p className="StatisticItemTitle">{title}</p>
      </div>
    </li>
  );
}
