import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { StaticImage } from "~/dataDisplay/image";
import { errorImages } from "~/images/error";

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
    <main
      className={cn(
        "px-page flex flex-col items-center gap-6",
        "md:flex-row md:gap-12"
      )}
    >
      <StaticImage
        loading="lazy"
        alt={meta.title}
        className={cn("w-full min-w-0 aspect-square", "md:w-auto md:flex-1")}
        image={errorImages}
        sizes="(max-width: 767px) 100vw, (min-width: 768px) and (max-width: 1023px) 50vw, 512px"
      />

      <div className={cn("flex flex-col gap-6", "md:flex-1")}>
        <div className={cn("px-4 flex flex-col gap-6", "md:px-6")}>
          <h1
            className={cn(
              "text-title-hero-small text-center",
              "md:text-title-hero-large md:text-left"
            )}
          >
            {meta.title}
          </h1>

          <p className={cn("text-center", "md:text-left")}>{meta.message}</p>
        </div>

        <div
          className={cn("px-2 flex justify-center", "md:px-6 md:justify-start")}
        >
          {meta.action}
        </div>
      </div>
    </main>
  );
}
