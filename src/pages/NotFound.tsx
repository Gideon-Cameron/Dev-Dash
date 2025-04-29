// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>

      <Link
        to="/dashboard"
        className="rounded bg-gray-800 px-6 py-3 text-white text-lg font-semibold hover:bg-gray-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
