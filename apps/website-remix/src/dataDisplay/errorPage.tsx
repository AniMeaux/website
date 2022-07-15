import { BaseLink } from "~/core/baseLink";

type ErrorMetaData = {
  title: string;
  message: string;
  action: React.ReactNode;
};

const STATUS_CODE_ERROR_META_DATA: Record<number, ErrorMetaData> = {
  404: {
    title: "Page introuvable",
    message: "Nous n'avons pas trouvé la page que vous chercher.",
    action: <BaseLink to="/">Page d'accueil</BaseLink>,
  },
  500: {
    title: "Oups",
    message: "Une erreur est survenue.",
    action: (
      <BaseLink to="/" reloadDocument>
        Rafraichir
      </BaseLink>
    ),
  },
};

export function ErrorPage({ status }: { status: number }) {
  const meta =
    STATUS_CODE_ERROR_META_DATA[status] ?? STATUS_CODE_ERROR_META_DATA[500];

  return (
    <main>
      <h1>
        {status} - {meta.title}
      </h1>

      <p>{meta.message}</p>

      {meta.action}
    </main>
  );
}
