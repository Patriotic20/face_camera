import type { Camera } from '../types/camera';

const KEY = 'cameras';

const DEFAULT_CAMERAS: Camera[] = [
  {
    id: 'cam-1',
    name: 'Asosiy kirish',
    ip: '192.168.1.101',
    login: 'admin',
    password: 'admin123',
    type: 'enter',
    connected: true,
  },
  {
    id: 'cam-2',
    name: "Yon eshik kirish",
    ip: '192.168.1.102',
    login: 'admin',
    password: 'admin123',
    type: 'enter',
    connected: false,
  },
  {
    id: 'cam-3',
    name: 'Asosiy chiqish',
    ip: '192.168.1.201',
    login: 'admin',
    password: 'admin123',
    type: 'exit',
    connected: true,
  },
  {
    id: 'cam-4',
    name: "Yon eshik chiqish",
    ip: '192.168.1.202',
    login: 'admin',
    password: 'admin123',
    type: 'exit',
    connected: true,
  },
];

function read(): Camera[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_CAMERAS));
    return DEFAULT_CAMERAS;
  }
  try {
    return JSON.parse(raw) as Camera[];
  } catch {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_CAMERAS));
    return DEFAULT_CAMERAS;
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

export function addCamera(camera: Omit<Camera, 'id' | 'connected'>): Camera {
  const list = read();
  const newCamera: Camera = {
    ...camera,
    id: `cam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    connected: Math.random() > 0.3,
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
