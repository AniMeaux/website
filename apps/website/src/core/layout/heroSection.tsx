import type { StaticImageProps } from "#core/dataDisplay/image.tsx";
import { StaticImage } from "#core/dataDisplay/image.tsx";
import { cn } from "@animeaux/core";

export function HeroSection({
  isReversed = false,
  children,
}: {
  isReversed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex flex-col items-center gap-6",
        {
          "md:flex-row-reverse": isReversed,
          "md:flex-row": !isReversed,
        },
        "md:gap-24",
      )}
    >
      {children}
    </section>
  );
}

export function HeroSectionAside({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("w-full flex flex-col gap-6", "md:flex-1")}>
      {children}
    </div>
  );
}

export function HeroSectionImage({
  image,
  loading,
  className,
}: {
  image: StaticImageProps["image"];
  loading?: StaticImageProps["loading"];
  className?: string;
}) {
  return (
    <StaticImage
      className={cn(className, "w-full aspect-square")}
      image={image}
      sizes={{ lg: "512px", md: "50vw", default: "100vw" }}
      loading={loading}
    />
  );
}

export function HeroSectionTitle({
  isLarge = false,
  children,
}: {
  isLarge?: boolean;
  children: React.ReactNode;
}) {
  const TitleComponent = isLarge ? "h1" : "h2";

  return (
    <TitleComponent
      className={cn("text-center", "md:text-left", {
        "text-title-hero-small md:text-title-hero-large": isLarge,
        "text-title-section-small md:text-title-section-large": !isLarge,
      })}
    >
      {children}
    </TitleComponent>
  );
}

export function HeroSectionParagraph({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className={cn("text-center", "md:text-left")}>{children}</p>;
}

export function HeroSectionAction({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("flex justify-center", "md:justify-start")}>
      {children}
    </div>
  );
}
