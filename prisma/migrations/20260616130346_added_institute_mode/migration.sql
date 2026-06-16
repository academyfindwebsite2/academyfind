-- CreateEnum
CREATE TYPE "InstituteMode" AS ENUM ('OFFLINE', 'ONLINE', 'HYBRID');

-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "mode" "InstituteMode" NOT NULL DEFAULT 'OFFLINE';
