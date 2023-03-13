import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Tab } from "~/controllers/tabs";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage, getErrorTitle } from "~/dataDisplay/errorPage";
import { Timeline, TimelineItem } from "~/dataDisplay/timeline";

const DaySchema = z.enum(["samedi", "dimanche"]);

export async function loader({ params }: LoaderArgs) {
  const result = DaySchema.safeParse(params["day"]);
  if (!result.success) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ day: result.data });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const day = data?.day;
  if (day == null) {
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return createSocialMeta({ title: getPageTitle(`Programme du ${day}`) });
};

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function Route() {
  const { day } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header className="flex flex-col">
        <h1
          className={cn(
            "w-full text-title-hero-small text-center",
            "md:text-title-hero-large"
          )}
        >
          Programme
        </h1>
      </header>

      <section className="flex flex-col gap-6">
        <div className={cn("flex gap-3 justify-center", "md:gap-6")}>
          <Tab to="/programme/samedi">Samedi</Tab>
          <Tab to="/programme/dimanche">Dimanche</Tab>
        </div>

        <Timeline>
          <TimelineItem title="10h : Ouverture des portes" icon="doorOpen">
            N’oubliez pas de prévoir les papiers de votre toutou s’il vous
            accompagne !
          </TimelineItem>

          <TimelineItem
            title="11h : Échange avec William - Cyno Wild Academy"
            icon="commentsQuestion"
          >
            Qu’est-ce que le rappel du chien ?
          </TimelineItem>

          <TimelineItem
            title={
              <>
                13h : Rencontre et échange avec{" "}
                <BaseLink
                  to="https://www.instagram.com/snowandserra"
                  className={actionClassNames.proseInline()}
                >
                  @snowandserra
                </BaseLink>{" "}
                &{" "}
                <BaseLink
                  to="https://www.instagram.com/dogragnar_"
                  className={actionClassNames.proseInline()}
                >
                  @dogragnar_
                </BaseLink>
              </>
            }
            icon="shareFromSquare"
          >
            Le bien-être animal sur les réseaux sociaux.
          </TimelineItem>

          <TimelineItem
            title="14h : Démonstration Humanimal"
            icon="clipboardMedical"
          >
            Découvrez le premier secours canin / félin.
          </TimelineItem>

          <TimelineItem
            title="15h : Rencontrez Léa et Mélody - La Patt’Enchantée"
            icon="dog"
          >
            Créer du lien avec son chien par une activité : démonstration de Dog
            Dancing.
          </TimelineItem>

          <TimelineItem
            title="16h : Échange avec William - Cyno Wild Academy"
            icon="commentsQuestion"
          >
            L’expression des patrons moteurs.
          </TimelineItem>

          <TimelineItem title="18h : Fermeture des portes" icon="doorClosed">
            {day === "samedi"
              ? "Mais nous vous retrouvons le lendemain, dès 10h pour une nouvelle journée exceptionnelle !"
              : "Rendez-vous l’année prochaine, pour une nouvelle édition encore plus belle ! En attendant, suivez-nous sur les réseaux pour ne rien louper !"}
          </TimelineItem>
        </Timeline>
      </section>
    </main>
  );
}
