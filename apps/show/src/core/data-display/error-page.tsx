import { Action } from "#core/actions/action";
import { DynamicImage } from "#core/data-display/image";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { cn } from "@animeaux/core";
import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { captureRemixErrorBoundaryError } from "@sentry/remix";
import { useEffect } from "react";

export function getErrorTitle(status: number): string {
  return STATUS_CODE_ERROR_META_DATA[asStatusCode(status)].title;
}

export function ErrorPage({ isRoot = false }: { isRoot?: boolean }) {
  const error = useRouteError();

  useEffect(() => {
    captureRemixErrorBoundaryError(error);
  }, [error]);

  const status = isRouteErrorResponse(error)
    ? asStatusCode(error.status)
    : DEFAULT_STATUS_CODE;

  const meta = STATUS_CODE_ERROR_META_DATA[status];

  return (
    <main
      className={cn(
        "grid grid-cols-1",
        isRoot ? "min-h-screen items-center" : undefined,
      )}
    >
      <div className={cn("grid grid-cols-1", isRoot ? "py-safe-0" : undefined)}>
        <Section.Root columnCount={isRoot ? 1 : 2}>
          {!isRoot ? (
            <LazyElement asChild>
              <Section.ImageAside className="aspect-square -translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
                <DynamicImage
                  image={{
                    id: "/show/pages/pott-et-pollen-faq_yj87jv",
                  }}
                  fallbackSize="1024"
                  sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
                  loading="eager"
                  alt="Pott et Pollen se posent des questions."
                  aspectRatio="none"
                  className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-[52%]"
                />
              </Section.ImageAside>
            </LazyElement>
          ) : null}

          <LazyElement asChild>
            <Section.TextAside className="translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
              <Section.Title asChild>
                <h1>{meta.title}</h1>
              </Section.Title>

              <p>{meta.message}</p>

              {meta.action}
            </Section.TextAside>
          </LazyElement>
        </Section.Root>
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
          <Link to={Routes.home.toString()} prefetch="intent">
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
          <Link to={Routes.home.toString()} reloadDocument>
            Rafraichir
          </Link>
        </Action>
      </Section.Action>
    ),
  },
};
