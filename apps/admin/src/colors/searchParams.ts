import { z } from "zod";
import { zfd } from "zod-form-data";

export class ColorSearchParams extends URLSearchParams {
  static readonly Keys = {
    NAME: "q",
  };

  getName() {
    return zfd
      .text(z.string().optional().catch(undefined))
      .parse(this.get(ColorSearchParams.Keys.NAME));
  }

  setName(name: string) {
    const copy = new ColorSearchParams(this);
    copy.set(ColorSearchParams.Keys.NAME, name);
    return copy;
  }
}
