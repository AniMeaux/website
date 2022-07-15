export function getPageTitle(title?: string) {
  let pageTitle = "Ani'Meaux";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
