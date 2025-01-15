import { TRANSLATION_BY_ACTIVITY_FIELD } from "#show/activity-field/translation";
import { ShowActivityField } from "@prisma/client";
import orderBy from "lodash.orderby";

export const SORTED_ACTIVITY_FIELDS = orderBy(
  Object.values(ShowActivityField),
  (field) => TRANSLATION_BY_ACTIVITY_FIELD[field],
);
