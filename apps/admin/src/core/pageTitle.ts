export function getPageTitle(title?: string | string[]) {
  let pageTitle = "Admin";

  title = Array.isArray(title) ? title.join(" • ") : title;
  if (title) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return pageTitle;
}
