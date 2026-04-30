import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../data/usersStorage';
import { userFullName, type User } from '../data/users';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(() => getUsers());

  const refresh = () => setUsers(getUsers());

  const handleDelete = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    const ok = window.confirm(
      `"${userFullName(user)}" foydalanuvchisini o'chirishni xohlaysizmi?`,
    );
    if (!ok) return;
    deleteUser(user.id);
    refresh();
  };

  const handleEdit = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    navigate(`/users/${user.id}/edit`);
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Foydalanuvchilar</h1>
          <p className="text-slate-500 mt-1 text-sm">Tizim foydalanuvchilari ro'yxati</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/users/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
        >
          + Yangi foydalanuvchi
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Familiya</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ism</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sharif</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Holati</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-sm text-slate-400">Foydalanuvchilar topilmadi</span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{user.lastName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{user.firstName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{user.thirdName || <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                        user.active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {user.active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleEdit(e, user)}
                        title="Tahrirlash"
                        aria-label="Tahrirlash"
                        className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, user)}
                        title="O'chirish"
                        aria-label="O'chirish"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
