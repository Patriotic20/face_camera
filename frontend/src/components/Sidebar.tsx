import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

type MenuItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AttendanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const menu: MenuItem[] = [
  { to: '/', label: 'Boshqaruv paneli', icon: <DashboardIcon />, end: true },
  { to: '/users', label: 'Foydalanuvchilar', icon: <UsersIcon /> },
  { to: '/attendance', label: 'Davomat', icon: <AttendanceIcon /> },
  { to: '/cameras', label: 'Kameralar', icon: <CameraIcon /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-900 flex flex-col">
      <div className="px-5 py-5 flex items-center gap-3">
        <LogoIcon />
        <div>
          <div className="text-white font-bold text-base leading-tight">FaceCAM</div>
          <div className="text-slate-400 text-xs">Nazorat tizimi</div>
        </div>
      </div>

      <div className="px-4 mb-2">
        <div className="h-px bg-slate-800" />
      </div>

      <div className="px-4 mb-2 mt-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menyu</span>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-2 border-indigo-400 bg-indigo-500/10 text-indigo-300 pl-[10px]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mb-1">
        <div className="h-px bg-slate-800" />
      </div>
      <div className="px-5 py-4 text-xs text-slate-600">
        © {new Date().getFullYear()} FaceCAM
      </div>
    </aside>
  );
}
