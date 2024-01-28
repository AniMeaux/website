import { ProseInlineAction } from "#core/actions.tsx";
import { createConfig } from "#core/config.server.ts";
import type { Config } from "#core/config.ts";
import { useConfig } from "#core/config.ts";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { LightBoardCard } from "#core/layout/lightBoardCard.tsx";
import { Section } from "#core/layout/section.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { Routes } from "#core/navigation.tsx";
import { getPageTitle } from "#core/pageTitle.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { Icon } from "#generated/icon.tsx";
import * as Collapsible from "@radix-ui/react-collapsible";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import chunk from "lodash.chunk";

export async function loader() {
  const { featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  return json("ok" as const);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data === "ok" ? "Foire aux questions" : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  return (
    <>
      <TitleSection />
      <QuestionsSection />
      <MoreQuestionsSection />
    </>
  );
}

function TitleSection() {
  return (
    <Section>
      <Section.ImageAside>
        <DynamicImage
          image={{
            id: "/show/da9e955a-ca14-4777-85c9-ccba3c2382cd",
            blurhash: "UMG[M]--xm9a~B9bs.bIIUNGNMt7R*t7RkoI",
          }}
          alt="Chèvre regardant vers nous."
          aspectRatio="1:1"
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant11", color: "prussianBlue", side: "right" }}
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside className="md:col-start-1 md:row-start-1">
        <Section.Title asChild className="text-center md:text-left">
          <h1>Foire aux questions</h1>
        </Section.Title>

        <p className="text-center md:text-left">
          Retrouvez ici les réponses aux questions fréquemment posées.
        </p>
      </Section.TextAside>
    </Section>
  );
}

function QuestionsSection() {
  return (
    <Section columnCount={1}>
      <ul className="grid sm:hidden grid-cols-1 gap-2">
        {FAQ.map((faq) => (
          <FaqItem key={faq.question} faq={faq} />
        ))}
      </ul>

      <ul className="hidden sm:grid md:hidden grid-cols-2 gap-x-4">
        {chunk(FAQ, Math.ceil(FAQ.length / 2)).map((column, index) => (
          <li key={index} className="grid grid-cols-1">
            <ul className="grid grid-cols-1 gap-2 content-start">
              {column.map((faq) => (
                <FaqItem key={faq.question} faq={faq} />
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <ul className="hidden md:grid grid-cols-3 gap-x-4">
        {chunk(FAQ, Math.ceil(FAQ.length / 3)).map((column, index) => (
          <li key={index} className="grid grid-cols-1">
            <ul className="grid grid-cols-1 gap-2 content-start">
              {column.map((faq) => (
                <FaqItem key={faq.question} faq={faq} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function FaqItem({ faq }: { faq: Faq }) {
  const config = useConfig();

  return (
    <Collapsible.Root asChild>
      <li className="group/item rounded-1 bg-alabaster data-[state=open]:bg-paleBlue grid grid-cols-1 transition-colors duration-150 ease-in-out">
        <Collapsible.Trigger className="group/trigger rounded-1 px-2 py-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-left text-body-uppercase-emphasis focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg">
          {faq.question}

          <Icon
            id="linearArrowDown"
            className="text-[16px] group-data-[state=open]/trigger:-rotate-180 transition-transform group-hover/trigger:group-data-[state=open]/trigger:-translate-y-0.5 group-hover/trigger:group-data-[state=closed]/trigger:translate-y-0.5 duration-150 ease-in-out"
          />
        </Collapsible.Trigger>

        <Collapsible.Content className="overflow-hidden bg-var-alabaster group-data-[state=open]/item:bg-var-paleBlue px-2 py-1 group-data-[state=open]/item:animate-radix-collapsible-content-open group-data-[state=closed]/item:animate-radix-collapsible-content-close">
          {typeof faq.answer === "function" ? faq.answer(config) : faq.answer}
        </Collapsible.Content>
      </li>
    </Collapsible.Root>
  );
}

function MoreQuestionsSection() {
  const { facebookUrl, instagramUrl } = useConfig();

  return (
    <Section columnCount={1}>
      <Section.TextAside asChild>
        <LightBoardCard>
          <Section.Title>Vous avez une autre question ?</Section.Title>

          <p>
            Contactez-nous via{" "}
            <ProseInlineAction asChild>
              <Link to={facebookUrl}>Facebook</Link>
            </ProseInlineAction>
            ,{" "}
            <ProseInlineAction asChild>
              <Link to={instagramUrl}>Instagram</Link>
            </ProseInlineAction>{" "}
            ou par{" "}
            <ProseInlineAction asChild>
              <Link to="mailto:salon@animeaux.org">email</Link>
            </ProseInlineAction>{" "}
            et nous vous répondrons dans les plus brefs délais !
          </p>
        </LightBoardCard>
      </Section.TextAside>
    </Section>
  );
}

type Faq = {
  question: string;
  answer: React.ReactNode | ((config: Config) => React.ReactNode);
};

const FAQ: Faq[] = [
  {
    question: "L’entrée est-elle payante ?",
    answer: ({ ticketingUrl }) => (
      <>
        Donnez ce que vous pouvez, minimum 2 € en ligne, 4 € sur place, gratuit
        pour les moins de 12 ans.
        <br />
        <br />
        Une billetterie en ligne est{" "}
        <ProseInlineAction asChild>
          <Link to={ticketingUrl}>accessible ici</Link>
        </ProseInlineAction>
        .
        <br />
        <br />
        Les bénéfices générés par les billets d’entrée seront reversés aux
        associations exposantes du salon.
      </>
    ),
  },
  {
    question: "Mon animal peut-il m’accompagner ?",
    answer: (
      <>
        Seuls les chiens sont les bienvenus. Cependant il vous faudra présenter
        le carnet de santé et les papiers d’identification à l’entrée du salon.
        Ces derniers doivent être à jour.
        <br />
        Ceci permettra d’assurer la sécurité de tous les animaux présents durant
        le salon.
      </>
    ),
  },
  {
    question: "Est-il possible de se restaurer sur place ?",
    answer: (
      <>
        L’espace restauration se trouve à l’extérieur du bâtiment. Il y en aura
        pour tous les goûts et tous les régimes !
      </>
    ),
  },
  {
    question: "Puis-je me garer facilement ?",
    answer: (
      <>
        Vous trouverez un parking gratuit en arrivant devant le Colisée de
        Meaux.
        <br />
        <br />
        <strong className="text-body-lowercase-emphasis">Attention</strong>, il
        est interdit de laisser vos animaux dans votre véhicule durant le salon.
      </>
    ),
  },
  {
    question: "Le salon est-il accessible aux personnes à mobilité réduite ?",
    answer: (
      <>
        Bien sûr, l’implantation du salon a été conçue afin qu’il soit
        accessible à tous.
      </>
    ),
  },
  {
    question: "Y aura-t-il des animaux à l’adoption ?",
    answer: (
      <>
        Les associations présentes durant le salon auront la possibilité d’être
        accompagnées de chiens à l’adoption.
        <br />
        Attention néanmoins, aucune adoption ne sera possible durant le salon.
        La finalisation de l’adoption se fera avec l’association que vous avez
        choisi, en dehors du salon.
      </>
    ),
  },
  {
    question: "Y a-t-il des toilettes ?",
    answer: <>Oui, des toilettes sont mises à disposition du public.</>,
  },
  {
    question: "Y a-t-il des vestiaires ?",
    answer: <>Aucun vestiaire n’est présent sur place.</>,
  },
  {
    question: "Pourrais-je acheter des produits sur place ?",
    answer: (
      <>
        Oui, les produits présentés sur les stands des professionnels et
        association peuvent être achetés.
        <br />
        Certains exposants sont équipés d’un terminal de paiement, mais nous
        vous conseillons de prévoir des espèces !
      </>
    ),
  },
  {
    question: "Puis-je retirer de l’argent ?",
    answer: (
      <>
        Il n’y a pas de distributeur de billets au sein de la salle. Néanmoins,
        de nombreuses banques sont à votre disposition en centre ville de Meaux.
      </>
    ),
  },
  {
    question: "Comment trouver l’exposant qui m’intéresse ?",
    answer: (
      <>
        La liste des exposants est disponible sur la page{" "}
        <ProseInlineAction asChild>
          <Link to={Routes.exhibitors()} prefetch="intent">
            Exposants
          </Link>
        </ProseInlineAction>
        .
      </>
    ),
  },
  {
    question: "Y a-t-il une garderie animale ?",
    answer: (
      <>
        Non, aucune garderie n’est prévue sur le salon. Merci d’anticiper votre
        visite et de ne surtout pas laisser votre compagnon dans votre voiture !
      </>
    ),
  },
  {
    question: "Y a-t-il des animations sur le salon ?",
    answer: (
      <>
        Oui, le programme des animations est disponible sur la page{" "}
        <ProseInlineAction asChild>
          <Link to={Routes.program()} prefetch="intent">
            Programme
          </Link>
        </ProseInlineAction>
        . Nous vous réservons des animations variées et ludiques destinées aux
        familles.
      </>
    ),
  },
];
