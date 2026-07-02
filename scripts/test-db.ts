import { prisma } from "../lib/prisma";

async function main() {
  const email = "test_user_random_49@gmail.com";
  try {
    // 1. Fetch OTP Verification code from verification table
    const verificationRecord = await prisma.verification.findFirst({
      where: {
        identifier: email,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Verification record for email:", verificationRecord);

    // 2. Set emailVerified: true for the user directly in database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
    console.log("Updated user in database to be verified:", updatedUser);

  } catch (error) {
    console.error("Database operation failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
