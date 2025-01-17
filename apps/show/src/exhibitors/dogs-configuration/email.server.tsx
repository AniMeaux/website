import type { IsFirstProps } from "#core/data-display/email-html.server";
import { EmailHtml } from "#core/data-display/email-html.server";
import { Routes } from "#core/navigation";
import { services } from "#core/services/services.server";
import { GENDER_TRANSLATION } from "#exhibitors/dogs-configuration/gender";
import { joinReactNodes } from "@animeaux/core";
import type { EmailTemplate } from "@animeaux/resend";
import { Gender } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export async function createEmailTemplateRequest(
  token: string,
): Promise<EmailTemplate> {
  const { dogsConfiguration, application } = await promiseHash({
    dogsConfiguration: services.exhibitor.dogsConfiguration.getByToken(token, {
      select: {
        dogs: {
          select: {
            gender: true,
            id: true,
            idNumber: true,
            isCategorized: true,
            isSterilized: true,
          },
        },
      },
    }),

    application: services.exhibitor.application.getByToken(token, {
      select: { contactEmail: true },
    }),
  });

  function SectionDog({
    dog,
    _isFirst,
  }: IsFirstProps & {
    dog: (typeof dogsConfiguration.dogs)[number];
  }) {
    return (
      <>
        <EmailHtml.Output.Row _isFirst={_isFirst}>
          <EmailHtml.Output.Label>
            Numéro d’identification
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>{dog.idNumber}</EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Genre</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {GENDER_TRANSLATION[dog.gender]}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            {dog.gender === Gender.FEMALE
              ? "Elle est stérilisée"
              : "Il est castré"}
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {dog.isSterilized ? "Oui" : "Non"}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            {dog.gender === Gender.FEMALE
              ? "Elle est catégorisée"
              : "Il est catégorisé"}
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {dog.isCategorized ? "Oui" : "Non"}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>
      </>
    );
  }

  function SectionDogs() {
    return (
      <EmailHtml.Section.Root>
        <EmailHtml.Section.Title>Chiens sur stand</EmailHtml.Section.Title>

        {dogsConfiguration.dogs.length === 0 ? (
          <EmailHtml.Paragraph>
            Aucun chien présent sur le stand.
          </EmailHtml.Paragraph>
        ) : (
          <EmailHtml.Output.Table>
            {joinReactNodes(
              dogsConfiguration.dogs.map((dog) => (
                <SectionDog key={dog.id} dog={dog} />
              )),
              <EmailHtml.Output.RowSeparator />,
            )}
          </EmailHtml.Output.Table>
        )}
      </EmailHtml.Section.Root>
    );
  }

  return {
    name: "chiens-exposant-demandé",
    from: "Salon des Ani’Meaux <salon@animeaux.org>",
    to: [application.contactEmail],
    subject: "Présence de votre chien - Salon des Ani’Meaux 2025",
    body: (
      <EmailHtml.Root>
        <EmailHtml.Title>Présence de votre chien</EmailHtml.Title>

        <EmailHtml.Section.Root>
          <EmailHtml.Paragraph>
            Votre demande a bien été envoyée et est en attente de traitement.
          </EmailHtml.Paragraph>

          <EmailHtml.Paragraph>
            <EmailHtml.Button
              href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).stand.toString()}`}
            >
              Accédez à votre stand
            </EmailHtml.Button>
          </EmailHtml.Paragraph>

          <EmailHtml.Paragraph>
            Pour toute question ou complément d’information, n’hésitez pas à
            nous contacter en répondant à cet e-mail.
          </EmailHtml.Paragraph>
        </EmailHtml.Section.Root>

        <EmailHtml.SectionSeparator />

        <SectionDogs />

        <EmailHtml.SectionSeparator />

        <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
      </EmailHtml.Root>
    ),
  };
}
