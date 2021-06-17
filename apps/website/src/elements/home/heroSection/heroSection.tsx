import { StaticImage } from "dataDisplay/image";
import { CenteredContent } from "layout/centeredContent";

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
      <StaticImage
        smallImage={smallImage}
        largeImage={largeImage}
        alt={title}
        className="HeroSectionImage"
      />

      <CenteredContent>
        <header className="HeroSectionText">
          <h1 className="HeroSectionTitle">{title}</h1>
          <p className="HeroSectionSubTitle">{subTitle}</p>
          <div className="HeroSectionSearchForm">{searchForm}</div>
        </header>
      </CenteredContent>
    </section>
  );
}
