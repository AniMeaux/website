import cn from "classnames";
import * as React from "react";

type HeroTextSide = "left" | "right";

type HeroProps = {
  largeImage: string;
  smallImage: string;
  title: string;
  subTitle: string;
  textSide?: HeroTextSide;
  searchForm?: React.ReactNode;
};

export function HeroSection({
  largeImage,
  smallImage,
  title,
  subTitle,
  textSide = "left",
  searchForm,
}: HeroProps) {
  return (
    <section className="HeroSection">
      <picture>
        <source srcSet={largeImage} media="(min-width: 800px)" />
        <img src={smallImage} alt={title} className="HeroSectionImage" />
      </picture>

      <header className={cn("HeroSectionText", `HeroSectionText--${textSide}`)}>
        <h1 className="HeroSectionTitle">{title}</h1>
        <p className="HeroSectionSubTitle">{subTitle}</p>
        {searchForm}
      </header>
    </section>
  );
}
