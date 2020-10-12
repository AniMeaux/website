import {
  AnimalAge,
  AnimalAgesLabels,
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_AGES_ORDER,
  ANIMAL_SPECIES_ORDER_ALPHABETICAL,
} from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";
import {
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaFacebook,
  FaInstagram,
  FaPaperPlane,
  FaSearch,
} from "react-icons/fa";
import { Link, LinkProps } from "../core/link";
import Logo from "../ui/logo.svg";
import NameAndLogo from "../ui/nameAndLogo.svg";

type SelectProps<ValueType> = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> & {
  value: ValueType | null;
  onChange: (value: ValueType) => void;
  label: string;
};

function Select<ValueType = string>({
  value,
  onChange,
  label,
  children,
  className,
  ...rest
}: SelectProps<ValueType>) {
  return (
    <select
      {...rest}
      value={value == null ? "" : `${value}`}
      onChange={(e) => {
        onChange((e.target.value as any) as ValueType);
      }}
      className={cn(
        "appearance-none min-w-0 truncate px-4 bg-transparent cursor-pointer a11y-focus",
        {
          "text-gray-600 md:hover:text-default-color": value == null,
          "text-default-color": value != null,
        },
        className
      )}
    >
      <option disabled value="">
        {label}
      </option>

      {children}
    </select>
  );
}

function SearchForm({ className }: React.FormHTMLAttributes<HTMLFormElement>) {
  const [
    animalSpecies,
    setAnimalSpecies,
  ] = React.useState<AnimalSpecies | null>(null);
  const [animalAge, setAnimalAge] = React.useState<AnimalAge | null>(null);

  const queries: string[] = [];
  if (animalSpecies != null) {
    queries.push(`species=${animalSpecies.toLocaleLowerCase()}`);
  }
  if (animalAge != null) {
    queries.push(`age=${animalAge.toLocaleLowerCase()}`);
  }

  let link = "/search";
  if (queries.length > 0) {
    link = `${link}?${queries.join("&")}`;
  }

  return (
    <div
      className={cn("shadow p-2 rounded bg-white flex items-center", className)}
    >
      <Select
        label="Espèce"
        id="species"
        name="species"
        value={animalSpecies}
        onChange={(value) => setAnimalSpecies(value)}
        className="h-10 flex-1 min-w-0 focus:z-10"
      >
        {ANIMAL_SPECIES_ORDER_ALPHABETICAL.map((animalSpecies) => (
          <option key={animalSpecies} value={animalSpecies}>
            {AnimalSpeciesLabels[animalSpecies]}
          </option>
        ))}
      </Select>

      <hr className="h-10 flex-none border-l" />

      <Select
        label="Âge"
        id="age"
        name="age"
        value={animalAge}
        onChange={(value) => setAnimalAge(value)}
        className="h-10 flex-1 min-w-0 focus:z-10"
      >
        {ANIMAL_AGES_ORDER.map((animalAge) => (
          <option key={animalAge} value={animalAge}>
            {AnimalAgesLabels[animalAge]}
          </option>
        ))}
      </Select>

      <Link
        href={link}
        className="ml-2 w-10 h-10 flex-none rounded bg-blue-500 flex items-center justify-center font-semibold text-white md:hover:bg-blue-400 lg:w-auto lg:px-4"
      >
        <FaSearch />
        <span className="ml-2 hidden lg:inline">Chercher</span>
      </Link>
    </div>
  );
}

type NavItemMenuProps = {
  label: string;
  children: React.ReactNode;
};

function NavItemMenu({ label, children }: NavItemMenuProps) {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const rootElement = React.useRef<HTMLLIElement>(null!);
  const buttonElement = React.useRef<HTMLButtonElement>(null!);

  function onBlur(event: React.FocusEvent<HTMLLIElement>) {
    if (
      // We don't want this behaviour for medium and smaller screens.
      window.innerWidth >= 1024 &&
      (event.relatedTarget == null ||
        !rootElement.current.contains(event.relatedTarget as Node))
    ) {
      setIsMenuVisible(false);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Escape" && isMenuVisible) {
      setIsMenuVisible(false);
      buttonElement.current.focus();
    }
  }

  return (
    <li
      className="relative w-full lg:w-auto"
      onBlur={onBlur}
      ref={rootElement}
      onKeyDown={onKeyDown}
    >
      <button
        ref={buttonElement}
        onClick={() => {
          setIsMenuVisible((isMenuVisible) => !isMenuVisible);
          buttonElement.current.focus();
        }}
        className={cn(
          "h-10 flex items-center flex-none opacity-75 font-semibold uppercase a11y-focus w-full md:hover:opacity-100 lg:w-auto",
          { "md:opacity-100": isMenuVisible }
        )}
      >
        <span className="mr-auto lg:mr-1">{label}</span>{" "}
        {isMenuVisible ? <FaAngleUp /> : <FaAngleDown />}
      </button>

      <ul
        children={children}
        className={cn(
          "text-default-color font-semibold lg:absolute lg:top-1/1 lg:left-0 lg:mt-2 lg:py-2 lg:w-max-content lg:rounded lg:bg-white",
          { hidden: !isMenuVisible }
        )}
      />
    </li>
  );
}

