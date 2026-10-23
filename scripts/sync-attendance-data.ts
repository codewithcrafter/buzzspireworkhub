import "dotenv/config";
import { PrismaClient, RoleName, EmployeeStatus, AttendanceStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getStartOfDay, getEndOfDay, calculateDurationSeconds } from "../src/lib/date";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

const isNeon = connectionString.includes("neon.tech");
const pool = new Pool({
  connectionString,
  ssl: isNeon || connectionString.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
  family: 4,
} as any);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Converts a date string (YYYY-MM-DD) and 24-hr time string (HH:MM) in Asia/Kolkata (UTC+5:30)
 * into a UTC JavaScript Date object.
 */
function toISTDate(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  // IST is UTC+5:30 -> subtract 5 hours 30 mins (19,800,000 ms)
  const utcEpoch = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  return new Date(utcEpoch - 19800000);
}

interface BreakSeedItem {
  typeName: string;
  purpose?: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
}

interface AttendanceSeedItem {
  employeeCode: string;
  dateStr: string;   // YYYY-MM-DD
  status: AttendanceStatus;
  isLate?: boolean;
  lateMinutes?: number;
  sessions: {
    punchIn: string;  // HH:MM
    punchOut?: string; // HH:MM
    breaks: BreakSeedItem[];
  }[];
}

