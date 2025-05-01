import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link
        to="/dashboard"
        className="rounded bg-gray-800 dark:bg-blue-600 px-6 py-3 text-white text-lg font-semibold hover:bg-gray-700 dark:hover:bg-blue-500 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
