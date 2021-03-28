import * as React from "react";
import { CenteredContent } from "../centeredContent";

type HeroProps = {
  largeImage: string;
  smallImage: string;
  title: string;
  subTitle: string;
  searchForm?: React.ReactNode;
};

export function HeroSection({
  largeImage,
  smallImage,
  title,
  subTitle,
  searchForm,
}: HeroProps) {
  return (
    <section className="HeroSection">
      <picture>
        <source srcSet={largeImage} media="(min-width: 800px)" />
        <img src={smallImage} alt={title} className="HeroSectionImage" />
      </picture>

      <CenteredContent>
        <div className="HeroSectionContent">
          <header className="HeroSectionText">
            <h1 className="HeroSectionTitle">{title}</h1>
            <p className="HeroSectionSubTitle">{subTitle}</p>
            <div className="HeroSectionSearchForm">{searchForm}</div>
          </header>
        </div>
      </CenteredContent>
    </section>
  );
}
