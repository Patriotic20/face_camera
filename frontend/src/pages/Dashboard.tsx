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
import { USERS } from '../data/users';
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

type Tone = 'green' | 'blue' | 'red' | 'gray' | 'purple' | 'amber';

const TONES: Record<Tone, string> = {
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-50 text-purple-700',
  amber: 'bg-amber-50 text-amber-700',
};

function StatCard({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: number | string;
  tone: Tone;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`mt-2 inline-block px-3 py-1 rounded-lg text-2xl font-bold ${TONES[tone]}`}>
        {value}
      </div>
      {hint && <div className="mt-2 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
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
          <h1 className="text-3xl font-bold text-gray-900">Boshqaruv paneli</h1>
          <p className="text-gray-600 mt-1">Tizim umumiy holati</p>
        </div>
        <div className="text-sm text-gray-500">
          {formatToday(new Date())} • Ish vaqti: <span className="font-mono">{workStart}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Hozir ishda"
          value={today.atWork}
          tone="green"
          hint="Kirgan, hali chiqmagan"
        />
        <StatCard
          label="Bugun keldi"
          value={today.cameToday}
          tone="blue"
          hint={`${today.onTime} vaqtida + ${today.late} kech`}
        />
        <StatCard
          label="Kech keldi"
          value={today.late}
          tone="red"
          hint="Bugun ish vaqtidan keyin"
        />
        <StatCard
          label="Kelmagan"
          value={today.absent}
          tone="gray"
          hint="Bugun yozuvi yo'q"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Panel title="Oxirgi 7 kun davomati">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={last7} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <Panel title="Bu oy ko'rsatkichlari">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Jami davomat</dt>
              <dd className="font-semibold text-gray-900">{month.totalRecords}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Jami kechikish</dt>
              <dd className="font-semibold text-red-600">{month.totalLate}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <dt className="text-gray-500">Eng punktual</dt>
              <dd className="font-medium text-green-700 text-right">
                {month.mostPunctual ? (
                  <>
                    {month.mostPunctual.name}
                    <span className="text-gray-400 ml-1 font-normal">
                      ({month.mostPunctual.count})
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Eng kech</dt>
              <dd className="font-medium text-red-700 text-right">
                {month.mostLate ? (
                  <>
                    {month.mostLate.name}
                    <span className="text-gray-400 ml-1 font-normal">
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
            <p className="text-sm text-gray-500">Bugun hech kim kech kelmagan</p>
          ) : (
            <ul className="space-y-2">
              {today.lateRecords.map(({ record, minutes }) => (
                <li
                  key={record.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-900">{record.userName}</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-gray-400 font-mono text-xs">{record.checkIn}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
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
            <p className="text-sm text-gray-500">Hamma keldi 🎉</p>
          ) : (
            <ul className="space-y-2">
              {today.absentUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-900">{u.name}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    Kelmagan
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Jami xodim" value={USERS.length} tone="purple" />
        <StatCard label="Jami kamera" value={cameras.total} tone="blue" />
        <StatCard label="Ulangan" value={cameras.connected} tone="green" />
        <StatCard label="Ulanmagan" value={cameras.disconnected} tone="amber" />
      </div>
    </section>
  );
}
