import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

export function Timeline({ children }: { children: React.ReactNode }) {
  return <ul className={cn("pt-4 flex flex-col", "md:pt-1")}>{children}</ul>;
}

export function TimelineItem({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: IconProps["id"];
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "group relative py-3 flex items-center gap-6",
        "md:px-6 md:py-6 md:gap-12 md:odd:flex-row-reverse"
      )}
    >
      <TopLine
        className={cn(
          "hidden absolute -z-10 -top-2 left-4 w-6 h-12 stroke-gray-300 group-first:block",
          "md:-top-0.5 md:left-1/2 md:-translate-x-1/2 md:h-20"
        )}
      />

      <BottomLine
        className={cn(
          "absolute -z-10 top-10 left-4 w-6 h-full stroke-gray-300 group-even:scale-x-[-1] group-last:hidden",
          "md:top-[78px] md:left-1/2 md:-translate-x-1/2"
        )}
      />

      <TopLine
        className={cn(
          "hidden absolute -z-10 top-10 left-4 w-6 h-12 stroke-gray-300 scale-y-[-1] group-last:block group-odd:scale-x-[-1]",
          "md:top-[78px] md:left-1/2 md:-translate-x-1/2 md:h-20"
        )}
      />

      <span className={cn("hidden", "md:h-1 md:flex md:flex-1")} />

      <span className="self-stretch flex-none flex flex-col justify-start">
        <span
          className={cn("rounded-full shadow-base bg-white p-4 flex", "md:p-6")}
        >
          <Icon
            id={icon}
            className={cn("text-[24px] text-gray-700", "md:text-[60px]")}
          />
        </span>
      </span>

      <div className="flex-1 flex flex-col gap-3">
        <div className={cn("flex flex-col", "md:group-odd:text-right")}>
          <h3 className="text-title-item">{title}</h3>
          <p>{children}</p>
        </div>

        {action != null && (
          <span className={cn("self-start", "md:group-odd:self-end")}>
            {action}
          </span>
        )}
      </div>
    </li>
  );
}

function TopLine({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 48"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, "overflow-visible")}
    >
      <path
        d="m12 0c20 7.3846 12 30 0 48"
        strokeWidth="6"
        strokeLinecap="round"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function BottomLine({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 168"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, "overflow-visible")}
    >
      <path
        d="m12 0c-24 63-24 105 0 168"
        strokeWidth="6"
        strokeLinecap="round"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
