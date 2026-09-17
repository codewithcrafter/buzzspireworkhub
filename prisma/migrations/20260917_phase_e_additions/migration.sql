-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EmployeeStatus" ADD VALUE 'ONBOARDING';
ALTER TYPE "EmployeeStatus" ADD VALUE 'PROBATION';
ALTER TYPE "EmployeeStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "EmployeeStatus" ADD VALUE 'RESIGNED';
ALTER TYPE "EmployeeStatus" ADD VALUE 'NOTICE_PERIOD';
ALTER TYPE "EmployeeStatus" ADD VALUE 'EXITED';

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "confirmationDate" TIMESTAMP(3),
ADD COLUMN     "exitDate" TIMESTAMP(3),
ADD COLUMN     "exitReason" TEXT,
ADD COLUMN     "lastWorkingDate" TIMESTAMP(3),
ADD COLUMN     "managerId" TEXT,
ADD COLUMN     "noticePeriodStart" TIMESTAMP(3),
ADD COLUMN     "probationEnd" TIMESTAMP(3),
ADD COLUMN     "probationStart" TIMESTAMP(3),
ADD COLUMN     "resignationDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EmploymentHistory" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "departmentId" TEXT,
    "managerId" TEXT,
    "designation" TEXT,
    "status" "EmployeeStatus" NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmploymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmploymentHistory_employeeId_idx" ON "EmploymentHistory"("employeeId");

-- CreateIndex
CREATE INDEX "EmploymentHistory_departmentId_idx" ON "EmploymentHistory"("departmentId");

-- CreateIndex
CREATE INDEX "EmploymentHistory_effectiveFrom_idx" ON "EmploymentHistory"("effectiveFrom");

-- CreateIndex
CREATE INDEX "EmploymentHistory_effectiveTo_idx" ON "EmploymentHistory"("effectiveTo");

-- CreateIndex
CREATE INDEX "Employee_managerId_idx" ON "Employee"("managerId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

