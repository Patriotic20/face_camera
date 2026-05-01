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
