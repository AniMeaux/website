import { useLocation } from "@remix-run/react";
import { actionClassName } from "~/core/action";
import { BaseLink } from "~/core/baseLink";
import { Empty } from "~/core/dataDisplay/empty";

export function ErrorPage({ status }: { status: number }) {
  const meta =
    STATUS_CODE_ERROR_META_DATA[status] ?? STATUS_CODE_ERROR_META_DATA[500];

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
  return (
    STATUS_CODE_ERROR_META_DATA[status] ?? STATUS_CODE_ERROR_META_DATA[500]
  ).title;
}

type ErrorMetaData = {
  title: string;
  message: string;
  icon: string;
  action: React.ElementType;
};

function GoHomeAction() {
  return (
    <BaseLink to="/" className={actionClassName()}>
      Page d’accueil
    </BaseLink>
  );
}

function RefreshAction() {
  const location = useLocation();

  return (
    <BaseLink to={location} reloadDocument className={actionClassName()}>
      Rafraichir
    </BaseLink>
  );
}

const STATUS_CODE_ERROR_META_DATA: Record<number, ErrorMetaData> = {
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
