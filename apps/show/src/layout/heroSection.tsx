import { cn } from "~/core/classNames";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";

export function HeroSection({
  isReversed = false,
  id,
  children,
}: {
  isReversed?: boolean;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "flex flex-col items-center gap-6",
        {
          "md:flex-row-reverse": isReversed,
          "md:flex-row": !isReversed,
        },
        "md:gap-12"
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
  className,
}: {
  image: StaticImageProps["image"];
  className?: string;
}) {
  return (
    <StaticImage
      className={cn(className, "w-full aspect-square")}
      image={image}
      sizes={{ lg: "512px", md: "50vw", default: "100vw" }}
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
      className={cn("px-4 text-center", "md:px-6 md:text-left", {
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
  return (
    <p className={cn("px-4 text-center", "md:px-6 md:text-left")}>{children}</p>
  );
}

export function HeroSectionAction({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("px-2 flex justify-center", "md:px-6 md:justify-start")}>
      {children}
    </div>
  );
}
