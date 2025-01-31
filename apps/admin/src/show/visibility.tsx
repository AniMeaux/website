import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";

export const Visibility = {
  VISIBLE: "VISIBLE",
  HIDDEN: "HIDDEN",
} as const;

export type Visibility = (typeof Visibility)[keyof typeof Visibility];

export function visibilityFromBoolean(isVisible: boolean) {
  return isVisible ? Visibility.VISIBLE : Visibility.HIDDEN;
}

export function visibilityToBoolean(visibility: Visibility) {
  return visibility === Visibility.VISIBLE;
}

export const VISIBILITY_TRANSLATIONS: Record<Visibility, string> = {
  [Visibility.HIDDEN]: "Non visible sur le site",
  [Visibility.VISIBLE]: "Visible sur le site",
};

export const VISIBILITY_VALUES: Visibility[] = [
  Visibility.VISIBLE,
  Visibility.HIDDEN,
];

export function VisibilityIcon({
  visibility,
  variant = "light",
  className,
}: {
  visibility: Visibility;
  variant?: "light" | "solid";
  className?: string;
}) {
  return (
    <span title={ICON_TITLE[visibility]} className={className}>
      <Icon href={ICON_NAME[visibility][variant]} />
    </span>
  );
}

const ICON_TITLE: Record<Visibility, string> = {
  [Visibility.HIDDEN]: "N’est pas visible sur le site",
  [Visibility.VISIBLE]: "Est visible sur le site",
};

const ICON_NAME: Record<Visibility, { light: IconName; solid: IconName }> = {
  [Visibility.HIDDEN]: {
    light: "icon-eye-slash-light",
    solid: "icon-eye-slash-solid",
  },
  [Visibility.VISIBLE]: {
    light: "icon-eye-light",
    solid: "icon-eye-solid",
  },
};
