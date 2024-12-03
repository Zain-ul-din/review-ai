import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Logo } from "../icons/logo";

export default function Header() {
  return (
    <header className="p-4 max-w-screen-lg items-center mx-auto border-b not-prose flex">
      <h1 className="text-xl text-foreground font-medium flex items-center gap-2">
        <Logo className="w-8 h-8" />
        Reviews Plethora
      </h1>
      <span className="ml-auto">
        <SignedIn>
          <UserButton />
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
