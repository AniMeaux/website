export const SearchFilters = {
  createFilter(name: string, value: any): string {
    return `${name}:${value}`;
  },

  and(conditions: string[]): string {
    const res = conditions.join(" AND ");
    return conditions.length > 1 ? `(${res})` : res;
  },

  or(conditions: string[]): string {
    const res = conditions.join(" OR ");
    return conditions.length > 1 ? `(${res})` : res;
  },
};
