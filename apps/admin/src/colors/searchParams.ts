export class ColorSearchParams extends URLSearchParams {
  static readonly Keys = {
    NAME: "q",
  };

  getName() {
    return this.get(ColorSearchParams.Keys.NAME)?.trim() || null;
  }

  setName(name: string) {
    const copy = new ColorSearchParams(this);

    name = name.trim();
    if (name !== "") {
      copy.set(ColorSearchParams.Keys.NAME, name);
    } else if (copy.has(ColorSearchParams.Keys.NAME)) {
      copy.delete(ColorSearchParams.Keys.NAME);
    }

    return copy;
  }
}
