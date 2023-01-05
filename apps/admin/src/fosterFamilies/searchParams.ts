export class FosterFamilySearchParams extends URLSearchParams {
  static readonly Keys = {
    NAME: "q",
  };

  getName() {
    return this.get(FosterFamilySearchParams.Keys.NAME)?.trim() || null;
  }

  setName(name: string) {
    const copy = new FosterFamilySearchParams(this);

    name = name.trim();
    if (name !== "") {
      copy.set(FosterFamilySearchParams.Keys.NAME, name);
    } else if (copy.has(FosterFamilySearchParams.Keys.NAME)) {
      copy.delete(FosterFamilySearchParams.Keys.NAME);
    }

    return copy;
  }
}
