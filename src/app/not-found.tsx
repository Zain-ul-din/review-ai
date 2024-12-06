import { TextureButton } from "@/components/ui/texture-button";
import { ROUTES } from "@/lib/constants";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center flex-col justify-center w-full h-[100svh] gap-4">
      <h1 className="text-3xl">404 - Page not found</h1>
      <p className="text-muted-foreground">
        Page you are looking for not exists or might be deleted.
      </p>
      <Link href={ROUTES.home}>
        <TextureButton variant="minimal">
          <HomeIcon className="w-4 h-4 mr-1" /> Go Home
        </TextureButton>
      </Link>
    </div>
  );
}
