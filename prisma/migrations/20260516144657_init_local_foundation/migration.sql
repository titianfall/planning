-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "salaryEntryMin" INTEGER,
    "salaryEntryMax" INTEGER,
    "salarySeniorMin" INTEGER,
    "salarySeniorMax" INTEGER,
    "salaryNote" TEXT,
    "salarySourceUrl" TEXT,
    "salaryAsOfYear" INTEGER,
    "entryDifficulty" TEXT NOT NULL,
    "interestAreas" TEXT NOT NULL,
    "preferredStrengths" TEXT NOT NULL,
    "workStyles" TEXT NOT NULL,
    "skillLevel" INTEGER NOT NULL,
    "collaborationLevel" INTEGER NOT NULL,
    "mathIntensity" INTEGER NOT NULL,
    "creativityLevel" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lastCheckedAt" DATETIME,
    "httpStatus" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobLink_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "Job_categoryId_idx" ON "Job"("categoryId");

-- CreateIndex
CREATE INDEX "Job_entryDifficulty_idx" ON "Job"("entryDifficulty");

-- CreateIndex
CREATE INDEX "JobLink_jobId_idx" ON "JobLink"("jobId");
