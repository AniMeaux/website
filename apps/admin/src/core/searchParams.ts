import { createSearchParams } from "@animeaux/form-data";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const PageSearchParams = createSearchParams({
  page: zfd.numeric(z.number().int().min(0).catch(0)),
});

export const NextSearchParams = createSearchParams({
  next: zfd.text(z.string().optional().catch(undefined)),
});
