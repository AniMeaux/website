import * as React from "react";
import { showSnackbar, Snackbar } from "../popovers";

export async function copyToClipboard(data: string) {
  await navigator.clipboard.writeText(data);
  showSnackbar.success(<Snackbar>Copié</Snackbar>);
}
