import { Action } from "#core/actions/action.js";
import { Tab, Tabs } from "#core/controllers/tabs.js";
import { IconInline } from "#core/data-display/icon-inline.js";
import { DynamicImage } from "#core/data-display/image.js";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown.js";
import { useElementSize } from "#core/elements.js";
import { BeeIllustration } from "#core/illustration/bee.js";
import { Section } from "#core/layout/section.js";
import { HorizontalSeparator } from "#core/layout/separator.js";
import { Routes } from "#core/navigation.js";
import { ShowDay } from "#core/show-day";
import { Icon } from "#generated/icon.js";
import { theme } from "#generated/theme.js";
import { ImageUrl, cn } from "@animeaux/core";
import { ShowStandZone } from "@prisma/client";
import * as Popover from "@radix-ui/react-popover";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { forwardRef, useEffect, useState } from "react";
import type { loader } from "./route";

export function SectionEventList() {
  const { animations } = useLoaderData<typeof loader>();

  const { ref, size } = useElementSize<React.ComponentRef<"div">>();

  const { now } = useNow();

  return (
    <Section.Root columnCount={1} width="full">
      <Tabs className="px-safe-page-narrow md:px-safe-page-normal">
        {ShowDay.values.map((day) => (
          <Tab
            key={day}
            to={Routes.program.day(day).toString()}
            prefetch="intent"
            className="capitalize"
          >
            {day}
          </Tab>
        ))}
      </Tabs>

      <div className="grid grid-cols-[60px_minmax(0,1fr)] pl-safe-page-narrow md:pl-safe-page-normal">
        <Axis now={now} />

        <div className="relative grid snap-x snap-mandatory grid-cols-[repeat(2,90%)] overflow-x-auto scroll-smooth scrollbars-none pr-safe-page-narrow md:grid-cols-2 md:pr-safe-page-normal">
          <GridLines now={now} columnWidth={size?.width} />

          <Column
            ref={ref}
            label={STAND_ZONE_TRANSLATION[ShowStandZone.INSIDE]}
          >
            {animations[ShowStandZone.INSIDE]?.map((animation) => (
              <AnimationItem
                now={now}
                key={animation.id}
                animation={animation}
              />
            ))}
          </Column>

          <Column label={STAND_ZONE_TRANSLATION[ShowStandZone.OUTSIDE]}>
            {animations[ShowStandZone.OUTSIDE]?.map((animation) => (
              <AnimationItem
                now={now}
                key={animation.id}
                animation={animation}
              />
            ))}
          </Column>
        </div>
      </div>
    </Section.Root>
  );
}

