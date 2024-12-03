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
    <Section>
      <Container>
        <div>
          <Button
            asChild
            className="mb-6 w-fit"
            size={"sm"}
            variant={"outline"}
          >
            <Link className="not-prose" href={ROUTES.signUp}>
              <Star className="w-4 fill-yellow-400  text-yellow-400" /> Start
              Collecting Reviews <ArrowRight className="w-4" />
            </Link>
          </Button>
          <h1>
            <Balancer>Effortless Reviews, Maximum Impact.</Balancer>
          </h1>
          <h3 className="text-muted-foreground">
            <Balancer>
              Boost your credibility with real customer feedback. Reviews
              Plethora makes it easy to collect and verify reviews with just a
              few clicks. Manage and export your reviews hassle-free—anytime,
              anywhere.
            </Balancer>
          </h3>
          <div className="not-prose my-8 h-96 w-full overflow-hidden rounded-lg  md:h-[480px] md:rounded-xl">
            <Image
              className="h-full w-full object-cover object-bottom"
              src={"/hero.png"}
              width={1920}
              height={1080}
              alt="hero image"
              priority
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
