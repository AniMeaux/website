import { zu } from "@animeaux/zod-utils"

import { ShowDay } from "#i/core/show-day.js"

export const routeParamsSchema = zu.object({
  day: zu.nativeEnum(ShowDay.Enum),
})
