/*
  Warnings:

  - A unique constraint covering the columns `[userId,instituteId]` on the table `user_history` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "institute_daily_view" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "institute_daily_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "institute_daily_view_instituteId_idx" ON "institute_daily_view"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "institute_daily_view_instituteId_date_key" ON "institute_daily_view"("instituteId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_history_userId_instituteId_key" ON "user_history"("userId", "instituteId");

-- AddForeignKey
ALTER TABLE "institute_daily_view" ADD CONSTRAINT "institute_daily_view_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
