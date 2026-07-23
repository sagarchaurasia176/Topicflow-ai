import { signIn } from "@/auth/auth";

// Handle - google SignIn | action
export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { redirectTo: "/Dashboard" });
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};