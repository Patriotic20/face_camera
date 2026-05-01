import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAttendanceForDate, getAttendanceForMonth } from '../data/attendanceApi';
import { useWorkStartTime } from '../hooks/useWorkStartTime';
import { calculateLateness } from '../utils/lateness';
import { exportToExcel } from '../utils/excelExport';
import type { AttendanceRecord } from '../types/attendance';

const MONTH_NAMES = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(s: string): Date | null {
  if (!DATE_RE.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function formatDateLabel(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export default function AttendanceDay() {
  const { date: dateParam } = useParams<{ date: string }>();
  const date = dateParam ? parseDate(dateParam) : null;

  const [workStart, setWorkStart] = useWorkStartTime();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;

    const fetchRecords = async () => {
      setLoading(true);
      try {
        const data = await getAttendanceForDate(dateParam!);
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch attendance records:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [dateParam, date]);

  if (!date) return <Navigate to="/attendance" replace />;

  const lateCount = records.filter(
    (r) => calculateLateness(r.checkIn, workStart).late,
  ).length;

  const handleExportDay = () => {
    void exportToExcel(records, workStart, `davomat-${dateParam}.xlsx`);
  };

  const handleExportMonth = () => {
    const fetchMonthRecords = async () => {
      try {
        const monthRecords = await getAttendanceForMonth(date.getFullYear(), date.getMonth());
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        void exportToExcel(monthRecords, workStart, `davomat-${monthKey}.xlsx`);
      } catch (error) {
        console.error('Failed to fetch month records for export:', error);
      }
    };
    fetchMonthRecords();
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          to="/attendance"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kalendarga qaytish
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">
          {formatDateLabel(date)}
        </h1>
        <p className="text-slate-500 text-sm">
          Jami: <span className="font-medium text-slate-700">{records.length}</span> ta yozuv
          {lateCount > 0 && (
            <>
              {' • '}
              <span className="text-red-600 font-medium">
                {lateCount} ta kech
              </span>
            </>
          )}
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2.5">
          <label htmlFor="work-start" className="text-sm font-medium text-slate-600">
            Ish boshlanish vaqti:
          </label>
          <input
            id="work-start"
            type="time"
            value={workStart}
            onChange={(e) => setWorkStart(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex-1" />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportDay}
            disabled={records.length === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Kunlik Excel
          </button>
          <button
            type="button"
            onClick={handleExportMonth}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Oylik Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Foydalanuvchi</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Kirish</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Kirish kamerasi</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Chiqish</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Chiqish kamerasi</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Holat</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                  Bu kuni davomat yozuvlari yo'q
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const lateness = calculateLateness(r.checkIn, workStart);
                return (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.userName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 tabular-nums font-mono">{r.checkIn}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {r.enterCameraName ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 tabular-nums font-mono">
                      {r.checkOut ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {r.exitCameraName ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                          lateness.late
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {lateness.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
