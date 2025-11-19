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

      <Section className="not-prose relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />

        <Container>
          <div className="relative rounded-3xl border border-border bg-gradient-to-br from-muted/80 to-muted/40 p-12 md:p-16 shadow-lg">
            <div className="flex flex-col items-center gap-8">
              <Image
                width={600}
                height={73}
                src={"/cta-text.svg"}
                alt="if you like it, use it"
                className="object-cover mx-auto max-w-full md:w-[700px]"
              />

              <p className="text-center text-lg text-muted-foreground max-w-2xl">
                Join thousands of businesses collecting authentic reviews and
                building trust with their customers
              </p>

              <Link href={ROUTES.signUp}>
                <TextureButton
                  variant="accent"
                  className="text-lg px-10 py-7 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </TextureButton>
              </Link>

              <p className="text-sm text-muted-foreground">
                No credit card required • Free forever plan
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <FAQ />

      <Footer />
    </Main>
  );
}
