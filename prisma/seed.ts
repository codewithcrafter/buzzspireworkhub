import "dotenv/config";
import { PrismaClient, RoleName, EmployeeStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const isNeon = connectionString?.includes("neon.tech");
const pool = new Pool({
  connectionString,
  ssl: isNeon || connectionString?.includes("sslmode=") ? { rejectUnauthorized: false } : undefined,
  family: 4,
} as any);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting BUZZSPIRE WORKHUB database seed...");

  // 1. Seed Roles
  const roles = [
    { name: RoleName.ADMIN, description: "System Administrator with full permissions" },
    { name: RoleName.EMPLOYEE, description: "Regular Employee with self-service features" },
    { name: RoleName.MANAGER, description: "Department Manager with team oversight" },
    { name: RoleName.HR_MANAGER, description: "HR Manager with employee management access" },
  ];

  const roleRecords: Record<string, any> = {};

  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: {
        name: r.name,
        description: r.description,
        status: "ACTIVE",
      },
    });
    roleRecords[r.name] = role;
    console.log(`✓ Role upserted: ${role.name}`);
  }

  // 2. Seed Departments
  const departments = [
    { code: "OPS", name: "Operations & Facilities", manager: "Sunita Rao", description: "Workplace administration and facilities" },
    { code: "ENG", name: "Engineering", manager: "Vikram Malhotra", description: "Software development and cloud infrastructure" },
    { code: "MKT", name: "Marketing & Growth", manager: "Rohan Kapoor", description: "Performance marketing and brand growth" },
    { code: "HR", name: "Human Resources", manager: "Sunita Rao", description: "Talent acquisition, employee welfare and payroll" },
    { code: "DES", name: "Product & Design", manager: "Ananya Iyer", description: "UI/UX design and design system prototyping" },
  ];

  const deptRecords: Record<string, any> = {};

  for (const d of departments) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: { name: d.name, manager: d.manager, description: d.description },
      create: {
        code: d.code,
        name: d.name,
        manager: d.manager,
        description: d.description,
        status: "ACTIVE",
      },
    });
    deptRecords[d.code] = dept;
    console.log(`✓ Department upserted: ${dept.name} (${dept.code})`);
  }

  // 3. Seed Break Types
  const breakTypes = [
    { name: "Lunch", description: "Standard lunch break", status: "ACTIVE" },
    { name: "Tea / Coffee", description: "Short tea or coffee break", status: "ACTIVE" },
    { name: "Washroom", description: "Washroom break", status: "ACTIVE" },
    { name: "Calls", description: "Phone calls", status: "ACTIVE" },
    { name: "Meeting", description: "Internal or external meetings", status: "ACTIVE" },
    { name: "Shoot", description: "Production shoot", status: "ACTIVE" },
    { name: "Other", description: "Other breaks (requires purpose)", status: "ACTIVE" },
  ];

  for (const bt of breakTypes) {
    await prisma.breakType.upsert({
      where: { name: bt.name },
      update: { description: bt.description },
      create: bt,
    });
    console.log(`✓ BreakType upserted: ${bt.name}`);
  }

  // 3.5. Seed System Settings
  const hrSettings = [
    { key: "EXPECTED_WORKING_MINUTES", value: "510", description: "Expected daily working time (8h 30m)" },
    { key: "FIXED_LUNCH_START", value: "14:00", description: "Fixed lunch start time" },
    { key: "FIXED_LUNCH_END", value: "14:30", description: "Fixed lunch end time" },
    { key: "HALF_DAY_THRESHOLD_MINUTES", value: "255", description: "Minimum minutes for half day (4h 15m)" },
    { key: "GRACE_MINUTES", value: "15", description: "Grace period for late login" },
  ];

  for (const s of hrSettings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: { key: s.key, value: s.value, description: s.description },
    });
    console.log(`✓ SystemSetting upserted: ${s.key}`);
  }

  // 4. Seed Development Admin User
  const rawAdminPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!rawAdminPassword) {
    throw new Error(
      "ADMIN_SEED_PASSWORD environment variable is required to execute database seed. Please set ADMIN_SEED_PASSWORD in your environment."
    );
  }
  const passwordHash = await bcrypt.hash(rawAdminPassword, 10);

  const adminEmail = "admin@buzzspireworkhub.com";
  const adminEmployeeId = "EMP-001";
  const adminEmployeeCode = "ADM001";

  const adminUser = await prisma.employee.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      roleId: roleRecords[RoleName.ADMIN].id,
      departmentId: deptRecords["ENG"].id,
      fullName: "System Administrator",
      status: EmployeeStatus.ACTIVE,
    },
    create: {
      employeeId: adminEmployeeId,
      employeeCode: adminEmployeeCode,
      fullName: "System Administrator",
      email: adminEmail,
      phone: "+91 98765 43210",
      passwordHash,
      roleId: roleRecords[RoleName.ADMIN].id,
      departmentId: deptRecords["ENG"].id,
      designation: "Chief Technology Administrator",
      joiningDate: new Date("2024-01-01"),
      shiftStart: "09:00",
      shiftEnd: "18:00",
      status: EmployeeStatus.ACTIVE,
    },
  });

  console.log(`✓ Admin employee created/updated: ${adminUser.fullName} (${adminUser.email})`);

  // 5. Seed System Settings
  const settings = [
    { key: "company_name", value: "BuzzSpire WorkHub", description: "Company branding name" },
    { key: "work_hours_per_day", value: "8", description: "Required daily working hours" },
    { key: "max_failed_login_attempts", value: "5", description: "Failed attempts before lock" },
    { key: "account_lockout_minutes", value: "15", description: "Lockout duration in minutes" },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }
  console.log("✓ System settings seeded.");

  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
