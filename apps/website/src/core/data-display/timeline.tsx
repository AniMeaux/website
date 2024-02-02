import type { IconProps } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";

export function Timeline({ children }: { children: React.ReactNode }) {
  return <ul className={cn("flex flex-col pt-4", "md:pt-1")}>{children}</ul>;
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
        "group relative flex items-center gap-6 py-3",
        "md:gap-12 md:p-6 md:odd:flex-row-reverse",
      )}
    >
      <TopLine
        className={cn(
          "absolute -top-2 left-4 -z-10 hidden h-12 w-6 text-gray-300 group-first:block",
          "md:-top-0.5 md:left-1/2 md:h-20 md:-translate-x-1/2",
        )}
      />

      <BottomLine
        className={cn(
          "absolute left-4 top-10 -z-10 h-full w-6 text-gray-300 group-last:hidden group-even:scale-x-[-1]",
          "md:left-1/2 md:top-[78px] md:-translate-x-1/2",
        )}
      />

      <TopLine
        className={cn(
          "absolute left-4 top-10 -z-10 hidden h-12 w-6 scale-y-[-1] text-gray-300 group-last:block group-odd:scale-x-[-1]",
          "md:left-1/2 md:top-[78px] md:h-20 md:-translate-x-1/2",
        )}
      />

      <span className={cn("hidden", "md:flex md:h-1 md:flex-1")} />

      <span className="flex flex-none flex-col justify-start self-stretch">
        <span
          className={cn("flex rounded-full bg-white p-4 shadow-base", "md:p-6")}
        >
          <Icon
            id={icon}
            className={cn("text-[24px] text-gray-700", "md:text-[60px]")}
          />
        </span>
      </span>

      <div className="flex flex-1 flex-col gap-3 md:gap-6">
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
        stroke="currentColor"
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
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
