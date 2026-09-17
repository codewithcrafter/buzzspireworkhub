import { normalizeIntervals, subtractIntervals, intersectIntervals, calculateTotalDurationSeconds } from './src/lib/interval';

function runAudit() {
  const hr = (h: number, m: number) => (h * 60 + m) * 60000;

  console.log("=== SCENARIO 3: FIXED LUNCH OVERLAP ===");
  // A: Attendance 10:00–19:00, Fixed lunch 14:00–14:30
  let attA = normalizeIntervals([{ start: hr(10,0), end: hr(19,0) }]);
  let fl = normalizeIntervals([{ start: hr(14,0), end: hr(14,30) }]);
  let decBreak = normalizeIntervals([]);
  let idleBreak = normalizeIntervals([]);
  
  let workingA = subtractIntervals(attA, fl);
  console.log("3A - Gross:", 9*60, "Deducted:", 30, "Net:", calculateTotalDurationSeconds(workingA)/60);

  // B: Declared lunch 14:00-14:30
  decBreak = normalizeIntervals([{ start: hr(14,0), end: hr(14,30) }]);
  let netLunchB = subtractIntervals(fl, decBreak);
  let workingB = subtractIntervals(subtractIntervals(attA, decBreak), netLunchB);
  console.log("3B - Gross:", 9*60, "Deducted(Dec):", 30, "Deducted(FL):", calculateTotalDurationSeconds(netLunchB)/60, "Net:", calculateTotalDurationSeconds(workingB)/60);

  // C: Declared lunch 13:50-14:20
  decBreak = normalizeIntervals([{ start: hr(13,50), end: hr(14,20) }]);
  let netLunchC = subtractIntervals(fl, decBreak);
  let workingC = subtractIntervals(subtractIntervals(attA, decBreak), netLunchC);
  console.log("3C - Gross:", 9*60, "Deducted(Dec):", 30, "Deducted(FL):", calculateTotalDurationSeconds(netLunchC)/60, "Net:", calculateTotalDurationSeconds(workingC)/60);

  // D: Declared lunch 13:50-14:45
  decBreak = normalizeIntervals([{ start: hr(13,50), end: hr(14,45) }]);
  let netLunchD = subtractIntervals(fl, decBreak);
  let workingD = subtractIntervals(subtractIntervals(attA, decBreak), netLunchD);
  console.log("3D - Gross:", 9*60, "Deducted(Dec):", 55, "Deducted(FL):", calculateTotalDurationSeconds(netLunchD)/60, "Net:", calculateTotalDurationSeconds(workingD)/60);

  console.log("\n=== SCENARIO 4: OVERLAPPING BREAKS ===");
  let breaks = normalizeIntervals([
    { start: hr(13,0), end: hr(13,30) },
    { start: hr(13,20), end: hr(13,50) }
  ]);
  console.log("4 - Merged Break Mins:", calculateTotalDurationSeconds(breaks)/60);

  console.log("\n=== SCENARIO 5: IDLE + DECLARED OVERLAP ===");
  let dec5 = normalizeIntervals([{ start: hr(15,0), end: hr(15,30) }]);
  let idle5 = normalizeIntervals([{ start: hr(15,20), end: hr(15,40) }]);
  let validDec5 = subtractIntervals(dec5, idle5);
  let totalDeduction5 = calculateTotalDurationSeconds(validDec5)/60 + calculateTotalDurationSeconds(idle5)/60;
  console.log("5 - Total Deduction Mins:", totalDeduction5, "(Expected 40)");
  
  console.log("\n=== SCENARIO 6: MULTIPLE SESSIONS ===");
  let att6 = normalizeIntervals([
    { start: hr(10,0), end: hr(13,0) },
    { start: hr(14,0), end: hr(19,0) },
    { start: hr(12,0), end: hr(15,0) } // overlapping
  ]);
  console.log("6 - Gross Span Mins:", calculateTotalDurationSeconds(att6)/60, "(Expected 540)");
}

runAudit();
