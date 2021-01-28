import {
  AnimalSpeciesLabelsPlural,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
  HostFamily,
  HostFamilyFormPayload,
  HousingTypeLabels,
  HOUSING_TYPES_ALPHABETICAL_ORDER,
  isAnimalSpeciesFertile,
  minimiseHostFamilyOwnAnimals,
  Trilean,
  TRILEAN_ORDER,
  VehicleTypeLabels,
} from "@animeaux/shared-entities";
import {
  Adornment,
  Button,
  Checkbox,
  CheckboxInput,
  Field,
  Form,
  FormProps,
  Input,
  IntegerInput,
  Label,
  Message,
  Placeholder,
  Placeholders,
  RequiredStar,
  Section,
  SectionTitle,
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
  Separator,
  Submit,
} from "@animeaux/ui-library";
import * as React from "react";
import {
  FaBaby,
  FaEnvelope,
  FaFacebook,
  FaGoogleDrive,
  FaMapMarker,
  FaPhone,
  FaTree,
  FaUser,
} from "react-icons/fa";
import { HousingTypeIcon } from "./housingTypeIcon";
import { VehicleTypeIcon } from "./vehicleTypeIcon";

export type HostFamilyFormErrors = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  housing?: string | null;
};

type HostFamilyFormProps = Omit<FormProps, "onSubmit"> & {
  hostFamily?: HostFamily;
  onSubmit: (payload: HostFamilyFormPayload) => any;
  errors?: HostFamilyFormErrors;
};

