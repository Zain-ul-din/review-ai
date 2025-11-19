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

      <Section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />

        <Container>
          <div className="relative rounded-3xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm p-12 md:p-16 shadow-xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl -z-10" />

            <div className="flex flex-col items-center gap-8">
              <Image
                width={600}
                height={73}
                src={"/cta-text.svg"}
                alt="if you like it, use it"
                className="object-cover mx-auto max-w-full md:w-[700px] opacity-90"
              />

              <p className="text-center text-lg text-muted-foreground max-w-2xl">
                Join thousands of businesses collecting authentic reviews and
                building trust with their customers
              </p>

              <Link href={ROUTES.signUp}>
                <TextureButton
                  variant="accent"
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
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
