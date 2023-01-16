import { cn } from "~/core/classNames";

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
  icon: string;
  iconAlt: string;
  title: string;
  message: React.ReactNode;
  action?: React.ReactNode;
  isCompact?: boolean;
  titleElementType?: React.ElementType;
  className?: string;
}) {
  return (
    <section
      className={cn(
        className,
        "w-full p-2 flex flex-col items-center justify-center gap-4"
      )}
    >
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

      <div className="max-w-[400px] flex flex-col gap-2 text-center">
        <TitleElementType
          className={cn("text-title-section-small", {
            "md:text-title-section-large": !isCompact,
          })}
        >
          {title}
        </TitleElementType>

        <p>{message}</p>
      </div>

      {action}
    </section>
  );
}
