import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="text-8xl font-black text-indigo-200 select-none">404</div>
      <p className="text-slate-500 text-base">Sahifa topilmadi</p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