function NavItemMenuItem(props: LinkProps) {
  return (
    <li>
      <Link
        {...props}
        className="h-10 flex items-center flex-none lg:px-4 md:hover:bg-blue-100"
      />
    </li>
  );
}

function NavItemLink(props: LinkProps) {
  return (
    <li className="w-full lg:w-auto">
      <Link
        {...props}
        className="w-full h-10 flex items-center flex-none opacity-75 font-semibold uppercase a11y-focus md:hover:opacity-100 lg:w-auto"
      />
    </li>
  );
}

function NavItemSocialLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  return (
    // The content is passed as children.
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      className="w-10 h-10 flex items-center justify-center opacity-75 a11y-focus md:hover:opacity-100"
    />
  );
}

function Header() {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const buttonElement = React.useRef<HTMLButtonElement>(null!);
  const navElement = React.useRef<HTMLElement>(null!);

  function onBlur(event: React.FocusEvent<HTMLElement>) {
    if (
      event.relatedTarget == null ||
      !navElement.current.contains(event.relatedTarget as Node)
    ) {
      setIsMenuVisible(false);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isMenuVisible) {
      setIsMenuVisible(false);
      buttonElement.current.focus();
    }
  }

  return (
    <header className="absolute z-10 w-full h-16 px-4 flex items-center text-white">
      <section className="min-w-0 h-full flex-1 flex items-center">
        <button
          title="Afficher le menu"
          onClick={() => {
            setIsMenuVisible((isMenuVisible) => !isMenuVisible);
            buttonElement.current.focus();
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          ref={buttonElement}
          className="w-10 h-10 flex items-center justify-center flex-none text-xl font-semibold uppercase opacity-75 a11y-focus md:hover:opacity-100 lg:hidden"
        >
          <FaBars />
        </button>

        {/* Menu overlay */}
        <div
          aria-hidden
          onClick={() => setIsMenuVisible(false)}
          className={cn(
            "lg:hidden fixed top-0 left-0 w-full h-screen bg-black bg-opacity-25",
            { hidden: !isMenuVisible }
          )}
        />

        <nav
          ref={navElement}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className={cn(
            "fixed top-0 left-0 w-10/12 h-screen max-w-sm overflow-auto text-sm bg-white text-default-color lg:block lg:static lg:w-auto lg:h-auto lg:max-w-none lg:overflow-visible lg:bg-transparent lg:text-white",
            { hidden: !isMenuVisible }
          )}
        >
          <div className="lg:hidden h-16 flex items-center justify-center">
            <Logo className="text-4xl" />
          </div>

          <ul className="mt-4 px-8 flex flex-col items-start space-y-4 lg:mt-0 lg:px-0 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <NavItemMenu label="Animaux">
              <NavItemMenuItem href="/search?animalStatus=open_to_adoption">
                À l'adoption
              </NavItemMenuItem>

              <NavItemMenuItem href="/search?animalStatus=adopted">
                Adoptés
              </NavItemMenuItem>

              <NavItemMenuItem href="/search">
                Recherche avancée
              </NavItemMenuItem>
            </NavItemMenu>

            <NavItemMenu label="Agir">
              <NavItemMenuItem href="/host-family">
                Devenir famille d'accueil
              </NavItemMenuItem>

              <NavItemMenuItem href="/volunteer">
                Devenir bénévole
              </NavItemMenuItem>

              <NavItemMenuItem href="/donate">Faire un don</NavItemMenuItem>
            </NavItemMenu>

            <NavItemLink href="/partners">Partenaires</NavItemLink>
            <NavItemLink href="/blog">Blog</NavItemLink>
          </ul>
        </nav>
      </section>

      <section className="h-full flex-none flex items-center">
        <Link
          title="Retour à la page d'accueil"
          href="/"
          className="h-10 flex items-center text-4xl"
        >
          <NameAndLogo role="img" className="hidden md:block" />
          <Logo role="img" className="md:hidden" />
        </Link>
      </section>

      <section className="min-w-0 h-full flex-1 flex items-center justify-end text-xl">
        <NavItemSocialLink
          title="Aller sur la page Facebook"
          href="https://www.facebook.com/animeaux.protectionanimale"
        >
          <FaFacebook role="img" />
        </NavItemSocialLink>

        <NavItemSocialLink
          title="Aller sur la page Instagram"
          href="https://www.instagram.com/associationanimeaux"
        >
          <FaInstagram role="img" />
        </NavItemSocialLink>
      </section>
    </header>
  );
}

function NewletterForm() {
  const [email, setEmail] = React.useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={onSubmit} className="rounded bg-white p-2 flex">
      <input
        aria-label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="jean@mail.fr"
        className="h-10 flex-1 bg-transparent px-4 placeholder-gray-600 a11y-focus"
      />

      <button
        type="submit"
        className="ml-2 w-10 h-10 flex-none rounded bg-blue-500 flex items-center justify-center font-semibold text-white a11y-focus md:hover:bg-blue-400"
      >
        <FaPaperPlane />
      </button>
    </form>
  );
}

type FooterItemProps = {
  title: string;
  children: React.ReactNode;
};

function FooterItem({ title, children }: FooterItemProps) {
  return (
    <li className="flex-1">
      <p className="mb-2 font-semibold">{title}</p>
      {children}
    </li>
  );
}

function FooterItemSocialLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  return (
    // The content is passed as children.
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      className="w-10 h-10 flex items-center justify-center a11y-focus md:hover:text-blue-500"
    />
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="mx-auto w-10/12 py-16 flex flex-col items-center">
        <h2 className="font-serif text-4xl">Restez informés</h2>

        <ul className="mt-8 w-full flex flex-col text-center space-y-12 md:flex-row md:space-y-0 md:space-x-6">
          <FooterItem title="Abonnez-vous">
            <NewletterForm />
          </FooterItem>

          <FooterItem title="Suivez-nous">
            <ul className="flex items-center justify-center">
              <li>
                <FooterItemSocialLink
                  title="Aller sur la page Facebook"
                  href="https://www.facebook.com/animeaux.protectionanimale"
                >
                  <FaFacebook role="img" />
                </FooterItemSocialLink>
              </li>
              <li>
                <FooterItemSocialLink
                  title="Aller sur la page Instagram"
                  href="https://www.instagram.com/associationanimeaux"
                >
                  <FaInstagram role="img" />
                </FooterItemSocialLink>
              </li>
            </ul>
          </FooterItem>

          <FooterItem title="Contactez-nous">
            <address>
              Association Ani'Meaux
              <br />
              SIRET: 839 627 171
              <br />
              6, Rue Notre Dame
              <br />
              77100, MEAUX
            </address>
          </FooterItem>
        </ul>
      </div>

      <div className="mx-auto w-10/12 py-12 flex items-center justify-center text-sm text-gray-500">
        Ani'Meaux © {new Date().getFullYear()}
      </div>
    </footer>
  );
}

