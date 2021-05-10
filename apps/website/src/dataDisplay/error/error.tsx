import { StaticImage, StaticImageProps } from "~/dataDisplay/image";
import { CallToActionButton, CallToActionLink } from "~/layout/callToAction";
import { CenteredContent } from "~/layout/centeredContent";
import { Section } from "~/layout/section";

export type ErrorType = "notFound" | "serverError";

export const ErrorTypeTitle: Record<ErrorType, string> = {
  notFound: "Page introuvable",
  serverError: "Oups",
};

const ErrorTypeMessage: Record<ErrorType, string> = {
  notFound: "Nous n'avons pas trouvé la page que vous chercher.",
  serverError: "Une erreur est survenue.",
};

const ErrorTypeAction: Record<ErrorType, React.ReactNode> = {
  notFound: (
    <CallToActionLink color="blue" href="/">
      Page d'accueil
    </CallToActionLink>
  ),
  serverError: (
    <CallToActionButton color="blue" onClick={() => window.location.reload()}>
      Rafraichir
    </CallToActionButton>
  ),
};

const ErrorTypeImages: Record<
  ErrorType,
  Pick<StaticImageProps, "smallImage" | "largeImage" | "alt">
> = {
  notFound: {
    alt: "Page introuvable",
    largeImage: "/error@2x.jpg",
    smallImage: "/error.jpg",
  },
  serverError: {
    alt: "Erreur",
    largeImage: "/error@2x.jpg",
    smallImage: "/error.jpg",
  },
};

export type ErrorProps = {
  type: ErrorType;
};

export function Error({ type }: ErrorProps) {
  return (
    <Section>
      <CenteredContent>
        <section className="Error">
          <StaticImage {...ErrorTypeImages[type]} className="Error__Image" />

          <div className="Error__Content">
            <h1 className="Error__Title">{ErrorTypeTitle[type]}</h1>
            <p>{ErrorTypeMessage[type]}</p>
            <div className="Error__Action">{ErrorTypeAction[type]}</div>
          </div>
        </section>
      </CenteredContent>
    </Section>
  );
}
