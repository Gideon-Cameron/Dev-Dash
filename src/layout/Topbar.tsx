import { useAuth } from '../hooks/useAuth';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900 px-6 py-4 shadow-sm dark:shadow-md transition-colors duration-300">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>

      <div className="flex items-center gap-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 dark:bg-gray-700 text-white">
            {user?.displayName?.charAt(0) ?? 'U'}
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
