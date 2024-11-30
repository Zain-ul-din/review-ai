import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="p-4 max-w-screen-lg items-center mx-auto border-b not-prose flex">
      <h1 className="text-xl text-foreground font-medium">Reviews Plethora</h1>
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
