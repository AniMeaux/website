import { useLoaderData } from "@remix-run/react"

import { ARTICLE_COMPONENTS, Markdown } from "#i/core/data-display/markdown.js"
import { Card } from "#i/core/layout/card.js"

import type { loader } from "./loader.server.js"

export function CardSituationRefusalMessage() {
  const { application } = useLoaderData<typeof loader>()

  if (application.refusalMessage == null) {
    return null
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Message de refus</Card.Title>
      </Card.Header>

      <Card.Content>
        <div>
          <Markdown components={ARTICLE_COMPONENTS}>
            {application.refusalMessage}
          </Markdown>
        </div>
      </Card.Content>
    </Card>
  )
}
