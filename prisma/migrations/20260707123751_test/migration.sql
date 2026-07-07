-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WalletTransactionSource" ADD VALUE 'SIGN_UP';
ALTER TYPE "WalletTransactionSource" ADD VALUE 'BLOG_POST';
ALTER TYPE "WalletTransactionSource" ADD VALUE 'COMMUNITY_QUESTION';
ALTER TYPE "WalletTransactionSource" ADD VALUE 'COMMUNITY_ANSWER';
ALTER TYPE "WalletTransactionSource" ADD VALUE 'INSTITUTE_MEMBERSHIP';
ALTER TYPE "WalletTransactionSource" ADD VALUE 'CONTENT_REPORT';
