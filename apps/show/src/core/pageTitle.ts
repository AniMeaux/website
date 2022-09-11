export const pageDescription =
  "Premier salon dédié au bien-être animal à Meaux, les 10 et 11 juin 2023, de 10h à 18h au Colisée de Meaux";

export function getPageTitle(title?: string) {
  let pageTitle = "Salon des Ani’Meaux, 10 et 11 juin 2023";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
