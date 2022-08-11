import { BaseLink } from "~/core/baseLink";
import { errorImages } from "~/images/error";
import { SplitSection } from "~/layout/splitSection";

type ErrorMetaData = {
  title: string;
  message: string;
  action: React.ReactNode;
};

const actionClassNames =
  "px-6 py-2 bg-blue-base rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg flex items-center text-white text-body-emphasis transition-[background-color,transform] duration-100 ease-in-out hover:bg-blue-light active:scale-95";

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
      <SplitSection
        title={meta.title}
        message={meta.message}
        action={meta.action}
        imageAlt={meta.title}
        image={errorImages}
        hasLargeTitle
      />
    </main>
  );
}
