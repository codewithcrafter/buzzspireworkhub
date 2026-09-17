export interface TimeInterval {
  start: number; // Unix timestamp in ms
  end: number;   // Unix timestamp in ms
}

/**
 * Sorts and merges overlapping intervals into a normalized array of distinct intervals.
 */
export function normalizeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return [];
  
  // Sort by start time
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const result: TimeInterval[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = result[result.length - 1];
    
    // If current overlaps or touches the last, merge them
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      // Disjoint interval
      result.push(current);
    }
  }
  
  return result;
}

/**
 * Intersects two sets of normalized intervals.
 * Useful for finding overlap between two different types of records (e.g. Attendance and Fixed Lunch).
 */
export function intersectIntervals(a: TimeInterval[], b: TimeInterval[]): TimeInterval[] {
  const result: TimeInterval[] = [];
  let i = 0;
  let j = 0;
  
  while (i < a.length && j < b.length) {
    const intA = a[i];
    const intB = b[j];
    
    // Check if they overlap
    if (intA.start < intB.end && intB.start < intA.end) {
      result.push({
        start: Math.max(intA.start, intB.start),
        end: Math.min(intA.end, intB.end)
      });
    }
    
    // Move the pointer of the interval that ends earlier
    if (intA.end < intB.end) {
      i++;
    } else {
      j++;
    }
  }
  
  return result;
}

/**
 * Subtracts the 'subtractor' intervals from the 'base' intervals.
 * All inputs must be normalized.
 */
export function subtractIntervals(base: TimeInterval[], subtractor: TimeInterval[]): TimeInterval[] {
  let currentBase = [...base];
  
  for (const sub of subtractor) {
    const nextBase: TimeInterval[] = [];
    
    for (const b of currentBase) {
      // No overlap
      if (b.end <= sub.start || b.start >= sub.end) {
        nextBase.push(b);
      } 
      // Subtractor completely covers base
      else if (sub.start <= b.start && sub.end >= b.end) {
        // Drop it entirely
      }
      // Subtractor covers the start of base
      else if (sub.start <= b.start && sub.end < b.end) {
        nextBase.push({ start: sub.end, end: b.end });
      }
      // Subtractor covers the end of base
      else if (sub.start > b.start && sub.end >= b.end) {
        nextBase.push({ start: b.start, end: sub.start });
      }
      // Subtractor is completely inside base (splits it)
      else if (sub.start > b.start && sub.end < b.end) {
        nextBase.push({ start: b.start, end: sub.start });
        nextBase.push({ start: sub.end, end: b.end });
      }
    }
    
    currentBase = nextBase;
  }
  
  return currentBase;
}

/**
 * Calculates the total duration of a normalized array of intervals in seconds.
 */
export function calculateTotalDurationSeconds(intervals: TimeInterval[]): number {
  const sumMs = intervals.reduce((acc, curr) => acc + Math.max(0, curr.end - curr.start), 0);
  return Math.floor(sumMs / 1000);
}

/**
 * Converts HH:mm time string (Asia/Kolkata context) for a specific date into a Unix timestamp.
 * Example: date=2023-10-25, timeStr="14:00" -> Returns timestamp for 14:00 on that day in Asia/Kolkata.
 */
export function getTimeOnDate(date: Date, timeStr: string, timeZone: string = "Asia/Kolkata"): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  
  // Format the target date explicitly in the timezone to prevent node environment timezone drift
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  // Create an ISO string representing the target time in the specific timezone
  // e.g. "2023-10-25T14:00:00+05:30"
  // Note: Asia/Kolkata is UTC+5:30
  const kolkataOffset = "+05:30";
  const isoString = `${year}-${month}-${day}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00${kolkataOffset}`;
  
  return new Date(isoString).getTime();
}
