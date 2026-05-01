import type { AttendanceRecord } from '../types/attendance';
import { getCameras } from '../data/camerasStorage';
import { calculateLateness } from './lateness';

const pad = (n: number) => String(n).padStart(2, '0');

export type TodayStats = {
  atWork: number;
  cameToday: number;
  late: number;
  onTime: number;
  absent: number;
  lateRecords: Array<{ record: AttendanceRecord; minutes: number }>;
};

export function getTodayStats(workStart: string, records: AttendanceRecord[]): TodayStats {
  const todayRecords = records.filter(
    (r) => r.date === new Date().toISOString().split('T')[0]
  );
  const atWork = todayRecords.filter((r) => r.checkOut === null).length;

  const lateRecords: TodayStats['lateRecords'] = [];
  let late = 0;
  for (const r of todayRecords) {
    const l = calculateLateness(r.checkIn, workStart);
    if (l.late) {
      late += 1;
      lateRecords.push({ record: r, minutes: l.minutes });
    }
  }
  lateRecords.sort((a, b) => b.minutes - a.minutes);

  return {
    atWork,
    cameToday: todayRecords.length,
    late,
    onTime: todayRecords.length - late,
    absent: 0,
    lateRecords,
  };
}

export type MonthStats = {
  totalRecords: number;
  totalLate: number;
  mostLate: { name: string; count: number } | null;
  mostPunctual: { name: string; count: number } | null;
};

export function getMonthStats(workStart: string, records: AttendanceRecord[]): MonthStats {
  const now = new Date();
  const monthRecords = records.filter(
    (r) => r.date.startsWith(`${now.getFullYear()}-${pad(now.getMonth() + 1)}`)
  );

  const tally = new Map<string, { name: string; total: number; late: number }>();
  let totalLate = 0;

  for (const r of monthRecords) {
    const t = tally.get(r.userId) ?? { name: r.userName, total: 0, late: 0 };
    t.total += 1;
    if (calculateLateness(r.checkIn, workStart).late) {
      t.late += 1;
      totalLate += 1;
    }
    tally.set(r.userId, t);
  }

  let mostLate: MonthStats['mostLate'] = null;
  let mostPunctual: MonthStats['mostPunctual'] = null;

  for (const t of tally.values()) {
    if (!mostLate || t.late > mostLate.count) {
      mostLate = { name: t.name, count: t.late };
    }
    const punctual = t.total - t.late;
    if (!mostPunctual || punctual > mostPunctual.count) {
      mostPunctual = { name: t.name, count: punctual };
    }
  }

  if (mostLate && mostLate.count === 0) mostLate = null;

  return {
    totalRecords: monthRecords.length,
    totalLate,
    mostLate,
    mostPunctual,
  };
}

export type Last7DaysPoint = {
  date: string;
  count: number;
};

export function getLast7DaysCounts(records: AttendanceRecord[]): Last7DaysPoint[] {
  const points: Last7DaysPoint[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const count = records.filter((r) => r.date === key).length;
    points.push({ date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`, count });
  }

  return points;
}

export type CameraStats = {
  total: number;
  connected: number;
  disconnected: number;
};

export function getCameraStats(): CameraStats {
  const cameras = getCameras();
  return {
    total: cameras.length,
    connected: cameras.filter((c) => c.connected).length,
    disconnected: cameras.filter((c) => !c.connected).length,
  };
}
