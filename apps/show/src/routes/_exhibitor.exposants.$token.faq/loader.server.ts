import { json } from "@remix-run/node";
import { QUESTIONS } from "./questions.server";

export async function loader() {
  return json({ questions: QUESTIONS });
}
