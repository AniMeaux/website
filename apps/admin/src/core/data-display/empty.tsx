import { cn } from "@animeaux/core";

export function Empty({
  icon,
  iconAlt,
  title,
  message,
  action,
  isCompact = false,
  titleElementType: TitleElementType = "h1",
  className,
}: {
  message?: React.ReactNode;
  action?: React.ReactNode;
  isCompact?: boolean;
  className?: string;
} & (
  | {
      icon: string;
      iconAlt: string;
    }
  | {
      icon?: undefined;
      iconAlt?: undefined;
    }
) &
  (
    | {
        title: string;
        titleElementType?: React.ElementType;
      }
    | {
        title?: undefined;
        titleElementType?: undefined;
      }
  )) {
  return (
    <section
      className={cn(
        className,
        "flex w-full flex-col items-center justify-center gap-4 p-2",
      )}
    >
      {icon != null ? (
        <div
          role="img"
          aria-label={iconAlt}
          title={iconAlt}
          className={cn("text-[80px] leading-none", {
            "md:text-[120px]": !isCompact,
          })}
        >
          {icon}
        </div>
      ) : null}

      {title != null || message != null || action != null ? (
        <div className="flex flex-col items-center gap-2">
          {title != null ? (
            <TitleElementType
              className={cn(
                "max-w-[400px] text-center text-title-section-small",
                !isCompact ? "md:text-title-section-large" : undefined,
              )}
            >
              {title}
            </TitleElementType>
          ) : null}

          {message != null ? (
            <p className="max-w-[400px] text-center">{message}</p>
          ) : null}

          {action}
        </div>
      ) : null}
    </section>
  );
}
