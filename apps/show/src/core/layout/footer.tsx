import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { SocialLink } from "#core/actions/social-link";
import { DynamicImage } from "#core/data-display/image";
import { LegalBackground } from "#core/layout/legal-background";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import { cn } from "@animeaux/core";
import { Link } from "@remix-run/react";

export const Footer = {
  Root: function FooterRoot({ children }: React.PropsWithChildren<{}>) {
    return <footer className="grid grid-cols-1">{children}</footer>;
  },

  WaveSection: function FooterWaveSection({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) {
    return (
      <section
        className={cn(
          "grid pt-4",
          children != null
            ? "relative px-page-narrow pb-4 md:px-page-normal"
            : undefined,
          className,
        )}
      >
        {children}

        <Wave className="absolute inset-x-0 bottom-0 -z-just-above h-[53px] w-full md:h-[90px]" />
      </section>
    );
  },

  LegalSection: function FooterLegalSection() {
    return (
      <section className="relative z-just-above grid grid-cols-1 px-page-narrow py-2 md:px-page-normal">
        <LegalBackground className="absolute left-0 top-0 -z-just-above h-full w-full" />

        <p className="text-center text-white text-caption-lowercase-emphasis">
          Copyright © {new Date().getFullYear()} Ani’Meaux
        </p>
      </section>
    );
  },

  ContentSection: function FooterContentSection({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"section">) {
    return (
      <section
        {...props}
        className={cn(
          "bg-paleBlue px-page-narrow py-4 md:px-page-normal",
          className,
        )}
      />
    );
  },

  AnimeauxLogo: function FooterAnimeauxLogo({
    isLarge = false,
  }: {
    isLarge?: boolean;
  }) {
    return (
      <DynamicImage
        image={{
          id: "/show/logos/animeaux_edoni2",
          blurhash: "ULQvB*s+?^tRt2oJt8WX.mSPMKskTKWVe8sl",
        }}
        fallbackSize="256"
        sizes={{ default: "150px", md: "200px" }}
        loading="lazy"
        alt="Association Ani’Meaux"
        aspectRatio="1:1"
        className={cn(
          "w-[150px] justify-self-center rounded-full",
          isLarge ? "md:w-[200px]" : undefined,
        )}
      />
    );
  },

  Links: function FooterLinks() {
    return (
      <Section.TextAside className="max-w-sm justify-self-center md:max-w-none md:justify-self-stretch">
        <div className="grid grid-flow-col justify-start gap-1">
          <SocialLink to={CLIENT_ENV.FACEBOOK_URL}>
            <Pictogram id="facebook" className="icon-24" />
          </SocialLink>

          <SocialLink to={CLIENT_ENV.INSTAGRAM_URL}>
            <Pictogram id="instagram" className="icon-24" />
          </SocialLink>
        </div>

        <ul className="grid grid-cols-1">
          <ContactItem icon="phone-light" to="tel:+33612194392">
            06 12 19 43 92
          </ContactItem>

          <ContactItem icon="envelope-light" to="mailto:salon@animeaux.org">
            salon@animeaux.org
          </ContactItem>

          {CLIENT_ENV.PRESS_RELEASE_URL != null ? (
            <ContactItem
              icon="newspaper-light"
              to={CLIENT_ENV.PRESS_RELEASE_URL}
            >
              Communiqué de presse
            </ContactItem>
          ) : null}

          <ContactItem
            icon="image-light"
            to={Routes.previousEditions.toString()}
          >
            Éditions précédentes
          </ContactItem>
        </ul>

        <p>
          Le Salon des Ani’Meaux est organisé par l'association{" "}
          <ProseInlineAction asChild>
            <Link to={CLIENT_ENV.ANIMEAUX_URL}>Ani’Meaux</Link>
          </ProseInlineAction>{" "}
          au Colisée de Meaux.
        </p>
      </Section.TextAside>
    );
  },
};

function ContactItem({
  icon,
  to,
  children,
}: {
  icon: React.ComponentProps<typeof Icon>["id"];
  to: NonNullable<React.ComponentProps<typeof Link>["to"]>;
  children: string;
}) {
  return (
    <li className="grid grid-cols-1 justify-items-start">
      <Link
        to={to}
        prefetch="intent"
        className={cn(
          "grid grid-cols-2-auto items-start gap-1 rounded-0.5 can-hover:focus-visible:focus-spaced",

          // Text color.
          "text-prussianBlue transition-colors duration-normal can-hover:hover:text-prussianBlue-900 active:can-hover:hover:text-prussianBlue-800",
        )}
      >
        <span className="flex h-2 items-center">
          <Icon id={icon} className="icon-16" />
        </span>

        <span>{children}</span>
      </Link>
    </li>
  );
}

function Wave({ className }: { className?: string }) {
  return (
    <>
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("hidden md:block", className)}
      >
        <path
          d="m0 27.1955c103-17.44588 244.5-33.89436 371.5-24.42371 141.665 10.56421 329 38.87881 455 38.87881 145.5 0 249-.0036 349-.0036 122.92 0 183-7.4732 264.5-7.4732v55.8262h-1440z"
          className="fill-paleBlue"
        />
      </svg>

      <svg
        viewBox="0 0 320 53"
        fill="none"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("md:hidden", className)}
      >
        <path
          d="m0 9.02789c13-3.00984 27.5221-4.51477 45.5-4.51477h232.5c16.476 0 28.5-1.50492 42-4.01312v53h-320z"
          className="fill-paleBlue"
        />
      </svg>
    </>
  );
}
