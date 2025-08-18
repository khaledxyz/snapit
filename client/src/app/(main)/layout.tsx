import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Fragment } from "react";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Fragment>
      <Header />
      <main>{children}</main>
      <Footer />
    </Fragment>
  );
}
