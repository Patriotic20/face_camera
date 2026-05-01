import { api } from '../api/axios';
import type { AttendanceRecord } from '../types/attendance';

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get('/attendance/list');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch attendance records:', error);
    return [];
  }
}

export async function getAttendanceRecord(id: string): Promise<AttendanceRecord | null> {
  try {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch attendance record:', error);
    return null;
  }
}

export async function getAttendanceByPerson(personId: string): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get(`/attendance/person/${personId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch attendance by person:', error);
    return [];
  }
}

export async function getAttendanceForDate(date: string): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get(`/attendance/date/${date}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch attendance for date:', error);
    return [];
  }
}

export async function getAttendanceForMonth(year: number, month: number): Promise<AttendanceRecord[]> {
  try {
    const response = await api.get(`/attendance/month/${year}/${month}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch attendance for month:', error);
    return [];
  }
}