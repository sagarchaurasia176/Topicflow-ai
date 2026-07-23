import { auth } from "@/auth/auth";
import { User } from "../userType";

export async function getUser(): Promise<User | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Map session user to custom User type
  return {
    id: session.user.id || "",
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || null,
    createdAt: new Date(), // NextAuth sessions don't persist original timestamps by default, fallback to now
    updatedAt: new Date(),
  };
}
