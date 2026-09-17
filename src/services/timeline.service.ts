import { prisma } from "@/lib/prisma";

export type TimelineEventType = 
  | 'ATTENDANCE_PUNCH_IN' 
  | 'ATTENDANCE_PUNCH_OUT' 
  | 'BREAK_STARTED' 
  | 'BREAK_ENDED' 
  | 'IDLE_BREAK_STARTED' 
  | 'IDLE_BREAK_ENDED' 
  | 'WEBSITE_ACTIVITY' 
  | 'APPLICATION_ACTIVITY' 
  | 'SESSION_LOGIN' 
  | 'SESSION_LOGOUT' 
  | 'SESSION_RECOVERY'
  | 'OTHER_ACTIVITY';

export interface TimelineEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string | null;
  date: string;
  eventType: TimelineEventType;
  title: string;
  description: string;
  startedAt: Date;
  endedAt: Date | null;
  durationSeconds: number;
  source: string;
  metadata: any;
}

export class TimelineService {
  static async getEmployeeTimeline(employeeId: string, targetDate: Date): Promise<TimelineEvent[]> {
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { department: true }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const events: TimelineEvent[] = [];
    const baseInfo = {
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeCode: employee.employeeCode,
      department: employee.department?.name || null,
      date: startOfDay.toISOString().split("T")[0],
    };

    // 1. Fetch Attendances & Sessions
    const attendances = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        sessions: {
          include: {
            breaks: {
              include: {
                breakType: true
              }
            }
          }
        }
      }
    });

    for (const att of attendances) {
      for (const session of att.sessions) {
        // Punch In
        events.push({
          ...baseInfo,
          id: `punch-in-${session.id}`,
          eventType: 'ATTENDANCE_PUNCH_IN',
          title: 'Punch In',
          description: 'Employee started work session',
          startedAt: session.punchIn,
          endedAt: null,
          durationSeconds: 0,
          source: 'Attendance System',
          metadata: { attendanceId: att.id, sessionId: session.id }
        });

        // Punch Out
        if (session.punchOut) {
          events.push({
            ...baseInfo,
            id: `punch-out-${session.id}`,
            eventType: 'ATTENDANCE_PUNCH_OUT',
            title: 'Punch Out',
            description: 'Employee ended work session',
            startedAt: session.punchOut,
            endedAt: null,
            durationSeconds: 0,
            source: 'Attendance System',
            metadata: { attendanceId: att.id, sessionId: session.id }
          });
        }

        // Breaks
        for (const b of session.breaks) {
          const isIdle = b.breakType.name === "Idle Break" || b.breakType.name === "System Idle";
          const startType: TimelineEventType = isIdle ? 'IDLE_BREAK_STARTED' : 'BREAK_STARTED';
          const endType: TimelineEventType = isIdle ? 'IDLE_BREAK_ENDED' : 'BREAK_ENDED';
          
          events.push({
            ...baseInfo,
            id: `break-start-${b.id}`,
            eventType: startType,
            title: `${b.breakType.name} Started`,
            description: b.purpose || `Started ${b.breakType.name}`,
            startedAt: b.startTime,
            endedAt: null,
            durationSeconds: 0,
            source: 'Break System',
            metadata: { breakId: b.id }
          });

          if (b.endTime) {
            events.push({
              ...baseInfo,
              id: `break-end-${b.id}`,
              eventType: endType,
              title: `${b.breakType.name} Ended`,
              description: `Ended ${b.breakType.name}`,
              startedAt: b.endTime,
              endedAt: null,
              durationSeconds: b.durationSeconds,
              source: 'Break System',
              metadata: { breakId: b.id, durationSeconds: b.durationSeconds }
            });
          }
        }
      }
    }

    // 2. Fetch Activity Logs
    const activityLogs = await prisma.activityLog.findMany({
      where: {
        employeeId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    for (const log of activityLogs) {
      // Map action strings to event types
      let mappedType: TimelineEventType = 'OTHER_ACTIVITY';
      let title = log.action;
      
      const a = log.action.toUpperCase();
      if (a.includes('WEBSITE') || log.module.toUpperCase() === 'WEBSITE') {
        mappedType = 'WEBSITE_ACTIVITY';
        title = 'Website Activity';
      } else if (a.includes('APP') || a.includes('APPLICATION') || log.module.toUpperCase() === 'APPLICATION') {
        mappedType = 'APPLICATION_ACTIVITY';
        title = 'Application Activity';
      } else if (a.includes('LOGIN') && !a.includes('PUNCH')) {
        mappedType = 'SESSION_LOGIN';
        title = 'Session Login';
      } else if (a.includes('LOGOUT') && !a.includes('PUNCH')) {
        mappedType = 'SESSION_LOGOUT';
        title = 'Session Logout';
      } else if (a.includes('RECOVERY')) {
        mappedType = 'SESSION_RECOVERY';
        title = 'Session Recovery';
      }

      // Skip redundant BREAK or PUNCH activities if they are captured by the primary attendance loop
      if (a.includes('PUNCH') || a.includes('BREAK') || log.module.toUpperCase() === 'ATTENDANCE') {
        continue;
      }

      // Attempt to extract duration from metadata if present
      const meta = log.metadata as any;
      let durationSeconds = 0;
      let endedAt = null;
      if (meta && typeof meta.durationSeconds === 'number') {
        durationSeconds = meta.durationSeconds;
        endedAt = new Date(log.createdAt.getTime() + (durationSeconds * 1000));
      } else if (meta && meta.endedAt) {
        endedAt = new Date(meta.endedAt);
        durationSeconds = Math.floor((endedAt.getTime() - log.createdAt.getTime()) / 1000);
      }

      events.push({
        ...baseInfo,
        id: `activity-${log.id}`,
        eventType: mappedType,
        title,
        description: log.description,
        startedAt: log.createdAt,
        endedAt,
        durationSeconds,
        source: log.module,
        metadata: log.metadata
      });
    }

    // Sort chronologically
    events.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());

    return events;
  }
}
