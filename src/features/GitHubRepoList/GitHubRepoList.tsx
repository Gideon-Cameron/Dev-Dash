import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
}

const GitHubRepoList = () => {
  const { user } = useAuth();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async (username: string) => {
    try {
      const response = await axios.get<GitHubRepo[]>(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
      );
      setRepos(response.data);
    } catch (err) {
      setError('Could not fetch repositories.');
      console.error('GitHub Repo Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const githubProfile = user?.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );

    let username = githubProfile?.displayName?.trim();
    if (username && username.includes(' ')) {
      username = username.replace(/\s+/g, '-');
    }

    if (username) {
      fetchRepos(username);
    } else {
      setError('GitHub username not found.');
      setLoading(false);
    }
  }, [user]);

  // ✅ Skeleton loader
  if (loading) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300 animate-pulse space-y-4">
        <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <div className="border-b border-gray-200 dark:border-gray-700 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  // ❌ Real error
  if (error) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ✅ Loaded state
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
        Recent GitHub Repositories
      </h2>
      <ul className="space-y-4">
        {repos.map((repo) => (
          <li key={repo.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {repo.name}
            </a>
            {repo.description && (
              <p className="text-gray-600 dark:text-gray-300">{repo.description}</p>
            )}
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {repo.language && <span>{repo.language}</span>}
              {repo.stargazers_count > 0 && (
                <span className="ml-4">⭐ {repo.stargazers_count}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GitHubRepoList;
