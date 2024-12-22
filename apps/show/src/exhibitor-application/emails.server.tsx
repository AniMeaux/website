import { EmailHtml } from "#core/data-display/email-html.server";
import type { MarkdownComponents } from "#core/data-display/markdown";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { db } from "#core/db.server";
import { Routes } from "#core/navigation";
import type { EmailTemplate } from "@animeaux/resend";
import { ShowExhibitorApplicationStatus } from "@prisma/client";
import invariant from "tiny-invariant";

export async function createEmailTemplateStatusUpdate(
  applicationId: string,
): Promise<null | EmailTemplate> {
  const application = await db.exhibitorApplication.get(applicationId, {
    select: {
      contactEmail: true,
      status: true,
      refusalMessage: true,
      exhibitor: {
        select: { token: true },
      },
    },
  });

  if (application == null) {
    return null;
  }

  if (application.status === ShowExhibitorApplicationStatus.UNTREATED) {
    return null;
  }

  switch (application.status) {
    case ShowExhibitorApplicationStatus.REFUSED: {
      invariant(
        application.refusalMessage != null,
        "A refusalMessage should exists",
      );

      return {
        name: "candidature-exposant-refusee",
        from: "Salon des Ani’Meaux <salon@animeaux.org>",
        to: [application.contactEmail],
        subject: "Candidature refusée - Salon des Ani’Meaux 2024",
        body: (
          <EmailHtml.Root>
            <EmailHtml.Title>Candidature refusée</EmailHtml.Title>

            <EmailHtml.Paragraph>
              <Markdown
                content={application.refusalMessage}
                components={EMAIL_SENTENCE_COMPONENTS}
              />
              <br />
              <br />
              Pour tout complément d’informations, vous pouvez nous contacter
              via{" "}
              <EmailHtml.Link href={process.env.FACEBOOK_URL}>
                Facebook
              </EmailHtml.Link>
              ,{" "}
              <EmailHtml.Link href={process.env.INSTAGRAM_URL}>
                Instagram
              </EmailHtml.Link>{" "}
              ou par{" "}
              <EmailHtml.Link href="mailto:salon@animeaux.org">
                email
              </EmailHtml.Link>
              .
            </EmailHtml.Paragraph>

            <EmailHtml.Separator />

            <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
          </EmailHtml.Root>
        ),
      };
    }

    case ShowExhibitorApplicationStatus.VALIDATED: {
      invariant(application.exhibitor != null, "An exhibitor should exists");

      return {
        name: "candidature-exposant-validee",
        from: "Salon des Ani’Meaux <salon@animeaux.org>",
        to: [application.contactEmail],
        subject: "Candidature validée - Salon des Ani’Meaux 2024",
        body: (
          <EmailHtml.Root>
            <EmailHtml.Title>Candidature validée</EmailHtml.Title>

            <EmailHtml.Paragraph>
              Cheesecake gummies jelly-o halvah cupcake sweet icing bear claw
              pastry. Brownie cotton candy jelly carrot cake bonbon. Tart gummi
              bears apple pie chocolate bar bonbon sweet roll sweet chocolate
              bar icing. Gingerbread icing tiramisu donut sesame snaps
              marshmallow.
              <br />
              <br />
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(application.exhibitor.token)}`}
              >
                Accedez à votre espace exposant
              </EmailHtml.Button>
              <br />
              <br />
              Pour tout complément d’informations, vous pouvez nous contacter
              via{" "}
              <EmailHtml.Link href={process.env.FACEBOOK_URL}>
                Facebook
              </EmailHtml.Link>
              ,{" "}
              <EmailHtml.Link href={process.env.INSTAGRAM_URL}>
                Instagram
              </EmailHtml.Link>{" "}
              ou par{" "}
              <EmailHtml.Link href="mailto:salon@animeaux.org">
                email
              </EmailHtml.Link>
              .
            </EmailHtml.Paragraph>

            <EmailHtml.Separator />

            <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
          </EmailHtml.Root>
        ),
      };
    }

    case ShowExhibitorApplicationStatus.WAITING_LIST: {
      return {
        name: "candidature-exposant-liste-d-attente",
        from: "Salon des Ani’Meaux <salon@animeaux.org>",
        to: [application.contactEmail],
        subject: "Candidature sur liste d’attente - Salon des Ani’Meaux 2024",
        body: (
          <EmailHtml.Root>
            <EmailHtml.Title>Candidature sur liste d’attente</EmailHtml.Title>

            <EmailHtml.Paragraph>
              Cheesecake gummies jelly-o halvah cupcake sweet icing bear claw
              pastry. Brownie cotton candy jelly carrot cake bonbon. Tart gummi
              bears apple pie chocolate bar bonbon sweet roll sweet chocolate
              bar icing. Gingerbread icing tiramisu donut sesame snaps
              marshmallow.
              <br />
              <br />
              Pour tout complément d’informations, vous pouvez nous contacter
              via{" "}
              <EmailHtml.Link href={process.env.FACEBOOK_URL}>
                Facebook
              </EmailHtml.Link>
              ,{" "}
              <EmailHtml.Link href={process.env.INSTAGRAM_URL}>
                Instagram
              </EmailHtml.Link>{" "}
              ou par{" "}
              <EmailHtml.Link href="mailto:salon@animeaux.org">
                email
              </EmailHtml.Link>
              .
            </EmailHtml.Paragraph>

            <EmailHtml.Separator />

            <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
          </EmailHtml.Root>
        ),
      };
    }

    default: {
      return application.status satisfies never;
    }
  }
}

const EMAIL_SENTENCE_COMPONENTS: MarkdownComponents = {
  ...SENTENCE_COMPONENTS,

  a: ({ children, href }) => {
    if (href == null) {
      return <span>children</span>;
    }

    return <EmailHtml.Link href={href}>{children}</EmailHtml.Link>;
  },

  strong: ({ children }) => {
    // Wrap in a span with the class because the font weight is not well
    // rendered.
    return (
      <span className="text-body-lowercase-emphasis">
        <strong>{children}</strong>
      </span>
    );
  },
};
