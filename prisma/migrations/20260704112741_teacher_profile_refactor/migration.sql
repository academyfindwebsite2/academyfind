/*
  Warnings:

  - You are about to drop the column `ageGroupMax` on the `institute_batch` table. All the data in the column will be lost.
  - You are about to drop the column `ageGroupMin` on the `institute_batch` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `teacher_profile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `teacher_profile` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `teacher_profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `institute_batch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `teacher_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InstituteMemberRole" AS ENUM ('STUDENT', 'TEACHER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'ALUMNI', 'REMOVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'INSTITUTE', 'BATCH', 'GROUP', 'AI');

-- CreateEnum
CREATE TYPE "ConversationVisibility" AS ENUM ('PRIVATE', 'INSTITUTE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('GENERAL', 'STUDENTS', 'TEACHERS', 'ANNOUNCEMENTS', 'BATCH', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'FILE', 'AUDIO', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ChatReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MESSAGE', 'MENTION', 'REACTION', 'NOTICE', 'REVIEW', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ConversationRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "teacher_profile" DROP CONSTRAINT "teacher_profile_instituteId_fkey";

-- DropIndex
DROP INDEX "teacher_profile_instituteId_idx";

-- AlterTable
ALTER TABLE "institute_batch" DROP COLUMN "ageGroupMax",
DROP COLUMN "ageGroupMin",
ADD COLUMN     "academicYear" TEXT,
ADD COLUMN     "allowStudentMessaging" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "courseName" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "teacher_profile" DROP COLUMN "instituteId",
DROP COLUMN "name",
DROP COLUMN "subject",
ADD COLUMN     "allowDMs" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayname" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "student_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "targetExam" TEXT,
    "currentClass" TEXT,
    "allowDMs" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "role" "InstituteMemberRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_institute_record" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "courseName" TEXT,
    "batchYear" INTEGER,
    "passoutYear" INTEGER,
    "rollNumber" TEXT,
    "bio" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_institute_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_institute_record" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "designation" TEXT,
    "department" TEXT,
    "teachingSubjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "joinedOn" TIMESTAMP(3),
    "bio" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_institute_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" TEXT NOT NULL,
    "type" "ConversationType" NOT NULL,
    "dmKey" TEXT,
    "instituteId" TEXT,
    "batchId" TEXT,
    "channelType" "ChannelType",
    "title" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "createdById" TEXT,
    "visibility" "ConversationVisibility" NOT NULL DEFAULT 'PRIVATE',
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "lastMessageId" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3),
    "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "lastReadMessageId" TEXT,
    "lastReadAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "role" "ConversationRole" NOT NULL DEFAULT 'MEMBER',
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "notificationsMuted" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "conversation_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT,
    "replyToId" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "editedById" TEXT,
    "deletedById" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "senderRoleSnapshot" "InstituteMemberRole",
    "searchText" TEXT,
    "senderNameSnapshot" TEXT,
    "senderAvatarSnapshot" TEXT,
    "senderProfileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "thumbnailUrl" TEXT,
    "storageProvider" TEXT,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reaction" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_read" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_read_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_report" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "ChatReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "allowDirectMessages" BOOLEAN NOT NULL DEFAULT true,
    "allowMessageRequests" BOOLEAN NOT NULL DEFAULT true,
    "showOnlineStatus" BOOLEAN NOT NULL DEFAULT true,
    "showLastSeen" BOOLEAN NOT NULL DEFAULT true,
    "readReceiptsEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "chat_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "entityId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_block" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_student" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "studentRecordId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "batch_student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_teacher" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "teacherRecordId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batch_teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_profile_userId_key" ON "student_profile"("userId");

-- CreateIndex
CREATE INDEX "institute_membership_instituteId_idx" ON "institute_membership"("instituteId");

-- CreateIndex
CREATE INDEX "institute_membership_userId_idx" ON "institute_membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "institute_membership_userId_instituteId_role_key" ON "institute_membership"("userId", "instituteId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "student_institute_record_membershipId_key" ON "student_institute_record"("membershipId");

-- CreateIndex
CREATE INDEX "student_institute_record_instituteId_idx" ON "student_institute_record"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "student_institute_record_studentProfileId_instituteId_key" ON "student_institute_record"("studentProfileId", "instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_institute_record_membershipId_key" ON "teacher_institute_record"("membershipId");

-- CreateIndex
CREATE INDEX "teacher_institute_record_instituteId_idx" ON "teacher_institute_record"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_institute_record_teacherProfileId_instituteId_key" ON "teacher_institute_record"("teacherProfileId", "instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_dmKey_key" ON "conversation"("dmKey");

-- CreateIndex
CREATE INDEX "conversation_type_idx" ON "conversation"("type");

-- CreateIndex
CREATE INDEX "conversation_instituteId_idx" ON "conversation"("instituteId");

-- CreateIndex
CREATE INDEX "conversation_batchId_idx" ON "conversation"("batchId");

-- CreateIndex
CREATE INDEX "conversation_channelType_idx" ON "conversation"("channelType");

-- CreateIndex
CREATE INDEX "conversation_lastMessageAt_idx" ON "conversation"("lastMessageAt");

-- CreateIndex
CREATE INDEX "conversation_lastActivityAt_idx" ON "conversation"("lastActivityAt");

-- CreateIndex
CREATE INDEX "conversation_participant_userId_idx" ON "conversation_participant"("userId");

-- CreateIndex
CREATE INDEX "conversation_participant_conversationId_idx" ON "conversation_participant"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participant_conversationId_userId_key" ON "conversation_participant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "message_conversationId_createdAt_idx" ON "message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "message_senderId_idx" ON "message"("senderId");

-- CreateIndex
CREATE INDEX "message_replyToId_idx" ON "message"("replyToId");

-- CreateIndex
CREATE INDEX "message_attachment_messageId_idx" ON "message_attachment"("messageId");

-- CreateIndex
CREATE INDEX "message_reaction_messageId_idx" ON "message_reaction"("messageId");

-- CreateIndex
CREATE INDEX "message_reaction_userId_idx" ON "message_reaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_reaction_messageId_userId_emoji_key" ON "message_reaction"("messageId", "userId", "emoji");

-- CreateIndex
CREATE INDEX "message_read_userId_idx" ON "message_read"("userId");

-- CreateIndex
CREATE INDEX "message_read_messageId_idx" ON "message_read"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "message_read_messageId_userId_key" ON "message_read"("messageId", "userId");

-- CreateIndex
CREATE INDEX "message_report_messageId_idx" ON "message_report"("messageId");

-- CreateIndex
CREATE INDEX "message_report_reporterId_idx" ON "message_report"("reporterId");

-- CreateIndex
CREATE INDEX "message_report_status_idx" ON "message_report"("status");

-- CreateIndex
CREATE UNIQUE INDEX "chat_settings_userId_key" ON "chat_settings"("userId");

-- CreateIndex
CREATE INDEX "notification_userId_isRead_idx" ON "notification"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "user_block_blockerId_blockedId_key" ON "user_block"("blockerId", "blockedId");

-- CreateIndex
CREATE INDEX "batch_student_studentRecordId_idx" ON "batch_student"("studentRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "batch_student_batchId_studentRecordId_key" ON "batch_student"("batchId", "studentRecordId");

-- CreateIndex
CREATE INDEX "batch_teacher_teacherRecordId_idx" ON "batch_teacher"("teacherRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "batch_teacher_batchId_teacherRecordId_key" ON "batch_teacher"("batchId", "teacherRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "institute_batch_slug_key" ON "institute_batch"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profile_userId_key" ON "teacher_profile"("userId");

-- AddForeignKey
ALTER TABLE "teacher_profile" ADD CONSTRAINT "teacher_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_membership" ADD CONSTRAINT "institute_membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_membership" ADD CONSTRAINT "institute_membership_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_institute_record" ADD CONSTRAINT "student_institute_record_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "institute_membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_institute_record" ADD CONSTRAINT "student_institute_record_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_institute_record" ADD CONSTRAINT "student_institute_record_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_institute_record" ADD CONSTRAINT "teacher_institute_record_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "institute_membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_institute_record" ADD CONSTRAINT "teacher_institute_record_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_institute_record" ADD CONSTRAINT "teacher_institute_record_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "institute_batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_lastReadMessageId_fkey" FOREIGN KEY ("lastReadMessageId") REFERENCES "message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachment" ADD CONSTRAINT "message_attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reaction" ADD CONSTRAINT "message_reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reaction" ADD CONSTRAINT "message_reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_read" ADD CONSTRAINT "message_read_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_read" ADD CONSTRAINT "message_read_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_report" ADD CONSTRAINT "message_report_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_report" ADD CONSTRAINT "message_report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_report" ADD CONSTRAINT "message_report_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_settings" ADD CONSTRAINT "chat_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_student" ADD CONSTRAINT "batch_student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "institute_batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_student" ADD CONSTRAINT "batch_student_studentRecordId_fkey" FOREIGN KEY ("studentRecordId") REFERENCES "student_institute_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_teacher" ADD CONSTRAINT "batch_teacher_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "institute_batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_teacher" ADD CONSTRAINT "batch_teacher_teacherRecordId_fkey" FOREIGN KEY ("teacherRecordId") REFERENCES "teacher_institute_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
