// React and Next.js imports
// import Link from "next/link";
import Image from "next/image";

// UI component imports
import { Section, Container } from "@/components/craft";
// import { Button } from "@/components/ui/button";

const HowItWorksSection = () => {
  return (
    <>
      <Section className="md:pb-0 pb-0 mb-12 sm:mb-14">
        <h2 className="text-center text-xl my-56 pb-12">How it Works?</h2>
        <Container className="grid items-stretch md:grid-cols-2 md:gap-12 border border-sky-400/30 bg-sky-300/30 rounded-lg">
          <div className="flex flex-col gap-6 py-8 sm:my-auto">
            <h2 className="!my-0">Launch a New Campaign</h2>
            <p className="font-light leading-[1.4] opacity-70">
              Start a new campaign and easily share the link with your audience
              to gather authentic reviews in no time.
            </p>
            {/* <div className="not-prose flex items-center gap-2">
            <Button className="w-fit" asChild>
            <Link href="#">Get Started</Link>
            </Button>
            <Button className="w-fit" variant="link" asChild>
            <Link href="#">Learn More {"->"}</Link>
            </Button>
            </div> */}
          </div>
          <div className="not-prose relative flex sm:h-96 overflow-hidden rounded-lg">
            <Image
              src={"/campaign-light.svg"}
              alt="placeholder"
              className="fill object-cover"
              width={500}
              height={500}
            />
          </div>
        </Container>
      </Section>

      {/* get reviews */}

      <Section className="md:pt-0 pt-0">
        <Container className="grid items-stretch md:grid-cols-2 md:gap-12 border border-green-400/30 bg-green-300/30 rounded-lg">
          <div className="not-prose relative flex h-96 overflow-hidden rounded-lg">
            <Image
              src={"/get-reviews-light.svg"}
              alt="placeholder"
              className="fill object-cover"
              width={500}
              height={500}
            />
          </div>
          <div className="flex flex-col gap-6 py-8 my-auto">
            <h2 className="!my-0">Collect Verified Reviews</h2>
            <p className="font-light leading-[1.4] opacity-70">
              We ensure your reviews are genuine by verifying users through
              Google or their email accounts.
            </p>
            {/* <div className="not-prose flex items-center gap-2">
            <Button className="w-fit" asChild>
              <Link href="#">Get Started</Link>
            </Button>
            <Button className="w-fit" variant="link" asChild>
              <Link href="#">Learn More {"->"}</Link>
            </Button>
          </div> */}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default HowItWorksSection;
