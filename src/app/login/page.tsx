"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/"); // Redirect to home page after successful login
    } catch (error) {
      setError("Failed to log in with Google. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          Continue with Google
        </Button>
      </div>
      <p className="mt-4">
        Don&apos;t have an account?
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
