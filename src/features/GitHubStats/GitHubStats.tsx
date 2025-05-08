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

interface GitHubRepo {
  stargazers_count: number;
}

const GitHubStats = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [stars, setStars] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const githubProfile = user.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );

    let username = githubProfile?.displayName?.trim();
    if (username?.includes(' ')) {
      username = username.replace(/\s+/g, '-');
    }

    if (username) {
      axios
        .get<GitHubProfile>(`https://api.github.com/users/${username}`)
        .then((res) => setProfile(res.data))
        .catch((err) => {
          console.error('GitHub profile fetch failed:', err);
          setError('Could not load GitHub profile.');
        });

      axios
        .get<GitHubRepo[]>(`https://api.github.com/users/${username}/repos?per_page=100`)
        .then((res) => {
          const totalStars = res.data.reduce((sum, repo) => sum + repo.stargazers_count, 0);
          setStars(totalStars);
        })
        .catch((err) => {
          console.error('Repo star count fetch failed:', err);
          setError('Could not load repository stats.');
        });
    }
  }, [user]);

  const getRank = (stars: number): string => {
    if (stars >= 100) return 'A+';
    if (stars >= 50) return 'A';
    if (stars >= 20) return 'B';
    if (stars >= 5) return 'C';
    return 'D';
  };

  // ✅ Skeleton Loading State
  if (!user || (!profile && !error)) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700 animate-pulse space-y-4 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <div className="h-4 w-8 mx-auto bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-12 mx-auto bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ⚠️ Real error state
  if (error) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ✅ Final loaded state — safe to use `profile!`
  const rank = getRank(stars);
  const { avatar_url, html_url, login, public_repos, followers, following } = profile!;

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <img
          src={avatar_url}
          alt="Avatar"
          className="h-16 w-16 rounded-full border-2 border-gray-300 dark:border-gray-600"
        />
        <div>
          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:underline"
          >
            {login}
          </a>
          {/* <p className="text-gray-600 dark:text-gray-400">
            {user.email || 'No public email'}
          </p> */}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{public_repos}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Repos</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{followers}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{following}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-left">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Stars</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{stars}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dev Rank</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{rank}</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
