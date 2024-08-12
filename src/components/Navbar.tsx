"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function Navbar() {
  const user = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">
        nohaArchive
      </Link>
      <div className="space-x-2">
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <Button onClick={handleLogout} variant="outline">
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
        {user && (
          <Button asChild variant="outline">
            <Link href="/submit">Submit Poem</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/browse">Browse Poems</Link>
        </Button>
      </div>
    </nav>
  );
}
