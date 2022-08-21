import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { getActionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { StaticImage } from "~/dataDisplay/image";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { showImages } from "~/images/show";

const OPENING_TIME = DateTime.fromISO("2023-06-10T10:00:00.000+02:00");
const ONE_MINUTE_IN_MS = 60 * 1000;

export default function HomePage() {
  return (
    <main className="px-page flex flex-col gap-24">
      <HeroSection />
    </main>
  );
}

function HeroSection() {
  const [, forceUpdate] = useState(true);

  const now = DateTime.now();
  const diff = OPENING_TIME.diff(now, ["days", "hours", "minutes"]);

  // Force a re-rendering every minutes to recompute the diff.
  useEffect(() => {
    const interval = setInterval(
      () => forceUpdate((b) => !b),
      ONE_MINUTE_IN_MS
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      className={cn(
        "flex flex-col items-center gap-6",
        "md:flex-row-reverse md:gap-12"
      )}
    >
      <StaticImage
        className={cn("w-full aspect-square", "md:w-auto md:min-w-0 md:flex-1")}
        image={showImages}
        sizes={{ lg: "512px", md: "50vw", default: "100vw" }}
      />

      <div className={cn("w-full flex flex-col gap-6", "md:flex-1")}>
        <div
          className={cn(
            "px-4 flex flex-col gap-6 text-center",
            "md:px-6 md:text-left"
          )}
        >
          <img
            src={nameAndLogo}
            alt="Salon des Ani'Meaux"
            className="w-full aspect-[440_/_126]"
          />

          <p>
            Premier salon dédié au bien-être animal à Meaux.
            <br />
            <strong className="text-body-emphasis">
              <time dateTime={OPENING_TIME.toISO()}>
                10 et 11 juin 2023 - 10h à 18h
              </time>{" "}
              - Colisée de Meaux
            </strong>
          </p>
        </div>

        <div
          className={cn(
            "px-2 flex flex-col gap-6 items-center",
            "md:px-6 md:items-start"
          )}
        >
          {diff.toMillis() > 0 && (
            <div className="flex items-center gap-3">
              <CountDownItem
                label={diff.days > 1 ? "Jours" : "Jour"}
                value={diff.days}
              />
              <CountDownItem
                label={diff.hours > 1 ? "Heures" : "Heure"}
                value={diff.hours}
              />

              <CountDownItem
                // `minutes` can have decimals because it's the smallest unit
                // asked in the diff
                label={Math.floor(diff.minutes) > 1 ? "Minutes" : "Minute"}
                value={Math.floor(diff.minutes)}
              />
            </div>
          )}

          <BaseLink
            to="https://www.helloasso.com/associations/ani-meaux/evenements/salon-des-ani-meaux-2023"
            className={getActionClassNames()}
          >
            Achetez votre billet
          </BaseLink>
        </div>
      </div>
    </section>
  );
}

function CountDownItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg bg-gray-100 px-3 py-2 flex flex-col items-center">
      <span className="font-serif text-[32px] font-bold leading-normal text-blue-base">
        {value}
      </span>

      <span>{label}</span>
    </div>
  );
}
