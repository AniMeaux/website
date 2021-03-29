import * as React from "react";
import { CenteredContent } from "../centeredContent";
import { Image } from "../image";

type HeroProps = {
  smallImage: string;
  largeImage: string;
  title: string;
  subTitle: string;
  searchForm?: React.ReactNode;
};

export function HeroSection({
  smallImage,
  largeImage,
  title,
  subTitle,
  searchForm,
}: HeroProps) {
  return (
    <section className="HeroSection">
      <Image
        smallImage={smallImage}
        largeImage={largeImage}
        alt={title}
        className="HeroSectionImage"
      />

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
