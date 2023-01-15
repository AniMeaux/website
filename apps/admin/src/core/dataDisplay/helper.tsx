import { cloneElement } from "react";
import { actionClassName, ActionColor } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

type HelperVariant = "error" | "info" | "success" | "warning";

export type HelperProps = {
  variant: HelperVariant;
  children?: React.ReactNode;
  action?: React.ReactElement;
  isCompact?: boolean;
  icon?: React.ReactNode;
};

export function Helper({
  children,
  variant,
  action,
  isCompact = false,
  icon,
}: HelperProps) {
  return (
    <section
      className={cn(
        "rounded-0.5 p-1 grid grid-cols-[auto_1fr] grid-flow-col items-start gap-1",
        { "md:p-2": !isCompact },
        VARIANT_CLASS_NAME[variant]
      )}
    >
      <span className="flex text-[20px]">
        {icon ?? <Icon id={VARIANT_ICON[variant]} />}
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
