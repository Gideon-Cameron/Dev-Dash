// src/features/GitHubStats/GitHubStats.tsx
import { useAuth } from '../../hooks/useAuth';

const GitHubStats = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        GitHub stats not available.
      </div>
    );
  }

  const githubProfile = user.providerData.find(
    (provider) => provider.providerId === 'github.com'
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={githubProfile?.photoURL || user.photoURL || ''}
          alt="Avatar"
          className="h-16 w-16 rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {githubProfile?.displayName || user.displayName || 'Unknown User'}
          </h2>
          <p className="text-gray-600">{user.email || 'No public email'}</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
