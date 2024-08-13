"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Check if the user document already exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create a user document in Firestore if it doesn't exist
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
          role: "user",
        });
      }
      router.push("/"); // Redirect to home page after successful signup
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mt-4">
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
