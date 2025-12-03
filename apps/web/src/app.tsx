import { Landing } from "@/components/landing";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/providers";

import { Footer } from "./components/footer";

export function App() {
  return (
    <Providers>
      <Navbar />
      <Landing />
      <Footer />
    </Providers>
  );
}
