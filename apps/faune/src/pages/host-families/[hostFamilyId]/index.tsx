import { OperationResult, UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import {
  FaAngleRight,
  FaEnvelope,
  FaMapMarker,
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

const HostFamilyPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.hostFamilyId === "string",
    `The hostFamilyId path should be a string. Got '${typeof router.query
      .hostFamilyId}'`
  );

  const getHostFamily = useOperationQuery({
    name: "getHostFamily",
    params: { id: router.query.hostFamilyId },
  });

  const deleteHostFamily = useOperationMutation("deleteHostFamily", {
    onSuccess: (response, cache) => {
      cache.remove({
        name: "getHostFamily",
        params: { id: response.body.params.id },
      });

      cache.invalidate({ name: "getAllHostFamilies" });
      router.backIfPossible("..");
    },
  });

  if (getHostFamily.state === "error") {
    return <ErrorPage status={getHostFamily.status} />;
  }

  let content: React.ReactNode = null;

  if (getHostFamily.state === "success") {
    content = (
      <>
        {deleteHostFamily.state === "error" && (
          <Section>
            <Info variant="error" icon={<FaTimesCircle />}>
              {getHostFamily.result.name} n'a pas pu être supprimé.
            </Info>
          </Section>
        )}

        <ContactSection hostFamily={getHostFamily.result} />
        <HostedAnimalsSection hostFamily={getHostFamily.result} />

        <QuickActions icon={<FaPen />}>
          <ActionsSection
            hostFamily={getHostFamily.result}
            deleteHostFamily={deleteHostFamily}
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
    getHostFamily.state === "success" ? getHostFamily.result.name : null;

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

HostFamilyPage.authorisedGroups = [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER];

export default HostFamilyPage;

type HostFamilyProps = {
  hostFamily: OperationResult<"getHostFamily">;
};

function ContactSection({ hostFamily }: HostFamilyProps) {
  return (
    <SectionBox>
      <ul>
        <li>
          <LinkItem href={`tel:${hostFamily.phone}`}>
            <ItemIcon>
              <FaPhone />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.phone}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>

        <li>
          <LinkItem href={`mailto:${hostFamily.email}`}>
            <ItemIcon>
              <FaEnvelope />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.email}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>

        <li>
          <LinkItem
            shouldOpenInNewTarget
            href={`http://maps.google.com/?q=${encodeURIComponent(
              hostFamily.formattedAddress
            )}`}
          >
            <ItemIcon>
              <FaMapMarker />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.formattedAddress}</ItemMainText>
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

function HostedAnimalsSection({ hostFamily }: HostFamilyProps) {
  let content: React.ReactNode = null;

  if (hostFamily.hostedAnimals.length === 0) {
    content = <Info variant="info">Aucun animal en accueil.</Info>;
  } else {
    content = (
      <ul>
        {hostFamily.hostedAnimals.map((animal) => (
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
        {hostFamily.hostedAnimals.length > 0
          ? ` (${hostFamily.hostedAnimals.length})`
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
  hostFamily,
  deleteHostFamily,
}: HostFamilyProps & {
  deleteHostFamily: OperationMutationResponse<"deleteHostFamily">;
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
        <DeleteHostFamilyButton
          hostFamily={hostFamily}
          deleteHostFamily={deleteHostFamily}
        />
      </Section>
    </>
  );
}

function DeleteHostFamilyButton({
  hostFamily,
  deleteHostFamily,
}: HostFamilyProps & {
  deleteHostFamily: OperationMutationResponse<"deleteHostFamily">;
}) {
  const { onDismiss } = useModal();

  return (
    <ButtonItem
      onClick={() => {
        if (deleteHostFamily.state !== "loading") {
          const confirmationMessage = [
            `Êtes-vous sûr de vouloir supprimer ${hostFamily.name} ?`,
            "L'action est irréversible.",
          ].join("\n");

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            deleteHostFamily.mutate({ id: hostFamily.id });
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
