/**
 * BUZZSPIRE WORKHUB - Phase 1 Core Domain Types
 */

export type UserRole = "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY" | "ON_LEAVE" | "HOLIDAY" | "WEEKEND";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type LeaveType = "CASUAL" | "MEDICAL" | "EARNED" | "UNPAID" | "MATERNITY" | "PATERNITY";

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  name?: string;
}

export interface AttendanceSummary {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeave: number;
  lateToday: number;
  attendanceRate: number;
}
