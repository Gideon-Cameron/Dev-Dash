// src/features/GitHubStats/GitHubStats.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

const GitHubStats = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const githubProfile = user?.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );

    let username = githubProfile?.displayName?.trim();

    if (username?.includes(' ')) {
      username = username.replace(/\s+/g, '-'); // fallback fix
    }

    if (username) {
      axios
        .get<GitHubProfile>(`https://api.github.com/users/${username}`)
        .then((res) => setProfile(res.data))
        .catch((err) => {
          console.error('GitHub profile fetch failed:', err);
          setError('Could not load GitHub stats.');
        });
    }
  }, [user]);

  if (error || !profile) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-red-500">{error || 'GitHub stats not available.'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar_url}
          alt="Avatar"
          className="h-16 w-16 rounded-full border-2 border-gray-300"
        />
        <div>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-gray-800 hover:underline"
          >
            {profile.login}
          </a>
          <p className="text-gray-600">{user.email || 'No public email'}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold">{profile.public_repos}</p>
          <p className="text-sm text-gray-500">Repos</p>
        </div>
        <div>
          <p className="text-lg font-bold">{profile.followers}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-lg font-bold">{profile.following}</p>
          <p className="text-sm text-gray-500">Following</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
