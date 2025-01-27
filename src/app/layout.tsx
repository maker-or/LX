import "~/styles/globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import Navbar from "~/components/ui/Navbar";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "sphere",
  description: "sphere",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <SignedOut>
            <div className="scroll-behavior: auto; flex h-screen w-screen flex-col items-center justify-center bg-[#191A1A] text-[#0c0c0c]">
              <SignInButton />
          </div>
          </SignedOut>

          <SignedIn>
            {children}
            </SignedIn>


        </body>
      </html>
    </ClerkProvider>
  );
}
