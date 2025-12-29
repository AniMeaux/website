import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { ShowActivityTarget } from "@animeaux/prisma";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const ActivityTargetIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    activityTarget: ShowActivityTarget;
    variant?: "light" | "solid";
  }
>(function ActivityTargetIcon(
  { activityTarget, variant = "light", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      title={ActivityTarget.translation[activityTarget]}
    >
      <Icon href={ICON_BY_ACTIVITY_TARGET[activityTarget][variant]} />
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
