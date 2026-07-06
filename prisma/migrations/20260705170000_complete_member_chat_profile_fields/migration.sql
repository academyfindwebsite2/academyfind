-- Complete profile presentation fields.
ALTER TABLE "user" ADD COLUMN "coverImage" TEXT;

-- Per-institute visibility and messaging preferences.
ALTER TABLE "student_institute_record"
ADD COLUMN "allowMessaging" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "teacher_institute_record"
ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- Polling-based typing presence.
ALTER TABLE "conversation_participant"
ADD COLUMN "typingAt" TIMESTAMP(3);

-- Add the manager-only institute channel.
ALTER TYPE "ChannelType" ADD VALUE 'STAFF';

-- A channel type may only be provisioned once for an institute.
CREATE UNIQUE INDEX "conversation_instituteId_channelType_key"
ON "conversation"("instituteId", "channelType");
