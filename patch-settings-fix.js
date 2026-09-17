const fs = require('fs');

const path = 'src/app/(dashboard)/settings/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add the missing keys back to the object
content = content.replace(
`  // ATTENDANCE & HR ENGINE
  officeStartTime: "10:00",
  officeEndTime: "19:00",
  expectedWorkMinutes: "510",
  lateGraceMinutes: "15",
  earlyLogoutGraceMinutes: "15",
  halfDayThresholdMinutes: "240",
  overtimeEnabled: true,

  // BREAKS
  fixedLunchStart: "14:00",
  fixedLunchEnd: "14:30",`,
`  // ATTENDANCE & HR ENGINE
  officeStartTime: "10:00",
  officeEndTime: "19:00",
  expectedWorkMinutes: "510",
  lateGraceMinutes: "15",
  earlyLogoutGraceMinutes: "15",
  halfDayThresholdMinutes: "240",
  overtimeEnabled: true,
  lateRules: "Marked LATE after 09:15 AM",
  autoClockOutEnabled: true,
  autoClockOutTime: "22:00",

  // BREAKS
  fixedLunchStart: "14:00",
  fixedLunchEnd: "14:30",
  breakDurationMinutes: "60",
  maxBreaksPerDay: "3",
  breakRules: "Breaks exceeding total 60 mins will be deducted.",`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed settings type errors.");
