import { Action } from "#core/actions/action.js";
import { LightBoardCard } from "#core/layout/light-board-card.js";
import { Section } from "#core/layout/section.js";
import { Routes } from "#core/navigation.js";
import { ExhibitorSearchParams } from "#exhibitors/search-params.js";
import { Link } from "@remix-run/react";

export function SectionOnStandEvents() {
  if (CLIENT_ENV.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS !== "true") {
    return null;
  }

  return (
    <Section.Root columnCount={1}>
      <Section.TextAside asChild>
        <LightBoardCard>
          <Section.Title>Surprises de nos exposants</Section.Title>

          <p>
            Tout au long de l’événement, nos exposants ont prévu des animations
            et des surprises pour ravir les visiteurs de tous âges. Pour en
            savoir plus sur ces animations, rendez-vous sur la page des
            exposants où vous trouverez ce qu’ils ont préparé pour vous.
          </p>

          <Section.Action asChild>
            <Action asChild>
              <Link
                to={{
                  pathname: Routes.exhibitors.toString(),
                  search: ExhibitorSearchParams.io.format({
                    eventTypes: new Set([
                      ExhibitorSearchParams.EventType.Enum.ON_STAND,
                    ]),
                  }),
                }}
              >
                Voir les surprises
              </Link>
            </Action>
          </Section.Action>
        </LightBoardCard>
      </Section.TextAside>
    </Section.Root>
  );
}
