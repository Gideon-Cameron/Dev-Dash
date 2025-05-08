import GitHubStats from '../features/GitHubStats/GitHubStats';
import GitHubRepoList from '../features/GitHubRepoList/GitHubRepoList';
import DevQuoteBox from '../features/DevQuoteBox/DevQuoteBox';
import PomodoroTimer from '../features/PomodoroTimer/PomodoroTimer';

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 text-gray-800 dark:text-gray-100 px-4 py-8 md:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Header Section — 70/30 split on md+ screens */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1 md:basis-[70%]">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Developer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Your personalized developer tools and stats are below.
          </p>
        </div>

        <div className="md:basis-[30%] w-full md:w-auto">
          <PomodoroTimer />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GitHubStats />
        <GitHubRepoList />
        <DevQuoteBox />
      </div>
    </div>
  );
};

export default Dashboard;
