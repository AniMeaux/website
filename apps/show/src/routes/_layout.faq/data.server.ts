import { Routes } from "#core/navigation";
import type { Faq } from "#faq/faq";

export const QUESTIONS: Faq[] = [
  {
    question: "L’entrée est-elle payante ?",
    answer: `
Donnez ce que vous pouvez, minimum 3 € en ligne, 5 € sur place, gratuit pour les moins de 12 ans.

Une billetterie en ligne est [accessible ici](${process.env.TICKETING_URL}).

Les bénéfices générés par les billets d’entrée seront reversés aux associations exposantes du salon.
`.trim(),
  },
  {
    question: "Mon animal peut-il m’accompagner ?",
    answer: `
Seuls les chiens sont les bienvenus. Cependant il vous faudra présenter le carnet de santé et les papiers d’identification à l’entrée du salon. Ces derniers doivent être à jour.

Ceci permettra d’assurer la sécurité de tous les animaux présents durant le salon.
`.trim(),
  },
  {
    question: "Est-il possible de se restaurer sur place ?",
    answer: `
L’espace restauration se trouve à l’extérieur du bâtiment. Il y en aura pour tous les goûts et tous les régimes !
`.trim(),
  },
  {
    question: "Puis-je me garer facilement ?",
    answer: `
Vous trouverez un parking gratuit en arrivant devant le Colisée de Meaux.

**Attention**, il est interdit de laisser vos animaux dans votre véhicule durant le salon.
`.trim(),
  },
  {
    question: "Le salon est-il accessible aux personnes à mobilité réduite ?",
    answer: `
Bien sûr, l’implantation du salon a été conçue afin qu’il soit accessible à tous.
`.trim(),
  },
  {
    question: "Y aura-t-il des animaux à l’adoption ?",
    answer: `
Les associations présentes durant le salon auront la possibilité d’être accompagnées de chiens à l’adoption.

Attention néanmoins, aucune adoption ne sera possible durant le salon. La finalisation de l’adoption se fera avec l’association que vous avez choisi, en dehors du salon.
`.trim(),
  },
  {
    question: "Y a-t-il des toilettes ?",
    answer: `
Oui, des toilettes sont mises à disposition du public.
`.trim(),
  },
  {
    question: "Y a-t-il des vestiaires ?",
    answer: `
Aucun vestiaire n’est présent sur place.
`.trim(),
  },
  {
    question: "Pourrais-je acheter des produits sur place ?",
    answer: `
Oui, les produits présentés sur les stands des professionnels et association peuvent être achetés.

Certains exposants sont équipés d’un terminal de paiement, mais nous vous conseillons de prévoir des espèces !
`.trim(),
  },
  {
    question: "Puis-je retirer de l’argent ?",
    answer: `
Il n’y a pas de distributeur de billets au sein de la salle. Néanmoins, de nombreuses banques sont à votre disposition en centre ville de Meaux.
`.trim(),
  },
  {
    question: "Comment trouver l’exposant qui m’intéresse ?",
    answer: `
La liste des exposants est disponible sur la page [Exposants](${Routes.exhibitors.toString()}).
`.trim(),
  },
  {
    question: "Y a-t-il une garderie animale ?",
    answer: `
Non, aucune garderie n’est prévue sur le salon. Merci d’anticiper votre visite et de ne surtout pas laisser votre compagnon dans votre voiture !
`.trim(),
  },
  {
    question: "Y a-t-il des animations sur le salon ?",
    answer: `
Oui, le programme des animations est disponible sur la page [Programme](${Routes.program.toString()}). Nous vous réservons des animations variées et ludiques destinées aux familles.
`.trim(),
  },
];
