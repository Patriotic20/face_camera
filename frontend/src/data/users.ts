export type User = {
  id: string;
  firstName: string;
  lastName: string;
  thirdName: string;
  active: boolean;
};

export function userFullName(u: User): string {
  return [u.lastName, u.firstName, u.thirdName].filter(Boolean).join(' ');
}

export const USERS: User[] = [
  { id: 'u1', firstName: 'Akbar',   lastName: 'Aliyev',   thirdName: 'Akbarovich',   active: true },
  { id: 'u2', firstName: 'Madina',  lastName: 'Karimova', thirdName: 'Bahodirovna',  active: true },
  { id: 'u3', firstName: 'Sherzod', lastName: 'Rashidov', thirdName: 'Hamidovich',   active: true },
  { id: 'u4', firstName: 'Zarina',  lastName: 'Yusupova', thirdName: 'Ilyosovna',    active: true },
  { id: 'u5', firstName: 'Bobur',   lastName: 'Tursunov', thirdName: 'Davlatovich',  active: true },
  { id: 'u6', firstName: 'Dilnoza', lastName: 'Nazarova', thirdName: 'Sanjarovna',   active: true },
  { id: 'u7', firstName: 'Otabek',  lastName: 'Ergashev', thirdName: 'Murodovich',   active: false },
];
