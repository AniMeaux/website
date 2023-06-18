import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useOptionalConfig } from "~/core/config";
import { DynamicImage } from "~/core/dataDisplay/image";

export function getErrorTitle(status: number): string {
  return (
    STATUS_CODE_ERROR_META_DATA[status] ?? STATUS_CODE_ERROR_META_DATA[500]
  ).title;
}

export function ErrorPage({
  isStandAlone = false,
}: {
  isStandAlone?: boolean;
}) {
  const error = useRouteError();
  console.error("ErrorBoundary error", error);

  const config = useOptionalConfig();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  const meta =
    STATUS_CODE_ERROR_META_DATA[status] ?? STATUS_CODE_ERROR_META_DATA[500];

  return (
    <main
      className={cn(
        "grid grid-cols-1",
        isStandAlone ? "min-h-screen items-center" : undefined
      )}
    >
      <section
        className={cn(
          "px-safe-page-narrow md:px-safe-page-normal grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-8 md:items-center",
          isStandAlone ? "py-safe-4" : "py-4"
        )}
      >
        <aside className="relative grid grid-cols-1">
          {config != null ? (
            <DynamicImage
              image={{
                id: "/show/32721bd7-fc37-4dc3-8a1d-c080f6ed1dec",
                blurhash: "UcL|ii00r=xa.TIBaet6-oxZRjWBIoS4RjR*",
              }}
              alt="Chiot allongé sur le sol."
              fallbackSize="1024"
              sizes={{ md: "50vw", default: "100vw" }}
              loading="eager"
              shape={{ id: "variant12", color: "alabaster", side: "left" }}
            />
          ) : null}
        </aside>

        <aside className="grid grid-cols-1 gap-2">
          <h1 className="text-title-small md:text-title-large text-mystic">
            {meta.title}
          </h1>

          <p>{meta.message}</p>

          <div className="grid grid-cols-1 justify-items-center md:justify-items-start">
            {meta.action}
          </div>
        </aside>
      </section>
    </main>
  );
}

const STATUS_CODE_ERROR_META_DATA: Record<
  number,
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
      <Action asChild>
        <BaseLink to="/">Page d’accueil</BaseLink>
      </Action>
    ),
  },
  500: {
    title: "Oups",
    message: "Une erreur est survenue.",
    action: (
      <Action asChild>
        <BaseLink to="/" reloadDocument>
          Rafraichir
        </BaseLink>
      </Action>
    ),
  },
};
