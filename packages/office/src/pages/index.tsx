import * as React from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { Adornment } from "../ui/formElements/adornment";
import { Input } from "../ui/formElements/input";
import {
  Header,
  HeaderAction,
  HeaderCurrentUserAvatar,
} from "../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../ui/layouts/page";

export default function AnimalListPage() {
  return (
    <PageLayout
      header={
        <Header>
          <HeaderAction>
            <FaFilter />
          </HeaderAction>

          <Input
            type="text"
            role="search"
            placeholder="Chercher"
            className="mx-2 flex-1"
            leftAdornment={
              <Adornment>
                <FaSearch />
              </Adornment>
            }
          />

          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Animaux" />

      <Main></Main>
    </PageLayout>
  );
}
