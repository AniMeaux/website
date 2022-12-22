enum Keys {
  TEXT = "q",
}

export class ColorSearchParams extends URLSearchParams {
  static readonly Keys = Keys;

  getText() {
    return this.get(Keys.TEXT) || null;
  }

  setText(text: string) {
    const copy = new ColorSearchParams(this);

    if (text !== "") {
      copy.set(Keys.TEXT, text);
    } else if (copy.has(Keys.TEXT)) {
      copy.delete(Keys.TEXT);
    }

    return copy;
  }
}
