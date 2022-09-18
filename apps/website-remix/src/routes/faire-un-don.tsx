import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { Icon, IconProps } from "~/generated/icon";
import { donationImages } from "~/images/donation";
import { helloassoImages } from "~/images/helloasso";
import paypalImage from "~/images/paypal.png";
import teamingImage from "~/images/teaming.png";
import { bubbleSectionClassNames, BubbleShape } from "~/layout/bubbleSection";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export default function DonationPage() {
  const { donationUrl } = useConfig();

  return (
    <main className="w-full px-page flex flex-col gap-24">
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={donationImages} loading="eager" />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Faire un don</HeroSectionTitle>
          <HeroSectionParagraph>
            Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter
             ? Vous pouvez nous faire un don ! Ce don servira à financer les{" "}
            <strong className="text-body-emphasis">soins vétérinaires</strong>,
            effectuer plus de{" "}
            <strong className="text-body-emphasis">
              sauvetages et acheter du matériel
            </strong>{" "}
            pour les animaux.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <TaxationSection />

      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={helloassoImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Plus simple</HeroSectionTitle>
          <HeroSectionParagraph>
            En passant par Helloasso vous recevrez automatiquement votre{" "}
            <strong className="text-body-emphasis">reçu fiscal</strong>.
          </HeroSectionParagraph>
          <HeroSectionAction>
            <BaseLink
              to={donationUrl}
              className={actionClassNames.standalone()}
            >
              Faire un don
            </BaseLink>
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>

      <OtherOptionsSection />
    </main>
  );
}

function OtherOptionsSection() {
  const { paypalUrl, teamingUrl } = useConfig();

  return (
    <section className="flex flex-col gap-12">
      <h2
        className={cn(
          "text-title-section-small text-center",
          "md:text-title-section-large"
        )}
      >
        Autres options
      </h2>

      <ul className="flex items-start flex-wrap gap-12 justify-evenly">
        <OtherOption
          image={{ src: paypalImage, alt: "PayPal" }}
          action={
            <BaseLink
              to={paypalUrl}
              className={actionClassNames.standalone({ color: "gray" })}
            >
              Faire un don
            </BaseLink>
          }
        >
          En quelques clics.
        </OtherOption>

        <OtherOption
          image={{ src: teamingImage, alt: "Teaming" }}
          action={
            <BaseLink
              to={teamingUrl}
              className={actionClassNames.standalone({ color: "gray" })}
            >
              Faire un don
            </BaseLink>
          }
        >
          Faire don d’1 € par mois.
        </OtherOption>

        <OtherOption image="envelope">
          Envoyez un chèque à l’ordre d’
          <strong className="text-body-emphasis">Ani’Meaux</strong> au{" "}
          <strong className="text-body-emphasis">
            30 Rue Pierre Brasseur 77100 Meaux
          </strong>
          .
        </OtherOption>
      </ul>
    </section>
  );
}

function OtherOption({
  image,
  action,
  children,
}: {
  image: IconProps["id"] | { src: string; alt: string };
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="w-[200px] flex-none flex flex-col gap-6 text-center">
      {typeof image === "string" ? (
        <span className="w-[200px] aspect-video flex items-center justify-center text-[80px] text-gray-700">
          <Icon id={image} />
        </span>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          className="w-[200px] aspect-video"
        />
      )}

      <p>{children}</p>
      {action != null && <div className="self-center">{action}</div>}
    </li>
  );
}

function TaxationSection() {
  return (
    <section className={bubbleSectionClassNames.root()}>
      <span className={bubbleSectionClassNames.bubbleContainer()}>
        <BubbleShape isDouble />
      </span>

      <div
        className={cn(
          bubbleSectionClassNames.content(),
          "px-10 py-18 flex flex-col items-center gap-6 text-center",
          "md:px-30 md:py-[60px]"
        )}
      >
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Déduction fiscale
        </h2>

        <p>
          Le don à Ani’Meaux ouvre droit à une{" "}
          <strong className="text-body-emphasis">déduction fiscale</strong> car
          il remplit les conditions générales prévues aux articles 200 et
          238 bis du code général des impôts.
        </p>

        <div
          className={cn("flex flex-col gap-6", "md:flex-row md:items-start")}
        >
          <div className="flex-1 flex flex-col">
            <h3 className="text-title-item">En passant par Helloasso</h3>
            <p>Vous recevrez automatiquement votre reçu fiscal par mail.</p>
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-title-item">
              En passant par les autres options
            </h3>
            <p>
              Vous devrez envoyer par email vos coordonnées, montant et date du
              don à{" "}
              <BaseLink
                to="mailto:contact@animeaux.org"
                className={actionClassNames.proseInline()}
              >
                contact@animeaux.org
              </BaseLink>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
