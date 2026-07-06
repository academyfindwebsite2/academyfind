import type { WalletTransactionSource } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function creditWallet(
  userId: string,
  amount: number,
  source: WalletTransactionSource,
  description?: string,
  referenceId?: string,
) {
  if (!Number.isInteger(amount) || amount === 0) return null;

  try {
    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.userWallet.upsert({
        where: { userId },
        create: {
          userId,
          balance: Math.max(0, amount),
          lifetimeEarned: Math.max(0, amount),
          lifetimeSpent: Math.max(0, -amount),
        },
        update: {
          balance: { increment: amount },
          ...(amount > 0
            ? { lifetimeEarned: { increment: amount } }
            : { lifetimeSpent: { increment: -amount } }),
        },
      });

      if (wallet.balance < 0) {
        throw new Error("Insufficient wallet balance");
      }

      return tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: amount > 0 ? "CREDIT" : "DEBIT",
          source,
          amount: Math.abs(amount),
          balanceAfter: wallet.balance,
          description,
          referenceId,
        },
      });
    });
  } catch (error) {
    console.error("Unable to update wallet", error);
    return null;
  }
}

// Debit helper (checks balance first)
export async function debitWallet(
  userId: string,
  amount: number,
  source: WalletTransactionSource,
  description?: string,
  referenceId?: string
) {
  const wallet = await prisma.userWallet.findUnique({ where: { userId } })
  if (!wallet || wallet.balance < amount) {
    return { success: false, error: "Insufficient coins" }
  }
  return creditWallet(userId, -amount, source, description, referenceId)
}
