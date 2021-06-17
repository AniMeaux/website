import {
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities/build/animal";
import { AdoptSearchParams } from "core/adoptSearchParams";
import { Link, LinkProps } from "core/link";
import { ChildrenProp } from "core/types";
import { CenteredContent } from "layout/centeredContent";
import { useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa";
import { useApplicationLayout } from "../applicationLayout";

export function Footer() {
  const { latestArticles, partners } = useApplicationLayout();

  return (
    <footer className="Footer">
      <CenteredContent>
        <div>
          <div className="FooterBlock FooterGrid">
            <FooterSection>
              <FooterSectionTitle>Adoption</FooterSectionTitle>

              <FooterLinkList>
                {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((animalSpecies) => (
                  <li key={animalSpecies}>
                    <FooterLink
                      href={new AdoptSearchParams({ animalSpecies }).toUrl()}
                    >
                      {AnimalSpeciesLabels[animalSpecies]}
                    </FooterLink>
                  </li>
                ))}

                <li>
                  <FooterLink href={new AdoptSearchParams().toUrl()}>
                    Tous les animeaux
                  </FooterLink>
                </li>

                <li>
                  <FooterLink href="/saved">Animaux sauvés</FooterLink>
                </li>

                {/* <li>
                  <FooterLink href="/">Conditions d'adoption</FooterLink>
                </li> */}
              </FooterLinkList>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>Agir</FooterSectionTitle>

              <FooterLinkList>
                <li>
                  <FooterLink href="/">Devenir famille d'accueil</FooterLink>
                </li>

                <li>
                  <FooterLink href="/">Devenir bénévole</FooterLink>
                </li>

                <li>
                  <FooterLink href="/">Faire un don</FooterLink>
                </li>
              </FooterLinkList>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>Partenaires</FooterSectionTitle>

              <FooterLinkList>
                {partners.map((partner) => (
                  <li key={partner.id}>
                    <FooterLink href={partner.url} shouldOpenInNewTab>
                      {partner.name}
                    </FooterLink>
                  </li>
                ))}
              </FooterLinkList>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>Blog</FooterSectionTitle>

              <FooterLinkList>
                {latestArticles.map((article) => (
                  <li key={article.id}>
                    <FooterLink href={`/blog/${article.slug}`}>
                      {article.title}
                    </FooterLink>
                  </li>
                ))}
              </FooterLinkList>
            </FooterSection>
          </div>

          <div className="FooterBlock FooterGrid">
            <FooterSection>
              <FooterSectionTitle>Contactez-nous</FooterSectionTitle>

              <FooterLinkList>
                <li>
                  <FooterLink href="tel:+330612194392">
                    <FaPhone />
                    <span>06 12 19 43 92</span>
                  </FooterLink>
                </li>

                <li>
                  <FooterLink href="mailto:contact@animeaux.org">
                    <FaEnvelope />
                    <span>contact@animeaux.org</span>
                  </FooterLink>
                </li>
              </FooterLinkList>

              <address className="FooterAddress">
                Association Ani'Meaux
                <br />
                SIRET: 839 627 171
                <br />
                30 Rue Pierre Brasseur
                <br />
                77100, MEAUX
              </address>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>Abonnez-vous</FooterSectionTitle>
              <NewsletterForm />
            </FooterSection>
          </div>

          <section className="FooterBlock FooterNoticeSection">
            <p>
              <span>Ani'Meaux © {new Date().getFullYear()}</span> •{" "}
              <FooterLink href="/legal">Mentions légales</FooterLink>
            </p>

            <ul className="FooterSocialLinks">
              <li>
                <Link
                  title="Aller sur la page Facebook"
                  href="https://www.facebook.com/animeaux.protectionanimale"
                  className="FooterSocialLink"
                >
                  <FaFacebook role="img" />
                </Link>
              </li>

              <li>
                <Link
                  title="Aller sur la page Instagram"
                  href="https://www.instagram.com/associationanimeaux"
                  className="FooterSocialLink"
                >
                  <FaInstagram role="img" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </CenteredContent>
    </footer>
  );
}

function FooterSection(props: ChildrenProp) {
  return <section {...props} className="FooterSection" />;
}

function FooterSectionTitle({ children }: ChildrenProp) {
  return <h3 className="FooterSectionTitle">{children}</h3>;
}

function FooterLinkList(props: ChildrenProp) {
  return <ul {...props} className="FooterLinkList" />;
}

function FooterLink(props: LinkProps) {
  return <Link {...props} className="FooterLink" />;
}

function NewsletterForm() {
  const [email, setEmail] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // TODO
    event.preventDefault();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="NewsletterForm"
      // Required to show the Submit keyboard action on iOS.
      action=""
    >
      <input
        aria-label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="jean@mail.fr"
        className="NewsletterInput"
      />

      <button type="submit" className="NewsletterSubmitButton">
        <FaPaperPlane />
      </button>
    </form>
  );
}
