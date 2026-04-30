import { useState } from 'react';
import YearCalendar from '../components/attendance/YearCalendar';

export default function Attendance() {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Davomat</h1>
          <p className="text-gray-600 mt-1">Kunni tanlab, davomat yozuvlarini ko'ring</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setYear((y) => y - 1)}
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Oldingi yil"
          >
            &lt;
          </button>
          <span className="px-4 font-semibold text-gray-900 tabular-nums">{year}</span>
          <button
            type="button"
            onClick={() => setYear((y) => y + 1)}
            className="px-3 py-1.5 rounded hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Keyingi yil"
          >
            &gt;
          </button>
        </div>
      </header>

      <YearCalendar year={year} />
    </section>
  );
}
