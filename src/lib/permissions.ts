/**
 * WorkHub Permissions — re-exported from the canonical auth/permissions module.
 *
 * The original contents of this file were agency-era (Leads, CMS, Blog, Case
 * Studies) and have been replaced with the WorkHub permission system used
 * throughout Phase 3-6 routes.
 *
 * Import from here for backward compatibility with any legacy callers,
 * or import directly from "@/lib/auth/permissions" in new code.
 */
export {
  type Permission,
  type AllowedRole,
  hasPermission,
  hasRole,
  canAccessEmployee,
  can,
  getAuthSession,
  requireAuth,
  requireRole,
  requirePermission,
  ROLE_PERMISSIONS,
} from "./auth/permissions";

// ─── Legacy agency shims ────────────────────────────────────────────────────
// Some older admin routes (pre-Phase-6) still import these names.
// They are preserved here as no-op / empty stubs so TypeScript is satisfied
// while those routes undergo gradual migration.

/**
 * @deprecated Agency-era permission constants. No longer used by WorkHub routes.
 */
export const PERMISSIONS = {} as Record<string, string>;

/**
 * @deprecated Agency-era helper. Returns an empty array — permissions are now
 * role-based (see ROLE_PERMISSIONS in auth/permissions.ts).
 */
export function sanitizePermissions(_permissions: unknown): string[] {
  return [];
}
