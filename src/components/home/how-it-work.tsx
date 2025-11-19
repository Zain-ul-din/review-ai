// React and Next.js imports
// import Link from "next/link";
import Image from "next/image";

// UI component imports
import { Section, Container } from "@/components/craft";
// import { Button } from "@/components/ui/button";

const HowItWorksSection = () => {
  return (
    <Section className="not-prose relative">
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
      <Container className="mb-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 rounded-2xl border border-sky-200 dark:border-sky-800/40 bg-gradient-to-br from-sky-50/80 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/20 p-8 md:p-12 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
              Launch a New Campaign
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Start a new campaign and easily share the link with your audience
              to gather authentic reviews in no time.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <Image
              src={"/campaign-light.svg"}
              alt="Launch campaign illustration"
              className="w-full h-auto"
              width={500}
              height={500}
            />
          </div>
        </div>
      </Container>

      {/* Feature 2: Collect Reviews */}
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 rounded-2xl border border-green-200 dark:border-green-800/40 bg-gradient-to-br from-green-50/80 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/20 p-8 md:p-12 shadow-sm">
          {/* Image first on desktop */}
          <div className="relative flex items-center justify-center order-2 md:order-1">
            <Image
              src={"/get-reviews-light.svg"}
              alt="Collect reviews illustration"
              className="w-full h-auto"
              width={500}
              height={500}
            />
          </div>

          <div className="flex flex-col gap-4 order-1 md:order-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
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
