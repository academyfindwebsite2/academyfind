-- CreateEnum
CREATE TYPE "LifeCoachRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'RESOLVED');

-- CreateTable
CREATE TABLE "LifeCoachRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "status" "LifeCoachRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LifeCoachRequest_pkey" PRIMARY KEY ("id")
);
