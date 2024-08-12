"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Menu } from "lucide-react";

export function Navbar() {
  const user = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">
        nohaArchive
      </Link>
      <div className="relative">
        <Button
          onClick={toggleMenu}
          variant="outline"
          className="flex items-center"
        >
          <Menu className="h-4 w-4" />
        </Button>
        {isOpen && (
          <div className="absolute whitespace-nowrap right-0 mt-2 bg-white rounded-md shadow-lg py-1 z-10">
            {user && (user.role === "admin" || user.role === "moderator") && (
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Admin Dashboard
              </Link>
            )}
            {user && (
              <Link
                href="/submit"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Submit Poem
              </Link>
            )}
            <Link
              href="/browse"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Browse Poems
            </Link>
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-700">
                  Welcome, {user.email}
                </div>
                <div className="px-4 py-2">
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className=" px-4 py-2 text-sm"
                  >
                    Log Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
