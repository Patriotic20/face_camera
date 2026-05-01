import { api } from '../api/axios';
import type { User } from './users';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEmployee(raw: any): User {
  return {
    id: String(raw.id),
    firstName: raw.first_name,
    lastName: raw.last_name,
    thirdName: raw.third_name ?? '',
    active: raw.in_work,
  };
}

export async function getEmployees(): Promise<User[]> {
  try {
    const response = await api.get('/employee/list');
    return response.data.map(mapEmployee);
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    return [];
  }
}

export async function getEmployeeById(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/employee/${id}`);
    return mapEmployee(response.data);
  } catch (error) {
    console.error('Failed to fetch employee:', error);
    return null;
  }
}

export async function createEmployee(data: Omit<User, 'id'>): Promise<User | null> {
  try {
    const response = await api.post('/employee/add', {
      first_name: data.firstName,
      last_name: data.lastName,
      third_name: data.thirdName || null,
      in_work: data.active,
    });
    return mapEmployee(response.data);
  } catch (error) {
    console.error('Failed to create employee:', error);
    return null;
  }
}

export async function updateEmployeeById(
  id: string,
  data: Partial<Omit<User, 'id'>>,
): Promise<User | null> {
  try {
    const response = await api.put(`/employee/${id}/update`, {
      first_name: data.firstName,
      last_name: data.lastName,
      third_name: data.thirdName ?? null,
      in_work: data.active,
    });
    return mapEmployee(response.data);
  } catch (error) {
    console.error('Failed to update employee:', error);
    return null;
  }
}

export async function deleteEmployeeById(id: string): Promise<boolean> {
  try {
    await api.delete(`/employee/${id}/delete`);
    return true;
  } catch (error) {
    console.error('Failed to delete employee:', error);
    return false;
  }
}
