import orderBy from "lodash.orderby";
import { DateTime } from "luxon";

export type Article = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  publicationDate: Date;
  authorName: string;
  content: string;
};

export const articles: Article[] = orderBy(
  [
    {
      id: "3c27118f-bca3-4916-aca3-8e24655a2e45",
      title: "L’histoire inspirante de Plume",
      authorName: "Sara",
      publicationDate: new Date("2023-07-09"),
      image: "blog/34d5dfb5-8d03-46e0-a1ab-2ef5a1c6d4aa",
      slug: "l-histoire-inspirante-de-plume",
      description:
        "Plume a commencé sa vie dans des circonstances difficiles. Abandonnée et livrée à elle-même, elle a dû se débrouiller seule dans les rues, luttant pour sa survie.",
      content: `Plume a commencé sa vie dans des circonstances difficiles. Abandonnée et livrée à elle-même, elle a dû se débrouiller seule dans les rues, luttant pour sa survie.
Alors qu’elle était en situation de détresse, une personne bienveillante a croisé son chemin et a décidé de l’aider en la conduisant en urgence chez le vétérinaire de garde.

![Plume](blog/a505472b-95fa-4546-ac97-0b7caf653a58)

C’est ainsi que Plume a été prise en charge au sein de notre association, où nous avons rapidement pris conscience de sa nature spéciale.

Les des examens médicaux de Plume, réalisés en urgence, ont révélé une problématique au niveau de son cerveau, une condition potentiellement dégénérative. Malgré les incertitudes et les préoccupations qui ont suivi ce diagnostic, Plume a montré une force inébranlable. Elle a fait preuve d’une stabilité remarquable et continue à nous émerveiller par sa capacité à se nourrir seule et à faire face à ses tremblements avec courage.

![Plume](blog/c98044a0-d616-4554-b86a-25814d82b638)

Au sein de notre association, nous sommes conscients que l’amour et le soutien sont essentiels pour aider nos protégés à traverser les moments difficiles. Plume a bénéficié de l’affection inconditionnelle de notre équipe et de sa famille d’accueil dévouée, qui ont travaillé sans relâche pour lui offrir les meilleurs soins possibles. Chaque caresse, chaque encouragement, chaque moment de présence lui ont apporté un réconfort précieux et ont contribué à sa stabilité.

![Plume](blog/34d5dfb5-8d03-46e0-a1ab-2ef5a1c6d4aa)

Plume a désormais rejoint une famille d’accueil définitive, où elle bénéficiera de toute l’attention et tous les soins dont elle a besoin, tout en restant sous la responsabilité de l’association, pour sa sécurité.`,
    },
    {
      id: "0ea736e3-f847-4b30-a198-42b65c157623",
      title: "Les parasites",
      authorName: "Sara",
      publicationDate: new Date("2019-04-30"),
      image: "blog/dabcc03c-fe76-4d02-a57b-4fa87a38e310",
      slug: "les-parasites",
      description:
        "Nos animaux de compagnie peuvent être la cible de différents parasites qu’il est important de connaître afin de mieux les combattre.",
      content: `Nos animaux de compagnie peuvent être la cible de différents parasites qu’il est important de connaître afin de mieux les combattre.

Les parasites sont de petits organismes qui vivent dans le corps ou sur le corps des animaux (au niveau de l’intestin, du cœur, des poumons, de la peau…).

Certains parasites peuvent être dangereux pour l’animal mais également pour son propriétaire.

Voici une liste non-exhaustive des parasites les plus fréquents à connaître.

## La tique

C’est un acarien (ordre des ixodes) qui vit principalement dans l’hémisphère nord. On les retrouvent principalement en forêt, dans les jardin et parcs.

Les tiques passent une majeure partie de leur vie au sol à la recherche d’un hôte.

En effet, les tiques se nourrissent de sang et pour cela elles vont venir s’accrocher à un hôte afin de s’alimenter.

On peut les retrouver sur la plupart des espèces : humains, équidés, reptiles, félins, canidés, bovins…

La morsure de tique peut être dangereuse car elle est vectrice de plusieurs maladies.

A savoir que, chez les tiques, c’est principalement la femelle qui transporte des maladies car le mâle ne reste pas accroché assez longtemps à un hôte.

L’une des maladies les plus dangereuses que transmet la tique est la maladie de Lyme. Cette maladie est transmis par la tique lorsqu’elle est au stade de nymphe.

La maladie de Lyme est une zoonose qui peut toucher plusieurs organes et systèmes, la peau mais aussi les articulations et le système nerveux.

Elle évolue par étapes qui peuvent être asymptomatiques et elle peut se déclencher plusieurs année après la morsure.

Cette maladie nécessite un traitement antibiotique.

Prévention :

- Répulsif
- Traitement anti-parasitaire

En cas de morsure, il faut retirer la tique au plus vite, désinfecter la zone de morsure et surveiller la zone de morsure et en cas de symptôme consultez votre médecin.

Attention à ne pas l’arracher ! Utilisez une pince à tique et faites la tourner jusqu’à ce qu’elle se décroche de la peau.

## La puce

Les puces sont des insectes que l’on retrouve principalement sur les mammifères et les oiseaux.

Adulte, elles se nourrissent de sang. Elle pique leur hôte sur lequel elle vive pour s’alimenter et en général, elle reste sur le même hôte jusqu’à leur mort. La longévité d’une puce est en général de quelques mois.

Les larves de puces peuvent se développer dans un milieu extérieur sans se nourrir de sang. Une femelle peut pondre en moyenne une vingtaine d’oeufs par jour. Le nombre de puces peut devenir très rapidement considérable.

Les piqûres de puces sont douloureuses et elles démangent. De plus, les puces peuvent être vecteur de maladies et de parasites (maladie de la griffe du chat, vers…).

Prévention :

- Traitement anti-parasitaire externe (collier, pipette, shampooing…)
- Traitement de l’environnement (couche de l’animal, lit, canapé, logement…)

Pensez à renouveler le traitement de votre animal (en fonction du moyen utilisé) et à nettoyer l’environnement régulièrement.

## Les vers

Les vers sont des parasites qui ne peuvent survivent sans un hôte.

Les principaux vers sont les vers ronds et les vers plats.

Nous pouvons repérer les vers plats en observant les excréments de vos animaux. En effet, on peut y retrouver des formes de ”grain de riz” qui sont en fait de poche contenant des oeufs du vers.

Les vers ronds peuvent atteindre jusqu’à 10 cm de long et leurs oeufs viennent se coller aux poils ou aux pattes de votre animal.

Symptômes :

- Démangeaisons anales
- Diarrhée
- Vomissements
- Ventre tendu
- Amaigrissement

Il existe aussi d’autres vers comme les parasites pulmonaires ou les vers du coeur qui sont des parasites rares en France mais qui sont tout aussi dangereux.

Prévention :

- Pensez à vermifuger votre animal tous les 3 mois (à savoir qu’il existe aussi des vermifuges pour humain).

En cas de présence de vers, un traitement sous plusieurs jours s’impose (panacure…). Vous pouvez demander l’avis de votre vétérinaire.

## Les acariens

Il s’agit d’animaux souvent invisibles à l’œil nue.

Il existe plus de 50 000 espèces d’acariens.

Parmi eux, on retrouve la tique mais aussi d’autres espèces qui peuvent être responsables de maladies.

Amateurs d’humidité, les acariens peuvent se développer rapidement dans des terrariums et peuvent nuire à votre reptile.

Si vous constatez des points noirs sur vos mains après avoir manipulé votre reptile, il s’agit probablement d’acariens.

Symptômes :

- Yeux gonflés
- Démangeaison

Prévention :

- Donner un bain chaud à votre animal
- Nettoyer toutes les décorations
- Retirer tout substrat du terrarium
- Désinfecter le terrarium (antiparasite)

Pensez à ne pas remettre tout de suite tous les éléments dans le terrarium. Vous pouvez remettre votre animal avec de l’essuie-tout en substrat afin de vérifier que le terrarium a bien été traité.`,
    },
    {
      id: "69966266-182b-4f73-86bb-b19e4d44577e",
      title: "Une grande menace plane sur les abeilles !",
      authorName: "Sara",
      publicationDate: new Date("2019-04-05"),
      image: "blog/ab8f2635-e376-4a50-9a82-381d2e64a0fa",
      slug: "une-grande-menace-plane-sur-les-abeilles",
      description:
        "Depuis quelques années, la population d’abeilles est en très forte diminution, avec une disparition totale sur certaines zones. On vous explique comment ne pas aggraver la situation…",
      content: `Depuis quelques années, la population d’abeilles est en très forte diminution, avec une disparition totale sur certaines zones. En France, plus de 30 % des colonies d’abeilles disparaissent chaque année. Depuis 10 ans, 15 000 apiculteurs ont cessé leur activité. La disparition de l’abeille serait lourde de conséquences sur un plan environnemental et économique.

On vous explique comment ne pas aggraver la situation…

1. Il faut renoncer aux traitements chimiques de type pesticides, insecticides ou désherbants dans les jardins et sur les balcons. Les abeilles sont particulièrement sensibles à ses produits.

2. N’hésitez pas à semer diverses variétés de fleurs : myosotis, aubépine, bruyère, chèvrefeuille, clématite, bleuets, lavande, rhododendron, carotte, tournesol ou coquelicot. Si vous choisissez les aromatiques comme la sauge, le basilic, le thym, la menthe ou le romarin, n’oubliez pas de les laisser fleurir. Dans le gazon, laissez les pissenlits et les trèfles. Ils sont riches en nectar et en pollens et les abeilles en raffolent. Semer des fleurs présente un intérêt pour elle. Cela permet de recréer de la biodiversité tout en fournissant une nourriture saine et sans pesticide.

3. Accueillez les en installant un petit point d’eau peu profond ou un tissu mouillé comme une serpillère pour qu’elles ne se noient pas.

4. Consommez du miel local et parrainez une ruche [ici](https://www.untoitpourlesabeilles.fr/inscription.html).

5. Construisez un abri pour vos abeilles. Vous pouvez vous-même fabriquer un nichoir qui les protégera du froid.

**Nul doute que ces petit gestes ne sont pas anodins pour les sauvegarder !**

Vous pouvez également vous rapprocher de l’Association Natur Miel.

Cette association est née au printemps 2018 suite à la destruction d’un rucher de 24 ruches biologiques par un pesticide. Vous pouvez les contacter par [mail](mailto:association@natur-miel.fr). Visitez également leur [site internet](https://natur-miel.fr). Vous pourrez y trouver de nombreux conseils pour préserver les abeilles, acheter du miel et faire un don pour les apiculteurs en difficulté.`,
    },
    {
      id: "6329efdd-24f7-4187-9c73-374d6c7b0e73",
      title: "Pourquoi adopter en association ?",
      authorName: "Sara",
      publicationDate: new Date("2019-03-20"),
      image: "blog/2cacd032-ba23-4082-9324-c8ab4b4ce5c6",
      slug: "pourquoi-adopter-en-association",
      description:
        "Vous souhaitez agrandir votre famille ? Privilégiez l’adoption en association ! On vous explique pourquoi…",
      content: `Vous souhaitez agrandir votre famille ? Privilégiez l’adoption en association ! On vous explique pourquoi…

## 1. Votre portefeuille vous remerciera

Réalité : un chat ou un chien adopté dans une association revient moins cher qu’un chat donné par un particulier :

|                                |           Par un particulier            |    Dans une association     |
| ------------------------------ | :-------------------------------------: | :-------------------------: |
| Adoption                       |                   0 €                   |            200 €            |
| Identification _Obligatoire_   |                  80 €                   |             ✅              |
| Vaccination _Typhus et Coryza_ |               50 € + 80 €               |             ✅              |
| Déparasitage _Puces et Vers_   |                  10 €                   |             ✅              |
| Dépistage _Sida et Leucose_    |                  50 €                   |             ✅              |
| Stérilisation                  |     100 € (Mâle) ou 150 € (Femelle)     |             ✅              |
| Consultation                   |                  35 €                   |             ✅              |
| **Total**                      | **405 €** (Mâle) ou **455 €** (Femelle) | **200 €** (Mâle ou Femelle) |

## 2. Vous sauvez 2 vies

En adoptant en association, vous sauvez l’animal que vous adoptez mais vous permettez également à l’association d’avoir une place pour en sauver un autre.

## 3. Vous trouverez un animal qui vous correspond

Les associations vous conseillerons au mieux pour trouver l’animal qui correspondra à votre mode de vie. Les familles d’accueil permettent de connaître parfaitement l’animal de son caractère à ses ententes.

## 4. Vous ne perdrez pas votre temps chez le vétérinaire

Les animaux en association sont, pour la plupart, déjà : vaccinés, identifiés et stérilisés/castrés. Le suivi vétérinaire régulier vous permettra de savoir son état de santé.

## 5. Vous luttez contre le commerce illégal des animaux

Les animaux font l’objet d’un business et certains n’hésitent pas à en tirer un maximum de profit, au détriment du bien-être de l’animal. Bien souvent, les animaux sont maintenus dans des conditions insalubres, ne sont pas soignés et sont utilisés uniquement pour la reproduction jusqu’à leur épuisement et même leur décès.

En adoptant, vous indiquez également que vous n’êtes pas pour le statut d’objet que pourrait avoir l’animal dans l’esprit de certains. Le trafic d’animaux est reconnu comme étant le 3e trafic illégal au monde après celui de la drogue et de la vente d’armes.

## 6. Vous avez le choix

Chiens, chats, lapins, hamster, souris, serpents, oiseaux, ce n’est pas le nombre qui manque en association.

## 7. Vous montrez le bon exemple

Adopter est un acte responsable qui permet notamment de lutter contre les abandons, la surpopulation et le trafic d’animaux.

Vous voulez faire une bonne action ? Adoptez un animal ayant eu un passé difficile…

Vous voulez en adopter 2 ? Adoptez 2 protégés inséparables…

Vous aimez les petits mal-aimés ? Adoptez un de nos protégés ayant le sida, un chat noir, un petit handicapé…

Laissez-vous tenter par l’expérience avec nos protégés à l’adoption !`,
    },
    {
      id: "d1886656-3081-45e9-89d9-e60233e42645",
      title: "Comment choisir les bonnes croquettes pour nos amis à 4 pattes ?",
      authorName: "Sara",
      publicationDate: new Date("2019-03-09"),
      image: "blog/76db3528-e3fe-481a-bfd2-70feff01150b",
      slug: "comment-choisir-les-bonnes-croquettes-pour-nos-amis-a-4-pattes",
      description:
        "Choisir les bonnes croquettes pour votre protégé est très important.",
      content: `**Choisir les bonnes croquettes pour votre protégé est très important**. Des croquettes de toutes sortes et de toutes marques sont proposées partout : dans les supermarchés, dans les animaleries, dans les cliniques vétérinaires et sur internet. Face aux nombreux choix qui s’offrent à vous, n’oubliez pas que les entreprises recherchent avant tout à faire du bénéfice et cela, très souvent, au-delà même du bien-être de nos amis les bêtes. Il convient donc d’être vigilant dans le choix de vos croquettes.

_Pour cela, nous vous présentons les règles de base…_

## Ne pas prendre les croquettes premier prix

En effet, premier prix signifie souvent mauvaise qualité.

Les matières premières utilisées dans la fabrication de ces croquettes sont principalement des céréales en trop grandes quantité. Elles apportent des protéines indigestibles et des quantités d’amidon qui peuvent entraîner au pire une malnutrition ou au mieux des désordres digestifs chez nos compagnons.

Attention, choisir les croquettes les plus chères ne signifie pas forcément qu’elles soient de meilleure qualité !

## Ne vous fiez pas au marketing

La plupart du temps, ce qui est écrit en gros sur le paquet de croquette n’est pas la réalité. Par exemple, avec un paquet où il est écrit ”100 % bœuf” sur le packaging. Sur l’étiquette, on s’aperçoit que le ”100 % bœuf” est plutôt égal à ”10 % de bœuf”.

_C’est pour cette raison qu’il faut…_

## Apprendre à lire les étiquettes

Il faut d’abord regarder les ingrédients.

Repérez les protéines animales et non végétales. Elles sont plus intéressantes nutritionnellement. Sachez également que, plus les ingrédients seront détaillés, plus vous pourrez avoir affaire à des croquettes de qualité. Une appellation trop vague comme ”viande” peut être douteuse. Orientez-vous vers des croquettes avec des ingrédients détaillés et précis.

Les ingrédients à privilégier sont :

- La viande ou le poisson ;
- Les matières grasses de bonne qualité comme la graisse de poulet ou de canard ;
- Les matières végétales de bonne qualité mais en faible quantité comme l’huile de lin ou les graines de lin ;
- Les sels minéraux comme le zinc, le cuivre, le calcium et le phosphore ;
- Les vitamines et les oligoéléments.

Les ingrédients à éviter sont :

- Les sous-produits et les déchets animaux ;
- Les céréales comme le blé, le maïs, le riz et l’avoine ;
- Les conservateurs.

Ensuite, repérez les éventuels additifs chimiques comme les conservateurs, les colorants, les agents de textures, les arômes artificiels et les exhausteurs de goût de synthèse. Privilégiez les conservateurs naturels tels que l’acide ascorbique issu de la vitamine C ou les tocophérols issus de la vitamine E.

## Analyser les constituants analytiques

Ensuite, il est important de regarder les quantités de nutriments.

Ils peuvent être affichés sous les dénominations ”analyse moyenne” ou ”analyse nutritionnelle”. Ils renseignent sur les quantités de nutriments présents dans l’aliment.

Ainsi, on peut y lire :

- Le taux de protéines ;
- Le taux de lipides (matières grasses) ;
- Le taux de fibres/cellulose ;
- Le taux d’humidité ;
- Le taux de cendres brutes.

Cependant, il manque un élément important sur les étiquettes : le taux de glucides.

Il faut donc le calculer grâce à l’opération suivante :

_% de glucides = 100 - (% de protéines - % de matières grasses + % de cendres + % d’humidité)_

Si le taux de glucides est :

- Inférieur 30 %, le taux est bon ;
- Entre 30 et 40 %, le taux est moyen ;
- Supérieur à 40 %, le taux est mauvais.

Privilégiez les croquettes avec le plus de protéines et le moins de glucides possible. Cependant, les protéines peuvent être apportées par des os, des tendons et des sous-produits.

Il faut alors faire attention au taux de cendres. Un taux de cendres supérieur à 12 % est presque toujours le signe de matières premières de mauvaise qualité.

En résumé, le pourcentage des constituants analytiques doit être :

- Supérieur à 35 % pour la protéine animale ;
- 20 % pour les lipides et les matières grasses ;
- Moins de 20 % pour les glucides ;
- Environ 10 % pour le taux d’humidité ;
- Moins de 8 % pour le taux de cendres ;
- Moins de 3 % pour le taux de fibres.

_Mais voici également quelques conseils pour…_

## Hydratez vos croquettes

Si votre protégé ne boit pas assez, mange trop vite, a faim après son repas, a besoin de maigrir, mange des croquettes avec un taux de cendres élevé : hydratez ses croquettes.

Mettez 75 % d’eau pour 25 % de croquettes et vous aurez une bonne pâtée !

## Conservez vos croquettes plus longtemps

Les croquettes de vos 4 pattes sont périssables.

Des mites ou des acariens peuvent les coloniser et rendre votre animal malade. Ainsi, elles doivent être consommées rapidement 4 semaines maximum après l’ouverture.

Afin de les protéger et de les conserver plus longtemps :

- Videz l’air du sac avant de le fermer ;
- Stockez-les à l’abri de la lumière ;
- Saupoudrez-les de terre de diatomée.

_En conclusion, pour choisir de bonnes croquettes pour votre protégé, voici les 5 règles d’or :_

1. Le plus de protéines et le moins de glucides possible vous prendrez ;
2. Un maximum de protéines d’origine animale vous privilégerez ;
3. Des protéines animales de bonne qualité vous choisirez ;
4. Le mot animal ou végétal vous regarderez ;
5. Les céréales vous éviterez.`,
    },
    {
      id: "936ced63-9ee1-4758-a023-f0847dac7b16",
      title: "Nos perles noires",
      authorName: "Sara",
      publicationDate: new Date("2019-02-09"),
      image: "blog/91b2db94-c111-4e89-b041-0ea02c5f269d",
      slug: "nos-perles-noires",
      description:
        "Les chats noirs sont de véritables perles au sein d’une famille.",
      content: `Les chats noirs sont de véritables perles au sein d’une famille.

Malheureusement victimes de leur couleur, ils sont très souvent les derniers à être adoptés… à tort !

En effet, les chats noirs sont en général les chats les plus proches de l’homme.

Attention cependant, bien souvent ils ne sont pas noirs mais marrons, portant quelques rayures noires. Les chats complètement noirs de la tête aux pieds sont très rares.

Pourtant, leur magnifique couleur noire leur permet de faire ressortir leurs jolis yeux, jaunes ou verts.

Petit plus, en Angleterre et en Asie, nos merveilleuses perles noires portent bonheur et non pas malheur comme pour certains superstitieux ! ;)

Voici quelques témoignages des familles ayant adopté un chat noir, petit protégé de l’association Ani’Meaux :

![Orphéo](blog/113cba9a-8f46-4e1e-a6b0-04282b11e7cb)

> Il a très vite pris ses marques après avoir fait plus ample connaissance avec son frère Ticho, mon vieux pépère de 10 ans […] Ils se sont vite faits l’un à l’autre en l’espace d’une semaine, se léchant affectueusement le pelage de bon matin ! Orphéo est très joueur, avec les peluches miniatures, les boîtes carton, rouleau de papier toilette… Il est gourmand aussi, et plonge sans filet la tête dans le yaourt framboise ou dans le beurre ! Puis le soir, il ronronne de plaisir le long de ma jambe sous le plaid avant d’aller se coucher avec ses peluches dans son petit nid douillet. Pour conclure, une belle histoire d’amour qui s’écrit à 3 !
>
> **Sonia, heureuse humaine d’Orphéo.**

![Oreste](blog/3f88499b-3017-4f45-8ff6-9eefbf46cf43)

> Il est très vif, affectueux, indépendant mais très présent. Il a besoin de câlins, c’est une machine à ronrons. Il a des petites périodes de folie, durant lesquelles il court dans toute la maison, monte et descend les escaliers en faisant de petits bruits… Il a tout de suite pris deux petits doudous dans la chambre de Noé et a décidé qu’ils étaient les siens. Il se balade avec ses doudous et parfois en rentrant du boulot, nous les trouvons le nez dans sa gamelle, c’est Oreste qui les place comme cela ! Il est très souvent perché en haut de son arbre à chat ou sur le canapé lorsque nous y sommes. Il fait partie de nos vies et nous comble de bonheur. C’est le 5e membre de la famille.
>
> **Virginie, maman d’Oreste.**

Vous l’aurez compris, nos perles noires méritent aussi de trouver un doux foyer où ils pourront couvrir leur famille de ronrons au quotidien !

Aujourd’hui, nous n’avons presque plus que des chats noirs sous l’aile de l’association.

Koda, Pepper & Pearl et Oréo [attendent leur famille pour la vie](/adoption/chat) !

S’ils ne trouvent pas de famille, notre action n’en sera que retardée et diminuée pour tous les autres petits êtres qui attendent d’être sauvés.

Alors, qu’attendez-vous ? C’est peut-être vous le nouveau compagnon pour la vie d’une de nos perles noires !

[Contactez-nous](mailto:adoption@animeaux.org) !`,
    },
  ],
  (article) => DateTime.fromJSDate(article.publicationDate).toMillis(),
  "desc"
);