type HeroSectionProps = {
  imageUrlLarge: string;
  imageUrlSmall: string;
  imageAlt: string;
  title: string;
  message: string;
  action: React.ReactNode;
};

function HeroSection({
  imageUrlLarge,
  imageUrlSmall,
  imageAlt,
  action,
  message,
  title,
}: HeroSectionProps) {
  return (
    <section className="relative md:h-screen">
      <picture>
        <source srcSet={imageUrlLarge} media="(min-width: 800px)" />
        <img
          src={imageUrlSmall}
          alt={imageAlt}
          className="w-full h-screen-8/12 object-cover md:h-full"
        />
      </picture>

      <div
        className={
          "relative mx-auto w-10/12 flex flex-col items-start text-left md:absolute md:hero-text-position md:mx-0 md:w-auto"
        }
      >
        <div className="text-lg md:text-2xl md:text-white">
          <h1 className="mt-12 mb-4 leading-none font-serif text-5xl md:mt-0 md:mb-8 md:text-7xl">
            {title}
          </h1>

          <p className="mb-8 w-full">{message}</p>
        </div>

        {action}
      </div>
    </section>
  );
}

type Color = "none" | "blue" | "green" | "yellow" | "red" | "cyan";

const BackgroundColorClasses: { [key in Color]: string } = {
  none: "",
  blue: "bg-blue-100",
  cyan: "bg-cyan-100",
  green: "bg-green-100",
  red: "bg-red-100",
  yellow: "bg-yellow-100",
};

const CtaColorClasses: { [key in Color]: string } = {
  none: "bg-blue-500 text-blueText-500 md:hover:bg-blue-400",
  blue: "bg-blue-500 text-blueText-500 md:hover:bg-blue-400",
  cyan: "bg-cyan-500 text-cyanText-500 md:hover:bg-cyan-400",
  green: "bg-green-500 text-greenText-500 md:hover:bg-green-400",
  red: "bg-red-500 text-redText-500 md:hover:bg-red-400",
  yellow: "bg-yellow-500 text-yellowText-500 md:hover:bg-yellow-400",
};

