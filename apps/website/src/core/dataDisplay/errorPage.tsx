import { actionClassNames } from "#core/actions.ts";
import { BaseLink } from "#core/baseLink.tsx";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "#core/layout/heroSection.tsx";
import { errorImages } from "#images/error.tsx";
import { cn } from "@animeaux/core";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

const STATUS_CODE = [404, 500] as const;
type StatusCode = (typeof STATUS_CODE)[number];
const DEFAULT_STATUS_CODE = 500 satisfies StatusCode;

function isStatusCode(status: number): status is StatusCode {
  return STATUS_CODE.includes(status as StatusCode);
}

function asStatusCode(status: number) {
  return isStatusCode(status) ? status : DEFAULT_STATUS_CODE;
}

type ErrorMetaData = {
  title: string;
  message: string;
  action: React.ReactNode;
};

const STATUS_CODE_ERROR_META_DATA: Record<StatusCode, ErrorMetaData> = {
  404: {
    title: "Page introuvable",
    message: "Nous n’avons pas trouvé la page que vous chercher.",
    action: (
      <BaseLink to="/" className={actionClassNames.standalone()}>
        Page d’accueil
      </BaseLink>
    ),
  },
  500: {
    title: "Oups",
    message: "Une erreur est survenue.",
    action: (
      <BaseLink to="/" reloadDocument className={actionClassNames.standalone()}>
        Rafraichir
      </BaseLink>
    ),
  },
};

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

  const status = isRouteErrorResponse(error)
    ? asStatusCode(error.status)
    : DEFAULT_STATUS_CODE;

  const meta = STATUS_CODE_ERROR_META_DATA[status];

  return (
    <main
      className={cn("w-full px-page flex flex-col", {
        "min-h-screen py-12 justify-center": isStandAlone,
      })}
    >
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={errorImages} />
        </HeroSectionAside>
        <HeroSectionAside>
          <HeroSectionTitle isLarge>{meta.title}</HeroSectionTitle>
          <HeroSectionParagraph>{meta.message}</HeroSectionParagraph>
          <HeroSectionAction>{meta.action}</HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>
    </main>
  );
}
