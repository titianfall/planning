-- AlterTable
ALTER TABLE "Job" RENAME COLUMN "entryDifficulty" TO "hiringDifficulty";

-- CreateIndex
DROP INDEX IF EXISTS "Job_entryDifficulty_idx";
CREATE INDEX "Job_hiringDifficulty_idx" ON "Job"("hiringDifficulty");
