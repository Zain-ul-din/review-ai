// React and Next.js imports
// import Link from "next/link";
import Image from "next/image";

// UI component imports
import { Section, Container } from "@/components/craft";
// import { Button } from "@/components/ui/button";

const HowItWorksSection = () => {
  return (
    <Section className="relative">
      {/* Section Header */}
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it Works?</h2>
          <p className="text-muted-foreground text-lg">
            Simple steps to start collecting authentic reviews
          </p>
        </div>
      </Container>

      {/* Feature 1: Launch Campaign */}
      <Container className="mb-24">
        <div className="group relative grid items-center gap-8 md:grid-cols-2 md:gap-12 rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-50/50 to-blue-50/30 dark:from-sky-950/20 dark:to-blue-950/10 p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex flex-col gap-6 z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-2">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold !my-0">
              Launch a New Campaign
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Start a new campaign and easily share the link with your audience
              to gather authentic reviews in no time.
            </p>
          </div>

          <div className="not-prose relative flex items-center justify-center z-10">
            <div className="relative w-full max-w-md transform group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-blue-400/20 rounded-xl blur-2xl" />
              <Image
                src={"/campaign-light.svg"}
                alt="Launch campaign illustration"
                className="relative w-full h-auto drop-shadow-2xl"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Feature 2: Collect Reviews */}
      <Container>
        <div className="group relative grid items-center gap-8 md:grid-cols-2 md:gap-12 rounded-2xl border border-green-400/20 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Image first on desktop */}
          <div className="not-prose relative flex items-center justify-center z-10 order-2 md:order-1">
            <div className="relative w-full max-w-md transform group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 rounded-xl blur-2xl" />
              <Image
                src={"/get-reviews-light.svg"}
                alt="Collect reviews illustration"
                className="relative w-full h-auto drop-shadow-2xl"
                width={500}
                height={500}
              />
            </div>
          </div>

          <div className="relative flex flex-col gap-6 z-10 order-1 md:order-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 mb-2">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold !my-0">
              Collect Verified Reviews
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We ensure your reviews are genuine by verifying users through
              Google or their email accounts.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HowItWorksSection;
