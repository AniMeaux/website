import {
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import { Link } from "@animeaux/ui-library/build/core/link";
import { ChildrenProp } from "@animeaux/ui-library/build/core/types";
import * as React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa";
import { CenteredContent } from "../../ui/centeredContent";

export function Footer() {
  return (
    <footer className="Footer">
      <CenteredContent>
        <div>
          <div className="FooterBlock FooterGrid">
            <FooterSection>
              <FooterSectionTitle>Adoption</FooterSectionTitle>

              <FooterLinkList>
                {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => (
                  <li key={species}>
                    <FooterLink>{AnimalSpeciesLabels[species]}</FooterLink>
                  </li>
                ))}

                <li>
                  <FooterLink>Tous les animeaux</FooterLink>
                </li>

                <li>
                  <FooterLink>Adoptés</FooterLink>
                </li>
              </FooterLinkList>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>Agir</FooterSectionTitle>

              <FooterLinkList>
                <li>
                  <FooterLink>Devenir famille d'accueil</FooterLink>
                </li>

                <li>
                  <FooterLink>Devenir bénévole</FooterLink>
                </li>

                <li>
                  <FooterLink>Faire un don</FooterLink>
                </li>
              </FooterLinkList>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>Partenaires</FooterSectionTitle>

              <FooterLinkList>
                <li>
                  <FooterLink>Lorem ipsum dolor</FooterLink>
                </li>

                <li>
                  <FooterLink>Ait amet consectetur adipisicing elit</FooterLink>
                </li>

                <li>
                  <FooterLink>
                    Rerum distinctio illum itaque quod reprehenderit!
                  </FooterLink>
                </li>

                <li>
                  <FooterLink>Incidunt, a suscipit maiores</FooterLink>
                </li>

                <li>
                  <FooterLink>Ullam distinctio dolore</FooterLink>
                </li>

                <li>
                  <FooterLink>
                    Mollitia dolor obcaecati eos exercitationem, ducimus ratione
                  </FooterLink>
                </li>

                <li>
                  <FooterLink>Delectus, quia</FooterLink>
                </li>
              </FooterLinkList>
            </FooterSection>

            <FooterSection>
              <FooterSectionTitle>Blog</FooterSectionTitle>

              <FooterLinkList>
                <li>
                  <FooterLink>Lorem ipsum dolor</FooterLink>
                </li>

                <li>
                  <FooterLink>Ait amet consectetur adipisicing elit</FooterLink>
                </li>

                <li>
                  <FooterLink>
                    Rerum distinctio illum itaque quod reprehenderit!
                  </FooterLink>
                </li>

                <li>
                  <FooterLink>Incidunt, a suscipit maiores</FooterLink>
                </li>

                <li>
                  <FooterLink>Ullam distinctio dolore</FooterLink>
                </li>

                <li>
                  <FooterLink>
                    Mollitia dolor obcaecati eos exercitationem, ducimus ratione
                  </FooterLink>
                </li>

                <li>
                  <FooterLink>Delectus, quia</FooterLink>
                </li>
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
              <FooterLink>Mentions légales</FooterLink>
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

function FooterLink({ children }: ChildrenProp) {
  return (
    <Link href="/" className="FooterLink">
      {children}
    </Link>
  );
}

function NewsletterForm() {
  const [email, setEmail] = React.useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // TODO
    event.preventDefault();
  }

  return (
    <form onSubmit={onSubmit} className="NewsletterForm">
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
