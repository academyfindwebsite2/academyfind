-- CreateEnum
CREATE TYPE "CRMProvider" AS ENUM ('ZOHO', 'SALESFORCE', 'HUBSPOT', 'PIPEDRIVE', 'LEADSQUARED', 'NOCRM', 'ZENDESK', 'FRESHSALES', 'CUSTOM');

-- CreateTable
CREATE TABLE "crm_integration" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "provider" "CRMProvider" NOT NULL DEFAULT 'CUSTOM',
    "webhookUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sendEnquiries" BOOLEAN NOT NULL DEFAULT true,
    "sendUserSaves" BOOLEAN NOT NULL DEFAULT false,
    "sendUserVisits" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_integration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "crm_integration" ADD CONSTRAINT "crm_integration_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
