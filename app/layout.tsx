import { cn } from "@/libs/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";

const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A Reddit clone built with Next.js and Typescript",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(`bg-white text-slate-900 antialiased`)}>
      <body
        className={cn(
          `min-h-screen pt-12 bg-slate-50 antialiased`,
          font.className
        )}
      >
        <Providers>
          {/* @ts-ignore-error*/}
          <Navbar />

          {authModal}

          <div className="container h-full max-w-7xl mx-auto pt-12">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
