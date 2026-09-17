import { signAuthToken, verifyAuthToken, getJwtSecretKey, AuthJwtPayload } from "./auth/jwt";
import { hashPassword, verifyPassword } from "./auth/password";
import { requireAuth, requireRole, getCurrentEmployee, getCurrentSession, CurrentEmployeeProfile } from "./auth/guard";

export {
  signAuthToken,
  verifyAuthToken,
  getJwtSecretKey,
  hashPassword,
  verifyPassword,
  requireAuth,
  requireRole,
  getCurrentEmployee,
  getCurrentSession,
};
export type { AuthJwtPayload, CurrentEmployeeProfile };

// Backward compatibility helper
export async function signJwt(payload: any, expiresIn: string = "1d") {
  return signAuthToken(
    {
      sub: payload.id || payload.sub,
      employeeId: payload.employeeId || payload.email || "",
      email: payload.email || "",
      role: payload.role || "EMPLOYEE",
      sessionId: payload.sessionId || "",
    },
    expiresIn
  );
}

export async function verifyJwt(token: string) {
  return verifyAuthToken(token);
}
