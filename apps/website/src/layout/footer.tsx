import { AnimalSpecies } from "@animeaux/shared";
import { useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa";
import styled, { css } from "styled-components";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { ANIMAL_SPECIES_LABELS } from "~/core/labels";
import { Link } from "~/core/link";
import { useApplicationLayout } from "./applicationLayout";

export function Footer() {
  const { latestArticles, partners } = useApplicationLayout();

  return (
    <FooterElement>
      <FooterGrid>
        <FooterSection>
          <FooterSectionTitle>Adopter</FooterSectionTitle>

          <FooterLinkList>
            {Object.values(AnimalSpecies).map((animalSpecies) => (
              <li key={animalSpecies}>
                <FooterLink
                  href={new AdoptSearchParams({ animalSpecies }).toUrl()}
                >
                  {ANIMAL_SPECIES_LABELS[animalSpecies]}
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

            <li>
              <FooterLink href="/adoption-conditions">
                Conditions d'adoption
              </FooterLink>
            </li>
          </FooterLinkList>
        </FooterSection>

        <FooterSection>
          <FooterSectionTitle>Agir</FooterSectionTitle>

          <FooterLinkList>
            <li>
              <FooterLink href="/host-families">
                Devenir famille d'accueil
              </FooterLink>
            </li>

            <li>
              <FooterLink href="/volunteers">Devenir bénévole</FooterLink>
            </li>

            <li>
              <FooterLink href="/donation">Faire un don</FooterLink>
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

            <li>
              <FooterLink href="/partners">Et bien d'autres...</FooterLink>
            </li>
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

            <li>
              <FooterLink href="/blog">Tous les articles</FooterLink>
            </li>
          </FooterLinkList>
        </FooterSection>
      </FooterGrid>

      <FooterGrid>
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

          <Address>
            Association Ani'Meaux
            <br />
            SIRET : 83962717100037
            <br />
            RNA : W771014759
            <br />
            30 Rue Pierre Brasseur
            <br />
            77100 Meaux
          </Address>

          <p>
            <strong>
              Nous ne disposons pas de structure physique, il s'agit d'une
              adresse postale uniquement
            </strong>
          </p>
        </FooterSection>

        <FooterSection>
          <FooterSectionTitle>Abonnez-vous</FooterSectionTitle>
          <NewsletterForm />
        </FooterSection>
      </FooterGrid>

      <FooterNoticeSection>
        <p>
          <span>Ani'Meaux © {new Date().getFullYear()}</span> •{" "}
          <FooterLink href="/legal">Mentions légales</FooterLink>
        </p>

        <FooterSocialLinks>
          <li>
            <FooterSocialLink
              title="Aller sur la page Facebook"
              href="https://www.facebook.com/animeaux.protectionanimale"
            >
              <FaFacebook role="img" />
            </FooterSocialLink>
          </li>

          <li>
            <FooterSocialLink
              title="Aller sur la page Instagram"
              href="https://www.instagram.com/associationanimeaux"
            >
              <FaInstagram role="img" />
            </FooterSocialLink>
          </li>
        </FooterSocialLinks>
      </FooterNoticeSection>
    </FooterElement>
  );
}

const FooterElement = styled.footer`
  background: var(--bg-footer);
  padding-left: var(--content-margin);
  padding-right: var(--content-margin);
  padding-bottom: 0;
  padding-bottom: env(safe-area-inset-bottom, 0);
  font-size: var(--font-size-s);
  line-height: var(--line-height-s);
`;

const footerBlock = css`
  padding: var(--spacing-3xl) 0;

  &:not(:first-child) {
    border-top: 1px solid var(--border-color);
  }
`;

const FooterGrid = styled.div`
  ${footerBlock};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-template-rows: auto;
  gap: var(--spacing-3xl);
`;

const FooterSection = styled.section``;

const Address = styled.address`
  margin: var(--spacing-s) 0;
`;

const FooterSectionTitle = styled.h3`
  margin-bottom: var(--spacing-m);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
`;

const FooterLinkList = styled.ul`
  & > *:not(:first-child) {
    margin-top: var(--spacing-s);
  }
`;

const FooterLink = styled(Link)`
  display: inline-flex;
  align-items: center;

  &:hover,
  &:active {
    text-decoration: underline;
  }

  & > *:not(:first-child) {
    margin-left: var(--spacing-s);
  }
`;

const FooterNoticeSection = styled.section`
  ${footerBlock};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const FooterSocialLinks = styled.ul`
  margin-left: var(--spacing-3xl);
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: var(--spacing-l);
  }

  @media (min-width: 800px) {
    & > *:not(:first-child) {
      margin-left: var(--spacing-2xl);
    }
  }
`;

const FooterSocialLink = styled(Link)`
  font-size: calc(var(--line-height-s) * 1em);
  display: flex;

  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

function NewsletterForm() {
  const [email, setEmail] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // TODO
    event.preventDefault();
  }

  return (
    <Form
      onSubmit={onSubmit}
      // Required to show the Submit keyboard action on iOS.
      action=""
    >
      <NewsletterInput
        aria-label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="jean@mail.fr"
      />

      <NewsletterSubmitButton type="submit">
        <FaPaperPlane />
      </NewsletterSubmitButton>
    </Form>
  );
}

const Form = styled.form`
  background: var(--bg-primary);
  border-radius: var(--border-radius-full);
  padding: var(--spacing-xs);
  display: flex;
  align-items: stretch;

  & > *:not(:first-child) {
    margin-left: var(--spacing-s);
  }
`;

const NewsletterInput = styled.input`
  min-width: 0;
  flex: 1;
  border-radius: var(--border-radius-full);
  padding: var(--spacing-s) var(--spacing-l);

  &::placeholder {
    color: var(--text-label);
  }
`;

const NewsletterSubmitButton = styled.button`
  flex: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
    to right,
    var(--blue-light),
    var(--blue-medium)
  );
  color: var(--text-contrast);
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-semibold);
  transition-property: box-shadow;
  transition-duration: var(--duration-controller);
  transition-timing-function: var(--ease-in-out);

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-m);
    }
  }

  &:active {
    background: var(--blue-dark);
  }
`;
