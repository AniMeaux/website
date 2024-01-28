import { Action } from "#core/actions.tsx";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { SwitchInput } from "#core/formElements/switchInput.tsx";
import { Separator } from "#core/layout/separator.tsx";
import { Spinner } from "#core/loaders/spinner.tsx";
import { Icon } from "#generated/icon.tsx";
import { useScrapUrlFetcher } from "#routes/resources.scrap-url/hook";
import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import type { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export const ActionFormData = FormDataDelegate.create(
  zu.object({
    image: zu.union([
      zu.literal(""),
      zu.string().url("Veuillez entrer une URL valide"),
    ]),
    publicationDate: zu.coerce.date({
      required_error: "Veuillez entrer une date de publication",
      invalid_type_error: "Veuillez entrer une date de publication valide",
    }),
    publisherName: zu.string().trim().min(1, "Veuillez entrer un éditeur"),
    title: zu.string().trim().min(1, "Veuillez entrer un titre"),
    url: zu.string().url("Veuillez entrer une URL valide"),
  }),
);

type State = {
  image: string;
  isAutofill: boolean;
  publicationDate: string;
  publisherName: string;
  title: string;
  url: string;
};

const DEFAULT_STATE: State = {
  image: "",
  isAutofill: true,
  publicationDate: "",
  publisherName: "",
  title: "",
  url: "",
};

export function PressArticleForm({
  fetcher,
}: {
  fetcher: FetcherWithComponents<{
    errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const [state, setState] = useState(DEFAULT_STATE);

  const imageRef = useRef<HTMLInputElement>(null);
  const publicationDateRef = useRef<HTMLInputElement>(null);
  const publisherNameRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.url != null) {
        urlRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.title != null) {
        titleRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.publisherName != null) {
        publisherNameRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.publicationDate != null) {
        publicationDateRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.image != null) {
        imageRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  const scrapUrlFetcher = useScrapUrlFetcher({
    url: state.url,
    isEnabled: state.isAutofill,
  });

  const scrapUrlFetcherData = scrapUrlFetcher.data;
  useEffect(() => {
    setState((state) => {
      if (!state.isAutofill || scrapUrlFetcherData == null) {
        return state;
      }

      return {
        isAutofill: true,
        image: scrapUrlFetcherData.image ?? DEFAULT_STATE.image,
        publicationDate:
          scrapUrlFetcherData.publicationDate ?? DEFAULT_STATE.publicationDate,
        publisherName:
          scrapUrlFetcherData.publisherName ?? DEFAULT_STATE.publisherName,
        title: scrapUrlFetcherData.title ?? DEFAULT_STATE.title,
        url: state.url,
      };
    });
  }, [scrapUrlFetcherData]);

  return (
    <Form asChild hasHeader>
      <fetcher.Form method="POST" noValidate>
        <Form.Fields>
          <Form.Errors errors={fetcher.data?.errors?.formErrors} />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.url}>
              Lien de l’article <RequiredStar />
            </Form.Label>

            <Input
              ref={urlRef}
              id={ActionFormData.keys.url}
              name={ActionFormData.keys.url}
              type="url"
              value={state.url}
              onChange={(event) =>
                setState((state) => ({ ...state, url: event.target.value }))
              }
              hasError={fetcher.data?.errors?.fieldErrors.url != null}
              aria-describedby="url-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="globe" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.url != null ? (
              <Form.ErrorMessage id="url-error">
                {fetcher.data.errors.fieldErrors.url}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Separator />

          <Form.Field isInline>
            <Form.Label htmlFor="autofill">Remplissage automatique</Form.Label>
            {scrapUrlFetcher.state === "loading" ? <Spinner /> : null}

            <SwitchInput
              id="autofill"
              name="autofill"
              checked={state.isAutofill}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  isAutofill: event.target.checked,
                }))
              }
            />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.title}>
              Titre <RequiredStar />
            </Form.Label>

            <Input
              ref={titleRef}
              id={ActionFormData.keys.title}
              name={ActionFormData.keys.title}
              type="text"
              value={state.title}
              onChange={(event) =>
                setState((state) => ({ ...state, title: event.target.value }))
              }
              disabled={state.isAutofill}
              hasError={fetcher.data?.errors?.fieldErrors.title != null}
              aria-describedby="title-error"
            />

            {state.isAutofill ? (
              <input
                type="hidden"
                name={ActionFormData.keys.title}
                value={state.title}
              />
            ) : null}

            {fetcher.data?.errors?.fieldErrors.title != null ? (
              <Form.ErrorMessage id="title-error">
                {fetcher.data.errors.fieldErrors.title}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Row>
            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.publisherName}>
                Éditeur <RequiredStar />
              </Form.Label>

              <Input
                ref={publisherNameRef}
                id={ActionFormData.keys.publisherName}
                name={ActionFormData.keys.publisherName}
                type="text"
                value={state.publisherName}
                onChange={(event) =>
                  setState((state) => ({
                    ...state,
                    publisherName: event.target.value,
                  }))
                }
                disabled={state.isAutofill}
                hasError={
                  fetcher.data?.errors?.fieldErrors.publisherName != null
                }
                aria-describedby="publisherName-error"
                leftAdornment={
                  <Input.Adornment>
                    <Icon id="penNib" />
                  </Input.Adornment>
                }
              />

              {state.isAutofill ? (
                <input
                  type="hidden"
                  name={ActionFormData.keys.publisherName}
                  value={state.publisherName}
                />
              ) : null}

              {fetcher.data?.errors?.fieldErrors.publisherName != null ? (
                <Form.ErrorMessage id="publisherName-error">
                  {fetcher.data.errors.fieldErrors.publisherName}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.publicationDate}>
                Date de publication <RequiredStar />
              </Form.Label>

              <Input
                ref={publicationDateRef}
                id={ActionFormData.keys.publicationDate}
                name={ActionFormData.keys.publicationDate}
                type="date"
                value={state.publicationDate}
                onChange={(event) =>
                  setState((state) => ({
                    ...state,
                    publicationDate: event.target.value,
                  }))
                }
                disabled={state.isAutofill}
                hasError={
                  fetcher.data?.errors?.fieldErrors.publicationDate != null
                }
                aria-describedby="publicationDate-error"
                leftAdornment={
                  <Input.Adornment>
                    <Icon id="calendarDays" />
                  </Input.Adornment>
                }
              />

              {state.isAutofill ? (
                <input
                  type="hidden"
                  name={ActionFormData.keys.publicationDate}
                  value={state.publicationDate}
                />
              ) : null}

              {fetcher.data?.errors?.fieldErrors.publicationDate != null ? (
                <Form.ErrorMessage id="publicationDate-error">
                  {fetcher.data.errors.fieldErrors.publicationDate}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>
          </Form.Row>

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.image}>
              Lien de l’image
            </Form.Label>

            <Input
              ref={imageRef}
              id={ActionFormData.keys.image}
              name={ActionFormData.keys.image}
              type="url"
              value={state.image}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  image: event.target.value,
                }))
              }
              disabled={state.isAutofill}
              hasError={fetcher.data?.errors?.fieldErrors.image != null}
              aria-describedby="image-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="image" />
                </Input.Adornment>
              }
            />

            {state.isAutofill ? (
              <input
                type="hidden"
                name={ActionFormData.keys.image}
                value={state.image}
              />
            ) : null}

            {fetcher.data?.errors?.fieldErrors.image != null ? (
              <Form.ErrorMessage id="image-error">
                {fetcher.data.errors.fieldErrors.image}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>
        </Form.Fields>

        <Form.Action asChild>
          <Action type="submit">
            Ajouter
            <Action.Loader isLoading={fetcher.state !== "idle"} />
          </Action>
        </Form.Action>
      </fetcher.Form>
    </Form>
  );
}
