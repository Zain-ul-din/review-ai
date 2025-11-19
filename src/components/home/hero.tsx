// React and Next.js imports
import Image from "next/image";
import Link from "next/link";

// Third-party library imports
import Balancer from "react-wrap-balancer";
import { ArrowRight, Star } from "lucide-react";

// Local component imports
import { Section, Container } from "@/components/craft";
import { Button } from "../ui/button";
import { ROUTES } from "@/lib/constants";

const Hero = () => {
  return (
    <Section className="not-prose relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 via-background to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Button
            asChild
            className="mb-8 w-fit shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
            size={"sm"}
            variant={"outline"}
          >
            <Link className="not-prose" href={ROUTES.signUp}>
              <Star className="w-4 fill-yellow-400 text-yellow-400 mr-2" />
              Start Collecting Reviews
              <ArrowRight className="w-4 ml-2" />
            </Link>
          </Button>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up animation-delay-100">
            <Balancer>
              Effortless Reviews,{" "}
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Maximum Impact
              </span>
            </Balancer>
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-lg md:text-xl text-muted-foreground max-w-3xl animate-fade-in-up animation-delay-200">
            <Balancer>
              Boost your credibility with real customer feedback. Reviews
              Plethora makes it easy to collect and verify reviews with just a
              few clicks. Manage and export your reviews hassle-free—anytime,
              anywhere.
            </Balancer>
          </p>

          {/* Hero Image */}
          <div className="not-prose w-full max-w-5xl animate-fade-in-up animation-delay-300">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-muted/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />
              <Image
                className="w-full h-auto object-cover relative z-10"
                src={"/hero.png"}
                width={1920}
                height={1080}
                alt="hero image"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
