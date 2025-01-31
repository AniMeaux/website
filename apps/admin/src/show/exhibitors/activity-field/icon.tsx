import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ShowActivityField } from "@prisma/client";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const ActivityFieldIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    activityField: ShowActivityField;
    variant?: "light" | "solid";
  }
>(function ActivityFieldIcon(
  { activityField, variant = "light", ...props },
  ref,
) {
  return (
    <span {...props} ref={ref} title={ActivityField.translation[activityField]}>
      <Icon href={ICON_BY_ACTIVITY_FIELD[activityField][variant]} />
    </span>
  );
});

const ICON_BY_ACTIVITY_FIELD: Record<
  ShowActivityField,
  { solid: IconName; light: IconName }
> = {
  [ShowActivityField.ACCESSORIES]: {
    light: "icon-teddy-bear-light",
    solid: "icon-teddy-bear-solid",
  },
  [ShowActivityField.ALTERNATIVE_MEDICINE]: {
    light: "icon-hand-holding-heart-light",
    solid: "icon-hand-holding-heart-solid",
  },
  [ShowActivityField.ARTIST]: {
    light: "icon-palette-light",
    solid: "icon-palette-solid",
  },
  [ShowActivityField.ASSOCIATION]: {
    light: "icon-people-group-light",
    solid: "icon-people-group-solid",
  },
  [ShowActivityField.BEHAVIOR]: {
    light: "icon-shield-paw-light",
    solid: "icon-shield-paw-solid",
  },
  [ShowActivityField.CARE]: {
    light: "icon-heart-light",
    solid: "icon-heart-solid",
  },
  [ShowActivityField.CITY]: {
    light: "icon-school-light",
    solid: "icon-school-solid",
  },
  [ShowActivityField.DRAWING]: {
    light: "icon-pen-paintbrush-light",
    solid: "icon-pen-paintbrush-solid",
  },
  [ShowActivityField.EDITING]: {
    light: "icon-book-open-light",
    solid: "icon-book-open-solid",
  },
  [ShowActivityField.EDUCATION]: {
    light: "icon-shield-dog-light",
    solid: "icon-shield-dog-solid",
  },
  [ShowActivityField.FOOD]: {
    light: "icon-bowl-food-light",
    solid: "icon-bowl-food-solid",
  },
  [ShowActivityField.PHOTOGRAPHER]: {
    light: "icon-camera-light",
    solid: "icon-camera-solid",
  },
  [ShowActivityField.SENSITIZATION]: {
    light: "icon-comments-light",
    solid: "icon-comments-solid",
  },
  [ShowActivityField.SERVICES]: {
    light: "icon-badge-check-light",
    solid: "icon-badge-check-solid",
  },
  [ShowActivityField.TRAINING]: {
    light: "icon-file-certificate-light",
    solid: "icon-file-certificate-solid",
  },
};
