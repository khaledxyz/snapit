import { Landing } from "@/components/landing";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/providers";

export function App() {
  return (
    <Providers>
      <Navbar />
      <Landing />
    </Providers>
  );
}
