// src/pages/Dashboard.tsx
const Dashboard = () => {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Developer Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here you’ll see your GitHub stats, productivity tools, and more.
        </p>
  
        {/* Placeholder for future dashboard widgets */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            📈 GitHub Stats coming soon...
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            🌦️ Weather Widget coming soon...
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            💬 Quote of the Day coming soon...
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  