import { ParsedUrlQuery } from "querystring";

const PAGE_KEY = "page";

export class PageQueryParam {
  readonly page: number = 0;

  static fromQuery(query: ParsedUrlQuery): PageQueryParam {
    let page = 0;

    if (query[PAGE_KEY] != null && typeof query[PAGE_KEY] === "string") {
      // Pages in the URL starts at 1 for a easier UX.
      page = Number(query[PAGE_KEY]) - 1;

      if (isNaN(page)) {
        page = 0;
      }
    }

    return new PageQueryParam(page);
  }

  constructor(page: number) {
    this.page = page;
  }

  toUrl(): string {
    const params = new URLSearchParams();

    if (this.page > 0) {
      // Pages in the URL starts at 1 for a easier UX.
      params.set(PAGE_KEY, String(this.page + 1));
    }

    const query = params.toString();
    return query === "" ? "" : `?${query}`;
  }
}
