import { useState } from 'react';
import YearCalendar from '../components/attendance/YearCalendar';

export default function Attendance() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Davomat</h1>
          <p className="text-slate-500 mt-1 text-sm">Kunni tanlab, davomat yozuvlarini ko'ring</p>
        </div>

        <div className="flex items-center gap-1 bg-white ring-1 ring-slate-200/60 shadow-sm rounded-lg p-1">
          <button
            type="button"
            onClick={() => setYear((y) => y - 1)}
            className="px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors text-sm"
            aria-label="Oldingi yil"
          >
            &lt;
          </button>
          <span className="px-4 font-semibold text-slate-800 tabular-nums text-sm">{year}</span>
          <button
            type="button"
            onClick={() => setYear((y) => y + 1)}
            className="px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors text-sm"
            aria-label="Keyingi yil"
          >
            &gt;
          </button>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-6">
        <YearCalendar year={year} />
      </div>
    </section>
  );
}
