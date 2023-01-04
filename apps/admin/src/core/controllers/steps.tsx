import { cloneElement } from "react";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { joinReactNodes } from "~/core/joinReactNodes";
import { Icon } from "~/generated/icon";

export function Steps({
  activeIndex,
  children,
}: {
  activeIndex: number;
  children: React.ReactElement<StepProps>[];
}) {
  const steps = children.map((child, index) =>
    cloneElement(child, {
      key: `step-${index}`,
      stepIndex: index + 1,
      isActive: index <= activeIndex,
    })
  );

  return (
    <nav className="flex items-center gap-1">
      {joinReactNodes(
        steps,
        <Icon id="angleRight" className="text-gray-200" />
      )}
    </nav>
  );
}

type StepProps = {
  children?: React.ReactNode;
  isActive?: boolean;
  stepIndex?: number;
  to: NonNullable<BaseLinkProps["to"]>;
};

export function Step({
  children,
  isActive = false,
  stepIndex = 0,
  to,
}: StepProps) {
  return (
    <BaseLink
      to={to}
      className="group rounded-0.5 flex gap-0.5 text-caption-emphasis focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <span
        className={cn(
          "w-2 h-2 border rounded-0.5 flex items-center justify-center",
          isActive
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-gray-200 text-gray-500 group-hover:text-gray-800"
        )}
      >
        {stepIndex}
      </span>

      <span
        className={
          isActive ? "text-gray-800" : "text-gray-500 group-hover:text-gray-800"
        }
      >
        {children}
      </span>
    </BaseLink>
  );
}
