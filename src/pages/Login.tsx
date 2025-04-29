// src/pages/Login.tsx
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { signIn, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Welcome to DevDash 🚀</h1>
        <p className="mb-8 text-center text-gray-500">
          Sign in with your GitHub account to personalize your dashboard
        </p>

        <button
          onClick={signIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded bg-gray-800 px-6 py-3 text-lg font-semibold text-white hover:bg-gray-700 transition"
        >
          {isLoading ? 'Signing In...' : 'Sign in with GitHub'}
        </button>
      </div>
    </div>
  );
};

export default Login;
