import { ActivityAction } from "#i/activity/action";
import { ActivityResource } from "#i/activity/resource";
import { endOfDay } from "#i/core/dates.js";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { DateTime } from "luxon";

export namespace ActivitySearchParams {
  export type Value = SearchParamsIO.Infer<typeof io>;

  export const io = SearchParamsIO.create({
    keys: {
      actions: "a",
      dateEnd: "de",
      dateStart: "ds",
      resources: "r",
      resourceId: "i",
      usersId: "u",
    },

    parseFunction: (searchParams, keys) => {
      return schema.parse({
        actions: SearchParamsIO.getValues(searchParams, keys.actions),
        dateEnd: SearchParamsIO.getValue(searchParams, keys.dateEnd),
        dateStart: SearchParamsIO.getValue(searchParams, keys.dateStart),
        resources: SearchParamsIO.getValues(searchParams, keys.resources),
        resourceId: SearchParamsIO.getValue(searchParams, keys.resourceId),
        usersId: SearchParamsIO.getValues(searchParams, keys.usersId),
      });
    },

    setFunction: (searchParams, data, keys) => {
      SearchParamsIO.setValues(searchParams, keys.actions, data.actions);

      SearchParamsIO.setValue(
        searchParams,
        keys.dateEnd,
        data.dateEnd == null
          ? undefined
          : DateTime.fromJSDate(data.dateEnd).toISODate(),
      );

      SearchParamsIO.setValue(
        searchParams,
        keys.dateStart,
        data.dateStart == null
          ? undefined
          : DateTime.fromJSDate(data.dateStart).toISODate(),
      );

      SearchParamsIO.setValues(searchParams, keys.resources, data.resources);
      SearchParamsIO.setValue(searchParams, keys.resourceId, data.resourceId);
      SearchParamsIO.setValues(searchParams, keys.usersId, data.usersId);
    },
  });

  const schema = zu.object({
    actions: zu.searchParams.set(
      zu.searchParams.nativeEnum(ActivityAction.Enum),
    ),
    dateEnd: zu.searchParams.date().transform(endOfDay),
    dateStart: zu.searchParams.date(),
    resources: zu.searchParams.set(
      zu.searchParams.nativeEnum(ActivityResource.Enum),
    ),
    resourceId: zu.searchParams.string(),
    usersId: zu.searchParams.set(
      zu.searchParams
        .string()
        .pipe(zu.string().uuid().optional().catch(undefined)),
    ),
  });
}
