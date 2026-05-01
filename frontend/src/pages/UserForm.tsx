import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getEmployeeById, createEmployee, updateEmployeeById } from '../data/employeeApi';

type FormState = {
  firstName: string;
  lastName: string;
  thirdName: string;
  active: boolean;
};

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  thirdName: '',
  active: true,
};

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEmployeeById(id).then((employee) => {
      if (!employee) {
        setNotFound(true);
        return;
      }
      setForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        thirdName: employee.thirdName,
        active: employee.active,
      });
    });
  }, [id]);

  if (notFound) return <Navigate to="/users" replace />;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.lastName.trim()) return setError("Familiyani kiriting");
    if (!form.firstName.trim()) return setError("Ismni kiriting");

    if (isEdit && id) {
      await updateEmployeeById(id, form);
    } else {
      await createEmployee(form);
    }
    navigate('/users');
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          to="/users"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Foydalanuvchilarga qaytish
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">
          {isEdit ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-6 space-y-4 max-w-lg"
      >
        <Field label="Familiya">
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="Masalan: Aliyev"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </Field>

        <Field label="Ism">
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="Masalan: Akbar"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </Field>

        <Field label="Sharif (otasining ismi)">
          <input
            type="text"
            value={form.thirdName}
            onChange={(e) => update('thirdName', e.target.value)}
            placeholder="Masalan: Akbarovich"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </Field>

        <Field label="Holati">
          <select
            value={form.active ? 'active' : 'inactive'}
            onChange={(e) => update('active', e.target.value === 'active')}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
          </select>
        </Field>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            Saqlash
          </button>
          <Link
            to="/users"
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            Bekor qilish
          </Link>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
