import { StatusBar } from "@animeaux/ui-library";
import * as React from "react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(true);
  const [showReconnectionMessage, setShowReconnectionMessage] = React.useState(
    false
  );

  React.useEffect(() => {
    function onGoOnline() {
      setIsOnline(true);
      setShowReconnectionMessage(true);
    }

    function onGoOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", onGoOnline);
    window.addEventListener("offline", onGoOffline);

    return () => {
      window.removeEventListener("online", onGoOnline);
      window.removeEventListener("offline", onGoOffline);
    };
  }, []);

  React.useEffect(() => {
    if (showReconnectionMessage) {
      const timeout = setTimeout(() => setShowReconnectionMessage(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showReconnectionMessage]);

  if (!isOnline) {
    return <StatusBar type="error">Vous êtes hors ligne</StatusBar>;
  }

  if (showReconnectionMessage) {
    return <StatusBar type="success">En ligne</StatusBar>;
  }

  return null;
}
