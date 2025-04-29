// src/features/GitHubStats/GitHubStats.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

const GitHubStats = () => {
  const { user } = useAuth();
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [, setLoading] = useState(true);

  const fetchGitHubUser = async (username: string) => {
    try {
        const response = await axios.get<GitHubUser>(`https://api.github.com/users/${username}`);
        setGithubUser(response.data);
    } catch (error) {
      console.error('Failed to fetch GitHub user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const githubProfile = user.providerData.find(
        (provider) => provider.providerId === 'github.com'
      );
  
      if (githubProfile?.uid) {
        fetchGitHubUser(githubProfile.uid);
      }
    }
  }, [user]);
  

  if (!githubUser) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        GitHub stats not available.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={githubUser.avatar_url}
          alt="Avatar"
          className="h-16 w-16 rounded-full border-2 border-gray-300"
        />
        <div>
          <a
            href={githubUser.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-gray-800 hover:underline"
          >
            {githubUser.login}
          </a>
          <p className="text-gray-600">{githubUser.bio}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold">{githubUser.public_repos}</p>
          <p className="text-sm text-gray-500">Repos</p>
        </div>
        <div>
          <p className="text-lg font-bold">{githubUser.followers}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-lg font-bold">{githubUser.following}</p>
          <p className="text-sm text-gray-500">Following</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
