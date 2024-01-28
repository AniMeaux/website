import { Action } from "#core/actions";
import { BaseLink } from "#core/baseLink";
import { Empty } from "#core/dataDisplay/empty";
import { Routes } from "#core/navigation";
import {
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from "@remix-run/react";

export function ErrorPage() {
  const error = useRouteError();
  console.error("ErrorBoundary error", error);

  const status = isRouteErrorResponse(error)
    ? asStatusCode(error.status)
    : DEFAULT_STATUS_CODE;

  const meta = STATUS_CODE_ERROR_META_DATA[status];

  return (
    <Empty
      icon={meta.icon}
      iconAlt={meta.title}
      title={meta.title}
      message={meta.message}
      action={<meta.action />}
    />
  );
}

export function getErrorTitle(status: number): string {
  return STATUS_CODE_ERROR_META_DATA[asStatusCode(status)].title;
}

type ErrorMetaData = {
  title: string;
  message: string;
  icon: string;
  action: React.ElementType;
};

function GoHomeAction() {
  return (
    <Action asChild>
      <BaseLink to={Routes.home.toString()}>Page d’accueil</BaseLink>
    </Action>
  );
}

function RefreshAction() {
  const location = useLocation();

  return (
    <Action asChild>
      <BaseLink to={location} reloadDocument>
        Rafraichir
      </BaseLink>
    </Action>
  );
}

const STATUS_CODE = [403, 404, 500] as const;
type StatusCode = (typeof STATUS_CODE)[number];
const DEFAULT_STATUS_CODE = 500 satisfies StatusCode;

function isStatusCode(status: number): status is StatusCode {
  return STATUS_CODE.includes(status as StatusCode);
}

function asStatusCode(status: number) {
  return isStatusCode(status) ? status : DEFAULT_STATUS_CODE;
}

const STATUS_CODE_ERROR_META_DATA: Record<StatusCode, ErrorMetaData> = {
  403: {
    title: "Interdit",
    message: "Vous n’êtes pas autorisé à accéder à cette page.",
    icon: "🙅‍♀️",
    action: GoHomeAction,
  },
  404: {
    title: "Page introuvable",
    message: "Nous n’avons pas trouvé la page que vous chercher.",
    icon: "🤷‍♀️",
    action: GoHomeAction,
  },
  500: {
    title: "Oups",
    message: "Une erreur est survenue.",
    icon: "🤦‍♀️",
    action: RefreshAction,
  },
};
