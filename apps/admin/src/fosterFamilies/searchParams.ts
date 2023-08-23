import { zsp } from "#core/schemas.tsx";
import { createSearchParams } from "#core/searchParams.ts";
import { Species } from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const FosterFamilySearchParams = createSearchParams({
  displayName: { key: "q", schema: zsp.text() },
  cities: { key: "city", schema: zsp.set(zfd.text()) },
  speciesAlreadyPresent: {
    key: "present",
    schema: zsp.set(z.nativeEnum(Species)),
  },
  speciesToAvoid: { key: "avoid", schema: zsp.set(z.nativeEnum(Species)) },
  speciesToHost: { key: "host", schema: zsp.optionalEnum(Species) },
  zipCode: { key: "zip", schema: zsp.text(z.string().regex(/^\d+$/)) },
});
