import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/core/layout/heroSection";
import { errorImages } from "~/images/error";

type ErrorMetaData = {
  title: string;
  message: string;
  action: React.ReactNode;
};

const STATUS_CODE_ERROR_META_DATA: Record<number, ErrorMetaData> = {
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

  const status = isRouteErrorResponse(error) ? error.status : 500;

  const meta =
    STATUS_CODE_ERROR_META_DATA[status] ?? STATUS_CODE_ERROR_META_DATA[500];

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
