-- CreateEnum
CREATE TYPE "ODStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ODSessionType" AS ENUM ('FULL_DAY', 'FIRST_HALF', 'SECOND_HALF');

-- AlterEnum
ALTER TYPE "RoleName" ADD VALUE 'COMPLIANCE_AUDITOR';

-- DropIndex
DROP INDEX "AuditLog_employeeId_idx";

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "performedById" TEXT;

-- CreateTable
CREATE TABLE "OnDutyRequest" (
    "id" TEXT NOT NULL,
    "odId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sessionType" "ODSessionType" NOT NULL DEFAULT 'FULL_DAY',
    "reason" TEXT NOT NULL,
    "location" TEXT,
    "status" "ODStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnDutyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnDutyRequest_odId_key" ON "OnDutyRequest"("odId");

-- CreateIndex
CREATE INDEX "OnDutyRequest_employeeId_idx" ON "OnDutyRequest"("employeeId");

-- CreateIndex
CREATE INDEX "OnDutyRequest_status_idx" ON "OnDutyRequest"("status");

-- CreateIndex
CREATE INDEX "OnDutyRequest_date_idx" ON "OnDutyRequest"("date");

-- CreateIndex
CREATE INDEX "OnDutyRequest_approvedById_idx" ON "OnDutyRequest"("approvedById");

-- CreateIndex
CREATE INDEX "AuditLog_module_action_createdAt_idx" ON "AuditLog"("module", "action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_employeeId_createdAt_idx" ON "AuditLog"("employeeId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_performedById_createdAt_idx" ON "AuditLog"("performedById", "createdAt");

-- AddForeignKey
ALTER TABLE "OnDutyRequest" ADD CONSTRAINT "OnDutyRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnDutyRequest" ADD CONSTRAINT "OnDutyRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
