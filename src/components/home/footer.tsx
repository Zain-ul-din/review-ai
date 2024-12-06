// React and Next.js imports
import Link from "next/link";

// Third-party library imports
import Balancer from "react-wrap-balancer";

// UI component imports
import { Button } from "../ui/button";

// Icon imports
import {
  Github,
  // Twitter, Facebook
} from "lucide-react";

// Local component imports
import { Section, Container } from "../craft";
import { Logo } from "../icons/logo";
import { ROUTES } from "@/lib/constants";

// Asset imports

export default function Footer() {
  return (
    <footer>
      <Section>
        <Container className="grid gap-12 md:grid-cols-[1.5fr_0.5fr_0.5fr]">
          <div className="not-prose flex flex-col gap-2">
            <Link href="/">
              <h2 className="text-xl text-foreground font-medium flex items-center gap-2">
                <Logo className="w-8 h-8" />
                Reviews Plethora
              </h2>
            </Link>
            <p>
              <Balancer>
                Helping you get the feedback that matters, hassle-free.
              </Balancer>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h5>Website</h5>
            <Link href={ROUTES.signIn}>Sign in</Link>
            <Link href={ROUTES.signUp}>Sign up</Link>
            <Link href={ROUTES.dashboard}>Dashboard</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h5>Legal</h5>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            {/* <Link href="/cookie-policy">Cookie Policy</Link> */}
          </div>
        </Container>
        <Container className="not-prose flex flex-col justify-between gap-6 border-t md:flex-row md:items-center md:gap-2">
          <div className="flex gap-2">
            <Link href={"https://www.github.com/zain-ul-din"}>
              <Button variant="outline" size="icon" aria-label="GitHub">
                <Github />
              </Button>
            </Link>
            {/* <Button variant="outline" size="icon">
              <Twitter />
            </Button>
            <Button variant="outline" size="icon">
              <Facebook />
            </Button> */}
          </div>
          <p className="text-muted-foreground">
            © Reviews Plethora . All rights reserved. 2024-present.
          </p>
        </Container>
      </Section>
    </footer>
  );
}
