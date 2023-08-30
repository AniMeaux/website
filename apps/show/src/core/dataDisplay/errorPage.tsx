import { Action } from "#core/actions.tsx";
import { useOptionalConfig } from "#core/config.ts";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { Section } from "#core/layout/section.tsx";
import { Routes } from "#core/navigation.tsx";
import { cn } from "@animeaux/core";
import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function getErrorTitle(status: number): string {
  return STATUS_CODE_ERROR_META_DATA[asStatusCode(status)].title;
}

export function ErrorPage({
  isStandAlone = false,
}: {
  isStandAlone?: boolean;
}) {
  const error = useRouteError();
  console.error("ErrorBoundary error", error);

  const config = useOptionalConfig();
  const status = isRouteErrorResponse(error)
    ? asStatusCode(error.status)
    : DEFAULT_STATUS_CODE;

  const meta = STATUS_CODE_ERROR_META_DATA[status];

  return (
    <main
      className={cn(
        "grid grid-cols-1",
        isStandAlone ? "min-h-screen items-center" : undefined,
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1",
          isStandAlone ? "py-safe-0" : undefined,
        )}
      >
        <Section>
          <Section.ImageAside>
            {config != null ? (
              <DynamicImage
                image={{
                  id: "/show/32721bd7-fc37-4dc3-8a1d-c080f6ed1dec",
                  blurhash: "UcL|ii00r=xa.TIBaet6-oxZRjWBIoS4RjR*",
                }}
                loading="eager"
                alt="Chiot allongé sur le sol."
                fallbackSize="1024"
                sizes={{ default: "384px", md: "50vw", lg: "512px" }}
                shape={{ id: "variant12", color: "alabaster", side: "left" }}
              />
            ) : null}
          </Section.ImageAside>

          <Section.TextAside>
            <Section.Title asChild>
              <h1 className="text-center md:text-left">{meta.title}</h1>
            </Section.Title>

            <p className="text-center md:text-left">{meta.message}</p>

            {meta.action}
          </Section.TextAside>
        </Section>
      </div>
    </main>
  );
}

const STATUS_CODE = [404, 500] as const;
type StatusCode = (typeof STATUS_CODE)[number];
const DEFAULT_STATUS_CODE = 500 satisfies StatusCode;

function isStatusCode(status: number): status is StatusCode {
  return STATUS_CODE.includes(status as StatusCode);
}

function asStatusCode(status: number) {
  return isStatusCode(status) ? status : DEFAULT_STATUS_CODE;
}

const STATUS_CODE_ERROR_META_DATA: Record<
  StatusCode,
  {
    title: string;
    message: string;
    action: React.ReactNode;
  }
> = {
  404: {
    title: "Page introuvable",
    message: "Nous n’avons pas trouvé la page que vous chercher.",
    action: (
      <Section.Action asChild>
        <Action asChild>
          <Link to={Routes.home()} prefetch="intent">
            Page d’accueil
          </Link>
        </Action>
      </Section.Action>
    ),
  },
  500: {
    title: "Oups",
    message: "Une erreur est survenue.",
    action: (
      <Section.Action asChild>
        <Action asChild>
          <Link to={Routes.home()} reloadDocument>
            Rafraichir
          </Link>
        </Action>
      </Section.Action>
    ),
  },
};
