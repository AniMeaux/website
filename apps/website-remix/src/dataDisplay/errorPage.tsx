import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { errorImages } from "~/images/error";
import { HeroSection } from "~/layout/heroSection";

type ErrorMetaData = {
  title: string;
  message: string;
  action: React.ReactNode;
};

const STATUS_CODE_ERROR_META_DATA: Record<number, ErrorMetaData> = {
  404: {
    title: "Page introuvable",
    message: "Nous n'avons pas trouvé la page que vous chercher.",
    action: (
      <BaseLink to="/" className={actionClassNames}>
        Page d'accueil
      </BaseLink>
    ),
  },
  500: {
    title: "Oups",
    message: "Une erreur est survenue.",
    action: (
      <BaseLink to="/" reloadDocument className={actionClassNames}>
        Rafraichir
      </BaseLink>
    ),
  },
};

export function ErrorPage({ status }: { status: number }) {
  const meta =
    STATUS_CODE_ERROR_META_DATA[status] ?? STATUS_CODE_ERROR_META_DATA[500];

  return (
    <main className="px-page flex flex-col">
      <HeroSection
        title={meta.title}
        message={meta.message}
        action={meta.action}
        image={errorImages}
        hasLargeTitle
      />
    </main>
  );
}
