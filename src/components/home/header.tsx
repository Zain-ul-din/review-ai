import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Logo } from "../icons/logo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function Header() {
  return (
    <header className="p-4 max-w-screen-lg items-center mx-auto border-b not-prose flex">
      <h1 className="text-xl text-foreground font-medium flex items-center gap-2">
        <Logo className="w-8 h-8" />
        Reviews Plethora
      </h1>
      <span className="ml-auto">
        <SignedIn>
          <div className="flex items-center gap-2">
            <Link href={ROUTES.dashboard}>
              <Button size={"sm"}>
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton forceRedirectUrl={"/dashboard"}>
            <Button>Sign in</Button>
          </SignInButton>
        </SignedOut>
      </span>
    </header>
  );
}
