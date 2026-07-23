"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { signInFormSchema } from "@/lib/auth-schema";

type SignInFormValues = z.infer<typeof signInFormSchema>;

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "john12@gmail.com",
      password: "John@123",
    },
  });

  const handleCredentialsSubmit = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Signed in successfully!");
        router.refresh();
        router.push("/Dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/Dashboard" });
    } catch (err) {
      console.error(err);
      toast.error("Google authentication failed");
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">Welcome Back</CardTitle>
        <CardDescription className="text-center text-gray-500">
          Enter your email to sign in to your TopicFlow account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleCredentialsSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In with Email"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors shadow-sm"
          disabled={googleLoading}
        >
          <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.46 14.99 1 12 1 7.35 1 3.39 3.66 1.4 7.55l3.87 3a7.02 7.02 0 0 1 6.73-5.51z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46a5.52 5.52 0 0 1-2.4 3.62l3.73 2.89c2.18-2.01 3.7-4.96 3.7-8.66z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.26a7.04 7.04 0 0 1 0-4.52l-3.87-3A11.94 11.94 0 0 0 0 12c0 1.9.44 3.7 1.4 5.26l3.87-3z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89a7.03 7.03 0 0 1-10.96-3.73l-3.87 3A11.96 11.96 0 0 0 12 23z"
            />
          </svg>
          {googleLoading ? "Connecting..." : "Sign In with Google"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <div className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
