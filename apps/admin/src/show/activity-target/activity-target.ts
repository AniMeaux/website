import { TRANSLATION_BY_ACTIVITY_TARGET } from "#show/activity-target/translation";
import { ShowActivityTarget } from "@prisma/client";
import orderBy from "lodash.orderby";

export const SORTED_ACTIVITY_TARGETS = orderBy(
  Object.values(ShowActivityTarget),
  (target) => TRANSLATION_BY_ACTIVITY_TARGET[target],
);
