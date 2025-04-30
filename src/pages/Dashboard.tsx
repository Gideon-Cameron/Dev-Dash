import GitHubStats from '../features/GitHubStats/GitHubStats';
import GitHubRepoList from '../features/GitHubRepoList/GitHubRepoList';
import DevQuoteBox from '../features/DevQuoteBox/DevQuoteBox';
import PomodoroTimer from '../features/PomodoroTimer/PomodoroTimer';

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Developer Dashboard</h1>
      <p className="text-gray-600">
        Welcome back! Your personalized developer tools and stats are below.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GitHubStats />
        <GitHubRepoList />
        <DevQuoteBox />
        <PomodoroTimer />
      </div>
    </div>
  );
};

export default Dashboard;
