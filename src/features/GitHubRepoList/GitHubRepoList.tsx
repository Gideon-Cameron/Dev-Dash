// src/features/GitHubRepoList/GitHubRepoList.tsx
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

    const username = githubProfile?.uid;
    if (username) {
      fetchRepos(username);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-gray-500">Loading GitHub repositories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Recent GitHub Repositories</h2>
      <ul className="space-y-4">
        {repos.map((repo) => (
          <li key={repo.id} className="border-b pb-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-blue-600 hover:underline"
            >
              {repo.name}
            </a>
            {repo.description && <p className="text-gray-600">{repo.description}</p>}
            <div className="mt-1 text-sm text-gray-500">
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