export async function syncAttendanceData() {
  console.log("=================================================================");
  console.log("  BUZZSPIRE WORKHUB — ATTENDANCE & BREAK DATA SYNCHRONIZATION");
  console.log("=================================================================\n");

  // 1. Ensure Roles Exist
  console.log("1. Ensuring core roles exist...");
  const roleDefs = [
    { name: RoleName.ADMIN, description: "System Administrator with full permissions" },
    { name: RoleName.EMPLOYEE, description: "Regular Employee with self-service features" },
    { name: RoleName.MANAGER, description: "Department Manager with team oversight" },
    { name: RoleName.HR_MANAGER, description: "HR Manager with employee management access" },
  ];
  const roleMap: Record<string, string> = {};
  for (const r of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description, status: "ACTIVE" },
    });
    roleMap[r.name] = role.id;
  }
  console.log("   ✓ Roles verified.");

  // 2. Ensure Departments Exist
  console.log("2. Ensuring departments exist...");
  const deptDefs = [
    { code: "ENG", name: "Engineering", manager: "Vikram Malhotra", description: "Software engineering and infrastructure" },
    { code: "DES", name: "Product & Design", manager: "Ananya Iyer", description: "User experience, prototyping, and UI design" },
    { code: "MKT", name: "Marketing & Growth", manager: "Rohan Kapoor", description: "Brand awareness, growth, and communications" },
    { code: "HR", name: "Human Resources", manager: "Sunita Rao", description: "People operations, talent, and workplace culture" },
    { code: "OPS", name: "Operations & Facilities", manager: "Sunita Rao", description: "Workplace administration and facilities" },
  ];
  const deptMap: Record<string, string> = {};
  for (const d of deptDefs) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: { name: d.name, manager: d.manager, description: d.description },
      create: { code: d.code, name: d.name, manager: d.manager, description: d.description, status: "ACTIVE" },
    });
    deptMap[d.code] = dept.id;
  }
  console.log("   ✓ Departments verified.");

  // 3. Ensure BreakTypes Exist
  console.log("3. Ensuring break types exist...");
  const breakDefs = [
    { name: "Lunch", description: "Standard lunch break" },
    { name: "Tea / Coffee", description: "Short tea or coffee break" },
    { name: "Washroom", description: "Washroom break" },
    { name: "Calls", description: "Phone calls" },
    { name: "Meeting", description: "Internal or external meetings" },
    { name: "Shoot", description: "Production shoot" },
    { name: "Other", description: "Other breaks (requires purpose)" },
    { name: "Idle Break", description: "System idle detected break" },
    { name: "System Idle", description: "System idle detected break" },
  ];
  const breakTypeMap: Record<string, string> = {};
  for (const bt of breakDefs) {
    const breakType = await prisma.breakType.upsert({
      where: { name: bt.name },
      update: { description: bt.description },
      create: { name: bt.name, description: bt.description, status: "ACTIVE" },
    });
    breakTypeMap[bt.name] = breakType.id;
  }
  console.log("   ✓ Break types verified.");

  // 4. Ensure Non-Admin Employees Exist
  console.log("4. Ensuring test staff and managers exist...");
  const defaultPassword = process.env.ADMIN_SEED_PASSWORD || "WorkHubSecurePass2026!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const employeeDefs = [
    {
      employeeId: "EMP-102",
      employeeCode: "EMP-102",
      fullName: "Priya Patel",
      email: "priya.patel@buzzspire.com",
      phone: "+91 98765 43211",
      role: RoleName.EMPLOYEE,
      deptCode: "DES",
      designation: "Lead Product Designer",
      joiningDate: new Date("2023-08-15"),
    },
    {
      employeeId: "EMP-103",
      employeeCode: "EMP-103",
      fullName: "Vikram Malhotra",
      email: "vikram.m@buzzspire.com",
      phone: "+91 98765 43212",
      role: RoleName.MANAGER,
      deptCode: "ENG",
      designation: "VP of Engineering",
      joiningDate: new Date("2022-02-01"),
    },
    {
      employeeId: "EMP-104",
      employeeCode: "EMP-104",
      fullName: "Sunita Rao",
      email: "sunita.r@buzzspire.com",
      phone: "+91 98765 43213",
      role: RoleName.HR_MANAGER,
      deptCode: "HR",
      designation: "Head of People & Operations",
      joiningDate: new Date("2022-06-12"),
    },
    {
      employeeId: "EMP-105",
      employeeCode: "EMP-105",
      fullName: "Aman Gupta",
      email: "aman.gupta@buzzspire.com",
      phone: "+91 98765 43214",
      role: RoleName.EMPLOYEE,
      deptCode: "ENG",
      designation: "Senior Frontend Engineer",
      joiningDate: new Date("2024-01-10"),
    },
    {
      employeeId: "EMP-106",
      employeeCode: "EMP-106",
      fullName: "Neha Verma",
      email: "neha.verma@buzzspire.com",
      phone: "+91 98765 43215",
      role: RoleName.EMPLOYEE,
      deptCode: "HR",
      designation: "HR Generalist",
      joiningDate: new Date("2024-03-01"),
    },
    {
      employeeId: "EMP-107",
      employeeCode: "EMP-107",
      fullName: "Karan Singh",
      email: "karan.singh@buzzspire.com",
      phone: "+91 98765 43216",
      role: RoleName.EMPLOYEE,
      deptCode: "ENG",
      designation: "Full Stack Engineer",
      joiningDate: new Date("2023-11-20"),
    },
    {
      employeeId: "EMP-108",
      employeeCode: "EMP-108",
      fullName: "Ananya Iyer",
      email: "ananya.i@buzzspire.com",
      phone: "+91 98765 43217",
      role: RoleName.MANAGER,
      deptCode: "DES",
      designation: "Design Director",
      joiningDate: new Date("2022-09-01"),
    },
    {
      employeeId: "EMP-109",
      employeeCode: "EMP-109",
      fullName: "Rohan Kapoor",
      email: "rohan.k@buzzspire.com",
      phone: "+91 98765 43218",
      role: RoleName.MANAGER,
      deptCode: "MKT",
      designation: "Head of Marketing",
      joiningDate: "2023-01-15",
    },
    {
      employeeId: "EMP-110",
      employeeCode: "EMP-110",
      fullName: "Meera Nair",
      email: "meera.nair@buzzspire.com",
      phone: "+91 98765 43219",
      role: RoleName.EMPLOYEE,
      deptCode: "MKT",
      designation: "Growth Marketing Specialist",
      joiningDate: "2024-05-10",
    },
  ];

  const employeeMap: Record<string, any> = {};
  for (const emp of employeeDefs) {
    const record = await prisma.employee.upsert({
      where: { employeeCode: emp.employeeCode },
      update: {
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        roleId: roleMap[emp.role],
        departmentId: deptMap[emp.deptCode],
        designation: emp.designation,
        status: EmployeeStatus.ACTIVE,
      },
      create: {
        employeeId: emp.employeeId,
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        passwordHash,
        roleId: roleMap[emp.role],
        departmentId: deptMap[emp.deptCode],
        designation: emp.designation,
        joiningDate: new Date(emp.joiningDate),
        shiftStart: "09:00",
        shiftEnd: "18:00",
        status: EmployeeStatus.ACTIVE,
      },
    });
    employeeMap[emp.employeeCode] = record;
  }
  console.log(`   ✓ ${Object.keys(employeeMap).length} non-admin employees verified.`);

  // 5. Seed Attendance & Break Records for 2026-10-17 (and surrounding dates)
  console.log("5. Seeding attendance, sessions, and break records...");

  const attendanceSeeds: AttendanceSeedItem[] = [
    // ═════════════════════════════════════════════════════════════════════════
    // DATE: 2026-10-17 (Primary historical testing date)
    // ═════════════════════════════════════════════════════════════════════════
    {
      employeeCode: "EMP-102", // Priya Patel (Design)
      dateStr: "2026-10-17",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "09:02",
          punchOut: "18:18",
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Morning Tea Break", startTime: "11:15", endTime: "11:30" },
            { typeName: "Lunch", purpose: "Cafeteria Lunch", startTime: "13:15", endTime: "13:50" },
            { typeName: "System Idle", purpose: "Idle Break", startTime: "16:10", endTime: "16:22" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-103", // Vikram Malhotra (Engineering VP)
      dateStr: "2026-10-17",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "08:45",
          punchOut: "18:05",
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Coffee with Client", startTime: "10:30", endTime: "10:45" },
            { typeName: "Lunch", purpose: "Team Lunch", startTime: "13:00", endTime: "13:45" },
            { typeName: "Meeting", purpose: "Cross-functional Strategy Meeting", startTime: "15:30", endTime: "16:00" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-104", // Sunita Rao (HR Head)
      dateStr: "2026-10-17",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "09:00",
          punchOut: "18:00",
          breaks: [
            { typeName: "Lunch", purpose: "Executive Dining", startTime: "13:10", endTime: "13:50" },
            { typeName: "Calls", purpose: "Vendor Negotiation Call", startTime: "15:45", endTime: "16:00" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-105", // Aman Gupta (Senior Frontend)
      dateStr: "2026-10-17",
      status: AttendanceStatus.LATE,
      isLate: true,
      lateMinutes: 25,
      sessions: [
        {
          punchIn: "09:25",
          punchOut: "18:45",
          breaks: [
            { typeName: "Lunch", purpose: "Lunch & Walk", startTime: "13:30", endTime: "14:10" },
            { typeName: "Washroom", purpose: "Personal", startTime: "16:00", endTime: "16:10" },
            { typeName: "Idle Break", purpose: "Away from desk", startTime: "17:15", endTime: "17:30" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-106", // Neha Verma (HR)
      dateStr: "2026-10-17",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "09:12",
          punchOut: "18:10",
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Tea Break", startTime: "11:00", endTime: "11:15" },
            { typeName: "Lunch", purpose: "Lunch Break", startTime: "13:00", endTime: "13:35" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-107", // Karan Singh (Full Stack)
      dateStr: "2026-10-17",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "08:58",
          punchOut: "18:12",
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Morning Espresso", startTime: "11:30", endTime: "11:45" },
            { typeName: "Lunch", purpose: "Healthy Bowl Lunch", startTime: "13:15", endTime: "14:00" },
            { typeName: "Shoot", purpose: "Product Demo Video Recording", startTime: "15:00", endTime: "15:45" },
            { typeName: "Idle Break", purpose: "System Inactivity", startTime: "17:00", endTime: "17:15" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-108", // Ananya Iyer (Design Lead)
      dateStr: "2026-10-17",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "09:05",
          punchOut: "18:20",
          breaks: [
            { typeName: "Lunch", purpose: "Design Team Lunch", startTime: "13:00", endTime: "13:40" },
            { typeName: "Tea / Coffee", purpose: "Evening Refreshment", startTime: "16:30", endTime: "16:45" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-109", // Rohan Kapoor (Marketing)
      dateStr: "2026-10-17",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "08:50",
          punchOut: "17:55",
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Coffee Catchup", startTime: "10:45", endTime: "11:00" },
            { typeName: "Lunch", purpose: "Lunch Break", startTime: "13:15", endTime: "13:55" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-110", // Meera Nair (Marketing - Approved Leave)
      dateStr: "2026-10-17",
      status: AttendanceStatus.ON_LEAVE,
      sessions: [],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // DATE: 2026-10-16 (Previous Day)
    // ═════════════════════════════════════════════════════════════════════════
    {
      employeeCode: "EMP-102",
      dateStr: "2026-10-16",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "08:55",
          punchOut: "18:10",
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Morning Tea", startTime: "11:00", endTime: "11:15" },
            { typeName: "Lunch", purpose: "Lunch", startTime: "13:00", endTime: "13:45" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-103",
      dateStr: "2026-10-16",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "09:00",
          punchOut: "18:00",
          breaks: [
            { typeName: "Lunch", purpose: "Lunch", startTime: "13:15", endTime: "14:00" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-105",
      dateStr: "2026-10-16",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "08:50",
          punchOut: "18:05",
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Tea", startTime: "11:30", endTime: "11:45" },
            { typeName: "Lunch", purpose: "Lunch", startTime: "13:30", endTime: "14:15" },
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // DATE: 2026-10-21 (Current Date / Active Sessions)
    // ═════════════════════════════════════════════════════════════════════════
    {
      employeeCode: "EMP-102",
      dateStr: "2026-10-21",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "08:58",
          punchOut: undefined, // Currently Active / Working
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Morning Coffee", startTime: "10:30", endTime: "10:45" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-103",
      dateStr: "2026-10-21",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "08:45",
          punchOut: undefined, // Currently Active / Working
          breaks: [
            { typeName: "Tea / Coffee", purpose: "Quick tea", startTime: "10:15", endTime: "10:30" },
          ],
        },
      ],
    },
    {
      employeeCode: "EMP-105",
      dateStr: "2026-10-21",
      status: AttendanceStatus.PRESENT,
      sessions: [
        {
          punchIn: "09:05",
          punchOut: undefined, // Currently Active
          breaks: [
            { typeName: "Washroom", purpose: "Washroom", startTime: "11:00", endTime: "11:10" },
          ],
        },
      ],
    },
  ];

  let totalSeededAttendances = 0;
  let totalSeededSessions = 0;
  let totalSeededBreaks = 0;

  for (const item of attendanceSeeds) {
    const emp = employeeMap[item.employeeCode];
    if (!emp) continue;

    const dayStart = getStartOfDay(item.dateStr);

    // Calculate totalWorkingSeconds, totalBreakSeconds, netWorkingSeconds from sessions
    let grossWorkSec = 0;
    let totalBreakSec = 0;
    let idleBreakSec = 0;
    let firstPunchIn: Date | null = null;
    let lastPunchOut: Date | null = null;

    const parsedSessions = item.sessions.map((sess) => {
      const pIn = toISTDate(item.dateStr, sess.punchIn);
      const pOut = sess.punchOut ? toISTDate(item.dateStr, sess.punchOut) : null;

      if (!firstPunchIn || pIn < firstPunchIn) firstPunchIn = pIn;
      if (pOut && (!lastPunchOut || pOut > lastPunchOut)) lastPunchOut = pOut;

      const durationSec = pOut ? calculateDurationSeconds(pIn, pOut) : calculateDurationSeconds(pIn, new Date());
      grossWorkSec += durationSec;

      const parsedBreaks = sess.breaks.map((b) => {
        const bStart = toISTDate(item.dateStr, b.startTime);
        const bEnd = b.endTime ? toISTDate(item.dateStr, b.endTime) : null;
        const bDur = bEnd ? calculateDurationSeconds(bStart, bEnd) : calculateDurationSeconds(bStart, new Date());

        totalBreakSec += bDur;
        if (b.typeName === "System Idle" || b.typeName === "Idle Break") {
          idleBreakSec += bDur;
        }

        const bTypeId = breakTypeMap[b.typeName] || breakTypeMap["Other"];

        return {
          breakTypeId: bTypeId,
          purpose: b.purpose || b.typeName,
          startTime: bStart,
          endTime: bEnd,
          durationSeconds: bDur,
        };
      });

      return {
        punchIn: pIn,
        punchOut: pOut,
        workingSeconds: durationSec,
        breaks: parsedBreaks,
      };
    });

    const netWorkSec = Math.max(0, grossWorkSec - totalBreakSec);

    // Clean existing attendance record for this employee and date to avoid stale data
    const existingAtt = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: emp.id,
          date: dayStart,
        },
      },
      include: { sessions: { include: { breaks: true } } },
    });

    if (existingAtt) {
      for (const s of existingAtt.sessions) {
        await prisma.break.deleteMany({ where: { attendanceSessionId: s.id } });
      }
      await prisma.attendanceSession.deleteMany({ where: { attendanceId: existingAtt.id } });
      await prisma.attendance.delete({ where: { id: existingAtt.id } });
    }

    // Create the fresh attendance record
    const attRecord = await prisma.attendance.create({
      data: {
        employeeId: emp.id,
        date: dayStart,
        checkIn: firstPunchIn,
        checkOut: lastPunchOut,
        status: item.status,
        isLate: item.isLate ?? false,
        lateMinutes: item.lateMinutes ?? 0,
        totalWorkingSeconds: grossWorkSec,
        totalBreakSeconds: totalBreakSec,
        netWorkingSeconds: netWorkSec,
        idleSeconds: idleBreakSec,
      },
    });
    totalSeededAttendances++;

    for (const s of parsedSessions) {
      const sessRecord = await prisma.attendanceSession.create({
        data: {
          attendanceId: attRecord.id,
          employeeId: emp.id,
          punchIn: s.punchIn,
          punchOut: s.punchOut,
          workingSeconds: s.workingSeconds,
        },
      });
      totalSeededSessions++;

      for (const b of s.breaks) {
        await prisma.break.create({
          data: {
            attendanceSessionId: sessRecord.id,
            breakTypeId: b.breakTypeId,
            purpose: b.purpose,
            startTime: b.startTime,
            endTime: b.endTime,
            durationSeconds: b.durationSeconds,
          },
        });
        totalSeededBreaks++;
      }
    }
  }

  console.log(`   ✓ Seeded ${totalSeededAttendances} attendance records.`);
  console.log(`   ✓ Seeded ${totalSeededSessions} attendance sessions.`);
  console.log(`   ✓ Seeded ${totalSeededBreaks} break activity logs.\n`);

  console.log("=================================================================");
  console.log("🎉 ATTENDANCE & BREAK DATA SYNC COMPLETED SUCCESSFULLY!");
  console.log("=================================================================\n");
}

if (require.main === module) {
  syncAttendanceData()
    .catch((err) => {
      console.error("❌ Error syncing attendance data:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
