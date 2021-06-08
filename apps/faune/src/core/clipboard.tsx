import { showSnackbar, Snackbar } from "popovers/snackbar";
import * as React from "react";

export async function copyToClipboard(data: string) {
  await navigator.clipboard.writeText(data);
  showSnackbar.success(<Snackbar>Copié</Snackbar>);
}
