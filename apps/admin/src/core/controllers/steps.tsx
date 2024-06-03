import type { BaseLinkProps } from "#core/base-link";
import { BaseLink } from "#core/base-link";
import { joinReactNodes } from "#core/join-react-nodes";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { cloneElement } from "react";

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
    }),
  );

  return (
    <nav className="flex items-center gap-1">
      {joinReactNodes(
        steps,
        <Icon href="icon-angle-right" className="text-gray-200" />,
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

Steps.Step = function Step({
  children,
  isActive = false,
  stepIndex = 0,
  to,
}: {
  children?: React.ReactNode;
  isActive?: boolean;
  stepIndex?: number;
  to: NonNullable<BaseLinkProps["to"]>;
}) {
  return (
    <BaseLink
      to={to}
      replace
      className="group flex gap-0.5 rounded-0.5 text-caption-emphasis focus-visible:focus-spaced-blue-400"
    >
      <span
        className={cn(
          "flex h-2 w-2 items-center justify-center rounded-0.5 border",
          isActive
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-gray-200 text-gray-500 group-hover:text-gray-800",
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
};
