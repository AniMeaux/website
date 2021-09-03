import { showSnackbar, Snackbar } from "core/popovers/snackbar";

export async function copyToClipboard(data: string) {
  await navigator.clipboard.writeText(data);
  showSnackbar.success(<Snackbar>Copié</Snackbar>);
}