function useNow() {
  const [, forceUpdate] = useState(true);

  const now = DateTime.now();

  useEffect(() => {
    const interval = setInterval(
      () => forceUpdate((b) => !b),
      ONE_MINUTE_IN_MS,
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { now };
}

function Axis({ now }: { now: DateTime }) {
  const { day } = useLoaderData<typeof loader>();

  return (
    <div
      className="relative border-r border-alabaster"
      style={{
        height:
          EVENT_LIST_VERTICAL_SPACING * 2 +
          HOUR_HEIGHT_PX * (ShowDay.intervals[day].length - 1),
      }}
    >
      {ShowDay.intervals[day].map((dateTime, index) => (
        <span
          key={dateTime.toISO()}
          className="absolute left-0 grid h-[1px] w-full grid-cols-fr-auto content-center items-center text-caption-lowercase-default"
          style={{ top: EVENT_LIST_VERTICAL_SPACING + HOUR_HEIGHT_PX * index }}
        >
          <span className="px-0.5">
            {dateTime.toLocaleString({ hour: "numeric", minute: "numeric" })}
          </span>

          <span className="w-0.5 border-t border-alabaster" />
        </span>
      ))}

      {isNowCursorVisible(day, now) ? (
        <span
          className="absolute left-0 grid h-[1px] w-full grid-cols-2-auto content-center items-center justify-between"
          style={{ top: getNowCursorTopOffset(day, now) }}
        >
          <span className="relative rounded-0.5 bg-mystic px-0.5 text-white text-caption-lowercase-emphasis">
            {now.toLocaleString({ hour: "numeric", minute: "numeric" })}

            <BeeIllustration
              direction="left-to-right"
              className="absolute -top-[13.5px] left-1/2 h-1 -translate-x-1/2"
            />
          </span>

          <HorizontalSeparator
            color="mystic"
            // The width of a dash
            className="max-w-[14px]"
          />
        </span>
      ) : null}
    </div>
  );
}

function GridLines({
  now,
  columnWidth,
}: {
  now: DateTime;
  columnWidth?: number;
}) {
  const { day } = useLoaderData<typeof loader>();

  const gridLineWidth = columnWidth != null ? `${columnWidth * 2}px` : "100%";

  return (
    <>
      {/* Horizontal grid lines. */}
      {ShowDay.intervals[day].map((dateTime, index) => (
        <span
          key={dateTime.toISO()}
          className="absolute left-0 -z-just-above h-[1px] bg-alabaster"
          style={{
            top: EVENT_LIST_VERTICAL_SPACING + HOUR_HEIGHT_PX * index,
            width: gridLineWidth,
          }}
        />
      ))}

      {/* Vertical separator between zones. */}
      <span
        className="absolute inset-y-0 -z-just-above h-full w-[1px] -translate-x-1/2 bg-alabaster"
        style={{
          left: columnWidth != null ? `${columnWidth}px` : "50%",
        }}
      />

      {isNowCursorVisible(day, now) ? (
        <span
          className="absolute left-0 -z-just-above grid h-[1px] grid-cols-1 content-center items-center"
          style={{
            width: gridLineWidth,
            top: getNowCursorTopOffset(day, now),
          }}
        >
          <HorizontalSeparator color="mystic" />
        </span>
      ) : null}
    </>
  );
}

function isNowCursorVisible(day: ShowDay.Enum, now: DateTime) {
  return (
    now >= ShowDay.schedules[day].start && now <= ShowDay.schedules[day].end
  );
}

function getNowCursorTopOffset(day: ShowDay.Enum, now: DateTime) {
  return (
    EVENT_LIST_VERTICAL_SPACING +
    HOUR_HEIGHT_PX * now.diff(ShowDay.schedules[day].start, "hours").as("hours")
  );
}

const Column = forwardRef<
  React.ComponentRef<"section">,
  React.ComponentPropsWithoutRef<"section"> & {
    label: string;
  }
>(function Column({ label, children, className, ...props }, ref) {
  return (
    <section
      {...props}
      ref={ref}
      className={cn("relative snap-center px-0.5", className)}
    >
      <header className="px-2 py-1 text-center text-caption-lowercase-default">
        {label}
      </header>

      {children}
    </section>
  );
});

function AnimationItem({
  now,
  animation,
}: {
  now: DateTime;
  animation: {
    animators: {
      id: string;
      isOrganizer: boolean;
      isPartner: boolean;
      logoPath: string;
      name: string;
      url: string;
    }[];
    description: string;
    endTime: string;
    id: string;
    registrationUrl: string | null;
    startTime: string;
    zone: ShowStandZone;
  };
}) {
  const { day } = useLoaderData<typeof loader>();

  const startTime = DateTime.fromISO(animation.startTime);
  const endTime = DateTime.fromISO(animation.endTime);

  const duration = endTime.diff(startTime, "minutes");

  const durationInHours = duration.as("hours");

  // - Line height is 24px
  // - Remove 1 line for vertical spacing.
  const maxLineCount = Math.floor((durationInHours * HOUR_HEIGHT_PX) / 24) - 1;

  const hasEnded = endTime < now;

  return (
    <Popover.Root>
      <section
        key={animation.id}
        className="absolute inset-x-0.5 grid min-h-0 grid-cols-1 py-[1px]"
        style={{
          height: HOUR_HEIGHT_PX * durationInHours,
          maxHeight: HOUR_HEIGHT_PX * durationInHours,
          top:
            EVENT_LIST_VERTICAL_SPACING +
            HOUR_HEIGHT_PX *
              startTime.diff(ShowDay.schedules[day].start, "hours").as("hours"),
        }}
      >
        <Popover.Trigger
          className={cn(
            "grid h-full min-h-0 auto-cols-auto grid-flow-col grid-cols-1 items-start gap-1 rounded-1 bg-alabaster px-1 py-[11px] text-left data-opened:bg-paleBlue can-hover:hover:bg-alabaster-200 can-hover:focus-visible:z-just-above can-hover:focus-visible:focus-compact active:can-hover:hover:bg-alabaster-300 can-hover:hover:data-opened:bg-paleBlue active:can-hover:hover:data-opened:bg-paleBlue",
            hasEnded ? "opacity-disabled" : undefined,
          )}
        >
          <span
            className="line-clamp-1"
            style={{
              WebkitLineClamp: String(maxLineCount),
              // Fallback for Browsers that don't support line-clamp.
              maxHeight: 24 * maxLineCount,
            }}
          >
            <Markdown content={animation.description} components={{}} />

            {animation.animators.length > 0 ? (
              <span className="uppercase">
                {" - "}
                {animation.animators
                  .map((animator) => animator.name)
                  .join(", ")}
              </span>
            ) : null}
          </span>

          {animation.registrationUrl != null ? (
            <span title="Sur inscription">
              <Icon
                id="ticket-perforated-solid"
                className="text-mystic icon-24"
              />
            </span>
          ) : null}

          <span className="text-mystic text-body-lowercase-emphasis">
            {startTime.toLocaleString({ hour: "numeric", minute: "numeric" })}
          </span>
        </Popover.Trigger>
      </section>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align={day === ShowDay.Enum.SATURDAY ? "start" : "end"}
          sideOffset={theme.spacing[1]}
          collisionPadding={theme.spacing[1]}
          hideWhenDetached
          className="grid w-[320px] min-w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-24px)] grid-cols-1 gap-2 rounded-1 bg-white p-2 shadow-modal animation-opacity-0 data-opened:animation-enter data-closed:animation-exit data-top:animation-translate-y-2 data-bottom:-animation-translate-y-2 can-hover:focus-visible:focus-compact"
        >
          <div className="grid grid-cols-fr-auto items-center gap-2">
            <span>
              <span>
                {startTime.toLocaleString({
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
              {" • "}
              <span>{duration.toHuman({ unitDisplay: "short" })}</span>
            </span>

            <span>{STAND_ZONE_TRANSLATION[animation.zone]}</span>
          </div>

          <p className="text-body-lowercase-emphasis">
            <Markdown
              content={animation.description}
              components={SENTENCE_COMPONENTS}
            />
          </p>

          {animation.animators.length > 0 ? (
            <div className="grid grid-cols-1 gap-1">
              {animation.animators.map((animator) => (
                <Link
                  key={animator.id}
                  to={animator.url}
                  className="group/item grid grid-cols-auto-fr items-center gap-1 rounded-0.5 can-hover:focus-visible:focus-spaced"
                >
                  <div className="grid w-[48px] grid-cols-1 overflow-hidden rounded-0.5 border border-alabaster">
                    <DynamicImage
                      image={ImageUrl.parse(animator.logoPath)}
                      fillTransparentBackground
                      alt={animator.name}
                      loading="eager"
                      aspectRatio="4:3"
                      objectFit="contain"
                      fallbackSize="128"
                      sizes={{ default: "48px" }}
                      className="w-full transition-transform duration-slow can-hover:group-hover/item:scale-105"
                    />
                  </div>

                  <span className="text-body-uppercase-default">
                    {animator.name}

                    {animator.isOrganizer ? (
                      <>
                        &nbsp;
                        <IconInline
                          id="show-circle-solid"
                          title="Organisateur du Salon des Ani’Meaux"
                        />
                      </>
                    ) : animator.isPartner ? (
                      <>
                        &nbsp;
                        <IconInline
                          id="award-solid"
                          title="Partenaire du Salon des Ani’Meaux"
                        />
                      </>
                    ) : null}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}

          {animation.registrationUrl != null ? (
            <Action className="justify-self-center" asChild>
              {hasEnded ? (
                <span className="opacity-disabled">Inscrivez-vous</span>
              ) : (
                <Link to={animation.registrationUrl}>Inscrivez-vous</Link>
              )}
            </Action>
          ) : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const ONE_MINUTE_IN_MS = 60 * 1000;

const EVENT_LIST_VERTICAL_SPACING = theme.spacing[4];

// The shortest animation is 10 min and we want to show 1 line of text:
//   1 line (24px) + vertical spacing (12px * 2) = 48px
const TEN_MINUTES_HEIGHT_PX = 48;

const HOUR_HEIGHT_PX = TEN_MINUTES_HEIGHT_PX * 6;

const STAND_ZONE_TRANSLATION: Record<ShowStandZone, string> = {
  [ShowStandZone.INSIDE]: "Scène intérieure",
  [ShowStandZone.OUTSIDE]: "Scène extérieure",
};
