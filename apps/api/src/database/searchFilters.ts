export const SearchFilters = {
  createFilterValue(name: string, value: any): string {
    return `${name}:${value}`;
  },

  createFilter(values: string[]): string {
    const res = values.join(" OR ");
    return values.length > 1 ? `(${res})` : res;
  },

  createFilters(filters: string[]): string {
    return filters.join(" AND ");
  },
};
