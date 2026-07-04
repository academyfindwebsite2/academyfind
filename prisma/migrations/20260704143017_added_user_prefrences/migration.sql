-- CreateTable
CREATE TABLE "user_preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailOnDm" BOOLEAN NOT NULL DEFAULT true,
    "emailOnNews" BOOLEAN NOT NULL DEFAULT true,
    "emailOnUpdates" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferred_category" (
    "id" TEXT NOT NULL,
    "preferenceId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_preferred_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preference_city" (
    "id" TEXT NOT NULL,
    "preferenceId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_preference_city_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_userId_key" ON "user_preference"("userId");

-- CreateIndex
CREATE INDEX "user_preferred_category_categoryId_idx" ON "user_preferred_category"("categoryId");

-- CreateIndex
CREATE INDEX "user_preferred_category_preferenceId_idx" ON "user_preferred_category"("preferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferred_category_preferenceId_categoryId_key" ON "user_preferred_category"("preferenceId", "categoryId");

-- CreateIndex
CREATE INDEX "user_preference_city_cityId_idx" ON "user_preference_city"("cityId");

-- CreateIndex
CREATE INDEX "user_preference_city_preferenceId_idx" ON "user_preference_city"("preferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_city_preferenceId_cityId_key" ON "user_preference_city"("preferenceId", "cityId");

-- AddForeignKey
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferred_category" ADD CONSTRAINT "user_preferred_category_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "user_preference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferred_category" ADD CONSTRAINT "user_preferred_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preference_city" ADD CONSTRAINT "user_preference_city_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "user_preference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preference_city" ADD CONSTRAINT "user_preference_city_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
