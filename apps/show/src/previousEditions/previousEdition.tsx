import orderBy from "lodash.orderby";

export enum PreviousEdition {
  Y_2022 = "2022",
  Y_2023 = "2023",
}

export const SORTED_PREVIOUS_EDITIONS = orderBy(
  Object.values(PreviousEdition),
  (edition) => edition,
  ["desc"],
);
