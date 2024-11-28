import { Main } from "@/components/craft";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <Main>
      <header className="p-4 max-w-screen-lg mx-auto border-b not-prose">
        <h1 className="text-xl font-medium">Reviews Plethora</h1>
      </header>

      <Hero />

      <Footer />
    </Main>
  );
}
