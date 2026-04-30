import { useState } from 'react';

const KEY = 'workStartTime';
const DEFAULT = '09:00';

export function useWorkStartTime(): [string, (t: string) => void] {
  const [time, setTime] = useState<string>(
    () => localStorage.getItem(KEY) ?? DEFAULT,
  );

  const update = (t: string) => {
    localStorage.setItem(KEY, t);
    setTime(t);
  };

  return [time, update];
}
