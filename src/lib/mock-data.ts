/**
 * BUZZSPIRE WORKHUB - Centralized Enterprise Mock Data Layer (Phase 2 UI/UX)
 *
 * Provides realistic, strongly-typed enterprise data for all dashboard pages,
 * tables, filters, and modals. Structured to mirror Prisma models for seamless
 * API connection in future phases.
 */

export interface MockEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
  designation: string;
  joiningDate: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatarInitials: string;
  avatarBg: string;
  location: string;
  shift: string;
}

export interface MockDepartment {
  id: string;
  code: string;
  name: string;
  managerName: string;
  managerEmail: string;
  employeeCount: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
}

export interface MockAttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string;
  breakDuration: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE" | "HALF_DAY";
  liveState?: "WORKING" | "ON_BREAK" | "COMPLETED" | "NOT_PUNCHED_IN";
}

export interface MockLeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveType: "ANNUAL" | "CASUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID";
  startDate: string;
  endDate: string;
  duration: number; // in days
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  appliedOn: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface MockHoliday {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  type: "NATIONAL" | "PUBLIC" | "COMPANY" | "OPTIONAL";
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface MockAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actorEmail: string;
  action: string;
  module: "AUTHENTICATION" | "ATTENDANCE" | "EMPLOYEE" | "LEAVE" | "SETTINGS" | "DEPARTMENT";
  resource: string;
  description: string;
  status: "SUCCESS" | "WARNING" | "FAILURE";
  ipAddress: string;
  requestId: string;
  metadata?: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEPARTMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_DEPARTMENTS: MockDepartment[] = [
  {
    id: "dept-eng",
    code: "ENG",
    name: "Engineering",
    managerName: "Vikram Malhotra",
    managerEmail: "vikram.m@buzzspire.com",
    employeeCount: 19,
    status: "ACTIVE",
    description: "Full-stack development, cloud architecture, DevOps, and quality assurance.",
  },
  {
    id: "dept-des",
    code: "DES",
    name: "Product & Design",
    managerName: "Ananya Iyer",
    managerEmail: "ananya.i@buzzspire.com",
    employeeCount: 8,
    status: "ACTIVE",
    description: "User research, UI design, brand systems, and UX prototyping.",
  },
  {
    id: "dept-mkt",
    code: "MKT",
    name: "Marketing & Growth",
    managerName: "Rohan Kapoor",
    managerEmail: "rohan.k@buzzspire.com",
    employeeCount: 11,
    status: "ACTIVE",
    description: "Performance marketing, SEO, brand communications, and partnerships.",
  },
  {
    id: "dept-ops",
    code: "HR",
    name: "HR & Operations",
    managerName: "Sunita Rao",
    managerEmail: "sunita.r@buzzspire.com",
    employeeCount: 6,
    status: "ACTIVE",
    description: "Talent acquisition, employee welfare, payroll, and workplace administration.",
  },
  {
    id: "dept-cs",
    code: "CS",
    name: "Customer Success",
    managerName: "Devansh Nair",
    managerEmail: "devansh.n@buzzspire.com",
    employeeCount: 8,
    status: "ACTIVE",
    description: "Client onboarding, account management, support desk, and retention.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. EMPLOYEES
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "emp-101",
    employeeId: "EMP-101",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@buzzspire.com",
    phone: "+91 98765 43210",
    departmentId: "dept-eng",
    departmentName: "Engineering",
    role: "ADMIN",
    designation: "Principal Architect & Lead",
    joiningDate: "2023-04-10",
    status: "ACTIVE",
    avatarInitials: "RS",
    avatarBg: "bg-indigo-600",
    location: "Gurugram, HR (Hybrid)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-102",
    employeeId: "EMP-102",
    fullName: "Priya Patel",
    email: "priya.patel@buzzspire.com",
    phone: "+91 98765 43211",
    departmentId: "dept-des",
    departmentName: "Product & Design",
    role: "EMPLOYEE",
    designation: "Lead Product Designer",
    joiningDate: "2023-08-15",
    status: "ACTIVE",
    avatarInitials: "PP",
    avatarBg: "bg-violet-600",
    location: "New Delhi (On-site)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-103",
    employeeId: "EMP-103",
    fullName: "Vikram Malhotra",
    email: "vikram.m@buzzspire.com",
    phone: "+91 98765 43212",
    departmentId: "dept-eng",
    departmentName: "Engineering",
    role: "MANAGER",
    designation: "VP of Engineering",
    joiningDate: "2022-02-01",
    status: "ACTIVE",
    avatarInitials: "VM",
    avatarBg: "bg-blue-600",
    location: "Bengaluru, KA (Remote)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-104",
    employeeId: "EMP-104",
    fullName: "Sunita Rao",
    email: "sunita.r@buzzspire.com",
    phone: "+91 98765 43213",
    departmentId: "dept-ops",
    departmentName: "HR & Operations",
    role: "HR_MANAGER",
    designation: "Head of People & Operations",
    joiningDate: "2022-06-12",
    status: "ACTIVE",
    avatarInitials: "SR",
    avatarBg: "bg-emerald-600",
    location: "New Delhi (On-site)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-105",
    employeeId: "EMP-105",
    fullName: "Aman Gupta",
    email: "aman.gupta@buzzspire.com",
    phone: "+91 98765 43214",
    departmentId: "dept-eng",
    departmentName: "Engineering",
    role: "EMPLOYEE",
    designation: "Senior Frontend Engineer",
    joiningDate: "2024-01-10",
    status: "ACTIVE",
    avatarInitials: "AG",
    avatarBg: "bg-amber-600",
    location: "Noida, UP (Hybrid)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-106",
    employeeId: "EMP-106",
    fullName: "Neha Verma",
    email: "neha.verma@buzzspire.com",
    phone: "+91 98765 43215",
    departmentId: "dept-ops",
    departmentName: "HR & Operations",
    role: "EMPLOYEE",
    designation: "HR Generalist",
    joiningDate: "2024-03-01",
    status: "ACTIVE",
    avatarInitials: "NV",
    avatarBg: "bg-rose-600",
    location: "New Delhi (On-site)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-107",
    employeeId: "EMP-107",
    fullName: "Karan Singh",
    email: "karan.singh@buzzspire.com",
    phone: "+91 98765 43216",
    departmentId: "dept-eng",
    departmentName: "Engineering",
    role: "EMPLOYEE",
    designation: "DevOps & Cloud Engineer",
    joiningDate: "2023-11-20",
    status: "ACTIVE",
    avatarInitials: "KS",
    avatarBg: "bg-cyan-600",
    location: "Remote",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-108",
    employeeId: "EMP-108",
    fullName: "Ananya Iyer",
    email: "ananya.i@buzzspire.com",
    phone: "+91 98765 43217",
    departmentId: "dept-des",
    departmentName: "Product & Design",
    role: "MANAGER",
    designation: "Director of Product",
    joiningDate: "2022-09-01",
    status: "ACTIVE",
    avatarInitials: "AI",
    avatarBg: "bg-fuchsia-600",
    location: "Bengaluru, KA (Remote)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-109",
    employeeId: "EMP-109",
    fullName: "Rohan Kapoor",
    email: "rohan.k@buzzspire.com",
    phone: "+91 98765 43218",
    departmentId: "dept-mkt",
    departmentName: "Marketing & Growth",
    role: "MANAGER",
    designation: "Head of Marketing",
    joiningDate: "2023-01-15",
    status: "ACTIVE",
    avatarInitials: "RK",
    avatarBg: "bg-orange-600",
    location: "Mumbai, MH (Hybrid)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-110",
    employeeId: "EMP-110",
    fullName: "Meera Nair",
    email: "meera.nair@buzzspire.com",
    phone: "+91 98765 43219",
    departmentId: "dept-mkt",
    departmentName: "Marketing & Growth",
    role: "EMPLOYEE",
    designation: "Growth Marketing Specialist",
    joiningDate: "2024-05-10",
    status: "ACTIVE",
    avatarInitials: "MN",
    avatarBg: "bg-teal-600",
    location: "New Delhi (On-site)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-111",
    employeeId: "EMP-111",
    fullName: "Devansh Nair",
    email: "devansh.n@buzzspire.com",
    phone: "+91 98765 43220",
    departmentId: "dept-cs",
    departmentName: "Customer Success",
    role: "MANAGER",
    designation: "Customer Success Lead",
    joiningDate: "2023-03-01",
    status: "ACTIVE",
    avatarInitials: "DN",
    avatarBg: "bg-indigo-700",
    location: "Gurugram, HR (Hybrid)",
    shift: "General (09:00 - 18:00)",
  },
  {
    id: "emp-112",
    employeeId: "EMP-112",
    fullName: "Siddharth Joshi",
    email: "siddharth.j@buzzspire.com",
    phone: "+91 98765 43221",
    departmentId: "dept-eng",
    departmentName: "Engineering",
    role: "EMPLOYEE",
    designation: "QA & Automation Engineer",
    joiningDate: "2024-06-15",
    status: "INACTIVE",
    avatarInitials: "SJ",
    avatarBg: "bg-slate-600",
    location: "Pune, MH (Remote)",
    shift: "General (09:00 - 18:00)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. TODAY'S ATTENDANCE RECORDS
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_ATTENDANCE_TODAY: MockAttendanceRecord[] = [
  {
    id: "att-001",
    employeeId: "emp-101",
    employeeName: "Rahul Sharma",
    employeeCode: "EMP-101",
    department: "Engineering",
    date: "2026-09-16",
    checkIn: "08:55 AM",
    checkOut: null,
    workingHours: "6h 25m",
    breakDuration: "45m",
    status: "PRESENT",
    liveState: "WORKING",
  },
  {
    id: "att-002",
    employeeId: "emp-102",
    employeeName: "Priya Patel",
    employeeCode: "EMP-102",
    department: "Product & Design",
    date: "2026-09-16",
    checkIn: "09:02 AM",
    checkOut: null,
    workingHours: "6h 18m",
    breakDuration: "35m",
    status: "PRESENT",
    liveState: "ON_BREAK",
  },
  {
    id: "att-003",
    employeeId: "emp-103",
    employeeName: "Vikram Malhotra",
    employeeCode: "EMP-103",
    department: "Engineering",
    date: "2026-09-16",
    checkIn: "08:45 AM",
    checkOut: null,
    workingHours: "6h 35m",
    breakDuration: "50m",
    status: "PRESENT",
    liveState: "WORKING",
  },
  {
    id: "att-004",
    employeeId: "emp-104",
    employeeName: "Sunita Rao",
    employeeCode: "EMP-104",
    department: "HR & Operations",
    date: "2026-09-16",
    checkIn: "09:00 AM",
    checkOut: null,
    workingHours: "6h 20m",
    breakDuration: "40m",
    status: "PRESENT",
    liveState: "WORKING",
  },
  {
    id: "att-005",
    employeeId: "emp-105",
    employeeName: "Aman Gupta",
    employeeCode: "EMP-105",
    department: "Engineering",
    date: "2026-09-16",
    checkIn: "09:24 AM",
    checkOut: null,
    workingHours: "5h 56m",
    breakDuration: "30m",
    status: "LATE",
    liveState: "WORKING",
  },
  {
    id: "att-006",
    employeeId: "emp-106",
    employeeName: "Neha Verma",
    employeeCode: "EMP-106",
    department: "HR & Operations",
    date: "2026-09-16",
    checkIn: "09:18 AM",
    checkOut: null,
    workingHours: "6h 02m",
    breakDuration: "25m",
    status: "LATE",
    liveState: "WORKING",
  },
  {
    id: "att-007",
    employeeId: "emp-107",
    employeeName: "Karan Singh",
    employeeCode: "EMP-107",
    department: "Engineering",
    date: "2026-09-16",
    checkIn: "08:50 AM",
    checkOut: null,
    workingHours: "6h 30m",
    breakDuration: "45m",
    status: "PRESENT",
    liveState: "WORKING",
  },
  {
    id: "att-008",
    employeeId: "emp-108",
    employeeName: "Ananya Iyer",
    employeeCode: "EMP-108",
    department: "Product & Design",
    date: "2026-09-16",
    checkIn: "09:05 AM",
    checkOut: null,
    workingHours: "6h 15m",
    breakDuration: "40m",
    status: "PRESENT",
    liveState: "ON_BREAK",
  },
  {
    id: "att-009",
    employeeId: "emp-109",
    employeeName: "Rohan Kapoor",
    employeeCode: "EMP-109",
    department: "Marketing & Growth",
    date: "2026-09-16",
    checkIn: "09:35 AM",
    checkOut: null,
    workingHours: "5h 45m",
    breakDuration: "20m",
    status: "LATE",
    liveState: "WORKING",
  },
  {
    id: "att-010",
    employeeId: "emp-110",
    employeeName: "Meera Nair",
    employeeCode: "EMP-110",
    department: "Marketing & Growth",
    date: "2026-09-16",
    checkIn: null,
    checkOut: null,
    workingHours: "0h 0m",
    breakDuration: "0m",
    status: "ON_LEAVE",
    liveState: "NOT_PUNCHED_IN",
  },
  {
    id: "att-011",
    employeeId: "emp-111",
    employeeName: "Devansh Nair",
    employeeCode: "EMP-111",
    department: "Customer Success",
    date: "2026-09-16",
    checkIn: "08:40 AM",
    checkOut: "05:10 PM",
    workingHours: "8h 30m",
    breakDuration: "60m",
    status: "PRESENT",
    liveState: "COMPLETED",
  },
  {
    id: "att-012",
    employeeId: "emp-112",
    employeeName: "Siddharth Joshi",
    employeeCode: "EMP-112",
    department: "Engineering",
    date: "2026-09-16",
    checkIn: null,
    checkOut: null,
    workingHours: "0h 0m",
    breakDuration: "0m",
    status: "ABSENT",
    liveState: "NOT_PUNCHED_IN",
  },
];

export const MOCK_ATTENDANCE = MOCK_ATTENDANCE_TODAY;

// ─────────────────────────────────────────────────────────────────────────────
// 4. PERSONAL ATTENDANCE HISTORY (MY HISTORY)
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_PERSONAL_HISTORY = [
  {
    date: "2026-09-16",
    day: "Wednesday",
    checkIn: "08:55 AM",
    checkOut: "In Progress",
    breakDuration: "45 mins",
    workingHours: "6h 25m",
    status: "PRESENT",
  },
  {
    date: "2026-09-15",
    day: "Tuesday",
    checkIn: "08:58 AM",
    checkOut: "06:05 PM",
    breakDuration: "50 mins",
    workingHours: "8h 17m",
    status: "PRESENT",
  },
  {
    date: "2026-09-14",
    day: "Monday",
    checkIn: "09:18 AM",
    checkOut: "06:30 PM",
    breakDuration: "55 mins",
    workingHours: "8h 17m",
    status: "LATE",
  },
  {
    date: "2026-09-11",
    day: "Friday",
    checkIn: "08:50 AM",
    checkOut: "06:10 PM",
    breakDuration: "60 mins",
    workingHours: "8h 20m",
    status: "PRESENT",
  },
  {
    date: "2026-09-10",
    day: "Thursday",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    breakDuration: "45 mins",
    workingHours: "8h 15m",
    status: "PRESENT",
  },
  {
    date: "2026-09-09",
    day: "Wednesday",
    checkIn: "08:52 AM",
    checkOut: "06:15 PM",
    breakDuration: "45 mins",
    workingHours: "8h 38m",
    status: "PRESENT",
  },
  {
    date: "2026-09-08",
    day: "Tuesday",
    checkIn: "-",
    checkOut: "-",
    breakDuration: "0 mins",
    workingHours: "0h 0m",
    status: "ON_LEAVE",
  },
  {
    date: "2026-09-07",
    day: "Monday",
    checkIn: "09:22 AM",
    checkOut: "06:40 PM",
    breakDuration: "50 mins",
    workingHours: "8h 28m",
    status: "LATE",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. LEAVE REQUESTS
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_LEAVES: MockLeaveRequest[] = [
  {
    id: "leave-01",
    employeeId: "emp-105",
    employeeName: "Aman Gupta",
    employeeCode: "EMP-105",
    department: "Engineering",
    leaveType: "CASUAL",
    startDate: "2026-09-21",
    endDate: "2026-09-22",
    duration: 2,
    reason: "Personal family event in hometown. Work handover completed to Karan.",
    status: "PENDING",
    appliedOn: "2026-09-14",
  },
  {
    id: "leave-02",
    employeeId: "emp-110",
    employeeName: "Meera Nair",
    employeeCode: "EMP-110",
    department: "Marketing & Growth",
    leaveType: "SICK",
    startDate: "2026-09-16",
    endDate: "2026-09-17",
    duration: 2,
    reason: "Viral fever and physician recommended rest.",
    status: "APPROVED",
    appliedOn: "2026-09-15",
    reviewedBy: "Sunita Rao (HR)",
  },
  {
    id: "leave-03",
    employeeId: "emp-102",
    employeeName: "Priya Patel",
    employeeCode: "EMP-102",
    department: "Product & Design",
    leaveType: "ANNUAL",
    startDate: "2026-10-05",
    endDate: "2026-10-09",
    duration: 5,
    reason: "Planned annual vacation with family.",
    status: "APPROVED",
    appliedOn: "2026-09-01",
    reviewedBy: "Ananya Iyer (Director)",
  },
  {
    id: "leave-04",
    employeeId: "emp-107",
    employeeName: "Karan Singh",
    employeeCode: "EMP-107",
    department: "Engineering",
    leaveType: "CASUAL",
    startDate: "2026-09-18",
    endDate: "2026-09-18",
    duration: 1,
    reason: "Bank documentation and driving license renewal.",
    status: "PENDING",
    appliedOn: "2026-09-15",
  },
  {
    id: "leave-05",
    employeeId: "emp-112",
    employeeName: "Siddharth Joshi",
    employeeCode: "EMP-112",
    department: "Engineering",
    leaveType: "UNPAID",
    startDate: "2026-08-20",
    endDate: "2026-08-22",
    duration: 3,
    reason: "Urgent relocation assistance.",
    status: "REJECTED",
    appliedOn: "2026-08-18",
    reviewedBy: "Vikram Malhotra (VP)",
    rejectionReason: "Sprint release scheduled during the requested dates.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. HOLIDAYS (2026)
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_HOLIDAYS: MockHoliday[] = [
  {
    id: "hol-01",
    name: "Republic Day",
    date: "2026-01-26",
    dayOfWeek: "Monday",
    type: "NATIONAL",
    description: "Honoring the date on which the Constitution of India came into effect.",
    status: "ACTIVE",
  },
  {
    id: "hol-02",
    name: "Maha Shivratri",
    date: "2026-02-17",
    dayOfWeek: "Tuesday",
    type: "PUBLIC",
    description: "Annual festival in reverence of Lord Shiva.",
    status: "ACTIVE",
  },
  {
    id: "hol-03",
    name: "Holi (Festival of Colors)",
    date: "2026-03-04",
    dayOfWeek: "Wednesday",
    type: "PUBLIC",
    description: "Celebration of the triumph of good over evil and the arrival of spring.",
    status: "ACTIVE",
  },
  {
    id: "hol-04",
    name: "Id-ul-Fitr",
    date: "2026-03-21",
    dayOfWeek: "Saturday",
    type: "PUBLIC",
    description: "Religious holiday celebrated by Muslims worldwide.",
    status: "ACTIVE",
  },
  {
    id: "hol-05",
    name: "Independence Day",
    date: "2026-08-15",
    dayOfWeek: "Saturday",
    type: "NATIONAL",
    description: "Commemorating India's independence from the United Kingdom in 1947.",
    status: "ACTIVE",
  },
  {
    id: "hol-06",
    name: "Mahatma Gandhi Birthday",
    date: "2026-10-02",
    dayOfWeek: "Friday",
    type: "NATIONAL",
    description: "National event honoring Mahatma Gandhi, leader of Indian independence.",
    status: "ACTIVE",
  },
  {
    id: "hol-07",
    name: "Dussehra (Vijayadashami)",
    date: "2026-10-20",
    dayOfWeek: "Tuesday",
    type: "PUBLIC",
    description: "Signifying the victory of good over evil.",
    status: "ACTIVE",
  },
  {
    id: "hol-08",
    name: "Diwali (Deepavali)",
    date: "2026-11-08",
    dayOfWeek: "Sunday",
    type: "PUBLIC",
    description: "The Festival of Lights symbolizing knowledge and virtue.",
    status: "ACTIVE",
  },
  {
    id: "hol-09",
    name: "BuzzSpire Foundation Day",
    date: "2026-11-20",
    dayOfWeek: "Friday",
    type: "COMPANY",
    description: "Annual company-wide celebration and wellness holiday.",
    status: "ACTIVE",
  },
  {
    id: "hol-10",
    name: "Christmas Day",
    date: "2026-12-25",
    dayOfWeek: "Friday",
    type: "PUBLIC",
    description: "Annual festival commemorating the birth of Jesus Christ.",
    status: "ACTIVE",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS: MockAuditLog[] = [
  {
    id: "audit-01",
    timestamp: "2026-09-16 09:30:14",
    actorName: "Sunita Rao",
    actorRole: "HR_MANAGER",
    actorEmail: "sunita.r@buzzspire.com",
    action: "LEAVE_APPROVED",
    module: "LEAVE",
    resource: "LeaveRequest #leave-02",
    description: "Approved sick leave for Meera Nair (2 days)",
    status: "SUCCESS",
    ipAddress: "192.168.1.45",
    requestId: "req_9f3a8b1c4e20",
    metadata: { leaveId: "leave-02", duration: 2, leaveType: "SICK" },
  },
  {
    id: "audit-02",
    timestamp: "2026-09-16 09:24:02",
    actorName: "Aman Gupta",
    actorRole: "EMPLOYEE",
    actorEmail: "aman.gupta@buzzspire.com",
    action: "PUNCH_IN_LATE",
    module: "ATTENDANCE",
    resource: "Attendance #att-005",
    description: "Punched in late (09:24 AM) within grace period threshold",
    status: "WARNING",
    ipAddress: "192.168.1.88",
    requestId: "req_8e2b7c0d3a19",
    metadata: { punchIn: "09:24:02", delayMinutes: 9 },
  },
  {
    id: "audit-03",
    timestamp: "2026-09-16 08:55:10",
    actorName: "Rahul Sharma",
    actorRole: "ADMIN",
    actorEmail: "rahul.sharma@buzzspire.com",
    action: "LOGIN_SUCCESS",
    module: "AUTHENTICATION",
    resource: "Session #sess-101",
    description: "Administrator signed in via corporate web portal",
    status: "SUCCESS",
    ipAddress: "192.168.1.12",
    requestId: "req_7d1a6b9c2f18",
    metadata: { role: "ADMIN", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64)" },
  },
  {
    id: "audit-04",
    timestamp: "2026-09-15 16:45:30",
    actorName: "Rahul Sharma",
    actorRole: "ADMIN",
    actorEmail: "rahul.sharma@buzzspire.com",
    action: "SETTINGS_UPDATE",
    module: "SETTINGS",
    resource: "SystemSetting #grace_period",
    description: "Updated attendance grace period from 10 to 15 minutes",
    status: "SUCCESS",
    ipAddress: "192.168.1.12",
    requestId: "req_6c0a5b8e1e17",
    metadata: { key: "attendance_grace_minutes", oldValue: "10", newValue: "15" },
  },
  {
    id: "audit-05",
    timestamp: "2026-09-15 11:20:00",
    actorName: "Sunita Rao",
    actorRole: "HR_MANAGER",
    actorEmail: "sunita.r@buzzspire.com",
    action: "EMPLOYEE_UPDATED",
    module: "EMPLOYEE",
    resource: "Employee #emp-105",
    description: "Updated salary band and designation for Aman Gupta",
    status: "SUCCESS",
    ipAddress: "192.168.1.45",
    requestId: "req_5b9f4a7d0d16",
    metadata: { employeeId: "emp-105", field: "designation" },
  },
  {
    id: "audit-06",
    timestamp: "2026-09-15 09:12:45",
    actorName: "System Security",
    actorRole: "SYSTEM",
    actorEmail: "security@buzzspire.com",
    action: "LOGIN_ATTEMPT_FAILED",
    module: "AUTHENTICATION",
    resource: "Account #emp-112",
    description: "Failed password attempt for Siddharth Joshi (1/5)",
    status: "FAILURE",
    ipAddress: "203.0.113.54",
    requestId: "req_4a8e3b6c9c15",
    metadata: { failureReason: "INVALID_CREDENTIALS", clientIp: "203.0.113.54" },
  },
  {
    id: "audit-07",
    timestamp: "2026-09-14 17:30:12",
    actorName: "Vikram Malhotra",
    actorRole: "MANAGER",
    actorEmail: "vikram.m@buzzspire.com",
    action: "DEPARTMENT_ROSTER_UPDATED",
    module: "DEPARTMENT",
    resource: "Department #dept-eng",
    description: "Reassigned 2 junior engineers to Core Infrastructure squad",
    status: "SUCCESS",
    ipAddress: "192.168.1.72",
    requestId: "req_3d7e2a5b8b14",
    metadata: { departmentCode: "ENG", membersUpdated: 2 },
  },
  {
    id: "audit-08",
    timestamp: "2026-09-14 14:15:00",
    actorName: "Sunita Rao",
    actorRole: "HR_MANAGER",
    actorEmail: "sunita.r@buzzspire.com",
    action: "LEAVE_REJECTED",
    module: "LEAVE",
    resource: "LeaveRequest #leave-04",
    description: "Rejected annual leave request due to overlapping milestone delivery",
    status: "WARNING",
    ipAddress: "192.168.1.45",
    requestId: "req_2c6d1f4a7a13",
    metadata: { leaveId: "leave-04", reason: "Critical sprint deadline" },
  },
  {
    id: "audit-09",
    timestamp: "2026-09-13 18:05:22",
    actorName: "Devansh Nair",
    actorRole: "MANAGER",
    actorEmail: "devansh.n@buzzspire.com",
    action: "PUNCH_OUT_MANUAL",
    module: "ATTENDANCE",
    resource: "Attendance #att-024",
    description: "Manual check-out recorded after field meeting with client",
    status: "SUCCESS",
    ipAddress: "192.168.1.91",
    requestId: "req_1b5c0e3f6f12",
    metadata: { checkOut: "18:05:00", verifiedByManager: true },
  },
  {
    id: "audit-10",
    timestamp: "2026-09-12 10:00:00",
    actorName: "Rahul Sharma",
    actorRole: "ADMIN",
    actorEmail: "rahul.sharma@buzzspire.com",
    action: "HOLIDAY_CREATED",
    module: "SETTINGS",
    resource: "Holiday #hol-2026-10",
    description: "Added Dussehra public holiday for October 20, 2026",
    status: "SUCCESS",
    ipAddress: "192.168.1.12",
    requestId: "req_0a4b9d2e5e11",
    metadata: { holidayDate: "2026-10-20", holidayType: "PUBLIC" },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. SYSTEM SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_SETTINGS = {
  general: {
    companyName: "BuzzSpire WorkHub Enterprise",
    companyEmail: "admin@buzzspireworkhub.com",
    timezone: "Asia/Kolkata (IST)",
    dateFormat: "DD/MM/YYYY",
    currency: "INR (₹)",
    fiscalYearStart: "April",
  },
  attendance: {
    workStartTime: "09:00",
    workEndTime: "18:00",
    workingHoursPerDay: "8.0",
    workingDaysPerWeek: "5",
    gracePeriodMinutes: 15,
    lateArrivalRules: "Marked LATE after 09:15 AM; 3 late arrivals equal 0.5 day deduction",
    autoClockOutEnabled: true,
    autoClockOutTime: "22:00",
  },
  breaks: {
    allowedBreakDurationMinutes: 60,
    maxBreaksPerDay: 3,
    lunchWindowStart: "13:00",
    lunchWindowEnd: "14:30",
    deductExceededBreaks: true,
  },
  notifications: {
    dailyPunchReminder: true,
    reminderTime: "08:45",
    leaveStatusAlerts: true,
    missedPunchAlerts: true,
    weeklyManagerDigest: true,
  },
  security: {
    sessionTimeoutHours: 24,
    requireSpecialChar: true,
    minPasswordLength: 8,
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 15,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. RECENT ACTIVITY TIMELINE
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_RECENT_ACTIVITY = [
  {
    id: "act-1",
    actor: "Rahul Sharma",
    role: "Principal Architect",
    action: "Clocked in on time (08:55 AM)",
    time: "35 minutes ago",
    type: "ATTENDANCE",
  },
  {
    id: "act-2",
    actor: "Priya Patel",
    role: "Lead Designer",
    action: "Started Morning Coffee Break",
    time: "48 minutes ago",
    type: "BREAK",
  },
  {
    id: "act-3",
    actor: "Sunita Rao",
    role: "HR Manager",
    action: "Approved Leave Request for Meera Nair",
    time: "1 hour ago",
    type: "LEAVE",
  },
  {
    id: "act-4",
    actor: "Aman Gupta",
    role: "Frontend Engineer",
    action: "Clocked in with Grace Period (09:24 AM)",
    time: "2 hours ago",
    type: "LATE",
  },
  {
    id: "act-5",
    actor: "Karan Singh",
    role: "DevOps Engineer",
    action: "Submitted Casual Leave Application for Sep 18",
    time: "3 hours ago",
    type: "LEAVE",
  },
];
