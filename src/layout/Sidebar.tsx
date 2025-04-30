// src/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pomodoro History', path: '/pomodoro-history' },
    { name: 'Settings', path: '/settings' }, // Placeholder
  ];

  return (
    <aside className="hidden h-full w-64 flex-col bg-gray-900 p-6 text-gray-100 md:flex">
      <h2 className="mb-10 text-2xl font-bold">DevDash</h2>

      <nav className="flex flex-1 flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`rounded px-3 py-2 text-lg transition ${
              location.pathname === item.path
                ? 'bg-gray-700'
                : 'hover:bg-gray-800'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={signOut}
        className="mt-10 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500 transition"
      >
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
