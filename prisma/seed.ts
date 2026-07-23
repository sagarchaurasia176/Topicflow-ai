import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Create Guest user
  const guestEmail = "guest@gmail.com"; // better-auth converts to lowercase
  const guestPassword = "Guest@gmail.com";

  // Check if guest already exists
  const existingGuest = await prisma.user.findUnique({
    where: { email: guestEmail },
  });

  if (existingGuest) {
    console.log("✅ Guest user already exists");
    console.log(`   Email: ${guestEmail}`);
    console.log(`   Password: ${guestPassword}`);
  } else {
    // Create guest user directly in database
    try {
      const hashedPassword = await bcrypt.hash(guestPassword, 10);
      const response = await prisma.user.create({
        data: {
          email: guestEmail,
          password: hashedPassword,
          name: "Guest User",
          provider: "credentials",
        },
      });

      console.log("✅ Guest user created successfully");
      console.log(`   Email: ${guestEmail}`);
      console.log(`   Password: ${guestPassword}`);
      console.log(`   User ID: ${response.id}`);
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        console.log("✅ Guest user already exists");
      } else {
        throw error;
      }
    }
  }

  // Create john12@gmail.com user
  const johnEmail = "john12@gmail.com";
  const johnPassword = "John@123";

  // Check if john already exists
  const existingJohn = await prisma.user.findUnique({
    where: { email: johnEmail },
  });

  if (existingJohn) {
    console.log("✅ John user already exists");
    console.log(`   Email: ${johnEmail}`);
    console.log(`   Password: ${johnPassword}`);
  } else {
    try {
      const hashedPassword = await bcrypt.hash(johnPassword, 10);
      const response = await prisma.user.create({
        data: {
          email: johnEmail,
          password: hashedPassword,
          name: "John Doe",
          provider: "credentials",
        },
      });

      console.log("✅ John user created successfully");
      console.log(`   Email: ${johnEmail}`);
      console.log(`   Password: ${johnPassword}`);
      console.log(`   User ID: ${response.id}`);
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        console.log("✅ John user already exists");
      } else {
        throw error;
      }
    }
  }

  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
