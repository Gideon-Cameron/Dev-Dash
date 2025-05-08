import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { signIn, isLoading } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 overflow-hidden">
      {/* Abstract SVG background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
      >
        <svg
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="80" fill="url(#gradient)" />
          <circle cx="20" cy="80" r="50" fill="url(#gradient)" opacity="0.4" />
          <circle cx="90" cy="10" r="30" fill="url(#gradient)" opacity="0.3" />
        </svg>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md p-8 shadow-xl ring-1 ring-white/10 transition-colors duration-300">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome to DevDash 🚀
        </h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
          Sign in with your GitHub account to personalize your dashboard
        </p>

        <button
          onClick={signIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded bg-gray-800 px-6 py-3 text-lg font-semibold text-white hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition"
        >
          {isLoading ? 'Signing In...' : 'Sign in with GitHub'}
        </button>
      </div>
    </div>
  );
};

export default Login;
