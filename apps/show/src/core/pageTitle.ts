export const pageDescription =
  "Premier salon dédié au bien-être animal à Meaux, les 8 et 9 juin 2024, de 10h à 18h au Colisée de Meaux.";

export function getPageTitle(title?: string) {
  let pageTitle = "Salon des Ani’Meaux, les 8 et 9 juin 2024";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
