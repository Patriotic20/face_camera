import type { User } from './users';

const KEY = 'users';

function read(): User[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

function write(users: User[]): void {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function getUsers(): User[] {
  return read();
}

export function getUser(id: string): User | undefined {
  return read().find((u) => u.id === id);
}

export function addUser(user: Omit<User, 'id'>): User {
  const list = read();
  const newUser: User = {
    ...user,
    id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  write([...list, newUser]);
  return newUser;
}

export function updateUser(id: string, patch: Partial<Omit<User, 'id'>>): void {
  const list = read();
  write(list.map((u) => (u.id === id ? { ...u, ...patch } : u)));
}

export function deleteUser(id: string): void {
  const list = read();
  write(list.filter((u) => u.id !== id));
}
