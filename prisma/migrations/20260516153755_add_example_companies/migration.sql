-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
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
    "exampleCompanies" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("categoryId", "collaborationLevel", "createdAt", "creativityLevel", "description", "entryDifficulty", "id", "interestAreas", "isPublished", "mathIntensity", "preferredStrengths", "salaryAsOfYear", "salaryEntryMax", "salaryEntryMin", "salaryNote", "salarySeniorMax", "salarySeniorMin", "salarySourceUrl", "skillLevel", "skills", "slug", "summary", "title", "updatedAt", "workStyles") SELECT "categoryId", "collaborationLevel", "createdAt", "creativityLevel", "description", "entryDifficulty", "id", "interestAreas", "isPublished", "mathIntensity", "preferredStrengths", "salaryAsOfYear", "salaryEntryMax", "salaryEntryMin", "salaryNote", "salarySeniorMax", "salarySeniorMin", "salarySourceUrl", "skillLevel", "skills", "slug", "summary", "title", "updatedAt", "workStyles" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
CREATE INDEX "Job_categoryId_idx" ON "Job"("categoryId");
CREATE INDEX "Job_entryDifficulty_idx" ON "Job"("entryDifficulty");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
