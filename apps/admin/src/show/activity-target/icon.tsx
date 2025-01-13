import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { TRANSLATION_BY_ACTIVITY_TARGET } from "#show/activity-target/translation";
import { ShowActivityTarget } from "@prisma/client";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const ActivityTargetIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    activityTarget: ShowActivityTarget;
  }
>(function ActivityTargetIcon({ activityTarget, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      title={TRANSLATION_BY_ACTIVITY_TARGET[activityTarget]}
    >
      <Icon href={ICON_BY_ACTIVITY_TARGET[activityTarget].light} />
    </span>
  );
});

const ICON_BY_ACTIVITY_TARGET: Record<
  ShowActivityTarget,
  { solid: IconName; light: IconName }
> = {
  [ShowActivityTarget.CATS]: {
    light: "icon-cat-light",
    solid: "icon-cat-solid",
  },
  [ShowActivityTarget.DOGS]: {
    light: "icon-dog-light",
    solid: "icon-dog-solid",
  },
  [ShowActivityTarget.EQUINES]: {
    light: "icon-horse-light",
    solid: "icon-horse-solid",
  },
  [ShowActivityTarget.HUMANS]: {
    light: "icon-people-simple-light",
    solid: "icon-people-simple-solid",
  },
  [ShowActivityTarget.NACS]: {
    light: "icon-mouse-field-light",
    solid: "icon-mouse-field-solid",
  },
  [ShowActivityTarget.RABBITS]: {
    light: "icon-rabbit-light",
    solid: "icon-rabbit-solid",
  },
  [ShowActivityTarget.WILDLIFE]: {
    light: "icon-squirrel-light",
    solid: "icon-squirrel-solid",
  },
};
