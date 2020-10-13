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
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPaperPlane,
  FaPhone,
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
        "appearance-none focus:z-10 h-12 flex-1 min-w-0 truncate px-4 bg-transparent cursor-pointer a11y-focus",
        {
          "text-gray-600 md:hover:text-default-color": value == null,
          "text-default-color": value != null,
        }
      )}
    >
      <option disabled value="">
        {label}
      </option>

      {children}
    </select>
  );
}

function SearchForm() {
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
      className={cn(
        "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "md:static md:translate-x-0 md:translate-y-0",
        "mb-6 shadow w-full max-w-lg rounded-lg bg-white p-2 flex text-md",
        "md:mb-0 md:text-lg"
      )}
    >
      <Select
        label="Espèce"
        id="species"
        name="species"
        value={animalSpecies}
        onChange={(value) => setAnimalSpecies(value)}
      >
        {ANIMAL_SPECIES_ORDER_ALPHABETICAL.map((animalSpecies) => (
          <option key={animalSpecies} value={animalSpecies}>
            {AnimalSpeciesLabels[animalSpecies]}
          </option>
        ))}
      </Select>

      <hr className="h-12 flex-none border-l" />

      <Select
        label="Âge"
        id="age"
        name="age"
        value={animalAge}
        onChange={(value) => setAnimalAge(value)}
      >
        {ANIMAL_AGES_ORDER.map((animalAge) => (
          <option key={animalAge} value={animalAge}>
            {AnimalAgesLabels[animalAge]}
          </option>
        ))}
      </Select>

      <Link
        href={link}
        className={cn(
          "ml-2 w-12 h-12 flex-none rounded-lg bg-action-green flex items-center justify-center font-semibold text-white text-base a11y-focus",
          "md:hover:bg-action-greenLight lg:w-auto lg:px-8"
        )}
      >
        <FaSearch className="lg:hidden" />
        <span className="hidden lg:inline">J'adopte !</span>
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
    // if (
    //   // We don't want this behaviour for medium and smaller screens.
    //   window.innerWidth >= 1024 &&
    //   (event.relatedTarget == null ||
    //     !rootElement.current.contains(event.relatedTarget as Node))
    // ) {
    //   setIsMenuVisible(false);
    // }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Escape" && isMenuVisible) {
      setIsMenuVisible(false);
      buttonElement.current.focus();
    }
  }

  return (
    <li
      className="w-full lg:w-auto"
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
          "h-10 flex items-center flex-none font-semibold uppercase a11y-focus w-full",
          "md:hover:opacity-75",
          "lg:w-auto",
          { "md:opacity-75": isMenuVisible }
        )}
      >
        <span className="mr-auto lg:mr-1">{label}</span>{" "}
        {isMenuVisible ? <FaAngleUp /> : <FaAngleDown />}
      </button>

      <ul
        children={children}
        className={cn(
          "flex flex-col text-default-color font-semibold",
          "lg:absolute lg:top-1/1 lg:left-0 lg:w-full lg:p-4 lg:bg-white lg:flex-row lg:items-center",
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
        className="w-full h-10 flex items-center flex-none font-semibold uppercase a11y-focus md:hover:opacity-75 lg:w-auto"
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
      className="w-10 h-10 flex items-center justify-center a11y-focus md:hover:opacity-75"
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
          className="w-10 h-10 flex items-center justify-center flex-none text-xl font-semibold uppercase a11y-focus md:hover:opacity-75 lg:hidden"
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
          tabIndex={-1}
          className={cn(
            "fixed top-0 left-0 w-10/12 h-screen max-w-sm overflow-auto text-sm bg-white text-default-color focus:outline-none",
            "lg:block lg:static lg:w-auto lg:h-auto lg:max-w-none lg:overflow-visible lg:bg-transparent lg:text-white",
            { hidden: !isMenuVisible }
          )}
        >
          <div className="lg:hidden h-16 flex items-center justify-center">
            <Logo className="text-4xl" />
          </div>

          <ul
            className={cn(
              "mt-4 px-8 flex flex-col items-start space-y-4",
              "lg:mt-0 lg:px-0 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4"
            )}
          >
            <NavItemMenu label="Adoption">
              <li className={cn("flex-2")}>
                <ul className="flex items-center flex-wrap">
                  {ANIMAL_SPECIES_ORDER_ALPHABETICAL.map((animalSpecies) => (
                    <li key={animalSpecies} className="flex-none">
                      <Link
                        href={`/search?animalSpecies=${animalSpecies.toLowerCase()}`}
                        className={cn(
                          "rounded-lg py-4 px-8 flex flex-col items-center a11y-focus",
                          "md:hover:bg-white md:hover:shadow"
                        )}
                      >
                        <img
                          alt={AnimalSpeciesLabels[animalSpecies]}
                          src={`/animalSpecies/${animalSpecies.toLowerCase()}.jpg`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />

                        <span className="mt-2 font-semibold">
                          {AnimalSpeciesLabels[animalSpecies]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="flex-1 flex flex-col items-start">
                <Link
                  href="/search"
                  className="rounded-lg py-4 px-8 md:hover:bg-white md:hover:shadow"
                >
                  Tous les animaux
                </Link>
                <Link
                  href="/search?animalStatus=adopted"
                  className="rounded-lg py-4 px-8 md:hover:bg-white md:hover:shadow"
                >
                  Adoptés
                </Link>
              </li>
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

function NewsletterForm() {
  const [email, setEmail] = React.useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="shadow w-full rounded-lg bg-white p-2 flex text-md"
    >
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
        className="ml-2 w-10 h-10 flex-none rounded-lg bg-action-green flex items-center justify-center font-semibold text-white text-base a11y-focus md:hover:bg-action-greenLight"
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
    <li className="flex-1 flex flex-col items-center">
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
      className="w-10 h-10 flex items-center justify-center text-xl a11y-focus md:hover:text-action-green"
    />
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="mx-auto w-10/12 py-16 flex flex-col items-center">
        <h2 className="font-serif text-4xl md:text-5xl">Restez informés</h2>

        <ul className="mt-8 w-full flex flex-col text-center space-y-12 md:flex-row md:space-y-0 md:space-x-6">
          <FooterItem title="Abonnez-vous">
            <NewsletterForm />
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
              30 Rue Pierre Brasseur
              <br />
              77100, MEAUX
            </address>

            <a
              href="tel:+330612194392"
              className="mt-4 flex items-center md:hover:text-action-green"
            >
              <FaPhone className="mr-2" />
              <span>06 12 19 43 92</span>
            </a>

            <a
              href="mailto:contact@animeaux.org"
              className="mt-2 flex items-center md:hover:text-action-green"
            >
              <FaEnvelope className="mr-2" />
              <span>contact@animeaux.org</span>
            </a>
          </FooterItem>
        </ul>
      </div>

      <div className="mx-auto w-10/12 py-12 flex items-center justify-center text-sm text-gray-500">
        Ani'Meaux © {new Date().getFullYear()}
      </div>
    </footer>
  );
}

function HeroSection() {
  return (
    <section className="relative md:h-screen">
      <picture>
        <source srcSet="/landing-image.jpg" media="(min-width: 800px)" />
        <img
          src="/landing-image-small.jpg"
          alt="Adoptez"
          className="w-full h-screen-8/12 object-cover md:h-full"
        />
      </picture>

      <div className="absolute top-0 left-0 w-full h-screen-4/12 hero-backshadow md:h-screen-1/2" />

      <div
        className={
          "relative mx-auto w-10/12 flex flex-col items-start text-left md:absolute md:hero-text-position md:mx-0 md:w-auto"
        }
      >
        <div className="text-lg md:text-2xl md:text-white">
          <h1 className="mt-12 mb-4 leading-tight font-serif text-5xl md:mt-0 md:mb-4 md:text-7xl">
            Adoptez-moi, bordel
          </h1>

          <p className="mb-8 w-full">
            Trouvez le compagnon de vos rêves et donnez-lui une seconde chance.
          </p>
        </div>

        <SearchForm />
      </div>
    </section>
  );
}

type StatisticItemProps = {
  title: string;
  value: string;
};

function StatisticItem({ title, value }: StatisticItemProps) {
  return (
    <section
      className={cn(
        "h-32 flex-none flex flex-col items-center justify-center text-center",
        "md:h-40 md:flex-1"
      )}
    >
      <h2 className={cn("text-4xl font-serif font-semibold", "md:text-5xl")}>
        {value}
      </h2>

      <p className="flex items-center text-base">{title}</p>
    </section>
  );
}

function StatisticSeparator() {
  return (
    <hr
      className={cn(
        "w-full flex-none border-t",
        "md:w-auto md:h-40 md:border-t-0 md:border-l"
      )}
    />
  );
}

function StatisticsSection() {
  return (
    <section
      className={cn(
        "mx-auto my-8 w-10/12 flex flex-col items-stretch",
        "md:mt-16 md:mb-0 md:flex-row"
      )}
    >
      <StatisticItem value="2 ans" title="D'existences" />
      <StatisticSeparator />
      <StatisticItem value="3 450" title="Prises en charge" />
      <StatisticSeparator />
      <StatisticItem value="46" title="Bénévoles" />
    </section>
  );
}

type NewsSectionProps = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  message: string;
  action: LinkProps;
};

function NewsSection({
  action,
  imageAlt,
  imageUrl,
  message,
  title,
}: NewsSectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-10/12 py-16 flex flex-col items-start",
        "md:py-16 md:flex-row"
      )}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-56 flex-none rounded-lg object-cover md:w-1/3 md:h-80"
      />

      <div
        className={cn(
          "mt-4 flex-1 flex flex-col items-start",
          "md:mt-0 md:ml-16"
        )}
      >
        <h2 className="leading-tight font-serif text-3xl md:text-5xl">
          {title}
        </h2>

        <p className="mt-4 md:text-xl">{message}</p>

        <Link
          {...action}
          className={cn(
            "mt-8 shadow w-full h-12 rounded-lg bg-action-green px-8 flex items-center justify-center font-semibold text-white a11y-focus md:w-auto md:hover:bg-action-greenLight"
          )}
        />
      </div>
    </section>
  );
}

function CatSterilization() {
  return (
    <NewsSection
      title="Stérilisation des chats errants"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus obcaecati aut eveniet, quas voluptate ipsa, itaque dolorum nulla placeat deserunt tempora laboriosam ipsum voluptatibus odit, id sequi est ut consequatur."
      imageAlt="Stérilisation des chats errants"
      imageUrl="/stray-cat-small.jpg"
      action={{
        href: "/stray-cats",
        children: "En savoir plus",
      }}
    />
  );
}

function NextEvent() {
  return (
    <NewsSection
      title="Photo shooting"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus obcaecati aut eveniet, quas voluptate ipsa, itaque dolorum nulla placeat deserunt tempora laboriosam ipsum voluptatibus odit, id sequi est ut consequatur."
      imageAlt="Camera"
      imageUrl="/photo-shooting-small.jpg"
      action={{
        href: "https://www.facebook.com/animeaux.protectionanimale",
        children: "Participer",
      }}
    />
  );
}

function Donation() {
  return (
    <section className="bg-action-green text-white">
      <div
        className={cn(
          "mx-auto w-10/12 py-16 flex flex-col items-center text-center"
        )}
      >
        <h2 className="leading-tight font-serif text-4xl md:text-6xl">
          Faîtes un don&nbsp;!
        </h2>

        <p className="mt-4 w-full md:text-xl">
          Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter?
          Vous pouvez nous faire un don ! Ce don servira à financer les soins
          vétérinaires, effectuer plus de sauvetages et acheter du matériel pour
          les animaux.
        </p>

        <ul className={cn("mt-8 flex items-center space-x-4", "md:space-x-8")}>
          {[1, 5, 10].map((amount) => (
            <li key={`${amount}`}>
              <Link
                href={`/donation?amount=${amount}`}
                className={cn(
                  "shadow h-12 rounded-lg bg-white px-4 flex items-center justify-center font-semibold text-default-color a11y-focus",
                  "md:hover:bg-gray-100 md:px-8"
                )}
              >
                {amount} €
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/donation"
              className={cn(
                "shadow h-12 rounded-lg bg-white px-4 flex items-center justify-center font-semibold text-default-color a11y-focus",
                "md:hover:bg-gray-100 md:px-8"
              )}
            >
              Autre
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

type ActItemProps = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  message: string;
  action: LinkProps;
};

function ActItem({ action, imageAlt, imageUrl, message, title }: ActItemProps) {
  return (
    <Link {...action} className="flex flex-col">
      <img
        alt={imageAlt}
        src={imageUrl}
        className="w-full h-56 rounded-lg object-cover"
      />

      <h3 className="mt-4 leading-tight font-serif text-3xl md:mt-6 md:text-4xl">
        {title}
      </h3>

      <p className="mt-4 md:text-lg">{message}</p>
    </Link>
  );
}

function HostFamilly() {
  return (
    <ActItem
      title="Devenez famille d'accueil"
      action={{ href: "/host-familly" }}
      imageAlt="Famille d'accueil"
      imageUrl="/host-familly-small.jpg"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
  obcaecati aut eveniet, quas voluptate ipsa, itaque dolorum nulla placeat
  deserunt tempora laboriosam ipsum voluptatibus odit, id sequi est ut
  consequatur."
    />
  );
}

function Volonteer() {
  return (
    <ActItem
      title="Devenez bénévole"
      action={{ href: "/volonteer" }}
      imageAlt="Bénévoles"
      imageUrl="/volonteer-small.jpg"
      message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus obcaecati aut eveniet, quas voluptate ipsa, itaque dolorum nulla placeat deserunt tempora laboriosam ipsum voluptatibus odit, id sequi est ut consequatur."
    />
  );
}

function ActSection() {
  return (
    <section className={cn("mx-auto w-10/12 py-16")}>
      <h2 className="leading-tight font-serif text-4xl text-center md:text-6xl">
        J'agis
      </h2>

      <ul
        className={cn(
          "mt-8 flex flex-col space-y-16",
          "md:mt-16 md:flex-row md:space-y-0 md:space-x-16"
        )}
      >
        <li className={cn("flex-1")}>
          <HostFamilly />
        </li>

        <li className={cn("flex-1")}>
          <Volonteer />
        </li>
      </ul>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <StatisticsSection />
        <NextEvent />
        <CatSterilization />
        <Donation />
        <ActSection />
      </main>

      <Footer />
    </>
  );
}
