import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nohaArchive",
  description: "Preserving old folk poetry, with a focus on Urdu poetry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">nohaArchive</h1>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="p-4 border-t text-center">
          <p>&copy; 2024 nohaArchive. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}