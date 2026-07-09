import { prisma } from "@/lib/prisma";
import { syncSingleInstituteToMeili } from "@/scripts/SyncInstitute";

const planWeights: Record<string, number> = { "ULTRA": 4, "PREMIUM": 3, "VERIFIED": 2, "BASIC": 1 };

async function main() {
  const institutes = await prisma.institute.findMany({ select: { id: true, subscriptionPlan: true } });
  let count = 0;
  for (const inst of institutes) {
    const weight = planWeights[inst.subscriptionPlan] || 1;
    await prisma.institute.update({
      where: { id: inst.id },
      data: { planWeight: weight }
    });
    await syncSingleInstituteToMeili(inst.id);
    count++;
  }
  console.log(`Successfully updated and synced ${count} institutes.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
