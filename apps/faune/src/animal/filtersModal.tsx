import { AnimalSearchParams } from "~/animal/searchParams";
import { AnimalMultipleSpeciesInput } from "~/animal/species/input";
import { AnimalMultipleStatusInput } from "~/animal/status/input";
import { Button } from "~/core/actions/button";
import { useSearchParams } from "~/core/baseSearchParams";
import { Field, Fields } from "~/core/formElements/field";
import { Form } from "~/core/formElements/form";
import { Label } from "~/core/formElements/label";
import { ModalHeader, ModalHeaderTitle } from "~/core/popovers/modal";

export function AnimalFiltersModal() {
  const searchParams = useSearchParams(() => new AnimalSearchParams());

  return (
    <>
      <ModalHeader>
        <ModalHeaderTitle>Filtres</ModalHeaderTitle>

        <Button
          disabled={searchParams.getFilterCount() === 0}
          onClick={() => searchParams.deleteAllFilters()}
        >
          Tout effacer
        </Button>
      </ModalHeader>

      <Form>
        <Fields>
          <Field>
            <Label>Espèce</Label>

            <AnimalMultipleSpeciesInput
              value={searchParams.getSpecies()}
              onChange={(change) =>
                searchParams.setSpecies(change(searchParams.getSpecies()))
              }
            />
          </Field>

          <Field>
            <Label>Statut</Label>
            <AnimalMultipleStatusInput
              value={searchParams.getStatus()}
              onChange={(change) =>
                searchParams.setStatus(change(searchParams.getStatus()))
              }
            />
          </Field>
        </Fields>
      </Form>
    </>
  );
}
