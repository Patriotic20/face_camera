export default function Users() {
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <p className="text-gray-600 mt-1">Tizim foydalanuvchilari ro'yxati</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          + Yangi foydalanuvchi
        </button>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ism</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Holat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500">
                Foydalanuvchilar topilmadi
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
