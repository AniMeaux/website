export function getPageTitle(title?: string) {
  let pageTitle = "Admin";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
