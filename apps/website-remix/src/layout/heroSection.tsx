import { cn } from "~/core/classNames";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";

export function HeroSection({
  title,
  message,
  action,
  image,
  isReversed = false,
  hasLargeTitle = false,
}: {
  title: string;
  message: React.ReactNode;
  action: React.ReactNode;
  image: StaticImageProps["image"];
  isReversed?: boolean;
  hasLargeTitle?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex flex-col items-center gap-6",
        {
          "md:flex-row-reverse": isReversed,
          "md:flex-row": !isReversed,
        },
        "md:gap-12"
      )}
    >
      <StaticImage
        className={cn("w-full aspect-square", "md:flex-1")}
        image={image}
        sizes={{ lg: "512px", md: "50vw", default: "100vw" }}
      />

      <div className={cn("w-full flex flex-col gap-6", "md:flex-1")}>
        <div
          className={cn(
            "px-4 flex flex-col gap-6 text-center",
            "md:px-6 md:text-left"
          )}
        >
          <h1
            className={cn({
              "text-title-hero-small md:text-title-hero-large": hasLargeTitle,
              "text-title-section-small md:text-title-section-large":
                !hasLargeTitle,
            })}
          >
            {title}
          </h1>

          <p>{message}</p>
        </div>

        <div
          className={cn("px-2 flex justify-center", "md:px-6 md:justify-start")}
        >
          {action}
        </div>
      </div>
    </section>
  );
}
