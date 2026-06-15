-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "admin_notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "referenceId" TEXT,
    "actionUrl" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_notification_isRead_idx" ON "admin_notification"("isRead");

-- CreateIndex
CREATE INDEX "admin_notification_type_idx" ON "admin_notification"("type");

-- CreateIndex
CREATE INDEX "admin_notification_userId_idx" ON "admin_notification"("userId");

-- AddForeignKey
ALTER TABLE "admin_notification" ADD CONSTRAINT "admin_notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
