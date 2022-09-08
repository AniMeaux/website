import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { LineShapeHorizontal } from "~/layout/lineShape";
import { ActionData } from "~/routes/subscribe";

export function Footer() {
  return (
    <footer
      className={cn(
        "w-full pt-[72px] px-page pb-12 flex flex-col items-center gap-12",
        "md:py-12"
      )}
    >
      <div className={cn("w-full px-2 flex", "md:px-6")}>
        <LineShapeHorizontal
          className={cn("w-full h-4 text-gray-300", "md:h-6")}
        />
      </div>

      <div
        className={cn(
          "w-full flex flex-col items-center gap-12",
          "md:flex-row"
        )}
      >
        <section
          className={cn(
            "max-w-md flex flex-col gap-6",
            "md:min-w-0 md:max-w-none md:flex-1 md:px-6"
          )}
        >
          <div className={cn("px-4 flex flex-col gap-6", "md:px-0")}>
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
              "w-full px-2 flex flex-col items-center",
              "md:px-0 md:items-start"
            )}
          >
            <NewletterForm />
          </div>
        </section>

        <section
          className={cn(
            "max-w-md px-4 flex flex-col items-start gap-6",
            "md:max-w-none md:flex-1 md:min-w-0 md:px-6"
          )}
        >
          <img
            src={nameAndLogo}
            alt="Ani'Meaux"
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
              Nous ne disposons pas de structure physique, il s'agit d'une
              adresse postale uniquement.
            </strong>
          </p>
        </section>
      </div>

      <section
        className={cn(
          "max-w-md px-4 py-6 flex flex-col gap-6 text-gray-500 text-center",
          "md:max-w-none md:w-full md:p-6 md:flex-row md:items-center md:justify-between md:gap-12 md:text-left"
        )}
      >
        <p className="text-caption-default">
          <BaseLink to="/mentions-legales" className="hover:text-gray-800">
            Mentions légales
          </BaseLink>{" "}
          • SIRET : 83962717100037 • RNA : W771014759
        </p>

        <p className="text-caption-default">
          Copyright © {new Date().getFullYear()} Ani'Meaux
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

function NewletterForm() {
  const fetcher = useFetcher<ActionData>();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => {
      if (fetcher.data?.type === "success") {
        invariant(formRef.current != null, "formRef must be set");
        formRef.current.reset();
      }
    },
    // Use `fetcher.data` instead of `isSuccess` to distinguish 2 successive
    // success.
    [fetcher.data]
  );

  useEffect(
    () => {
      if (fetcher.data?.type === "error") {
        invariant(inputRef.current != null, "inputRef must be set");
        inputRef.current.focus();
      }
    },
    // Use `fetcher.data` instead of `isError` to distinguish 2 successive errors.
    [fetcher.data]
  );

  const isSuccess = fetcher.data?.type === "success";
  const isError = fetcher.data?.type === "error";

  return (
    <div
      className={cn(
        "w-full max-w-sm flex flex-col items-start gap-3",
        "md:max-w-none"
      )}
    >
      <fetcher.Form
        ref={formRef}
        method="post"
        action="/subscribe"
        className={cn("w-full rounded-bubble-md shadow-base p-1 flex gap-2", {
          "bg-brandRed-lightest": isError,
          "bg-white": !isError,
        })}
      >
        <input
          ref={inputRef}
          type="email"
          name="email"
          aria-label="Email"
          placeholder="jean@email.com"
          className="min-w-0 flex-1 rounded-bubble-sm bg-transparent px-6 py-2 placeholder-gray-500"
        />

        <button
          className={cn(
            "flex p-3 rounded-bubble-sm text-white transition-[background-color,transform] duration-100 ease-in-out",
            {
              "bg-brandGreen": isSuccess,
              "bg-brandBlue hover:bg-brandBlue-lighter active:scale-95":
                !isSuccess,
            }
          )}
        >
          <Icon id={isSuccess ? "check" : "paperPlane"} />
        </button>
      </fetcher.Form>

      {fetcher.data?.type === "error" && (
        <p className="flex items-center gap-2 text-brandRed">
          <Icon id="circleExclamation" className="text-[14px]" />
          <span className="text-caption-default">
            {fetcher.data.errors.formErrors.join(". ") ||
              fetcher.data.errors.fieldErrors.email}
          </span>
        </p>
      )}
    </div>
  );
}
