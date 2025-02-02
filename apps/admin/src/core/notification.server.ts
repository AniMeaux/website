import invariant from "tiny-invariant";

invariant(
  process.env.SHOW_NOTIFICATION_ENDPOINT,
  "SHOW_NOTIFICATION_ENDPOINT must be set",
);

const SHOW_NOTIFICATION_ENDPOINT = process.env.SHOW_NOTIFICATION_ENDPOINT;

invariant(process.env.APPLICATION_TOKEN, "APPLICATION_TOKEN must be set");

type ShowNotification =
  | { type: "application-status-updated"; applicationId: string }
  | { type: "documents-treated"; exhibitorId: string }
  | { type: "exhibitor-visible"; exhibitorId: string }
  | { type: "public-profile-treated"; exhibitorId: string }
  | { type: "stand-configuration-treated"; exhibitorId: string };

export async function notifyShowApp(notification: ShowNotification) {
  const response = await fetch(SHOW_NOTIFICATION_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.APPLICATION_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    // TODO: Capture error and don't throw.
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
