"use client";
import { useState } from "react";
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

// Zod validation schema for registration
const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .max(50),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" })
    // Simple password strength check: requires at least one digit or special character
    .refine((val) => /[0-9!@#$%^&*]/.test(val), {
      message: "Password must contain at least one number or special character",
    }),
  confirmPassword: z.string().min(1, { message: "Password confirmation is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">Create an Account</CardTitle>
        <CardDescription className="text-center text-gray-500">
          Enter your details to create a new TopicFlow account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              {...register("name")}
              className={`border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
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
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md mt-2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <div className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
