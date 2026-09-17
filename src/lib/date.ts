/**
 * Date and Timezone helper utilities for BUZZSPIRE WORKHUB (Asia/Kolkata - UTC+5:30)
 */

export const TIMEZONE = "Asia/Kolkata";

/**
 * Returns current Date object.
 */
export function getNow(): Date {
  return new Date();
}

/**
 * Normalizes a date to start of day (00:00:00.000) in Asia/Kolkata time.
 */
export function getStartOfDay(dateInput?: Date | string): Date {
  const date = dateInput ? new Date(dateInput) : new Date();
  // Format to Kolkata YYYY-MM-DD
  const kolkataStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const [year, month, day] = kolkataStr.split("-").map(Number);
  // Create UTC date representing midnight in IST (subtract 5.5 hours)
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  // IST offset is UTC+5:30 -> 5.5 * 3600 * 1000 = 19800000 ms
  return new Date(startOfDay.getTime() - 19800000);
}

/**
 * Normalizes a date to end of day (23:59:59.999) in Asia/Kolkata time.
 */
export function getEndOfDay(dateInput?: Date | string): Date {
  const start = getStartOfDay(dateInput);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
}

/**
 * Returns YYYY-MM-DD formatted date string in Asia/Kolkata timezone.
 */
export function getKolkataDateString(dateInput?: Date | string): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Calculates integer duration in seconds between two dates.
 */
export function calculateDurationSeconds(start: Date, end?: Date | null): number {
  if (!start) return 0;
  const finish = end || new Date();
  const diffMs = finish.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / 1000));
}

/**
 * Formats seconds into HH:MM:SS format.
 */
export function formatSecondsToHMS(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
}

/**
 * Calculates whether a check-in timestamp in Asia/Kolkata is late based on shift start and grace period.
 */
export function calculateLateStatus(
  checkInTime: Date,
  shiftStart: string = "09:00",
  graceMinutes: number = 15
): { isLate: boolean; lateMinutes: number } {
  // Format checkInTime to Asia/Kolkata 24-hour hour & minute
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(checkInTime);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
  const checkInTotalMinutes = hour * 60 + minute;

  const [startH = 9, startM = 0] = shiftStart.split(":").map(Number);
  const shiftStartMinutes = startH * 60 + startM;
  const graceThresholdMinutes = shiftStartMinutes + graceMinutes;

  if (checkInTotalMinutes > graceThresholdMinutes) {
    return {
      isLate: true,
      lateMinutes: checkInTotalMinutes - shiftStartMinutes,
    };
  }

  return {
    isLate: false,
    lateMinutes: 0,
  };
}
