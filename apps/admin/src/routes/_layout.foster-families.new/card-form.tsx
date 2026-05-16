import { useFetcher } from "@remix-run/react"

import { Card } from "#i/core/layout/card.js"
import { useBackIfPossible } from "#i/core/navigation.js"
import { FosterFamilyForm } from "#i/foster-families/form.js"

import type { action } from "./action.server.js"

export function CardForm() {
  const fetcher = useFetcher<typeof action>()

  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo })

  return (
    <Card className="w-full md:max-w-60">
      <Card.Header>
        <Card.Title>Nouvelle famille d’accueil</Card.Title>
      </Card.Header>

      <Card.Content>
        <FosterFamilyForm fetcher={fetcher} />
      </Card.Content>
    </Card>
  )
}
