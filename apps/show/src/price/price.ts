export namespace Price {
  export function format(price: number) {
    return price.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  }
}
