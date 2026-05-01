import { useNavigate } from 'react-router-dom';
import { calculateLateness } from '../../utils/lateness';
import type { AttendanceRecord } from '../../types/attendance';

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

const MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

const pad = (n: number) => String(n).padStart(2, '0');

type Props = {
  year: number;
  month: number;
  userId: string;
  workStart: string;
  records: AttendanceRecord[];
};

type DayInfo = {
  status: 'late' | 'ontime';
  checkIn: string;
  checkOut: string | null;
};

export default function UserMonthGrid({ year, month, userId, workStart, records }: Props) {
  const navigate = useNavigate();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const jsWeekday = firstDay.getDay();
  const offset = jsWeekday === 0 ? 6 : jsWeekday - 1;

  const today = new Date();
  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d;

  const isWeekend = (d: number) => {
    const dow = new Date(year, month, d).getDay();
    return dow === 0 || dow === 6;
  };

  const prefix = `${year}-${pad(month + 1)}-`;
  const userRecords = records.filter(
    (r) => r.userId === userId && r.date.startsWith(prefix),
  );

  const dayInfo = new Map<number, DayInfo>();
  for (const r of userRecords) {
    const day = parseInt(r.date.split('-')[2], 10);
    const lateness = calculateLateness(r.checkIn, workStart);
    dayInfo.set(day, {
      status: lateness.late ? 'late' : 'ontime',
      checkIn: r.checkIn,
      checkOut: r.checkOut,
    });
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleDayClick = (day: number) => {
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    navigate(`/attendance/${key}`);
  };

  return (
    <div>
      <h3 className="text-center text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
        {MONTH_NAMES[month]}
      </h3>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-slate-400 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 font-medium">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e${idx}`} className="pt-1 pb-2" />;

          const info = dayInfo.get(day);
          const todayRing = isToday(day) ? 'ring-2 ring-indigo-500' : '';
          const weekend = isWeekend(day);

          let cellColors: string;
          if (info?.status === 'ontime') {
            cellColors = 'bg-emerald-100 text-emerald-700 font-semibold hover:bg-emerald-200';
          } else if (info?.status === 'late') {
            cellColors = 'bg-red-100 text-red-700 font-semibold hover:bg-red-200';
          } else if (weekend) {
            cellColors = 'text-slate-400 hover:bg-slate-100';
          } else {
            cellColors = 'text-slate-600 hover:bg-slate-100';
          }

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`pt-1 pb-1.5 rounded-md cursor-pointer transition-colors leading-tight ${cellColors} ${todayRing}`}
            >
              <span className="block">{day}</span>
              {info ? (
                <>
                  <span className="block text-[9px] font-mono mt-0.5 opacity-90">
                    {info.checkIn}
                  </span>
                  <span className="block text-[9px] font-mono text-slate-400">
                    {info.checkOut ?? '—'}
                  </span>
                </>
              ) : (
                <span className="block text-[9px] opacity-0">{'00:00'}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
