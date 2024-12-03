import { ROUTES } from "@/lib/constants";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="w-full h-[100svh] flex justify-center items-center">
      <SignIn forceRedirectUrl={ROUTES.dashboard} />
    </main>
  );
}
