-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('INSTITUTE', 'INDIVIDUAL');

-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "providerType" "ProviderType" NOT NULL DEFAULT 'INSTITUTE';
