import { prisma } from "@/lib/prisma";
import { AuditService } from "@/services/audit.service";

// Allowed setting keys – extend this list as needed
export const ALLOWED_SETTING_KEYS = [
  "company_name",
  "company_email",
  "company_phone",
  "company_address",
  "company_website",
  "company_logo_url",
  "timezone",
  "date_format",
  "currency",
  "working_hours_per_day",
  "working_days_per_week",
  "default_shift_start",
  "default_shift_end",
  "attendance_grace_minutes",
  "max_leave_days_per_year",
  "leave_carry_forward",
  "payroll_day",
  "smtp_host",
  "smtp_port",
  "smtp_from_email",
  "enable_notifications",
  "maintenance_mode",
  "idle_monitoring_enabled",
  "idle_detection_threshold_minutes",
  "office_start_time",
  "office_end_time",
  "fixed_lunch_start_time",
  "fixed_lunch_end_time",
  "expected_work_minutes",
  "late_grace_minutes",
  "early_logout_grace_minutes",
  "half_day_threshold_minutes",
  "overtime_enabled",
  "salary_calculation_mode",
  "overtime_multiplier",
  "late_deduction_enabled",
  "early_logout_deduction_enabled",
  "shortfall_deduction_enabled",
  "half_day_deduction_enabled",
  "unpaid_leave_deduction_enabled"
] as const;

export type SettingKey = (typeof ALLOWED_SETTING_KEYS)[number];

export interface SettingRecord {
  key: string;
  value: string;
  description: string | null;
  updatedAt: Date;
}

export class SettingsService {
  /**
   * Retrieve all system settings as a flat key-value map.
   */
  static async getAll(): Promise<Record<string, SettingRecord>> {
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });

    return settings.reduce(
      (acc, s) => {
        acc[s.key] = {
          key: s.key,
          value: s.value,
          description: s.description,
          updatedAt: s.updatedAt,
        };
        return acc;
      },
      {} as Record<string, SettingRecord>
    );
  }

  /**
   * Retrieve a single setting by key.
   */
  static async get(key: string): Promise<string | null> {
    const setting = await prisma.systemSetting.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  /**
   * Upsert a single setting. Validates against allowed keys.
   */
  static async set(
    key: string,
    value: string,
    description?: string,
    actorEmployeeId?: string
  ): Promise<SettingRecord> {
    if (!ALLOWED_SETTING_KEYS.includes(key as SettingKey)) {
      throw new Error("INVALID_SETTING_KEY");
    }

    const trimmedValue = (value ?? "").toString().trim();

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value: trimmedValue, ...(description !== undefined ? { description } : {}) },
      create: {
        key,
        value: trimmedValue,
        description: description ?? null,
      },
    });

    // Fire-and-forget audit log
    AuditService.log({
      employeeId: actorEmployeeId,
      action: "UPDATE",
      module: "SETTINGS",
      description: `System setting '${key}' was updated`,
      metadata: { key, newValue: trimmedValue },
    }).catch(() => {});

    return {
      key: setting.key,
      value: setting.value,
      description: setting.description,
      updatedAt: setting.updatedAt,
    };
  }

  /**
   * Bulk upsert multiple settings in a single transaction.
   * Only keys present in ALLOWED_SETTING_KEYS are accepted.
   */
  static async bulkSet(
    updates: Record<string, string>,
    actorEmployeeId?: string
  ): Promise<{ updated: string[]; rejected: string[] }> {
    const updated: string[] = [];
    const rejected: string[] = [];

    const validEntries: { key: string; value: string }[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (ALLOWED_SETTING_KEYS.includes(key as SettingKey)) {
        validEntries.push({ key, value: (value ?? "").toString().trim() });
        updated.push(key);
      } else {
        rejected.push(key);
      }
    }

    if (validEntries.length > 0) {
      await prisma.$transaction(
        validEntries.map(({ key, value }) =>
          prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          })
        )
      );

      // Audit the bulk update
      AuditService.log({
        employeeId: actorEmployeeId,
        action: "BULK_UPDATE",
        module: "SETTINGS",
        description: `Bulk update of ${validEntries.length} system setting(s)`,
        metadata: { keys: updated },
      }).catch(() => {});
    }

    return { updated, rejected };
  }
}
