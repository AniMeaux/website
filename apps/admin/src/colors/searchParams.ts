export class ColorSearchParams extends URLSearchParams {
  static readonly Keys = {
    TEXT: "q",
  };

  getText() {
    return this.get(ColorSearchParams.Keys.TEXT) || null;
  }

  setText(text: string) {
    const copy = new ColorSearchParams(this);

    if (text !== "") {
      copy.set(ColorSearchParams.Keys.TEXT, text);
    } else if (copy.has(ColorSearchParams.Keys.TEXT)) {
      copy.delete(ColorSearchParams.Keys.TEXT);
    }

    return copy;
  }
}
