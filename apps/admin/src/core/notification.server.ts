type ShowNotification =
  | { type: "application-status-updated"; applicationId: string }
  | { type: "description-treated"; exhibitorId: string }
  | { type: "documents-treated"; exhibitorId: string }
  | { type: "dogs-configuration-treated"; exhibitorId: string }
  | { type: "exhibitor-visible"; exhibitorId: string }
  | { type: "invoice-paid"; exhibitorId: string; invoiceId: string }
  | { type: "new-invoice"; exhibitorId: string }
  | { type: "on-stand-animations-treated"; exhibitorId: string }
  | { type: "perks-treated"; exhibitorId: string }
  | { type: "public-profile-treated"; exhibitorId: string }
  | { type: "stand-configuration-treated"; exhibitorId: string };

export async function notifyShowApp(notification: ShowNotification) {
  const response = await fetch(process.env.SHOW_NOTIFICATION_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.APPLICATION_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
