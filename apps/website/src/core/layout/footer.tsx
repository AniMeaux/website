import { BaseLink, BaseLinkProps } from "#core/baseLink.tsx";
import { cn } from "#core/classNames.ts";
import { LineShapeHorizontal } from "#core/layout/lineShape.tsx";
import { Icon, IconProps } from "#generated/icon.tsx";
import nameAndLogo from "#images/nameAndLogo.svg";
import { SubscriptionForm } from "#routes/resources.subscribe.tsx";

export function Footer() {
  return (
    <footer
      className={cn(
        "w-full pt-18 px-page pb-12 flex flex-col items-center gap-24",
        "md:pt-12"
      )}
    >
      <LineShapeHorizontal
        className={cn("w-full h-4 text-gray-300", "md:h-6")}
      />

      <div
        className={cn(
          "w-full flex flex-col items-center gap-24",
          "md:flex-row"
        )}
      >
        <section className={cn("flex flex-col gap-6", "md:flex-1")}>
          <div className="flex flex-col gap-6">
            <h2
              className={cn(
                "text-title-section-small text-center",
                "md:text-title-section-large md:text-left"
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
              "w-full flex flex-col items-center",
              "md:items-start"
            )}
          >
            <SubscriptionForm />
          </div>
        </section>

        <section className={cn("flex flex-col items-start gap-6", "md:flex-1")}>
          <img
            src={nameAndLogo}
            alt="Ani’Meaux"
            className={cn("h-[60px]", "md:h-20")}
          />

          <ul className="flex flex-col">
            <ContactItem icon="phone" to="tel:+33612194392">
              06 12 19 43 92
            </ContactItem>

            <ContactItem icon="envelope" to="mailto:contact@animeaux.org">
              contact@animeaux.org
            </ContactItem>

            <ContactItem
              icon="locationDot"
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
          "py-6 flex flex-col gap-6 text-gray-500 text-center",
          "md:w-full md:flex-row md:items-center md:justify-between md:gap-12 md:text-left"
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
        <span className="h-6 flex items-center">
          <Icon
            id={icon}
            className="text-gray-500 text-[14px] group-hover:text-gray-800"
          />
        </span>

        <span>{children}</span>
      </BaseLink>
    </li>
  );
}
