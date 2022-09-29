export function getPageTitle(title?: string) {
  let pageTitle = "Faune";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
