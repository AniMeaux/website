export const pageDescription =
  "Premier salon dédié au bien-être animal à Meaux";

export function getPageTitle(title?: string) {
  let pageTitle = "Salon des Ani’Meaux";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
