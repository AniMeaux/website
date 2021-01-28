// https://nlp.stanford.edu/nlp/javadoc/javanlp/edu/stanford/nlp/util/Trilean.html
export enum Trilean {
  TRUE = "TRUE",
  FALSE = "FALSE",
  UNKNOWN = "UNKNOWN",
}

export const TrileanLabels: {
  [key in Trilean]: string;
} = {
  [Trilean.TRUE]: "Oui",
  [Trilean.FALSE]: "Non",
  [Trilean.UNKNOWN]: "Inconnu",
};

export const TRILEAN_ORDER: Trilean[] = [
  Trilean.UNKNOWN,
  Trilean.TRUE,
  Trilean.FALSE,
];
