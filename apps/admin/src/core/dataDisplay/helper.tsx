import type { ActionColor } from "#core/actions.tsx";
import { Action } from "#core/actions.tsx";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";

type HelperVariant = "error" | "info" | "success" | "warning";

type BlockHelperProps = {
  children?: React.ReactNode;
  icon?: IconProps["id"];
  variant: HelperVariant;
};

export function BlockHelper({ children, icon, variant }: BlockHelperProps) {
  return (
    <section
      className={cn(
        "grid grid-flow-col grid-cols-[auto_1fr] items-start gap-1 border p-1 md:p-2",
        VARIANT_CLASS_NAME[variant],
        BLOCK_VARIANT_CLASS_NAME[variant],
      )}
    >
      <span className="flex text-[20px]">
        <Icon id={icon ?? VARIANT_ICON[variant]} />
      </span>

      <p className="text-body-emphasis">{children}</p>
    </section>
  );
}

const BLOCK_VARIANT_CLASS_NAME: Record<HelperVariant, string> = {
  error: "border-red-100",
  info: "border-blue-100",
  success: "border-green-100",
  warning: "border-orange-100",
};

export type InlineHelperProps = {
  action?: React.ReactElement;
  children?: React.ReactNode;
  icon?: IconProps["id"];
  variant: HelperVariant;
};

export function InlineHelper({
  action,
  children,
  icon,
  variant,
}: InlineHelperProps) {
  return (
    <section
      className={cn(
        "grid grid-flow-col grid-cols-[auto_1fr] items-start gap-1 rounded-0.5 p-1",
        VARIANT_CLASS_NAME[variant],
      )}
    >
      <span className="flex text-[20px]">
        <Icon id={icon ?? VARIANT_ICON[variant]} />
      </span>

      <p className="text-body-emphasis">{children}</p>

      {action != null ? (
        <Action asChild variant="text" color={VARIANT_ACTION_COLOR[variant]}>
          {action}
        </Action>
      ) : null}
    </section>
  );
}

const VARIANT_ACTION_COLOR: Record<HelperVariant, ActionColor> = {
  error: "red",
  info: "blue",
  success: "green",
  warning: "orange",
};

export type DenseHelperProps = {
  children?: React.ReactNode;
  className?: string;
  icon?: IconProps["id"];
  variant: HelperVariant;
};

export function DenseHelper({
  children,
  className,
  icon,
  variant,
}: DenseHelperProps) {
  return (
    <section
      className={cn(
        "grid grid-flow-col grid-cols-[auto_1fr] items-start gap-0.5 rounded-0.5 px-1 py-0.5",
        VARIANT_CLASS_NAME[variant],
        className,
      )}
    >
      <span className="flex h-2 items-center">
        <Icon id={icon ?? VARIANT_ICON[variant]} />
      </span>

      <p className="text-caption-emphasis">{children}</p>
    </section>
  );
}

const VARIANT_CLASS_NAME: Record<HelperVariant, string> = {
  error: "bg-red-50 text-red-500",
  info: "bg-blue-50 text-blue-500",
  success: "bg-green-50 text-green-600",
  warning: "bg-orange-50 text-orange-500",
};

const VARIANT_ICON: Record<HelperVariant, IconProps["id"]> = {
  error: "circleExclamation",
  info: "circleInfo",
  success: "circleCheck",
  warning: "triangleExclamation",
};
