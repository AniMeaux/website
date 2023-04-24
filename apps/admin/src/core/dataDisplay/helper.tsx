import { cloneElement } from "react";
import { actionClassName, ActionColor } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

type HelperVariant = "error" | "info" | "success" | "warning";

export type HelperProps = {
  variant: HelperVariant;
  children?: React.ReactNode;
  action?: React.ReactElement;
  isBlock?: boolean;
  icon?: IconProps["id"];
};

export function Helper({
  children,
  variant,
  action,
  isBlock = false,
  icon,
}: HelperProps) {
  return (
    <section
      className={cn(
        "p-1 grid grid-cols-[auto_1fr] grid-flow-col items-start gap-1",
        VARIANT_CLASS_NAME[variant],
        isBlock
          ? cn("border md:p-2", BLOCK_VARIANT_CLASS_NAME[variant])
          : "rounded-0.5"
      )}
    >
      <span className="flex text-[20px]">
        <Icon id={icon ?? VARIANT_ICON[variant]} />
      </span>

      <p className="text-body-emphasis">{children}</p>

      {action != null
        ? cloneElement(action, {
            className: actionClassName.standalone({
              variant: "text",
              color: VARIANT_ACTION_COLOR[variant],
            }),
          })
        : null}
    </section>
  );
}

const VARIANT_CLASS_NAME: Record<HelperVariant, string> = {
  error: "bg-red-50 text-red-500",
  info: "bg-blue-50 text-blue-500",
  success: "bg-green-50 text-green-600",
  warning: "bg-orange-50 text-orange-500",
};

const BLOCK_VARIANT_CLASS_NAME: Record<HelperVariant, string> = {
  error: "border-red-100",
  info: "border-blue-100",
  success: "border-green-100",
  warning: "border-orange-100",
};

const VARIANT_ICON: Record<HelperVariant, IconProps["id"]> = {
  error: "circleExclamation",
  info: "circleInfo",
  success: "circleCheck",
  warning: "triangleExclamation",
};

const VARIANT_ACTION_COLOR: Record<HelperVariant, ActionColor> = {
  error: "red",
  info: "blue",
  success: "green",
  warning: "orange",
};
