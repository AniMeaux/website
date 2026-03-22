import { json } from "@remix-run/node"

import { QUESTIONS } from "./questions.server.js"

export async function loader() {
  return json({ questions: QUESTIONS })
}
