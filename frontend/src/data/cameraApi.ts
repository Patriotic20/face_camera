import { api } from '../api/axios';
import type { Camera, CameraType } from '../types/camera';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCamera(raw: any): Camera {
  return {
    id: String(raw.id),
    name: raw.name,
    ip: raw.ip_address,
    login: raw.login,
    password: '',
    type: raw.type as CameraType,
    connected: raw.status === 'active',
  };
}

export async function getCameraList(): Promise<Camera[]> {
  try {
    const response = await api.get('/camera/list');
    return response.data.map(mapCamera);
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    return [];
  }
}

export async function getCameraById(id: string): Promise<Camera | null> {
  try {
    const response = await api.get(`/camera/${id}`);
    return mapCamera(response.data);
  } catch (error) {
    console.error('Failed to fetch camera:', error);
    return null;
  }
}

export async function createCamera(
  data: Omit<Camera, 'id' | 'connected'>,
): Promise<Camera | null> {
  try {
    const response = await api.post('/camera/add', {
      name: data.name,
      ip_address: data.ip,
      login: data.login,
      password: data.password,
      type: data.type,
    });
    return mapCamera(response.data);
  } catch (error) {
    console.error('Failed to create camera:', error);
    return null;
  }
}

export async function updateCameraById(
  id: string,
  data: Partial<Omit<Camera, 'id' | 'connected'>>,
): Promise<Camera | null> {
  try {
    const response = await api.put(`/camera/${id}/update`, {
      name: data.name,
      ip_address: data.ip,
      login: data.login,
      ...(data.password ? { password: data.password } : {}),
      type: data.type,
    });
    return mapCamera(response.data);
  } catch (error) {
    console.error('Failed to update camera:', error);
    return null;
  }
}

export async function deleteCameraById(id: string): Promise<boolean> {
  try {
    await api.delete(`/camera/${id}/delete`);
    return true;
  } catch (error) {
    console.error('Failed to delete camera:', error);
    return false;
  }
}
