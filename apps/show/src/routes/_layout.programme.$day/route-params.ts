import { ShowDay } from "#core/show-day";
import { zu } from "@animeaux/zod-utils";

export const routeParamsSchema = zu.object({
  day: zu.nativeEnum(ShowDay.Enum),
});
