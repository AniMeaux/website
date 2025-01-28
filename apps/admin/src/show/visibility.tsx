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
  className,
}: {
  visibility: Visibility;
  className?: string;
}) {
  return (
    <span title={ICON_TITLE[visibility]} className={className}>
      <Icon
        href={ICON_NAME[visibility].solid}
        className={ICON_CLASS_NAME[visibility]}
      />
    </span>
  );
}

const ICON_TITLE: Record<Visibility, string> = {
  [Visibility.HIDDEN]: "N’est pas visible sur le site",
  [Visibility.VISIBLE]: "Est visible sur le site",
};

const ICON_CLASS_NAME: Record<Visibility, string> = {
  [Visibility.HIDDEN]: "text-gray-900",
  [Visibility.VISIBLE]: "text-green-600",
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
