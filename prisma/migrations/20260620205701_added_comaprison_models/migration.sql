-- CreateEnum
CREATE TYPE "CategoryDomain" AS ENUM ('ACADEMIC', 'PERFORMING_ARTS', 'SPORTS', 'VISUAL_ARTS', 'FITNESS', 'LANGUAGE', 'OTHER');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "shortDescription" TEXT;

-- AlterTable
ALTER TABLE "City" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "population" INTEGER;

-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "affiliations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "awards" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "compareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "establishedYear" INTEGER,
ADD COLUMN     "feeMax" INTEGER,
ADD COLUMN     "feeMin" INTEGER,
ADD COLUMN     "hasCertification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasDemoClasses" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasHostelFacility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOnlineClasses" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasScholarship" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mediumOfInstruction" TEXT[] DEFAULT ARRAY['English', 'Hindi']::TEXT[],
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "refundPolicy" TEXT,
ADD COLUMN     "totalBranches" INTEGER,
ADD COLUMN     "totalStudents" INTEGER;

-- AlterTable
ALTER TABLE "teacher_profile" ADD COLUMN     "qualification" TEXT;

-- CreateTable
CREATE TABLE "category_city_content" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "introContent" TEXT,
    "whyChooseContent" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "h1Override" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_city_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_facility" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "institute_facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_batch" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT,
    "fee" INTEGER,
    "batchType" TEXT,
    "mode" "InstituteMode" NOT NULL DEFAULT 'OFFLINE',
    "timing" TEXT,
    "seatsTotal" INTEGER,
    "seatsLeft" INTEGER,
    "ageGroupMin" INTEGER,
    "ageGroupMax" INTEGER,
    "originalFee" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_highlight_stat" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "institute_highlight_stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_achievement" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "studentName" TEXT,
    "achievementType" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "institute_achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_faq" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "institute_faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_operating_hour" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT,
    "closeTime" TEXT,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "institute_operating_hour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_compare_list" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "shareSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_compare_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compare_list_institute" (
    "id" TEXT NOT NULL,
    "compareListId" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "compare_list_institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_question" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notable_alumni" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "batchYear" INTEGER,
    "placedAt" TEXT,
    "package" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notable_alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_comparison_cache" (
    "id" TEXT NOT NULL,
    "institute1Id" TEXT NOT NULL,
    "institute2Id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "verdict" TEXT,
    "verdictReason" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_comparison_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "category_city_content_categoryId_idx" ON "category_city_content"("categoryId");

-- CreateIndex
CREATE INDEX "category_city_content_cityId_idx" ON "category_city_content"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "category_city_content_categoryId_cityId_key" ON "category_city_content"("categoryId", "cityId");

-- CreateIndex
CREATE INDEX "institute_facility_instituteId_idx" ON "institute_facility"("instituteId");

-- CreateIndex
CREATE INDEX "institute_batch_instituteId_idx" ON "institute_batch"("instituteId");

-- CreateIndex
CREATE INDEX "institute_highlight_stat_instituteId_idx" ON "institute_highlight_stat"("instituteId");

-- CreateIndex
CREATE INDEX "institute_achievement_instituteId_idx" ON "institute_achievement"("instituteId");

-- CreateIndex
CREATE INDEX "institute_achievement_year_idx" ON "institute_achievement"("year");

-- CreateIndex
CREATE INDEX "institute_faq_instituteId_idx" ON "institute_faq"("instituteId");

-- CreateIndex
CREATE INDEX "institute_operating_hour_instituteId_idx" ON "institute_operating_hour"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "institute_operating_hour_instituteId_dayOfWeek_key" ON "institute_operating_hour"("instituteId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "user_compare_list_shareSlug_key" ON "user_compare_list"("shareSlug");

-- CreateIndex
CREATE INDEX "user_compare_list_userId_idx" ON "user_compare_list"("userId");

-- CreateIndex
CREATE INDEX "user_compare_list_shareSlug_idx" ON "user_compare_list"("shareSlug");

-- CreateIndex
CREATE INDEX "compare_list_institute_instituteId_idx" ON "compare_list_institute"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "compare_list_institute_compareListId_instituteId_key" ON "compare_list_institute"("compareListId", "instituteId");

-- CreateIndex
CREATE INDEX "community_question_instituteId_idx" ON "community_question"("instituteId");

-- CreateIndex
CREATE INDEX "community_answer_questionId_idx" ON "community_answer"("questionId");

-- CreateIndex
CREATE INDEX "notable_alumni_instituteId_idx" ON "notable_alumni"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "institute_comparison_cache_slug_key" ON "institute_comparison_cache"("slug");

-- CreateIndex
CREATE INDEX "institute_comparison_cache_slug_idx" ON "institute_comparison_cache"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "institute_comparison_cache_institute1Id_institute2Id_key" ON "institute_comparison_cache"("institute1Id", "institute2Id");

-- AddForeignKey
ALTER TABLE "category_city_content" ADD CONSTRAINT "category_city_content_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_city_content" ADD CONSTRAINT "category_city_content_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_facility" ADD CONSTRAINT "institute_facility_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_batch" ADD CONSTRAINT "institute_batch_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_highlight_stat" ADD CONSTRAINT "institute_highlight_stat_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_achievement" ADD CONSTRAINT "institute_achievement_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_faq" ADD CONSTRAINT "institute_faq_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_operating_hour" ADD CONSTRAINT "institute_operating_hour_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_compare_list" ADD CONSTRAINT "user_compare_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compare_list_institute" ADD CONSTRAINT "compare_list_institute_compareListId_fkey" FOREIGN KEY ("compareListId") REFERENCES "user_compare_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compare_list_institute" ADD CONSTRAINT "compare_list_institute_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_question" ADD CONSTRAINT "community_question_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_question" ADD CONSTRAINT "community_question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_answer" ADD CONSTRAINT "community_answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "community_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_answer" ADD CONSTRAINT "community_answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notable_alumni" ADD CONSTRAINT "notable_alumni_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_comparison_cache" ADD CONSTRAINT "institute_comparison_cache_institute1Id_fkey" FOREIGN KEY ("institute1Id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_comparison_cache" ADD CONSTRAINT "institute_comparison_cache_institute2Id_fkey" FOREIGN KEY ("institute2Id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
