import type { Camera } from '../types/camera';

const KEY = 'cameras';

function read(): Camera[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as Camera[];
  } catch {
    return [];
  }
}

function write(cameras: Camera[]): void {
  localStorage.setItem(KEY, JSON.stringify(cameras));
}

export function getCameras(): Camera[] {
  return read();
}

export function getCamera(id: string | null): Camera | undefined {
  if (!id) return undefined;
  return read().find((c) => c.id === id);
}

export function addCamera(camera: Omit<Camera, 'id'>): Camera {
  const list = read();
  const newCamera: Camera = {
    ...camera,
    id: `cam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  write([...list, newCamera]);
  return newCamera;
}

export function updateCamera(id: string, patch: Partial<Omit<Camera, 'id'>>): void {
  const list = read();
  write(list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
}

export function deleteCamera(id: string): void {
  const list = read();
  write(list.filter((c) => c.id !== id));
}
