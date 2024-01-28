import { BeeIllustration } from "#core/Illustration/bee.tsx";
import { Action } from "#core/actions.tsx";
import { createConfig } from "#core/config.server.ts";
import { useConfig } from "#core/config.ts";
import { Tab, Tabs } from "#core/controllers/tabs.tsx";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { Markdown, SENTENCE_COMPONENTS } from "#core/dataDisplay/markdown.tsx";
import {
  CLOSING_TIME,
  OPENING_TIME,
  SORTED_SHOW_DAYS,
  ShowDay,
} from "#core/dates.ts";
import { LightBoardCard } from "#core/layout/lightBoardCard";
import { Section } from "#core/layout/section.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { Routes } from "#core/navigation.tsx";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { cn } from "@animeaux/core";
import { zu } from "@animeaux/zod-utils";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";

const DaySchema = zu.object({
  day: zu.nativeEnum(ShowDay),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const { featureFlagShowProgram, featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline || !featureFlagShowProgram) {
    throw new NotFoundResponse();
  }

  const result = DaySchema.safeParse(params);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const { day } = result.data;

  const events = await prisma.showEvent.findMany({
    where: {
      startTime: {
        gte: OPENING_TIME.plus({
          day: day === ShowDay.SATURDAY ? 0 : 1,
        }).toJSDate(),
        lte: CLOSING_TIME.minus({
          day: day === ShowDay.SATURDAY ? 1 : 0,
        }).toJSDate(),
      },
    },
    orderBy: { startTime: "asc" },
    select: {
      description: true,
      id: true,
      registrationUrl: true,
      startTime: true,
    },
  });

  return json({ day, events });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? `Programme du ${data.day}` : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  return (
    <>
      <TitleSection />
      <EventListSection />
      <ExhibitorsEventsListSection />
    </>
  );
}

function TitleSection() {
  return (
    <Section columnCount={1}>
      <Section.Title asChild>
        <h1>Programme</h1>
      </Section.Title>
    </Section>
  );
}

function EventListSection() {
  const { events } = useLoaderData<typeof loader>();

  const nodes: React.ReactNode[] = [];
  events.forEach((event, index) => {
    if (index > 0) {
      // ]--, Small[
      nodes.push(
        <SeparatorSmallBlock
          key={`${event.id}.SeparatorSmallBlock`}
          side={index % 2 === 0 ? "right" : "left"}
          hasBee={(index + 1) % 3 === 0}
          className="sm:hidden"
        />,
      );
    }

    // [Small, Medium[
    if (index % 2 !== 0) {
      nodes.push(
        <SeparatorInline
          key={`${event.id}.Medium.SeparatorInline`}
          hasBee={(index + 1) % 3 === 0}
          className="hidden sm:block md:hidden"
        />,
      );
    }
    if (index > 0 && index % 2 === 0) {
      nodes.push(
        <SeparatorLargeBlock
          key={`${event.id}.Medium.SeparatorLargeBlock`}
          hasBee={(index + 1) % 3 === 0}
          className="hidden sm:block md:hidden col-span-3"
        />,
      );
    }

    // [Medium, ++[
    if (index % 3 !== 0) {
      nodes.push(
        <SeparatorInline
          key={`${event.id}.Large.SeparatorInline`}
          hasBee={(index + 1) % 4 === 0}
          className="hidden md:block"
        />,
      );
    }

    if (index > 0 && index % 3 === 0) {
      nodes.push(
        <SeparatorLargeBlock
          key={`${event.id}.Large.SeparatorLargeBlock`}
          hasBee={(index + 1) % 4 === 0}
          className="hidden md:block col-span-5"
        />,
      );
    }

    nodes.push(<EventItem key={event.id} event={event} />);
  });

  return (
    <Section columnCount={1}>
      <Tabs>
        {SORTED_SHOW_DAYS.map((day) => (
          <Tab
            key={day}
            to={Routes.program(day)}
            prefetch="intent"
            className="capitalize"
          >
            {day}
          </Tab>
        ))}
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-start">
        {nodes}
      </div>
    </Section>
  );
}

function EventItem({
  event,
}: {
  event: SerializeFrom<typeof loader>["events"][number];
}) {
  return (
    <div className="relative grid grid-cols-1 pt-2">
      <time
        dateTime={event.startTime}
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-1 h-4 min-w-[48px] px-0.5 bg-mystic font-serif text-[24px] leading-none tracking-wider text-white grid justify-items-center items-center"
      >
        {DateTime.fromISO(event.startTime)
          .toLocaleString(DateTime.TIME_24_SIMPLE)
          // 14:00 -> 14h00
          .replace(":", "h")
          // 14h00 -> 14h
          .replace(/00$/, "")}
      </time>

      <div className="rounded-1 bg-alabaster bg-var-alabaster px-2 pt-3 pb-1 grid grid-cols-1 gap-2">
        <p>
          <Markdown
            components={SENTENCE_COMPONENTS}
            content={event.description}
          />
        </p>

        {event.registrationUrl != null ? (
          <Action asChild>
            <Link to={event.registrationUrl} className="justify-self-center">
              Inscrivez-vous
            </Link>
          </Action>
        ) : null}
      </div>
    </div>
  );
}

function SeparatorInline({
  hasBee = false,
  className,
}: {
  hasBee?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative -z-10 w-4 lg:w-8 aspect-square", className)}>
      <svg
        fill="none"
        viewBox="0 0 168 24"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible absolute top-0 left-1/2 -translate-x-1/2 h-2 w-10 md:w-14"
      >
        <path
          d="M0 24C19.83 9.36 50.09 0 84 0C117.91 0 148.17 9.36 168 24"
          strokeDasharray="14 13"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          // We don't want the stroke to scale, keep it at 3px.
          vectorEffect="non-scaling-stroke"
          className="stroke-mystic stroke-dashoffset-[-5] md:stroke-dashoffset-[-1]"
        />
      </svg>

      {hasBee ? (
        <BeeIllustration
          direction="left-to-right"
          className="absolute top-0 -translate-y-1/2 w-[25px] left-1/2 -translate-x-1/2"
        />
      ) : null}
    </div>
  );
}

function SeparatorSmallBlock({
  side,
  hasBee = false,
  className,
}: {
  hasBee?: boolean;
  side: "left" | "right";
  className?: string;
}) {
  return (
    <div className={cn("relative -z-10 w-full h-4", className)}>
      <svg
        fill="none"
        height="72"
        viewBox="0 0 12 72"
        width="12"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "overflow-visible absolute top-0",
          side === "left" ? "left-2" : "right-2",
        )}
      >
        <path
          d="M12 0C4.68 8.5 0 21.47 0 36C0 50.53 6.68 63.5 12 72"
          transform={side === "right" ? "rotate(180, 6, 36)" : undefined}
          strokeDasharray="14 13"
          strokeDashoffset="-4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          className="stroke-mystic"
        />
      </svg>

      {hasBee ? (
        <BeeIllustration
          direction={
            side === "left" ? "top-to-bottom-left" : "top-to-bottom-right"
          }
          className={cn(
            "absolute top-[36px] -translate-y-1/2 h-[25px]",
            side === "left"
              ? "left-2 -translate-x-1/2"
              : "right-2 translate-x-1/2",
          )}
        />
      ) : null}
    </div>
  );
}

function SeparatorLargeBlock({
  hasBee = false,
  className,
}: {
  hasBee?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative -z-10 h-8", className)}>
      <svg
        fill="none"
        height="96"
        viewBox="0 0 1024 96"
        width="1024"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible w-full h-full"
      >
        <path
          d="M24 120C-48 0 305.33 15 512 30C718.67 45 1000 150 1000 -100"
          strokeDasharray="14 13"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          // We don't want the stroke to scale, keep it at 3px.
          vectorEffect="non-scaling-stroke"
          className="stroke-mystic"
        />
      </svg>

      {hasBee ? (
        <BeeIllustration
          direction="right-to-left"
          className="absolute top-[64px] -translate-y-1/2 right-[15.5%] -translate-x-1/2 w-[25px]"
        />
      ) : null}
    </div>
  );
}

function ExhibitorsEventsListSection() {
  return (
    <Section columnCount={1}>
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
              <Link to={Routes.exhibitors()}>Voir les surprises</Link>
            </Action>
          </Section.Action>
        </LightBoardCard>
      </Section.TextAside>
    </Section>
  );
}
