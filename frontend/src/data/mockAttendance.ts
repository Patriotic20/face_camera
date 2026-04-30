import type { AttendanceRecord } from '../types/attendance';
import { getCameras } from './camerasStorage';
import { USERS, userFullName } from './users';

const pad = (n: number) => String(n).padStart(2, '0');
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const pickRandom = <T>(arr: T[]): T | null =>
  arr.length === 0 ? null : arr[Math.floor(Math.random() * arr.length)];

function generateRecords(): AttendanceRecord[] {
  const cameras = getCameras();
  const enterCams = cameras.filter((c) => c.type === 'enter');
  const exitCams = cameras.filter((c) => c.type === 'exit');

  const records: AttendanceRecord[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 60);

  let idCounter = 1;

  for (let i = 0; i < 60; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    if (day.getDay() === 0 || day.getDay() === 6) continue;

    const usersToday = [...USERS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 4));

    for (const user of usersToday) {
      const inHour = 8 + Math.floor(Math.random() * 2);
      const inMin = Math.floor(Math.random() * 60);
      const outHour = 17 + Math.floor(Math.random() * 2);
      const outMin = Math.floor(Math.random() * 60);
      const hasCheckOut = Math.random() > 0.1;

      records.push({
        id: `r${idCounter++}`,
        userId: user.id,
        userName: userFullName(user),
        date: formatDate(day),
        checkIn: `${pad(inHour)}:${pad(inMin)}`,
        checkOut: hasCheckOut ? `${pad(outHour)}:${pad(outMin)}` : null,
        enterCameraId: pickRandom(enterCams)?.id ?? null,
        exitCameraId: hasCheckOut ? (pickRandom(exitCams)?.id ?? null) : null,
      });
    }
  }

  const todayUsers = [...USERS]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.ceil(USERS.length * 0.7));

  for (const user of todayUsers) {
    const inHour = 8 + Math.floor(Math.random() * 2);
    const inMin = Math.floor(Math.random() * 60);
    const stillInside = Math.random() < 0.8;
    const outHour = 17 + Math.floor(Math.random() * 2);
    const outMin = Math.floor(Math.random() * 60);

    records.push({
      id: `r${idCounter++}`,
      userId: user.id,
      userName: userFullName(user),
      date: formatDate(today),
      checkIn: `${pad(inHour)}:${pad(inMin)}`,
      checkOut: stillInside ? null : `${pad(outHour)}:${pad(outMin)}`,
      enterCameraId: pickRandom(enterCams)?.id ?? null,
      exitCameraId: stillInside ? null : (pickRandom(exitCams)?.id ?? null),
    });
  }

  return records;
}

export const mockRecords: AttendanceRecord[] = generateRecords();

export function getRecordsForDate(date: Date): AttendanceRecord[] {
  const key = formatDate(date);
  return mockRecords.filter((r) => r.date === key);
}

export function hasRecordsOnDate(date: Date): boolean {
  const key = formatDate(date);
  return mockRecords.some((r) => r.date === key);
}

export function getRecordsForMonth(year: number, month: number): AttendanceRecord[] {
  const prefix = `${year}-${pad(month + 1)}-`;
  return mockRecords.filter((r) => r.date.startsWith(prefix));
}
