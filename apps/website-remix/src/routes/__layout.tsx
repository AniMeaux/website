import { Outlet } from "@remix-run/react";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