type SectionProps = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  message: string;
  action: LinkProps;
  isReversed?: boolean;
  backgroundColor?: Color;
};

function Section({
  action,
  imageAlt,
  imageUrl,
  message,
  title,
  backgroundColor = "none",
  isReversed = false,
}: SectionProps) {
  return (
    <section className={BackgroundColorClasses[backgroundColor]}>
      <div
        className={cn(
          "mx-auto w-10/12 py-16 flex flex-col items-center md:py-32 md:flex-row",
          {
            "md:flex-row-reverse": isReversed,
            "md:flex-row": !isReversed,
          }
        )}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-56 flex-none rounded-lg object-cover md:w-1/3 md:h-80"
        />

        <div
          className={cn("mt-4 flex-1 flex flex-col md:mt-0", {
            "md:items-end md:text-right md:mr-16": isReversed,
            "md:items-start md:ml-16": !isReversed,
          })}
        >
          <h2 className="w-full leading-none font-serif text-4xl md:text-6xl">
            {title}
          </h2>

          <p className="mt-4 w-full md:text-xl">{message}</p>

          <Link
            {...action}
            className={cn(
              "mt-8 shadow w-full h-10 rounded px-8 flex items-center justify-center font-semibold text-white a11y-focus md:w-auto",
              CtaColorClasses[backgroundColor]
            )}
          />
        </div>
      </div>
    </section>
  );
}

function AdoptSection() {
  return (
    <HeroSection
      title="Adoptez-moi, bordel"
      message="Trouvez le compagnon de vos rêves et donnez-lui une seconde chance."
      imageAlt="Adoptez"
      imageUrlLarge="/landing-image.jpg"
      imageUrlSmall="/landing-image-small.jpg"
      action={
        <SearchForm className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mb-6 w-full max-w-lg text-md md:static md:translate-x-0 md:translate-y-0 md:mb-0 md:text-xl" />
      }
    />
  );
}

type StatisticItemProps = {
  title: string;
  value: string;
};

function StatisticItem({ title, value }: StatisticItemProps) {
  return (
    <section className="h-32 flex-none flex flex-col items-center justify-center text-center md:h-40 md:flex-1">
      <h3 className="text-4xl font-semibold md:text-5xl">{value}</h3>
      <p className="flex items-center text-base">{title}</p>
    </section>
  );
}

function StatisticSeparator() {
  return (
    <hr className="w-full flex-none self-center border-white border-t-8 md:w-auto md:h-40 md:border-l-8 md:border-t-0" />
  );
}

function StatisticsSection() {
  return (
    <section className="mx-auto my-8 w-10/12 bg-gray-100 rounded-lg flex flex-col items-stretch md:my-20 md:flex-row">
      <StatisticItem value="2 ans" title="D'existences" />
      <StatisticSeparator />
      <StatisticItem value="3 450" title="Prises en charge" />
      <StatisticSeparator />
      <StatisticItem value="46" title="Bénévoles" />
    </section>
  );
}

function CatSterilization() {
  return (
    <Section
      title="Stérilisation des chats errants"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      imageAlt="Stérilisation des chats errants"
      imageUrl="/stray-cat-small.jpg"
      action={{
        href: "/stray-cats",
        children: "En savoir plus",
      }}
    />
  );
}

function HostFamilly() {
  return (
    <Section
      isReversed
      backgroundColor="green"
      title="Devenez famille d'accueil"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      imageAlt="Famille d'accueil"
      imageUrl="/host-familly-small.jpg"
      action={{
        href: "/host-familly",
        children: "En savoir plus",
      }}
    />
  );
}

function Volonteer() {
  return (
    <Section
      title="Devenez bénévole"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      imageAlt="Bénévoles"
      imageUrl="/volonteer-small.jpg"
      action={{
        href: "/volonteer",
        children: "En savoir plus",
      }}
    />
  );
}

function Donation() {
  return (
    <Section
      isReversed
      backgroundColor="yellow"
      title="Faîtes un don !"
      message="Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter? Vous pouvez nous faire un don ! Ce don servira à financer les soins vétérinaires, effectuer plus de sauvetages et acheter du matériel pour les animaux."
      imageAlt="Faire un don"
      imageUrl="/donation-small.jpg"
      action={{
        href: "/donation",
        children: "En savoir plus",
      }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <AdoptSection />
        <StatisticsSection />
        <CatSterilization />
        <HostFamilly />
        <Volonteer />
        <Donation />
      </main>

      <Footer />
    </>
  );
}
