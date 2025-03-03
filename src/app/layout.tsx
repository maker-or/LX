import "~/styles/globals.css";
import {
ClerkProvider,
SignInButton,
SignIn,
SignedIn,
SignedOut,
} from "@clerk/nextjs";

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
              <div className="scroll-behavior: auto; flex h-screen w-screen flex-col items-center justify-center bg-[#b1b1b1]">
                <SignIn routing="hash" />
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
