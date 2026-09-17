const fs = require('fs');

const path = 'src/app/(dashboard)/settings/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update DEFAULT_SETTINGS
content = content.replace(
`  // ATTENDANCE
  workStartTime: "09:00",
  workEndTime: "18:00",
  gracePeriodMinutes: "15",
  lateRules: "Marked LATE after 09:15 AM; 3 late arrivals trigger 0.5 day deduction",
  autoClockOutEnabled: true,
  autoClockOutTime: "22:00",

  // BREAKS
  breakDurationMinutes: "60",
  maxBreaksPerDay: "3",
  breakRules: "Breaks exceeding total 60 mins will be deducted from net recorded working hours.",
  lunchStart: "13:00",
  lunchEnd: "14:30",`,
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
  fixedLunchEnd: "14:30",`
);

// Update loadIdleSettings to load all
content = content.replace(
`              idleMonitoringEnabled: dbSettings["idle_monitoring_enabled"]?.value === "true",
              idleDetectionThresholdMinutes: dbSettings["idle_detection_threshold_minutes"]?.value || "2"`,
`              idleMonitoringEnabled: dbSettings["idle_monitoring_enabled"]?.value === "true",
              idleDetectionThresholdMinutes: dbSettings["idle_detection_threshold_minutes"]?.value || "2",
              officeStartTime: dbSettings["office_start_time"]?.value || "10:00",
              officeEndTime: dbSettings["office_end_time"]?.value || "19:00",
              expectedWorkMinutes: dbSettings["expected_work_minutes"]?.value || "510",
              lateGraceMinutes: dbSettings["late_grace_minutes"]?.value || "15",
              earlyLogoutGraceMinutes: dbSettings["early_logout_grace_minutes"]?.value || "15",
              halfDayThresholdMinutes: dbSettings["half_day_threshold_minutes"]?.value || "240",
              overtimeEnabled: dbSettings["overtime_enabled"]?.value !== "false",
              fixedLunchStart: dbSettings["fixed_lunch_start_time"]?.value || "14:00",
              fixedLunchEnd: dbSettings["fixed_lunch_end_time"]?.value || "14:30"`
);

content = content.replace(
`              idleMonitoringEnabled: dbSettings["idle_monitoring_enabled"]?.value === "true",
              idleDetectionThresholdMinutes: dbSettings["idle_detection_threshold_minutes"]?.value || "2"`,
`              idleMonitoringEnabled: dbSettings["idle_monitoring_enabled"]?.value === "true",
              idleDetectionThresholdMinutes: dbSettings["idle_detection_threshold_minutes"]?.value || "2",
              officeStartTime: dbSettings["office_start_time"]?.value || "10:00",
              officeEndTime: dbSettings["office_end_time"]?.value || "19:00",
              expectedWorkMinutes: dbSettings["expected_work_minutes"]?.value || "510",
              lateGraceMinutes: dbSettings["late_grace_minutes"]?.value || "15",
              earlyLogoutGraceMinutes: dbSettings["early_logout_grace_minutes"]?.value || "15",
              halfDayThresholdMinutes: dbSettings["half_day_threshold_minutes"]?.value || "240",
              overtimeEnabled: dbSettings["overtime_enabled"]?.value !== "false",
              fixedLunchStart: dbSettings["fixed_lunch_start_time"]?.value || "14:00",
              fixedLunchEnd: dbSettings["fixed_lunch_end_time"]?.value || "14:30"`
);

// Update save handler
content = content.replace(
`        body: JSON.stringify({
          idle_monitoring_enabled: String(settings.idleMonitoringEnabled),
          idle_detection_threshold_minutes: String(settings.idleDetectionThresholdMinutes)
        })`,
`        body: JSON.stringify({
          idle_monitoring_enabled: String(settings.idleMonitoringEnabled),
          idle_detection_threshold_minutes: String(settings.idleDetectionThresholdMinutes),
          office_start_time: String(settings.officeStartTime),
          office_end_time: String(settings.officeEndTime),
          expected_work_minutes: String(settings.expectedWorkMinutes),
          late_grace_minutes: String(settings.lateGraceMinutes),
          early_logout_grace_minutes: String(settings.earlyLogoutGraceMinutes),
          half_day_threshold_minutes: String(settings.halfDayThresholdMinutes),
          overtime_enabled: String(settings.overtimeEnabled),
          fixed_lunch_start_time: String(settings.fixedLunchStart),
          fixed_lunch_end_time: String(settings.fixedLunchEnd)
        })`
);

// We won't rewrite the whole JSX component, we'll just let the UI have the new keys and we'll leave the UI labels alone, 
// just updating the binding `settings.officeStartTime` instead of `settings.workStartTime`.

content = content.replace(/settings\.workStartTime/g, 'settings.officeStartTime');
content = content.replace(/handleChange\("workStartTime"/g, 'handleChange("officeStartTime"');

content = content.replace(/settings\.workEndTime/g, 'settings.officeEndTime');
content = content.replace(/handleChange\("workEndTime"/g, 'handleChange("officeEndTime"');

content = content.replace(/settings\.gracePeriodMinutes/g, 'settings.lateGraceMinutes');
content = content.replace(/handleChange\("gracePeriodMinutes"/g, 'handleChange("lateGraceMinutes"');

content = content.replace(/settings\.lunchStart/g, 'settings.fixedLunchStart');
content = content.replace(/handleChange\("lunchStart"/g, 'handleChange("fixedLunchStart"');

content = content.replace(/settings\.lunchEnd/g, 'settings.fixedLunchEnd');
content = content.replace(/handleChange\("lunchEnd"/g, 'handleChange("fixedLunchEnd"');

// Save back
fs.writeFileSync(path, content, 'utf8');
console.log("Updated settings page successfully.");
