/*
  Warnings:

  - You are about to drop the column `allowDMs` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `allowDMs` on the `teacher_profile` table. All the data in the column will be lost.
  - You are about to drop the column `displayname` on the `teacher_profile` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `teacher_profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `teacher_profile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "teacher_profile" DROP CONSTRAINT "teacher_profile_userId_fkey";

-- AlterTable
ALTER TABLE "student_profile" DROP COLUMN "allowDMs";

-- AlterTable
ALTER TABLE "teacher_profile" DROP COLUMN "allowDMs",
DROP COLUMN "displayname",
DROP COLUMN "imageUrl",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "allowDms" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "telegramUrl" TEXT,
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "whatsappUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "teacher_profile" ADD CONSTRAINT "teacher_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
