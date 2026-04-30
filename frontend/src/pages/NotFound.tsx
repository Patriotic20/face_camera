import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="text-center space-y-4 py-16">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600">Page not found</p>
      <Link
        to="/"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go home
      </Link>
    </section>
  );
}
