import { showSnackbar, Snackbar } from "core/popovers/snackbar";
import * as React from "react";

export function NetworkStatus() {
  React.useEffect(() => {
    function onGoOnline() {
      // This snackbar has the highest priority.
      showSnackbar.clearWaitingQueue();
      showSnackbar.dismiss();
      showSnackbar.success(<Snackbar>En ligne</Snackbar>);
    }

    function onGoOffline() {
      // This snackbar has the highest priority.
      showSnackbar.clearWaitingQueue();
      showSnackbar.dismiss();
      showSnackbar.error(<Snackbar>Hors ligne</Snackbar>);
    }

    window.addEventListener("online", onGoOnline);
    window.addEventListener("offline", onGoOffline);

    return () => {
      window.removeEventListener("online", onGoOnline);
      window.removeEventListener("offline", onGoOffline);
    };
  }, []);

  return null;
}
