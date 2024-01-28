import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";

export const ActionFormData = FormDataDelegate.create(
  zu.object({
    isSideBarCollapsed: zu.checkbox(),
  }),
);
