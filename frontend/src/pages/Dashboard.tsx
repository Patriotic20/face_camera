import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ReactNode } from 'react';
import { useWorkStartTime } from '../hooks/useWorkStartTime';
import { USERS, userFullName } from '../data/users';
import {
  getTodayStats,
  getMonthStats,
  getLast7DaysCounts,
  getCameraStats,
} from '../utils/dashboardStats';

const MONTH_NAMES = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];

function formatToday(d: Date): string {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

type StripeColor = 'emerald' | 'indigo' | 'red' | 'slate' | 'violet' | 'amber';

const STRIPES: Record<StripeColor, string> = {
  emerald: 'bg-emerald-500',
  indigo: 'bg-indigo-500',
  red: 'bg-red-500',
  slate: 'bg-slate-400',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
};

const TINTED_BG: Record<StripeColor, string> = {
  emerald: 'bg-emerald-50',
  indigo: 'bg-indigo-50',
  red: 'bg-red-50',
  slate: 'bg-slate-50',
  violet: 'bg-violet-50',
  amber: 'bg-amber-50',
};

const VALUE_COLORS: Record<StripeColor, string> = {
  emerald: 'text-emerald-700',
  indigo: 'text-indigo-700',
  red: 'text-red-700',
  slate: 'text-slate-600',
  violet: 'text-violet-700',
  amber: 'text-amber-700',
};

function StatCard({
  label,
  value,
  stripe,
  hint,
  tinted,
}: {
  label: string;
  value: number | string;
  stripe: StripeColor;
  hint?: string;
  tinted?: boolean;
}) {
  return (
    <div className={`rounded-xl shadow-sm ring-1 ring-slate-200/60 p-5 overflow-hidden relative ${tinted ? TINTED_BG[stripe] : 'bg-white'}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${STRIPES[stripe]}`} />
      <div className="text-sm text-slate-500 mt-1">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${VALUE_COLORS[stripe]}`}>{value}</div>
      {hint && <div className="mt-1.5 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-5">
      <h2 className="font-semibold text-slate-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [workStart] = useWorkStartTime();

  const today = getTodayStats(workStart);
  const month = getMonthStats(workStart);
  const last7 = getLast7DaysCounts();
  const cameras = getCameraStats();

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Boshqaruv paneli</h1>
          <p className="text-slate-500 mt-1 text-sm">Tizim umumiy holati</p>
        </div>
        <div className="text-sm text-slate-400">
          {formatToday(new Date())} • Ish vaqti: <span className="font-mono text-slate-500">{workStart}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Hozir ishda"
          value={today.atWork}
          stripe="emerald"
          hint="Kirgan, hali chiqmagan"
        />
        <StatCard
          label="Bugun keldi"
          value={today.cameToday}
          stripe="indigo"
          hint={`${today.onTime} vaqtida + ${today.late} kech`}
        />
        <StatCard
          label="Kech keldi"
          value={today.late}
          stripe="red"
          hint="Bugun ish vaqtidan keyin"
        />
        <StatCard
          label="Kelmagan"
          value={today.absent}
          stripe="slate"
          hint="Bugun yozuvi yo'q"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Panel title="Oxirgi 7 kun davomati">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={last7} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: 13,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <Panel title="Bu oy ko'rsatkichlari">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Jami davomat</dt>
              <dd className="font-semibold text-slate-800">{month.totalRecords}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Jami kechikish</dt>
              <dd className="font-semibold text-red-600">{month.totalLate}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <dt className="text-slate-500">Eng punktual</dt>
              <dd className="font-medium text-emerald-700 text-right">
                {month.mostPunctual ? (
                  <>
                    {month.mostPunctual.name}
                    <span className="text-slate-400 ml-1 font-normal">
                      ({month.mostPunctual.count})
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Eng kech</dt>
              <dd className="font-medium text-red-700 text-right">
                {month.mostLate ? (
                  <>
                    {month.mostLate.name}
                    <span className="text-slate-400 ml-1 font-normal">
                      ({month.mostLate.count})
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title={`Bugun kech kelganlar (${today.lateRecords.length})`}>
          {today.lateRecords.length === 0 ? (
            <p className="text-sm text-slate-400">Bugun hech kim kech kelmagan</p>
          ) : (
            <ul className="space-y-2">
              {today.lateRecords.map(({ record, minutes }) => (
                <li
                  key={record.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-700">{record.userName}</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-xs">{record.checkIn}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                      {minutes} daqiqa kech
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`Bugun kelmaganlar (${today.absentUsers.length})`}>
          {today.absentUsers.length === 0 ? (
            <p className="text-sm text-slate-400">Hamma keldi</p>
          ) : (
            <ul className="space-y-2">
              {today.absentUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-700">{userFullName(u)}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs">
                    Kelmagan
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Jami xodim" value={USERS.length} stripe="violet" tinted />
        <StatCard label="Jami kamera" value={cameras.total} stripe="indigo" tinted />
        <StatCard label="Ulangan" value={cameras.connected} stripe="emerald" tinted />
        <StatCard label="Ulanmagan" value={cameras.disconnected} stripe="amber" tinted />
      </div>
    </section>
  );
}
