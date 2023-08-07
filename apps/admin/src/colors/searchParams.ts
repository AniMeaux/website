import { zsp } from "~/core/schemas";
import { createSearchParams } from "~/core/searchParams";

export const ColorSearchParams = createSearchParams({
  name: { key: "q", schema: zsp.text() },
});