export function HostFamilyForm({
  hostFamily,
  onSubmit,
  errors,
  pending,
  ...rest
}: HostFamilyFormProps) {
  const [name, setName] = React.useState(hostFamily?.name ?? "");
  const [phone, setPhone] = React.useState(hostFamily?.phone ?? "");
  const [email, setEmail] = React.useState(hostFamily?.email ?? "");
  const [address, setAddress] = React.useState(hostFamily?.address ?? "");
  const [housing, setHousing] = React.useState(hostFamily?.housing ?? null);
  const [hasChild, setHasChild] = React.useState(hostFamily?.hasChild ?? false);
  const [hasGarden, setHasGarden] = React.useState(
    hostFamily?.hasGarden ?? false
  );
  const [hasVehicle, setHasVehicle] = React.useState(
    hostFamily?.hasVehicle ?? Trilean.UNKNOWN
  );
  const [linkToDrive, setLinkToDrive] = React.useState(
    hostFamily?.linkToDrive ?? ""
  );
  const [linkToFacebook, setLinkToFacebook] = React.useState(
    hostFamily?.linkToFacebook ?? ""
  );
  const [ownAnimals, setOwnAnimals] = React.useState(
    hostFamily?.ownAnimals ?? {}
  );

  React.useEffect(() => {
    if (hostFamily != null) {
      setName(hostFamily.name);
      setPhone(hostFamily.phone);
      setEmail(hostFamily.email);
      setAddress(hostFamily.address);
      setHousing(hostFamily.housing);
      setHasChild(hostFamily.hasChild);
      setHasGarden(hostFamily.hasGarden);
      setHasVehicle(hostFamily.hasVehicle);

      if (hostFamily.linkToDrive != null) {
        setLinkToDrive(hostFamily.linkToDrive);
      }

      if (hostFamily.linkToFacebook != null) {
        setLinkToFacebook(hostFamily.linkToFacebook);
      }

      setOwnAnimals(hostFamily.ownAnimals);
    }
  }, [hostFamily]);

  function handleSubmit() {
    onSubmit({
      name,
      phone,
      email,
      address,
      hasChild,
      hasGarden,
      hasVehicle,
      housing,
      linkToDrive,
      linkToFacebook,
      ownAnimals: minimiseHostFamilyOwnAnimals(ownAnimals),
    });
  }

  return (
    <Form {...rest} pending={pending} onSubmit={handleSubmit}>
      <Section>
        <SectionTitle>Contact</SectionTitle>

        <Field>
          <Label htmlFor="host-family-name">
            Nom <RequiredStar />
          </Label>
          <Input
            name="host-family-name"
            id="host-family-name"
            type="text"
            autoComplete="host-family-name"
            value={name}
            onChange={setName}
            errorMessage={errors?.name}
            leftAdornment={
              <Adornment>
                <FaUser />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-phone">
            Téléphone <RequiredStar />
          </Label>
          <Input
            name="host-family-phone"
            id="host-family-phone"
            type="tel"
            autoComplete="host-family-phone"
            placeholder="+33612345678"
            value={phone}
            onChange={setPhone}
            errorMessage={errors?.phone}
            leftAdornment={
              <Adornment>
                <FaPhone />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-email">
            Email <RequiredStar />
          </Label>
          <Input
            name="host-family-email"
            id="host-family-email"
            type="email"
            autoComplete="host-family-email"
            placeholder="jean@mail.fr"
            value={email}
            onChange={setEmail}
            errorMessage={errors?.email}
            leftAdornment={
              <Adornment>
                <FaEnvelope />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-address">
            Adresse <RequiredStar />
          </Label>
          <Input
            name="host-family-address"
            id="host-family-address"
            type="text"
            autoComplete="host-family-address"
            value={address}
            onChange={setAddress}
            errorMessage={errors?.address}
            leftAdornment={
              <Adornment>
                <FaMapMarker />
              </Adornment>
            }
          />
        </Field>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>
          Moyen de transport <RequiredStar />
        </SectionTitle>

        <Selectors>
          {TRILEAN_ORDER.map((value) => (
            <SelectorItem key={value} itemsCount={TRILEAN_ORDER.length}>
              <Selector>
                <SelectorRadio
                  checked={hasVehicle === value}
                  onChange={() => setHasVehicle(value)}
                  name="has-vehicle"
                />

                <SelectorIcon>
                  <VehicleTypeIcon hasVehicle={value} />
                </SelectorIcon>

                <SelectorLabel>{VehicleTypeLabels[value]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>
          Habitation <RequiredStar />
        </SectionTitle>

        {errors?.housing != null && (
          <Message type="error" className="mx-2 my-4">
            {errors?.housing}
          </Message>
        )}

        <Selectors>
          {HOUSING_TYPES_ALPHABETICAL_ORDER.map((housingType) => (
            <SelectorItem
              key={housingType}
              itemsCount={HOUSING_TYPES_ALPHABETICAL_ORDER.length}
            >
              <Selector>
                <SelectorRadio
                  checked={housing === housingType}
                  onChange={() => setHousing(housingType)}
                  name="housing"
                />

                <SelectorIcon>
                  <HousingTypeIcon housingType={housingType} />
                </SelectorIcon>

                <SelectorLabel>{HousingTypeLabels[housingType]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>

        <Field>
          <CheckboxInput>
            <Checkbox
              checked={hasGarden}
              onChange={setHasGarden}
              name="has-garden"
              className="mr-4"
            />

            <FaTree className="mr-2" />
            <span>Avec jardin</span>
          </CheckboxInput>
        </Field>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>Composition du foyer</SectionTitle>

        <Field>
          <CheckboxInput>
            <Checkbox
              checked={hasChild}
              onChange={setHasChild}
              name="has-child"
              className="mr-4"
            />

            <FaBaby className="mr-2" />
            <span>Enfants en bas âge</span>
          </CheckboxInput>
        </Field>

        {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => {
          const count = ownAnimals[species]?.count ?? 0;

          return (
            <Field key={species} row className="items-center">
              <IntegerInput
                value={count}
                onChange={(count) => {
                  setOwnAnimals((ownAnimals) => ({
                    ...ownAnimals,
                    [species]: isAnimalSpeciesFertile(species)
                      ? {
                          count,
                          areAllSterilized:
                            ownAnimals[species]?.areAllSterilized ?? false,
                        }
                      : { count },
                  }));
                }}
                className="flex-none"
              />

              <span className="mx-4 flex-1 min-w-0 truncate">
                {AnimalSpeciesLabelsPlural[species]}
              </span>

              {isAnimalSpeciesFertile(species) && (
                <CheckboxInput>
                  <Checkbox
                    checked={ownAnimals[species]?.areAllSterilized ?? false}
                    onChange={(checked) => {
                      setOwnAnimals((ownAnimals) => ({
                        ...ownAnimals,
                        [species]: {
                          count: ownAnimals[species]?.count ?? 0,
                          areAllSterilized: checked,
                        },
                      }));
                    }}
                    name={`are-${species}-sterilized`}
                    className="mr-2"
                  />

                  <span>Stérilisés</span>
                </CheckboxInput>
              )}
            </Field>
          );
        })}
      </Section>

      <Separator />

      <Section>
        <SectionTitle>Liens</SectionTitle>

        <Field>
          <Label htmlFor="link-to-drive">Dossier drive</Label>
          <Input
            name="link-to-drive"
            id="link-to-drive"
            type="text"
            autoComplete="link-to-drive"
            value={linkToDrive}
            onChange={setLinkToDrive}
            leftAdornment={
              <Adornment>
                <FaGoogleDrive />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="link-to-facebook">Page Facebook</Label>
          <Input
            name="link-to-facebook"
            id="link-to-facebook"
            type="text"
            autoComplete="link-to-facebook"
            value={linkToFacebook}
            onChange={setLinkToFacebook}
            leftAdornment={
              <Adornment>
                <FaFacebook />
              </Adornment>
            }
          />
        </Field>
      </Section>

      <Separator />

      <Section>
        <Submit>
          <Button
            type="submit"
            variant="primary"
            color="blue"
            disabled={pending}
          >
            {hostFamily == null ? "Créer" : "Modifier"}
          </Button>
        </Submit>
      </Section>
    </Form>
  );
}

export function HostFamilyFormPlaceholder() {
  return (
    <Form>
      <Section>
        <SectionTitle>
          <Placeholder preset="text" />
        </SectionTitle>

        <Placeholders count={4}>
          <Field>
            <Label>
              <Placeholder preset="label" />
            </Label>

            <Placeholder preset="input" />
          </Field>
        </Placeholders>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>
          <Placeholder preset="text" />
        </SectionTitle>

        <Selectors>
          <Placeholders count={TRILEAN_ORDER.length}>
            <SelectorItem itemsCount={TRILEAN_ORDER.length}>
              <Placeholder preset="selector" />
            </SelectorItem>
          </Placeholders>
        </Selectors>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>
          <Placeholder preset="text" />
        </SectionTitle>

        <Selectors>
          <Placeholders count={2}>
            <SelectorItem itemsCount={2}>
              <Placeholder preset="selector" />
            </SelectorItem>
          </Placeholders>
        </Selectors>

        <Field>
          <Placeholder preset="checkbox-input" />
        </Field>
      </Section>
    </Form>
  );
}
