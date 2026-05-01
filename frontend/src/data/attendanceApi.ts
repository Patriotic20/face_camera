import { api } from '../api/axios';
import type { AttendanceRecord } from '../types/attendance';

function parseDateTime(dt: string): { date: string; time: string } {
  const sep = dt.includes('T') ? 'T' : ' ';
  const [date, time = ''] = dt.split(sep);
  return { date, time: time.substring(0, 5) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRecord(raw: any): AttendanceRecord {
  const enter = parseDateTime(raw.enter_time);
  const exit = raw.exit_time ? parseDateTime(raw.exit_time) : null;
  return {
    id: String(raw.id),
    userId: String(raw.employee_id),
    userName: `${raw.employee?.last_name ?? ''} ${raw.employee?.first_name ?? ''}`.trim(),
    date: enter.date,
    checkIn: enter.time,
    checkOut: exit?.time ?? null,
    enterCameraId: String(raw.enter_camera_id),
    enterCameraName: raw.enter_camera?.name ?? null,
    exitCameraId: raw.exit_camera_id ? String(raw.exit_camera_id) : null,
    exitCameraName: raw.exit_camera?.name ?? null,
  };
}

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get('/attendance/list');
    return response.data.map(mapRecord);
  } catch (error) {
    console.error('Failed to fetch attendance records:', error);
    return [];
  }
}

export async function getAttendanceRecord(id: string): Promise<AttendanceRecord | null> {
  try {
    const response = await api.get(`/attendance/${id}`);
    return mapRecord(response.data);
  } catch (error) {
    console.error('Failed to fetch attendance record:', error);
    return null;
  }
}

export async function getAttendanceByPerson(personId: string): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get(`/attendance/employee/${personId}`);
    return response.data.map(mapRecord);
  } catch (error) {
    console.error('Failed to fetch attendance by person:', error);
    return [];
  }
}

export async function getAttendanceForDate(date: string): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get(`/attendance/date/${date}`);
    return response.data.map(mapRecord);
  } catch (error) {
    console.error('Failed to fetch attendance for date:', error);
    return [];
  }
}

export async function getAttendanceForMonth(year: number, month: number): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get(`/attendance/month/${year}/${month}`);
    return response.data.map(mapRecord);
  } catch (error) {
    console.error('Failed to fetch attendance for month:', error);
    return [];
  }
}
