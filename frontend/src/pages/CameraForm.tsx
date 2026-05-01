import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getCameraById, createCamera, updateCameraById } from '../data/cameraApi';
import type { CameraType } from '../types/camera';

const IPV4_RE = /^((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(25[0-5]|2[0-4]\d|[01]?\d?\d)$/;

type FormState = {
  name: string;
  ip: string;
  login: string;
  password: string;
  type: CameraType;
};

const EMPTY: FormState = {
  name: '',
  ip: '',
  login: '',
  password: '',
  type: 'enter',
};

export default function CameraForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCameraById(id).then((cam) => {
      if (!cam) {
        setNotFound(true);
        return;
      }
      setForm({
        name: cam.name,
        ip: cam.ip,
        login: cam.login,
        password: '',
        type: cam.type,
      });
    });
  }, [id]);

  if (notFound) return <Navigate to="/cameras" replace />;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Nomni kiriting");
    if (!IPV4_RE.test(form.ip)) return setError("To'g'ri IP adresni kiriting (masalan, 192.168.1.100)");
    if (!form.login.trim()) return setError("Loginni kiriting");
    if (!isEdit && !form.password) return setError("Parolni kiriting");

    if (isEdit && id) {
      await updateCameraById(id, form);
    } else {
      await createCamera(form);
    }
    navigate('/cameras');
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          to="/cameras"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kameralarga qaytish
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">
          {isEdit ? 'Kamerani tahrirlash' : 'Yangi kamera'}
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-6 space-y-4 max-w-lg"
      >
        <Field label="Nom">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Masalan: Asosiy kirish"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </Field>

        <Field label="IP adres">
          <input
            type="text"
            value={form.ip}
            onChange={(e) => update('ip', e.target.value)}
            placeholder="192.168.1.100"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Login">
            <input
              type="text"
              value={form.login}
              onChange={(e) => update('login', e.target.value)}
              autoComplete="off"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </Field>

          <Field label={isEdit ? 'Yangi parol (ixtiyoriy)' : 'Parol'}>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="new-password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </Field>
        </div>

        <Field label="Tip">
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value as CameraType)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="enter">Kirish</option>
            <option value="exit">Chiqish</option>
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
            to="/cameras"
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
