import { ExpireFosterFamilyAvailabilityCron } from "#i/foster-families/crons.server";
import { Cron } from "croner";
import { DateTime } from "luxon";

const ALL_CRONS_DEFINITIONS = [ExpireFosterFamilyAvailabilityCron];

export function startCrons() {
  for (const cronDefinition of ALL_CRONS_DEFINITIONS) {
    const cron = new Cron(
      cronDefinition.pattern,
      { name: cronDefinition.name, timezone: "Europe/Paris" },
      cronDefinition.fn,
    );

    const next = cron.nextRun();

    console.log(
      [
        `Started cron: ${cronDefinition.name}`,
        next == null ? null : `(next: ${DateTime.fromJSDate(next).toISO()})`,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
}
