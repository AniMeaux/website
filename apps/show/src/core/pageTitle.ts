export function getPageTitle(title?: string) {
  let pageTitle = "Salon des Ani'Meaux";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
