import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { formSchema } from "@/lib/auth-schema";
import { rateLimit } from "@/lib/rate-limiter";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limitResult = rateLimit(ip);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again in 1 minute." },
        { 
          status: 429, 
          headers: {
            "Retry-After": String(limitResult.reset),
          }
        }
      );
    }

    // 2. Parse and Validate Body
    const body = await req.json();
    const parsedData = formSchema.safeParse(body);
    
    if (!parsedData.success) {
      const errorMsg = parsedData.error.issues.map((err) => err.message).join(", ");
      return NextResponse.json(
        { error: errorMsg || "Invalid registration inputs." },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedData.data;
    const normalizedEmail = email.toLowerCase();

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email address." },
        { status: 400 }
      );
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create the user record
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        provider: "credentials", // Set credentials provider
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration. Please try again later." },
      { status: 500 }
    );
  }
}
