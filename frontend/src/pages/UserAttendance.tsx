import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getUser } from '../data/usersStorage';
import { userFullName } from '../data/users';
import { mockRecords } from '../data/mockAttendance';
import { useWorkStartTime } from '../hooks/useWorkStartTime';
import { calculateLateness } from '../utils/lateness';
import UserMonthGrid from '../components/attendance/UserMonthGrid';

export default function UserAttendance() {
  const { id } = useParams<{ id: string }>();
  const [workStart] = useWorkStartTime();
  const [year, setYear] = useState(new Date().getFullYear());

  if (!id) return <Navigate to="/users" replace />;

  const user = getUser(id);
  if (!user) return <Navigate to="/users" replace />;

  const userRecords = mockRecords.filter((r) => r.userId === id);
  const lateCount = userRecords.filter(
    (r) => calculateLateness(r.checkIn, workStart).late,
  ).length;

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <Link
            to="/users"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Foydalanuvchilarga qaytish
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-800">{userFullName(user)}</h1>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                user.active
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {user.active ? 'Faol' : 'Nofaol'}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Jami: <span className="font-medium text-slate-700">{userRecords.length}</span> ta yozuv
            {lateCount > 0 && (
              <>
                {' • '}
                <span className="text-red-600 font-medium">{lateCount} ta kech</span>
              </>
            )}
          </p>
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

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-100 ring-1 ring-emerald-300 inline-block" />
          Vaqtida
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-100 ring-1 ring-red-300 inline-block" />
          Kech
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-white ring-1 ring-slate-200 inline-block" />
          Kelmagan
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, m) => (
            <UserMonthGrid
              key={m}
              year={year}
              month={m}
              userId={id}
              workStart={workStart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
