import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";

export namespace Visibility {
  export const Enum = {
    VISIBLE: "VISIBLE",
    HIDDEN: "HIDDEN",
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const values = [Enum.VISIBLE, Enum.HIDDEN];

  export const translation: Record<Enum, string> = {
    [Enum.HIDDEN]: "Non visible sur le site",
    [Enum.VISIBLE]: "Visible sur le site",
  };

  export function fromBoolean(isVisible: boolean) {
    return isVisible ? Enum.VISIBLE : Enum.HIDDEN;
  }

  export function toBoolean(visibility: Enum) {
    return visibility === Enum.VISIBLE;
  }
}

export function VisibilityIcon({
  visibility,
  variant = "light",
  className,
}: {
  visibility: Visibility.Enum;
  variant?: "light" | "solid";
  className?: string;
}) {
  return (
    <span title={ICON_TITLE[visibility]} className={className}>
      <Icon href={ICON_NAME[visibility][variant]} />
    </span>
  );
}

const ICON_TITLE: Record<Visibility.Enum, string> = {
  [Visibility.Enum.HIDDEN]: "N’est pas visible sur le site",
  [Visibility.Enum.VISIBLE]: "Est visible sur le site",
};

const ICON_NAME: Record<Visibility.Enum, { light: IconName; solid: IconName }> =
  {
    [Visibility.Enum.HIDDEN]: {
      light: "icon-eye-slash-light",
      solid: "icon-eye-slash-solid",
    },
    [Visibility.Enum.VISIBLE]: {
      light: "icon-eye-light",
      solid: "icon-eye-solid",
    },
  };
