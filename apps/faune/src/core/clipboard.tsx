import * as React from "react";
import { showSnackbar, Snackbar } from "ui/popovers/snackbar";

export async function copyToClipboard(data: string) {
  await navigator.clipboard.writeText(data);
  showSnackbar.success(<Snackbar>Copié</Snackbar>);
}
