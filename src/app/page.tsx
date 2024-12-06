import { Container, Main, Section } from "@/components/craft";
import FAQ from "@/components/home/faq";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import HowItWorksSection from "@/components/home/how-it-work";
import { TextureButton } from "@/components/ui/texture-button";
import { ROUTES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Main>
      <Header />

      <Hero />

      <HowItWorksSection />

      <Section>
        <Container>
          <div>
            <Image
              width={600}
              height={73}
              src={"/cta-text.svg"}
              alt="if you like it, use it"
              className="object-cover mx-auto max-w-full md:w-[700px]"
            />
            <div className="flex">
              <Link className="mx-auto" href={ROUTES.signUp}>
                <TextureButton variant="accent">
                  Get Started for Free
                  <ArrowRight className="w-4 h-4" />
                </TextureButton>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <FAQ />

      <Footer />
    </Main>
  );
}
