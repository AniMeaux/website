import { ProseInlineAction } from "#core/actions/prose-inline-action";

export type Faq = {
  question: string;
  answer: React.ReactNode;
};

export const FAQ: Faq[] = [
  {
    question: "Quelles sont les dates et horaires du salon ?",
    answer: (
      <>
        Le salon se tiendra les{" "}
        <strong className="text-body-lowercase-emphasis">
          7 et 8 juin 2025
        </strong>
        , de <strong className="text-body-lowercase-emphasis">10h à 18h</strong>{" "}
        au{" "}
        <strong className="text-body-lowercase-emphasis">
          Colisée de Meaux, 73 avenue Henri Dunant, 77100 Meaux
        </strong>
        .
      </>
    ),
  },
  {
    question: "Comment puis-je contacter l’équipe organisatrice ?",
    answer: (
      <>
        Vous pouvez joindre l’équipe à{" "}
        <ProseInlineAction asChild>
          <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
        </ProseInlineAction>
        .
      </>
    ),
  },
  {
    question: "Quels sont les tarifs pour l’inscription ?",
    answer: (
      <>
        -{" "}
        <strong className="text-body-lowercase-emphasis">
          Prestataires de service
        </strong>
        {" "}: 30 € à 40 € selon la taille du stand.
        <br />-{" "}
        <strong className="text-body-lowercase-emphasis">Boutiques</strong>
        {" "}: 50 € à 300 € selon la taille du stand.
        <br />-{" "}
        <strong className="text-body-lowercase-emphasis">Associations</strong>
        {" "}: Gratuit.
      </>
    ),
  },
  {
    question: "Quand puis-je installer mon stand ?",
    answer: (
      <>
        -{" "}
        <strong className="text-body-lowercase-emphasis">
          Vendredi 6 juin
        </strong>
        {" "}: De 15h à 19h.
        <br />-{" "}
        <strong className="text-body-lowercase-emphasis">Samedi 7 juin</strong>
        {" "}: À partir de 8h00.
        <br />-{" "}
        <strong className="text-body-lowercase-emphasis">
          Dimanche 8 juin
        </strong>
        {" "}: À partir de 8h30.
      </>
    ),
  },
  {
    question: "Quand dois-je démonter mon stand ?",
    answer: (
      <>
        Le démontage commence{" "}
        <strong className="text-body-lowercase-emphasis">
          dimanche 8 juin à 18h
        </strong>{" "}
        et doit être terminé à{" "}
        <strong className="text-body-lowercase-emphasis">20h</strong>.
      </>
    ),
  },
  {
    question: "Quelles sont les règles concernant l’électricité ?",
    answer: (
      <>
        Une alimentation électrique est prévue sur demande, mais chaque exposant
        doit apporter une rallonge (10 m) et une multiprise. Toute installation
        sera vérifiée par les organisateurs.
      </>
    ),
  },
  {
    question: "Quels équipements sont fournis avec les stands ?",
    answer: (
      <>
        Tables, chaises et cloisons sont inclus selon les dimensions réservées.
        Les détails spécifiques peuvent être confirmés lors de la réservation.
      </>
    ),
  },
  {
    question: "Y a-t-il un service de restauration sur place ?",
    answer: (
      <>
        Oui et des options végétariennes et véganes sont prévues ! Toutefois,
        les exposants ne sont pas autorisés à vendre de la nourriture ou des
        boissons sur leurs stands.
      </>
    ),
  },
  {
    question: "Quelles sont les options de stationnement ?",
    answer: (
      <>
        Le parking du Colisée est réservé pour l’événement, mais il est
        conseillé d’arriver tôt en raison de la forte affluence.
      </>
    ),
  },
  {
    question: "Comment puis-je promouvoir ma participation et l’événement ?",
    answer: (
      <>
        - Flyers fournis par l’association ou imprimés par vos soins.
        <br />
        - Partage sur les réseaux sociaux (Facebook, Instagram, etc.) et
        newsletter.
        <br />- Bouche à oreille.
      </>
    ),
  },
  {
    question: "Puis-je devenir sponsor pour une meilleure visibilité ?",
    answer: (
      <>
        Oui, trois niveaux sont proposés. N’hésitez pas à nous demander la
        documentation !
      </>
    ),
  },
  {
    question: "Puis-je venir avec un animal sur mon stand ?",
    answer: <>Oui, uniquement des chiens identifiés, vaccinés et en règle !</>,
  },
  {
    question: "Des vétérinaires seront-ils présents sur place ?",
    answer: (
      <>
        Oui, un vétérinaire vérifiera l’état de santé et les vaccinations des
        animaux entrants.
      </>
    ),
  },
  {
    question: "Que se passe-t-il en cas d’annulation de ma participation ?",
    answer: (
      <>Aucun remboursement ne sera effectué sauf en cas de force majeure.</>
    ),
  },
  {
    question:
      "Puis-je stocker des articles ou du matériel sur place avant ou après l’événement ?",
    answer: (
      <>
        Non, aucun stockage avant ou après le salon n’est possible. Tout
        matériel doit être retiré au plus tard le{" "}
        <strong className="text-body-lowercase-emphasis">
          dimanche 8 juin à 20h
        </strong>
        . Votre matériel et vos produits peuvent rester dans la salle qui est
        fermée et sécurisée.
      </>
    ),
  },
  {
    question: "Y aura-t-il des opportunités de réseautage ?",
    answer: (
      <>
        Oui, un verre de l’amitié est organisé le{" "}
        <strong className="text-body-lowercase-emphasis">
          samedi 7 juin à 18h30
        </strong>{" "}
        pour permettre aux exposants de rencontrer les autres participants et
        sponsors.
      </>
    ),
  },
  {
    question: "Puis-je distribuer des échantillons gratuits ou des goodies ?",
    answer: (
      <>
        Oui, et nous vous encourageons à en inclure dans les{" "}
        <strong className="text-body-lowercase-emphasis">gift bags</strong>{" "}
        distribués aux visiteurs à l’entrée. Contactez-nous pour plus
        d’informations !
      </>
    ),
  },
  {
    question:
      "Mes affaires seront-elles surveillées en dehors des heures d’ouverture ?",
    answer: (
      <>
        Non, aucun service de sécurité n’est prévu pendant les heures de
        fermeture du salon. Nous recommandons de ne pas laisser d’objets de
        valeur sur votre stand et les stands en extérieur devront être rapatriés
        en intérieur dans la nuit du samedi au dimanche.
      </>
    ),
  },
  {
    question:
      "Puis-je accrocher des banderoles ou posters en dehors de mon stand ?",
    answer: <>Non, toute publicité doit être limitée à votre espace désigné.</>,
  },
  {
    question: "Puis-je distribuer des flyers dans les allées ?",
    answer: <>Non, la distribution doit se limiter à votre stand.</>,
  },
];
