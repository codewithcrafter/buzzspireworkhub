import { EmployeeService } from "./employee.service";
import { SessionService } from "./session.service";
import { AuditService } from "./audit.service";
import { ActivityService } from "./activity.service";
import { verifyPassword } from "@/lib/auth/password";
import { signAuthToken } from "@/lib/auth/jwt";

export interface LoginParams {
  identifier: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
  portalType?: "MANAGEMENT" | "EMPLOYEE";
}

export class AuthService {
  /**
   * Core login authentication service.
   */
  static async login(params: LoginParams) {
    const { identifier, password, ipAddress, userAgent, portalType } = params;

    if (!identifier || !password) {
      return {
        success: false as const,
        status: 400,
        code: "BAD_REQUEST",
        message: "Email or Employee ID and password are required.",
      };
    }

    // 1. Find employee
    const employee = await EmployeeService.findByIdentifier(identifier);

    if (!employee) {
      await AuditService.log({
        action: "LOGIN_FAILED",
        module: "AUTHENTICATION",
        description: `Failed login attempt for nonexistent identifier: ${identifier}`,
        ipAddress,
        userAgent,
      });

      return {
        success: false as const,
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials.",
      };
    }

    // 2. Check portal role authorization
    if (portalType === "MANAGEMENT" && employee.role.name === "EMPLOYEE") {
      await AuditService.log({
        employeeId: employee.id,
        action: "LOGIN_REJECTED_PORTAL_ROLE",
        module: "AUTHENTICATION",
        description: `Employee ${employee.fullName} attempted unauthorized login to Management Portal`,
        ipAddress,
        userAgent,
      });

      return {
        success: false as const,
        status: 403,
        code: "FORBIDDEN_PORTAL",
        message: "The Management Portal is reserved for Administrators and Managers. Please sign in via the Staff Portal.",
      };
    }

    // 3. Check account status
    const allowedStatuses = ["ACTIVE", "ONBOARDING", "PROBATION", "CONFIRMED", "RESIGNED", "NOTICE_PERIOD"];
    if (!allowedStatuses.includes(employee.status)) {
      await AuditService.log({
        employeeId: employee.id,
        action: "LOGIN_REJECTED",
        module: "AUTHENTICATION",
        description: `Login attempt for inactive account (${employee.status})`,
        ipAddress,
        userAgent,
      });

      return {
        success: false as const,
        status: 403,
        code: "ACCOUNT_INACTIVE",
        message: "Your account is inactive or suspended. Please contact your system administrator.",
      };
    }

    // 4. Check account lockout
    if (employee.lockedUntil && employee.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (employee.lockedUntil.getTime() - Date.now()) / (1000 * 60)
      );

      await AuditService.log({
        employeeId: employee.id,
        action: "LOGIN_BLOCKED_LOCKOUT",
        module: "AUTHENTICATION",
        description: `Blocked login attempt for locked account (${remainingMinutes} mins remaining)`,
        ipAddress,
        userAgent,
      });

      return {
        success: false as const,
        status: 423,
        code: "ACCOUNT_LOCKED",
        message: `Account is temporarily locked due to multiple failed login attempts. Try again in ${remainingMinutes} minute(s).`,
      };
    }

    // 4. Verify password
    const isPasswordValid = await verifyPassword(password, employee.passwordHash);

    if (!isPasswordValid) {
      const lockResult = await EmployeeService.recordFailedAttempt(
        employee.id,
        employee.failedLoginAttempts
      );

      await AuditService.log({
        employeeId: employee.id,
        action: "LOGIN_FAILED_PASSWORD",
        module: "AUTHENTICATION",
        description: `Failed password attempt (${lockResult.attempts}/5)`,
        ipAddress,
        userAgent,
      });

      if (lockResult.isLocked) {
        return {
          success: false as const,
          status: 423,
          code: "ACCOUNT_LOCKED",
          message: "Account has been locked due to 5 consecutive failed login attempts. Please try again in 15 minutes.",
        };
      }

      return {
        success: false as const,
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials.",
      };
    }

    // 5. Successful password -> update login state
    await EmployeeService.updateLastLogin(employee.id);

    // 6. Create LoginSession in database
    const session = await SessionService.create(employee.id, ipAddress, userAgent);

    // 7. Generate JWT token
    const token = await signAuthToken({
      sub: employee.id,
      employeeId: employee.employeeId,
      email: employee.email,
      role: employee.role.name,
      sessionId: session.id,
    });

    // 8. Log audit & activity events
    await AuditService.log({
      employeeId: employee.id,
      action: "LOGIN_SUCCESS",
      module: "AUTHENTICATION",
      description: `User ${employee.fullName} logged in successfully`,
      ipAddress,
      userAgent,
      metadata: { sessionId: session.id, role: employee.role.name },
    });

    await ActivityService.log({
      employeeId: employee.id,
      action: "EMPLOYEE_LOGIN",
      module: "AUTHENTICATION",
      description: `${employee.fullName} signed in`,
    });

    // 9. Return safe employee profile + token
    const safeUser = EmployeeService.sanitizeEmployee(employee);

    return {
      success: true as const,
      status: 200,
      token,
      user: safeUser,
      sessionId: session.id,
    };
  }
}
