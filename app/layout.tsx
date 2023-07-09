import "./globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddit-Clone",
  description: "Reddit Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
