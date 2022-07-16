import { Outlet } from "@remix-run/react";
import { Footer } from "~/layout/footer";

export default function MainLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
