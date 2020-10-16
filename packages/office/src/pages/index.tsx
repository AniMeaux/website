import { Link } from "@animeaux/shared";
import * as React from "react";
import { FaFilter, FaPlus, FaSearch } from "react-icons/fa";
import { useCurrentUser } from "../core/user";
import { Adornment } from "../ui/formElements/adornment";
import { Input } from "../ui/formElements/input";
import { Header, HeaderAction } from "../ui/layouts/header";
import { PrimaryAction } from "../ui/primaryAction";
import { UserAvatar } from "../ui/userAvatar";

export default function AnimalListPage() {
  const { currentUser } = useCurrentUser();

  return (
    <>
      <Header className="border-b">
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

        <Link href="/profile" className="a11y-focus flex-none">
          <UserAvatar user={currentUser} />
        </Link>
      </Header>

      <main className="pt-16"></main>

      <PrimaryAction>
        <FaPlus />
      </PrimaryAction>
    </>
  );
}
