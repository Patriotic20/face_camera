function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export type Lateness = {
  late: boolean;
  minutes: number;
  label: string;
};

export function calculateLateness(checkIn: string, workStart: string): Lateness {
  const diff = toMinutes(checkIn) - toMinutes(workStart);
  if (diff <= 0) return { late: false, minutes: 0, label: 'Vaqtida' };
  return { late: true, minutes: diff, label: `${diff} daqiqa kech` };
}
