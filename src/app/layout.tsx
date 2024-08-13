import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <footer className="p-4 border-t text-center">
          <p>&copy; 2024 nohaArchive. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
