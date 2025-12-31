import type { BaseLinkProps } from "#i/core/base-link";
import { BaseLink } from "#i/core/base-link";
import { LineShapeHorizontal } from "#i/core/layout/line-shape";
import type { IconProps } from "#i/generated/icon";
import { Icon } from "#i/generated/icon";
import largeLogo from "#i/images/large-logo.svg";
import { SubscriptionForm } from "#i/routes/resources.subscribe/input";
import { cn } from "@animeaux/core";

export function Footer() {
  return (
    <footer
      className={cn(
        "flex w-full flex-col items-center gap-24 px-page pb-12 pt-18",
        "md:pt-12",
      )}
    >
      <LineShapeHorizontal
        className={cn("h-4 w-full text-gray-300", "md:h-6")}
      />

      <div
        className={cn(
          "flex w-full flex-col items-center gap-24",
          "md:flex-row",
        )}
      >
        <section className={cn("flex flex-col gap-6", "md:flex-1")}>
          <div className="flex flex-col gap-6">
            <h2
              className={cn(
                "text-center text-title-section-small",
                "md:text-left md:text-title-section-large",
              )}
            >
              Newsletter
            </h2>

            <p className={cn("text-center", "md:text-left")}>
              Abonnez-vous à la newsletter pour ne rien rater des dernières
              nouveautés.
            </p>
          </div>

          <div
            className={cn(
              "flex w-full flex-col items-center",
              "md:items-start",
            )}
          >
            <SubscriptionForm />
          </div>
        </section>

        <section className={cn("flex flex-col items-start gap-6", "md:flex-1")}>
          <img
            src={largeLogo}
            alt="Ani’Meaux"
            className="h-[160px] self-center md:self-auto"
          />

          <ul className="flex flex-col">
            <ContactItem icon="phone" to="tel:+33171252698">
              01 71 25 26 98
            </ContactItem>

            <ContactItem icon="envelope" to="mailto:contact@animeaux.org">
              contact@animeaux.org
            </ContactItem>

            <ContactItem
              icon="location-dot"
              to="https://goo.gl/maps/X9869FvsTewM4XDz6"
            >
              30 Rue Pierre Brasseur, 77100 Meaux
            </ContactItem>
          </ul>

          <p>
            <strong className="text-body-emphasis">
              Nous ne disposons pas de structure physique, il s’agit d’une
              adresse postale uniquement.
            </strong>
          </p>
        </section>
      </div>

      <section
        className={cn(
          "flex flex-col gap-6 py-6 text-center text-gray-500",
          "md:w-full md:flex-row md:items-center md:justify-between md:gap-12 md:text-left",
        )}
      >
        <p className="text-caption-default">
          <BaseLink to="/mentions-legales" className="hover:text-gray-800">
            Mentions légales
          </BaseLink>{" "}
          • SIRET : 83962717100037 • RNA : W771014759
        </p>

        <p className="text-caption-default">
          Copyright © {new Date().getFullYear()} Ani’Meaux
        </p>
      </section>
    </footer>
  );
}

function ContactItem({
  icon,
  to,
  children,
}: {
  icon: IconProps["id"];
  to: NonNullable<BaseLinkProps["to"]>;
  children: string;
}) {
  return (
    <li className="flex">
      <BaseLink
        to={to}
        className="group flex items-start gap-2 hover:text-black"
      >
        <span className="flex h-6 items-center">
          <Icon
            id={icon}
            className="text-[14px] text-gray-500 group-hover:text-gray-800"
          />
        </span>

        <span>{children}</span>
      </BaseLink>
    </li>
  );
}
