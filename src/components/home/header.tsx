import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Logo } from "../icons/logo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-lg mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Logo className="w-8 h-8 transition-transform hover:scale-110" />
          <h1 className="text-xl font-semibold text-foreground hidden sm:block">
            Reviews Plethora
          </h1>
        </Link>

        <nav className="ml-auto flex items-center gap-3">
          <SignedIn>
            <Link href={ROUTES.dashboard}>
              <Button size="sm" variant="ghost" className="gap-2">
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl={"/dashboard"}>
              <Button size="sm">Sign in</Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
