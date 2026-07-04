-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "WalletTransactionSource" AS ENUM ('DAILY_LOGIN', 'PROFILE_COMPLETION', 'REVIEW', 'REVIEW_LIKE', 'REFERRAL', 'PURCHASE', 'AI_CHAT', 'DM_BOOST', 'COURSE_PURCHASE', 'ADMIN', 'REFUND', 'BONUS');

-- CreateEnum
CREATE TYPE "ReputationSource" AS ENUM ('PROFILE_COMPLETED', 'VERIFIED_PROFILE', 'REVIEW_POSTED', 'REVIEW_HELPFUL', 'STUDENT_VERIFIED', 'TEACHER_VERIFIED', 'MANAGER_VERIFIED', 'REFERRAL', 'ANSWER_HELPFUL', 'COMMUNITY_CONTRIBUTION', 'ADMIN');

-- CreateTable
CREATE TABLE "user_wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "lifetimeEarned" INTEGER NOT NULL DEFAULT 0,
    "lifetimeSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "source" "WalletTransactionSource" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reputation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "teacherScore" INTEGER NOT NULL DEFAULT 0,
    "studentScore" INTEGER NOT NULL DEFAULT 0,
    "managerScore" INTEGER NOT NULL DEFAULT 0,
    "lifetimeEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_reputation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation_log" (
    "id" TEXT NOT NULL,
    "reputationId" TEXT NOT NULL,
    "source" "ReputationSource" NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_userId_key" ON "user_wallet"("userId");

-- CreateIndex
CREATE INDEX "wallet_transaction_walletId_idx" ON "wallet_transaction"("walletId");

-- CreateIndex
CREATE INDEX "wallet_transaction_source_idx" ON "wallet_transaction"("source");

-- CreateIndex
CREATE UNIQUE INDEX "user_reputation_userId_key" ON "user_reputation"("userId");

-- CreateIndex
CREATE INDEX "reputation_log_reputationId_idx" ON "reputation_log"("reputationId");

-- CreateIndex
CREATE INDEX "reputation_log_source_idx" ON "reputation_log"("source");

-- AddForeignKey
ALTER TABLE "user_wallet" ADD CONSTRAINT "user_wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "user_wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reputation" ADD CONSTRAINT "user_reputation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reputation_log" ADD CONSTRAINT "reputation_log_reputationId_fkey" FOREIGN KEY ("reputationId") REFERENCES "user_reputation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
