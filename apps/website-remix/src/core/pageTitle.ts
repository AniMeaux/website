export const pageDescription =
  "Trouvez le compagnon de vos rêves et donnez-lui une seconde chance";

export function getPageTitle(title?: string) {
  let pageTitle = "Ani'Meaux";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
