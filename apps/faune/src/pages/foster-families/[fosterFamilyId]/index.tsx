import { OperationResult, UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import {
  FaAngleRight,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPen,
  FaPhone,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { QuickActions } from "~/core/actions/quickAction";
import { Avatar, AvatarPlaceholder } from "~/core/dataDisplay/avatar";
import { AvatarImage } from "~/core/dataDisplay/image";
import { Info } from "~/core/dataDisplay/info";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section, SectionBox, SectionTitle } from "~/core/layouts/section";
import { Separator } from "~/core/layouts/separator";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import {
  OperationMutationResponse,
  useOperationMutation,
  useOperationQuery,
} from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useModal } from "~/core/popovers/modal";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";

const FosterFamilyPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.fosterFamilyId === "string",
    `The fosterFamilyId path should be a string. Got '${typeof router.query
      .fosterFamilyId}'`
  );

  const getFosterFamily = useOperationQuery({
    name: "getFosterFamily",
    params: { id: router.query.fosterFamilyId },
  });

  const deleteFosterFamily = useOperationMutation("deleteFosterFamily", {
    onSuccess: (response, cache) => {
      cache.remove({
        name: "getFosterFamily",
        params: { id: response.body.params.id },
      });

      cache.invalidate({ name: "getAllFosterFamilies" });
      router.backIfPossible("..");
    },
  });

  if (getFosterFamily.state === "error") {
    return <ErrorPage status={getFosterFamily.status} />;
  }

  let content: React.ReactNode = null;

  if (getFosterFamily.state === "success") {
    content = (
      <>
        {deleteFosterFamily.state === "error" && (
          <Section>
            <Info variant="error" icon={<FaTimesCircle />}>
              {getFosterFamily.result.name} n'a pas pu être supprimé.
            </Info>
          </Section>
        )}

        <ContactSection fosterFamily={getFosterFamily.result} />
        <HostedAnimalsSection fosterFamily={getFosterFamily.result} />

        <QuickActions icon={<FaPen />}>
          <ActionsSection
            fosterFamily={getFosterFamily.result}
            deleteFosterFamily={deleteFosterFamily}
          />
        </QuickActions>
      </>
    );
  } else {
    content = (
      <>
        <ContactPlaceholderSection />
        <HostedAnimalsPlaceholderSection />
      </>
    );
  }

  const name =
    getFosterFamily.state === "success" ? getFosterFamily.result.name : null;

  return (
    <ApplicationLayout>
      <PageTitle title={name} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>{name ?? <Placeholder $preset="text" />}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

FosterFamilyPage.authorisedGroups = [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER];

export default FosterFamilyPage;

type FosterFamilyProps = {
  fosterFamily: OperationResult<"getFosterFamily">;
};

function ContactSection({ fosterFamily }: FosterFamilyProps) {
  return (
    <SectionBox>
      <ul>
        <li>
          <LinkItem href={`tel:${fosterFamily.phone}`}>
            <ItemIcon>
              <FaPhone />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{fosterFamily.phone}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>

        <li>
          <LinkItem href={`mailto:${fosterFamily.email}`}>
            <ItemIcon>
              <FaEnvelope />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{fosterFamily.email}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>

        <li>
          <LinkItem
            shouldOpenInNewTarget
            href={`http://maps.google.com/?q=${encodeURIComponent(
              fosterFamily.formattedAddress
            )}`}
          >
            <ItemIcon>
              <FaMapMarkerAlt />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{fosterFamily.formattedAddress}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>
      </ul>
    </SectionBox>
  );
}

function ContactPlaceholderSection() {
  return (
    <SectionBox>
      <ul>
        <Placeholders count={3}>
          <li>
            <Item>
              <ItemIcon>
                <Placeholder $preset="icon" />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  <Placeholder $preset="label" />
                </ItemMainText>
              </ItemContent>
            </Item>
          </li>
        </Placeholders>
      </ul>
    </SectionBox>
  );
}

function HostedAnimalsSection({ fosterFamily }: FosterFamilyProps) {
  let content: React.ReactNode = null;

  if (fosterFamily.hostedAnimals.length === 0) {
    content = <Info variant="info">Aucun animal en accueil.</Info>;
  } else {
    content = (
      <ul>
        {fosterFamily.hostedAnimals.map((animal) => (
          <li key={animal.id}>
            <LinkItem href={`/animals/${animal.id}`}>
              <ItemIcon>
                <Avatar>
                  <AvatarImage image={animal.avatarId} alt={animal.name} />
                </Avatar>
              </ItemIcon>

              <ItemContent>
                <ItemMainText>{animal.name}</ItemMainText>
              </ItemContent>
            </LinkItem>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Section>
      <SectionTitle>
        En accueil
        {fosterFamily.hostedAnimals.length > 0
          ? ` (${fosterFamily.hostedAnimals.length})`
          : null}
      </SectionTitle>
      {content}
    </Section>
  );
}

function HostedAnimalsPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder $preset="label" />
      </SectionTitle>

      <ul>
        <Placeholders count={1}>
          <li>
            <Item>
              <ItemIcon>
                <AvatarPlaceholder />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  <Placeholder $preset="label" />
                </ItemMainText>
              </ItemContent>
            </Item>
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

function ActionsSection({
  fosterFamily,
  deleteFosterFamily,
}: FosterFamilyProps & {
  deleteFosterFamily: OperationMutationResponse<"deleteFosterFamily">;
}) {
  const { onDismiss } = useModal();

  return (
    <>
      <Section>
        <LinkItem href="./edit" onClick={onDismiss}>
          <ItemIcon>
            <FaPen />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>
      </Section>

      <Separator />

      <Section>
        <DeleteFosterFamilyButton
          fosterFamily={fosterFamily}
          deleteFosterFamily={deleteFosterFamily}
        />
      </Section>
    </>
  );
}

function DeleteFosterFamilyButton({
  fosterFamily,
  deleteFosterFamily,
}: FosterFamilyProps & {
  deleteFosterFamily: OperationMutationResponse<"deleteFosterFamily">;
}) {
  const { onDismiss } = useModal();

  return (
    <ButtonItem
      onClick={() => {
        if (deleteFosterFamily.state !== "loading") {
          const confirmationMessage = [
            `Êtes-vous sûr de vouloir supprimer ${fosterFamily.name} ?`,
            "L'action est irréversible.",
          ].join("\n");

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            deleteFosterFamily.mutate({ id: fosterFamily.id });
          }
        }
      }}
      color="red"
    >
      <ItemIcon>
        <FaTrash />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>Supprimer</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
