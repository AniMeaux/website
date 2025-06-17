import orderBy from "lodash.orderby";

export enum PreviousEdition {
  Y_2022 = "2022",
  Y_2023 = "2023",
  Y_2024 = "2024",
  Y_2025 = "2025",
}

export const SORTED_PREVIOUS_EDITIONS = orderBy(
  Object.values(PreviousEdition),
  (edition) => edition,
  ["desc"],
);

export const PREVIOUS_EDITION_PHOTOGRAPH: Partial<
  Record<PreviousEdition, { name: string; url: string }>
> = {
  [PreviousEdition.Y_2023]: {
    name: "Julia Pommé Photographe",
    url: "https://www.juliapommephotographe.com",
  },
  [PreviousEdition.Y_2024]: {
    name: "Julia Pommé Photographe",
    url: "https://www.juliapommephotographe.com",
  },
  [PreviousEdition.Y_2025]: {
    name: "Julia Pommé Photographe",
    url: "https://www.juliapommephotographe.com",
  },
};
