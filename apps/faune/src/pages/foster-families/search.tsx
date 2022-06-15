import { UserGroup } from "@animeaux/shared";
import { useRef } from "react";
import { useSearchParams } from "~/core/baseSearchParams";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
import {
  QSearchParams,
  SearchParamsInput,
} from "~/core/formElements/searchParamsInput";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section, SectionTitle } from "~/core/layouts/section";
import { usePageScrollRestoration } from "~/core/layouts/usePageScroll";
import { Placeholders } from "~/core/loaders/placeholder";
import { useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { PageComponent } from "~/core/types";
import {
  FosterFamilyItemPlaceholder,
  FosterFamilyLinkItem,
} from "~/fosterFamily/items";

const TITLE = "Chercher une famille d'accueil";

const SearchFosterFamilyPage: PageComponent = () => {
  usePageScrollRestoration();

  const searchInputElement = useRef<HTMLInputElement>(null!);

  const searchParams = useSearchParams(() => new QSearchParams());
  const searchFosterFamilies = useOperationQuery({
    name: "searchFosterFamilies",
    params: { search: searchParams.getQ() },
  });

  if (searchFosterFamilies.state === "error") {
    return <ErrorPage status={searchFosterFamilies.status} />;
  }

  let sectionTitle: React.ReactNode;
  let content: React.ReactNode;

  if (searchFosterFamilies.state === "success") {
    if (searchFosterFamilies.result.length === 0) {
      content = <EmptyMessage>Aucune famille d'accueil trouvée</EmptyMessage>;
    } else {
      content = (
        <ul>
          {searchFosterFamilies.result.map((fosterFamily) => (
            <li key={fosterFamily.id}>
              <FosterFamilyLinkItem
                fosterFamily={fosterFamily}
                href={`../${fosterFamily.id}`}
              />
            </li>
          ))}
        </ul>
      );

      sectionTitle = (
        <SectionTitle>
          {searchFosterFamilies.result.length}{" "}
          {searchFosterFamilies.result.length > 1 ? "familles" : "famille"}{" "}
          d'accueil
        </SectionTitle>
      );
    }
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <FosterFamilyItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderBackLink />

        <SearchParamsInput
          placeholder="Chercher une famille d'accueil"
          ref={searchInputElement}
        />
      </Header>

      <Main>
        <Section>
          {sectionTitle}
          {content}
        </Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

SearchFosterFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default SearchFosterFamilyPage;
