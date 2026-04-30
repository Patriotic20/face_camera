import { Link, Navigate, useParams } from 'react-router-dom';
import { getRecordsForDate, getRecordsForMonth } from '../data/mockAttendance';
import { getCamera } from '../data/camerasStorage';
import { useWorkStartTime } from '../hooks/useWorkStartTime';
import { calculateLateness } from '../utils/lateness';
import { exportToExcel } from '../utils/excelExport';

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

  if (!date) return <Navigate to="/attendance" replace />;

  const records = getRecordsForDate(date);
  const lateCount = records.filter(
    (r) => calculateLateness(r.checkIn, workStart).late,
  ).length;

  const handleExportDay = () => {
    void exportToExcel(records, workStart, `davomat-${dateParam}.xlsx`);
  };

  const handleExportMonth = () => {
    const monthRecords = getRecordsForMonth(date.getFullYear(), date.getMonth());
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    void exportToExcel(monthRecords, workStart, `davomat-${monthKey}.xlsx`);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          to="/attendance"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          ← Kalendarga qaytish
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {formatDateLabel(date)}
        </h1>
        <p className="text-gray-600">
          Jami: {records.length} ta yozuv
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

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="work-start" className="text-sm font-medium text-gray-700">
            Ish boshlanish vaqti:
          </label>
          <input
            id="work-start"
            type="time"
            value={workStart}
            onChange={(e) => setWorkStart(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1" />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportDay}
            disabled={records.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Kunlik Excel
          </button>
          <button
            type="button"
            onClick={handleExportMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Oylik Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Foydalanuvchi</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Kirish</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Kirish kamerasi</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Chiqish</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Chiqish kamerasi</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Holat</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                  Bu kuni davomat yozuvlari yo'q
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const lateness = calculateLateness(r.checkIn, workStart);
                const enterCam = getCamera(r.enterCameraId);
                const exitCam = getCamera(r.exitCameraId);
                return (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 text-sm text-gray-900">{r.userName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 tabular-nums">{r.checkIn}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {enterCam ? enterCam.name : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 tabular-nums">
                      {r.checkOut ?? <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {exitCam ? exitCam.name : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lateness.late
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
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
