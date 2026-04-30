import { Link } from 'react-router-dom';
import { useCameras } from '../hooks/useCameras';
import { deleteCamera } from '../data/camerasStorage';
import type { Camera } from '../types/camera';

const TYPE_LABEL: Record<Camera['type'], string> = {
  enter: 'Kirish',
  exit: 'Chiqish',
};

const TYPE_BADGE: Record<Camera['type'], string> = {
  enter: 'bg-green-100 text-green-700',
  exit: 'bg-blue-100 text-blue-700',
};

export default function Cameras() {
  const { cameras, refresh } = useCameras();

  const handleDelete = (cam: Camera) => {
    const ok = window.confirm(`"${cam.name}" kamerasini o'chirishni xohlaysizmi?`);
    if (!ok) return;
    deleteCamera(cam.id);
    refresh();
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kameralar</h1>
          <p className="text-gray-600 mt-1">
            Kirish va chiqish kameralarini boshqaring
          </p>
        </div>
        <Link
          to="/cameras/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Yangi kamera
        </Link>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Nom</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">IP adres</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Tip</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Holat</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {cameras.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">
                  Kameralar yo'q. Birinchi kamerani qo'shing.
                </td>
              </tr>
            ) : (
              cameras.map((cam) => (
                <tr key={cam.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{cam.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 tabular-nums font-mono">{cam.ip}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[cam.type]}`}>
                      {TYPE_LABEL[cam.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          cam.connected ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className={cam.connected ? 'text-green-700' : 'text-gray-500'}>
                        {cam.connected ? 'Ulangan' : 'Ulanmagan'}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        to={`/cameras/${cam.id}/edit`}
                        title="Tahrirlash"
                        aria-label="Tahrirlash"
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(cam)}
                        title="O'chirish"
                        aria-label="O'chirish"
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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
