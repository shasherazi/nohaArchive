"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/poems", label: "All Poems" },
  { href: "/poems/add", label: "Add Poem" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between py-4 px-2">
        <Link href="/" className="text-xl font-bold">
          nohaArchive
        </Link>
        <div className="flex gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? "default" : "ghost"}
                className="text-sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
