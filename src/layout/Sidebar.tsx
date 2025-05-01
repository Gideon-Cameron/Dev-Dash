import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pomodoro History', path: '/pomodoro-history' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden h-full w-64 flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 p-6 md:flex shadow-md dark:shadow-lg transition-colors duration-300">
      <h2 className="mb-10 text-2xl font-bold">DevDash</h2>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`rounded px-3 py-2 text-md font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={signOut}
        className="mt-10 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500 transition-colors duration-200"
      >
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
