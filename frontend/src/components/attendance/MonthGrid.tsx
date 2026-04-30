import { useNavigate } from 'react-router-dom';
import { hasRecordsOnDate } from '../../data/mockAttendance';

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

const MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

const pad = (n: number) => String(n).padStart(2, '0');

type Props = {
  year: number;
  month: number;
};

export default function MonthGrid({ year, month }: Props) {
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
          <div key={w} className="py-1 font-medium">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`e${idx}`} className="py-1.5" />;
          }

          const date = new Date(year, month, day);
          const has = hasRecordsOnDate(date);
          const today_ = isToday(day);
          const weekend = isWeekend(day);

          const base = 'relative py-1.5 rounded-md cursor-pointer transition-colors';
          const colors = has
            ? 'bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200'
            : weekend
            ? 'text-slate-400 hover:bg-slate-100'
            : 'text-slate-600 hover:bg-slate-100';
          const ring = today_ ? 'ring-2 ring-indigo-500' : '';

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`${base} ${colors} ${ring}`}
            >
              {day}
              {has && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
