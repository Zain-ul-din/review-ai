import type { Metadata } from "next";
import { Playfair, Lora } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  // SignedIn,
  // SignedOut,
  // SignInButton
  // UserButton
} from "@clerk/nextjs";

const loraFont = Lora({
  variable: "--loraFont",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairFont = Playfair({
  variable: "--playfairFont",
  subsets: ["latin-ext"],
  weight: ["300", "400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Reviews Plethora – Simplify Customer Feedback Collection",
  description:
    "Easily collect, verify, and manage customer reviews with Reviews Plethora. Start your campaigns, share links, and gather high-quality, authentic reviews in no time.",
  openGraph: {
    title: "Reviews Plethora",
    description: "Get happy reviews",
    images: [{ url: "/social-card.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${playfairFont.variable} ${loraFont.variable} antialiased`}
        >
          {/* <SignedOut>
            <SignInButton forceRedirectUrl={"/dashboard"} />
          </SignedOut> */}
          {/* <SignedIn>
            <UserButton />
          </SignedIn> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
