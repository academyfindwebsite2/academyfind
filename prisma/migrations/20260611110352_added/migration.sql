-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "classroomImages" TEXT[],
ADD COLUMN     "feeInfo" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "canAddInstitute" BOOLEAN NOT NULL DEFAULT false;
