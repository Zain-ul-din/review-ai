import { ROUTES } from "@/lib/constants";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="w-full h-[100svh] flex justify-center items-center">
      <SignUp forceRedirectUrl={ROUTES.dashboard} />;
    </main>
  );
}
